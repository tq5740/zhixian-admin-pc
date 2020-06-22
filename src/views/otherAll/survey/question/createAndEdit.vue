<template>
  <div id="createAndEdit">
    <el-form label-width="120px" label-position="right">
      <el-form-item label="问题类型 : ">
        <el-radio-group v-model="editData.type">
          <el-radio :label="1">单选题</el-radio>
          <el-radio :label="2">多选题</el-radio>
          <el-radio :label="5">填空题</el-radio>
          <el-radio :label="6">问答题</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="问题标题 : ">
        <el-input placeholder="请输入调查标题" v-model="editData.surveyQuestionTitle" class="w80per"></el-input>
      </el-form-item>
      <el-form-item label="填空数量 : " v-if="editData.type == 5">
        <el-radio-group v-model="editData.options">
          <el-radio :label="1">1个</el-radio>
          <el-radio :label="2">2个</el-radio>
          <el-radio :label="3">3个</el-radio>
          <el-radio :label="4">4个</el-radio>
          <el-radio :label="5">5个</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选项 : " v-if="editData.type == 1 || editData.type == 2">
        <el-table :data="seleData" stripe class="w80per" border empty-text='请添加选项'>
          <el-table-column prop="letter" label="选项" min-width="80" align="center"></el-table-column>
          <el-table-column prop="options" label="选项内容" min-width="240" align="center" class='border'>
            <template slot-scope='scope'>
              <el-input class='border' @focus='contFun1(scope.row,$event,scope.$index)' @blur='contFun(scope.row,$event,scope.$index)' v-model='scope.row.content' placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" min-width='80' align="center">
            <template slot-scope='scope'>
              <el-button type="text" @click='deleArr(scope.$index)'>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class='m-top' @click='oneSelect'>增加选项</el-button>
        <span class="fc303e" v-show="editData.type == 6">（选填）</span>
      </el-form-item>
      <el-form-item label=" " label-width="120px">
        <el-button type="primary" :loading="isPending" @click="saveBtn">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Survey from "@api/data";

@Component({
  components: {
  }
})
export default class CreateAndEdit extends Vue {
  @Prop({ default: "" })
  public title: string;
  @Prop({ default: {} })
  public queryData: object;
  editData: any = {
    surveyId: this.queryData.surveyId,
    surveyQuestionTitle: "",
    surveyQuestionId: this.queryData.surveyQuestionId,
    type: 1,
    options: 1
  };
  isPending: boolean = false;
  seleData: any[] = [];

  created() {
    this.init();
  }
  init () {
    if (this.queryData.surveyQuestionId) {
      this.orgDisabled = true;
      let data = {
        surveyQuestionId: this.queryData.surveyQuestionId
      }
      Survey.query_survey_question_admin({ data }).then(res => {
        if (res.code === 0) {
          let resData = res.data;
          this.editData.surveyQuestionTitle = resData.surveyQuestionTitle;
          this.editData.type = resData.type;
          if (this.editData.type == 1 || this.editData.type == 2) {
            if (resData.options) {
              var Option = JSON.parse(resData.options);
            }
            this.seleData = [];
            let initState = null;
            for (let i = 0, len = Option.length; i < len; i++) {
              this.seleData.push({
                content: Option[i],
                sele: initState,
                letter: String.fromCharCode(65 + i)
              });
            }
          } else if (this.editData.type == 5) {
            this.editData.options = +resData.options;
          }
        }
      });
    } else {
      this.editData = {
        surveyId: this.queryData.surveyId,
        surveyQuestionTitle: "",
        type: 1,
        options: 1
      }
    }
  }
  contFun1(data: any, event: any, index: any) {
    this.formerMsg = this.seleData[index].content;
  }
  contFun(data: any, event: any, index: any) {
    if (this.editData.type == 1) {
      if (data.content == "") {
        this.seleData[index].sele = false;
      } else if (data.content) {
        for (let i = 0, len = this.seleData.length; i < len; i++) {
          if (this.seleData[index].content == this.seleData[i].content && index != i) {
            this.$notify.error({
              title: "错误",
              message: "选项不能重复"
            });
            this.seleData[index].content = this.formerMsg;
            this.seleData[index].sele = false;
          }
        }
      }
    } else if (this.editData.type == 2) {
      if (data.content == "") {
        this.seleData[index].sele = false;
      } else if (data.content) {
        for (let i = 0; i < this.seleData.length; i++) {
          if (this.seleData[index].content == this.seleData[i].content && index != i) {
            this.seleData[index].content = this.formerMsg;
            this.$notify.error({
              title: "错误",
              message: "选项不能重复"
            });
            this.seleData[index].sele = false;
            return;
          } else {
            
          }
        }
      }
    }
  }
  deleArr(obj) {
    this.seleData.splice(obj, 1);
    for (let i = 0, len = this.seleData.length; i < len; i++) {
      this.seleData[i].letter = String.fromCharCode(i + 65);
    }
  }
  oneSelect() {
    //--------增加选项
    if (this.seleData.length == 0) {
      this.seleData.push({
        letter: String.fromCharCode(65),
        content: "",
        sele: null
      });
    } else {
      this.seleData.push({
        letter: String.fromCharCode(1 + this.seleData[this.seleData.length - 1].letter.charCodeAt()),
        content: "",
        sele: null
      });
    }
  }
  saveBtn() {
    if (this.editData.type == 1 || this.editData.type == 2) {
      let arr = [];
      if (this.seleData.length === 0) {
        this.editData.options = ""
      } else {
        for (let i = 0, len = this.seleData.length; i < len; i++) {
          if (!this.seleData[i].content) {
            this.$notify.error({
              title: "错误",
              message: "选项不能为空"
            });
            return;
          } else {
            arr.push(this.seleData[i].content);
          }
        }
        this.editData.options = JSON.stringify(arr);
      }
    }
    this.isPending = true;
    let data = { ...this.editData };
    if (this.title == "创建调查问题") {
      Survey.create_survey_question_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOver");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    } else {
      delete data.orgId;
      Survey.update_survey_question_admin({ data })
        .then(res => {
          if (res.code === 0) {
            this.$emit("createEditOver");
          }
        })
        .finally(() => {
          this.isPending = false;
        });
    }
  }
}
</script>
<style lang="scss" scoped>
.m-top{
  margin-top: 10px;
}
</style>