<template>
  <div id="createAndEdit">
    <el-row>
      <el-table ref="table" header-row-class-name="thead" :data="tableData" border v-loading="loading" element-loading-text="加载中...">
        <el-table-column label="毕业证书" width='100' align='center'>
          <template slot-scope="scope">
            <a @click="showMaxFn(scope.row.certificate)">
              <img class='img-bor' :src="scope.row.certificate ? ($store.state.configData.imgDomain + scope.row.certificate) : require('@/img/common/zhengshu.png')"/>
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="schoolName" label="学校名称" min-width="100"></el-table-column>
        <el-table-column label="获得学历" min-width="80">
          <template slot-scope="scope">
            {{$mapTypeStr(scope.row.education, $store.state.educationArr)}}
          </template>
        </el-table-column>
        <el-table-column label="教育时间段" min-width="120">
          <template slot-scope="scope">
            {{scope.row.startDate + ' 至 ' + scope.row.endDate}}
          </template>
        </el-table-column>
        <el-table-column prop="majorName" label="专业名称" min-width="100"></el-table-column>
        <el-table-column prop="intro" label="专业简介" min-width="120"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click.native="dele(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="margin: 20px auto" type="primary" @click='add'>添加教育经历</el-button>
      <div style="width: 100%; text-align: center">
        <el-button type="primary" @click='saveBtnUp'>上一步</el-button>
        <el-button type="primary" @click='saveBtnDown'>完成</el-button>
      </div>
    </el-row>
    <el-dialog width="50%" :append-to-body="true" v-if="showEdit" :visible.sync="showEdit" :title="title" @close="closeEdit">
      <el-form label-width="120px">
        <el-form-item label="获得学历 : ">
          <el-select class='w80per' v-model="params.education" clearable @clear="params.education = ''">
            <el-option v-for="(i) in $store.state.educationArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
          &nbsp;
          <span class="fc303e"> * 必填</span>
        </el-form-item>
        <el-form-item label="学校名称 : ">
          <el-input placeholder="请填写学校名称" v-model="params.schoolName" class='w80per' clearable></el-input>
          &nbsp;
          <span class="fc303e"> * 必填</span>
        </el-form-item>
        <el-form-item label="教育时间段 : ">
          <el-date-picker v-model="params.startDate" class='w200' type="month" placeholder="入学日期" value-format="yyyy-MM"></el-date-picker>
          &nbsp;至&nbsp;
          <el-date-picker v-model="params.endDate" class='w200' type="month" placeholder="毕业日期" value-format="yyyy-MM"></el-date-picker>
          &nbsp;
          <span class="fc303e"> * 必填</span>
        </el-form-item>
        <el-form-item label="专业名称 : ">
          <el-input placeholder="请填写专业名称" v-model="params.majorName" class='w80per' clearable></el-input>
        </el-form-item>
        <el-form-item label="毕业证书 : ">
          <el-upload action="" :show-file-list="false" :http-request="upload" accept="image/jpeg,image/jpg,image/png" v-loading="upLoading" element-loading-text="上传中..." class="avatar-uploader">
            <img v-if="params.certificate" :src="(params.certificate && params.certificate.includes('http')) ? params.certificate : $store.state.configData.imgDomain+params.certificate+$imgSize[`100x100`]" class="avatar" style="height:100px;width:160px">
            <i style="height:100px;width:160px;line-height:90px" v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="专业简介 : ">
          <el-input placeholder="请填写专业简介" v-model="params.intro" class='w80per h300' type="textarea" clearable></el-input>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click='saveBtn' :loading="isPending">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog width="50%" :append-to-body="true" v-if="showMax" :visible.sync="showMax" :title="'毕业证书'">
      <img class='img-max' :src="$store.state.configData.imgDomain + maxUrl"/>
    </el-dialog>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop } from "vue-property-decorator";
import User from "@api/user";
import System from "@api/system";

@Component({
  components: {
  }
})
export default class CreateAndEdit extends Vue {
  @Prop({ default: "" })
  public queryData: string;

  params: any = {
    userId: this.$store.state.userData.id,
    userEduId: "",
    schoolName: "",
    majorName: "",
    education: "",
    startDate: "",
    endDate: "",
    certificate: "",
    intro: ""
  };
  loading: boolean = false;
  upLoading: boolean = false;
  isPending: boolean = false;
  showEdit: boolean = false;
  tableData: any[] = [];
  userEduId: string = "";
  showMax: boolean = false;
  maxUrl: string = "";
  title: string = "";

  created() {
    this.init();
  }
  init() {
    this.loading = true;
    let data = {
      userId: this.$store.state.userData.id
    }
    User.user_edu_list_admin({ data })
      .then((res) => {
        if(res.code === 0){
          this.tableData = res.data;
        }
      })
      .finally(() => {
        this.loading = false;
      })
  }
  showMaxFn(e: any) {
    this.maxUrl = e;
    this.showMax = true;
  }
  add() {
    if (this.tableData.length >= 3) {
       this.$notify({
        title: "提示",
        message: `教育经历最多只能创建3条`,
        type: "error"
      });
      return;
    }
    this.params = {
      userId: this.$store.state.userData.id,
      userEduId: "",
      schoolName: "",
      majorName: "",
      education: "",
      startDate: "",
      endDate: "",
      certificate: "",
      intro: ""
    };
    this.userEduId = "";
    this.title = "添加教育经历";
    this.showEdit = true;
  }
  async upload(file: any) {
    if (file.file.size < 2097152) {
      this.upLoadImgSrc(file.file);
      return;
    }
    Lrz(file.file, { width: 800, quality: 0.9 }).then((rst: any) => {
      this.upLoadImgSrc(rst.file);
    });
  }
  upLoadImgSrc(file: any) {
    this.upLoading = true;
    let formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "1");
    formData.append("token", this.$store.state.userInfo.token);
    formData.append("path", "/work/user/certificate");
    System.upload(formData)
      .then(res => {
        this.params.certificate = res.data.url;
      })
      .finally(() => {
        this.upLoading = false;
      });
  }
  edit(e: any) {
    Object.keys(this.params).forEach((i, index) => {
      this.params[i] = e[i];
    });
    this.userEduId = e.userEduId;
    this.title = "编辑教育经历";
    this.showEdit = true;
  }
  is() {
    if (!this.params.education) {
      this.$notify({
        title: "提示",
        message: `请选择学历`,
        type: "error"
      });
      return false;
    } else if (this.params.schoolName === "" || this.params.schoolName.includes(" ")) {
      this.$notify({
        title: "提示",
        message: `请输入学校名称且不能含有空格`,
        type: "error"
      });
      return false;
    } else if (!this.params.startDate || !this.params.endDate) {
      this.$notify({
        title: "提示",
        message: `请输入教育时间段`,
        type: "error"
      });
      return false;
    } else {
      return true;
    }
  }
  saveBtn(e: any) {
    if(!this.is()) return; 
    let data = {
      ...this.params
    }
    if(data && data.intro){
      data.intro = data.intro.replace(/\n|\r\n/g, "<br>");
    }
    this.isPending = true;
    if (this.userEduId) {
      data.userEduId = this.userEduId;
      User.update_user_edu_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `操作成功!`,
              type: "success"
            });
            this.closeEdit();
          }
        })
        .finally(() => {
          this.isPending = false;
        })
    } else {
      User.create_user_edu_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `操作成功!`,
              type: "success"
            });
            this.closeEdit();
          }
        })
        .finally(() => {
          this.isPending = false;
        })
    }
  }
  dele(e: any) {
    this.$confirm('确认删除该条教育经历?', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      let data = {
        userId: this.$store.state.userData.id,
        userEduId: e.userEduId
      }
      User.delete_user_edu_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: `操作成功!`,
              type: "success"
            });
            this.init();
          }
        })
    }).catch(() => { });
  }
  closeEdit() {
    this.showEdit = false;
    this.init();
  }
  saveBtnUp() {
    this.$emit("createEditThreeOverUp")
  }
  saveBtnDown() {
    this.$emit("createEditThreeOver")
  }
}
</script>
<style lang="scss" scoped>
.w400 {
  width: 400px!important;
}
.w200 {
  width: 200px!important;
}
.avatar-uploader {
  float: left;
  margin-right: 50px;
}
.img-bor {
  cursor: pointer;
}
.img-max {
  max-width: 100%;
}
</style>