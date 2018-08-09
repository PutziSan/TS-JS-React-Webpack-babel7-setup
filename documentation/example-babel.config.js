const reactPreset = require.resolve('@babel/preset-react');
const typescriptPreset = require.resolve('@babel/preset-typescript');
const envPreset = require.resolve('@babel/preset-env');

const reactHotLoaderPlugin = require.resolve('react-hot-loader/babel');

const classPropertiesPlugin = require.resolve(
  '@babel/plugin-proposal-class-properties'
);
const dynamicImportSyntaxPlugin = require.resolve(
  '@babel/plugin-syntax-dynamic-import'
);

const dynamicImportForNodePlugin = require.resolve(
  'babel-plugin-dynamic-import-node'
);

module.exports = api => {
  api.cache(false);

  const isDev = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';

  console.log(process.env.NODE_ENV, process.env.BABEL_ENV);

  return {
    presets: [
      reactPreset,
      typescriptPreset,
      [
        envPreset,
        {
          modules: isTest ? 'commonjs' : false,
          targets: {
            browsers: ['>0.25%']
          }
        }
      ]
    ],
    plugins: [
      isDev && reactHotLoaderPlugin,
      [classPropertiesPlugin, { loose: true }],
      isTest ? 'dynamicImportForNodePlugin' : dynamicImportSyntaxPlugin
    ].filter(Boolean)
  };
};
