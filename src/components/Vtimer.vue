<template>
  <div>
    <el-date-picker value-format='yyyy-MM-dd' class="mr10 w150" v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions" @change="getYMD">
    </el-date-picker>
    <el-select v-model="value2" placeholder="小时" v-if="hArr.length>0" class="w75" @change="getHour">
      <el-option v-for="item in hArr" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <span class="mr10 ib">&nbsp;点</span>
    <el-select v-model="value3" placeholder="分钟" v-if="mArr.length>0" class="w75" @change="getMin">
      <el-option v-for="item in mArr" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <span class="mr10 ib">&nbsp;分</span>
  </div>
</template>

<script lang="ts">
/*
 module:
    main.ts
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-7-30:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from "vue-property-decorator";
//https://github.com/ktsn/vuex-class
@Component({})
export default class Vtimer extends Vue {
  pickerOptions = {
    disabledDate(time: any) {
      return time.getTime() < Date.now() - 8.64e7;
    }
  };
  value1 = "";
  value2 = "";
  value3 = "";
  hArr: any[] = [];
  mArr: any[] = [];
  created() {
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        this.hArr.push({
          value: `0${i}`,
          label: `0${i}`
        });
      } else {
        this.hArr.push({
          value: `${i}`,
          label: `${i}`
        });
      }
    }
    for (let i = 0; i < 12; i++) {
      if (i < 2) {
        this.mArr.push({
          value: `0${i * 5}`,
          label: `0${i * 5}`
        });
      } else {
        this.mArr.push({
          value: `${i * 5}`,
          label: `${i * 5}`
        });
      }
    }
  }
  getYMD(e: string) {
    this.$emit("getYMD", e);
  }
  getHour(e: string) {
    this.$emit("getHour", e);
  }
  getMin(e: string) {
    this.$emit("getMin", e);
  }
}
</script>
<style lang="scss" scoped>
.w75 {
  width: 75px;
}
.w150 {
  width: 150px;
}
.ib {
  display: inline-block;
}
</style>
