<template>
  <div>
    <el-button type="primary" icon="plus" @click="exportReg" :disabled="tableData.length ? false : true">导出报表</el-button>
    <br>
    <br>
    <el-form :inline="true" label-width='50px'>
      <el-row v-for='itm in seleData' :key="itm.id">
        <span style="margin-top:15px">单选题：{{itm.title}}</span>
        <br>
        <br>
        <el-form-item label=" ">
          <el-table :data="itm.selects" border>
            <el-table-column prop="selects" label="问题选项" min-width="230" align="center">
              <template slot-scope='scope'>
                {{itm.selects[scope.$index]}}
              </template>
            </el-table-column>
            <el-table-column prop="lengths" label="选择人数" min-width='110' align="center">
              <template slot-scope='scope'>
                {{itm.lengths[scope.$index]}}
              </template>
            </el-table-column>
            <el-table-column prop="ratio" label="比例" min-width='200' align="center">
              <template slot-scope='scope'>
                {{Number(itm.ratio[scope.$index])}} %
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-row>
      <el-row v-for='itm in seleData1' :key="itm.id">
        <span style="margin-top:15px">多选题：{{itm.title}}
        </span>
        <br>
        <br>
        <el-form-item label=" ">
          <el-table :data="itm.selects" border>
            <el-table-column prop="selects" label="问题选项" min-width="230" align="center">
              <template slot-scope='scope'>
                {{itm.selects[scope.$index]}}
              </template>
            </el-table-column>
            <el-table-column prop="lengths" label="选择人数" min-width='110' align="center">
              <template slot-scope='scope'>
                {{itm.lengths[scope.$index]}}
              </template>
            </el-table-column>
            <el-table-column prop="ratio" label="比例" min-width='200' align="center">
              <template slot-scope='scope'>
                {{Number(itm.ratio[scope.$index])}} %
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-row>
      <el-row>
        <p class="line-box" v-for='itm in seleData3' :key="itm.id">
          <span>填空题：{{itm.surveyQuestionTitle}}</span>
          <a @click="detailFillBtn(itm)">详情</a>
        </p>
      </el-row>
      <el-row>
        <p class="line-box" v-for='itm in seleData2' :key="itm.id">
          <span>问答题：{{itm.surveyQuestionTitle}}</span>
          <a @click="detailQaBtn(itm)">详情</a>
        </p>
      </el-row>
    </el-form>
    <el-dialog width="50%" v-if="detailQa" :title="title" :visible.sync="detailQa" :close-on-click-modal="false" append-to-body>
      <el-table :data="dataQa" border>
        <el-table-column prop="selects" label="序号" width="110" align="center">
          <template slot-scope='scope'>
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="answer" label="答案" min-width='110' align="center">
          <template slot-scope='scope'>
            {{scope.row.answer.replace(/\[|]|"/g, "")}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog width="50%" v-if="detailFill" :title="title" :visible.sync="detailFill" :close-on-click-modal="false" append-to-body>
      <el-table :data="dataFill" border>
        <el-table-column prop="userName" label="序号" width="110" align="center">
          <template slot-scope='scope'>
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="answer" label="答案" min-width='110' align="center">
          <template slot-scope='scope'>
            {{JSON.parse(scope.row.answer).join("、")}}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Survey from "@api/data";
@Component({
  components: {
  }
})
export default class Companyreg extends Vue {
  @Prop({ default: {} })
  public queryData: object;

  tableData: any[] = [];
  exportId: string = "";
  surveyTitle: string = "";
  statisticsData: any[] = [];
  seleData: any[] = [];
  seleData1: any[] = [];
  seleData2: any[] = [];
  seleData3: any[] = [];
  detailQa: boolean = false;
  title: string = "";
  dataQa: any[] = [];
  detailFill: boolean = false;
  dataFill: any[] = [];

  created() {
    this.init()
  }
  // 统计
  init() {
    this.seleData = [];
    this.seleData1 = [];
    this.seleData2 = [];
    this.seleData3 = [];
    this.exportId = this.queryData.surveyId;
    this.surveyTitle = this.queryData.surveyTitle;
    let data = {
      surveyId: this.queryData.surveyId
    };
    Survey.query_survey_report_admin({ data }).then(res => {
      if (res.code === 0) {
        let selects = "",
          lengths = "",
          ratio = 0;
        this.seleData2 = res.data.QA;
        this.seleData3 = res.data.FILL;
        for (let i = 0, len = res.data.RADIO.length; i < len; i++) {
          let title = res.data.RADIO[i].surveyQuestionTitle,
            answer = res.data.RADIO[i].answer || "未答",
            keys = Object.keys(res.data.RADIO[i].choiceNum[0]),
            val = Object.values(res.data.RADIO[i].choiceNum[0]),
            sumPeople = 0;
          val.forEach((item, idx) => {
            sumPeople += Number(item);
          });
          let ratio = [];
          val.forEach((item, idx) => {
            if (sumPeople != 0) {
              ratio.push(
                ((Number(item) / sumPeople).toFixed(4) * 100).toFixed(2)
              );
            } else {
              ratio.push("0");
            }
          });
          this.seleData.push({
            title: title,
            selects: keys,
            answer,
            lengths: val,
            ratio: ratio
          });
        }
        for (let i = 0, length = res.data.MULTI.length; i < length; i++) {
          let title = res.data.MULTI[i].surveyQuestionTitle,
            keys = Object.keys(res.data.MULTI[i].choiceNum[0]),
            answer = res.data.MULTI[i].answer || "未答",
            val = Object.values(res.data.MULTI[i].choiceNum[0]),
            sumPeople = 0;
          val.forEach((item, idx) => {
            sumPeople += Number(item);
          });
          var ratio = [];
          val.forEach((item, idx) => {
            if (sumPeople != 0) {
              ratio.push(
                ((Number(item) / sumPeople).toFixed(4) * 100).toFixed(2)
              );
            } else {
              ratio.push("0");
            }
          });
          this.seleData1.push({
            title: title,
            selects: keys,
            answer,
            lengths: val,
            ratio: ratio
          });
        }
        this.statisticsState = true;
      }
    });
  }
  exportReg() {
    window.open(
      `${Survey.exportSurveyData()}?token=${this.$store.state.userInfo.token}&siteHierarchy=A1-&surveyId=${this.exportId}`
    );
  }
  detailQaBtn(e: object) {
    this.title = e.surveyQuestionTitle;
    this.dataQa = JSON.parse(e.answer);
    this.detailQa = true;
  }
  detailFillBtn(e: object) {
    this.title = e.surveyQuestionTitle;
    let ar = JSON.parse(e.answer);

    this.dataFill = ar;
    this.detailFill = true;
  }
}
</script>
<style lang="scss" scope>
.line-box {
  span {
    display: inline-block;
    margin-right:20px;
  }
  a {
    cursor: pointer;
  }
}
</style>