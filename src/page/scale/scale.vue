<template>
  <div :style="{paddingBottom:((scaleArr && scaleArr.length!=0) || (historyRecord && historyRecord.length!=0) ? '3.913rem' : 0)}">
    <add-point v-if="increasePoints"
               :point="point" />
    <div v-if="!onLine"
         class="abnormal">
      <img src="../../images/ic_network.png">
      <p>请检查您的网络设置</p>
    </div>
    <div v-if="onLine && showPage">
      <div v-if="(showScale&&hasVisited) || (scaleArr && scaleArr.length > 0) || (historyRecord&&historyRecord.length > 0)">
        <div v-if="scaleArr && scaleArr.length"
             class="desc-text">
          <img src="../../images/ic_warning.png"><span>未完成</span>
        </div>
        <div v-show="scaleArr && scaleArr.length==0 && historyRecord && historyRecord.length==0"
             class="scale-desc">
        </div>
        <div v-if="canShowScale && (scaleArr && scaleArr.length) || (historyRecord&&historyRecord.length)">
          <div class="scalelist"
               :key="index"
               :style="{marginBottom:(index+1 === scaleArr.length? '0':'0.64rem')}"
               v-for="(item,index) in scaleArr">
            <p class="dealdate">{{changeDate(item.test.created_at)}}</p>
            <p class="scalename">{{item.scale.name_cn}}</p>
            <p class="scaletype"
               :style="{color:colorArr[index]}"></p>
            <button class="btn-answer"
                    @click="goTest(item.scale.id, item.test.id)">点击填写</button>
          </div>
          <div v-if="historyRecord && historyRecord.length>0"
               class="completed-con">
            <div :style="{paddingTop:(scaleArr.length==0 && historyRecord.length!=0 ? '0.5546rem':'0.853rem')}"
                 class="completed-img">
              <img src="../../images/ic_completed.png" /><span>已完成</span>
            </div>
            <div @click="handlerClick(historyRecord[0].report,historyRecord[0].scale.name_cn,historyRecord[0].test.finished_at)"
                 class="completed-list">
              <span class="sc-name">{{historyRecord[0].scale.name_cn}}</span>
              <span class="sc-date">{{historyRecord[0].test.finished_at}}</span>
            </div>
            <div v-if="historyRecord.length>1"
                 @click="$router.push('/complete')"
                 class="more">查看历史记录>></div>
          </div>
        </div>
        <div v-if="canShowScale && (scaleArr&&scaleArr.length == 0) && (historyRecord&&historyRecord.length == 0)"
             class="login-content">
          <img class="img-service"
               src="../../images/icon_service.png">
          <div class="description">
            <p>您暂时没有需要</p>
            <p>测评的量表</p>
          </div>
        </div>
      </div>
      <div v-else
           @click="initData('yes')"
           class="abnormal">
        <img :class="{'roate':roating}"
             src="../../images/ic_loading.png">
        <p v-show="!roating">数据加载失败</p>
        <p v-show="!roating">请点击刷新</p>
      </div>
    </div>
    <report @closeReportTip="closeReportTip"
            :report="report"
            :scaleName="scaleName"
            :finished_at="finished_at"
            v-if="showReport"></report>
    <foot-nav></foot-nav>
  </div>
</template>
<script>
import footNav from '../../components/footer/nav'
import report from '../../components/common/report'
import addPoint from '../../components/common/addPoint'
import { getTestList, getTestHistory } from '@/service/getData'
import { getStore, setStore } from '@/config/mUtils'
export default {
  data () {
    return {
      onLine: navigator.onLine,//网络状态
      scaleArr: null,
      showReport: false,
      uid: null,// 用户id
      point: 0,
      increasePoints: false,
      showScale: true, //显示量表
      canShowScale: false,
      showPage: false,
      colorArr: ['#0058E3', '#5E4BE9', '#03A25B', '#0058E3', '#5E4BE9'],
      shadowArr: ['rgba(16,109,255,0.3)', 'rgba(94,75,233,0.3)', 'rgba(3,162,91,0.3)', 'rgba(16,109,255,0.3)', 'rgba(94,75,233,0.3)',],
      historyRecord: null,
      report: null,
      hasVisited: true,
      roating: false,
      scaleName: null,
      timer: null,
      finished_at: null
    }
  },
  components: {
    footNav,
    report,
    addPoint
  },
  created () {
    // setStore('uid', 1)
    if (this.$route.query.user_id) {
      this.uid = this.$route.query.user_id
      setStore('uid', this.$route.query.user_id)
    } else {
      this.uid = getStore('uid')
    }
  },
  mounted () {
    this.initData()
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
    this.timer = setTimeout(() => {
      this.showScale = false
      this.hasVisited = false
    }, 1000)
  },
  methods: {
    async initData (yes) {
      if (yes) {
        this.roating = true
      }
      let res = await getTestList(this.uid)
      this.showPage = true
      if (res.data.getPoint) {
        this.increasePoints = true
        this.point = res.data.getPoint
        setTimeout(() => {
          this.increasePoints = false
        }, 2000)
      }
      if (res.code == 0 && res.data.list) {
        this.roating = false
        this.showScale = true
        this.canShowScale = true
        this.scaleArr = res.data.list
        this.scaleArr.forEach((item, index) => {
          item.test.start_time = this.changeDate(item.test.start_time)
        })
      } else {
        this.showScale = false
      }
      let rdata = await getTestHistory(this.uid)
      if (rdata.code == 0) {
        this.roating = false
        this.hasVisited = true
        this.canShowScale = true
        this.historyRecord = rdata.data.list
        this.historyRecord.forEach((item, index) => {
          item.test.finished_at = this.changeDate(item.test.finished_at)
        })
      }
      if (rdata.code == 0 && res.code == 0) {
        clearTimeout(this.timer)
      }
    },
    changeDate (timing) {
      var date = new Date(timing * 1000)
      var y = 1900 + date.getYear()
      var m = "0" + (date.getMonth() + 1)
      var d = "0" + date.getDate()
      return y + "." + m.substring(m.length - 2, m.length) + "." + d.substring(d.length - 2, d.length)
    },
    updateOnlineStatus (e) {
      const { type } = e;
      this.onLine = type === 'online'
    },
    goTest (id, testId) {
      setStore('test_id', testId)
      this.$router.push({ path: '/scale/' + id })
    },
    handlerClick (item, name, time) {
      this.showReport = true
      this.report = this.historyRecord[0].report
      this.scaleName = name
      this.finished_at = time
    },
    closeReportTip () {
      this.showReport = false
    }
  },
  beforeDestroy () {
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.scale-desc {
  width: 100%;
  height: 4.48rem;
  position: relative;
}
.desc-text {
  display: flex;
  align-items: center;
  padding: 0.5546rem 0rem 0.4693rem 1.493rem;
  font-size: 0.853rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.87);
  img {
    @include wh(0.768rem, 0.768rem);
    margin-right: 0.2986rem;
  }
  span {
    font-family: PingFangSC-Medium, PingFang SC;
  }
}
.login-content {
  @include wh(14.6346rem, 17.1946rem);
  background: #fff;
  border-radius: 0.768rem;
  margin: 0 auto;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
  font-size: 0.6826rem;
  color: #7f48b4;
  overflow: hidden;
  position: relative;
  .img-service {
    @include wh(6.613rem, 6.57rem);
    margin-top: 2.6026rem;
    margin-left: 4.01rem;
  }
  .description {
    margin-top: 2.176rem;
    p {
      width: 100%;
      text-align: center;
      color: #666660;
      font-size: 1.28rem;
      line-height: 1.8346rem;
      font-weight: 500;
      font-family: PingFangSC-Medium, PingFang SC;
    }
  }
}
.scalelist {
  width: 14.6346rem;
  height: 10.24rem;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0rem 0.1706rem 0.1706rem 0rem rgba(0, 0, 0, 0.2);
  border-radius: 0.768rem;
  margin: 0 auto;
  padding: 0 0.7253rem 0 0.8106rem;
  .dealdate {
    font-size: 0.853rem;
    font-weight: 400;
    color: rgba(132, 132, 132, 1);
    line-height: 1.1946rem;
    padding-top: 1.5786rem;
  }
  .scalename {
    font-size: 1.28rem;
    font-weight: 500;
    color: #7f48b4;
    font-family: PingFangSC-Medium, PingFang SC;
  }
  .scaletype {
    height: 1.2373rem;
    font-size: 0.896rem;
    line-height: 1.2373rem;
    font-weight: 400;
  }
  .btn-answer {
    border: 0;
    display: block;
    width: 7.3386rem;
    height: 2rem;
    border-radius: 1.024rem;
    font-size: 0.768rem;
    font-weight: 400;
    color: #fff;
    margin: 1.1093rem auto 0;
    background: #7f48b4;
    box-shadow: 0rem 0.1706rem 0.3413rem 0.128rem rgba(187, 117, 255, 0.3);
  }
}
.completed-con {
  .completed-img {
    padding: 0.853rem 0 0.4693rem 1.3653rem;
    display: flex;
    align-items: center;
    img {
      width: 0.768rem;
      height: 0.768rem;
    }
    span {
      display: inline-block;
      font-size: 0.853rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.87);
      line-height: 1.1946rem;
      margin-left: 0.384rem;
    }
  }
  .completed-list {
    width: 14.6346rem;
    height: 3.072rem;
    box-shadow: 0rem 0.1706rem 0.1706rem 0rem rgba(0, 0, 0, 0.2);
    border-radius: 0.768rem;
    background: #fff;
    margin: 0 auto;
    padding: 0rem 0.64rem 0rem 0.7253rem;
    font-size: 0.853rem;
    font-weight: 400;
    color: #848484;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .more {
    font-size: 0.853rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.87);
    text-align: center;
    padding-top: 0.64rem;
  }
}
.abnormal {
  text-align: center;
  height: 94vh;
  img {
    @include wh(2.048rem, 2.048rem);
    margin-top: 10.112rem;
  }
  p {
    font-size: 0.853rem;
    font-weight: 500;
    color: #fff;
    line-height: 1.7493rem;
    font-family: PingFangSC-Medium, PingFang SC;
  }
}
.roate {
  -webkit-transition-property: -webkit-transform;
  -webkit-transition-duration: 1s;
  -moz-transition-property: -moz-transform;
  -moz-transition-duration: 1s;
  -webkit-animation: rotate 2s linear infinite;
  -moz-animation: rotate 2s linear infinite;
  -o-animation: rotate 2s linear infinite;
  animation: rotate 2s linear infinite;
}
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-moz-keyframes rotate {
  from {
    -moz-transform: rotate(0deg);
  }
  to {
    -moz-transform: rotate(359deg);
  }
}
@-o-keyframes rotate {
  from {
    -o-transform: rotate(0deg);
  }
  to {
    -o-transform: rotate(359deg);
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>