<template>
  <div>
    <head-top />
    <div class="content">
      <div class="topic">
        <img src="../../images/icon_service.png"><span>温馨提示您</span>
      </div>
      <p class="tip-top">心理健康随访管理系统仅能</p>
      <p class="tip-top">通过微信公众号登录访问</p>
      <div class="code"></div>
      <p class="tip-bottom">识别二维码</p>
      <p class="tip-bottom">登录公众号</p>
    </div>
    <foot-info />
  </div>
</template>
<script>
import headTop from '../../components/header/head'
import footInfo from '../../components/footer/foot'
export default {
  components: {
    headTop,
    footInfo
  },
}
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.content {
  .topic {
    @include fz;
    margin-top: 2.5173rem;
    margin-bottom: 0.4693rem;
    img {
      @include wh(1.493rem, 1.493rem);
    }
    span {
      display: inline-block;
      height: 28px;
      font-size: 18px;
      font-weight: 300;
      color: #b8d4ff;
      line-height: 25px;
    }
  }
  p {
    width: 100%;
    text-align: center;
    font-size: 22px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.87);
    line-height: 30px;
  }
  .code {
    @include wh(7.7226rem, 7.7226rem);
    background: #fff;
    margin: 4.01rem 0rem 1.365rem 4.3946rem;
  }
  .tip-bottom {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
  }
}
</style>