<template>
  <div>
    <el-date-picker v-model="value1" type="date" placeholder="选择日期" :picker-options="pickerOptions" @change="getYMD">
    </el-date-picker>
    <el-select v-model="value2" placeholder="小时" v-if="hArr.length>0" class="w100" @change="getHour">
      <el-option v-for="item in hArr" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <span>点</span>
    <el-select v-model="value3" placeholder="分钟" v-if="mArr.length>0" class="w100" @change="getMin">
      <el-option v-for="item in mArr" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <span>分</span>
  </div>
</template>
<script>
export default {
    props: {
        defaultTime: {
            type: Object,
            default: function() {
                return {
                    ymd: "",
                    h: "",
                    m: "",
                    s: "00"
                };
            }
        }
    },
    data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            value1: this.defaultTime.ymd,
            value2: this.defaultTime.h,
            value3: this.defaultTime.m,
            hArr: [],
            mArr: []
        };
    },
    methods: {
        getYMD(e) {
            this.$emit("getYMD", e);
        },
        getHour(e) {
            this.$emit("getHour", e);
        },
        getMin(e) {
            this.$emit("getMin", e);
        }
    },
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
};
</script>
<style lang="scss" scoped>
.w100 {
    width: 100px;
}
</style>


