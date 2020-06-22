<template>
  <div id="createAndEdit" class="classLive">
    <el-row>
      <el-form :inline="true">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="createBtn">创建直播章节</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%;" border empty-text='' v-loading="loading" element-loading-text="拼命加载中" @sort-change='sortFun'>
        <el-table-column prop="liveChapterTitle" label="章节标题" min-width="160"></el-table-column>
        <el-table-column prop="speaker" label="主讲人" min-width="120"></el-table-column>
        <el-table-column label="直播类型" width="80">
          <template slot-scope="scope">
            {{scope.row.liveType == 1 ? '直播' : scope.row.liveType == 2 ? '课堂' : ''}}
          </template>
        </el-table-column>
        <el-table-column label="直播间模板类型" width="140">
          <template slot-scope="scope">
            {{$mapTypeStr(scope.row.templateType, templateTypeArr)}}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="现场地址" min-width='170'>
          <template slot-scope="scope">
            {{scope.row.address || ''}}
          </template>
        </el-table-column>
        <el-table-column prop="totalLength" label="预计总时长（分钟）" min-width='100'>
          <template slot-scope="scope">
            {{scope.row.totalLength || ''}}
          </template>
        </el-table-column>
        <el-table-column prop="stateStr" label="状态" min-width='100'></el-table-column>
        <el-table-column prop="startTimeStr" sortable='custom' label="开始时间" width='170'></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click='editBtn(scope.row)' v-if="scope.row.state == 1">编辑</el-button>
            <el-button type="text" size="small" @click='openLive(scope.row)' v-if="scope.row.state == 1">开始直播</el-button>
            <el-button type="text" size="small" @click='onOffRecord(scope.row)' v-if="scope.row.state == 3 || scope.row.state == 4 || scope.row.state == 5">{{scope.row.state == 3 ? '录播列表' : scope.row.state == 4 ? '关闭录播' : scope.row.state == 5 ? '开启录播' : ''}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form>
        <el-form-item label="" label-width="120px" class="mg-center">
          <el-button type="primary" v-if="!isShow.class" @click="back_two" :disabled="upNum">上一步</el-button>
          <el-button type="primary" v-if="!isShow.class" @click="saveBtn_two" :disabled="upNum">下一步</el-button>
        </el-form-item>
      </el-form>
      <el-dialog class="create-box" :title="titleCresteEdit" :visible.sync="createBox" :close-on-click-modal='false' @close="close" append-to-body>
        <el-form :inline="true" :model="formCreate" class="demo-form-inline" label-width="140px">
          <el-form-item label="章节标题：">
            <el-input v-model="formCreate.liveChapterTitle" placeholder="请输入章节标题" class="w80per"></el-input>
          </el-form-item>
          <el-form-item label="直播类型：">
            <el-radio-group v-model="formCreate.liveType" :disabled="titleCresteEdit === '编辑直播章节'">
              <el-radio :label="1">直播</el-radio>
              <el-radio :label="2">课堂</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="直播间模板类型：" v-if="formCreate.liveType === 1">
            <el-select class='w80per' v-model="formCreate.templateType" :disabled="titleCresteEdit === '编辑直播章节' && formCreate.state != 1">
              <el-option v-for="(i) in templateTypeArr" :key="i.text" :label="i.text" :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主讲人：">
            <el-input v-model="formCreate.speaker" placeholder="请输入主讲人名字" class="w80per"></el-input>
          </el-form-item>
          <el-form-item label="开始时间：">
            <el-date-picker v-model="sDate" placeholder="选择日期" :picker-options="pickerOptions0" format='yyyy-MM-dd' value-format='yyyy-MM-dd'></el-date-picker>
            &nbsp;
            <el-time-select v-model="sTime" is-range :picker-options="{start: '00:00', step: '00:10', end: '23:50'}" placeholder="选择时间"></el-time-select>
          </el-form-item>
          <el-form-item label="预计总时长：">
            <el-input type="number" :min="0" v-model="formCreate.totalLength" placeholder="请输入预计总时长（单位：分钟）" class="w80per"></el-input>
            <span style="margin-left: 5px">分钟</span>
            <span style="margin-left: 5px; color: #fc703e">（选填）</span>
          </el-form-item>
          <el-form-item label="现场地址： ">
            <el-select v-model="formCreate.address" filterable clearable :filter-method="querySearchAsync" @change="getAddress" placeholder="请输入简略地址，并根据提示选择详细地址" class="w80per">
              <el-option v-for="item in addressOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <span style="margin-left: 5px; color: #fc703e">（选填）</span>
          </el-form-item>
          <el-form-item label="直播描述：">
            <el-input class="h300 w80per" type="textarea" :placeholder="'请输入直播描述'" v-model="formCreate.intro"></el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" :loading="isPending" @click="createSectionBtn">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="录播列表" v-if="recordBox" :visible.sync="recordBox" :close-on-click-modal='false' @close="closeRecord" append-to-body>
        <p style="color: #fc703e">录播具有时效性，请在结束直播后2小时内开启录播，否则无法开启录播。</p>
        <el-table :data="recordData" style="width: 100%;" border empty-text='' v-loading="loading1" element-loading-text="拼命加载中">
          <el-table-column prop="videoTitle" label="回放标题" min-width="160"></el-table-column>
          <el-table-column label="直播类型" width="80">
            <template slot-scope="scope">
              {{scope.row.type == 1 ? '直播' : scope.row.type == 2 ? '课堂' : ''}}
            </template>
          </el-table-column>
          <el-table-column label="录制状态" width="80">
            <template slot-scope="scope">
              {{scope.row.videoState == 0 ? '录制中' : scope.row.videoState == 1 ? '录制完成' : ''}}
            </template>
          </el-table-column>
          <el-table-column prop="startTime" sortable='custom' label="开始时间" width='170'></el-table-column>
          <el-table-column prop="endTime" sortable='custom' label="结束时间" width='170'></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button :class="scope.row.isDownload ? 'btn-ash' : ''" :disabled="scope.row.isDownload == 1" type="text" size="small" @click='downLoadRecord(scope.row)' v-if="scope.row.videoState == 1">{{scope.row.isDownload == 1 ? '正在下载' : '开启录播'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Live from "@api/live";
import Category from "@api/category";
import System from "@api/system";
import Org from "@api/org";

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
    pageNum: 1,
    pageSize: 50,
    sortBy: true,
    sortField: 'sort'
  };

  tableData: any[] = [];
  titleCresteEdit: string = "";
  createBox: boolean = false;
  formCreate: object = {
    state: "",
    liveChapterTitle: "",
    liveType: 1,
    templateType: 5,
    liveChapterId: "",
    liveId: this.$store.state.liveData.id,
    speaker: "",
    startTime: "",
    totalLength: "",
    address: "",
    lat: "",
    lng: "",
    intro: ""
  };
  sDate: string = "";
  sTime: string = "";
  loading: boolean = false;
  upNum: boolean = false;
  isPending: boolean = false;
  stateArr: object[] = [
    {
      id: 1,
      text: "未开始"
    },
    {
      id: 2,
      text: "正在直播"
    },
    {
      id: 3,
      text: "直播已结束，请等待录播"
    },
    {
      id: 4,
      text: "录播中"
    },
    {
      id: 5,
      text: "录播已结束"
    }
  ];
  templateTypeArr: object[] = [
    {
      id: 1,
      text: "视频"
    },
    {
      id: 2,
      text: "视频+聊天"
    },
    {
      id: 5,
      text: "视频+文档+聊天"
    }
  ];
  addressOptions: any[] = [];
  medium: any[] = [];

  recordBox: boolean = false;
  recordData: any[] = [];
  isLiveChapterId: string = "";

  data () {
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    }
  }
  created() {
    this.upNum = true;
    this.chapterList();
  }
  
  back_two(){
    this.$emit("createEditTwoOverUp");
  }
  saveBtn_two() {
    if (this.tableData.length == 0) {
      this.$notify({
        title: "提示",
        message: "请先创建直播章节",
        type: "warning"
      });
    } else {
      this.$emit("createEditTwoOverDown");
    }
  }
  createBtn(data) {
    this.titleCresteEdit = '创建直播章节';
    this.formCreate = {
      liveChapterTitle: "",
      liveType: 1,
      templateType: 5,
      liveChapterId: "",
      liveId: this.$store.state.liveData.id,
      speaker: "",
      startTime: "",
      totalLength: "",
      address: "",
      lat: "",
      lng: "",
      intro: ""
    };
    this.sDate = "";
    this.sTime = "";
    this.addressOptions = [];
    this.createBox = true;
  }
  chapterList() {
    if( this.$store.state.liveData.id ){
      this.loading = true;
      let data = {
        liveId: this.$store.state.liveData.id,
        ...this.params
      }
      Live.live_chapter_list_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.loading = false;
            res.data.result.forEach((i: any) => {
              i.startTimeStr = this.$formatDate(i.startTime, "YYYY-MM-DD hh:mm");
              i.stateStr = this.$mapTypeStr(i.state, this.stateArr)
              
            });
            this.tableData = [];
            this.tableData = res.data.result;
            this.upNum = false;
          }
        })
    } else {
      this.upNum = false;
    }
  }
  editBtn(e: any) {
    this.titleCresteEdit = '编辑直播章节';
    this.formCreate.liveChapterId = e.liveChapterId;
    let data = {
      liveChapterId: e.liveChapterId
    }
    Live.query_live_chapter_admin({ data })
      .then(res => {
        this.createBox = true;
        Object.keys(this.formCreate).forEach((i, index) => {
          //@ts-ignore
          this.formCreate[i] = res.data[i];
          if(this.formCreate.intro){
            this.formCreate.intro = decodeURIComponent(encodeURIComponent(this.formCreate.intro).replace(/%3Cbr%3E/g, "%0A"));
          }
          if(this.formCreate.startTime){
            this.sDate = this.$formatDate(this.formCreate.startTime, "YYYY-MM-DD");
            this.sTime = this.$formatDate(this.formCreate.startTime, "hh:mm");
          }
          this.medium = {...this.formCreate};
        });
      }).catch(e => {
      })
  }
  dele(e: any) {
    this.$confirm('确认删除该章节?', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      let data = {
        liveChapterId: e.liveChapterId
      }
      Live.delete_live_chapter_admin({ data })
        .then(res => {
          this.chapterList()
        })
    }).catch(() => { });
  }
  createSectionBtn() {
    if(!this.formCreate.liveChapterTitle || this.formCreate.liveChapterTitle.includes(" ")){
      this.$notify({
        title: "提示",
        message: "请输入章节名称，不能含有空格",
        type: "warning"
      });
      return;
    }
    if(!this.formCreate.speaker || this.formCreate.speaker.includes(" ")){
      this.$notify({
        title: "提示",
        message: "请输入主讲人，不能含有空格",
        type: "warning"
      });
      return;
    }
    if(!this.sDate || !this.sTime){
      this.$notify({
        title: "提示",
        message: "请选择完整的开始时间",
        type: "warning"
      });
      return;
    }
    if(!this.formCreate.intro){
      this.$notify({
        title: "提示",
        message: "请输入直播描述",
        type: "warning"
      });
      return;
    }
    this.isPending = true;
    if (this.formCreate.liveType === 2) {
      delete this.formCreate.templateType
    }
    delete this.formCreate.state;
    let data = {...this.formCreate};
    data.startTime = this.sDate + " " + this.sTime + ":00";
    data.intro = data.intro.replace(/\n|\r\n/g, "<br>");
    if (this.titleCresteEdit === '创建直播章节') {
      Live.create_live_chapter_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.close();
            this.chapterList();
          }
        }).finally(e => {
          this.isPending = false;
        })
    } else {
      Object.keys(this.medium).forEach((i, index) => {
        if (this.medium[i] === data[i] && i != 'liveChapterId') {
          delete data[i]
        };
      });
      Live.update_live_chapter_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.close();
            this.chapterList();
          }
        }).finally(e => {
          this.isPending = false;
        })
    }
  }
  sortFun(i) {
    this.params.sortBy = !this.params.sortBy;
    this.chapterList();
  }
  close() {
    this.createBox = false;
    this.chapterList();
  }
  querySearchAsync(query) {
    if (!query) {
      this.addressOptions = [];
      this.formCreate.address = "";
    }
    let data = { key: 'VXUBZ-JL4CV-EXFPH-UVNCN-3VLP6-N2FZH', keyword: query, region: "四川", region_fix: 1, callbackName: 'QQmap', output: 'jsonp' }
    this.$jsonp("https://apis.map.qq.com/ws/place/v1/suggestion", data).then(res => {
      if (res.status == 0) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].value = res.data[i].address + res.data[i].title;
        }
        this.addressOptions = res.data;
      }
    })
  }
  getAddress() {
    let obj = {}; 
    obj = this.addressOptions.find((item)=>{
      return item.value === this.formCreate.addressStr;
    });
    if (obj) {
      this.formCreate.address = obj.address || obj.title;
      this.formCreate.lng = obj.location.lng;
      this.formCreate.lat = obj.location.lat;
    }
  }
  recordLive() {
    this.loading1 = true;
    let data = {
      liveChapterId: this.isLiveChapterId
    }
    Live.live_chapter_record_list({ data })
      .then(res => {
        if (res.code === 0) {
          this.recordData = res.data;
          this.loading1 = false;
        } else {
          this.recordBox = false;
        }
      }).finally(e => {
        this.loading1 = false;
      })
  }
  onOffRecord(e: any) {
    this.isLiveChapterId = e.liveChapterId;
    if (e.state == 3) {
      this.recordBox = true;
      this.recordLive();
    } else if (e.state == 4 || e.state == 5) {
      let data = {
        liveChapterId: e.liveChapterId,
        state: e.state == 4 ? 5 : 4
      }
      Live.began_close_live_chapter_video_admin({ data })
        .then(res => {
          this.chapterList();
        })
    }
  }
  downLoadRecord(e: any) {
    var date = e.endTime.replace(/-/g,'/');
    var timestamp = new Date(date).getTime() + 7200000;
    if (timestamp < e.nowDate) {
      this.$notify({
        title: "错误",
        message: "直播结束超过两小时，无法转为录播！",
        type: "error"
      });
      return;
    }
    let data = {
      liveChapterId: e.liveChapterId,
      videoRecordId: e.videoRecordId,
      type: e.type
    }
    Live.download_live_chapter_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "开始下载，请5分钟后查看章节状态！",
            type: "success"
          });
          this.recordLive();
          setTimeout(() => {
            this.closeRecord()
          }, 1000)
        }
      })
  }
  closeRecord() {
    this.recordBox = false;
    this.chapterList();
  }
  openLive(e: any) {
    let data = {
      liveChapterId: e.liveChapterId
    }
    Live.start_live_admin({ data })
      .then(res => {
        if (res.code === 0) {
          let a = document.createElement("a");
          a.setAttribute("href", res.data);
          a.setAttribute("target", "_blank");
          a.setAttribute("id", open);
          // 防止反复添加
          if(!document.getElementById(open)) {                     
            document.body.appendChild(a);
          }
          a.click();
          // window.open(`${res.data}`)
        }
      })
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
  .btn-ash {
    color: #c0c4cc;
    border-color: #ebeef5;
    &:hover,
    &:focus{
      color: #c0c4cc;
      border-color: #ebeef5;
      background-color: transparent;
    }
  }
  .create-box{
    /deep/ {
      .el-form--inline .el-form-item{
        width: 100%;
      }
      .el-form--inline .el-form-item__content{
        width: 80%;
      }
    }
  }
  .avatar-uploader {
    float: left;
    margin-right: 50px;
  }
  .page-num{
    margin-top: 10px;
  }
  .mg-top20{
    margin-top: 20px;
  }
  .mg-center{
    text-align: center;
    margin-right: 13%;
    margin-top: 20px;
  }
  /deep/ {
    .el-progress{
      margin-left: 10px;
      width: 150px;
      display: inline-block;
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
  .el-picker-panel__footer .el-button--text{
    display: none;
  }
</style>

