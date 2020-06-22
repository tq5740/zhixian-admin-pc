<template>
  <div id="createAndEdit">
    <el-row>
      <el-form :inline="true">
        <el-form-item label="">
          <el-button
            type="primary"
            icon="plus"
            @click="createBtn"
          >创建课程章节</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        style="width: 100%;"
        border
        empty-text=''
        v-loading="loading"
        element-loading-text="拼命加载中"
        @sort-change='sortFun'
      >
        <el-table-column
          prop="courseChapterTitle"
          label="章节标题"
          min-width="160"
        ></el-table-column>
        <el-table-column
          prop="url"
          label="URL地址"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="fileId"
          label="FILE_ID"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="80"
        ></el-table-column>
        <el-table-column
          prop="updateUserName"
          label="修改人"
          min-width="100"
        ></el-table-column>
        <el-table-column
          prop="updateTimeStr"
          sortable='custom'
          label="修改时间"
          width='170'
        ></el-table-column>
        <el-table-column
          prop="operate"
          label="操作"
          width="90"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click='editBtn(scope.row)'
            >编辑</el-button>
            <!-- <el-button type="text" size="small" @click='dele(scope.row)'>删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-form>
        <el-form-item
          label=""
          label-width="120px"
          class="mg-center"
        >
          <el-button
            type="primary"
            v-if="!isShow.class"
            @click="back_two"
            :disabled="upNum"
          >上一步</el-button>
          <el-button
            type="primary"
            v-if="!isShow.class"
            @click="saveBtn_two"
            :disabled="upNum"
          >下一步</el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        class="wat"
        :title="titleCresteEdit"
        :visible.sync="createBox"
        :close-on-click-modal='false'
        @close="initFun"
        append-to-body
      >
        <el-form
          :inline="true"
          :model="formCreate"
          label-width="120px"
        >
          <el-form-item label="章节标题：">
            <el-input
              v-model="formCreate.courseChapterTitle"
              placeholder="章节标题"
              class='w80per'
            ></el-input>
            <br>
            <span
              style="color: #fc703e"
              v-if='typeValue == 1'
            > * 先输入章节标题才能点击上传视频</span>
          </el-form-item>
          <el-form-item label="文件类型：">
            <el-radio-group v-model="formCreate.fileType">
              <el-radio label=1>视频</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="来源：">
            <el-radio-group
              v-model="typeValue"
              @change="radioType"
              :disabled="titleCresteEdit === '编辑课程章节'"
            >
              <el-radio label=1>上传视频</el-radio>
              <el-radio label=2>输入URL</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="视频："
            v-if='typeValue == 1'
          >
            <el-upload
              ref='cance'
              class="upload-demo"
              :http-request="upVideo"
              action=""
              :file-list="fileList"
              :on-remove='removeList'
              :disabled="!formCreate.courseChapterTitle"
            >
              <el-button
                size="small"
                type="primary"
              >上传视频</el-button>
              <el-progress
                :percentage="process"
                color="#FF9012"
              ></el-progress>
              <div
                slot="tip"
                class="el-upload__tip"
              >只支持mp4的格式文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item
            label="URL："
            v-if='typeValue == 2'
          >
            <el-input
              v-model="formCreate.url"
              placeholder="输入视频URL地址"
              class='w80per'
            ></el-input>
          </el-form-item>
          <br>
          <el-form-item
            label="视频时长："
            v-if="typeValue == 2"
          >
            <el-input
              type="number"
              :min="0"
              class='w80per'
              v-model="formCreate.totalLength"
              placeholder="视频时长必填（单位：秒）"
            ></el-input>
            &nbsp;
            <span>秒</span>
          </el-form-item>
          <br>
          <el-form-item
            label="排序："
            v-if="titleCresteEdit === '编辑课程章节'"
          >
            <el-input
              v-model="formCreate.sort"
              class="w80per"
            ></el-input>
          </el-form-item>
          <el-row></el-row>
          <el-form-item label=" ">
            <el-button @click="cancelUp">取 消</el-button>
            <el-button
              type="primary"
              :loading="isPending"
              @click="createSectionBtn"
            >确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-row>
  </div>
</template>

<script lang="ts">
/*
 module:
    职位管理
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-16:职位管理
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Course from "@api/train";
import Category from "@api/category";
import System from "@api/system";
import Org from "@api/org";

//https://github.com/ktsn/vuex-class
@Component({
  props: {
    isShow: {
      type: Object,
      default: {}
    }
  }
})
//CE = createAndEdit
export default class CreateAndEdit extends Vue {
  params = {
    sortBy: false,
    sortField: "updateTime"
  };

  tableData: any[] = [];
  titleCresteEdit: string = "";
  createBox: boolean = false;
  formCreate: object = {};
  isUp: boolean = false;
  loading: boolean = false;
  fileList: any[] = [];
  process: number = 0;
  progress: any = {};
  uploader: any = null;
  tcVod: any = {};
  upNum: boolean = false;
  isPending: boolean = false;
  typeValue: string = "1";
  created() {
    this.upNum = true;
    this.chapterList();
  }

  back_two() {
    this.$emit("createEditTwoOverUp");
  }
  saveBtn_two() {
    if (this.tableData.length == 0) {
      this.$notify({
        title: "提示",
        message: "请先创建课程章节",
        type: "warning"
      });
    } else {
      this.$emit("createEditTwoOverDown");
    }
  }
  radioType(e: any) {
    this.typeValue = e;
  }
  createBtn(data) {
    this.titleCresteEdit = "创建课程章节";
    this.createBox = true;
    this.typeValue = "1";
    this.formCreate = {
      parentId: "0",
      courseChapterTitle: "",
      courseId: this.$store.state.courseData.id,
      type: "2",
      fileId: "",
      url: "",
      fileType: "1",
      totalLength: ""
    };
  }
  chapterList() {
    if (this.$store.state.courseData.id) {
      this.loading = true;
      let data = {
        courseId: this.$store.state.courseData.id,
        ...this.params
      };
      Course.course_chapter_list_admin({ data }).then(res => {
        if (res.code === 0) {
          this.loading = false;
          res.data.forEach((i: any) => {
            i.updateTimeStr = this.$formatDate(i.updateTime);
          });
          this.tableData = [];
          this.tableData = res.data;
          this.typeValue = res.data.type;
          this.upNum = false;
        }
      });
    } else {
      this.upNum = false;
    }
  }
  editBtn(e: any) {
    this.titleCresteEdit = "编辑课程章节";
    let data = {
      courseChapterId: e.courseChapterId
    };
    Course.query_course_chapter_admin({ data })
      .then(res => {
        this.createBox = true;
        this.formCreate.courseChapterTitle = res.data.courseChapterTitle;
        this.formCreate.courseChapterId = res.data.courseChapterId;
        this.formCreate.courseId = res.data.courseId;
        this.formCreate.fileId = res.data.fileId;
        this.formCreate.url = res.data.url;
        this.formCreate.totalLength = res.data.totalLength;
        this.formCreate.sort = res.data.sort;
        if (res.data.fileId) {
          this.typeValue = "1";
          this.fileList = [{ name: "视频", url: res.data.url }];
        } else {
          this.typeValue = "2";
        }
        this.formCreate.fileType = "" + res.data.fileType;
        this.formCreate.type = "" + res.data.type;
      })
      .catch(e => {});
  }
  dele(e: any) {
    this.$confirm("确认删除该章节?", "删除", {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    })
      .then(() => {
        let data = {
          courseChapterId: e.courseChapterId
        };
        Course.delete_course_chapter_admin({ data }).then(res => {
          this.chapterList();
        });
      })
      .catch(() => {});
  }
  createSectionBtn(e: any) {
    if (
      !this.formCreate.courseChapterTitle ||
      this.formCreate.courseChapterTitle.includes(" ")
    ) {
      this.$notify({
        title: "提示",
        message: "请输入章节名称，不能含有空格",
        type: "warning"
      });
      return;
    }
    if (this.typeValue == 1) {
      delete this.formCreate.url;
      delete this.formCreate.totalLength;
      if (!this.formCreate.fileId) {
        this.$notify({
          title: "提示",
          message: "请上传视频，或者选择输入URL地址",
          type: "warning"
        });
        return;
      }
    }
    if (this.typeValue == 2) {
      delete this.formCreate.fileId;
      this.fileList = [];
      if (!this.formCreate.url || this.formCreate.url.includes(" ")) {
        this.$notify({
          title: "提示",
          message: "请输入URL地址，不能含有空格",
          type: "warning"
        });
        return;
      }
      if (
        !this.formCreate.totalLength ||
        this.formCreate.totalLength.toString().includes(" ")
      ) {
        this.$notify({
          title: "提示",
          message: "请输入总时长，不能含有空格",
          type: "warning"
        });
        return;
      }
    }
    this.isPending = true;
    if (this.titleCresteEdit === "创建课程章节") {
      let data = {
        ...this.formCreate
      };
      Course.create_course_chapter_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.initFun();
            this.chapterList();
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      let data = {
        ...this.formCreate
      };
      Course.update_course_chapter_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.initFun();
            this.chapterList();
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }
  }
  initFun() {
    if (this.uploader) {
      this.uploader.cancel();
    }
    this.formCreate.url = "";
    this.formCreate.courseChapterTitle = "";
    this.formCreate.fileId = "";
    this.totalLength = "0";
    this.fileList = [];
    this.createBox = false;
    this.isUp = false;
    this.process = 0;
  }
  sortFun(i) {
    this.params.sortBy = !this.params.sortBy;
    this.chapterList();
  }
  //  取消上传
  cancelUp() {
    if (this.uploader) {
      this.uploader.cancel();
    }
    this.createBox = false;
    this.isUp = false;
    this.formCreate.url = "";
    this.formCreate.courseChapterTitle = "";
    this.fileList = [];
    this.process = 0;
    return;
  }

  getSignature() {
    return System.getVodsign({ data: {} }).then(res => {
      return res.data;
    });
  }

  upVideo(e) {
    this.fileList3 = [];
    let videoFile = e.file;
    let _this = this;
    _this.tcVod = new TcVod.default({
      getSignature: _this.getSignature
    });

    _this.uploader = _this.tcVod.upload({
      mediaFile: videoFile
    });

    _this.uploader.on("media_progress", function(info) {
      _this.process = Math.floor(info.percent * 100);
    });

    _this.uploader
      .done()
      .then(function(doneResult) {
        _this.$notify({
          type: `success`,
          title: "提示",
          message: `上传成功!`
        });
        _this.process = 100;
        _this.isUp = false;
        _this.formCreate.fileId = doneResult.fileId;
        _this.fileList = [{ name: "视频", url: doneResult.video.url }];
        if (doneResult.fileId === "") {
          _this.formCreate.url = doneResult.video.url;
        }

        _this.createSectionBtn();
      })
      .catch(function(err) {
        _this.$notify({
          type: `error`,
          title: "提示",
          message: `上传失败，请检查网络环境!`
        });
        _this.process = 0;
      });
  }
  removeList() {
    this.formCreate.url = "";
    this.formCreate.fileId = "";
    this.fileList = [];
  }
}
</script>
<style lang="scss" scoped>
  #createAndEdit {
    .el-checkbox {
      &:first-of-type {
        margin-left: 10px;
      }
    }
  }

  .avatar-uploader {
    float: left;
    margin-right: 50px;
  }
  .page-num {
    margin-top: 10px;
  }
  .mg-top20 {
    margin-top: 20px;
  }
  .mg-center {
    text-align: center;
    margin-right: 13%;
    margin-top: 20px;
  }
  /deep/ {
    .el-progress {
      margin-left: 10px;
      width: 150px;
      display: inline-block;
    }
  }
  .wat {
    /deep/ {
      .el-form--inline .el-form-item {
        width: 100%;
      }
      .el-form-item__content {
        width: 80%;
      }
    }
  }
</style>
<style lang="scss">
  .note-image-popover,
  [role="tooltip"] {
    z-index: 9999 !important;
  }
  .note-editor img {
    max-width: 100% !important;
  }
</style>

