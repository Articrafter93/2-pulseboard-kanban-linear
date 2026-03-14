import { mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const date = new Date().toISOString().slice(0, 10);
const targetUrl = process.env.LIGHTHOUSE_TARGET_URL ?? "https://pulseboard-kanban-linear.vercel.app";
const outBase = path.resolve("artifacts", "lighthouse", `production-${date}.report`);

mkdirSync(path.dirname(outBase), { recursive: true });

function writeFailureArtifacts(error, mode) {
  const extra = typeof error === "object" && error !== null && "stderr" in error ? String(error.stderr) : "";
  const message = error instanceof Error ? `${error.message}\n${extra}` : String(error);
  const payload = {
    status: "failed",
    mode,
    targetUrl,
    generatedAt: new Date().toISOString(),
    error: message,
  };

  writeFileSync(`${outBase}.json`, JSON.stringify(payload, null, 2));
  writeFileSync(
    `${outBase}.html`,
    `<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Lighthouse ${date}</title><style>body{font-family:Inter,Arial,sans-serif;background:#0f0f13;color:#f4f6fa;margin:32px}pre{white-space:pre-wrap;background:#171b25;border:1px solid #2a3142;border-radius:10px;padding:12px}</style></head><body><h1>Lighthouse producción (fallido)</h1><p>URL: ${targetUrl}</p><p>Fecha: ${date}</p><p>Modo: ${mode}</p><pre>${message}</pre></body></html>`,
  );
}

try {
  execSync(
    `npx lighthouse ${targetUrl} --output html --output json --output-path ${outBase} --quiet --chrome-flags="--headless --no-sandbox"`,
    { stdio: "inherit" },
  );
  process.exit(0);
} catch (cliError) {
  if (process.env.PAGESPEED_API_KEY) {
    try {
      const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=desktop&key=${process.env.PAGESPEED_API_KEY}`;
      const response = execSync(`powershell -Command \"(Invoke-WebRequest -Uri '${psiUrl}' -UseBasicParsing).Content\"`, {
        encoding: "utf8",
      });
      const psi = JSON.parse(response);
      writeFileSync(`${outBase}.json`, JSON.stringify(psi, null, 2));
      const categories = psi?.lighthouseResult?.categories ?? {};
      const score = (name) => Math.round((categories?.[name]?.score ?? 0) * 100);
      writeFileSync(
        `${outBase}.html`,
        `<!doctype html><html lang="es"><head><meta charset="utf-8"/><title>Lighthouse PSI ${date}</title><style>body{font-family:Inter,Arial,sans-serif;background:#0f0f13;color:#f4f6fa;margin:32px}.grid{display:grid;grid-template-columns:repeat(4,minmax(120px,1fr));gap:12px;max-width:860px}.card{background:#171b25;border:1px solid #2a3142;border-radius:12px;padding:16px}.score{font-size:32px;color:#5e6ad2;font-weight:700}</style></head><body><h1>Lighthouse producción (PSI)</h1><p>URL: ${targetUrl}</p><div class='grid'><div class='card'><div>Performance</div><div class='score'>${score("performance")}</div></div><div class='card'><div>Accessibility</div><div class='score'>${score("accessibility")}</div></div><div class='card'><div>Best Practices</div><div class='score'>${score("best-practices")}</div></div><div class='card'><div>SEO</div><div class='score'>${score("seo")}</div></div></div></body></html>`,
      );
      process.exit(0);
    } catch (psiError) {
      writeFailureArtifacts(`${String(cliError)}\n\nFallback PSI failed:\n${String(psiError)}`, "cli+psi");
      process.exit(1);
    }
  }

  writeFailureArtifacts(cliError, "cli");
  process.exit(1);
}
