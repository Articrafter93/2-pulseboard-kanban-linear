import { spawnSync } from "node:child_process";

const maxAttempts = 5;
const retryDelayMs = 1200;

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  const result = spawnSync("node", ["scripts/with-env.mjs", "prisma", "generate"], {
    stdio: "pipe",
    shell: process.platform === "win32",
    env: process.env,
    encoding: "utf8",
  });

  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (result.stderr) {
    process.stderr.write(result.stderr);
  }

  if (result.status === 0) {
    process.exit(0);
  }

  const combinedOutput = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  const isEpermRename = combinedOutput.includes("EPERM: operation not permitted, rename");

  if (!isEpermRename || attempt === maxAttempts) {
    process.exit(result.status ?? 1);
  }

  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, retryDelayMs);
}
