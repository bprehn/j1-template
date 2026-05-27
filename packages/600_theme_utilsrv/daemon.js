#!/usr/bin/env node

const path = require("path");

const pkg = require("./package.json");
const cfg = pkg.config || {};

const daemonPath = process.cwd();
const projectPath = path.resolve(daemonPath, cfg.project_path || "../400_theme_site");
const dataPath = path.resolve(daemonPath, cfg.data_path || "../400_theme_site/_data");
const logFilePath = path.resolve(daemonPath, cfg.log_file || "../../log/messages.log");

const serverEnabled = String(cfg.server_enabled).toLowerCase() === "true";
const verbosity = String(cfg.verbosity).toLowerCase() === "true";
const environment = cfg.environment || "dev";

console.log("utls: Startup UTILSRV ..");
console.log(`utls: Server enabled:          ${serverEnabled}`);
console.log(`utls: Environment detected as: ${environment}`);
console.log(`utls: Daemon path set to:      ${daemonPath}`);
console.log(`utls: Daemon verbosity set to: ${verbosity}`);
console.log(`utls: Project path set to:     ${projectPath}`);
console.log(`utls: Data path set to:        ${dataPath}`);
console.log(`utls: Log file set to:         ${logFilePath}`);

if (!serverEnabled) {
  console.log("utls: Stop the server. Exiting ...");
  process.exit(0);
}

console.log("utls: Server enabled but no runtime implementation is configured yet.");
process.exit(0);
