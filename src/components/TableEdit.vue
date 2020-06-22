<template>
  <div class="tableEdit">
    <span v-if="power.methodName === '试卷列表' ? false : true">
      <el-button v-if="(power.methodName === '试卷列表' || power.methodName === '社区主题') && power.isQuery" type="text" size="small" @click='look(scope.row)'>查看</el-button>
    </span>
    <span v-if="power.methodName === '试卷列表' ? false : true">
      <el-button v-if="(power.isUpdate && (scope.row.state != 4 && power.methodName !== '用户列表')) || (power.isUpdate&&power.methodName === '用户列表') || (power.isUpdate&&power.methodName === '认证用户') " type="text" size="small" @click='edit(scope.row)'>编辑</el-button>
    </span>
    <span v-if="power.methodName === '试卷列表' ">
      <el-button v-if="power.isUpdate && scope.row.examType != 2" type="text" size="small" @click='edit(scope.row)'>编辑</el-button>
    </span>
    <span v-if="power.isRecommend">
      <el-button type="text" size="small" @click='recommend(scope.row)'>{{scope.row.isRecommend == '1' ? '取消推荐' : '推荐'}}</el-button>
    </span>
    <span v-if="power.methodName === '试卷列表' ? false : true">
      <el-button v-if="power.isAudit && ((scope.row.state == 1 || (scope.row.state == 4 && (power.methodName === '试卷列表' || power.methodName === '广告列表'))) ? false : true)" type="text" size="small" @click='examine(scope.row)'>审核</el-button>
    </span>
    <span v-if="power.methodName === '试卷列表' ">
      <el-button v-if="power.isAudit && scope.row.state == 3" type="text" size="small" @click='examine(scope.row)'>审核</el-button>
    </span>
    <span v-if="power.methodName === '试卷列表' ? false : true">
      <el-button v-if="power.isOnline && (((scope.row.state == 5 || scope.row.state == 4 ||  scope.row.state == 1) && power.methodName != '试卷列表') || (power.methodName == '试卷列表' && (scope.row.examType === 2  || (scope.row.state === 3 || scope.row.state === 2)? false : true)))" type="text" size="small" @click='online(scope.row)'>{{scope.row.state == 4 ? '关闭' : '发布'}}</el-button>
    </span>
    <span v-if="power.methodName === '试卷列表' ">
      <el-button v-if="power.isOnline && scope.row.state != 3" type="text" size="small" @click='online(scope.row)'>{{(scope.row.state == 4 || scope.row.state == 6) ? '关闭' : '发布'}}</el-button>
    </span>
    <!-- <el-button v-if="power.isOnline && (scope.row.state !== 3 && scope.row.state !== 2)" type="text" size="small" @click='online(scope.row)'>{{scope.row.state == 4 ? '下线' : '上线'}}</el-button> -->
    <span v-if="power.methodName === '活动列表'">
      <el-button type="text" size="small" @click='joinGame(scope.row)'>参赛者</el-button>
    </span>
    <span v-if="power.isStatistics">
      <el-button type="text" size="small" @click='count(scope.row)'>统计</el-button>
    </span>
    <span v-if="anchorStatisticsState">
      <el-button type="text" size="small" @click='anchorCount(scope.row)'>统计</el-button>
    </span>
    <span v-if="timeTableState">
      <el-button type="text" size="small" @click='navToTimeTable(scope.row)'>课表</el-button>
    </span>
    <span v-if="power.isReset">
      <el-button type="text" size="small" @click='reset(scope.row)'>重置密码</el-button>
    </span>
    <span v-if="anchorState===0">
      <el-button type="text" size="small" @click='banAnchor(scope.row)'>禁播</el-button>
    </span>
    <span v-if="anchorState===1">
      <el-button type="text" size="small" @click='recoveryAnchor(scope.row)'>开放</el-button>
    </span>
    <span v-if="power.isDelete">
      <el-button type="text" size="small" @click="deleteItem(scope.row)">删除</el-button>
    </span>
    <span v-if="power.isQuerySite">
      <el-button type="text" size="small" @click='site(scope.row)'>站点</el-button>
    </span>
    <span v-if="power.methodName == '社区主题'">
      <el-button type="text" size="small" @click='setTop(scope.row)'>{{scope.row.isTop ? '取消置顶' : '置顶'}}</el-button>
    </span>
    <span v-if="power.methodName == '题库列表' && power.isImport ">
      <el-button type="text" size="small" @click='importQuestion(scope.row)'>导入试题</el-button>
    </span>
  </div>
</template>

<script>
export default {
  name: "tableEdit",
  props: {
    scope: {
      type: Object,
      default: {}
    },
    power: {
      type: Object,
      default: {}
    },
    anchorState: {
      type: Number,
      default: -1
    },
    anchorStatisticsState:{
      type: Boolean,
      default: false
    },
    timeTableState:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    joinGame(e){
      this.$emit("joinGame", e);
    },
    navToTimeTable(e) {
      this.$emit("navToTimeTable", e);
    },
    anchorCount(e) {
      this.$emit("anchorCount", e);
    },
    banAnchor(e) {
      this.$emit("banAnchor", e);
    },
    recoveryAnchor(e) {
      this.$emit("recoveryAnchor", e);
    },
    edit(e) {
      this.$emit("edit", e);
    },
    recommend(e) {
      this.$emit("recommend", e);
    },
    examine(e) {
      this.$emit("examine", e);
    },
    online(e) {
      this.$emit("online", e);
    },
    count(e) {
      this.$emit("count", e);
    },
    deleteItem(e) {
      this.$emit("deleteItem", e);
    },
    site(e) {
      this.$emit("site", e);
    },
    reset(e) {
      this.$emit("reset", e);
    },
    setTop(e) {
      this.$emit("setTop", e);
    },
    look(e) {
      this.$emit("look", e);
    },
    importQuestion(e) {
      this.$emit("importQuestion", e);
    },
    lookFun(e) {
      this.$emit("lookFun", e);
    }
  },
  created() {
  },
  mounted() { },
  watch: {}
};
</script>

<style lang="scss">

</style>
