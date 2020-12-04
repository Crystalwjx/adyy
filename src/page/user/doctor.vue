<template>
  <div class="doctor-page">
    <div v-if="true"
         class="doctor-content">
      <div v-if="true"
           class="items doctor">
        <div class="image">医</div>
        <div class="content">
          <div class="time newinfo">
            <p>2020-11-12 昨天</p>
            <p>新消息</p>
          </div>
          <div class="dialog">本次药品请及时服用。若已经按时服用，请及时填写每日记录</div>
        </div>
      </div>
      <div v-else
           class="items user">
        <div class="content">
          <div class="time newinfo">
            <p>2020-11-12 昨天</p>
            <p>新消息</p>
          </div>
          <div class="dialog">本次药品请及时服用。若已经按时服用，请及时填写每日记录</div>
        </div>
        <div class="image">我</div>
      </div>
    </div>
    <div v-else
         class="none-order">
      <img src="../../images/empty.png">
      <div class="none-text">没有消息记录</div>
    </div>
    <div class="contact-doctor"
         @click="showOrderPage = true">咨询医生</div>
    <add-order v-if="showOrderPage"
               @closeTip="closeTip"></add-order>
    <foot-nav />
  </div>
</template>
<script>
import footNav from '../../components/footer/nav'
import addOrder from '../../components/common/addOrder'
export default {
  components: {
    addOrder,
    footNav
  },
  data () {
    return {
      showOrderPage: false
    }
  },
  methods: {
    closeTip () {
      this.showOrderPage = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.doctor-page {
  width: 100%;
  height: calc(100vh - 5.55rem);
  overflow: auto;
  padding-bottom: 0.4rem;
  .doctor-content {
    margin: 0.68rem 0.7rem 0rem;
    .items {
      @include fz;
      margin-top: 0.426rem;
      .image {
        width: 1.536rem;
        height: 1.536rem;
        border-radius: 50%;
        @include fz;
        background: #08c4d0;
        font-size: 0.5826rem;
        color: #fff;
        font-weight: 500;
        margin-right: 0.426rem;
      }
      .content {
        width: 100%;
        flex: 1;
        font-family: PingFangSC-Medium, PingFang SC;
        border-radius: 0.768rem;
        box-shadow: 0rem 0.17rem 0.17rem 0rem rgba(0, 0, 0, 0.2);
        background: #fff;
        padding: 0.64rem 0.7253rem;
        .time {
          font-size: 0.6rem;
          line-height: 0.768rem;
          display: flex;
          justify-content: space-between;
          font-weight: 400;
          color: #848484;
        }
        .newinfo > p {
          color: #08c4d0;
          font-weight: 600;
        }
        .dialog {
          font-size: 0.68rem;
          line-height: 0.768rem;
          color: #3a3a3a;
          font-weight: 600;
          margin-top: 0.17rem;
        }
      }
    }
    .user {
      .image {
        margin-left: 0.426rem;
        margin-right: 0rem;
        background: #da56c7;
      }
    }
  }
  .none-order {
    margin: 7.3386rem auto 0;
    text-align: center;
    img {
      @include wh(4.096rem, 4.096rem);
    }
    .none-text {
      font-size: 1.024rem;
      color: #fff;
      font-weight: 500;
      margin-top: 0.6rem;
    }
  }
  .contact-doctor {
    @include fc(92%, 2rem);
    position: absolute;
    left: 4%;
    bottom: 3.54rem;
    background: #08c4d0;
    color: #fff;
    font-size: 0.768rem;
    box-shadow: 0px 0.128rem 0.256rem 0.128rem rgba(187, 117, 255, 0.3);
    border-radius: 0.17rem;
  }
}
</style>