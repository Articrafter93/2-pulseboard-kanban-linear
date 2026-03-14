import { ensureWorkspaceSeed } from "../lib/workspace-seed";

async function main() {
  await ensureWorkspaceSeed("default");
  console.log("Seed completed for workspace 'default'.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
