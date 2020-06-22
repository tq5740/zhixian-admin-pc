<template>
  <div>
    <el-row class="test-top">
      <el-form :inline="true">
        <el-form-item>
          <el-input style="display:none"></el-input>
          <el-input placeholder="试题题目" v-model="params.query" class='w230' @keyup.13.native="searchKey" clearable>
            <el-button @click="searchKey" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="题型" class='w150' v-model="params.type" @change="getList" clearable @clear="params.type = ''">
            <el-option v-for="(i) in $store.state.testType" :key="i.text" :label="i.text" :value="i.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="test-body">
      <div class="test-box" v-for="(item, index) in tableData" :key="index" :style="index+1 === tableData.length ? 'border: none' : ''">
        <div class="title">
          <p>{{`${index + 1}、【${item.questionTypeStr}】${item.examQuestionTitle}`}}</p>
          <span>{{`（${item.score}）分`}}</span>
        </div>
        <div class="options" v-if="item.questionType == 1 || item.questionType == 2 || item.questionType == 3">
          <ul>
            <li v-for="(options, key) in JSON.parse(item.options)" :key="key">
              {{String.fromCharCode(65 + key) + "&nbsp;&nbsp;&nbsp;" + options}}
            </li>
          </ul>
        </div>
        <div class="answer" v-if="item.questionType != 4">
          <p><span class="green">正确答案：</span><span>{{item.answerStr}}</span></p>
          <p class="analysis" v-if="item.analysis">【答案解析】{{item.analysis}}</p>
        </div>
        <div class="scenarios" v-else>
          <div v-for="(scenarios, num) in item.examQuestionScenarios" :key="num">
            <div class="title">
              <p>{{`${num + 1}、【${$mapTypeStr(scenarios.type, $store.state.testType)}】${scenarios.examQuestionTitle}`}}</p>
            </div>
            <div class="options" v-if="scenarios.type == 1 || scenarios.type == 2 || scenarios.type == 3">
              <ul>
                <li v-for="(options, key) in JSON.parse(scenarios.options)" :key="key">
                  {{String.fromCharCode(65 + key) + "&nbsp;&nbsp;&nbsp;" + options}}
                </li>
              </ul>
            </div>
            <div class="answer">
              <span class="green">正确答案：</span><span>{{scenarios.answerStr}}</span>
            </div>
          </div>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Papers from "@api/exam";

//https://github.com/ktsn/vuex-class
@Component({
  props: {
    id: {
      type: String,
      default: ""
    },
    num: {
      type: Number,
      default: null
    },
    exam: {
      type: String,
      default: ""
    }
  }
})

export default class TestList extends Vue {
  params: any = {
    number: this.num,
    type: "",
    examBankId: this.id,
    query: "",
    sortBy: false,
    sortField: "examBankId,number"
  };
  tableData: any[] = [];
  loading: boolean = false;
  examBankId: string = "";
  isPending: boolean = false;

  created() {
    this.getList();
  }
  getList(type: any) {
    this.loading = true;
    if (type !== 'type') {
      if (
        this.params.query ||
        this.params.type
      ) {
        this.params.pageNum = 1;
      }
    }
    let data = { ...this.params };
    Papers.exam_paper_list_admin({ data })
      .then(res => {
        if (res.code === 0) {
          res.data.forEach((i: any) => {
            i.questionTypeStr = this.$mapTypeStr(i.questionType, this.$store.state.testType);
            if (i.questionType == 1 || i.questionType == 3) {
              i.answerStr = String.fromCharCode(65 + JSON.parse(i.options).indexOf(i.answer.replace(/\["|"\]/g,'')))
            } else if (i.questionType == 2) {
              var arr = [];
              var ans = JSON.parse(i.answer);
              var len = JSON.parse(i.answer).length;
              for (var ind = 0; ind < len; ind ++) {
                arr.push(String.fromCharCode(65 + JSON.parse(i.options).indexOf(ans[ind].replace(/\["|"\]/g,''))))
              }
              i.answerStr = arr.join("、");
            } else if (i.questionType == 4) {
              i.examQuestionScenarios.forEach((e: any) => {
                if (e.type == 1 || e.type == 3) {
                  e.answerStr = String.fromCharCode(65 + JSON.parse(e.options).indexOf(e.answer.replace(/\["|"\]/g,'')))
                } else if (e.type == 2) {
                  var arr = [];
                  var ans = JSON.parse(e.answer);
                  var len = JSON.parse(e.answer).length;
                  for (var ind = 0; ind < len; ind ++) {
                    arr.push(String.fromCharCode(65 + JSON.parse(e.options).indexOf(ans[ind].replace(/\["|"\]/g,''))))
                  }
                  e.answerStr = arr.join("、");
                } else {
                  e.answerStr = JSON.stringify(e.answer).replace(/\"|\[|\]|\\/g, '').replace(/,/g, '；');
                }
              })
            } else {
              i.answerStr = JSON.stringify(i.answer).replace(/\"|\[|\]|\\/g, '').replace(/,/g, '；');
            }
          });
          this.tableData = res.data;
          this.loading = false;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
  @debounce(200, { leading: false })
  searchKey() {
    this.getList();
  }
}  
</script>
<style lang="scss" scoped>
.test-top {
  padding: 20px 35px 0px 35px;
}
.test-body {
  padding-bottom: 20px;
}
.test-box {
  border-bottom: 1px solid #D8D8D8;
  padding: 20px 35px 5px 35px;
  .title {
    font-size: 16px;
    margin-bottom: 15px;
    p {
      margin: 0;
      display: inline;
      color: #333;
    }
    span {
      color: #FC703E;
    }
  }
  .options {
    color: #4E5C79;
    ul {
      li {
        margin-bottom: 15px;
      }
    }
  }
  .answer {
    color: #4E5C79;
    border-radius: 4px;
    background-color: #ECF1F5;
    padding: 12px;
    font-weight: bold;
    margin-bottom: 20px;
    p {
      margin: 0;
    }
    .analysis {
      font-weight: normal;
      margin-top: 10px;
      margin-left: -7px;
    }
    .green {
      color: #42B983;
    }
  }
  .scenarios {
    .title {
      font-size: 14px;
      p {
        color: #4E5C79;
      }
    }
  }
}
</style>

