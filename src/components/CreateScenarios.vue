<template>
  <el-row class="wtd">
    <el-form :inline="true" label-width='120px'>
      <el-form-item label="情景题型 : ">
        <el-radio-group v-model="formCreate.type" @change='seleTopic'>
          <el-radio label="1">单选题</el-radio>
          <el-radio label="2">多选题</el-radio>
          <el-radio label="3">判断题</el-radio>
          <el-radio label="5">填空题</el-radio>
          <el-radio label="6">问答题</el-radio>
        </el-radio-group>
      </el-form-item><br />
      <el-form-item label="题干 : ">
        <el-input v-model='formCreate.examQuestionTitle' type="textarea" class='w100per h120'></el-input>
      </el-form-item><br />

      <!--单选和多选-->
      <el-form-item label="选项 : " v-show='formCreate.type == 1 || formCreate.type == 2'>
        <el-table :data="seleData" stripe style="width: 100%" border empty-text='请添加选项'>
          <el-table-column prop="letter" label="选项" min-width="80" align="center"></el-table-column>

          <el-table-column prop="options" label="选项内容" min-width="240" align="center" class='border'>
            <template slot-scope='scope'>
              <el-input class='border' @focus='contFun1(scope.row,$event,scope.$index)' @blur='contFun(scope.row,$event,scope.$index)' v-model='scope.row.content' placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="sele" label="正确选项" min-width="100" align="center" class='border'>
            <template slot-scope='scope'>
              <el-checkbox @change='seleFun(scope.row,$event,scope.$index)' v-model='scope.row.sele'></el-checkbox>
            </template>
          </el-table-column>

          <el-table-column prop="address" label="操作" min-width='80' align="center">
            <template slot-scope='scope'>
              <el-button type="text" @click='deleArr(scope.$index)'>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class='m-top' @click='oneSelect'>增加选项</el-button>
      </el-form-item>
      <!--单选和多选-->
      <!--判断-->
      <el-form-item label="选项 : " v-show='formCreate.type == 3'>
        <el-radio v-model="formCreate.answer" label="正确">正确</el-radio>
        <el-radio v-model="formCreate.answer" label="错误">错误</el-radio>
      </el-form-item>
      <!--判断-->
      <!--填空-->
      <el-form-item label="选项 : " v-show='formCreate.type == 5'>
        <el-table :data="seleData" stripe border empty-text='请添加选项'>
          <el-table-column prop="letter" label="选项" min-width="100" align="center"></el-table-column>

          <el-table-column prop="content" label="答案" min-width="327" align="center" class='border'>
            <template slot-scope='scope'>
              <el-input class='border' v-model='scope.row.content' placeholder="请输入"></el-input>
            </template>
          </el-table-column>

          <el-table-column prop="address" label="操作" min-width='70' align="center">
            <template slot-scope='scope'>
              <el-button type="text" @click='deleArr1(scope.$index)'>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class='m-top' @click='oneSelect1'>增加答案</el-button>
      </el-form-item><br />
      <!--填空-->
      <!--问答-->
      <el-form-item label="答案 : " v-show='formCreate.type == 6'>
        <el-input v-model='formCreate.answer' type="textarea" class='w100per h120'></el-input>
        &nbsp;
        <span class="fc303e">(选填)</span>
      </el-form-item><br />
      <!--问答-->
      <el-form-item label="答案解析 : ">
        <el-input v-model='formCreate.analysis' type="textarea" class='w100per h120'></el-input>
        &nbsp;
        <span class="fc303e">(选填)</span>
      </el-form-item><br />
      <el-form-item label=" ">
        <el-button type="primary" @click='createdQuestions'>确定</el-button>
      </el-form-item><br />
    </el-form>
  </el-row>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Exam from "@api/exam";
@Component({

})
export default class createScenarios extends Vue {
  // @Prop({ default: "" })
  // public id: string;

  formCreate = {
    examQuestionTitle: "",
    type: "1",
    analysis: "",
    answer: "",
    options: []
  };
  seleData: any[] = [
    {
      letter: "A"
    }
  ];
  answerArr: any[] = [];

  created() {
    
  }
  seleTopic() {
    if (this.formCreate.type == 1) {
      for (let i = 0; i < this.seleData.length; i++) {
        this.seleData[i].letter = String.fromCharCode(65 + i);
      }
    } else if (this.formCreate.type == 2) {
      for (let i = 0; i < this.seleData.length; i++) {
        this.seleData[i].letter = String.fromCharCode(65 + i);
      }
    } else if (this.formCreate.type == 3) {
    } else if (this.formCreate.type == 4) {
      if (this.stateEditCreate == "true") {
        this.seleData[0].sele = "";
      }
    } else if (this.formCreate.type == 5) {
      for (let i = 0; i < this.seleData.length; i++) {
        this.seleData[i].letter = "第" + (i + 1) + "空";
      }
      this.answerArr = [];
    }
  }

  contFun1(data: any, event: any, index: any) {
    this.formerMsg = this.seleData[index].content;
  }
  contFun(data: any, event: any, index: any) {
    if (this.formCreate.type == 1) {
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
            this.answerArr = [];
          }
        }
      }
    } else if (this.formCreate.type == 2) {
      if (!data.content) {
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
            if (this.answerArr[i] == this.formerMsg) {
              this.answerArr[i] = this.seleData[index].content;
              return;
            }
          }
        }
        if (this.seleData[index].sele) {
          this.answerArr.push(this.seleData[index].content);
        }
      }
    }
  }
  seleFun(data, event, index) {
    // 题选项
    if (this.formCreate.type == 1 && this.seleData[index].sele == true && this.seleData[index].content) {
      for (let i = 0, len = this.seleData.length; i < len; i++) {
        if (i == index) {
          this.seleData[index].sele = true;
        } else {
          this.seleData[i].sele = false;
        }
      }
    }
    if (this.seleData[index].sele == true && !this.seleData[index].content){
      this.seleData[index].sele = false;
      this.$notify.info({
        title: "消息",
        message: "请先填写选项"
      });
    }
  }
  deleArr1(obj: any) {
    this.seleData.splice(obj, 1);
    for (let i = 0, len = this.seleData.length; i < len; i++) {
      this.seleData[i].letter = "第" + (i + 1) + "空";
    }
  }
  async createdQuestions() {
    if (!this.formCreate.examQuestionTitle) {
      this.$notify.error({
        title: "错误",
        message: "题干不能为空"
      });
      return;
    }
    this.formCreate.options = [];
    this.answerArr = [];
    for (let i = 0, len = this.seleData.length; i < len; i++) {
      if (this.formCreate.type == 5) {
        if(!this.seleData[i].content){
          this.$notify.error({
            title: "错误",
            message: "答案不能为空"
          });
          return;
        }
        this.answerArr.push(this.seleData[i].content);
      } else if (this.formCreate.type == 1 || this.formCreate.type == 2) {
        if (!this.seleData[i].content) {
          this.$notify.error({
            title: "错误",
            message: "选项不能为空"
          });
          return;
        } else {
          this.formCreate.options.push(this.seleData[i].content);
          if( this.seleData[i].sele ){
            this.answerArr.push(this.seleData[i].content);
          }
        }
      } else {
        this.formCreate.options = [];
      }
    }
    if (this.formCreate.type == 1) {
      if (!this.answerArr || this.answerArr.length < 1) {
        this.$notify.error({
          title: "错误",
          message: "单选题至少1个答案"
        });
        return;
      }
    }
    if (this.formCreate.type == 2) {
      if (!this.answerArr || this.answerArr.length < 2) {
        this.$notify.error({
          title: "错误",
          message: "多选题至少2个答案"
        });
        return;
      }
    }
    if (this.formCreate.type == 3) {
      this.formCreate.options = ["正确","错误"];
    }
    this.formCreate.options = JSON.stringify(this.formCreate.options);
    if (this.formCreate.type == 6 || this.formCreate.type == 3) {
      if (!this.formCreate.answer && this.formCreate.type == 3) {
        this.$notify.error({
          title: "错误",
          message: "答案不能为空"
        });
        return;
      }
      this.formCreate.answer = '["' + this.formCreate.answer + '"]'
    } else {
      this.formCreate.answer = JSON.stringify(this.answerArr);
    }
    this.$emit("addData", this.formCreate);
    this.$emit("close");
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
  deleArr(obj: any) {
    //从新排序ABCD
    if (typeof this.answerArr === "string") {
      this.answerArr = JSON.parse(this.answerArr);
    }
    if (this.seleData[obj].sele) {
      if (this.answerArr.length === 1) {
        this.answerArr = [];
      } else {
        this.answerArr.splice(obj - 1, 1);
      }
    }
    this.seleData.splice(obj, 1);
    for (let i = 0, len = this.seleData.length; i < len; i++) {
      this.seleData[i].letter = String.fromCharCode(i + 65);
    }
  }
  oneSelect1() {
    //--------增加选项
    if (this.seleData.length == 0) {
      this.seleData.push({
        letter: "第" + 1 + "空",
        content: "",
        sele: null
      });
    } else {
      this.seleData.push({
        letter: "第" + (Number(this.seleData[this.seleData.length - 1].letter[1]) + 1) + "空",
        content: "",
        sele: null
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.m-top{
  margin-top: 10px;
}
.h120{
  /deep/{
    .el-textarea__inner{
      height: 120px;
    }
  }
}
.wtd{
  /deep/{
    .el-form--inline .el-form-item{
      width: 100%;
    }
    .el-form--inline .el-form-item__content{
      width: 80%;
    }
    .w100per{
      width: 100%;
    }
  }
}
</style>
