# Nova Framework base project

> Nova is a distributed Discord framework used to make discord bot creation at scale easy and intuitive.

## Structure

The `src/` folder contains the source code of the worker container where all the bot logic resides.

The `config/` folder contains the configuration for all the nova components and is used during the deployment of a Nova project

## CLI tool

All the project is orchestrated using the Nova's cli tool used to generate kubernetes deployment files from the configuration.