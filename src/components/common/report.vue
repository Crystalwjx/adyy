<template>
  <div class="report-page">
    <div class="report-con">
      <div class="sc-con">
        <span class="sc-name">{{scaleName}}</span>
        <span class="sc-date">{{finished_at}}</span>
      </div>
      <div class="result-header">
        <p v-for="(item,index) in report.scores"
           :key="index">{{item.name}}: {{item.value}}</p>
      </div>
      <div class="result-desc">{{report.summary[0]}}</div>
      <div v-for="(item,index) in report.diagnosis"
           :key="index"
           class="result-con">
        <div>{{index+1}}.</div>
        <div>{{item}}</div>
      </div>
      <button @click="closeTip"
              class="next-question">返回</button>
    </div>
  </div>
</template>
<script>
export default {
  props: ['report', 'scaleName', 'finished_at'],
  data () {
    return {
    }
  },
  methods: {
    closeTip () {
      this.$emit('closeReportTip')
    }
  }
}
</script>
<style lang="scss" scoped>
.report-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: #7f48b4;
  padding-top: 1.48rem;
  .report-con {
    width: 14.6346rem;
    background: #fff;
    border-radius: 0.768rem;
    margin: 0 auto;
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.4);
    box-sizing: border-box;
    font-size: 0.6826rem;
    color: #116d3b;
    overflow: hidden;
    padding: 0 0.7253rem 0 0.7253rem;
    margin-bottom: 1.353rem;
    .sc-con {
      display: flex;
      justify-content: space-between;
      margin-top: 1.024rem;
      margin-bottom: 1.152rem;
      font-size: 0.853rem;
      font-weight: 400;
      color: #bcbcbc;
    }
    .result-header {
      font-size: 1.024rem;
      font-weight: 500;
      color: #116d3b;
      line-height: 1.408rem;
      text-align: center;
      border-bottom: 1px solid #b0edcc;
      padding-bottom: 0.3413rem;
      p {
        font-family: PingFangSC-Medium, PingFang SC;
      }
    }
    .result-desc {
      font-size: 0.768rem;
      color: #3a3a3a;
      line-height: 1.06rem;
      font-weight: 600;
      margin-top: 0.64rem;
      font-family: PingFangSC-Medium, PingFang SC;
    }
    .result-con {
      font-size: 0.6826rem;
      color: #3a3a3a;
      line-height: 1.06rem;
      margin-top: 0.3413rem;
      display: flex;
      div {
        font-family: PingFangSC-Medium, PingFang SC;
      }
    }
    .next-question {
      border: 0;
      display: block;
      width: 7.3386rem;
      height: 2rem;
      border-radius: 1.024rem;
      font-size: 0.768rem;
      font-weight: 400;
      margin: 1.8773rem auto 1.4506rem;
      color: #fff;
      background: #09ca61;
      box-shadow: 0rem 0.1706rem 0.3413rem 0.128rem rgba(146, 248, 193, 1);
    }
  }
}
</style>