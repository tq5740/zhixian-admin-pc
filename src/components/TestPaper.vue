<template>
  <div>
    <el-row style="display: flex;justify-content: space-between;border: 1px solid #ccc;">
      <el-col :span="from != 'survey' ? 4 : 8">
        <div class="init" style="border-left: none" :class="{ active: isActive=='1' }" @click="action = 1, activeFun(1)">单选题</div>
      </el-col>
      <el-col :span="from != 'survey' ? 4 : 8">
        <div class="init" :class="{ active: isActive=='2' }" @click="action = 2,activeFun(2)">多选题</div>
      </el-col>
      <el-col :span="4" v-if="from != 'survey'">
        <div class="init" :class="{ active: isActive=='3' }" @click="action = 3,activeFun(3)">判断题</div>
      </el-col>
      <el-col :span="4" v-if="from != 'survey'">
        <div class="init" :class="{ active: isActive=='4' }" @click="action = 4,activeFun(4)">情景题</div>
      </el-col>
      <el-col :span="from != 'survey' ? 4 : 8">
        <div class="init" :class="{ active: isActive=='5' }" @click="action = 5,activeFun(5)">填空题</div>
      </el-col>
      <el-col :span="from != 'survey' ? 4 : 8">
        <div class="init" :class="{ active: isActive=='6' }" @click="action = 6,activeFun(6)">问答题</div>
      </el-col>
    </el-row>
    <br />
		<br />
		<br />
    <!--单选-->
    <el-row v-show='isActive == 1? true : false'>
      <div v-if="from != 'survey'">单选题：共 {{DataMsg.length}} 道题（总 {{scoreTotal}} 分 / 得 {{userScore}} 分）</div>
      <div v-else>单选题：共 {{DataMsg.length}} 道题</div>
      <br />
      <el-row v-for='(item,key) in DataMsg' class='colo' :key='item.examAnswerId'>
        <div v-if="from != 'survey'">{{key+1}}，{{item.examQuestionTitle}}（{{item.score}}分 /
          <span style="color: #08BF78;"> {{ item.userScore ? item.userScore : 0}}分</span>）</div>
        <div v-else>{{key+1}}，{{item.surveyQuestionTitle}}</div>
        <br />
        <div v-for='(option,key) in JSON.parse(item.options)' :key="option">
          <div style="width: 45px;float: left;margin-right:15px;">
            <span class='abcd' :class="{error:item.userAnswerArr == String.fromCharCode(65 + key)}">{{String.fromCharCode(65 + key)}}</span>
          </div>
          <div style="width: 90%;float: left;">
            <span>{{option}}</span>
          </div>
          <div style="clear: both"></div>
          <br>
        </div>
        <br />
        <span v-if="from != 'survey'">正确答案是：
          <span style='color: #08BF78;'>{{item.answerArr ? ''+item.answerArr : ''}}</span>，你的答案是：
          <span style="color: #E64340;"> {{item.userAnswerArr ? ''+item.userAnswerArr : ''}}</span>
        </span>
        <span v-else>回答：
          <span style="color: #E64340;"> {{item.answerArr ? ''+item.answerArr : ''}}</span>
        </span>
        <br />
        <br />
        <br />
      </el-row>
    </el-row>

		<!--多选-->
		<el-row v-show='isActive == 2 ? true : false'>
			<div v-if="from != 'survey'">多选题：共 {{DataMsg.length}} 道题（总 {{scoreTotal}} 分 / 得 {{userScore}} 分）</div>
      <div v-else>多选题：共 {{DataMsg.length}} 道题</div>
			<br />
			<el-row v-for='(item,key) in DataMsg' class='colo' :key='item.examAnswerId'>
				<div v-if="from != 'survey'">{{key+1}}，{{item.examQuestionTitle}}（{{item.score}}分 /
					<span style="color: #08BF78;"> {{ item.userScore ? item.userScore : 0}}分</span>）</div>
        <div v-else>{{key+1}}，{{item.surveyQuestionTitle}}</div>
				<br />

				<div v-for='(option,OK) in JSON.parse(item.options)' :key="option">
					<div style="width: 45px;float: left;margin-right:15px;">
						<span class='abcd' :class="{error:item.userAnswerArr?''+item.userAnswerArr.filter(item => {return item == String.fromCharCode(65 + OK)}):false}">{{String.fromCharCode(65 + OK)}}</span>
					</div>
					<div style="width: 90%;float: left;">
						<span>{{option}}</span>
					</div>
					<div style="clear: both"></div>
					<br>
				</div>
				<br />
				<span v-if="from != 'survey'">正确答案是：
					<span style='color: #08BF78;'>{{item.answerArr ? ''+item.answerArr : ''}}</span>，你的答案是：
					<span style="color: #E64340;"> {{item.userAnswerArr ? ''+item.userAnswerArr : ''}}</span>
				</span>
        <span v-else>回答：
          <span style="color: #E64340;"> {{item.answerArr ? ''+item.answerArr : ''}}</span>
        </span>
				<br />
				<br />
				<br />
			</el-row>
		</el-row>

    <!--判断-->
		<el-row v-show='isActive == 3? true : false' v-if="from != 'survey'">
			<div>判断题：共 {{DataMsg.length}} 道题（总 {{scoreTotal}} 分 / 得 {{userScore}} 分）</div>
			<br />
			<el-row v-for='(item,key) in DataMsg' class='colo' :key='item.examAnswerId'>

				<div style="line-height: 30px;">{{key+1}}，{{item.examQuestionTitle}}（{{item.score}}分 /
					<span style="color: #08BF78;"> {{ item.userScore ? item.userScore : 0}}分</span>）</div>
				<br />
				<div v-for='(option,key) in JSON.parse(item.options)' :key="option">
					<span class='abcd' :class="{error:item.userAnswerArr == String.fromCharCode(65 + key)}">{{String.fromCharCode(65 + key)}}</span> &nbsp;{{option}}
					<br />
					<br />
				</div>
				<br />
				<span>正确答案是：
					<span style='color: #08BF78;'>{{item.answerArr ? ''+item.answerArr : ''}}</span>，你的答案是：
					<span style="color: #E64340;"> {{item.userAnswerArr ? ''+item.userAnswerArr : ''}}</span>
				</span>
				<br />
				<br />
				<br />
			</el-row>
		</el-row>

    <!--情景-->
		<el-row v-show='isActive == 4 ? true : false' v-if="from != 'survey'">
			<div>情景题：共 {{DataMsg.length}} 道题（总 {{scoreTotal}} 分 / 得 {{userScore}} 分）</div>
			<br />
			<el-row v-for='(item, index) in DataMsg' class='colo' :key='item.examAnswerId'>
				<div style="line-height: 30px;">{{index+1}}，{{item.examQuestionTitle}}</div>
				<br />
				<el-row v-for='(el, num) in item.examQuestionScenarios' class='colo' :key='el.examQuestionScenarioId'>
          <div style="line-height: 30px;">{{index+1}}.{{num+1}}，{{el.examQuestionTitle}} （{{el.type == 1 ? '单选题' : el.type == 2 ? '多选题' : el.type == 3 ? '判断题' : el.type == 5 ? '填空题' : '问答题'}}）（{{el.score}}分 /
					<span style="color: #08BF78;"> {{ el.userScore ? el.userScore : 0}}分</span>）</div>
          <br />
          <div v-for='(option, OK) in JSON.parse(el.options)' :key="option">
            <div style="width: 45px;float: left;margin-right:15px;">
              <span class='abcd' :class="{error:el.userAnswerArr?''+el.userAnswerArr.filter(el => {return el == String.fromCharCode(65 + OK)}):false}">{{String.fromCharCode(65 + OK)}}</span>
            </div>
            <div style="width: 90%;float: left;">
              <span>{{option}}</span>
            </div>
            <div style="clear: both"></div>
            <br>
          </div>
          <br />
          <span>正确答案是：
            <span style='color: #08BF78;'>{{el.answer ? ''+el.answer : ''}}</span>，你的答案是：
            <span style="color: #E64340;"> {{el.userAnswer ? ''+el.userAnswer : ''}}</span>
          </span>
          <br />
          <br />
          <br />
          <el-form label-width="110px" label-position="left">
            <el-form-item label="是否正确 : ">
              <el-radio-group v-model="el.check" @change="checkFn($event, el)">
                <el-radio :label="0">错</el-radio>
                <el-radio :label="1">对</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-row>
				<br />
				<br />
				<br />
			</el-row>
      <el-form label-width="110px" label-position="left">
        <el-form-item label=" ">
          <el-button type="text" @click.native="saveCheck">提交</el-button>
        </el-form-item>
      </el-form>
		</el-row>

		<!--填空-->
		<el-row v-show='isActive == 5 ? true : false'>
			<div>填空题：共 {{DataMsg.length}} 道题（总 {{scoreTotal}} 分 / 得 {{userScore}} 分）</div>
			<br />
			<el-row v-for='(item,key) in DataMsg' class='colo' :key='item.examAnswerId'>
				<div v-if="from != 'survey'" style="line-height: 30px;">{{key+1}}，{{item.examQuestionTitle}}（{{item.score}}分 / 
          {{ item.userScore ? item.userScore : 0}}分） <br /></div>
        <div v-else>{{key+1}}，{{item.surveyQuestionTitle}}</div>
				<span v-if="from != 'survey'">正确答案是：
					<span style='color: #08BF78;'> {{item.answerArr}}</span>
          <br /><br />
				</span>
				<span v-if="from != 'survey'">你的答案是：
					<span> {{item.userAnswerArr}}</span>
				</span>
        <span v-if="!(from != 'survey')"><br />回答：
					<span style="color: #08BF78;"> {{item.answer}}</span>
				</span>
				<br />
				<br />
        <el-form label-width="110px" label-position="left" v-if="from != 'survey'">
          <el-form-item label="是否正确 : ">
            <el-radio-group v-model="item.check" @change="checkFn($event, item)">
              <el-radio :label="0">错</el-radio>
              <el-radio :label="1">对</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
			</el-row>
      <el-form label-width="110px" label-position="left" v-if="from != 'survey'">
        <el-form-item label=" ">
          <el-button type="text" @click.native="saveCheck">提交</el-button>
        </el-form-item>
      </el-form>
		</el-row>

		<!--问答-->
		<el-row v-show='isActive == 6 ? true : false'>
			<div v-if="from != 'survey'">问答题：共 {{DataMsg.length}} 道题（总 {{scoreTotal}} 分 / 得 {{userScore}} 分）</div>
      <div v-else>问答题：共 {{DataMsg.length}} 道题</div>
			<br />
			<el-row v-for='(item,key) in DataMsg' class='colo' :key='item.examAnswerId'>
        <div v-if="from != 'survey'" style="line-height: 30px;">{{key+1}}，{{item.examQuestionTitle}}（{{item.score}}分 /
					<span style="color: #08BF78;"> {{ item.userScore ? item.userScore : 0}}分</span>）</div>
        <div v-else>{{key+1}}，{{item.surveyQuestionTitle}}</div>
				<br />
        <div v-if="from != 'survey'">
          <div class="fl" style="width: 90px;line-height: 30px;">正确答案是：</div>
          <div class="fl" style="width: 85%; word-wrap : break-word; overflow:hidden; line-height: 30px;color: #08BF78;">{{item.answerArr}}<br /><br /></div>
          <div style="clear: both;"></div>
          <div class="fl" style="width: 90px;line-height: 30px;">你的答案是：</div>
          <div class="fl" style="width: 85%; word-wrap : break-word; overflow:hidden; line-height: 30px;">{{item.userAnswerArr}}</div>
        </div>
        <div v-else>
          <div class="fl" style="line-height: 30px;">回答：</div>
          <div class="fl" style="width: 85%; word-wrap : break-word; overflow:hidden; line-height: 30px;color: #08BF78;">{{item.answer}}</div>
        </div>
        <br />
				<br />
				<br />
        <el-form label-width="110px" label-position="left" v-if="from != 'survey'">
          <el-form-item label="是否正确 : ">
            <el-radio-group v-model="item.check" @change="checkFn($event, item)">
              <el-radio :label="0">错</el-radio>
              <el-radio :label="1">对</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
			</el-row>
      <el-form label-width="110px" label-position="left" v-if="from != 'survey'">
        <el-form-item label=" ">
          <el-button type="text" @click.native="saveCheck">提交</el-button>
        </el-form-item>
      </el-form>
		</el-row>
    
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Exam from "@api/exam";
//https://github.com/ktsn/vuex-class
@Component({
})
export default class Companyreg extends Vue {
  @Prop({ default: {} })
  public queryData: object;
  @Prop({ default: "" })
  public from: string;

  params: any = {
    examId: "",
    examRecordId: "",
    isMark: "", // 是否合格
    userId: "",
    number: ""
  };
  isActive: number = 1;
  DataMsg: any[] = [];
  userScore: number = 0;
  scoreTotal: number = 0;
  setScore: any[] = [];
  examAnswerIds: any[] = [];
  userAnswer: any[] = [];
  answer: any[] = [];
  errorAnswer: any = null;
  succeed: boolean = false;
  test: any[] = [];
  flag: boolean = false;
  res: string = '';
  submitScore: any[] = [];

  created() {
    this.getList();
  }

  getList(type: any) {
    this.res = this.queryData;
    this.activeFun(1);
  }
  activeFun(is: any) {
    this.userScore = 0;
    this.isActive = is;
    if (is == 1) {
      this.setAnswer(this.res.RADIO, is)
    } else if (is == 2) {
      this.setAnswer(this.res.MULTISELECT, is)
    } else if (is == 3) {
      this.setAnswer(this.res.JUDGE, is)
    } else if (is == 4) {
      this.setAnswer(this.res.SC, is)
    } else if (is == 5) {
      this.setAnswer(this.res.FILL, is)
    } else if (is == 6) {
      this.setAnswer(this.res.QA, is)
    }
  }
  setAnswer(res: object, is: any) {
    if (is == 6 || is == 5) {
      this.setScore = []
    };
    this.DataMsg = res;
    this.scoreTotal = 0;
    this.userScore = 0;
    for (let i = 0; i < res.length; i++) {
      this.userScore += parseInt(this.DataMsg[i].userScore ? this.DataMsg[i].userScore : 0);
      this.scoreTotal += this.DataMsg[i].score;
      if (res[i].options && res[i].options != '[]') {
        if (typeof res[i].options === 'string') {
          var Options = JSON.parse(res[i].options)
        } else {
          var Options = res[i].options
        }
      } else {
        var Options = []
      }
      if (res[i].userAnswer && res[i].userAnswer != '[]') {
        if (typeof res[i].userAnswer === 'string') {
          var Answers = JSON.parse(res[i].userAnswer)
        } else {
          var Answers = res[i].userAnswer
        }
      } else {
        var Answers = []
      }
      if (res[i].answer && res[i].answer != '[]') {
        if (typeof res[i].answer === 'string') {
          var SuccessAnswers = JSON.parse(res[i].answer)
        } else {
          var SuccessAnswers = res[i].answer
        }
      } else {
        var SuccessAnswers = []
      }
      if(res[i].options && res[i].options != '[]'){
        this.DataMsg[i].userAnswerArr = []
        this.DataMsg[i].answerArr = []
        for (let j = 0; j < Options.length; j++) {
          if (is == 1 || is == 2 || is == 3) {
            for (let A = 0; A < Answers.length; A++) {
              if (Answers[A] == Options[j]) {
                this.DataMsg[i].userAnswerArr.push(String.fromCharCode(65 + j));
              }
            }
            for (let S = 0; S < SuccessAnswers.length; S++) {
              if (SuccessAnswers[S] == Options[j]) {
                this.DataMsg[i].answerArr.push(String.fromCharCode(65 + j));
              }
            }
          }
        }
      } else {
        if ( this.DataMsg[i].answer ) {
          this.DataMsg[i].answerArr = JSON.parse(this.DataMsg[i].answer)
        }
        if ( this.DataMsg[i].userAnswer ) {
          this.DataMsg[i].userAnswerArr = JSON.parse(this.DataMsg[i].userAnswer)
        }
      }
      
    }
  }
  checkFn(e: any, item: any) {
    if (this.submitScore.length > 0) {
      this.submitScore.forEach((el, index) => {
        if (el.examQuestionScenarioId) {
          if(el.examQuestionScenarioId === item.examQuestionScenarioId){
            this.submitScore.splice(index, 1);
          }
        } else {
          if (el.examQuestionId === item.examQuestionId) {
            this.submitScore.splice(index, 1);
          }
        }
      })
      this.submitScore.push({examQuestionId: item.examQuestionId, examQuestionScenarioId: item.examQuestionScenarioId, answer: e == 0 ? false : true})
      console.log(this.submitScore);
    } else {
      this.submitScore.push({examQuestionId: item.examQuestionId, examQuestionScenarioId: item.examQuestionScenarioId, answer: e == 0 ? false : true})
    }
  }
  saveCheck() {
    let data = {
      userId: this.queryData.userId,
      examRecordId: this.queryData.examRecordId,
      submitScore: JSON.stringify(this.submitScore)
    }
    this.loading = true;
    Exam.teacher_submit_papers_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: `操作成功!`,
            type: "success"
          });
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
<style lang="scss" scope>
.abcd {
  font-size: 13px;
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 50%;
  border: 1px solid #bbb;
  color: #aaa;
  margin-left: 25px;
}

.succeedColor {
  color: #08bf78;
}

.errorColor {
  color: #e64340;
}

.succeed {
  background: #ebfff3 !important;
  border: 1px solid #08bf78 !important;
  color: #08bf78 !important;
}

// .error {
//   background: #ffdcdb;
//   border: 1px solid #e64340;
//   color: #e64340;
// }

.colo {
  color: #666;
  font-size: 14px;
}

.active {
  color: white !important;
  background: #5b6a8b;
}

.init {
  min-height: 36px;
  line-height: 36px;
  color: #666;
  text-align: center;
  border-left: 1px solid #ccc;
  cursor: pointer;
}

.row-bg {
  padding: 10px 0;
  background-color: #f4fbff;
}
</style>