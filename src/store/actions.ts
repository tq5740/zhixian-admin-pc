/*
 module:
   action
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-6:method 
 */
import Method from "@api/method";
import Org from "@api/org";
import Classify from "@api/classify";
import User from "@api/user"
import Post from "@api/post";
import Dept from "@api/dept";
import System from "@api/system";
import { dataURLtoFile } from "@utils/index";
export default {
  //@ts-ignore
  getMethodTree({ commit }, data) {
    return Method.queryMethodTree(data).then(res => {
      if (res.code === 0) {
        commit("setPermissionList", res.data);
      }
    });
  },
  //@ts-ignore
  getJobclassifyTree({ commit }) {
    return Classify.getJobclassifyTree().then(res => {
      if (res.code === 0) {
        commit("setJobClassify", res.data);
      }
    });
  },
  //@ts-ignore
  getPostTree({ commit }) {
    return Post.queryPostTree().then(res => {
      if (res.code === 0) {
        commit("setPostTree", res.data);
      }
    });
  },
  //@ts-ignore
  getDeptTree({ commit }) {
    return Dept.deptList().then(res => {
      if (res.code === 0) {
        commit("setDeptTree", res.data);
      }
    });
  },
  //@ts-ignore
  getMyOrgList({ commit }) {
    return Org.queryMyorgList().then(res => {
      if (res.code === 0) {
        commit("setMyOrgList", res.data);
      }
    });
  },
  updatePassword(commit: any, data: any) {
    return User.updatePassword({ data });
  },
  setUploadImage(commit: any, files: any, path: any, type: any) {
    let _this: any = this;
    return new Promise((resolve: any, reject: any) => {
      let zoom = files.size >= 1024 * 1024 * 2 ? 0.3 : 1;
      let canvas = document.createElement('canvas');
      let ctx: any = canvas.getContext('2d');
      let img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.src = files;
      img.onload = function () {
        canvas.width = Math.round(img.width * zoom);
        canvas.height = Math.round(img.height * zoom);
        ctx.drawImage(img, 0, 0, Math.round(img.width * zoom), Math.round(img.height * zoom));
        let base64Str = canvas.toDataURL('image/jpeg', zoom == 0.3 ? 0.7 : 1);
        let files = dataURLtoFile(base64Str, "filename.jpg");
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        formData.append("file", files);
        formData.append("uploadType", type);
        formData.append("token", _this.state.userInfo ? _this.state.userInfo.token : "");
        formData.append("path", path);
        xhr.open('POST', System.upload_test());
        xhr.send(formData);
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
            resolve(JSON.parse(xhr.response).data.url);
          } else {
            reject();
          }
        }
      }
    })
  }
};
