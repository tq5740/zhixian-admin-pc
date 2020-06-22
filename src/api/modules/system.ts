/*
 module:
    权限接口类
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-6:  权限接口类
 */
import ZxHttp from "../base";
class System extends ZxHttp {
  public upload(data: any) {
    return this.post("/system/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public upload_test() {
    return this.$api.publics + "/system/upload";
  }

  public querySystemConfig(data: any) {
    return this.get("/system/query_system_config", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public updateSystemConfig(data: any) {
    return this.post("/system/update_system_config", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  public sendUserauthImg(data: any) {
    return this.post("/system/upload", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }

  public getVodsign(data: any) {
    return this.get("/system/vodsign", data)
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
  
  public upload_video(data: any, progress: any) {
    return this.post("/system/upload_video", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: function( progressEvent: any ){
        if(progressEvent.lengthComputable){
          progress(progressEvent)
        }
      }
    })
      .then((res: any) => Promise.resolve(res))
      .catch((e: any) => Promise.reject(e));
  }
}
export default new System("publics");
