<template>
  <div class="foot-info"
       :class="isPad ? 'isPad':'notPad'">
    <div>欢迎进入</div>
    <div>⼼理健康随访管理系统</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isPad: false
    }
  },
  created () {
    this.isPad = document.documentElement.clientWidth >= 640 ? true : false
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.foot-info {
  width: 100%;
  text-align: center;
  color: #fff;
  div:first-of-type {
    font-size: 0.768rem;
    line-height: 0.768rem;
    transform: scale(0.67);
  }
  div:last-of-type {
    font-size: 0.768rem;
    line-height: 0.768rem;
  }
}
.notPad {
  position: absolute;
  bottom: 1.1093rem;
}
.isPad {
  padding-top: 1.1093rem;
  padding-bottom: 1.1093rem;
}
</style>