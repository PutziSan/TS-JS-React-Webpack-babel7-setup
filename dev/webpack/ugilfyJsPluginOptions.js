module.exports = {
  uglifyOptions: {
    output: {
      comments: false,
    },
    compress: {
      collapse_vars: false,
    },
  },
  parallel: true,
  cache: true,
  sourceMap: true,
};
