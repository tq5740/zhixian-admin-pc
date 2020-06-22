<template>
  <div :class="{disabledStyle: title === '详情' || title === '加入正式试题'}" class="wtd">
    <el-row>
      <el-form :inline="true" label-width='120px' :disabled="official">
        <!-- <el-form-item label="选择题库 : ">
          <el-select filterable clearable v-model="formCreate.examBankId" class='w100per' @change="getBankId">
            <el-option v-for="(i) in bankList" :key="i.examBankId" :label="i.examBankTitle" :value="i.examBankId"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="题型 : " v-if="!editOfficial">
          <el-radio-group v-model="formCreate.type" @change='seleTopic' :disabled="edit">
            <el-radio label="1">单选题</el-radio>
            <el-radio label="2">多选题</el-radio>
            <el-radio label="3">判断题</el-radio>
            <el-radio label="4">情景题</el-radio>
            <el-radio label="5">填空题</el-radio>
            <el-radio label="6">问答题</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="困难度 : ">
          <el-radio v-model="formCreate.diffculty" label="1">困难</el-radio>
          <el-radio v-model="formCreate.diffculty" label="2">中等</el-radio>
          <el-radio v-model="formCreate.diffculty" label="3">简单</el-radio>
        </el-form-item>

        <el-form-item label="知识点 : " v-if="!editOfficial">
          <el-cascader v-model="knowledgeData" class='w100per' placeholder="请选择" :options="pointClassify" :props="defaultProps" @change='postartment'
            filterable change-on-select clearable></el-cascader>
          <el-cascader v-model="knowledgeData1" class='w100per m-top' placeholder="请选择" :options="pointClassify" :props="defaultProps"
            @change='postartment1' filterable change-on-select clearable></el-cascader>
          <el-cascader v-model="knowledgeData2" class='w100per m-top' placeholder="请选择" :options="pointClassify" :props="defaultProps"
            @change='postartment2' filterable change-on-select clearable></el-cascader>
          &nbsp;
        </el-form-item>
        <el-form-item label="题干 : ">
          <el-input v-model='formCreate.examQuestionTitle' type="textarea" class='w100per h120'></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width='120px' v-show="formCreate.type != 4" :disabled="official">

        <!--单选和多选-->
        <el-form-item label="选项 : " v-show='formCreate.type == 1 || formCreate.type == 2'>
          <el-table :data="seleData" stripe style="width: 100%" border empty-text='请添加选项'>
            <el-table-column prop="letter" label="选项" min-width="80" align="center"></el-table-column>

            <el-table-column prop="options" label="选项内容" min-width="240" align="center" class='border'>
              <template slot-scope='scope'>
                <el-input class='border' @focus='contFun1(scope.row,$event,scope.$index)' @blur='contFun(scope.row,$event,scope.$index)'
                  v-model='scope.row.content' placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>

            <el-table-column prop="sele" label="正确选项" min-width="100" align="center" class='border'>
              <template slot-scope='scope'>
                <el-checkbox @change='seleFun(scope.row,$event,scope.$index)' v-model='scope.row.sele'></el-checkbox>
              </template>
            </el-table-column>

            <el-table-column prop="address" label="操作" min-width='80' align="center" v-if="!official">
              <template slot-scope='scope'>
                <el-button type="text" @click='deleArr(scope.$index)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button class='m-top' @click='oneSelect' v-if="!official">增加选项</el-button>
        </el-form-item>
        <!--单选和多选-->
        <!--判断-->
        <el-form-item label="选项 : " v-show='formCreate.type == 3'>
          <el-radio v-model="formCreate.answer" label="正确">正确</el-radio>
          <el-radio v-model="formCreate.answer" label="错误">错误</el-radio>
        </el-form-item>
        <!--判断-->
        <!--填空-->
        <el-form-item label="答案 : " v-show='formCreate.type == 5'>
          <el-table :data="seleData" stripe border empty-text='请添加选项'>
            <el-table-column prop="letter" label="第几空" min-width="100" align="center"></el-table-column>

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
      </el-form>
      <el-form v-if="formCreate.type == 4" label-width='120px'>
        <el-form-item label="情景题内容 : ">
          <el-table ref="mainTable" border :data="tableData">
            <el-table-column prop="typeStr" label="情景题类型" min-width="100"></el-table-column>
            <el-table-column prop="examQuestionTitle" label="题干" min-width="120"></el-table-column>
            <el-table-column prop="options" label="选项" min-width="120"></el-table-column>
            <el-table-column prop="answer" label="答案" min-width='95'></el-table-column>
            <el-table-column prop="analysis" label="解析" min-width='95'></el-table-column>
            <el-table-column prop="operate" label="操作" width="70" v-if="!official">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click='deleScenarios(scope.$index)'>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="操作 : " v-if="!official">
          <el-button @click='addScenarios'>添加情景小题</el-button>
        </el-form-item>
      </el-form>
      <el-form label-width='120px'>
        <el-form-item label=" ">
          <el-button type="primary" @click='createdQuestions' v-if="!official">确定</el-button>
          <el-button type="primary" @click='add' v-if="official && title != '详情'">加入正式题库</el-button>
        </el-form-item><br />
      </el-form>
    </el-row>
    <el-dialog :title="`情景题`" :visible.sync="createBox" v-if="createBox" :before-close="closeScenarios" append-to-body>
      <create-scenarios @addData="addData" @close="closeScenarios" name="aaa"></create-scenarios>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import Exam from "@api/exam";
import { types } from "util";
import { emptyLast } from "@utils/index";
@Component({
  components: {
    "create-scenarios": () => import("@c/CreateScenarios.vue")
  }
})
export default class createQuestion extends Vue {
  @Prop({ default: {} })
  public queryData: object;
  @Prop({ default: false })
  public official: boolean;
  @Prop({ default: false })
  public editOfficial: boolean;
  @Prop({ default: false })
  public edit: boolean;
  @Prop({ default: "" })
  public title: string;

  knowledgeData: any = [];
  knowledgeData1: any = [];
  knowledgeData2: any = [];
  bankList: any = [];
  formCreate = {
    examQuestionTemporaryId: "",
    examBankId: "",
    examQuestionTitle: "",
    type: "1",
    diffculty: "1",
    examPointId: [],
    analysis: "",
    answer: "",
    options: [],
    questionScenarios: []
  };
  pointClassify: any = [];
  seleData: any[] = [
    {
      letter: "A"
    }
  ];
  defaultProps: object = {
    children: "children",
    label: "examPointTitle",
    value: "examPointId"
  };
  createBox: boolean = false;
  tableData: any[] = [];
  answerArr: any[] = [];
  orgId: string = "";

  created() {
    if (!this.editOfficial) {
      this.getKnow().then(res => {
        emptyLast(res.data);
        this.pointClassify = res.data;
      });
    }
    // this.getBankList().then(res => {
    //   this.bankList = res.data;
    // });
    if (this.queryData && this.queryData.examQuestionTemporaryId) {
      let data = {
        examQuestionTemporaryId: this.queryData.examQuestionTemporaryId
      };
      Exam.query_question_temporary_admin({ data }).then(res => {
        if (res.code === 0) {
          const queryData = res.data;
          this.disposeData(queryData);
        }
      });
    } else if (this.editOfficial) {
      let data = {
        examQuestionId: this.queryData.examQuestionId
      };
      Exam.query_exam_question_admin({ data }).then(res => {
        if (res.code === 0) {
          const queryData = res.data;
          this.disposeData(queryData);
        }
      });
    } else {
      this.formCreate.examBankId = this.queryData.examBankId;
    }
  }
  disposeData(queryData: any) {
    this.orgId = queryData.orgId;
    this.formCreate.examQuestionTemporaryId = queryData.examQuestionTemporaryId;
    this.formCreate.examBankId = queryData.examBankId;
    this.formCreate.examQuestionTitle = queryData.examQuestionTitle; //---------题干
    this.formCreate.type = "" + queryData.type; //----------------------题型
    this.formCreate.diffculty = "" + queryData.diffculty; //-----------------困难度
    this.formCreate.examPointId = JSON.parse(queryData.examPointId || "[]"); //---------------知识点
    this.formCreate.analysis = queryData.analysis; //答案解析
    if (queryData.examQuestionScenarios) {
      this.tableData = queryData.examQuestionScenarios;
      this.tableData.forEach(e => {
        e.typeStr = this.$mapTypeStr(e.type, this.$store.state.testType);
      });
    } else {
      this.tableData = [];
    }
    if (queryData.options) {
      var Option = JSON.parse(queryData.options);
    }
    if (queryData.answer) {
      var Answer = JSON.parse(queryData.answer);
    }
    if (this.editOfficial) {
      this.formCreate.examQuestionId = queryData.examQuestionId;
      this.getKnow().then(res => {
        emptyLast(res.data);
        this.pointClassify = res.data;
        if (this.formCreate.examPointId && this.formCreate.examPointId[0])
          this.knowledgeData = [
            ...this.$getFather(
              this.pointClassify,
              this.pointClassify,
              this.formCreate.examPointId[0]
            ),
            this.formCreate.examPointId[0]
          ];
        if (this.formCreate.examPointId && this.formCreate.examPointId[1])
          this.knowledgeData1 = [
            ...this.$getFather(
              this.pointClassify,
              this.pointClassify,
              this.formCreate.examPointId[1]
            ),
            this.formCreate.examPointId[1]
          ];
        if (this.formCreate.examPointId && this.formCreate.examPointId[2])
          this.knowledgeData2 = [
            ...this.$getFather(
              this.pointClassify,
              this.pointClassify,
              this.formCreate.examPointId[2]
            ),
            this.formCreate.examPointId[2]
          ];
      });
    }
    if (queryData.type == 1 || queryData.type == 2) {
      this.seleData = [];
      let initState = null;
      for (let i = 0, len = Option.length; i < len; i++) {
        for (let j = 0, le = Answer.length; j < le; j++) {
          if (Answer[j] == Option[i]) {
            initState = true;
            break;
          } else {
            initState = false;
          }
        }
        this.answerArr = Answer;
        this.seleData.push({
          content: Option[i],
          sele: initState,
          letter: String.fromCharCode(65 + i)
        });
      }
    } else if (queryData.type == 3 || queryData.type == 6) {
      this.answerArr = Answer[0];
      this.formCreate.answer = Answer[0];
    } else if (queryData.type == 5) {
      this.seleData = [];
      for (let i = 1; i <= Answer.length; i++) {
        this.seleData.push({
          content: Answer[i - 1],
          letter: "第" + i + "空"
        });
      }
    }
  }
  getBankList() {
    return Exam.query_exam_bank_title_admin();
  }
  getBankId(e: any) {
    this.getBankList().then(res => {
      this.bankList = res.data;
      this.bankList.find(i => {
        if (i.examBankId == e) {
          this.orgId = i.orgId;
          this.getKnow().then(res => {
            emptyLast(res.data);
            this.pointClassify = res.data;
          });
        }
      });
    });
  }
  // 知识点列表查询
  getKnow() {
    let data = {
      orgId: this.queryData.orgId
    };
    return Exam.exam_point_list_admin({ data });
  }
  add(e: any) {
    this.$confirm(
      "加入正式题库后，试题不能修改、删除，确认加入？",
      "加入正式题库",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }
    )
      .then(() => {
        let data = {
          examQuestionTemporaryId: `["${this.formCreate.examQuestionTemporaryId}"]`
        };
        Exam.add_question_temporary_admin({ data }).then(res => {
          if (res.code === 0) {
            this.$notify({
              title: "成功",
              message: "操作成功！",
              type: "success"
            });
            this.$emit("close");
          }
        });
      })
      .catch(() => {});
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
  postartment(data: any) {
    console.log(data);
    //-----------------筛选知识点
    if (data.length === 1) {
      this.formCreate.examPointId[0] = "" + data;
    } else if (data.length === 0) {
      this.formCreate.examPointId.splice(0, 1);
    } else if (data.length > 1) {
      this.formCreate.examPointId[0] = "" + data[data.length - 1];
    }
  }
  postartment1(data: any) {
    //-----------------筛选知识点
    if (data.length === 1) {
      this.formCreate.examPointId[1] = "" + data;
    } else if (data.length === 0) {
      this.formCreate.examPointId.splice(1, 1);
    } else if (data.length > 1) {
      this.formCreate.examPointId[1] = "" + data[data.length - 1];
    }
  }
  postartment2(data: any) {
    //-----------------筛选知识点
    if (data.length === 1) {
      this.formCreate.examPointId[2] = "" + data;
    } else if (data.length === 0) {
      this.formCreate.examPointId.splice(2, 1);
    } else if (data.length > 1) {
      this.formCreate.examPointId[2] = "" + data[data.length - 1];
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
          if (
            this.seleData[index].content == this.seleData[i].content &&
            index != i
          ) {
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
      if (data.content == "") {
        this.seleData[index].sele = false;
      } else if (data.content) {
        for (let i = 0; i < this.seleData.length; i++) {
          if (
            this.seleData[index].content == this.seleData[i].content &&
            index != i
          ) {
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
    if (
      this.formCreate.type == 1 &&
      this.seleData[index].sele == true &&
      this.seleData[index].content
    ) {
      for (let i = 0, len = this.seleData.length; i < len; i++) {
        if (i == index) {
          this.seleData[index].sele = true;
        } else {
          this.seleData[i].sele = false;
        }
      }
    }
    if (this.seleData[index].sele == true && !this.seleData[index].content) {
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
    if (!this.formCreate.examBankId && !this.editOfficial) {
      this.$notify.error({
        title: "错误",
        message: "请选择题库"
      });
      return;
    }
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
        if (!this.seleData[i].content) {
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
          if (this.seleData[i].sele) {
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
    if (this.formCreate.type == 4) {
      if (this.tableData && this.tableData.length != 0) {
        this.answerArr = [];
        this.formCreate.analysis = "";
        this.formCreate.options = [];
        this.tableData.forEach(e => {
          if (e.typeStr) {
            delete e.typeStr;
          }
        });
        this.formCreate.questionScenarios = JSON.stringify(this.tableData);
      } else {
        this.$notify.error({
          title: "错误",
          message: "情景题内容不能为空"
        });
        return;
      }
    }
    if (this.formCreate.type == 3) {
      this.formCreate.options = ["正确", "错误"];
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
      this.formCreate.answer = '["' + this.formCreate.answer + '"]';
    } else {
      this.formCreate.answer = JSON.stringify(this.answerArr);
    }
    if (typeof this.formCreate.examPointId != "string") {
      let arr = this.formCreate.examPointId;
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == "" || arr[i] == null || typeof arr[i] == "undefined") {
          arr.splice(i, 1);
        }
      }
      this.formCreate.examPointId = JSON.stringify(arr);
    }
    if (this.flag) return;
    this.flag = true;
    let data = {
      ...this.formCreate
    };
    if (this.editOfficial) {
      delete data.examPointId;
      var res = await Exam.update_exam_question_admin({ data }).catch(e => {});
    } else {
      var res = await Exam.create_exam_question_admin({ data }).catch(e => {});
    }
    this.flag = false;
    if (res.code === 0) {
      this.$notify({
        title: "成功",
        message: "操作成功",
        type: "success"
      });
      this.$emit("close");
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
        letter: String.fromCharCode(
          1 + this.seleData[this.seleData.length - 1].letter.charCodeAt()
        ),
        content: "",
        sele: null
      });
    }
  }
  deleArr(obj) {
    //从新排序ABCD
    if (typeof this.answerArr === "string") {
      let str = '["' + this.answerArr + '"]';
      this.answerArr = JSON.parse(str);
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
        letter:
          "第" +
          (Number(this.seleData[this.seleData.length - 1].letter[1]) + 1) +
          "空",
        content: "",
        sele: null
      });
    }
  }

  closeScenarios() {
    this.createBox = false;
  }
  addScenarios() {
    this.createBox = true;
  }
  deleScenarios(index: number) {
    this.tableData.splice(index, 1);
  }
  addData(e: any) {
    e.typeStr = this.$mapTypeStr(e.type, this.$store.state.testType);
    this.tableData.push(e);
  }
}
</script>
<style lang="scss" scoped>
  .w500 {
    width: 500px;
  }
  .w400 {
    width: 400px;
  }
  .m-top {
    margin-top: 10px;
  }
  .h120 {
    /deep/ {
      .el-textarea__inner {
        height: 120px;
      }
    }
  }
  .wtd {
    /deep/ {
      .el-form--inline .el-form-item {
        width: 100%;
      }
      .el-form--inline .el-form-item__content {
        width: 80%;
      }
      .w100per {
        width: 100%;
      }
    }
  }
  .disabledStyle {
    /deep/ {
      .el-input.is-disabled .el-input__inner {
        color: #606266;
      }
      .el-cascader.is-disabled .el-cascader__label {
        color: #606266;
      }
      .el-textarea.is-disabled .el-textarea__inner {
        color: #606266;
      }
    }
  }
</style>
