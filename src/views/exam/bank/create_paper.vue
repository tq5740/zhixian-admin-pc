<template>
  <div>
    <el-form label-width="80px" label-position="left">
      <el-form-item label="组卷题数 : ">
        <p>{{num.questionNumber}}</p>
      </el-form-item>
      <el-form-item label="试卷套数 : ">
        <el-input placeholder="请输入试卷套数" type="number" :min="1" style="width: 200px" v-model="paperNumber"></el-input>
      </el-form-item>
      <el-form-item label="组卷策略 : ">
        <div class="cho">
          <ul>
            <li>题型</li>
            <li>困难</li>
            <li>中等</li>
            <li>简单</li>
            <li>每题分数</li>
          </ul>
          <ul>
            <li>单选题</li>
            <li>
              <el-select v-model="testNum.radio1Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in radio1RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li>
              <el-select v-model="testNum.radio2Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in radio2RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li>
              <el-select v-model="testNum.radio3Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in radio3RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li><el-input type="number" :min="0" v-model="radioScore" @change="getScore"></el-input></li>
          </ul>
          <ul>
            <li>多选题</li>
            <li>
              <el-select v-model="testNum.multi1Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in multi1RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li>
              <el-select v-model="testNum.multi2Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in multi2RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li>
              <el-select v-model="testNum.multi3Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in multi3RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li><el-input type="number" :min="0" v-model="multiScore" @change="getScore"></el-input></li>
          </ul>
          <ul>
            <li>判断题</li>
            <li>
              <el-select v-model="testNum.judge1Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in judge1RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li>
              <el-select v-model="testNum.judge2Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in judge2RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li>
              <el-select v-model="testNum.judge3Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in judge3RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li><el-input type="number" :min="0" v-model="judgeScore" @change="getScore"></el-input></li>
          </ul>
          <ul>
            <li>填空题</li>
            <li>
              <el-select v-model="testNum.fill1Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in fill1RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li>
              <el-select v-model="testNum.fill2Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in fill2RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li>
              <el-select v-model="testNum.fill3Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in fill3RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li><el-input type="number" :min="0" v-model="fillScore" @change="getScore"></el-input></li>
          </ul>
          <ul>
            <li>问答题</li>
            <li>
              <el-select v-model="testNum.qa1Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in qa1RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li>
              <el-select v-model="testNum.qa2Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in qa2RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li>
              <el-select v-model="testNum.qa3Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in qa3RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li><el-input type="number" :min="0" v-model="qaScore" @change="getScore"></el-input></li>
          </ul>
          <ul>
            <li>情景题</li>
            <li>
              <el-select v-model="testNum.sc1Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in sc1RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li>
              <el-select v-model="testNum.sc2Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in sc2RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li>
              <el-select v-model="testNum.sc3Ratio" filterable placeholder="请选择" @change="getScore">
                <el-option v-for="item in sc3RatioNum" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </li>
            <li><el-input type="number" :min="0" v-model="scScore" @change="getScore"></el-input></li>
          </ul>
        </div>
      </el-form-item>
      <el-form-item label="合格比率 : ">
        <el-select style="width: 100px; margin-right:10px;" v-model="passScore" filterable placeholder="请选择" @change="getScore">
          <el-option v-for="item in allNumber" :key="item" :label="item" :value="item"></el-option>
        </el-select>%
      </el-form-item>
      <el-form-item label="合格分数 : ">
        <p>{{scorePass}}</p>
      </el-form-item>
      <el-form-item label="总分数 : ">
        <p>{{scoreTotal}}</p>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" @click="savaPaperBtn">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { debounce } from "typescript-debounce-decorator";
import Bank from "@api/exam";
import Category from "@api/category";
import { checkNum } from "@utils/index";
@Component({
  components: {
  }
})
export default class Companyreg extends Vue {
  @Prop({ default: "" })
  public id: string;

  fillScore: number = 1;
  judgeScore: number = 1;
  multiScore: number = 1;
  qaScore: number = 1;
  radioScore: number = 1;
  scScore: number = 1;
  passScore: number = 60;
  paperNumber: number = 1;
  testNum: any = {
    paperNumber: 1,
    passScore: 60,
    fill1Ratio: 0,
    fill2Ratio: 0,
    fill3Ratio: 0,
    fillScore: 1,
    judge1Ratio: 0,
    judge2Ratio: 0,
    judge3Ratio: 0,
    judgeScore: 1,
    multi1Ratio: 0,
    multi2Ratio: 0,
    multi3Ratio: 0,
    multiScore: 1,
    qa1Ratio: 0,
    qa2Ratio: 0,
    qa3Ratio: 0,
    qaScore: 1,
    radio1Ratio: 0,
    radio2Ratio: 0,
    radio3Ratio: 0,
    radioScore: 1,
    sc1Ratio: 0,
    sc2Ratio: 0,
    sc3Ratio: 0,
    scScore: 1
  };
  fill1RatioNum: any[] = [];
  fill2RatioNum: any[] = [];
  fill3RatioNum: any[] = [];
  judge1RatioNum: any[] = [];
  judge2RatioNum: any[] = [];
  judge3RatioNum: any[] = [];
  multi1RatioNum: any[] = [];
  multi2RatioNum: any[] = [];
  multi3RatioNum: any[] = [];
  qa1RatioNum: any[] = [];
  qa2RatioNum: any[] = [];
  qa3RatioNum: any[] = [];
  radio1RatioNum: any[] = [];
  radio2RatioNum: any[] = [];
  radio3RatioNum: any[] = [];
  sc1RatioNum: any[] = [];
  sc2RatioNum: any[] = [];
  sc3RatioNum: any[] = [];

  allNumber: any[] = [];
  num: any = {};
  scoreTotal: number = 0;
  scorePass: number = 0;

  created() {
    this.init();
    for(let e = 2; e < 21; e ++){
      this.allNumber.push(e * 5);
    }
  }
  
  getScore() {
    let radio = (this.testNum.radio1Ratio + this.testNum.radio2Ratio + this.testNum.radio3Ratio) * this.radioScore;
    let multi = (this.testNum.multi1Ratio + this.testNum.multi2Ratio + this.testNum.multi3Ratio) * this.multiScore;
    let judge = (this.testNum.judge1Ratio + this.testNum.judge2Ratio + this.testNum.judge3Ratio) * this.judgeScore;
    let fill = (this.testNum.fill1Ratio + this.testNum.fill2Ratio + this.testNum.fill3Ratio) * this.fillScore;
    let qa = (this.testNum.qa1Ratio + this.testNum.qa2Ratio + this.testNum.qa3Ratio) * this.qaScore;
    let sc = (this.testNum.sc1Ratio + this.testNum.sc2Ratio + this.testNum.sc3Ratio) * this.scScore;
    this.scoreTotal = (radio + multi + judge + fill + qa + sc) || 0;
    this.scorePass = (this.scoreTotal * this.passScore / 100) || 0;
  }
  init() {
    let data = {
      examBankId: this.id
    }
    
    Bank.query_papers_number_admin({ data })
      .then(res => {
        if (res.code === 0) {
          if(res.data){
            this.testNum = this.num = res.data;
            Bank.query_exam_tactics_admin({ data })
              .then(res => {
                if (res.code === 0) {
                  if(res.data){
                    for(let i in this.testNum) {
                      if(res.data[i] < this.testNum[i]) {
                        this.testNum[i] = res.data[i]
                      }
                    }
                    this.passScore = this.testNum.passScore = res.data.passScore * 100;
                    this.paperNumber = res.data.paperNumber;
                    this.getScore();
                  }
                }
              })
            this.changeNum();
            this.getScore();
          }
        }
      })
  }
  changeNum() {
    let arr = [];
    for(let i = 0; i <= this.num.radio1Ratio; i++){ arr.push(i) }
    this.radio1RatioNum = arr;
    let arr1 = [];
    for(let i = 0; i <= this.num.radio2Ratio; i++){ arr1.push(i) }
    this.radio2RatioNum = arr1;
    let arr2 = [];
    for(let i = 0; i <= this.num.radio3Ratio; i++){ arr2.push(i) }
    this.radio3RatioNum = arr2;
    let arr3 = [];
    for(let i = 0; i <= this.num.multi1Ratio; i++){ arr3.push(i) }
    this.multi1RatioNum = arr3;
    let arr4 = [];
    for(let i = 0; i <= this.num.multi2Ratio; i++){ arr4.push(i) }
    this.multi2RatioNum = arr4;
    let arr5 = [];
    for(let i = 0; i <= this.num.multi3Ratio; i++){ arr5.push(i) }
    this.multi3RatioNum = arr5;
    let arr6 = [];
    for(let i = 0; i <= this.num.judge1Ratio; i++){ arr6.push(i) }
    this.judge1RatioNum = arr6;
    let arr7 = [];
    for(let i = 0; i <= this.num.judge2Ratio; i++){ arr7.push(i) }
    this.judge2RatioNum = arr7;
    let arr8 = [];
    for(let i = 0; i <= this.num.judge3Ratio; i++){ arr8.push(i) }
    this.judge3RatioNum = arr8;
    let arr9 = [];
    for(let i = 0; i <= this.num.fill1Ratio; i++){ arr9.push(i) }
    this.fill1RatioNum = arr9;
    let arr10 = [];
    for(let i = 0; i <= this.num.fill2Ratio; i++){ arr10.push(i) }
    this.fill2RatioNum = arr10;
    let arr11 = [];
    for(let i = 0; i <= this.num.fill3Ratio; i++){ arr11.push(i) }
    this.fill3RatioNum = arr11;
    let arr12 = [];
    for(let i = 0; i <= this.num.qa1Ratio; i++){ arr12.push(i) }
    this.qa1RatioNum = arr12;
    let arr13 = [];
    for(let i = 0; i <= this.num.qa2Ratio; i++){ arr13.push(i) }
    this.qa2RatioNum = arr13;
    let arr14 = [];
    for(let i = 0; i <= this.num.qa3Ratio; i++){ arr14.push(i) }
    this.qa3RatioNum = arr14;
    let arr15 = [];
    for(let i = 0; i <= this.num.sc1Ratio; i++){ arr15.push(i) }
    this.sc1RatioNum = arr15;
    let arr16 = [];
    for(let i = 0; i <= this.num.sc2Ratio; i++){ arr16.push(i) }
    this.sc2RatioNum = arr16;
    let arr17 = [];
    for(let i = 0; i <= this.num.sc3Ratio; i++){ arr17.push(i) }
    this.sc3RatioNum = arr17;
  }
  savaPaperBtn() {
    let obj = this.num;
    delete obj.examBankId;
    delete obj.questionNumber;
    for(let item in obj){
      if(this.testNum[item] > obj[item]){
        this.$notify({
          title: "提示",
          message: "组卷策略题数设置超过了组卷试题数量，请检查组卷策略是否正确",
          type: "error"
        });
        return;
      }
    }
    if (!this.paperNumber || !checkNum(this.paperNumber)) {
      this.$notify({
        title: "提示",
        message: "请输入试卷套数，只能是大于0的数字",
        type: "error"
      });
      return;
    }
    if ((this.testNum.radio1Ratio || this.testNum.radio2Ratio || this.testNum.radio3Ratio) && !this.radioScore) {
      this.$notify({
        title: "提示",
        message: "单选题每题分数不能为0",
        type: "error"
      });
      return;
    }
    if ((this.testNum.multi1Ratio || this.testNum.multi2Ratio || this.testNum.multi3Ratio) && !this.multiScore) {
      this.$notify({
        title: "提示",
        message: "多选题每题分数不能为0",
        type: "error"
      });
      return;
    }
    if ((this.testNum.judge1Ratio || this.testNum.judge2Ratio || this.testNum.judge3Ratio) && !this.judgeScore) {
      this.$notify({
        title: "提示",
        message: "判断题每题分数不能为0",
        type: "error"
      });
      return;
    }
    if ((this.testNum.fill1Ratio || this.testNum.fill2Ratio || this.testNum.fill3Ratio) && !this.fillScore) {
      this.$notify({
        title: "提示",
        message: "填空题每题分数不能为0",
        type: "error"
      });
      return;
    }
    if ((this.testNum.qa1Ratio || this.testNum.qa2Ratio || this.testNum.qa3Ratio) && !this.qaScore) {
      this.$notify({
        title: "提示",
        message: "问答题每题分数不能为0",
        type: "error"
      });
      return;
    }
    if ((this.testNum.sc1Ratio || this.testNum.sc2Ratio || this.testNum.sc3Ratio) && !this.scScore) {
      this.$notify({
        title: "提示",
        message: "情景题每题分数不能为0",
        type: "error"
      });
      return;
    }
    if (this.radioScore.toString().includes(".")||
    this.multiScore.toString().includes(".")||
    this.judgeScore.toString().includes(".")||
    this.fillScore.toString().includes(".")||
    this.qaScore.toString().includes(".")||
    this.scScore.toString().includes(".")) {
      this.$notify({
        title: "提示",
        message: "分数不能为小数！",
        type: "error"
      });
      return;
    }
    delete this.testNum.createUser;
    delete this.testNum.createTime;
    delete this.testNum.updateUser;
    delete this.testNum.updateTime;
    this.testNum.radioScore = this.radioScore;
    this.testNum.multiScore = this.multiScore;
    this.testNum.judgeScore = this.judgeScore;
    this.testNum.fillScore  = this.fillScore;
    this.testNum.qaScore = this.qaScore;
    this.testNum.scScore = this.scScore;
    this.testNum.passScore = this.passScore / 100;
    this.testNum.paperNumber = this.paperNumber;
    let data = {
      ...this.testNum
    }
    data.examBankId = this.id;
    Bank.create_exam_tactics_admin({ data })
      .then(res => {
        if (res.code === 0) {
          this.$notify({
            title: "提示",
            message: "操作成功！",
            type: "success"
          });
          this.$emit('closeSelf')
        }
      })
  }
  closePapers() {
    this.testNum = {
      fill1Ratio: 0,
      fill2Ratio: 0,
      fill3Ratio: 0,
      fillScore: 0,
      judge1Ratio: 0,
      judge2Ratio: 0,
      judge3Ratio: 0,
      judgeScore: 0,
      multi1Ratio: 0,
      multi2Ratio: 0,
      multi3Ratio: 0,
      multiScore: 0,
      qa1Ratio: 0,
      qa2Ratio: 0,
      qa3Ratio: 0,
      qaScore: 0,
      radio1Ratio: 0,
      radio2Ratio: 0,
      radio3Ratio: 0,
      radioScore: 0,
      sc1Ratio: 0,
      sc2Ratio: 0,
      sc3Ratio: 0,
      scScore: 0
    };
    this.scoreTotal = 0;
    this.scorePass = 0;
  }
}
</script>
<style lang="scss" scope>
.cho ul{
  width: 100%;
  overflow: hidden;
  &:first-child{
    font-weight: bold;
  }
  li{
    width: 100px;
    float: left;
    text-align: center;
    margin: 0 5px;
    input{
      text-align: center;
    }
  }
}
.el-progress{
  width: 320px;
  margin-left: 0px;
}
</style>

