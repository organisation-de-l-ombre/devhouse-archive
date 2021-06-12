"use strict";

const { readFileSync } = require("fs");
const chalk = require("react-dev-utils/chalk");
const { exec } = require("child_process");

try {
  readFile(".eslintcache");

  console.log(chalk.yellow("Cleaning Eslint cache..."));

  exec("rm .eslintcache", (error) => {
    if (error) {
      console.log(chalk.red("Failed to clean Eslint cache."));

      return;
    }

    console.log(chalk.green("Cleaned Eslint cache."));
  });

  console.log(chalk.yellow("No Eslint cache found."));
} catch {
  console.log(chalk.red("Failed to clean Eslint cache."));
}