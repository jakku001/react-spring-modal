const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const exampleRoot = "./example";

module.exports = {
  mode: "development",
  entry: path.resolve(exampleRoot, "src/index.js"),
  resolve: {
    fallback: {
      crypto: false,
      constants: false,
      stream: false,
      assert: false,
    },
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|jsx)$/,
            loader: "babel-loader",
            exclude: /node_modules/,
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: "../",
                },
              },
              "css-loader",
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[chunkhash:8].css",
      chunkFilename: "[id].css",
    }),
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      inject: true, //inject all js at the bottom of the body
      template: path.resolve(exampleRoot, "src/index.html"), //source file
    }),
  ],
  devServer: {
    historyApiFallback: false,
    port: 3000,
  },
};
