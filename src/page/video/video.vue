<template>
  <div style="padding-bottom: 1.353rem;">
    <add-point v-if="increasePoints"
               :point="point" />
    <div class="scale-desc"
         :class="hasStartAnswer === 0 ? 'other-scale-desc' : hasStartAnswer === 2 ? 'video-scale-desc' : '' ">
      <div v-if="hasStartAnswer === 1"
           class="desc-text">
        <img src="../../images/ic_bullet.png">
        <span v-if="content[currentIndex].item_type == 1">单选题</span>
        <span v-if="content[currentIndex].item_type == 2">多选题</span>
      </div>
      <div v-if="hasStartAnswer === 1"
           class="answer-progress"><span style="font-size:1.024rem;font-weight: 500;">{{ currentIndex+1 }}</span>/{{content.length}}</div>
    </div>
    <div v-if="hasStartAnswer === 0"
         class="login-content video-con">
      <div class="title">{{videoTitle}} </div>
      <div class="video-play">
        <div v-if="isError"
             class="loading">
          <span>视频加载失败</span>
        </div>
        <div v-else-if="isFault&&!isError"
             class="loading">
          <img src="../../images/loading.gif">
          <span>视频加载中...</span>
        </div>
        <div v-else
             id="youkuplayer"
             style="width:100%;height:8.2773rem;"></div>
      </div>
      <button @click="hasStartAnswer = 1"
              class="answer-start next-question"
              :class="{'unclick':!playEnd}"
              :disabled="!playEnd">看完视频后答题</button>
    </div>
    <div v-if="hasStartAnswer === 1"
         class="login-content"
         :class="{'hassubmit': hasSubmit}">
      <div>
        <div class="question">
          <div>{{currentIndex+1}}.</div>
          <div>{{content[currentIndex].title}}</div>
        </div>
        <div v-if="content[currentIndex].item_type == 1">
          <div class="answer"
               ref="checkItem"
               v-for="(option,index) in content[currentIndex].options"
               @click="handlerCheck(index,content[currentIndex])"
               :key="index">
            <div v-if="!hasSubmit"
                 class="answer-icon">{{ letterArr[index] }}.</div>
            <img style="display: none;"
                 class="answer-icon"
                 ref="checkImg"
                 :src="icons.nocheck">
            <span>{{option}}</span>
          </div>
        </div>
        <div v-else>
          <div class="answer"
               ref="checkItem"
               v-for="(option,index) in content[currentIndex].options"
               @click='checkedOne(index,content[currentIndex])'
               :key="index">
            <div v-if="!hasSubmit"
                 class="answer-icon">{{ letterArr[index] }}.</div>
            <img style="display: none;"
                 class="answer-icon"
                 ref="checkImg"
                 :src="icons.nocheck">
            <span>{{option}}</span>
          </div>
        </div>
        <button v-if="!hasSubmit"
                class="next-question btn-next"
                :class="{'unclick':!isChecked}"
                :disabled="!isChecked"
                @click="handlerSubmit">提交</button>
        <button v-if="hasSubmit && !isRightChose && currentIndex !== content.length-1"
                class="next-question btn-next"
                :class="{'unclick':cannotClick}"
                :disabled="cannotClick"
                @click="nextQuestion">下一题</button>
        <button v-if="hasSubmit && !isRightChose && currentIndex === content.length-1"
                class="next-question btn-next"
                :class="{'unclick':cannotClick}"
                :disabled="cannotClick"
                @click="handlerFinish">完成</button>
      </div>
    </div>
    <div v-if="isRightChose"
         class="login-content analyze">
      <div class="line"></div>
      <p class="name">答案解析</p>
      <p class="option">正确答案：<span v-for="(item,index) in videoResultsAnalysis.correct"
              :key="index">{{ letterArr[item] }}</span></p>
      <p class="content">{{ videoResultsAnalysis.analysis }}</p>
      <button v-if="currentIndex !== content.length-1"
              class="next-question btn-next"
              @click="nextQuestion">下一题</button>
      <button v-else
              class="next-question btn-next"
              :class="{'unclick':!isChecked}"
              :disabled="!isChecked"
              @click="handlerFinish">完成</button>
    </div>
    <div v-if="hasStartAnswer === 2"
         class="login-content video-result">
      <h2 class="title">本次答对题目数：<span style="font-size: 1.536rem;">{{ summary.rightNum }}</span></h2>
      <div class="result-data">
        <span class="data-name">错题数</span><span class="data">: {{ summary.errorNum }}</span>
      </div>
      <div class="result-data">
        <span>积&ensp;&ensp;分</span><span class="data">: {{ summary.integral }}</span>
      </div>
      <button @click="$router.replace('/scale')"
              class="next-question button-return">返回</button>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import video from './video.js'
import addPoint from '../../components/common/addPoint'
import { postVideo, postVideoOperation } from '@/service/getData'
import { getStore } from '@/config/mUtils'
export default {
  data () {
    return {
      hasStartAnswer: 0,
      content: [],
      currentIndex: 0,
      pickIndex: null,
      icons: {
        nocheck: require('../../images/ic_close-circle.png'),
        check: require('../../images/check-circle.png'),
        error: require('../../images/error-circle.png'),
        right: require('../../images/right-circle.png')
      },
      letterArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      isChecked: false,
      checkArr: [],//记录选择状态的数组
      resultArr: [],
      point: 0,
      increasePoints: false,
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
      videoTitle: '',
      summary: {
        rightNum: null,
        integral: 0,
        errorNum: null
      },
      playEnd: false, // 看完视频
      isRightChose: false,
      showVideoTip: false,
      alertText: null,
      hasSubmit: false,
      isVideo: false,
      videoId: null,
      opstatus: null,
      cannotClick: false,
      isFault: false,
      isError: false,
      timer: null,
      timeOut: 0,
      videoResultsAnalysis: {
        correct: [],
        analysis: ''
      }
    }
  },
  components: {
    addPoint
  },
  created () {
    this.uid = getStore('uid')
    this.testId = getStore('test_id')
    this.isVideo = getStore('type')
    // this.uid = 1560
    // this.testId = 5048
    // this.isVideo = [0]
  },
  mounted () {
    const self = this
    self.initData()
  },
  methods: {
    async initData () {
      const self = this
      let res = await postVideo(this.testId, JSON.parse(this.isVideo))
      if (res.data.getPoint) {
        this.increasePoints = true
        this.point = res.data.getPoint
        setTimeout(() => {
          this.increasePoints = false
          this.point = 0
        }, 2000)
      }
      if (res.code == 0) {
        this.videoTitle = res.data.video.title
        this.content = res.data.scale_item
        this.videoId = res.data.video.id
        try {
          var player = new YKU.Player('youkuplayer', {
            client_id: 'd9cd24a7c53821e5',
            vid: res.data.video.video_id,
            newPlayer: true,
            events: {
              onPlayEnd: function () {
                self.playEnd = true
              }
            }
          })
          document.getElementById('youkuplayer').style.width = 14.6773 + 'rem'
        } catch (error) {
          this.isFault = true
          this.timer = setInterval(() => {
            this.timeOut++
            if (this.timeOut >= 10) {
              this.isError = true
              clearInterval(this.timer)
            }
            new Promise((resolve, reject) => {
              var player = new YKU.Player('youkuplayer', {
                client_id: 'd9cd24a7c53821e5',
                vid: res.data.video.video_id,
                newPlayer: true,
                events: {
                  onPlayEnd: function () {
                    self.playEnd = true
                  }
                }
              })
              document.getElementById('youkuplayer').style.width = 14.6773 + 'rem'
            }
            ).then(
              (res) => {
                alert()
                this.isError = false
                this.isFault = false
                clearInterval(this.timer)
              },  // 成功
              (err) => { console.log(err) } // 失败
            )
          }, 1000)
        }
      }
    },
    async handlerSubmit () {
      let cType = this.content[this.currentIndex].item_type
      let res = await postVideoOperation(this.uid, this.testId, this.currentIndex + 1, this.resultArr, this.videoId, this.point)
      if (res.code == 0) {
        this.videoResultsAnalysis.correct = res.data.correct
        this.videoResultsAnalysis.analysis = res.data.analysis
        this.summary.rightNum = res.data.right_num
        this.summary.errorNum = res.data.wrong_num
        this.summary.integral = res.data.point
        this.opstatus = res.data.status
      }
      if (res.data.getPoint) {
        this.point += res.data.getPoint
      }
      if (cType == 1) {
        const checkIndex = this.resultArr[this.currentIndex][this.resultArr[this.currentIndex].length - 1][0]
        //获取正确结果
        this.isCorrect(checkIndex)
        this.isRightChose = checkIndex === this.videoResultsAnalysis.correct[0] ? false : true
      }
      if (cType == 2) {
        this.checkStatusList.forEach(item => {
          this.isCorrect(item)
        })
        this.isRightChose = JSON.stringify(this.checkStatusList.sort()) === JSON.stringify(this.videoResultsAnalysis.correct.sort()) ? false : true
      }
      if (!this.isRightChose && this.currentIndex !== this.content.length - 1) {
        this.cannotClick = true
        setTimeout(() => {
          this.nextQuestion()
        }, 500)
      } else if (!this.isRightChose && this.currentIndex === this.content.length - 1) {
        this.cannotClick = true
        setTimeout(() => {
          this.handlerFinish()
        }, 500)
      }
    },
    isRight (checkIndex) {
      return this.videoResultsAnalysis.correct.indexOf(checkIndex) >= 0
    },
    isCorrect (checkIndex) {
      this.hasSubmit = true
      for (var i = 0; i < this.$refs.checkItem.length; i++) {
        this.$refs.checkItem[i].style.background = '#F7F5F5'
        this.$refs.checkImg[i].style.display = 'block'
        if (this.isRight(i)) {
          this.$refs.checkImg[i].src = this.icons.check
        } else {
          this.$refs.checkImg[i].src = this.icons.nocheck
        }
      }
      this.videoResultsAnalysis.correct.forEach(item => {
        this.$refs.checkItem[item].style.background = '#CDFFD6'
      })
      this.checkIcon(checkIndex)
      if (this.checkStatusList.length) {
        this.checkStatusList.forEach(item => {
          this.checkIcon(item)
        })
      }
    },
    //修改选中的状态
    checkIcon (checkIndex) {
      if (this.isRight(checkIndex)) {
        this.$refs.checkImg[checkIndex].src = this.icons.right
      } else {
        this.$refs.checkImg[checkIndex].src = this.icons.error
        this.$refs.checkItem[checkIndex].style.background = '#FFE1E5'
      }
    },
    handlerCheck (index) {
      if (!this.hasSubmit) {
        let pickArr = []
        this.isChecked = true
        this.pickIndex = index
        for (var i = 0; i < this.$refs.checkItem.length; i++) {
          this.$refs.checkItem[i].style.background = '#F7F5F5'
        }
        this.$refs.checkItem[index].style.background = '#CDFFD6'
        pickArr.push(index, 0)
        this.checkArr.push(pickArr)
        Vue.set(this.resultArr, this.currentIndex, this.checkArr)
      }
    },
    checkedOne (index, op) {
      let pickArr = []
      //存在反选
      let sIndex = op.veto ? parseInt(Object.keys(op.veto)[0]) - 1 : null
      // 判断是否选择
      var idIndex = this.checkStatusList.indexOf(index);
      if (op.veto) {
        if (index === sIndex) {
          if (idIndex >= 0) {
            this.$refs.checkItem[sIndex].style.background = '#F7F5F5'
            this.checkStatusList.splice(idIndex, 1)
          } else {
            this.checkStatusList = []
            this.checkStatusList.push(index)
            for (var i = 0; i < this.$refs.checkItem.length; i++) {
              this.$refs.checkItem[i].style.background = '#F7F5F5'
            }
            this.$refs.checkItem[sIndex].style.background = '#CDFFD6'
          }
        } else {
          let noIndex = this.checkStatusList.indexOf(sIndex)
          if (noIndex >= 0) {
            this.checkStatusList.splice(noIndex, 1)
            this.$refs.checkItem[sIndex].style.background = '#F7F5F5'
          }
          if (idIndex >= 0) {
            this.$refs.checkItem[index].style.background = '#F7F5F5'
            // 如果已选, 则去变为非选中状态
            this.checkStatusList.splice(idIndex, 1)
          } else {
            // 选则该项
            this.checkStatusList.push(index)
            this.$refs.checkItem[index].style.background = '#CDFFD6'
          }
        }
      } else {
        if (idIndex >= 0) {
          this.$refs.checkItem[index].style.background = '#F7F5F5'
          // 如果已选, 则去变为非选中状态
          this.checkStatusList.splice(idIndex, 1)
        } else {
          // 选则该项
          this.checkStatusList.push(index)
          this.$refs.checkItem[index].style.background = '#CDFFD6'
        }
      }
      pickArr.push(this.checkStatusList, 0)
      this.checkArr.push(pickArr)
      Vue.set(this.resultArr, this.currentIndex, this.checkArr)
      this.isChecked = this.checkStatusList.length > 0 ? true : false
    },
    nextQuestion () {
      this.hasSubmit = false
      this.isRightChose = false
      this.checkArr = []
      let cType = this.content[this.currentIndex].item_type
      if (cType == 1) {
        for (var i = 0; i < this.$refs.checkItem.length; i++) {
          this.$refs.checkItem[i].style.background = '#F7F5F5'
          this.$refs.checkImg[i].style.display = 'none'
        }
      } else if (cType == 2) {
        for (var i = 0; i < this.$refs.checkItem.length; i++) {
          this.$refs.checkItem[i].style.background = '#F7F5F5'
          this.$refs.checkImg[i].style.display = 'none'
        }
        this.checkStatusList = []
      }
      this.isChecked = false
      this.currentIndex++
      this.cannotClick = false
    },
    handlerFinish () {
      this.hasStartAnswer = 2
      this.hasSubmit = false
      this.isRightChose = false
      if (this.point && this.opstatus == 1) {
        this.increasePoints = true
        setTimeout(() => {
          this.increasePoints = false
        }, 2000)
      }
    },
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.scale-desc {
  padding: 0.7253rem 1.28rem 0.2986rem 1.408rem;
  display: flex;
  justify-content: space-between;
  .desc-text {
    display: flex;
    align-items: center;
    font-size: 0.853rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.87);
    img {
      @include wh(0.853rem, 0.853rem);
      margin-right: 0.1706rem;
    }
  }
  .answer-progress {
    font-size: 0.768rem;
    font-family: PingFangSC-Medium, PingFang SC;
    color: rgba(255, 255, 255, 0.87);
    line-height: 1.408rem;
  }
}
.other-scale-desc {
  padding: 0.7523rem 0 1.7253rem 0;
}
.video-scale-desc {
  padding: 6rem 0 1.7253rem 0;
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
  padding: 0 0.7253rem 1.408rem 0.7253rem;
  .question {
    color: #7f48b4;
    font-size: 1.024rem;
    font-weight: 400;
    line-height: 1.408rem;
    display: flex;
    justify-content: flex-start;
    margin: 0.9386rem 0;
  }
  .pick-time {
    width: 7.3386rem;
    height: 2rem;
    background: #fff;
    box-shadow: 0rem 0.1706rem 0.3413rem 0.128rem rgba(146, 248, 193, 1);
    border-radius: 1.024rem;
    border: 2px solid #7f48b4;
    font-size: 0.853rem;
    display: flex;
    align-items: center;
    text-indent: 1.6243rem;
    margin: 0 auto;
    img {
      width: 0.5973rem;
      height: 0.3413rem;
      margin-left: 0.128rem;
    }
  }
  .picked-time {
    width: 13.1413rem;
    text-align: center;
    color: #434343;
    font-size: 1.536rem;
  }
  .answer {
    font-size: 0.768rem;
    font-weight: 400;
    color: #3a3a3a;
    line-height: 1.2rem;
    display: flex;
    margin-bottom: 0.512rem;
    background: #f7f5f5;
    border-radius: 0.256rem;
    padding: 0.384rem 0.6rem;
    .answer-icon {
      float: left;
      @include wh(0.768rem, 0.768rem);
      margin-right: 0.2rem;
    }
    img {
      margin-top: 0.25rem;
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
    margin: 1.28rem auto 0rem;
    color: #fff;
    background: #09ca61;
    box-shadow: 0rem 0.1706rem 0.3413rem 0.128rem rgba(146, 248, 193, 1);
  }
  .button-return {
    margin-top: 1.8773rem;
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
    box-shadow: 0rem 0.1706rem 0.3413rem 0.128rem rgba(146, 248, 193, 1);
    bottom: 1.6213rem;
  }
}
.video-result {
  height: 13.909rem;
  color: #3a3a3a;
  text-align: center;
  font-size: 0.896rem;
  .title {
    font-size: 1.024rem;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #7f48b4;
    line-height: 1.749rem;
    margin-top: 1.3226rem;
  }
  .result-data {
    width: 9.984rem;
    height: 2.048rem;
    display: flex;
    align-items: center;
    border-radius: 1.024rem;
    border: 1px solid #7f48b4;
    padding-left: 3rem;
    margin: 0.426rem auto 0;
    .integration {
      letter-spacing: 0.896rem;
      margin-right: -0.896rem;
    }
  }
}
.hassubmit {
  margin-bottom: 0 !important;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.2);
}
.analyze {
  width: 14.6346rem;
  background: #fff;
  border-radius: 0.768rem;
  margin: 0 auto;
  box-sizing: border-box;
  font-size: 0.768rem;
  color: #5c5c5c;
  line-height: 1.024rem;
  overflow: hidden;
  padding: 0 0.7253rem 1.408rem 0.7253rem;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.2);
  .line {
    height: 1px;
    background-image: linear-gradient(
      to right,
      #ccc 0%,
      #ccc 30%,
      transparent 30%
    );
    background-size: 10px 3px;
    background-repeat: repeat-x;
  }
  .name {
    font-weight: 500;
    margin-top: 1.024rem;
  }
  .option {
    color: #116d3b;
    font-weight: 500;
    margin-bottom: 0.256rem;
  }
  .content {
    color: #3a3a3a;
    font-size: 0.6826rem;
    line-height: 0.9386rem;
  }
}
.video-con {
  padding: 0;
  padding-top: 0.9813rem;
  margin-top: 1.96rem;
  width: 14.6773rem;
  .title {
    font-size: 1.024rem;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #7f48b4;
    line-height: 1.408rem;
    margin: 0rem 1.067rem 0.853rem 1.1093rem;
  }
  .video-play {
    width: 14.6773rem;
    .loading {
      width: 100%;
      height: 8.277rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 1rem;
        height: 1rem;
      }
    }
  }
  .answer-start {
    width: 8.533rem;
    margin: 1.2373rem auto 1.3657rem;
  }
}
</style>