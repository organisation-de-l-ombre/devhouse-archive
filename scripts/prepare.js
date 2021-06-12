"use strict";

const chalk = require("react-dev-utils/chalk");
const { exec } = require("child_process");

console.log(chalk.yellow("Cleaning Eslint cache..."));

exec("rm .eslintcache", (error) => {
  if (error) {
    console.log(chalk.red("Failed to clean Eslint cache."));

    return;
  }

  console.log(chalk.green("Cleaned Eslint cache."));
});
