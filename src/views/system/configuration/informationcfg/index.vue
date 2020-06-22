<template>
	<div>
		{{this.$route.path}}
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
import { Component, Vue } from "vue-property-decorator";
import System from "@api/system";
//https://github.com/ktsn/vuex-class
@Component({})
export default class Informationcfg extends Vue {
  created() {
    
  }
  getList() {
    let data = {
      
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
