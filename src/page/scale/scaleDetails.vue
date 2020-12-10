<template>
  <div @click.stop.prevent="flag = false">
    <add-point v-if="increasePoints"
               :point="point" />
    <div v-if="!onLine"
         class="abnormal">
      <img src="../../images/ic_network.png">
      <p>请检查您的网络设置</p>
    </div>
    <div style="padding-bottom: 1.353rem;"
         v-else>
      <div class="scale-desc"
           :class="{'other-scale-desc':hasCompleted}">
        <div v-if="hasCompleted"
             class="desc-text">
          <img src="../../images/ic_examine.png"><span>请依序作答</span>
        </div>
      </div>
      <div class="login-content radio-answer"
           :class="resultStatus==0 ? 'type-result':resultStatus==1? 'other-type-result':'' ">
        <div v-if="hasCompleted">
          <div class="question"><img v-if="content[currentIndex].title == '关于幻听，请你判断最近一周是否有如下情况：'"
                 src="../../images/tips.png"
                 @click.stop.prevent="flag = !flag">{{content[currentIndex].title}}</div>
          <div v-if="flag"
               class="tip-con">幻听，即虚幻的听觉，属于幻觉的一种，听到的声音并非真实存在，如你“听”到有人在跟你对话，但其实这个人并不存在，或根本就没有跟你说话，你能“听”到，是由于你的大脑功能出现了问题，对信息进行了错误加工。因此，只有自己可以听到，而其他人是不可能听到的。</div>
          <div v-if="content[currentIndex].item_type == 1">
            <div class="answer"
                 v-for="(option,index) in content[currentIndex].options"
                 @click="handlerCheck(index,content[currentIndex])"
                 :key="index">
              <div><img ref="checkImg"
                     :src="icons.nocheck"></div>
              <span>{{option.title}}</span>
            </div>
          </div>
          <div v-else-if="content[currentIndex].item_type == 2">
            <div class="answer"
                 v-for="(option,index) in content[currentIndex].options"
                 @click='checkedOne(index,content[currentIndex])'
                 :key="index">
              <div>
                <img ref="checkImg"
                     :src="icons.noselect">
              </div>
              <span>{{option.title}}</span>
            </div>
          </div>
          <div v-else-if="content[currentIndex].item_type==21"
               class="control-body">
            <div class="zp-linelevel">
              <div class="zp-linelevel__title">评估声音的强度：</div>
              <div class="zp-linelevel__extreme">
                <div class="zp-linelevel__extreme_left">弱</div>
                <div class="zp-linelevel__extreme_right">强</div>
              </div>
              <div class="zp-linelevel__level">
                <div v-for="(item, index) in arr"
                     class="zp-linelevel__level-item"
                     :key="index"
                     :class="{'is-checked': range >= index}"
                     @click.stop.prevent="handlerSetValue(item, index)">{{index}}</div>
              </div>
            </div>
          </div>
          <div v-else
               @click="pickTime">
            <div v-if="pickerTime"
                 class="picked-time">{{pickerTime}}</div>
            <div v-else
                 class="pick-time">
              <span v-if="content[currentIndex].item_type == 11">选择时间</span>
              <span v-if="content[currentIndex].item_type == 12">选择次数</span>
              <span v-if="content[currentIndex].item_type == 13">选择时长</span>
              <img src="../../images/icon_back.png">
            </div>
          </div>
          <button v-if="currentIndex !== content.length-1"
                  class="next-question btn-next"
                  :class="{'unclick':!isChecked}"
                  :disabled="!isChecked"
                  @click="nextQuestion">下一题</button>
          <button v-else
                  class="next-question btn-next"
                  :class="{'unclick':!isChecked}"
                  :disabled="!isChecked"
                  @click="handlerFinish">完成</button>
        </div>
        <div class="completed"
             v-else>
          <!-- <div> 已完成量表
            <img src="../../images/ic_check.png">
            <div class="caption">您已完成量表</div>
          </div> -->
          <div>
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
          </div>
          <div>
            <button v-if="nextScale"
                    style="margin-top:3.7546rem;margin-bottom:1.4506rem;"
                    class="next-question"
                    @click="toScale">返回首页</button>
            <div v-else>
              <button @click="fillNextScale"
                      class="next-question">填写下一量表</button>
              <button class="next-question other"
                      @click="toScale">现在不填写</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <alert-tip v-if="showAlert"
               @closeTip="closeTip"
               :alertText="alertText"></alert-tip>
  </div>
</template>
<script>
import Vue from 'vue'
import alertTip from '../../components/common/alertTip'
import addPoint from '../../components/common/addPoint'
import { postStartTest, getTestInfo, postFinishTest, getTestReport, getTestList } from '@/service/getData'
import { getStore, setStore } from '@/config/mUtils'
export default {
  data () {
    return {
      arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      onLine: navigator.onLine,//网络状态
      currentIndex: 0,
      point: 0,
      increasePoints: false,
      pickIndex: null,
      range: undefined,
      icons: {
        nocheck: require('../../images/radio_off.png'),
        check: require('../../images/radio_on.png'),
        select: require('../../images/select.png'),
        noselect: require('../../images/noneSelect.png')
      },
      pickerTime: '',
      isChecked: false,
      content: [
        {
          id: '',
          item_type: '',
          options: [],
          scale_group_id: '',
          scale_id: '',
          scale_options: '',
          title: ''
        }
      ],
      checkArr: [],//记录选择状态的数组
      resultArr: [],
      hasCompleted: true,
      checkStatusList: [],
      resultStatus: 2,//结果 0表示第一种
      uid: null,// 用户id
      testId: null,// 测查id
      nextScale: true,//是否有下一量表
      testScaleId: null,//填写下一量表的id
      report: {
        "scores": [],
        "summary": [],
        "diagnosis": []
      },
      flag: false,
      showAlert: false,
      alertText: null
    }
  },
  components: {
    alertTip,
    addPoint
  },
  mounted () {
    this.uid = getStore('uid')
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
    document.body.addEventListener('touchstart', function (e) { })
    this.initData()
  },
  methods: {
    async initData () {
      let id = this.$route.params.id;
      let res = await postStartTest(this.uid, getStore('test_id'))
      let rdata = await getTestInfo(id)
      if (rdata.items && rdata.scale) {
        this.content = rdata.items
      }
    },
    checkedOne (index, op) {
      let pickArr = []
      let sIndex = op.veto ? parseInt(Object.keys(op.veto)[0]) - 1 : null
      // 判断是否选择
      var idIndex = this.checkStatusList.indexOf(index);
      if (op.veto) {
        if (index === sIndex) {
          if (idIndex >= 0) {
            this.$refs.checkImg[index].src = this.icons.noselect
            this.checkStatusList.splice(idIndex, 1)
          } else {
            for (var i = 0; i < this.$refs.checkImg.length; i++) {
              this.$refs.checkImg[i].src = this.icons.noselect
            }
            this.$refs.checkImg[index].src = this.icons.select
            this.checkStatusList = [index]
          }
        } else {
          let noIndex = this.checkStatusList.indexOf(sIndex)
          if (noIndex >= 0) {
            this.checkStatusList.splice(noIndex, 1)
            this.$refs.checkImg[sIndex].src = this.icons.noselect
          }
          if (idIndex >= 0) {
            this.$refs.checkImg[index].src = this.icons.noselect
            // 如果已选, 则去变为非选中状态
            this.checkStatusList.splice(idIndex, 1)
          } else {
            // 选则该项
            this.checkStatusList.push(index)
            this.$refs.checkImg[index].src = this.icons.select
          }
        }
      } else {
        if (idIndex >= 0) {
          this.$refs.checkImg[index].src = this.icons.noselect
          // 如果已选, 则去变为非选中状态
          this.checkStatusList.splice(idIndex, 1)
        } else {
          // 选则该项
          this.checkStatusList.push(index)
          this.$refs.checkImg[index].src = this.icons.select
        }
      }
      pickArr.push(this.checkStatusList, 0)
      this.checkArr.push(pickArr)
      Vue.set(this.resultArr, this.currentIndex, this.checkArr)
      this.isChecked = this.checkStatusList.length > 0 ? true : false
    },
    //单选
    handlerCheck (index) {
      let pickArr = []
      this.isChecked = true
      this.pickIndex = index
      for (var i = 0; i < this.$refs.checkImg.length; i++) {
        this.$refs.checkImg[i].src = this.icons.nocheck
      }
      this.$refs.checkImg[index].src = this.icons.check
      pickArr.push(index, 0)
      this.checkArr.push(pickArr)
      Vue.set(this.resultArr, this.currentIndex, this.checkArr)
    },
    nextQuestion () {
      this.checkArr = []
      let cType = this.content[this.currentIndex].item_type
      if (cType == 1) {
        for (var i = 0; i < this.$refs.checkImg.length; i++) {
          this.$refs.checkImg[i].src = this.icons.nocheck
        }
      } else if (cType == 2) {
        for (var i = 0; i < this.$refs.checkImg.length; i++) {
          this.$refs.checkImg[i].src = this.icons.noselect
        }
        this.checkStatusList = []
      }
      this.isChecked = false
      let con = this.content[this.currentIndex]
      if (con.jump) {
        if (Object.keys(con.jump).indexOf(String(this.pickIndex + 1)) >= 0) {
          for (var i in con.jump) {
            if (this.pickIndex + 1 == i) {
              for (let j = this.currentIndex + 1; j < con.jump[i]; j++) {
                if (this.content[j].item_type == 1) {
                  Vue.set(this.resultArr, j, [['', 0]])
                } else if (this.content[j].item_type == 2) {
                  Vue.set(this.resultArr, j, [[[''], 0]])
                } else {
                  Vue.set(this.resultArr, j, [[[''], 0]])
                }
              }
              this.currentIndex = con.jump[this.pickIndex + 1] - 1
            }
          }
        } else {
          this.currentIndex++
        }
      } else {
        this.currentIndex++
      }
      this.pickerTime = ''
    },
    async handlerFinish () {
      let res = await postFinishTest(this.uid, getStore('test_id'), this.resultArr.length, this.resultArr)
      if (res.code == 0) {
        this.hasCompleted = false
        this.getReport()
      } else {
        this.showAlert = true
        this.alertText = res.msg || res.message
      }
    },
    async getReport () {
      let res = await getTestReport(this.uid, getStore('test_id'))
      if (res.data.getPoint) {
        this.increasePoints = true
        this.point = res.data.getPoint
        setTimeout(() => {
          this.increasePoints = false
        }, 2000)
      }
      if (res.code == 0) {
        this.resultStatus = 0
        this.report = res.data.report
        let rdata = await getTestList(this.uid)
        if (rdata.data.list.length >= 1) {
          this.nextScale = false
          this.testScaleId = rdata.data.list[0].test.id
        }
        if (rdata.data.getPoint) {
          this.increasePoints = true
          this.point = res.data.getPoint
          setTimeout(() => {
            this.increasePoints = false
          }, 2000)
        }
      } else {
        this.showAlert = true
        this.alertText = res.msg || res.message
      }
    },
    fillNextScale () {
      this.hasCompleted = true
      this.resultStatus = 2
      this.currentIndex = 0
      this.$router.replace({ path: '/scale/' + this.testScaleId })
    },
    toScale () {
      this.$router.replace('/scale')
    },
    pickTime (item) {
      let cType = this.content[this.currentIndex].item_type
      if (cType == 13) {
        let option = [];
        for (let i = 0; i < 24; i++) {
          let sub = [];
          let children = [];
          for (let j = 0; j < 12; j++) {
            children.push({
              name: j * 5 + '分钟'
            })
          }
          option.push({
            name: i + '小时',
            children: children
          })
        }
        this.$multipicker({
          value: ['0小时', '15分钟'],
          title: '请选择时长',
          option: option,//可以多级嵌套
          change: (value) => {
            console.log(value)
          }
        }).then((value) => {
          this.isChecked = true
          let pickArr = value
          let arr = []
          pickArr.forEach((item, index) => {
            Vue.set(pickArr, index, parseInt(item))
          })
          if (pickArr[0]) {
            if (pickArr[1]) {
              this.pickerTime = pickArr[0] + '小时' + pickArr[1] + '分钟'
            } else {
              this.pickerTime = pickArr[0] + '小时'
            }
          } else {
            this.pickerTime = pickArr[1] + '分钟'
          }
          let minutes = pickArr[0] * 60 + pickArr[1]
          arr.push(minutes, 0)
          this.checkArr.push(arr)
          Vue.set(this.resultArr, this.currentIndex, this.checkArr)
        })
      } else if (cType == 12) {
        let option = [];
        for (var i = 0; i < 21; i++) {
          option.push({
            name: i
          })
        }
        this.$singlepicker({
          // value: '其他',
          title: '请选择次数',
          option: option,
          change: (value) => {
            console.log(value)
          }
        }).then((value) => {
          let pickArr = []
          pickArr.push(value, 0)
          this.pickerTime = value + "次"
          this.isChecked = true
          this.checkArr.push(pickArr)
          Vue.set(this.resultArr, this.currentIndex, this.checkArr)
        }).catch((reason) => {
          console.log('catch:', reason);
        });
      } else {
        let option = [];
        let child = [];
        let children = [];
        const settings = this.content[this.currentIndex].time_settings
        const defaultTimePickerDates = settings.day_names
        const hour = settings.default_value[1] > 9 ? settings.default_value[1] : ('0' + settings.default_value[1])
        const minute = settings.default_value[2] > 9 ? settings.default_value[2] : ('0' + settings.default_value[2])
        for (var j = 0; j <= 11; j++) {
          let quarter = j * 5;
          child.push({ name: quarter > 9 ? quarter : ('0' + quarter) })
        }
        for (var i = 0; i <= 23; i++) {
          children.push({
            name: i > 9 ? i : ('0' + i),
            children: [...child],
          })
        }
        for (var i = 0; i <= 1; i++) {
          option.push({
            name: defaultTimePickerDates[i],
            children: [...children],
          })
        }
        this.$multipicker({
          value: [defaultTimePickerDates[settings.default_value[0]], hour, minute],
          title: '请选择时间',
          option: option,//可以多级嵌套
          change: (value) => {
            console.log(value)
          }
        }).then((value) => {
          this.pickerTime = value.join(":").substr(4)
          this.isChecked = true
          let pickArr = value
          let arr = []
          for (var i = 0; i < defaultTimePickerDates.length; i++) {
            if (pickArr[0] == defaultTimePickerDates[i]) {
              Vue.set(pickArr, 0, i)
            }
          }
          pickArr.forEach((item, index) => {
            Vue.set(pickArr, index, parseInt(item))
          })
          arr.push(pickArr, 0)
          this.checkArr.push(arr)
          Vue.set(this.resultArr, this.currentIndex, this.checkArr)
        })
      }
    },
    updateOnlineStatus (e) {
      const { type } = e;
      this.onLine = type === 'online';
    },
    closeTip () {
      this.showAlert = false
      this.$router.replace('/scale')
    },
    handlerSetValue (item, index) {
      this.range = index
      let pickArr = []
      this.isChecked = true
      pickArr.push(index, 0)
      this.checkArr.push(pickArr)
      Vue.set(this.resultArr, this.currentIndex, this.checkArr)
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
  height: 1.48rem;
  position: relative;
  .desc-text {
    @include fz;
    position: absolute;
    left: 1.5786rem;
    font-size: 0.853rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.87);
    img {
      @include wh(0.853rem, 0.853rem);
      margin-right: 0.1706rem;
    }
    span {
      font-family: PingFangSC-Medium, PingFang SC;
    }
  }
}
.other-scale-desc {
  padding: 0.7523rem 0 1.7253rem 0;
}
.login-content {
  width: 14.6346rem;
  background: #fff;
  border-radius: 0.768rem;
  margin: 0 auto;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
  font-size: 0.6826rem;
  color: #3a3a3a;
  overflow: hidden;
  padding: 0 0.7253rem 0 0.7253rem;
  // margin-bottom: 1.353rem;
  .question {
    color: #116d3b;
    font-size: 0.9386rem;
    font-weight: 400;
    line-height: 1.408rem;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 1.1093rem;
    margin-top: 1.792rem;
    position: relative;
    img {
      width: 1rem;
      height: 1rem;
      position: absolute;
      top: -1rem;
      right: 0;
    }
  }
  .tip-con {
    position: fixed;
    top: 4rem;
    background: #fff;
    z-index: 100;
    width: 12rem;
    padding: 0.8rem;
    font-size: 0.8rem;
    border-radius: 0.4rem;
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.4);
  }
  .pick-time {
    width: 7.3386rem;
    height: 2rem;
    background: #fff;
    box-shadow: 0rem 0.1706rem 0.3413rem 0.128rem rgba(187, 117, 255, 0.3);
    border-radius: 1.024rem;
    border: 2px solid #7f48b4;
    font-size: 0.853rem;
    display: flex;
    align-items: center;
    text-indent: 1.6243rem;
    margin: 0 auto;
    img {
      width: 1em;
      height: 1rem;
    }
  }
  .picked-time {
    width: 13.1413rem;
    text-align: center;
    color: #434343;
    font-size: 1.536rem;
    // position: absolute;
    // top: 10.1546rem;
  }
  .answer {
    font-size: 1.024rem;
    font-weight: 400;
    color: #3a3a3a;
    line-height: 1.706rem;
    display: flex;
    margin-bottom: 0.3413rem;
    div {
      float: left;
      @include wh(1.1093rem, 1.1093rem);
      margin: 0.2rem 0.3413rem 0rem 1.3226rem;
      img {
        @include wh(1.1093rem, 1.1093rem);
      }
    }
    span {
      float: left;
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
    background: #7f48b4;
    box-shadow: 0rem 0.1706rem 0.3413rem 0.128rem rgba(187, 117, 255, 0.3);
  }
  .btn-next {
    bottom: 1.4506rem;
  }
  .unclick {
    background: #b8b8b8;
    box-shadow: 0 0 0;
  }
  .other {
    background: #fff;
    color: #7f48b4;
    border: 2px solid #7f48b4;
    box-shadow: 0rem 0.1706rem 0.3413rem 0.128rem rgba(187, 117, 255, 0.3);
    bottom: 1.6213rem;
  }
  .completed {
    img {
      @include wh(3.968rem, 3.968rem);
      margin-top: 1.152rem;
      margin-left: 4.4373rem;
    }
    .caption {
      @include fc(100%, 2.773rem);
      font-size: 1.28rem;
      font-weight: 500;
      color: #666660;
      line-height: 3.413rem;
      margin-top: 0.426rem;
    }
    .result-head {
      font-size: 1.024rem;
      font-weight: 500;
      color: #116d3b;
      height: 1.536rem;
      line-height: 1.28rem;
      margin-top: 1.3226rem;
      text-align: center;
      border-bottom: 1px solid #b0edcc;
    }
    .result-header {
      font-size: 1.024rem;
      font-weight: 500;
      color: #116d3b;
      line-height: 1.408rem;
      margin-top: 1.3226rem;
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
    .result-other-con {
      color: #3a3a3a;
      font-size: 1.28rem;
      font-weight: 400;
      line-height: 1.7493rem;
      margin-top: 2.8586rem;
      text-align: center;
    }
    .result-last-con {
      color: #116d3b;
    }
    .result-last-con p:last-of-type {
      font-size: 0.853rem;
    }
  }
}
.radio-answer {
  .question {
    margin-bottom: 0.9386rem;
  }
}
.type-result {
  // height: auto;
  .next-question {
    // position: static !important;
    margin: 1.3653rem auto 0;
  }
  .other {
    margin: 0.512rem auto 0.9386rem;
  }
}
.other-type-result {
  // height: 17.2373rem;
}
.abnormal {
  text-align: center;
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
.zp-linelevel {
  width: 13.2rem;
}
.zp-linelevel__title {
  height: 1.3rem;
  line-height: 1.3rem;
  color: rgba(60, 60, 60, 1);
  font-size: 0.8rem;
}
.zp-linelevel__level {
  display: flex;
  border: 1px solid rgba(153, 153, 153, 1);
  border-radius: 0.2rem;
  font-size: 0.7rem;
  color: rgba(51, 51, 51, 1);
}
.zp-linelevel__extreme {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1.4rem;
  font-size: 0.6rem;
  color: rgba(60, 60, 60, 1);
}
.zp-linelevel__level-item {
  width: 1.5rem;
  height: 1.3rem;
  line-height: 1.3rem;
  text-align: center;
}
.zp-linelevel__level-item.is-checked {
  background: rgba(65, 121, 250, 1);
  color: #fff;
}
.zp-linelevel__level-item:first-child {
  border-top-left-radius: 0.15rem;
  border-bottom-left-radius: 0.15rem;
}
.zp-linelevel__level-item:last-child {
  border-top-right-radius: 0.15rem;
  border-bottom-right-radius: 0.15rem;
}
</style>