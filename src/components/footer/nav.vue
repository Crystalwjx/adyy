<template>
  <div class="footer-nav">
    <div v-if="/^\/relate/.test($route.path)"
         class="on-page"><img src="../../images/ic_knowledge_on.png">
      <p>每日记录</p>
    </div>
    <div v-else
         @click="$router.push('/relate')"><img src="../../images/ic_knowledge_off.png">
      <p>每日记录</p>
    </div>
    <div v-if="$route.path==='/scale'"
         class="on-page"><img src="../../images/ic_mind_on.png">
      <p>心理测查</p>
    </div>
    <div v-else
         @click="$router.push('/scale')"><img src="../../images/ic_mind_off.png">
      <p>心理测查</p>
    </div>
    <div v-if="$route.path==='/user'"
         class="on-page"><img src="../../images/ic_user_on.png">
      <p>我的</p>
    </div>
    <div v-else
         @click="$router.push('/user')"><img src="../../images/ic_user_off.png">
      <p>我的</p>
    </div>
  </div>
</template>
<script>
export default {
}
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.footer-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2.304rem;
  background: #fff;
  @include fz;
  div {
    height: 2.56rem;
    flex: 1;
    @include fz;
    border-top: 0.256rem solid #ead6fe;
    font-size: 0.6826rem;
    color: #848484;
    img {
      width: 0.9813rem;
    }
    p {
      margin-left: 3px;
    }
  }
  .on-page {
    color: #3a3a3a;
    font-size: 0.6826rem;
    border-color: #ca95ff;
  }
}
</style>