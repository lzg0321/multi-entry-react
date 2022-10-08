// const IS_SEO_BUILD = !!process.env.REACT_APP_SEO_BUILD;
const paths = require("./config/paths");
const path = require("path");
const ManifestPlugin = require("webpack-manifest-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const fromEntries = require("core-js/stable/object/from-entries");
const slash = require("slash");
const relative = (from, to) => slash(path.relative(from, to));

module.exports = {
  webpack: function (config, env) {
    const isEnvDevelopment = env === "development";
    const isEnvProduction = env === "production";
    const publicPath = paths.app.servedPath;
    const servedPath = paths.app.servedPath;
    config.entry = paths.app.entries;
    config.output = {
      path: paths.app.build,
      filename: "[name].[hash:8].js",
      chunkFilename: "[name].[hash:8].chunk.js",
      publicPath,
      devtoolModuleFilenameTemplate: isEnvProduction
        ? (info) =>
            path
              .relative(paths.appSrc, info.absoluteResourcePath)
              .replace(/\\/g, "/")
        : isEnvDevelopment &&
          ((info) =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")),
      library: "c24pr"
    };

    config.plugins.forEach((p, i) => {
      if (p instanceof HtmlWebpackPlugin) {
        //delete p;
        config.plugins.splice(i, 1);
      }
      if (p instanceof webpack.HotModuleReplacementPlugin) {
        //delete p;
        config.plugins.splice(i, 1);
      }
      if (p instanceof ManifestPlugin) {
        //delete p;
        config.plugins.splice(
          i,
          1,
          new ManifestPlugin({
            fileName: "manifest.json",
            publicPath: servedPath,
            generate: (seed, files, entrypoints) => {
              const basenameToPath = {};
              const manifestFiles = files.reduce(function (manifest, file) {
                manifest[file.name] = file.path;
                basenameToPath[relative(servedPath, file.path)] = file.path;
                return manifest;
              }, seed);
              return {
                servedPath,
                ...manifestFiles,
                entrypoints: fromEntries(
                  Object.entries(entrypoints).map(([entrypoint, files]) => [
                    entrypoint,
                    files.map((file) => basenameToPath[file])
                  ])
                ),
                basenameToPath
              };
            }
          })
        );
      }
    });

    console.log("config: ", config, servedPath);

    return config;
  }
};
