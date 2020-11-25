<template>
  <div class="video-tip">
    <div @click="closeTip"
         class="mask"></div>
    <div class="tip-con">
      <img @click="closeTip"
           src="../../images/close-circle.png"
           class="image">
      <p class="con">针对您的测查结果</p>
      <p class="con">你需要学习一个视频</p>
      <p class="con"> 并回答问题</p>
      <button @click="$router.replace('/video')"
              class="start-btn">开始</button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    closeTip () {
      this.$emit('closeVideoTip')
    }
  }
}
</script>
<style lang="scss" scoped>
.video-tip {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
    background: rgba(0, 0, 0, 0.7);
  }
  .tip-con {
    width: 13.184rem;
    height: 9.77rem;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.2);
    border-radius: 0.768rem;
    background: #fff;
    z-index: 300;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    // top: 2.4rem;
    padding-top: 1.3653rem;
    text-align: center;
    .image {
      position: absolute;
      top: -1.7rem;
      width: 1.1946rem;
      height: 1.1946rem;
      right: 0;
    }
    .con {
      font-size: 1.024rem;
      color: #116d3b;
      line-height: 1.408rem;
    }
    .start-btn {
      border: 0;
      display: block;
      width: 7.3386rem;
      height: 2rem;
      border-radius: 1.024rem;
      font-size: 0.768rem;
      font-weight: 400;
      margin: 0.9386rem auto 0rem;
      color: #fff;
      background: #09ca61;
      box-shadow: 0rem 0.1706rem 0.3413rem 0.128rem rgba(146, 248, 193, 1);
    }
  }
}
</style>
