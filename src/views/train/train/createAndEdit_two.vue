<template>
  <div id="createAndEdit">
    <el-row>
      <el-form :inline="true">
        <el-form-item label="">
          <el-button type="primary" icon="plus" @click="addBtn">添加课程</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" ref="trainTable" @selection-change="handleSelectionChangeTrain" style="width: 100%;" border v-loading="loading" element-loading-text="拼命加载中" @sort-change='sortFun'>
        <el-table-column type="selection" align="center" min-width='55' v-if="isShow.delete"></el-table-column>
        <el-table-column prop="typeStr" label="类型" min-width='80'></el-table-column>
        <el-table-column prop="trainResourceTitle" label="资源标题" min-width="160"></el-table-column>
        <el-table-column prop="sort" label="排序" min-width="80"></el-table-column>
        <el-table-column prop="updateUserName" label="修改人" min-width="100"></el-table-column>
        <el-table-column prop="updateTimeStr" sortable='custom' label="修改时间" width='170'></el-table-column>
        <el-table-column prop="operate" label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click='sortFn(scope, "up")' v-if="!(params.pageNum == 1 && scope.$index == 0) || scope.row.sort != 1">上移</el-button>
            <el-button type="text" size="small" @click='sortFn(scope, "down")' v-if="!(Math.ceil(total/params.pageSize) == params.pageNum && scope.$index == tableData.length - 1)">下移</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
          <span class="mag-top20" v-if="isShow.delete">
            <el-checkbox class="mag-left20" v-model="toggleCheckbox" :indeterminate="isIndeterminate" @change="handleCheckAllChange" :disabled="tableData.length === 0">{{!toggleCheckbox ? '全选' : '取消全选'}}</el-checkbox>
            <el-button class="mag-left20" @click="dele()">删除</el-button>
          </span>
          <br v-else>
        </el-row>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item>
            共有
            <span class="fc303e">{{total}}</span>条数据，每页显示
            <el-select placeholder="" v-model="params.pageSize" class='w65' @change='params.pageNum = 1;resourceList()'>
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="50" value="50"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
        <el-pagination :current-page.sync="params.pageNum" @current-change="resourceList('type')" 
          :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <el-form>
        <el-form-item label=" " label-width="120px" class="mg-center">
          <el-button type="primary" v-if="!isShow.class" @click="back_two" :disabled="upNum">上一步</el-button>
          <el-button type="primary" v-if="!isShow.class" @click="saveBtn_two" :disabled="upNum">下一步</el-button>
        </el-form-item>
      </el-form>

      <el-dialog title="添加课程" :visible.sync="addBox" width="70%" :close-on-click-modal='false' @close="initFun" append-to-body>
        <el-form :inline="true">
          <el-form-item label="">
            <el-input placeholder="课程名称" v-model="params1.query" class='w230' @change="getResourceList()" clearable>
              <el-button class="clickBtn" @click="getResourceList()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <el-table ref="addTable" @selection-change="handleSelectionChange" @sort-change='sortFunc' header-row-class-name="thead" :data="formCreate" border v-loading="loading" element-loading-text="加载中...">
          <el-table-column type="selection" align="center" min-width='55'></el-table-column>
          <el-table-column prop="courseImg" label="课程封面" width='100' align='center'>
            <template slot-scope="scope">
              <img class='img-bor' :src="scope.row.courseImg ? ($store.state.configData.imgDomain + scope.row.courseImg+$imgSize['30x30']) : ($store.state.configData.imgDomain + '/default/cdwork/course.jpg' + $imgSize['30x30'])"/>
            </template>
          </el-table-column>
          <el-table-column prop="courseTitle" label="课程标题" min-width="140"></el-table-column>
          <el-table-column prop="createUserName" label="创建人" min-width='100'></el-table-column>
          <el-table-column prop="createTimeStr" sortable='custom' label="创建时间" width='170'></el-table-column>
          <el-table-column prop="" label="操作" width="80">
            <template slot-scope='scope'>
              <el-button type="text" @click.native="add(scope.row)">加入</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <span class="mag-top20">
            <el-checkbox v-model="addCheckbox" class="mag-left20" :indeterminate="isIndeterminateAdd" @change="handleCheckAllChangeAdd" :disabled="formCreate.length === 0">{{!addCheckbox ? '全选' : '取消全选'}}</el-checkbox>
            <el-button class="mag-left20" @click="add()">加入</el-button>
          </span>
        </el-row>
        <div class="page-num">
          <el-form :inline="true">
            <el-form-item>
              共有
              <span class="fc303e">{{total1}}</span>条数据，每页显示
              <el-select placeholder="" v-model="params1.pageSize" class='w65' @change='params1.pageNum = 1;getResourceList()'>
                <el-option label="10" value="10"></el-option>
                <el-option label="20" value="20"></el-option>
                <el-option label="50" value="50"></el-option>
              </el-select>
              条
            </el-form-item>
          </el-form>
          <el-pagination :current-page.sync="params1.pageNum" @current-change="getResourceList('type')" 
            :page-size="parseInt(params1.pageSize)" layout="prev, pager, next, jumper" :total="total1">
          </el-pagination>
        </div>
      </el-dialog>
      <!-- <el-dialog width="30%" v-if="sortBox" title="修改排序" :visible.sync="sortBox" :close-on-click-modal="false" append-to-body>
        <el-form :inline="true">
          <el-form-item label="排序号：">
            <el-input type="number" :min="0" placeholder="请填写排序号" v-model="sorts"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="sortBox = false">取 消</el-button>
          <el-button type="primary" @click="saveBtn_sort">确 定</el-button>
        </span>
      </el-dialog> -->
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
import Train from "@api/train";
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
    sortBy: true,
    sortField: 'sort',
    pageSize: 10,
    pageNum: 1
  };
  params1 = {
    isDel: 0,
    pageSize: 10,
    pageNum: 1
  };

  tableData: any[] = [];
  addBox: boolean = false;
  formCreate: any[] = [];
  isUp: boolean = false;
  loading: boolean = false;
  flag: boolean = false;
  fileList3: any[] = [];
  process: number = 0;
  progress: any = {};
  inits: string = '1';
  upNum: boolean = false;
  isPending: boolean = false;
  total: number = 0;
  total1: number = 0;
  isIndeterminateAdd: boolean = false;
  addCheckbox: boolean = false;
  isIndeterminate: boolean = false;
  toggleCheckbox: boolean = false;
  selectData: any[] = [];
  selectDataTrain: any[] = [];
  typeArr: object[] = [
    {
      id: 3,
      text: "课程"
    },
    {
      id: 5,
      text: "考试"
    },
    {
      id: 6,
      text: "调查"
    }
  ];
  sorts: string = "";
  trainResourceIds: string = "";
  // sortBox: boolean = false;
  showDown: boolean = true;
  targetId: string = "";

  created() {
    this.upNum = true;
    this.resourceList();
  }
  handleCheckAllChange() {
    if (this.toggleCheckbox) {
      this.$refs.trainTable.toggleAllSelection();
    } else {
      this.$refs.trainTable.clearSelection();
    }
    this.handleSelectionChangeTrain;
  }
  handleSelectionChangeTrain(e: any) {
    this.selectDataTrain = e;
    let checkedCount = e.length;
    this.toggleCheckbox = checkedCount === this.tableData.length && this.tableData.length != 0;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length;
  }
  dele(e: any) {
    if (this.selectDataTrain.length === 0 && !e.resourceId) {
      this.$notify({
        title: "错误",
        message: `请至少选择一个培训!`,
        type: "error"
      });
      return;
    }
    this.$confirm('确认删除选择的培训课程?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let id = e && e.resourceId ? JSON.stringify(e.resourceId) : JSON.stringify(this.selectDataTrain.map(i => i.resourceId));
      let resourceIds = id.replace(/"|\[|\]/g,'');
      let data = {
        resourceIds: resourceIds,
        trainId: this.$store.state.trainData.id
      }
      Train.delete_train_resource_admin({ data })
        .then(res => {
          if ((this.selectData.length === this.tableData.length || this.tableData.length === 1 ) && this.params.pageNum > 1) {
            this.params.pageNum --;
          }
          this.resourceList()
        })
    }).catch(() => {

    });
  }
  handleCheckAllChangeAdd() {
    if (this.addCheckbox) {
      this.$refs.addTable.toggleAllSelection();
    } else {
      this.$refs.addTable.clearSelection();
    }
    this.handleSelectionChange;
  }
  handleSelectionChange(e: any) {
    this.selectData = e;
    let checkedCount = e.length;
    this.toggleCheckboxAdd = checkedCount === this.formCreate.length && this.formCreate.length != 0;
    this.isIndeterminateAdd = checkedCount > 0 && checkedCount < this.formCreate.length;
  }
  add(e: any){
    if (this.selectData.length === 0 && !e) {
      this.$notify({
        title: "错误",
        message: `请至少选择一个课程!`,
        type: "error"
      });
      return;
    }
    let id = e && e.courseId ? JSON.stringify(e.courseId) : JSON.stringify(this.selectData.map(i => i.courseId));
    let title = e && e.courseTitle ? JSON.stringify(e.courseTitle) : JSON.stringify(this.selectData.map(i => i.courseTitle));
    let resourceIds = id.replace(/"|\[|\]/g,'');
    let resourceTitles = title.replace(/"|\[|\]/g,'');
    let data = {
      type: 3,
      trainId: this.$store.state.trainData.id,
      resourceIds: resourceIds,
      resourceTitles: resourceTitles
    };
    Train.create_train_resource_admin({ data }).then(res => {
      if (res.code === 0) {
        this.$notify({
          title: "提示",
          message: "添加成功！",
          type: "success"
        });
        this.resourceList();
      }
    });
  }

  back_two(){
    this.$emit("createEditTwoOverUp");
  }
  saveBtn_two() {
    if (this.tableData.length == 0) {
      this.$notify({
        title: "提示",
        message: "请先添加课程",
        type: "warning"
      });
    } else {
      this.$emit("createEditTwoOverDown");
    }
  }
  addBtn() {
    this.getResourceList();
    this.addBox = true;
  }
  resourceList(type: any) {
    if (type !== 'type') {
      if (
        this.params.query
      ) {
        this.params.pageNum = 1;
      }
    }
    if( this.$store.state.trainData.id ){
      this.loading = true;
      let data = {
        trainId: this.$store.state.trainData.id,
        ...this.params
      }
      Train.train_resource_list_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.loading = false;
            this.total = res.data.total;
            if(res.data.result){
              res.data.result.forEach((i: any) => {
                i.updateTimeStr = this.$formatDate(i.updateTime);
                i.typeStr = this.$mapTypeStr(i.type, this.typeArr);
              });
            }
            this.tableData = [];
            this.tableData = res.data.result;
            this.upNum = false;
          }
        })
    } else {
      this.upNum = false;
    }
  }
  
  initFun() {
    this.addBox = false;
  }
  sortFun(i) {
    this.params.sortBy = !this.params.sortBy
    this.resourceList()
  }
  getResourceList(type: any) {
    if (type !== 'type') {
      if (
        this.params1.query
      ) {
        this.params1.pageNum = 1;
      }
    }
    let data = { ...this.params1 };
    this.loading = true;
    Train.course_list_resources({ data })
      .then(res => {
        if (res.code === 0) {
          this.total1 = res.data.total;
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
          });
          this.formCreate = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  sortFunc(i) {
    this.params1.sortBy = !this.params1.sortBy
    this.getResourceList();
  }
  sortFn(e: any, str: string) {
    this.trainResourceIds = e.row.trainResourceId;
    if (str === 'up') {
      this.targetId = this.tableData[e.$index - 1].trainResourceId;
      this.sorts = e.row.sort - 1;
      this.saveBtn_sort('up');
    } else if (str === 'down') {
      this.targetId = this.tableData[e.$index + 1].trainResourceId;
      this.sorts = e.row.sort + 1;
      this.saveBtn_sort('down');
    }
  }
  saveBtn_sort(str: string) {
    let data = {
      trainResourceIds: this.trainResourceIds,
      sorts: this.sorts
    }
    Train.train_resource_sort_admin({ data })
      .then(res => {
        if (res.code === 0) {
          let data = {
            trainResourceIds: this.targetId,
            sorts: str === 'up' ? this.sorts + 1 : this.sorts - 1
          }
          Train.train_resource_sort_admin({ data })
            .then(res => {
              if (res.code === 0) {
                this.$notify({
                  title: "提示",
                  message: "操作成功！",
                  type: "success"
                });
                this.resourceList();
              }
            })
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
  }
  .inp{
    width: auto;
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
</style>

