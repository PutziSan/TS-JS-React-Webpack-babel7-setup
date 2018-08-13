const reactPreset = require('@babel/preset-react').default;
const typescriptPreset = require('@babel/preset-typescript').default;
const envPreset = require('@babel/preset-env').default;
const classPropertiesPlugin = require('@babel/plugin-proposal-class-properties')
  .default;
const dynamicImportSyntaxPlugin = require('@babel/plugin-syntax-dynamic-import')
  .default;
const runtimeTransformPlugin = require('@babel/plugin-transform-runtime')
  .default;
const reactHotLoaderPlugin = require('react-hot-loader/babel');
const dynamicImportForNodePlugin = require('babel-plugin-dynamic-import-node');

module.exports = api => {
  api.cache(() => process.env.NODE_ENV);

  const isDev = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';
  const isProd = process.env.NODE_ENV === 'production';

  return {
    presets: [
      !isDev && [
        envPreset,
        {
          modules: isTest ? 'commonjs' : false,
          targets: {
            browsers: ['>0.25%']
          }
        }
      ],
      reactPreset,
      typescriptPreset
    ].filter(Boolean),
    plugins: [
      isDev && reactHotLoaderPlugin,
      [classPropertiesPlugin, { loose: true }],
      isTest ? dynamicImportForNodePlugin : dynamicImportSyntaxPlugin,
      isProd && [
        runtimeTransformPlugin,
        { useESModules: true, regenerator: false, corejs: false }
      ]
    ].filter(Boolean)
  };
};
