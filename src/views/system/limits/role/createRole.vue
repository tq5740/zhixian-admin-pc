<template>
  <div>
    <el-row :inline="true">
      <el-form label-width="80px">
        <el-form-item label="角色名称 : ">
          <el-input v-model="roleName" class='w320'></el-input>
        </el-form-item>

        <el-form-item label="类型 : ">
          <el-select v-model="type" placeholder="请选类型" @change="selectType">
            <el-option label="系统管理" value="0"></el-option>
            <el-option label="管理" value="1"></el-option>
            <el-option label="普通" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限范围 : ">
          <el-select v-model="checkScope" placeholder="请选择权限范围" @change="selectCheckScope">
            <el-option label="仅自己" value="1"></el-option>
            <el-option label="本企业" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限设置 : ">
          <el-tree :default-checked-keys="landing" class='w90per' show-checkbox ref="tree" :data="treeData" :props="defaultProps" node-key="value" :expand-on-click-node="false" empty-text=" "></el-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="isPending" @click.native='saveBtn'>保存</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script lang="ts">
/*
 module:
    allroute
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-8-8:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue, Prop } from "vue-property-decorator";
import RoleApi, { RoleInfoTypes } from "@api/role";
import { State } from "vuex-class";
import { getIsCheckArr } from "@utils/index";

@Component({})
export default class CreateRole extends Vue {
  @Prop({ default: false })
  isCreate!: boolean;
  @Prop({ default: [] })
  activeData!: any;
  treeData: any[] = [];
  defaultProps: object = {
    children: "children",
    label: "label",
    value: "value"
  };
  roleName: string = "";
  type: string = "1";
  checkScope: string = "1";
  listMenu: string[] = [];
  isPending: boolean = false;
  landing: string[] = [];
  @State("permissionList")
  permissionList!: object[];
  created() {
    if (this.isCreate) {
      this.treeData = this.$forTree(
        this.permissionList,
        "methodId",
        "methodName"
      );
    } else {
      this.treeData = this.$forTree(
        this.activeData.methodList,
        "methodId",
        "methodName"
      );
      this.checkScope = this.activeData.checkScope + "";
      this.type = this.activeData.type + "";
      this.roleName = this.activeData.roleName;
      let checkArr: any[] = [];
      this.activeData.methodList.forEach((element: any) => {
        if (element.isCheck) {
          checkArr.push(element);
        }
      });
      let needArr: string[] = getIsCheckArr(checkArr);
      this.$nextTick(() => {
        //@ts-ignore
        this.$refs.tree.setCheckedKeys(needArr);
      });
    }
    // this.treeData[0].disabled = true;
    // this.setDisabled(this.treeData[0].children);
    if (this.isCreate) {
      this.landing = this.getInitMethod(this.treeData[0], false);
    }
  }
  selectType(e: string) {
    this.type = e;
  }
  selectCheckScope(e: string) {
    this.checkScope = e;
  }
  saveBtn() {
    if (!this.roleName || this.roleName.includes(" ")) {
      this.$notify({
        title: "错误",
        message: `角色姓名填写不合法!`,
        type: "error"
      });
    } else {
      // this.isPending = true;
      let listMenu = this.getChecked();
      let data: RoleInfoTypes["data"] = {
        roleName: this.roleName,
        type: this.type,
        checkScope: this.checkScope,
        listMenu: ``
      };
      if (this.isCreate) {
        let _arr = [];
        let _list = [...listMenu, ...[{ methodId: this.treeData[0].value }]];
        for (let i = 0; i < _list.length; i++) {
          _arr.push(_list[i].methodId);
        }
        let _set = new Set(_arr);
        let _listArr_ = [..._set];
        let _listMenu_ = [];
        for (let i = 0; i < _listArr_.length; i++) {
          _listMenu_.push({ methodId: _listArr_[i] });
        }

        data.listMenu = JSON.stringify(_listMenu_);
        RoleApi.createRole({ data })
          .then((res: any) => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: "创建成功" || res.msg,
                type: "success"
              });
              this.$emit("createOver");
            }
          })
          .finally(() => {
            this.isPending = false;
          });
      } else {
        let _arr = [];
        for (let i = 0; i < listMenu.length; i++) {
          _arr.push(listMenu[i].methodId);
        }
        let _set = new Set(_arr);
        let _listArr_ = [..._set];
        let _listMenu_ = [];
        for (let i = 0; i < _listArr_.length; i++) {
          _listMenu_.push({ methodId: _listArr_[i] });
        }

        data.listMenu = JSON.stringify(_listMenu_);
        data.roleId = this.activeData.roleId;
        RoleApi.updateRole({ data })
          .then((res: any) => {
            if (res.code === 0) {
              this.$notify({
                title: "提示",
                message: "编辑成功" || res.msg,
                type: "success"
              });
              this.$emit("createOver");
            }
          })
          .finally(() => {
            this.isPending = false;
          });
      }
    }
  }
  getChecked(): object[] {
    //必须是手动选中
    let listMenu: object[] = [];
    //@ts-ignore
    let checkNodes: object[] = this.$refs.tree.getCheckedNodes();
    checkNodes.forEach((i: any) => {
      listMenu.push({ methodId: i.value });
    });
    //处理半选状态
    let _arr = [].map
      .call(
        //@ts-ignore
        this.$refs.tree.$el.querySelectorAll(".el-tree-node"),
        (node: any) => node.__vue__
      )
      .filter((item: any) => item.indeterminate === true);
    let indeterminateArr = this.getIndeterminate(_arr);
    return [...listMenu, ...indeterminateArr];
  }
  getIndeterminate(arr: any[], returnArr: any[] = []) {
    arr.forEach((i: any) => {
      if (i.indeterminate === true) {
        let methodId = i.node ? i.node.data.value : i.data.value;
        returnArr.push({ methodId });
        let childNodes = i.node ? i.node.childNodes : i.childNodes;
        if (childNodes && childNodes.length > 0) {
          this.getIndeterminate(childNodes, returnArr);
        }
      }
    });
    return returnArr;
  }
  setLimits() {}
  setDisabled(arr: any[], firstArr: any[] = []) {
    arr[0].disabled = true;
    arr[0].children.forEach((i: any) => {
      i.disabled = true;
      if (i.children && i.children.length > 0) {
        i.children.forEach((ii: any) => {
          ii.disabled = true;
        });
      }
    });
  }
  getInitMethod(
    obj: any,
    isNeedAll: boolean = true,
    arr: string[] = []
  ): string[] {
    if (obj.parentId === `0` && isNeedAll) {
      arr.push(obj.value);
    }
    if (obj.children && obj.children.length > 0) {
      obj.children.forEach((i: any) => {
        if (i.disabled) {
          arr.push(i.value);
          this.getInitMethod(i, isNeedAll, arr);
        }
      });
    }
    return arr;
  }
}
</script>
<style lang="scss" scoped>
</style>
