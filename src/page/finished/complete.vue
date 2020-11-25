<template>
  <div class="completed-page">
    <div class="desc-text">
      <img src="../../images/ic_warning.png"><span>全部历史记录</span>
    </div>
    <div v-for="(item,index) in historyRecord"
         :key="index"
         @click="handlerClick(item.report,item.scale.name_cn,item.test.finished_at)"
         class="completed-list">
      <span class="sc-name">{{item.scale.name_cn}}</span>
      <span class="sc-date">{{item.test.finished_at}}</span>
    </div>
    <report @closeReportTip="closeReportTip"
            :report="report"
            :scaleName="scaleName"
            :finished_at="finished_at"
            v-if="showReport"></report>
  </div>
</template>
<script>
import report from '../../components/common/report'
import { getTestHistory } from '@/service/getData'
import { getStore } from '@/config/mUtils'
export default {
  data () {
    return {
      showReport: false,
      historyRecord: null,
      report: null,
      scaleName: null,
      finished_at: null
    }
  },
  mounted () {
    this.initData()
  },
  components: {
    report
  },
  methods: {
    async initData () {
      let rdata = await getTestHistory(getStore('uid'))
      if (rdata.code == 0) {
        this.historyRecord = rdata.data.list
        this.historyRecord.forEach((item, index) => {
          item.test.finished_at = this.changeDate(item.test.finished_at)
        })
      }
    },
    changeDate (timing) {
      var date = new Date(timing * 1000);
      var y = 1900 + date.getYear();
      var m = "0" + (date.getMonth() + 1);
      var d = "0" + date.getDate();
      return y + "." + m.substring(m.length - 2, m.length) + "." + d.substring(d.length - 2, d.length);
    },
    handlerClick (item, name, time) {
      this.showReport = true
      this.report = item
      this.scaleName = name
      this.finished_at = time
    },
    closeReportTip () {
      this.showReport = false
    }
  }
}
</script>
<style lang="scss" scoped>
.completed-page {
  .desc-text {
    display: flex;
    align-items: center;
    padding: 0.5546rem 0rem 0.4693rem 1.493rem;
    font-size: 0.853rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.87);
    img {
      width: 0.768rem;
      height: 0.768rem;
      margin-right: 0.2986rem;
    }
    span {
      font-family: PingFangSC-Medium, PingFang SC;
    }
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
  margin-bottom: 0.5546rem;
  font-size: 0.853rem;
  font-weight: 400;
  color: #848484;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
// .completed-list {
//   .sc-name {
//     font-size: 1.28rem;
//     font-weight: 500;
//     color: #0058e3;
//     line-height: 1.792rem;
//   }
//   .sc-date {
//     font-size: 0.853rem;
//     font-weight: 400;
//     color: #848484;
//     line-height: 2.1rem;
//     float: right;
//   }
// }
.next-question {
  border: 0;
  display: block;
  width: 7.3386rem;
  height: 2rem;
  border-radius: 1.024rem;
  font-size: 0.768rem;
  font-weight: 500;
  margin: 1.8773rem auto 1.4506rem;
  color: #1d7aff;
  background: #fff;
}
</style>