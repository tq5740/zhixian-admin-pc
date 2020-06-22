<template>
  <div class="notFound">
    <h3>页面走丢了...</h3>
  </div>
</template>

<script lang="ts">
/*
 module:
    main.ts
  author:
    lose_kl<https://github.com/NeverMore-KL>
  summary:
    2018-7-11:init some demo
 */
//https://github.com/kaorun343/vue-property-decorator
import { Component, Vue } from "vue-property-decorator";
//https://github.com/ktsn/vuex-class
@Component({})
export default class NotFound extends Vue {
  created() {}
}
</script>
<style lang="scss" scoped>
.notFound {
  padding: 30px;
}
</style>
