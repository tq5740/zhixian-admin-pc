<template>
  <div>
    <el-row class="main-top">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input style="display:none"></el-input>
          <el-input placeholder="关键字" v-model="params.query" clearable class='w230' @keyup.13.native="searchKey">
            <el-button class="clickBtn" @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select placeholder="状态" v-model="params.state" class='w150' @change="getList" clearable @clear="params.state = ''">
            <el-option :key="i.id" v-for="i in typeArr1" :value="i.id" :label="i.text">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select placeholder="平台" v-model="params.type" class='w150' @change="getList" clearable @clear="params.type = ''">
            <el-option :key="i.id" v-for="i in typeArr" :value="i.id" :label="i.text">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="main-body">
      <el-table @sort-change='sortFunc' header-row-class-name="thead" :data="tableData" stripe v-loading="loading" element-loading-text="加载中...">
        <el-table-column prop="stateStr" label="平台" min-width="120"></el-table-column>
        <el-table-column prop="content" label="建议" min-width='200'></el-table-column>
        <el-table-column prop="createUserName" label="创建人" min-width='140'></el-table-column>
        <el-table-column sortable="custom" prop="createTimeStr" label="创建时间" min-width="120"></el-table-column>
        <el-table-column prop="stateStr1" label="状态" min-width='100'></el-table-column>
        <el-table-column prop="" label="操作" width="140">
          <template slot-scope='scope'>
            <el-button type="text" @click.native="look(scope.row)">查看</el-button>
            <el-button type="text" @click.native="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-num">
        <el-form :inline="true">
          <el-form-item label="">
            共有
            <span class="fc303e">{{total}}</span>条数据，每页显示
            <el-select placeholder="" v-model="params.pageSize" class='w65' @change='params.pageNum = 1;getList()'>
              <el-option label="10" value="10"></el-option>
              <el-option label="20" value="20"></el-option>
              <el-option label="50" value="50"></el-option>
            </el-select>
            条
          </el-form-item>
        </el-form>
        <el-pagination :current-page.sync="params.pageNum" background @current-change="getList('type')" :page-size="parseInt(params.pageSize)" layout="prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog title="建议" v-if="showContent" :visible.sync="showContent" @close="closeContent">
      <el-form label-width="80px">
        <el-form-item label="建议者 : ">
          <p>{{lookObj.createUserName}}</p>
        </el-form-item>
        <el-form-item label="时间 : ">
          <p>{{lookObj.createTime}}</p>
        </el-form-item>
        <el-form-item label="内容 : ">
          <p>{{lookObj.content}}</p>
        </el-form-item>
        <el-form-item label="描述 : ">
          <p>{{lookObj.describes}}</p>
        </el-form-item>
        <el-form-item label="图片 : ">
          <p class="pic">
            <img v-for="item in imgArr" :key="item" @click="showPic(item)"
            :src="$store.state.configData.imgDomain + item"
            alt="图片">
          </p>
        </el-form-item>
      </el-form>
      <el-dialog width="40%" :visible.sync="maxPic" append-to-body>
        <p class="pic_max">
          <img :src="$store.state.configData.imgDomain + isShowPic" alt="图片">
        </p>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Qa from "@api/qa";
import { debounce } from "typescript-debounce-decorator";

@Component({
  components: {
    //"v-editor": () => import("@c/VEditor.vue")
  }
})
export default class Qalist extends Vue {
  imgArr: any = [];
  params = {
    pageSize: 10,
    pageNum: 1,
    query: "",
    type: "",
    sortField: "createTime",
    sortBy: false
  };
  showContent: boolean = false;
  maxPic: boolean = false;
  isShowPic: string = "";
  tableData: any[] = [];
  // time: string[] = [];
  total: number = 0;
  loading: boolean = false;
  isPending: boolean = false;
  qaObj: any = {
    type: 1,
    opinionId: "",
    opinionTitle: "",
    answer: ""
  };
  lookObj: any = {};
  look(e: any) {
    this.loading = true;
    let data = { opinionId: e.opinionId };
    console.log(JSON.stringify(data), "this.qaObj");
    Qa.query_opinion({ data })
      .then(res => {
        console.log(JSON.stringify(res), "query_opinion");
        if (res.code === 0) {
          let _this = this;
          this.lookObj = res.data;
          this.lookObj.createTime = this.$formatDate(res.data.createTime);
          this.showContent = true;
          let url = res.data.imgUrl.split(",");
          for (let i = 0; i < url.length; i++) {
            if (url[i]) {
              this.imgArr.push(url[i]);
            }
          }
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  typeArr: object[] = [
    {
      id: 1,
      text: "管理站"
    },
    {
      id: 2,
      text: "微就业"
    },
    {
      id: 3,
      text: "网络学院"
    }
  ];
  typeArr1: object[] = [
    {
      id: 0,
      text: "未读"
    },
    {
      id: 1,
      text: "已读"
    }
  ];
  prm = {};

  created() {
    this.getList();
    Object.keys(this.prm).forEach(i => {
      //@ts-ignore
      this.prm[i] = this.$store.state.activeMenu[this.$route.path][i];
    });
  }
  saveBtn() {
    //@ts-ignore
    this.qaObj.answer = this.$refs.editor.getHtml();
    if (!this.qaObj.opinionTitle || !this.qaObj.answer) {
      this.$notify({
        title: "提示",
        message: `请输入完整的信息!`,
        type: "error"
      });
      return;
    } else {
      let data = { ...this.qaObj };
      this.isPending = true;
      Qa.create_opinion({ data })
        .then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "提示",
              message: "操作成功！",
              type: "success"
            });
            this.closeAudit();
            this.getList();
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }
  }
  closeAudit() {
    this.showContent = false;
    this.closeContent();
  }
  closeContent() {
    this.qaObj = {
      type: 1,
      opinionTitle: "",
      answer: ""
    };
    this.imgArr = [];
    this.getList();
  }
  showPic(e: any) {
    this.maxPic = true;
    this.isShowPic = e;
  }
  del(e: any) {
    this.$confirm(`是否将 "${e.content}" 删除? `, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        let data = {
          opinionId: e.opinionId
        };
        Qa.delete_opinion({ data })
          .then(res => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: "删除成功！",
                type: "success"
              });
              this.getList();
            } else {
              this.loading = false;
            }
          })
          .catch(() => {
            this.loading = false;
          });
      })
      .catch(() => {});
  }
  sortFunc() {
    this.params.sortBy = !this.params.sortBy;
    this.getList();
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {if (this.params.state || this.params.query || this.params.type) {
      this.params.pageNum = 1;
    }};
    let data = { ...this.params };
    Qa.opinion_list({ data })
      .then(res => {
        if (res.code === 0) {
          res.data.result.forEach((i: any) => {
            i.createTimeStr = this.$formatDate(i.createTime);
            i.stateStr = this.$mapTypeStr(i.type, this.typeArr);
            i.stateStr1 = this.$mapTypeStr(i.state, this.typeArr1);
          });
          this.total = res.data.total;
          this.tableData = res.data.result;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
<style lang="scss" scoped>
.pic img {
  max-width: 250px;
  max-height: 250px;
  margin-right: 10px;
  border: 1px solid #f3f3f3;
}
.pic_max img {
  max-width: 100%;
}
</style>
