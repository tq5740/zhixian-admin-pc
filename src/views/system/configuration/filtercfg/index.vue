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
//https://github.com/ktsn/vuex-class
@Component({})
export default class Filtercfg extends Vue {}
</script>
<style lang="scss" scoped>
</style>
