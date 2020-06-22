<template>
  <div>
    <el-select v-model="addressObj.province" class="mr10 province" placeholder="请选择省份" @change="selectProvince" style="width: 25%">
      <el-option v-for="(item) in allProvince" :key="item.name" :label="item.name" :value="item.name">
      </el-option>
    </el-select>
    <el-select v-model="addressObj.city" class="mr10 city" placeholder="请选择城市" @change="selectCity" style="width: 25%">
      <el-option v-for="item in activeCity" :key="item.name" :label="item.name" :value="item.name"></el-option>
    </el-select>
    <el-select v-model="addressObj.district" placeholder="请选择区县" style="width: 25%">
      <el-option v-for="item in activeDistrict" :key="item.name" :label="item.name" :value="item.name"></el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
/*
 module:
    sl adress.ts
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-16:adress
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from "vue-property-decorator";
import area from "@utils/area";
//https://github.com/ktsn/vuex-class
@Component({})
export default class VselectAddress extends Vue {
  get province() {
    return area.province_list || {};
  }
  get city() {
    return area.city_list || {};
  }
  get county() {
    return area.county_list || {};
  }
  addressObj = {
    province: "",
    district: "",
    city: ""
  };
  provinceCode: string = "0";
  cityCode: string = "0";
  allProvince: any[] = [];
  activeCity: any[] = [];
  activeDistrict: any[] = [];
  created() {
    this.allProvince = this.getAreaList("province");
    this.setAddress("四川省", "成都市", "金牛区");
  }
  selectProvince(e: any, city?: string, district?: string) {
    this.provinceCode = this.getCode(this.allProvince, e);
    this.activeCity = this.getAreaList("city", this.provinceCode.slice(0, 2));
    this.addressObj.province = e;
    this.addressObj.city = city || this.activeCity[0].name;
    this.selectCity(this.addressObj.city, district);
  }
  selectCity(e: string, district?: string) {
    this.cityCode = this.getCode(this.activeCity, e);
    this.activeDistrict = this.getAreaList("county", this.cityCode.slice(0, 4));
    this.addressObj.district = district || this.activeDistrict[0].name;
  }
  getCode(list: any, name: string): any {
    let code: string = "";
    list.forEach((i: any) => {
      if (i.name === name) {
        code = i.code;
      }
    });
    return code;
  }
  // get list by code
  getAreaList(type: string, code?: string): any[] {
    let result: any[] = [];
    if (type !== "province" && !code) {
      return result;
    }
    //@ts-ignore
    const list = this[type];
    result = Object.keys(list).map(code => ({
      code,
      name: list[code]
    }));
    if (code) {
      result = result.filter(item => item.code.indexOf(code) === 0);
    }
    return result;
  }
  setAddress(province: string, city: string, district: string) {
    this.selectProvince(province, city, district);
  }
  getAddress(): string[] {
    let { province, city, district } = this.addressObj;
    return [province, city, district];
  }
}
</script>
<style lang="scss" scoped>
.mr10 {
  margin-right: 10px;
}
</style>
