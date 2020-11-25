 <template>
  <div class="alet_container">
    <div class="alet_box">
      <div class="alet_icon"
           @click="closeTip">
        <i class="icon">
          <img src="../../images/icon-close.png" />
        </i>
      </div>
      <section class="tip_text_container">
        <div class="tip_icon">
          <img src="../../images/icon-warning.png" />
        </div>
        <p class="tip_text">{{alertText}}</p>
        <div class="confrim"
             @click="closeTip">确认</div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      positionY: 0,
      timer: null
    }
  },
  mounted () {

  },
  props: ['alertText'],
  methods: {
    closeTip () {
      this.$emit('closeTip')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
.alet_container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}
.success_con {
  background: rgba(0, 0, 0, 0.7) !important;
}
.alet_icon {
  background: #fff;
  height: 0.853rem;
  padding: 1px 0.682rem 1px 0rem;
  padding-top: 2px;
  padding-right: 0.682rem;
  i {
    font-size: 0.853rem;
    float: right;
  }
}
.tip_text_container {
  width: 100%;
  background: #fff;
  // position: absolute;
  padding: 0px 0.682rem 1.2rem 0.682rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  i {
    font-size: 0.789rem;
    float: left;
  }
  .tip_icon {
    @include wh(1.8rem, 1.8rem);
    img {
      @include wh(1.8rem, 1.8rem);
    }
  }
  .tip_text {
    @include sc(0.682rem, #000);
    text-align: center;
    margin-top: 0.2rem;
    letter-spacing: 0.2px;
  }
  .confrim {
    @include sc(0.682rem, #fff);
    margin-top: 1.2rem;
    background-color: $con;
    width: 80%;
    height: 1.8rem;
    line-height: 1.8rem;
    text-align: center;
    border-radius: 0.15rem;
  }
}

.alet_box {
  width: 80%;
}

.alet_icon {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 2rem;
  > i.icon {
    display: block;
    width: 0.81rem;
    height: 0.81rem;
    > img {
      display: block;
      width: 100%;
    }
  }
}
</style>
