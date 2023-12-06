# GitHub Scrapper 

## Local Installation

This project uses `npm` as the package manager. To install all dependencies, run `npm install`.

## `npm` Scripts

To automate tasks, use the following `npm` scripts in your terminal:

### `npm run build`

Builds the application, placing the result into the `dist` folder.

### `npm start`

Starts the application (first you need to run the `npm run build` command).

### `npm test`

Runs application tests.

### `npm run dev`

Runs the application with [`nodemon`](https://github.com/remy/nodemon/), opening a debugger port.

### `npm run format:check`

Checks code formatting.

### `npm run format:write`

Applies formatting styles to the code.

## Project Layers

### Application

#### Service

Integrates facade and domain layers, responsible for data parsing.

#### Facade

Connects with the GitHub API with minimal business logic, acting as a bridge.

### Config

Shares project configuration among all layers.

### DI

Registers all containers using `tsrying`, including tokens and containers.

### Domain

Establishes communication in the "in-house" layer, in this case the Cache logic.

### Presentation

Presents data through routes and controllers.

### Tests

All tests are located within this layer.

## Critique

### Areas for Improvement

- Expand test coverage across different layers, including infrastructure and configuration.
- Enhance TypeScript usage and type definitions.
- Improve Swagger implementation to cover more cases.
- Modify memory cache logic to use a different approach like caching with Redis.
- Implement Docker for running the application.
- Set up pipelines to run tests with each push.
- Incorporate a PR template for contributing guidelines.
