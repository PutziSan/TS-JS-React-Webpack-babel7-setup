# TS-JS-React-Project via Webpack4 and babel7

The project is actually only built with the latest Babel-features + Webpack4 + jest for unit-tests. It exists because I was not able to understand the configurations of other similar projects.

This documentation is not intended to show how to build a React application with this configuration, but to explain each unit and their meaning of the used configurations. I will try to document every config-line used for this setup.

> see the example in the `src`-folder, in principle each feature is illustrated by a mini example.

## get started

```shell
git clone https://github.com/PutziSan/TS-JS-React-Webpack-babel7-setup.git [NEW_PROJECT_NAME]
cd [NEW_PROJECT_NAME]
git remote remove origin
yarn
```

## whats included

- mix TypeScript and JavaScript with ES6-Imports via babel7
- Tree-Shaking and Code-Splitting via dynamic `import()`
- jest-test using quasi-same babel-config
- Hot-Module-Replacement for your React-Components via [react-hot-loader](#react-hot-loader) on development
- (...) => Basically everything you know from [Create-React-App (CRA)](https://github.com/facebook/create-react-app), only significantly slimmer implemented via babel7

## table of contents

- [get started](#get-started)
- [whats included](#whats-included)
- [table of contents](#table-of-contents)
- [babel](#babel)
  - [`.babelrc`](#babelrc)
    - [presets and plugins](#presets-and-plugins)
    - [babel env-option](#babel-env-option)
      - [babel-env: development](#babel-env-development)
      - [babel-env: test](#babel-env-test)
  - [babel-dependencies](#babel-dependencies)
  - [further babel-dependencies](#further-babel-dependencies)
- [webpack](#webpack)
  - [`webpack.config.js`](#webpackconfigjs)
  - [css-configuration](#css-configuration)
  - [caching of your assets](#caching-of-your-assets)
  - [Environment-Variables](#environment-variables)
  - [webpack-dependencies](#webpack-dependencies)
- [jest](#jest)
  - [`jest.config.js`](#jestconfigjs)
  - [jest-enzyme](#jest-enzyme)
  - [jest-dependencies](#jest-dependencies)
- [react-hot-loader](#react-hot-loader)
  - [react-hot-loader-setup](#react-hot-loader-setup)
- [TypeScript](#typescript)
  - [`tsconfig.json`](#tsconfigjson)
  - [typescript-dependencies](#typescript-dependencies)
- [npm-/yarn-scripts](#npm-yarn-scripts)
  - [`yarn start`](#yarn-start)
    - [`yarn start:perf`](#yarn-startperf)
  - [`yarn build`](#yarn-build)
  - [`yarn test`](#yarn-test)
  - [npm-scripts-dependencies](#npm-scripts-dependencies)
- [git-utilities](#git-utilities)
- [To Observe for later](#to-observe-for-later)

## babel

[babel7](https://new.babeljs.io/docs/en/next/babel-core.html) is used equally for all build+test+develop.

### `.babelrc`

basic settings are used for the build process (see [npm-scripts#build](#yarn-build)) where for jest and the development-process some adjustments have to be made in the config (via `env` in `.babelrc`).

#### presets and plugins

[Presets](https://new.babeljs.io/docs/en/next/plugins.html#presets) are a predefined set of [plugins](https://new.babeljs.io/docs/en/next/plugins.html), see [babel-dependencies](#babel-dependencies) for the individual presets/plugins we use.

[Plugin/Preset Ordering](https://new.babeljs.io/docs/en/next/plugins.html#plugin-preset-ordering):

- Plugins run before Presets
- Plugin ordering is first to last
- Preset ordering is reversed (last to first)

#### babel env-option

[env (environment) option](https://new.babeljs.io/docs/en/next/babelrc.html#env-environment-option): Depending on the `process.env.NODE_ENV` the babel-config will be merged while overwriting the new keys. The adjustments we use are explained below:

##### babel-env: development

Adds `react-hot-loader/babel`, look at [react-hot-loader](#react-hot-loader) for more information.

##### babel-env: test

Customizations for jest, since jest ES6 cannot `import`/`export` and does not understand dynamic imports, see [jest-doku](https://jestjs.io/docs/en/webpack.html#using-with-webpack-2):

- ES6-exports to commonjs: `@babel/preset-env` will be adapted from `"modules": false` to `"modules": "commonjs"`
- dynamic imports: use [`dynamic-import-node`](https://github.com/airbnb/babel-plugin-dynamic-import-node)-babel-plugin by AirBnb

### babel-dependencies

| package                                                                                                                    | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@babel/core](https://new.babeljs.io/docs/en/next/babel-core.html)                                                         | peer-dependency for everything else                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| [@babel/plugin-proposal-class-properties](https://new.babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html) | [see proposal](https://github.com/tc39/proposal-class-fields), so that ES6 class fields can not only be set in the constructor; the [`"loose": true`-option](https://new.babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html#loose) will assign the properties via assignment expressions instead of `Object.defineProperty` which results in less code                                                                                                               |
| [@babel/plugin-syntax-dynamic-import](https://new.babeljs.io/docs/en/next/babel-plugin-syntax-dynamic-import.html)         | only [Syntax-Plugin](https://new.babeljs.io/docs/en/next/plugins.html#syntax-plugins)! so babel understands dynamic imports, [which webpack uses for code-splitting](https://webpack.js.org/guides/code-splitting/#dynamic-imports)                                                                                                                                                                                                                                                   |
| [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html)                     | Babel-helpers and -polyfills will use [@babel/runtime](https://babeljs.io/docs/en/next/babel-runtime.html), without this babel copies the needed helper into every single file when needed, for more information [visit their documentation](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html); the [`"useESModules": true`-option ](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html#useesmodules) will use ES6-modules with `import`/`export` |
| [@babel/runtime](https://babeljs.io/docs/en/next/babel-runtime.html)                                                       | Babel will inject this dependency in your code when needed via [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html), see upper line                                                                                                                                                                                                                                                                                                 |
| [@babel/preset-env](https://new.babeljs.io/docs/en/next/babel-preset-env.html)                                             | ES>5 to ES5, should always run as the last transformation, so it [should always remain the first `presets`-entry](https://new.babeljs.io/docs/en/next/plugins.html#plugin-preset-ordering)                                                                                                                                                                                                                                                                                            |
| [@babel/preset-react](https://new.babeljs.io/docs/en/next/babel-preset-react.html)                                         | JSX to ES6                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| [@babel/preset-typescript](https://new.babeljs.io/docs/en/next/babel-preset-typescript.html)                               | TS/TSX to ES6/JSX                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| [babel-plugin-dynamic-import-node](https://github.com/airbnb/babel-plugin-dynamic-import-node)                             | the only one not by babel itself but by airbnb, only for jest-tests, see [jest-declaration](https://jestjs.io/docs/en/webpack.html#using-with-webpack-2)                                                                                                                                                                                                                                                                                                                              |

### further babel-dependencies

| package                                                                        | description                                                                                   |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [babel-core@7.0.0-bridge.0](https://github.com/babel/babel-bridge)             | for jest-test, [siehe jest-doku](https://jestjs.io/docs/en/getting-started.html#using-babel)  |
| [babel-jest](https://github.com/facebook/jest/tree/master/packages/babel-jest) | so that jest also uses the babel-transformations                                              |
| [babel-loader@8.0.0-beta.4](https://github.com/babel/babel-loader)             | to transform files via webpack, new babel-load-v8 must be used with new babel7                |
| [react-hot-loader/babel](react-hot-loader/babel)                               | babel extension for hot-loading to work with react, see [react-hot-loader](#react-hot-loader) |

## webpack

[webpack](https://webpack.js.org/) is bundler and development server. It is set by `webpack.config.js`.

performance => https://github.com/webpack/docs/wiki/build-performance + https://webpack.js.org/guides/build-performance/

### `webpack.config.js`

| config                                                                                              | description                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`output.chunkFilename`](https://webpack.js.org/configuration/output/#output-chunkfilename)         | chunks are generated when using JavaScripts [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports), see [webpack-documentation](https://webpack.js.org/guides/code-splitting/#dynamic-imports)                                                                                                       |
| [`output.pathinfo`](https://webpack.js.org/configuration/output/#output-pathinfo)                   | `true` for development cause for logs and errors the correct filename will be displayed                                                                                                                                                                                                                                                                              |
| [mode](https://webpack.js.org/concepts/mode/)                                                       | sets default-plugins (siehe link) and replaces NODE_ENV to production/development, [see webpack#optimization](https://webpack.js.org/configuration/optimization/) to check what the `production`-mode does                                                                                                                                                           |
| [devtool](https://webpack.js.org/configuration/devtool/)                                            | defines how source-maps are written, `eval` gives best performance, but incorrect line numbers, for our project `eval-source-map` is the best compromise between correct line numbers and performance                                                                                                                                                                |
| [module](https://webpack.js.org/configuration/module/)                                              | 1. runs babel for every file (see [more babel-dependencies](#next-babel-dependencies)) 2. we can import static files (img/pdf), which are converted to an url and added to the bundle as an external file [see webpack-dependencies#file-loader](#webpack-dependencies)                                                                                              |
| [devServer](https://webpack.js.org/configuration/dev-server/)                                       | [`hot: true`](https://webpack.js.org/guides/hot-module-replacement/) see [react-hot-loader](#react-hot-loader); `contentBase: 'public'` so the dev-server recognizes the static assets which are in `/public`                                                                                                                                                        |
| [optimization.minimizer](https://webpack.js.org/configuration/optimization/#optimization-minimizer) | set explicit, cause the default-config via [mode](https://webpack.js.org/concepts/mode/) does not remove comments                                                                                                                                                                                                                                                    |
| [plugins](https://webpack.js.org/plugins/)                                                          | [`webpack.EnvironmentPlugin`](https://webpack.js.org/plugins/environment-plugin/): see [Environment-variables](#environment-variables)<br />[`webpack.HotModuleReplacementPlugin`](https://webpack.js.org/plugins/hot-module-replacement-plugin/) see [react-hot-loader](#react-hot-loader)<br />see [webpack-dependencies](#webpack-dependencies) for other plugins |

### css-configuration

setup:

- [css-loader](https://github.com/webpack-contrib/css-loader) with a seconds plugin to add the css to the dom (see [webpack-dependencies](#webpack-dependencies) style-loader/mini-css-extract-plugin) as `module.rules`-entry
- [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) as `optimization.minimizer`-entry to minimize css for production
- [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) for production to emit the computed css-bundles as CSS-files

> make sure to include common file-formats (eg `woff`, `woff2`, ...) in your [file-loader](https://github.com/webpack-contrib/file-loader) so that the css-files can load them, if not this will raise errors

### caching of your assets

[Hashes](https://en.wikipedia.org/wiki/Hash_function) are used to ensure that unmodified bundles keep the same name for successive builds and changed files get a new bundle name. Thus browsers can effectively cache files by file name. Caching is configured via different plugins and config-entries:

- for your bundled JS-files: `output.filename` (`[name].[contenthash:8].js`) and [`output.chunkFilename`](https://webpack.js.org/configuration/output/#output-chunkfilename) (`[id].[contenthash:8].js`)
- for your bundled CSS-files: `filename` (`[name].[contenthash:8].js`) and `chunkFilename` (`[id].[contenthash:8].js`) via [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin#long-term-caching)

* for other static assets: `options.name` (`[name].[hash:8].[ext]`) in [file-loader](https://github.com/webpack-contrib/file-loader)-options

> Hash functions (to put it simply) always output the same result on repeated calls with a string of any length (they are [deterministic](https://en.wikipedia.org/wiki/Hash_function#Determinism)). I use a `:8`-suffix (like in `[name].[contenthash:8].js`) so that the names don't get too long and [even at this length it is unlikely to get the same result for 2 files](https://community.liferay.com/blogs/-/blogs/will-my-hashing-cache-keys-get-a-conflict-). If this is too uncertain, you can adjust or remove the number

Have a look at [webpacks caching-guide](https://webpack.js.org/guides/caching/) for more information.

### Environment-Variables

The [`webpack.EnvironmentPlugin`](https://webpack.js.org/plugins/environment-plugin/) replaces the specified keys, so that `process.env.[KEY]` is replaced with the actual `JSON`-representation of the current `process.env.[KEY]` in your Environment.

It is configured so that every key from `process.env` in the current node-process (via CLI, `.env`-file, CI, ...) will be available in your bundle.

> Make sure to not use sensitive environment-variables in your frontend-project!

Additional all environment variables that you have defined in a `.env`-file will be available in `process.env` using the [dotenv](https://github.com/motdotla/dotenv)-library.

### webpack-dependencies

| package                                                                                          | description                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [webpack](https://github.com/webpack/webpack)                                                    | core-bundler with node api                                                                                                                                                                                                                                        |
| [webpack-cli](https://github.com/webpack/webpack-cli)                                            | webpack via cli                                                                                                                                                                                                                                                   |
| [webpack-dev-server](https://github.com/webpack/webpack-dev-server)                              | webpack-dev-server for development                                                                                                                                                                                                                                |
| [file-loader](https://github.com/webpack-contrib/file-loader)                                    | import static assets in js                                                                                                                                                                                                                                        |
| [css-loader](https://github.com/webpack-contrib/css-loader)                                      | with this it is possible to `import` css-files in js-files, a further plugin is needed to append the imported css to the dom (inline or via external css), see below                                                                                              |
| [style-loader](https://github.com/webpack-contrib/style-loader)                                  | this injects the styles inline to the DOM, it is not recommended for production, but for development cause this plugin supports [HMR](#react-hot-loader), in production use [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) |
| [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)            | this will grab the css-files from css-loader (see above) and writes them in an external css-file per bundle, which is bether for production cause of smaller js-bundles and caching-abilities for the css-files                                                   |
| [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) | minifies your bundled CSS-files via [nano](https://github.com/cssnano/cssnano)                                                                                                                                                                                    |
| [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)                           | This will use your `src/index.html`-template and injects a `<script>`-tag with src to your generated entry-bundle                                                                                                                                                 |
| [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin)            | enables us to use this plugin with other options then defaults, see [`webpack.config.js` ("optimization.minimizer")](#webpack-config-js)                                                                                                                          |
| [dotenv](https://github.com/motdotla/dotenv)                                                     | "Loads environment variables from `.env`"                                                                                                                                                                                                                         |
| [babel-loader@8.0.0-beta.4](https://github.com/babel/babel-loader)                               | see [further babel-dependencies](#further-babel-dependencies)                                                                                                                                                                                                     |

## jest

Jest is translated via [babel-jest](https://github.com/facebook/jest/tree/master/packages/babel-jest) via babel to es5 and made usable, for special babel settings see [babel-env: test](#babel-env-test) (`NODE_ENV` to `test` is set by jest).

### `jest.config.js`

| config                       | description                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| setupTestFrameworkScriptFile | `dev/setupTests.js` configures [jest-enzyme](#jest-enzyme)                                                  |
| testRegex                    | all tests have to lay inside `tests`                                                                        |
| moduleFileExtensions         | test these extensions for `import` or `require`, corresponds to `resolve.extensions` in `webpack.config.js` |
| moduleNameMapper             | mock static assets (img, ...)                                                                               |
| transform                    | pass every file through babel                                                                               |
| testURL                      | only a fix for current [issue#2304](https://github.com/jsdom/jsdom/issues/2304)                             |

### jest-enzyme

[jest-enzyme](https://github.com/FormidableLabs/enzyme-matchers/tree/master/packages/jest-enzyme) by AirBnB is integrated via `dev/setupTests.js`, which is linked to jest in `setupTestFrameworkScriptFile` (see [`jest.config.js`](#jest-config-js)).

jest-enzyme adds more `matcher` functions for jests [`expect`](https://jestjs.io/docs/en/expect). For an overview of these functions, see [enzyme-docu for enzyme-matchers](https://github.com/FormidableLabs/enzyme-matchers).

### jest-dependencies

| package                                                                                               | description                                                                                                                     |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [jest](https://github.com/facebook/jest)                                                              | test-module for js/react by facebook                                                                                            |
| [jest-enzyme](https://github.com/FormidableLabs/enzyme-matchers/tree/master/packages/jest-enzyme)     | adds [enzyme-matchers](https://github.com/FormidableLabs/enzyme-matchers) to jests [`expect`](https://jestjs.io/docs/en/expect) |
| [enzyme](https://github.com/airbnb/enzyme)                                                            | Test-utils for rendering and mounting React-Components                                                                          |
| [enzyme-adapter-react-16](https://github.com/airbnb/enzyme/blob/master/docs/installation/react-16.md) | adapter for enzyme that it can mount and shallow-render React-16-Components                                                     |

## react-hot-loader

[react-hot-loader](https://github.com/gaearon/react-hot-loader) is a tool by Gaeron (Dan Abramov) to enable [Hot Module Replacement (HMR)](https://webpack.js.org/concepts/hot-module-replacement/).

> HMR means that the page is not completely reloaded when changes are made, but that the JS modules are "replaced" internally.rden

Since Babel7 the integration with TypeScript is much easier, because Babel understands TypeScript and therefore the babel-extension of react-hot-loader can be used easily.

> currently the usage is not documented here yet in [react-hot-loader](https://github.com/gaearon/react-hot-loader), but the [PR that explains this already exists](https://github.com/gaearon/react-hot-loader/pull/1028)

### react-hot-loader-setup

1. Root-Component (`src/components/App.tsx`) is wrapped with the [`hot`-HOC](https://github.com/gaearon/react-hot-loader#hotmodule-options).
2. for development the `react-hot-loader/babel`-plugin is enabled (siehe [babel-env: development](#babel-env-development))
3. in `webpack.config.js`, the `devServer.hot`-prop is set to `true` and the `webpack.HotModuleReplacementPlugin` is enabled, see [webpacks HMR-guide](https://webpack.js.org/guides/hot-module-replacement/)

## TypeScript

[TypeScript](https://www.typescriptlang.org/) is build via babels [@babel/preset-typescript](https://new.babeljs.io/docs/en/next/babel-preset-typescript.html).

### `tsconfig.json`

See [TS-doku#compiler-options](https://www.typescriptlang.org/docs/handbook/compiler-options.html), below only things worth explaining are mentioned:

| config                                                                                          | value            | description                                                                                                                                                |
| ----------------------------------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [moduleResolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)         | `node`           | TLDR: `node` is nowadays default and bether                                                                                                                |
| [module](https://www.typescriptlang.org/docs/handbook/modules.html#code-generation-for-modules) | `esnext`         | since we also use ES6-`import`/`export` js, it makes sense to keep this also for TS (`esnext` so that TS-compiler does not complain about dynamic imports) |
| [target](https://www.typescriptlang.org/docs/handbook/modules.html#code-generation-for-modules) | `es6`            | since TS is going through babel again anyway, the ES6                                                                                                      |
| [jsx](https://www.typescriptlang.org/docs/handbook/jsx.html)                                    | `preserve`       | `preserve` means that JSX is not converted to `React.createElement`, this is done by the babel compiler.                                                   |
| [lib](https://www.typescriptlang.org/docs/handbook/compiler-options.html) (search for `--lib`)  | `["es6", "dom"]` | "List of library files to be included in the compilation."                                                                                                 |
| sourceMap                                                                                       | `false`          | since webpack writes the sourcemaps for us it can be neglected by TS, see [`webpack.config.js`](#webpack-config-js)                                        |
| allowJs                                                                                         | `true`           | allows import and export of JS without compiler-errors                                                                                                     |

### typescript-dependencies

| package                                                                        | description                                                 |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| [typescript](https://github.com/Microsoft/TypeScript)                          | TS-core                                                     |
| [tslint](https://github.com/palantir/tslint)                                   | linting for your TS-files, you should enable it in your IDE |
| [tslint-config-prettier](https://github.com/alexjoverm/tslint-config-prettier) | "Use tslint with prettier without any conflict"             |
| [tslint-react](https://github.com/palantir/tslint-react)                       | "Lint rules related to React & JSX for TSLint."             |

## npm-/yarn-scripts

Scripts defined in `package.json` and executed via `yarn` or `npm run`:

### `yarn start`

`cross-env NODE_ENV=development webpack-dev-server --open`

Sets `NODE_ENV` to `development` (OS-agnostic via [cross-env](https://github.com/kentcdodds/cross-env)), and starts the webpack-dev-server, which uses your `webpack.config.js` (more information under [#webpack](#webpack)). In addition, your default browser will open with `http://localhost:3000`

#### `yarn start:perf`

Sets the `--devtool eval`-flag, according to [webpack](https://webpack.js.org/configuration/devtool/#devtool) the performance can be improved considerably, but the line-number is not correct in case of errors. For more information look at [webpack.config.js - devtool](#webpack-config-js).

### `yarn build`

`"rimraf dist && ncp public dist && cross-env NODE_ENV=production webpack"`

1. `rimraf dist`: clear current dist
2. `ncp public dist` copies current content of your `public`-folder to `dist`
3. `cross-env NODE_ENV=production webpack` sets `NODE_ENV` to `production` (platform-agnostic via [cross-env](https://github.com/kentcdodds/cross-env)) and build your project via [#webpack](#webpack)

### `yarn test`

executes your defined tests in `/tests`, using your config in `/jest.config.js`, look at the [jest-part](#jest) for more information.

### npm-scripts-dependencies

| package                                              | description                                 |
| ---------------------------------------------------- | ------------------------------------------- |
| [cross-env](https://github.com/kentcdodds/cross-env) | set environment-variables platform-agnostic |
| [ncp](https://github.com/AvianFlu/ncp)               | copy files platform-agnostic via node       |
| [rimraf](https://github.com/isaacs/rimraf)           | remove files platform-agnostic via node     |

## git-utilities

Via [husky](https://github.com/typicode/husky) and[lint-staged](https://github.com/okonet/lint-staged) every changed `*.{ts,tsx,js,js,jsx,json,css,md}` file is formatted uniformly before a commit using [prettier](https://github.com/prettier/prettier), also a `tslint --fix` runs for `*.{ts,tsx}` before the changed files are re-added.

The setup is according to [lint-staged's documentation](https://github.com/okonet/lint-staged#installation-and-setup), but husky is set up via [`/husky.config.js`](https://github.com/typicode/husky#upgrading-from-014) and lint via [`dev/.lintstagedrc`](https://github.com/okonet/lint-staged#configuration). (`package.json` should not be stuffed senselessly).

## To Observe for later

[webpack-serve](https://github.com/webpack-contrib/webpack-serve)

- seems to be the succesor of webpack-dev-server, [which is only in maintenance mode](https://github.com/webpack/webpack-dev-server#project-in-maintenance)
- => currently there are no reasonable examples or the like. why webpack-dev-server is the better way up-to-date

use `babel.config.js` over `.babelrc`,

- [laut babel](https://new.babeljs.io/docs/en/next/configuration.html) ist das eigentlich der präferirte weg für babel7
- example for current config lays in `documentation/example-babel.config.js`
- but is currently still buggy and/or undocumented
