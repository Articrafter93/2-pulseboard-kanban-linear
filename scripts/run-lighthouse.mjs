import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const date = new Date().toISOString().slice(0, 10);
const targetUrl = process.env.LIGHTHOUSE_TARGET_URL ?? "https://pulseboard-kanban-linear.vercel.app";
const outPrefix = path.resolve("artifacts", "lighthouse", `production-${date}`);
const reportJsonPath = `${outPrefix}.report.json`;
const reportHtmlPath = `${outPrefix}.report.html`;
const summaryPath = `${outPrefix}.report.summary.json`;
const lighthouseCliPath = path.resolve("node_modules", "lighthouse", "cli", "index.js");

const thresholds = {
  performance: 85,
  accessibility: 90,
  bestPractices: 90,
  seo: 90,
};

mkdirSync(path.dirname(outPrefix), { recursive: true });

function toPercent(rawScore) {
  if (typeof rawScore !== "number") {
    return 0;
  }

  return Math.round(rawScore * 100);
}

function extractScores(lighthouseLike) {
  const categories = lighthouseLike?.categories ?? {};
  return {
    performance: toPercent(categories?.performance?.score),
    accessibility: toPercent(categories?.accessibility?.score),
    bestPractices: toPercent(categories?.["best-practices"]?.score),
    seo: toPercent(categories?.seo?.score),
  };
}

function isThresholdPass(scores) {
  return (
    scores.performance >= thresholds.performance &&
    scores.accessibility >= thresholds.accessibility &&
    scores.bestPractices >= thresholds.bestPractices &&
    scores.seo >= thresholds.seo
  );
}

function writeSummary({ status, mode, scores, error }) {
  const payload = {
    status,
    mode,
    targetUrl,
    generatedAt: new Date().toISOString(),
    thresholds,
    scores: scores ?? null,
    pass: scores ? isThresholdPass(scores) : false,
    error: error ?? null,
  };

  writeFileSync(summaryPath, JSON.stringify(payload, null, 2));
}

function stringifyError(error) {
  const extra = typeof error === "object" && error !== null && "stderr" in error ? String(error.stderr ?? "") : "";
  return error instanceof Error ? `${error.message}\n${extra}`.trim() : String(error);
}

function loadCliReport() {
  if (!existsSync(reportJsonPath)) {
    return null;
  }

  const parsed = JSON.parse(readFileSync(reportJsonPath, "utf8"));
  const hasRuntimeError = Boolean(parsed?.runtimeError?.code);
  if (hasRuntimeError) {
    return null;
  }

  const scores = extractScores(parsed);
  const hasValidScores = Object.values(scores).every((value) => value > 0);
  if (!hasValidScores) {
    return null;
  }

  return { parsed, scores };
}

function writeFailureArtifacts(error, mode) {
  const message = stringifyError(error);
  const payload = {
    status: "failed",
    mode,
    targetUrl,
    generatedAt: new Date().toISOString(),
    error: message,
  };

  writeFileSync(reportJsonPath, JSON.stringify(payload, null, 2));
  writeFileSync(
    reportHtmlPath,
    `<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Lighthouse ${date}</title><style>body{font-family:Inter,Arial,sans-serif;background:#0f0f13;color:#f4f6fa;margin:32px}pre{white-space:pre-wrap;background:#171b25;border:1px solid #2a3142;border-radius:10px;padding:12px}</style></head><body><h1>Lighthouse producción (fallido)</h1><p>URL: ${targetUrl}</p><p>Fecha: ${date}</p><p>Modo: ${mode}</p><pre>${message}</pre></body></html>`,
  );
  writeSummary({ status: "failed", mode, error: message });
}

function runCliLighthouse() {
  execFileSync(
    "node",
    [
      lighthouseCliPath,
      targetUrl,
      "--output",
      "html",
      "--output",
      "json",
      "--output-path",
      outPrefix,
      "--quiet",
      "--chrome-flags=--headless --no-sandbox",
    ],
    { stdio: "inherit" },
  );
}

function writePsiArtifacts(psiPayload) {
  const scores = extractScores(psiPayload?.lighthouseResult);
  const wrapped = {
    status: "ok",
    mode: "psi",
    targetUrl,
    generatedAt: new Date().toISOString(),
    thresholds,
    scores,
    pass: isThresholdPass(scores),
    psi: psiPayload,
  };

  writeFileSync(reportJsonPath, JSON.stringify(wrapped, null, 2));
  writeFileSync(
    reportHtmlPath,
    `<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Lighthouse PSI ${date}</title><style>body{font-family:Inter,Arial,sans-serif;background:#0f0f13;color:#f4f6fa;margin:32px}.grid{display:grid;grid-template-columns:repeat(4,minmax(140px,1fr));gap:12px;max-width:900px}.card{background:#171b25;border:1px solid #2a3142;border-radius:12px;padding:16px}.score{font-size:32px;color:#5e6ad2;font-weight:700}</style></head><body><h1>Lighthouse producción (PSI fallback)</h1><p>URL: ${targetUrl}</p><p>Fecha: ${date}</p><div class='grid'><div class='card'><div>Performance</div><div class='score'>${scores.performance}</div></div><div class='card'><div>Accessibility</div><div class='score'>${scores.accessibility}</div></div><div class='card'><div>Best Practices</div><div class='score'>${scores.bestPractices}</div></div><div class='card'><div>SEO</div><div class='score'>${scores.seo}</div></div></div></body></html>`,
  );
  writeSummary({ status: "ok", mode: "psi", scores });
}

async function runPsiFallback() {
  const psiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  psiUrl.searchParams.set("url", targetUrl);
  psiUrl.searchParams.set("strategy", "desktop");
  if (process.env.PAGESPEED_API_KEY) {
    psiUrl.searchParams.set("key", process.env.PAGESPEED_API_KEY);
  }

  const response = await fetch(psiUrl.toString());
  if (!response.ok) {
    throw new Error(`PSI request failed with status ${response.status}`);
  }

  const payload = await response.json();
  writePsiArtifacts(payload);
}

async function main() {
  try {
    runCliLighthouse();
    const report = loadCliReport();
    if (!report) {
      throw new Error("Lighthouse CLI did not produce a valid report.");
    }

    writeSummary({ status: "ok", mode: "cli", scores: report.scores });
    return 0;
  } catch (cliError) {
    const recoveredReport = loadCliReport();
    if (recoveredReport) {
      writeSummary({ status: "ok", mode: "cli-recovered", scores: recoveredReport.scores });
      return 0;
    }

    try {
      await runPsiFallback();
      return 0;
    } catch (psiError) {
      const joinedError = `${stringifyError(cliError)}\n\nFallback PSI failed:\n${stringifyError(psiError)}`;
      writeFailureArtifacts(joinedError, "cli+psi");
      return 1;
    }
  }
}

const code = await main();
process.exitCode = code;
