<template>
  <div class="user-page">
    <div class="user-con">
      <div class="user-img">
        <div class="user-left">
          <img :src="patientInfo.headimgurl">
        </div>
        <div class="user-right">{{ patientInfo.nickname }}</div>
      </div>
      <div class="user-info">
        <div class="info-left">
          <img src="../../images/icon_credit.png"
               class="credit">
          <span>我的积分</span>
        </div>
        <div class="info-right">{{ patientInfo.point }}</div>
      </div>
      <div class="user-info">
        <div class="info-left">
          <img src="../../images/shape.png"
               class="shape">
          <span>我的医生</span>
        </div>
        <div class="info-right">{{ mydoctor }}</div>
      </div>
    </div>
    <div v-if="tel"
         class="doctor-info">
      <div class="hospital-name">专属医生联系电话</div>
      <a :href="'tel:' + tel"
         ref="phone"
         class="hospital-phone">
        <img class="phone"
             src="../../images/icon_phone.png">
        <span> {{ tel }} </span>
      </a>
      <div class="hospital-time">工作时间：工作日 上午10点-下午5点</div>
    </div>
    <foot-nav></foot-nav>
  </div>
</template>
<script>
import footNav from '../../components/footer/nav'
import { getUserInfo } from '@/service/getData'
import { getStore } from '@/config/mUtils'
export default {
  data () {
    return {
      patientInfo: {
        id: '',
        point: '',
        headimgurl: '',
        nickname: ''
      },
      tel: '',
      mydoctor: ''
    }
  },
  components: {
    footNav
  },
  mounted () {
    this.initData()
  },
  methods: {
    async initData () {
      let res = await getUserInfo(getStore('uid'))
      if (res.code == 0) {
        this.patientInfo = res.data.info
        this.mydoctor = res.data.mydoctor
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.user-page {
  height: 100vh;
  background: #f0f2f5;
  padding-bottom: 2.56rem;
  .user-con {
    background: #7f48b4;
    .user-img {
      height: 4.608rem;
      padding-left: 1.28rem;
      padding-top: 0.17rem;
      display: flex;
      align-items: center;
      .user-left {
        width: 2.73rem;
        height: 2.73rem;
        border: 3px solid #81dbaa;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .user-right {
        margin-left: 0.256rem;
        font-size: 1.024rem;
        color: #fff;
      }
    }
    .user-info {
      width: 100%;
      height: 3.114rem;
      padding: 0 1.28rem 0 1.877rem;
      background: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #3a3a3a;
      font-size: 0.768rem;
      border-bottom: 1px solid #dce2e2;
      .info-left {
        display: flex;
        align-items: center;
        .credit {
          width: 1.536rem;
          height: 1.536rem;
          margin-right: 0.8106rem;
        }
        .shape {
          width: 1.408rem;
          height: 1.536rem;
          margin-right: 0.8106rem;
          margin-left: 0.128rem;
        }
        span {
          display: inline-block;
          height: 1.28rem;
          line-height: 1.536rem;
        }
      }
      .info-right {
        color: #7f48b4;
      }
    }
    div.user-info:last-of-type {
      border: 0;
    }
  }
  .doctor-info {
    text-align: center;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 3rem;
    .hospital-name {
      height: 1.1946rem;
      font-size: 0.853rem;
      font-weight: 500;
      color: #5c5c5c;
      line-height: 1.1946rem;
      font-family: PingFangSC-Medium, PingFang SC;
    }
    .hospital-phone {
      width: 13.013rem;
      height: 2.304rem;
      background: #7f48b4;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 1.28rem;
      margin: 0.256rem auto;
      font-family: PingFangSC-Medium, PingFang SC;
      font-size: 0.9386rem;
      font-weight: 500;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      .phone {
        width: 1.152rem;
        height: 1.152rem;
        margin-right: 2px;
      }
    }
    .hospital-time {
      font-size: 0.6826rem;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #09974a;
      line-height: 0.9386rem;
    }
  }
}
</style>