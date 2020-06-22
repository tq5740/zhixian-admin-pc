/**
 * @module auto.js
 * @author lose_kl<https://github.com/NeverMore-KL>
 * @summary 自动部署 2018-9-17 如果更改文件夹名称与服务器所放的目录则需要修改本文件对应的路径
 */

const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const archiver = require("archiver");
const node_ssh = require("node-ssh");
const client = require("scp2");
const cheerio = require("cheerio");
const ssh = new node_ssh();
const $ = cheerio.load(fs.readFileSync("./dist_zp-admin/index.html", "utf-8"));
const version = $(`meta[name="version"]`).attr("content");
const name = `zp-admin-V-${version}.zip`;
const filePwd = unisep(path.resolve("./") + "/" + name);
const config = require("../../config.json");
const archive = archiver("zip", {
  zlib: { level: 9 } // Sets the compression level.
});
const output = fs.createWriteStream(filePwd);
output.on("close", function() {
  console.log("文件大小:" + archive.pointer() / 1024 + "k");
  console.log("压缩完成!");
  console.log("----准备上传中----");
  client.scp(
    filePwd,
    `${config.username}:${config.password}@${config.host}:/data/front/`,
    function(err) {
      if (err) throw err;
      console.log("传输完成!");
      new client.Client().close();
      console.info("断开连接!");
      rimraf.sync("./*.zip");
      console.warn("删除本地zip!");
      console.log("----连接服务器----");
      ssh
        .connect({
          host: config.host,
          username: config.username,
          password: config.password
        })
        .then(res => {
          console.log("服务器连接成功");
          ssh
            .execCommand(
              `rm -rf /data/www/zp-admin/* && unzip /data/front/${name} -d /data/www/zp-admin/`
            )
            .then(res => {
              console.log("管理站部署成功!");
              ssh.dispose();
              console.log("断开连接!");
            })
            .catch(e => {
              console.log("错误:", e);
            });
        });
    }
  );
});

output.on("end", function() {
  console.log("Data has been drained");
});

archive.on("warning", function(err) {
  if (err.code === "ENOENT") {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

archive.on("error", function(err) {
  throw err;
});

archive.pipe(output);
archive.directory("dist_zp-admin/", false);

archive.finalize();

function unisep(url) {
  return url.replace(/[\\\\/]/g, "/");
}
