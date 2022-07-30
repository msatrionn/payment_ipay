module.exports = {
  configureWebpack: {
    devServer: {
      proxy: "http://localhost:3300",
      headers: { "Access-Control-Allow-Origin": "*" },
    },
  },
};
