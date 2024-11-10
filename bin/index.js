#!/usr/bin/env node

import { program } from "commander";
import picocolors from "picocolors";
import path from "path";
import { fileURLToPath } from "url";
import module from "node:module";
const require = module.createRequire(import.meta.url);
const packageJson = require("../package.json");
const { execSync } = require("child_process");
const __filename = fileURLToPath(import.meta.url);
const pkgDir = path.resolve(path.dirname(__filename), "..");

program
  .version(packageJson.version)
  .description("Codemods CLI")
  .argument("<mod>", "mod to run")
  .argument("<glob>", "glob to run against")
  .action((mod, glob) => {
    console.log(
      picocolors.blue(`Running run-codemods v${packageJson.version}`)
    );

    // Run the mod
    try {
      // Transform the glob to run from the directory of the user's command
      execSync(`npm rum ${mod} -- ${path.join(process.cwd(), glob)}`, {
        cwd: pkgDir,
        stdio: "inherit",
      });
    } catch (error) {
      console.error(
        picocolors.red(`Error running run-codemods ${mod}:`),
        error
      );
      // Kill the process with a non-zero exit code
      process.exit(1);
    }
    console.log(picocolors.green(`Codemod, ${mod}, ran successfully!`));
  });

program.parse(process.argv);
