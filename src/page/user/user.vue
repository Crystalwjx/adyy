<template>
  <div class="user-page">
    <div class="user-con">
      <div class="user-img">
        <div class="user-left">
          <img :src="patientInfo.headimgurl">
        </div>
        <div class="user-name">{{patientInfo.nickname}}</div>
      </div>
      <div class="user-right">
        <p>积分 <span>{{patientInfo.point}}</span></p>
      </div>
    </div>
    <div v-if="recordsInfo.date.length"
         class="echart-con"
         id="chart">

    </div>
    <div v-if="recordsInfo.date.length"
         class="echart-con"
         id="schart">

    </div>
    <div v-if="hospital||tel||mydoctor"
         class="hospital-con">
      <div v-if="hospital"
           class="item-info">医院：{{hospital}}</div>
      <div v-if="tel"
           class="item-info">电话：{{tel}}</div>
      <div v-if="mydoctor"
           class="item-info">医生：{{mydoctor}}</div>
    </div>
    <div class="button-con">
      <button class="btn-answer"
              @click="$router.push('/relate')">查看课程</button>
      <button class="btn-answer"
              @click="$router.push('/doctor')">查看医嘱</button>
    </div>
    <alert-tip v-if="showAlert"
               @closeTip="closeTip"
               :alertText="alertText"></alert-tip>
    <foot-nav></foot-nav>
  </div>
</template>
<script>
import footNav from '../../components/footer/nav'
import alertTip from '../../components/common/alertTip'
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
      hospital: '',
      tel: '5555',
      mydoctor: '',
      showAlert: false,
      alertText: null,
      recordsInfo: {
        date: [],
        happyText: [],
        time: []
      }
    }
  },
  components: {
    alertTip,
    footNav
  },
  mounted () {
    this.initData()
  },
  methods: {
    showChart () {
      var chart = this.$echarts.init(
        document.getElementById("chart")
      )
      var schart = this.$echarts.init(
        document.getElementById("schart")
      )
      this.drawLine(chart)
      this.drawLines(schart)
    },
    async initData () {
      let res = await getUserInfo(getStore('uid'))
      if (res.code == 0) {
        this.patientInfo = res.data.info
        this.mydoctor = res.data.mydoctor
        this.tel = res.data.mobile
        this.hospital = res.data.hospitalName
        if (!(res.data.records instanceof Array)) {
          this.recordsInfo = res.data.records
        }
        if (this.recordsInfo.date.length) {
          this.$nextTick(() => {
            this.showChart()
          })
        }
      } else {
        this.showAlert = true
        this.alertText = res.msg || res.message
      }
    },
    closeTip () {
      this.showAlert = false
    },
    drawLine (name) {
      // 绘制图表
      name.setOption({
        title: {
          text: '心情日记分值',
          textStyle: {
            fontSize: 14,
            color: '#7F48B4'
          }
        },
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#7F48B4',
              width: '2'
            }
          },
          axisLabel: {
            interval: 'auto',
            rotate: this.recordsInfo.date.length > 3 ? 40 : 0
          },
          inverse: false,
          data: this.recordsInfo.date
        }],
        yAxis: [{
          max: 10,
          min: -10,
          type: 'value',
          minInterval: 10,
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#7F48B4',
            }
          },
          splitLine: {
            lineStyle: {
              color: '#7F48B4',
              type: 'dashed'
            }
          },
          axisTick: {
            lineStyle: {
              color: '#7F48B4'
            }
          }
        }],
        dataZoom: [{
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          startValue: this.recordsInfo.date.length - 7,
          endValue: this.recordsInfo.date.length - 1
        }],
        grid: {
          left: "10%",
          top: "20%",
          right: "10%",
          bottom: this.recordsInfo.date.length > 3 ? "32%" : "12%"
        },
        series: [{
          data: this.recordsInfo.happyText,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#88B6FF' // 折线颜色
              },
              color: "#3882F6", // 折线点圈内
              borderWidth: 2,
              borderColor: '#88B6FF', // 折线点边框
            }
          },
          type: 'line'
        }]
      });
    },
    drawLines (name) {
      // 绘制图表
      name.setOption({
        title: {
          text: '睡眠时长',
          textStyle: {
            fontSize: 14,
            color: '#7F48B4'
          }
        },
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#7F48B4',
              width: '2'
            },
            splitLine: {
              lineStyle: {
                color: '#7F48B4',
                type: 'dashed'
              },
              interval: 0
            },
            axisTick: {
              show: false
            }
          },
          axisLabel: {
            interval: 'auto',
            rotate: this.recordsInfo.date.length > 3 ? 40 : 0
          },
          data: this.recordsInfo.date
        }],

        yAxis: [{
          max: 24,
          min: 0,
          splitNumber: 4,
          type: 'value',
          minInterval: 6,
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#7F48B4',
            }
          },
          splitLine: {
            lineStyle: {
              color: '#7F48B4',
              type: 'dashed'
            },
            interval: 0
          },
          axisTick: {
            lineStyle: {
              color: '#7F48B4'
            },
            show: false
          }
        }],
        grid: {
          left: "10%",
          top: "20%",
          right: "10%",
          bottom: this.recordsInfo.date.length > 3 ? "32%" : "12%"
        },
        dataZoom: [{
          type: 'inside',
          show: true,
          xAxisIndex: [0],
          startValue: this.recordsInfo.date.length - 7,
          endValue: this.recordsInfo.date.length - 1
        }],
        series: [{
          data: this.recordsInfo.time,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#08C4D0' // 折线颜色
              },
              color: "#08C4D0", // 折线点圈内
              borderWidth: 2,
              borderColor: '#6BEFF8', // 折线点边框
            }
          },
          type: 'line'
        }]
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.user-page {
  height: 100vh;
  background: #7f48b4;
  padding-bottom: 3.26rem;
  overflow: auto;
  .user-con {
    height: 4.608rem;
    padding: 0.17rem 1.024rem 0rem 1.28rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .user-img {
      display: flex;
      align-items: center;
      .user-left {
        width: 2.73rem;
        height: 2.73rem;
        border: 3px solid #cf9eff;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .user-name {
        margin-left: 0.256rem;
        font-size: 1.024rem;
        color: #fff;
      }
    }
    .user-right {
      p {
        font-size: 0.6rem;
        color: #fff;
        span {
          font-size: 1.024rem;
          color: #fea330;
        }
      }
    }
  }
  .echart-con {
    width: 14.6346rem;
    height: 8.3626rem;
    background: #fff;
    box-shadow: 0rem 0.1706rem 0.1706rem 0rem rgba(0, 0, 0, 0.2);
    border-radius: 0.768rem;
    margin: 0 auto;
    padding: 0.7253rem 0.8106rem;
    margin-bottom: 0.68rem;
  }
  .hospital-con {
    width: 14.6346rem;
    background: #08c4d0;
    color: #fff;
    box-shadow: 0rem 0.1706rem 0.1706rem 0rem rgba(0, 0, 0, 0.2);
    border-radius: 0.768rem;
    margin: 0 auto;
    padding: 0.853rem 1.28rem;
    font-size: 0.768rem;
    .item-info {
      margin-bottom: 0.384rem;
    }
    div.item-info:last-of-type {
      margin-bottom: 0rem;
    }
  }
  .button-con {
    width: 14.6346rem;
    margin: 0.68rem auto 0rem;
    display: flex;
    justify-content: space-between;
    .btn-answer {
      width: 6.186rem;
      height: 2rem;
      border-radius: 1.024rem;
      font-size: 0.768rem;
      font-weight: 400;
      color: #fff;
      background: #08c4d0;
    }
  }
}
</style>