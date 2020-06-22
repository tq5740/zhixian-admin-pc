/*
 module:
    自定义webpack
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-7-11:自定义webpack
 */
const path = require("path");
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
function resolve(dir) {
  return path.join(__dirname, dir);
}
function getPwd() {
  var pwd = isWin() ? path.resolve("./") + "\\" : path.resolve("./") + "/";
  return pwd;
}

function isWin() {
  return process.platform !== "darwin";
}

function getDirName() {
  const dirName = getPwd();
  let reg, tmpArr;
  isWin() ? (reg = /([^\\]+)/g) : (reg = /([^/]+)/g);
  tmpArr = dirName.match(reg);
  return tmpArr[tmpArr.length - 1];
}
module.exports = {
  productionSourceMap: false,
  lintOnSave: true,
  css: {
    loaderOptions: {
      // pass options to sass-loader
      sass: {
        data: `@import "@/style/common.scss";`
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set("@api", resolve("src/api/modules"))
      .set("@c", resolve("src/components"))
      .set("@style", resolve("src/style"))
      .set("@utils", resolve("src/utils"))
      .end();
    config.plugin("html").tap(args => {
      args[0].version = new Date().toLocaleString().replace(/\s/g, "--");
      return args;
    });
  },
  outputDir: `dist_${getDirName()}`,
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.plugins = [
        ...config.plugins,
        new SpeedMeasurePlugin(),
        new ParallelUglifyPlugin({
          cacheDir: ".cache/",
          uglifyJS: {
            output: {
              comments: false
            },
            warnings: false,
            compress: {
              drop_console: true,
              // 内嵌定义了但是只用到一次的变量
              collapse_vars: true,
              // 提取出出现多次但是没有定义成变量去引用的静态值
              reduce_vars: true
            }
          }
        })
      ];
    }
  },

  // devServer:https://github.com/toBeTheLight/vue-cli-3.x-doc-cn/blob/dev/zh-cn/cli-service.md#configuring-proxy
  devServer: {
    port: 9090,
    proxy: {
      "/apisso": {
        target: "http://10.3.1.34:8081",
        changeOrigin: true,
        pathRewrite: {
          "^/apisso": ""
        }
      }
    }
  }
};
