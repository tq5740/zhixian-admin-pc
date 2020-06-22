/*
 module:
    utils index.ts
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-7-11 add some func
 */

//import html2Canvas from 'html2canvas'
//import JsPDF from 'jspdf'
import Vue from 'vue'

export function getAppVersion(): string {
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    return "ios";
  } else if (/(Android)/i.test(navigator.userAgent)) {
    return "android";
  } else {
    return "pc";
  }
}
export function sleep(time: number): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
export function matchUrl(url: string): Array<any> {
  let result = url.match(/([^/]+)/g);
  return result || [];
}
export function setStorage(name: string, data: any) {
  try {
    window.localStorage.setItem("local_test", "ok");
  } catch (_) {
    alert("请关闭无痕模式以便正常使用功能");
    return false;
  }
  if (!name) return;
  window.localStorage.setItem(name, JSON.stringify(data));
}
/**
 *
 * @param name 缓存的名字
 * @param isPure 师傅需要 JSONParse
 */
export function getStorage(name: string, isPure: boolean = false): any {
  if (!name) return;
  if (isPure) return window.localStorage.getItem(name);
  var data = window.localStorage.getItem(name);
  return data ? JSON.parse(data) : null;
}
/**
 * 获取类型
 */
const _toString = Object.prototype.toString;

export function toRawType(value: any): string {
  return _toString.call(value).slice(8, -1);
}

export function isPlainObject(obj: any): boolean {
  return _toString.call(obj) === "[object Object]";
}
export function isEmptyObject(e: object): boolean {
  if (!isPlainObject(e)) {
    throw new Error(
      "you have to pass in an object like {},{a:1}. not array or null or other"
    );
  }
  var t;
  for (t in e) return !1;
  return !0;
}

export interface MapTypeStr {
  (id: string | number, datas: any[]): string;
}
export function mapTypeStr(id: string | number, datas: any[]): string {
  let str: string = "";
  datas.forEach(i => {
    if (i.id == id) {
      str = i.text;
    }
  });
  return str;
}
/**
 *
 * @param timeStr yyyy-mm-dd hh:mm:ss
 *
 */
export function getTimeStamp(timeStr: string): number {
  var dateStr = timeStr.replace(/-/g, "/");
  return +new Date(dateStr);
}

/**
 *
 * @param time 时间戳
 * @param format 需要格式的类型 `YYYY-MM-DD h:m:s` `YYYY-MM-DD` `h:m:s`等
 */
export interface FormatDate {
  (time: number, fmt?: string): string;
}


// export function getPDF(htmlTitle: string, dom: any = "#pdfDom") {
//   var c: any = document.createElement("canvas")
//   var opts = {
//     scale: 2,
//     canvas: c,
//     logging: true,
//     width: document.querySelector(dom).width,
//     height: document.querySelector(dom).height
//   };
//   c.width = document.querySelector(dom).width * 2
//   c.height = document.querySelector(dom).height * 2
//   c.getContext("2d").scale(2, 2);
//   html2Canvas(document.querySelector(dom), opts).then(function (canvas: any) {
//     let contentWidth = canvas.width
//     let contentHeight = canvas.height
//     let pageHeight = contentWidth / 592.28 * 841.89
//     let leftHeight = contentHeight
//     let position = 0
//     let imgWidth = 595.28
//     let imgHeight = 592.28 / contentWidth * contentHeight
//     let pageData = canvas.toDataURL('image/jpeg', 1.0)
//     let PDF = new JsPDF('', 'pt', 'a4')
//     if (leftHeight < pageHeight) {
//       PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
//     } else {
//       while (leftHeight > 0) {
//         PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
//         leftHeight -= pageHeight
//         position -= 841.89
//         if (leftHeight > 0) {
//           PDF.addPage()
//         }
//       }
//     }
//     PDF.save(htmlTitle + '.pdf')
//   })
// }

export function formatDate(
  time: number,
  fmt: string = `YYYY-MM-DD hh:mm:ss`
): string {
  var date = new Date(time);
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  var o = {
    "M+": date.getMonth() + 1,
    "D+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };

  for (var i in o) {
    if (new RegExp("(" + i + ")").test(fmt)) {
      //@ts-ignore
      var str = o[i] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : str.padLeft("0", 2)
      );
    }
  }
  return fmt;
}

/**
 *
 * @param a 秒
 */
export interface FormatSeconds {
  (a: number): string;
}
export function formatSeconds(a: number) {
  if(a != null){
    var hh = Math.floor(a/3600);
    var mm = Math.floor((a-hh*3600)/60);
    var ss = Math.floor((a-hh*3600)%60);
    var length = (hh<10 ? "0" + hh : hh) + ":" + (mm < 10 ? "0" + mm : mm) + ":" + (ss < 10 ? "0" + ss : ss);
    if(a>0){
      return length;
    }else{
      return "00:00:00";  
    }
  } else {
    return "00:00:00";
  } 
}  
/**
 *
 * @param allTree 需要遍历的树
 * @param name value对应的名
 * @param title label对应的数据
 * @param initArr 最终处理好的树
 */
export interface ForTree {
  (allTree: any[], name: string, title: string, initArr?: any[]): any[];
}
export function forTree(
  allTree: any[],
  name: string,
  title: string,
  initArr: any[] = []
): any[] {
  //循环列表
  if (allTree && allTree.length > 0) {
    allTree.forEach((i: any, k: number) => {
      initArr.push({
        value: i[name],
        label: i[title],
        children: i.length === 0 ? null : [], // i.children.length
        parentId: i.parentId,
        title: i[name],
        hierarchy: i.hierarchy || "",
        type: i.type
      });
      if (initArr[k].children !== null) {
        forTree(i.children, name, title, initArr[k].children);
      }
    });
  }
  return [...initArr];
}

export function getIsCheckArr(
  allArr: object[],
  lastArr: string[] = [],
  arr: any[] = []
): string[] {
  //循环列表
  if (allArr.length > 0) {
    allArr.forEach((i: any, k: number) => {
      arr.push({
        children: [],
        methodId: i.methodId
      });

      if (i.isCheck) {
        if (i.children.length === 0) {
          lastArr.push(i.methodId);
        }
        if (arr[k]) {
          getIsCheckArr(i.children, lastArr, arr[k].children);
        }
      }
    });
  }
  return lastArr;
}

/**
 *
 * @param arr 查找的数组
 * @param allTree 所有的树
 * @param isNeedSelf 是否需要返回自己
 * @param idName name
 */
export interface GetFather {
  (
    arr: any[],
    allTree: any[],
    key: string,
    isNeedSelf?: boolean,
    needArr?: any[]
  ): any[];
}
export function getFather(
  arr: any[],
  allTree: any[],
  key: string,
  isNeedSelf: boolean = false,
  needArr: any[] = []
): any[] {
  arr.forEach((i: any) => {
    if (i.children && i.children.length !== 0) {
      getFather(i.children, allTree, key, isNeedSelf, needArr);
    }
    if (key == i.value || key == i.hierarchy) {
      let v = i.parentId;
      getFather(allTree, allTree, v, isNeedSelf, needArr);
      needArr.push(i.value);
    } else if (key == i.categoryId || key == i.examPointId) {
      let v = i.parentId;
      getFather(allTree, allTree, v, isNeedSelf, needArr);
      needArr.push(i.categoryId || i.examPointId);
    }
  });
  return isNeedSelf ? [...needArr] : needArr.slice(0, needArr.length - 1);
}

export interface GetApiTime {
  (dataArr: string[]): string[];
}
export function getApiTime(dataArr: string[]): string[] {
  return [`${dataArr[0]} 00:00:00`, `${dataArr[1]} 23:59:59`];
}

/**
 * @param size 当前大小b
 * @param mb 兆数
 */
export function checkSize(size: number, mb: number): boolean {
  return 1024 * 1024 * mb < size;
}

export function getObjectURL(file: any) {
  var url = null;
  //@ts-ignore
  if (window.createObjectURL != undefined) {
    //@ts-ignore
    url = window.createObjectURL(file);
  } else if (window.URL != undefined) {
    //mozilla(firefox)兼容火狐
    url = window.URL.createObjectURL(file);
    //@ts-ignore
  } else if (window.webkitURL != undefined) {
    //webkit or chrome
    //@ts-ignore
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}

export function converImgTobase64(
  url: string,
  callback: Function,
  outputFormat: string
) {
  return new Promise(resolve => {
    var canvas = document.createElement("CANVAS"),
      //@ts-ignore
      ctx = canvas.getContext("2d"),
      img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      //@ts-ignore
      canvas.height = img.height;
      //@ts-ignore
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      //@ts-ignore
      var dataURL = canvas.toDataURL(outputFormat, 0.8);
      callback.call(this, dataURL);
      //@ts-ignore
      canvas = null;
      resolve(callback.call(this, dataURL));
    };
    img.src = url;
  });
}
export function dataURLtoBlob(dataurl: string) {
  var arr = dataurl.split(","),
    //@ts-ignore
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
/**
 *
 * @param file 图片 压缩成jpg 80%质量
 */
export function miniSizePic(file: any) {
  return new Promise(resolve => {
    let objUrl = getObjectURL(file);
    converImgTobase64(
      objUrl,
      function (base64Str: string) {
        var file = dataURLtoBlob(base64Str);
        return file;
      },
      `image/jpeg`
    ).then(res => {
      resolve(res);
    });
  });
}
// 该函数只作为图表查询7天方法使用,如需获取请将00 00 00 改为对应的时分秒
export function get7DaysBefore(
  is: boolean = true,
  date: any = new Date(),
  d: number = 6
) {
  var timestamp, newDate;
  if (!(date instanceof Date)) {
    date = new Date(date.replace(/-/g, "/"));
  }
  timestamp = date.getTime();
  // 包含今天-6
  newDate = new Date(timestamp - d * 24 * 3600 * 1000);
  var t = is
    ? [
      [
        newDate.getFullYear() + "-",
        (newDate.getMonth() + 1) < 10 ? "0" + (newDate.getMonth() + 1) + "-" : (newDate.getMonth() + 1) + "-",
        newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate()
      ].join(""),
      ["00", "00", "00"].join(":")
    ].join(" ")
    : [
      newDate.getFullYear(),
      (newDate.getMonth() + 1) < 10 ? "0" + (newDate.getMonth() + 1) : newDate.getMonth() + 1,
      newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate()
    ].join("");
  return t;
}
// 该函数只作为图表查询当天方法使用,如需获取请将59 59 59 去除
export function getNow(is: boolean = true) {
  var date = new Date(Date.now());
  var Y = date.getFullYear() + (is ? "-" : "");
  var M = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) + (is ? "-" : "") : (date.getMonth() + 1) + (is ? "-" : "");
  var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return is ? Y + M + D + " " + "23:59:59" : Y + M + D;
}

export function checkSite(site: string) {
  const reg: RegExp = /([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-.,@?^=%&:~+#]*)+)?$/;
  return reg.test(site);
}
/**
 *
 * @param str 纯数字
 */
export function checkNum(str: string): boolean {
  return /^[0-9]*$/.test(str);
}
/**
 *
 * @param str 手机号
 */
export function mobileReg(str: string): boolean {
  return /^[0-9]\d{10}$/.test(str);
}

/**
 *
 * @param str 邮箱号
 */
export function emailReg(str: string): boolean {
  return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(str);
}

/**
 *
 * @param data 最后一层[]的改成null
 */

export function emptyLast(data: any) {
  data.forEach((e: any) => {
    if (e.children && e.children.length) {
      emptyLast(e.children);
    } else {
      e.children = null;
    }
  });
  return data;
}

export function dataURLtoFile(dataurl: any, filename: any) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}


