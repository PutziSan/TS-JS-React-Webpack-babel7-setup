# TS-JS-React-Project via Webpack4 and babel7

The project is actually only built with the latest Babel-features + Webpack4 + jest for unit-tests.

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

- [babel](#babel)
  - [`babel.config.js`](#babelconfigjs)
    - [presets and plugins](#presets-and-plugins)
    - [`production`-specific options](#production-specific-options)
    - [`development`-specific options](#development-specific-options)
    - [`test`-specific options](#test-specific-options)
  - [babel-helper-functions via babel-runtime for smaller bundle-size](#babel-helper-functions-via-babel-runtime-for-smaller-bundle-size)
  - [polyfills](#polyfills)
    - [polyfills via babel-polyfill (not recommended)](#polyfills-via-babel-polyfill-not-recommended)
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
- [npm-/yarn-scripts](#npm-yarn-scripts)
  - [`yarn start`](#yarn-start)
    - [`yarn start:debug`](#yarn-startdebug)
  - [`yarn build`](#yarn-build)
  - [`yarn test`](#yarn-test)
  - [npm-scripts-dependencies](#npm-scripts-dependencies)
- [development-utilities](#development-utilities)
  - [ESLint](#eslint)
    - [ESLint-settings](#eslint-settings)
    - [ESLint-dependencies](#eslint-dependencies)
  - [TSLint](#tslint)
    - [TSLint-settings](#tslint-settings)
    - [TSLint-Dependencies](#tslint-dependencies)
  - [Prettier](#prettier)
  - [git pre-commit-hooks](#git-pre-commit-hooks)
- [overwiev dependencies and devDependencies](#overwiev-dependencies-and-devdependencies)
  - [dependencies](#dependencies)
  - [devDependencies](#devdependencies)
- [To Observe](#to-observe)

## babel

[babel7](https://new.babeljs.io/docs/en/next/babel-core.html) is used equally for all build+test+develop.

### `babel.config.js`

Babel is configured via the [babel.config.js](https://babeljs.io/docs/en/next/babelconfigjs)-file. The `process.env.NODE_ENV`-variable is used to determine which plugins and presets should be added.

#### presets and plugins

[Presets](https://new.babeljs.io/docs/en/next/plugins.html#presets) are a predefined set of [plugins](https://new.babeljs.io/docs/en/next/plugins.html), see [babel-dependencies](#babel-dependencies) for the individual presets/plugins we use.

[Plugin/Preset Ordering](https://new.babeljs.io/docs/en/next/plugins.html#plugin-preset-ordering):

- Plugins run before Presets
- Plugin ordering is first to last
- Preset ordering is reversed (last to first)

#### `production`-specific options

- add [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html), see [babel-helper-functions via babel-runtime for smaller bundle-size](#babel-helper-functions-via-babel-runtime-for-smaller-bundle-size)
- turns off the [`development`](https://new.babeljs.io/docs/en/next/babel-preset-react.html#development)-option in [@babel/preset-react](https://new.babeljs.io/docs/en/next/babel-preset-react.html)

#### `development`-specific options

- do not include the [@babel/preset-env](https://new.babeljs.io/docs/en/next/babel-preset-env.html), you will use a new browser for dev, so no need to waste compile-time with this preset during dev
- add [react-hot-loader/babel](https://github.com/gaearon/react-hot-loader), look at [react-hot-loader](#react-hot-loader) for more information.

#### `test`-specific options

Customizations for jest, since jest ES6 cannot `import`/`export` and does not understand dynamic imports, see [jest-documentation](https://jestjs.io/docs/en/webpack.html#using-with-webpack-2):

- ES6-exports to commonjs: `@babel/preset-env` will be adapted from `"modules": false` to `"modules": "commonjs"`
- dynamic imports: use [babel-plugin-dynamic-import-node](https://github.com/airbnb/babel-plugin-dynamic-import-node) by AirBnb instead of [@babel/plugin-syntax-dynamic-import](https://new.babeljs.io/docs/en/next/babel-plugin-syntax-dynamic-import.html)

### babel-helper-functions via babel-runtime for smaller bundle-size

Babel injects [small helper-functions](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html#why) like `_extend`, when needed. With [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html) the code is not copied in every file, but the transform-runtime-plugin will inject referneces to the [@babel/runtime](https://babeljs.io/docs/en/next/babel-runtime.html)-package, which holds the implementations of the helper-functions (["Helper aliasing"](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html#helper-aliasing)). This will result in a smaller bundle. The [`"useESModules": true`-option ](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html#useesmodules) will use ES6-modules (`import`/`export`) instead of the implementations with commonjs (`require`/`module.exports`).

Please note that the [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html) can also perform other transformations:

- [`corejs`](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html#corejs) will [polyfill new built-ins (Promise, Map, ...)](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html#core-js-aliasing) via the [core-js](https://github.com/zloirock/core-js#babel)-library
- [`regenerator`](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html#regenerator) will transform [generator-functions (`function*`)](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Statements/function*) into [ES5-Code with a local regenerator-runtime](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html#regenerator-aliasing)

In my opinion it is not a good idea to use these options, because the inserted transformations [can take up a lot of space](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime#core-js-aliasing) and it is very likely that others also use polyfills, so it may be that a feature is polyfilled by several different libraries which bloats your bundle. If you are developing a library, it is best not to use features that require polyfills at all. If really necessary, use [ponyfills](https://github.com/sindresorhus/ponyfill) and document the use.

### polyfills

In `src/index.tsx` the first line loads a polyfill-script (`import './bootstrap/polyfills';`), so that the app also runs under Internet Explorer 11 (IE11). Following polyfills are included:

- [`Promise`](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Promise) via [this promise-library](https://github.com/then/promise) (Promises are required for [code-splitting via dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports))
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) via [this object-assign-library](https://github.com/sindresorhus/object-assign) (`Object.assign` is needed for the [@babel/plugin-proposal-object-rest-spread with the `useBuiltIns`-option](https://babeljs.io/docs/en/next/babel-plugin-proposal-object-rest-spread.html#usebuiltins) and in some libraries (e.g. [react-loadable](https://github.com/jamiebuilds/react-loadable/blob/master/src/index.js#L105)) but not included in IE11)

Both polyfills together increase the bundle-size by ~ 5kb. If you think you do not need this polyfills you can remove them. If you need other polyfills, because you use new features or have to support very old browsers, you should attach them in `src/bootstrap/polyfills.js`.

#### polyfills via babel-polyfill (not recommended)

To stop thinking about polyfills you can automate this process with [babel-polyfill](https://babeljs.io/docs/en/next/babel-polyfill). Similar to [@babel/plugin-transform-runtime with the `corejs`-option](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime#core-js-aliasing), polyfills via [core-js](https://github.com/zloirock/core-js#babel) are added for older browsers. In contrast to runtime, the polyfills are loaded globally into the application (which is not recommended for libraries).

You can then additionaly use the [`useBuiltIns`-option of the babel-preset-env](https://babeljs.io/docs/en/next/babel-preset-env#usebuiltins):

- `useBuiltIns: 'usage'`: Adds specific imports for polyfills when they are used in each file. We take advantage of the fact that a bundler will load the same polyfill only once. Be aware that this will not polyfill usages in `node_modules`
- `useBuiltIns: 'entry'`: You need to import `@babel/polyfill` in your entry-file once, babel will transform this import to only include imports needed by the specified [preset-env `target`-option](https://babeljs.io/docs/en/next/babel-preset-env#targets); At the moment (as of 13.08.2018) this is for `browsers: ['>0.25%']` still over 80 kb

I would not recommend the use of babel-polyfill since:

- either significantly too many polyfills are imported (library standalone or with `useBuiltIns: 'entry'`) or
- using `useBuiltIns: 'usage'` the polyfills are incosistent (they are included locally per file but change the global namespace) and only functions used in your code are analyzed (since used `node_modules`s are not examined), außerdem ist auch mit dieser Methode
  - Also with this method the resulting package is bigger than if you install the polyfills yourself as [described above](#polyfills)
  - For the example app only the two polyfills [mentioned above](#polyfills) are needed to run under IE11, the bundle size was still ~ 14 kb bigger and I had to install the required imports manually into `index.ts`, because preset-env did not recognize that for the dynamic `import()` Promise must polyfill and for React-Loadable `Object.assign`

### babel-dependencies

| package                                                                                                                    | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@babel/core](https://new.babeljs.io/docs/en/next/babel-core.html)                                                         | peer-dependency for everything else                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| [@babel/plugin-proposal-class-properties](https://new.babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html) | [see proposal](https://github.com/tc39/proposal-class-fields), so that ES6 class fields can not only be set in the constructor; the [`"loose": true`-option](https://new.babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html#loose) will assign the properties via assignment expressions instead of `Object.defineProperty` which results in less code                                                                                                                                                                                                                                                                                                                                   |
| [@babel/plugin-proposal-object-rest-spread](https://babeljs.io/docs/en/next/babel-plugin-proposal-object-rest-spread.html) | The [Object-React-Operator (`...`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) is not natively supported by preset-env.<br />The rest operator works in TypeScript files without this transformation because the [TypeScript compiler has been compiling it to ES5 code since TypeScript 2.1](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#object-spread-and-rest).<br />The [`useBuiltIns: true`-Option](https://babeljs.io/docs/en/next/babel-plugin-proposal-object-rest-spread.html#usebuiltins) transforms it to `Object.assign`-calls, [make sure to include a polyfill for older browsers (IE 11)](#polyfills) |
| [@babel/plugin-syntax-dynamic-import](https://new.babeljs.io/docs/en/next/babel-plugin-syntax-dynamic-import.html)         | only [Syntax-Plugin](https://new.babeljs.io/docs/en/next/plugins.html#syntax-plugins)! so babel understands dynamic imports, [which webpack uses for code-splitting](https://webpack.js.org/guides/code-splitting/#dynamic-imports)                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html)                     | Babel-helpers and -polyfills will use [@babel/runtime](https://babeljs.io/docs/en/next/babel-runtime.html), without this babel copies the needed helper into every single file when needed, for more information [visit their documentation](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html); the [`"useESModules": true`-option ](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html#useesmodules) will use ES6-modules with `import`/`export`                                                                                                                                                                                                                     |
| [@babel/runtime](https://babeljs.io/docs/en/next/babel-runtime.html)                                                       | Babel will inject this dependency in your code when needed via [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html), see upper line                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| [@babel/preset-env](https://new.babeljs.io/docs/en/next/babel-preset-env.html)                                             | ES>5 to ES5, should always run as the last transformation, so it [should always remain the first `presets`-entry](https://new.babeljs.io/docs/en/next/plugins.html#plugin-preset-ordering)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| [@babel/preset-react](https://new.babeljs.io/docs/en/next/babel-preset-react.html)                                         | JSX to ES6;<br />[`useBuiltIns`-option](https://babeljs.io/docs/en/next/babel-preset-react#usebuiltins) will passed through the [`useBuiltIns`-option in @babel/plugin-transform-react-jsx](https://babeljs.io/docs/en/next/babel-plugin-transform-react-jsx.html#usebuiltins) => "When spreading props, use Object.assign directly instead of Babel's extend helper."<br />[`development`-option](https://babeljs.io/docs/en/next/babel-preset-react#development) will add debug-informations, [turned off in production](#production-specific-options)                                                                                                                                                  |
| [@babel/preset-typescript](https://new.babeljs.io/docs/en/next/babel-preset-typescript.html)                               | TS/TSX to ES6/JSX                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| [babel-plugin-dynamic-import-node](https://github.com/airbnb/babel-plugin-dynamic-import-node)                             | the only one not by babel itself but by airbnb, only for jest-tests, see [jest-declaration](https://jestjs.io/docs/en/webpack.html#using-with-webpack-2)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

### further babel-dependencies

| package                                                                        | description                                                                                   |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [babel-core@7.0.0-bridge.0](https://github.com/babel/babel-bridge)             | for jest-test, [siehe jest-doku](https://jestjs.io/docs/en/getting-started.html#using-babel)  |
| [babel-jest](https://github.com/facebook/jest/tree/master/packages/babel-jest) | so that jest also uses the babel-transformations                                              |
| [babel-loader@8.0.0-beta.4](https://github.com/babel/babel-loader)             | to transform files via webpack, new babel-load-v8 must be used with new babel7                |
| [react-hot-loader/babel](https://github.com/gaearon/react-hot-loader)          | babel extension for hot-loading to work with react, see [react-hot-loader](#react-hot-loader) |

## webpack

[webpack](https://webpack.js.org/) is our bundler and development-server. It is configured via `webpack.config.js`.

### `webpack.config.js`

| config                                                                                              | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [entry](https://webpack.js.org/concepts/entry-points/)                                              | An object where the key represents the output-name of the generated js-file (this will applied to `[name]` in [`output.filename`](https://webpack.js.org/configuration/output/#output-filename)) and the value is the location of your entry-point, see [Entry Points - object-syntax (webpack-documentation)](https://webpack.js.org/concepts/entry-points/#object-syntax)                                                                                                                                                                                                  |
| [`output.filename`](https://webpack.js.org/configuration/output/#output-filename)                   | `js/` is used to collect all js-files in the `js`-sub-dir, [see this discussion](https://github.com/webpack/webpack/issues/1189#issuecomment-114992043) <br />see [caching of your assets](#caching-of-your-assets) for information about `[contenthash:8]`                                                                                                                                                                                                                                                                                                                  |
| [`output.path`](https://webpack.js.org/configuration/output/#output-path)                           | The folder specified here is used as the target where it should output your bundles, assets and anything else you bundle or load with webpack.<br />If you want to collect your js-files in a single directory use [`output.filename`](https://webpack.js.org/configuration/output/#output-filename) (see above)                                                                                                                                                                                                                                                             |
| [`output.chunkFilename`](https://webpack.js.org/configuration/output/#output-chunkfilename)         | chunks are generated when using JavaScripts [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports), see [webpack-documentation](https://webpack.js.org/guides/code-splitting/#dynamic-imports)                                                                                                                                                                                                                                                                                                               |
| [`output.publicPath`](https://webpack.js.org/configuration/output/#output-publicpath)               | It is important that you set `publicPath` with a trailing slash so that the paths are not set relative to the current route (note that the default value is an empty string (`""`)). For example, the ([html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)) would then insert `<script src="main.js">` and your browser would search for `main.js` relative to the current route, but we want `<script src="/main.js">` (note the leading slash) so that the JS file is always searched in the root.                                                      |
| [mode](https://webpack.js.org/concepts/mode/)                                                       | sets default-plugins (siehe link) and replaces NODE_ENV to production/development, [see webpack#optimization](https://webpack.js.org/configuration/optimization/) to check what the `production`-mode does                                                                                                                                                                                                                                                                                                                                                                   |
| [devtool](https://webpack.js.org/configuration/devtool/)                                            | defines how source-maps are written, `eval` gives best performance, but incorrect line numbers, for our project `eval-source-map` is the best compromise between correct line numbers and performance                                                                                                                                                                                                                                                                                                                                                                        |
| [resolve.symlinks](https://webpack.js.org/configuration/resolve/#resolve-symlinks)                  | `false`, cause it can cause to unexpected behavior (e.g. it could apply a module-rule even you excluded it if the symlinked path is outside of the exclusion)                                                                                                                                                                                                                                                                                                                                                                                                                |
| [module](https://webpack.js.org/configuration/module/)                                              | 1. runs babel for every file (see [more babel-dependencies](#next-babel-dependencies)) 2. we can import static files (img/pdf), which are converted to an url and added to the bundle as an external file [see webpack-dependencies#file-loader](#webpack-dependencies)                                                                                                                                                                                                                                                                                                      |
| [devServer](https://webpack.js.org/configuration/dev-server/)                                       | [`hot: true`](https://webpack.js.org/guides/hot-module-replacement/) see [react-hot-loader](#react-hot-loader); `contentBase: 'public'` so the dev-server recognizes the static assets which are in `/public`                                                                                                                                                                                                                                                                                                                                                                |
| [optimization.minimizer](https://webpack.js.org/configuration/optimization/#optimization-minimizer) | set explicit, cause the default-config via [mode](https://webpack.js.org/concepts/mode/) does not remove comments<br />also added [`collapse_vars: false`](https://github.com/mishoo/UglifyJS2#compress-options), as it has caused considerable performance losses ([uglifyjs-issue](https://github.com/mishoo/UglifyJS2/issues/3174), [terser-issue](https://github.com/terser-js/terser/issues/50), [cra-issue](https://github.com/facebook/create-react-app/issues/5103#issuecomment-424903155)), but only 3KiB savings in a > 5 MiB (output-bundle-size) project (Apoly) |
| [plugins](https://webpack.js.org/plugins/)                                                          | [`webpack.EnvironmentPlugin`](https://webpack.js.org/plugins/environment-plugin/): see [Environment-variables](#environment-variables)<br />[`webpack.HotModuleReplacementPlugin`](https://webpack.js.org/plugins/hot-module-replacement-plugin/) see [react-hot-loader](#react-hot-loader)<br />see [webpack-dependencies](#webpack-dependencies) for other plugins                                                                                                                                                                                                         |

### css-configuration

setup:

- [css-loader](https://github.com/webpack-contrib/css-loader) with a seconds plugin to add the css to the dom (see [webpack-dependencies](#webpack-dependencies) style-loader/mini-css-extract-plugin) as `module.rules`-entry
- [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin) as `optimization.minimizer`-entry to minimize css for production
- [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) for production to emit the computed css-bundles as CSS-files

> make sure to include common file-formats (eg `woff`, `woff2`, ...) in your [file-loader](https://github.com/webpack-contrib/file-loader) so that the css-files can load them, if not this will raise errors

### caching of your assets

> Hash functions (to put it simply) always output the same result on repeated calls with a string of any length (they are [deterministic](https://en.wikipedia.org/wiki/Hash_function#Determinism)). I use a `:8`-suffix (like in `[name].[contenthash:8].js`) so that the names don't get too long and [even at this length it is unlikely to get the same result for 2 files](https://community.liferay.com/blogs/-/blogs/will-my-hashing-cache-keys-get-a-conflict-). If this is too uncertain, you can adjust or remove the number

[Hashes](https://en.wikipedia.org/wiki/Hash_function) are used to ensure that unmodified bundles keep the same name for successive builds and changed files get a new bundle name. Thus browsers can effectively cache files by file name. Caching is configured via different plugins and config-entries:

- for your bundled JS-files: `output.filename` (`[name].[contenthash:8].js`) and [`output.chunkFilename`](https://webpack.js.org/configuration/output/#output-chunkfilename) (`[id].[contenthash:8].js`)
- for your bundled CSS-files: `filename` (`[name].[contenthash:8].js`) and `chunkFilename` (`[id].[contenthash:8].js`) via [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin#long-term-caching)
- for other static assets: `options.name` (`[name].[hash:8].[ext]`) in [file-loader](https://github.com/webpack-contrib/file-loader)-options

> during development you [should not enable any hashing of your filenames](https://github.com/webpack/webpack-dev-server/issues/377#issuecomment-241258405) (This can be neglected for CSS-files via [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin#long-term-caching) as it is only used in production anyway)

Have a look at [webpacks caching-guide](https://webpack.js.org/guides/caching/) for more information.

> If you have build-performance concerns, you should start with [webpacks build-performance-article on github](https://github.com/webpack/docs/wiki/build-performance) and the [build-performance-section on their website](https://webpack.js.org/guides/build-performance/) to learn what you can optimize.

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

Jest is translated via [babel-jest](https://github.com/facebook/jest/tree/master/packages/babel-jest) via babel to es5 and made usable, for special babel settings see [babels `test`-specific options](#test-specific-options) (`NODE_ENV` to `test` is set by jest).

### `jest.config.js`

| config                       | description                                                                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| setupTestFrameworkScriptFile | `dev/setupTests.js` configures [jest-enzyme](#jest-enzyme)                                                                       |
| testRegex                    | all tests have to lay inside `tests`                                                                                             |
| moduleFileExtensions         | test these extensions for `import` or `require`, corresponds to `resolve.extensions` in `webpack.config.js`                      |
| moduleNameMapper             | mock static assets (img, CSS) see [jest-doku - Handling Static Assets](https://jestjs.io/docs/en/webpack#handling-static-assets) |
| transform                    | pass every file through babel                                                                                                    |

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
2. for development the `react-hot-loader/babel`-plugin is enabled (see [babels `development`-specific options](#development-specific-options))
3. in `webpack.config.js`, the `devServer.hot`-prop is set to `true` and the `webpack.HotModuleReplacementPlugin` is enabled, see [webpacks HMR-guide](https://webpack.js.org/guides/hot-module-replacement/)

## TypeScript

[TypeScript](https://www.typescriptlang.org/) ([TypeScript GitHub-repo](https://github.com/Microsoft/TypeScript)) is build via babels [@babel/preset-typescript](https://new.babeljs.io/docs/en/next/babel-preset-typescript.html).

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

## npm-/yarn-scripts

Scripts defined in `package.json` and executed via `yarn` or `npm run`:

### `yarn start`

`cross-env NODE_ENV=development webpack-dev-server --open`

Sets `NODE_ENV` to `development` (OS-agnostic via [cross-env](https://github.com/kentcdodds/cross-env)), and starts the webpack-dev-server, which uses your `webpack.config.js` (more information under [#webpack](#webpack)). In addition, your default browser will open with `http://localhost:3000`

> per default we are using `devtool: 'eval'` for the `start`-command. according to [webpack](https://webpack.js.org/configuration/devtool/#devtool) the performance can be improved considerably, but the line-number is not correct in case of errors. If you need to debug with correct line-numbers you can use `yarn start:debug`

#### `yarn start:debug`

Sets the `--devtool eval-source-map`-flag, see [webpacks documentation](https://webpack.js.org/configuration/devtool/#devtool), the `eval-source-map`-flag is the one with the best performance while sending correct line-numbers (the other flags does not work correct cause we use typescript)

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

## development-utilities

### ESLint

[ESLint](https://eslint.org/) is a linter for your JS-Code. You can use it [via CLI](https://eslint.org/docs/user-guide/command-line-interface) or [integrate it into your development cycle](https://eslint.org/docs/user-guide/integrations).

#### ESLint-settings

TODO

#### ESLint-dependencies

| package                                                                                                     | description                                                                                                                                                                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [eslint](https://github.com/eslint/eslint)                                                                  | see [ESLint](#ESLint)                                                                                                                                                                                                                                                                                                      |
| [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)      | most commonly used lint-rule-set by Airbnb, this automatically includes following plugins: [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import), [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y), [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) |
| [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import)                                   | "ESLint plugin with rules that help validate proper imports."                                                                                                                                                                                                                                                              |
| [eslint-import-resolver-node](https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers/node) | addition to[eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import) to resolve file extensions other than `.js` (e.g. necessary to import `.ts`/`.tsx` files)                                                                                                                                             |
| [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y)                                 | "Static AST checker for accessibility rules on JSX elements."                                                                                                                                                                                                                                                              |
| [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)                                     | "React specific linting rules for ESLint"                                                                                                                                                                                                                                                                                  |
| [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)                                | used via the [Recommended Configuration](https://github.com/prettier/eslint-plugin-prettier#recommended-configuration), so it will also extend the rules via [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)                                                                                  |
| [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)                                | Turns off rules that might conflict with Prettier.                                                                                                                                                                                                                                                                         |

### TSLint

[TSLint](https://palantir.github.io/tslint/) is a [linting tool](<https://en.wikipedia.org/wiki/Lint_(software)>) that checks your TypeScript-Code [via command-line](https://palantir.github.io/tslint/usage/cli/). However, the integration into your development cycle is more comfortable (for example as integration into your IDE like WebStorm or VS code) so that the code is checked quasi "as-you-type", see [TSLints "Third-Party Tools"](https://palantir.github.io/tslint/usage/third-party-tools/).

#### TSLint-settings

TODO

#### TSLint-Dependencies

| package                                                                        | description                                     |
| ------------------------------------------------------------------------------ | ----------------------------------------------- |
| [tslint](https://github.com/palantir/tslint)                                   | see [TSLint](#tslint)                           |
| [tslint-config-prettier](https://github.com/alexjoverm/tslint-config-prettier) | "Use tslint with prettier without any conflict" |
| [tslint-react](https://github.com/palantir/tslint-react)                       | "Lint rules related to React & JSX for TSLint." |

### Prettier

[Prettier](https://prettier.io/) ([prettier github-repo](https://github.com/prettier/prettier)) is a strict code-formatter that [supports many different languages](https://prettier.io/docs/en/language-support.html). Prettier [always tries to guarantee the same code style](https://prettier.io/docs/en/why-prettier.html) and does not take initial formatting into account. This guarantees that even if several people work on a project, the code style remains consistent. The [options to customize the output](https://prettier.io/docs/en/configuration.html) are limited.

### git pre-commit-hooks

Via [husky](https://github.com/typicode/husky) and[lint-staged](https://github.com/okonet/lint-staged) every changed `*.{ts,tsx,js,js,jsx,json,css,md}` file is formatted uniformly before a commit using [Prettier](#prettier), also a `tslint --fix` runs for `*.{ts,tsx}` and a `eslint --fix` for `*.{js,jsx}` before the changed files are re-added.

The setup is according to [lint-staged's documentation](https://github.com/okonet/lint-staged#installation-and-setup), but husky is set up via [`/husky.config.js`](https://github.com/typicode/husky#upgrading-from-014) and lint via [`dev/.lintstagedrc`](https://github.com/okonet/lint-staged#configuration). (`package.json` should not be stuffed senselessly).

## overwiev dependencies and devDependencies

If you ever have trouble understanding why a dependency is in `package.json` you can find an overview here, which refers to the corresponding documentation section.

### dependencies

| package                                                                       | link to documenation                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@babel/runtime](https://babeljs.io/docs/en/next/babel-runtime.html)          | [babel-helper-functions via babel-runtime for smaller bundle-size](#babel-helper-functions-via-babel-runtime-for-smaller-bundle-size)                                                                                                                                                                                                                                                                                      |
| [object-assign](https://github.com/sindresorhus/object-assign)                | [polyfills](#polyfills)                                                                                                                                                                                                                                                                                                                                                                                                    |
| [promise](https://github.com/then/promise)                                    | [polyfills](#polyfills)                                                                                                                                                                                                                                                                                                                                                                                                    |
| [prop-types](https://github.com/facebook/prop-types)                          | So you can use prop-types in your `*.js`-files                                                                                                                                                                                                                                                                                                                                                                             |
| [react"](https://github.com/facebook/react)                                   | A React-App without the react-package doesn't make that much sense ;)                                                                                                                                                                                                                                                                                                                                                      |
| [react-dom](https://github.com/facebook/react/tree/master/packages/react-dom) | "This package serves as the entry point of the DOM-related rendering paths. It is intended to be paired with the isomorphic React, which will be shipped as react to npm."                                                                                                                                                                                                                                                 |
| [react-loadable](https://github.com/jamiebuilds/react-loadable)               | A nice library for [code splitting via webpack](https://webpack.js.org/guides/code-splitting/) and [dynamic `import()` calls](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports).<br /> This library also [automatically supports HMR](https://github.com/gaearon/react-hot-loader#code-splitting) for your dynamic imports (see [react-hot-loader](#react-hot-loader)). |

### devDependencies

The `@types/...`-devDependencies are omitted to explain, have a look at the [DefinitelyTyped-project](https://github.com/DefinitelyTyped/DefinitelyTyped) for more information.

| package                                                                                                                    | link to documenation                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [@babel/core](https://new.babeljs.io/docs/en/next/babel-core.html)                                                         | [babel](#babel)                                                                                                                               |
| [@babel/plugin-proposal-class-properties](https://new.babeljs.io/docs/en/next/babel-plugin-proposal-class-properties.html) | [babel-dependencies](#babel-dependencies)                                                                                                     |
| [@babel/plugin-proposal-object-rest-spread](https://babeljs.io/docs/en/next/babel-plugin-proposal-object-rest-spread.html) | [babel-dependencies](#babel-dependencies)                                                                                                     |
| [@babel/plugin-syntax-dynamic-import](https://new.babeljs.io/docs/en/next/babel-plugin-syntax-dynamic-import.html)         | [babel-dependencies](#babel-dependencies)                                                                                                     |
| [@babel/plugin-transform-runtime](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime.html)                     | [babel-helper-functions via babel-runtime for smaller bundle-size](#babel-helper-functions-via-babel-runtime-for-smaller-bundle-size)         |
| [@babel/preset-env](https://new.babeljs.io/docs/en/next/babel-preset-env.html)                                             | [babel-dependencies](#babel-dependencies) and [polyfills via babel-polyfill (not recommended)](#polyfills-via-babel-polyfill-not-recommended) |
| [@babel/preset-react](https://new.babeljs.io/docs/en/next/babel-preset-react.html)                                         | [babel-dependencies](#babel-dependencies)                                                                                                     |
| [babel-core@7.0.0-bridge.0](https://github.com/babel/babel-bridge)                                                         | [further babel-dependencies](#further-babel-dependencies)                                                                                     |
| [babel-jest](https://github.com/facebook/jest/tree/master/packages/babel-jest)                                             | [further babel-dependencies](#further-babel-dependencies)                                                                                     |
| [babel-loader@8.0.0-beta.4](https://github.com/babel/babel-loader)                                                         | [further babel-dependencies](#further-babel-dependencies)                                                                                     |
| [react-hot-loader](https://github.com/gaearon/react-hot-loader)                                                            | [further babel-dependencies](#further-babel-dependencies) + [react-hot-loader](#react-hot-loader)                                             |
| [babel-plugin-dynamic-import-node](https://github.com/airbnb/babel-plugin-dynamic-import-node)                             | [`test`-specific options](#test-specific-options)                                                                                             |
| [typescript](https://github.com/Microsoft/TypeScript)                                                                      | [TypeScript](#typescript)                                                                                                                     |
| [webpack](https://github.com/webpack/webpack)                                                                              | [webpack](#webpack)                                                                                                                           |
| [webpack-cli](https://github.com/webpack/webpack-cli)                                                                      | [webpack-dependencies](#webpack-dependencies) + [`yarn build`](#yarn-build)                                                                   |
| [webpack-dev-server](https://github.com/webpack/webpack-dev-server)                                                        | [webpack-dependencies](#webpack-dependencies) + [`yarn start`](#yarn-start)                                                                   |
| [file-loader](https://github.com/webpack-contrib/file-loader)                                                              | [webpack-dependencies](#webpack-dependencies) + [caching of your assets](#caching-of-your-assets)                                             |
| [css-loader](https://github.com/webpack-contrib/css-loader)                                                                | [css-configuration](#css-configuration)                                                                                                       |
| [style-loader](https://github.com/webpack-contrib/style-loader)                                                            | [css-configuration](#css-configuration)                                                                                                       |
| [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)                                      | [css-configuration](#css-configuration) + [caching of your assets](#caching-of-your-assets)                                                   |
| [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin)                           | [css-configuration](#css-configuration)                                                                                                       |
| [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)                                                     | [webpack-dependencies](#webpack-dependencies)                                                                                                 |
| [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin)                                      | [webpack-dependencies](#webpack-dependencies)                                                                                                 |
| [dotenv](https://github.com/motdotla/dotenv)                                                                               | [webpack-dependencies](#webpack-dependencies)                                                                                                 |
| [cross-env](https://github.com/kentcdodds/cross-env)                                                                       | [npm-/yarn-scripts](#npm-yarn-scripts)                                                                                                        |
| [ncp](https://github.com/AvianFlu/ncp)                                                                                     | [`yarn start`](#yarn-start)                                                                                                                   |
| [rimraf](https://github.com/isaacs/rimraf)                                                                                 | [`yarn start`](#yarn-start)                                                                                                                   |
| [jest](https://github.com/facebook/jest)                                                                                   | [jest](#jest)                                                                                                                                 |
| [jest-enzyme](https://github.com/FormidableLabs/enzyme-matchers/tree/master/packages/jest-enzyme)                          | [jest-enzyme](#jest-enzyme)                                                                                                                   |
| [enzyme](https://github.com/airbnb/enzyme)                                                                                 | [jest-dependencies](#jest-dependencies) + [jest-enzyme](#jest-enzyme)                                                                         |
| [enzyme-adapter-react-16](https://github.com/airbnb/enzyme/blob/master/docs/installation/react-16.md)                      | [jest-dependencies](#jest-dependencies) + [jest-enzyme](#jest-enzyme)                                                                         |
| [eslint](https://github.com/eslint/eslint)                                                                                 | [ESLint](#eslint)                                                                                                                             |
| [eslint-config-airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)                     | [ESLint-dependencies](#eslint-dependencies)                                                                                                   |
| [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import)                                                  | [ESLint-dependencies](#eslint-dependencies)                                                                                                   |
| [eslint-import-resolver-node](https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers/node)                | [ESLint-dependencies](#eslint-dependencies)                                                                                                   |
| [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y)                                                | [ESLint-dependencies](#eslint-dependencies)                                                                                                   |
| [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)                                                    | [ESLint-dependencies](#eslint-dependencies)                                                                                                   |
| [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)                                               | [ESLint-dependencies](#eslint-dependencies)                                                                                                   |
| [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)                                               | [ESLint-dependencies](#eslint-dependencies)                                                                                                   |
| [tslint](https://github.com/palantir/tslint)                                                                               | [TSLint](#tslint)                                                                                                                             |
| [tslint-config-prettier](https://github.com/alexjoverm/tslint-config-prettier)                                             | [TSLint-Dependencies](#tslint-dependencies)                                                                                                   |
| [tslint-react](https://github.com/palantir/tslint-react)                                                                   | [TSLint-Dependencies](#tslint-dependencies)                                                                                                   |
| [husky](https://github.com/typicode/husky)                                                                                 | [git-utilities](#git-pre-commit-hooks)                                                                                                        |
| [lint-staged](https://github.com/okonet/lint-staged)                                                                       | [git-utilities](#git-pre-commit-hooks)                                                                                                        |
| [prettier](https://github.com/prettier/prettier)                                                                           | [git-utilities](#git-pre-commit-hooks)                                                                                                        |

## To Observe

- [webpack-serve](https://github.com/webpack-contrib/webpack-serve)
  - seems to be the succesor of webpack-dev-server, [which is only in maintenance mode](https://github.com/webpack/webpack-dev-server#project-in-maintenance)
  - => but currently there are no reasonable examples or the like. why webpack-dev-server is the better way up-to-date (08/2018)
- reduce [moment-js](http://momentjs.com/)-bundle-size via the []webpacks `IgnorePlugin`](https://webpack.js.org/plugins/ignore-plugin/), see ["How to optimize moment.js with webpack"](https://github.com/jmblog/how-to-optimize-momentjs-with-webpack#using-ignoreplugin)
- performance-regression with [`collapse_vars`](https://github.com/mishoo/UglifyJS2#compress-options) (uglify-js2) checken: [uglifyjs-issue](https://github.com/mishoo/UglifyJS2/issues/3174), [terser-issue](https://github.com/terser-js/terser/issues/50), [cra-issue](https://github.com/facebook/create-react-app/issues/5103#issuecomment-424903155)
  - currently added `collapse_vars: false` in `dev/webpack/ugilfyJsPluginOptions.js`
  - zum beispiel für komplettes apoly-projekt (ca 5MiB bundled) war der Unterschied ~3KiB => VERNACHLÄSSIGBAR
  - [CRA](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.prod.js#L123-L159) nutzt [terser](https://github.com/terser-js/terser) + [webpack-terser](https://github.com/webpack-contrib/terser-webpack-plugin), für apoly testweise code eingebaut: terser ist langsamer (112s vs 81s) und schlechter (20188KiB vs 19846KiB, diff 342KiB) als uglify mit `collapse_vars: false`
- Ist babel-preset-env wirklich notwendig, bzw vllt mit einer neueren browserslist-config in preset-env (zb ">5%"), um sicherzugehen dass nicht jeder müll für IE11 kompiliert wird, in dem fall muss auch wider auf terser anstatt uglifyj umgestiegen werden da uglifyjs nur es5 kann

## (intern): Idee das Projekt von der Nutzung ähnlich wie CRA zu machen:

- das auslagern mit all den dependencies und doku in ein projekt was übe cmd-line angesteuert werden kann
- node-js-api anbieten sodass die webpack/babel-config verfügbar ist und man leicht Anpassungen vornehmen kann mit eigener config
  - webpack-cli und webpack-dev-server muss dann selbst hinzugefügt werden um es entsprechend zu nutzen
- mono-repo dafür erstellen,
  - single packages für (erster spontan-entwurf):
    - babel (create-script für standard-babel-objekt)
    - webpack (create-script für config)
    - eslint
    - tslint
  - zu überlegen:
    - jest (config auslagern?)
    - TypeScript (tsconfig)
  - die einzelnen projekte exportieren jeweils die configs, wenn man etwas anpassen möchte sollte das einzelne projekt als dependency mit genutzt werden sodass man das script selbst anpassen kann auf grundlage des config-objektes

## TODO

check + document:

- [optimization.splitChunks](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunks-maxasyncrequests) => sollte man machen habe aktuell mit paar werten rumgespielt, zb ist aktuell "all" anscheinend nicht so geil, maxSize sinnvoll mit http/2
- [runtimechunk](https://webpack.js.org/configuration/optimization/#optimization-runtimechunk) sollte true sein da sonst bei eine änderung quasi jedes chunk einen neuen hash bekommt und nichts gecached werden kann, mit runtimeChunk werdend ie hash werte hier rein geschrieben sodass nicht geänderte files gleich bleiben
- [opt-in useESModules:"auto"](https://github.com/babel/babel/pull/8520) => in bezug auf [babel-runtime-plugin](https://babeljs.io/docs/en/next/babel-plugin-transform-runtime#useesmodules), sollte ich checken wenn documentation besser ist
  - [supportsStaticESM](https://github.com/babel/babel/pull/8520) : ist vielleicht auch nur ne interne option, sollte ich prüfen wenn die documentation bissel stabiler ist

gut info auch der Medium-Artikel [webpack 4: Code Splitting, chunk graph and the splitChunks optimization](https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366)
