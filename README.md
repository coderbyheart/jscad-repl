# JSCAD Repl

[![GitHub Actions](https://github.com/coderbyheart/jscad-repl/workflows/Test%20and%20Release/badge.svg)](https://github.com/coderbyheart/jscad-repl/actions)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)
[![Mergify Status](https://img.shields.io/endpoint.svg?url=https://api.mergify.com/v1/badges/coderbyheart/jscad-repl)](https://mergify.io)
[![@commitlint/config-conventional](https://img.shields.io/badge/%40commitlint-config--conventional-brightgreen)](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier/)
[![React](https://github.com/aleen42/badges/raw/master/src/react.svg)](https://reactjs.org/)
[![Bootstrap 5](https://img.shields.io/badge/Bootstrap-5-ffffff?labelColor=7952b3)](https://getbootstrap.com/docs/5.0/)
[![CSS modules](https://img.shields.io/badge/CSS-modules-yellow)](https://github.com/css-modules/css-modules)
[![Vite](https://github.com/aleen42/badges/raw/master/src/vitejs.svg)](https://vitejs.dev/)

Develop 3D models in VS Code using
[JSCAD](https://github.com/jscad/OpenJSCAD.org).

## Node & NPM

This project requires Node.js `>=26 <27` and npm `>=12.0.2 <13` (enforced via
`check-node-version` on `npm install` and `npm ci`). The check is skipped during
`npm publish` and `npm pack`, because `semantic-release` bundles its own npm
(`@semantic-release/npm` depends on `npm@^11.6.2`) and runs the publish with
that version rather than the one installed in CI.

## Set up

    npm ci

## Running

    npm start

Every model in `src/models/` is available under its file name, e.g.
`src/models/nordanWindowClip.ts` is served on
<http://localhost:8080/nordanWindowClip> (and on
<https://coderbyheart.github.io/jscad-repl/nordanWindowClip>). The file must
export a function with the same name that takes no required arguments. The root
page lists all models.
