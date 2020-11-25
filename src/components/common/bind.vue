<template>
  <div class="bind-mask">
    <div class="con-bind">
      <div class="con-top">
        <span>和患者的关系</span>
        <img @click="handlerClose"
             src="../../images/icon-close.png">
      </div>
      <ul>
        <li v-for="(item,index) in bindArr"
            :key="index"
            @click="handlerClick(item)"
            class="listitem">{{item}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      bindArr: ['儿子', '女儿', '父亲', '母亲', '妻子', '丈夫', '亲戚', '朋友', '护工', '其他']
    }
  },
  methods: {
    handlerClick (item) {
      this.$emit('closeTip', item)
    },
    handlerClose () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.bind-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 100;
  .con-bind {
    width: 100%;
    height: 18rem;
    position: absolute;
    bottom: 0;
    background: #fff;
    .con-top {
      text-align: center;
      font-size: 1.024rem;
      color: #000;
      @include fc(100%, 1.7rem);
      img {
        @include wh(0.853rem, 0.853rem);
        position: absolute;
        right: 0.853rem;
        top: 0.426rem;
      }
    }
  }
  .listitem {
    @include fc(100%, 1.536rem);
    font-size: 0.853rem;
    color: #474747;
  }
  .listitem:active {
    background: #e3efff;
  }
}
</style>