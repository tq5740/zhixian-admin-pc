const fs = require("fs");
try {
    fs.statSync(`api.json`);
} catch (error) {
    console.log("项目不存在api.json,将自动为您创建");
    fs.writeFileSync(
        "api.json",
        `{
    "publics": "http://10.3.1.34:8001/publics",
    "user": "http://10.3.1.34:8002/user",
    "permission": "http://10.3.1.34:8003/permission",
    "article": "http://10.3.1.34:8004/article",
    "train": "http://10.3.1.34:8005/train",
    "live": "http://10.3.1.34:8006/live",
    "exam": "http://10.3.1.34:8007/exam",
    "eval": "http://10.3.1.34:8008/eval",
    "advert": "http://10.3.1.34:8009/advert",
    "work": "http://10.3.1.34:8010/work"
  }
  `,
        "utf8",
        err => {
            if (err) throw err;
            console.log(
                "创建成功!如需修改开发模式的api,请修改此文件,此文件不会提交到git"
            );
        }
    );
}