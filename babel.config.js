/* eslint-disable import/no-extraneous-dependencies */
const reactPreset = require('@babel/preset-react').default;
const typescriptPreset = require('@babel/preset-typescript').default;
const envPreset = require('@babel/preset-env').default;
const classPropertiesPlugin = require('@babel/plugin-proposal-class-properties')
  .default;
const objectSpreadTransformation = require('@babel/plugin-proposal-object-rest-spread')
  .default;
const dynamicImportSyntaxPlugin = require('@babel/plugin-syntax-dynamic-import')
  .default;
const reactHotLoaderPlugin = require('react-hot-loader/babel');
const dynamicImportForNodePlugin = require('babel-plugin-dynamic-import-node');

module.exports = api => {
  // api.cache(() => process.env.NODE_ENV);
  api.cache.never();

  const isDev = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';
  const isProd = process.env.NODE_ENV === 'production';

  return {
    presets: [
      // rewrite import to require for jest-test
      isTest && [
        envPreset,
        {
          modules: 'commonjs',
        },
      ],
      [reactPreset, { useBuiltIns: true, development: !isProd }],
      typescriptPreset,
    ].filter(Boolean),
    plugins: [
      isDev && reactHotLoaderPlugin,
      [classPropertiesPlugin, { loose: true }],
      [objectSpreadTransformation, { useBuiltIns: true }],
      isTest ? dynamicImportForNodePlugin : dynamicImportSyntaxPlugin,
    ].filter(Boolean),
  };
};
