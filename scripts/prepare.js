"use strict";

const { readFile } = require("fs/promises");
const chalk = require("react-dev-utils/chalk");
const { exec } = require("child_process");

readFile(".eslintcache")
  .then(() => {
    console.log(chalk.yellow("Cleaning Eslint cache..."));

    exec("rm .eslintcache", (error) => {
      if (error) {
        console.log(chalk.red("Failed to clean Eslint cache."));

        return;
      }

      console.log(chalk.green("Cleaned Eslint cache."));
    });
  })
  .catch(() => {
    console.log(chalk.yellow("No Eslint cache found."));
  });
