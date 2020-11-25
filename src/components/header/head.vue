<template>
  <header id='head_top'>
    <section class="head_info head_img">
      <img :src="icons.info" />
    </section>
    <section>
      <span class="title_text">⼼理健康随访管理系统</span>
    </section>
    <section class="head_goclose head_img">
      <img :src="icons.close" />
    </section>
  </header>
</template>

<script>
export default {
  data () {
    return {
      icons: {
        info: require('../../images/ic_options.png'),
        close: require('../../images/ic_close.png'),
      },
    }
  },
  mounted () {
  },
  methods: {
  },
}



</script>

<style lang="scss" scoped>
@import "../../style/mixin";
#head_top {
  background-color: #1d7aff;
  @include fc(100%, 2.4746rem);
  @include sc(0.768rem, #fff);
  position: relative;
  .head_img {
    position: absolute;
    top: 0.853rem;
    img {
      display: block;
    }
  }
  .head_info {
    img {
      @include wh(0.853rem, 0.853rem);
    }
    left: 0.6826rem;
  }
  .head_goclose {
    img {
      @include wh(0.853rem, 0.853rem);
    }
    right: 0.6826rem;
  }
}
</style>
