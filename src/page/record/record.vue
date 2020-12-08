<template>
  <div class="record-page">
    <vue-hash-calendar :visible.sync="show_calendar"
                       :showTodayButton="false"
                       format="YY-MM-DD"
                       pickerType="date"
                       :isShowAction="false"
                       :isShowWeekView="true"
                       markType="circle"
                       :markDate="markDateArr"
                       @change="handleDateChange"></vue-hash-calendar>
    <ul class="record-con">
      <li class="record-item">
        <div class="item-head">心情记录</div>
        <div class="item-detail">
          <div class="item-title">请移动圆圈来描述一下今天的总体心情，右边代表兴奋，左边代表抑郁</div>
          <div style="display:flex;align-items:center;">
            <p class="text">抑郁</p>
            <div ref="progress"
                 class="progress"
                 @touchmove="move($event)">
              <div ref="progress_bg"
                   class="progress_bg"
                   @click="handleClick($event)">
                <div ref="progress_bar"
                     class="progress_bar" />
              </div>
              <div ref="vr_btn"
                   class="vr-box"
                   @touchstart="down($event)"
                   @touchend="up">
              </div>
              <div ref="progress_btn"
                   class="progress_btn" />
            </div>
            <p class="text">兴奋</p>
          </div>
          <div v-if="recordForm.hasSubmit"
               class="submitted">{{recordForm.mood}}</div>
          <mytext v-else
                  :hassubmit="canSubmit"
                  :inputInfo.sync="recordForm.mood"
                  :text="text" />
        </div>
      </li>
      <li class="record-item">
        <div class="item-head">服药情况</div>
        <div class="item-detail">
          <div class="item-title">今天您是否已经按时按剂量服药了？或者说有把握会按时按剂量服药？</div>
          <div v-if="recordForm.hasSubmit"
               class="submitted">{{recordForm.drug}}</div>
          <div v-else
               class="my-button"
               @click="handleCheck('drug')">{{buttonText}}</div>
        </div>
      </li>
      <li class="record-item">
        <div class="item-head">感恩日记</div>
        <div class="item-detail">
          <div class="item-title">今天有没有什么人做了什么事帮助、照顾、支持、安慰、关心了你？如果有，那么把这些人和这些事写出来吧。</div>
          <div v-if="recordForm.hasSubmit"
               class="submitted">{{recordForm.diary}}</div>
          <mytext v-else
                  :hassubmit="canSubmit"
                  :inputInfo.sync="recordForm.diary"
                  :text="text" />
        </div>
      </li>
      <li class="record-item">
        <div class="item-head">其他</div>
        <div class="item-detail">
          <div class="items-bottom"
               @click="handleCheck('time')">
            <div class="item-left">感觉自己昨日大约睡了几个小时？</div>
            <div v-if="recordForm.time"
                 class="item-right">{{recordForm.time}}</div>
            <img v-else
                 class="item-right"
                 src="../../images/right-arrow.png">
          </div>
          <div class="items-bottom"
               @click="handleCheck('sport')">
            <div class="item-left">是否运动？</div>
            <div v-if="recordForm.sport"
                 class="item-right">{{recordForm.sport}}</div>
            <img v-else
                 class="item-right"
                 src="../../images/right-arrow.png">
          </div>
          <div class="items-bottom"
               @click="handleCheck('drink')">
            <div class="item-left">有没有吸食咖啡、香烟、酒精、毒品等神经物质？</div>
            <div v-if="recordForm.drink"
                 class="item-right">{{recordForm.drink}}</div>
            <img v-else
                 class="item-right"
                 src="../../images/right-arrow.png">
          </div>
          <div v-if="canSubmit"
               class="my-button"
               style="width:6.186rem;margin-top: 0;"
               @click="handleSubmit">保存记录</div>
        </div>
      </li>
    </ul>
    <alert-tip v-if="showAlert"
               @closeTip="closeTip"
               :alertText="alertText"></alert-tip>
    <foot-nav />
  </div>
</template>
<script>
const defaultForm = {
  date: '',
  happy: 0,
  happyText: '',
  mood: '',
  drug: '',
  diary: '',
  time: '',
  sport: '',
  drink: '',
  hasSubmit: false
}
import footNav from '../../components/footer/nav'
import mytext from '../../components/common/mytext'
import alertTip from '../../components/common/alertTip'
import { setStore, getStore } from '@/config/mUtils'
import { getRecordsearch, postRecordCreate, postRecordUpdate } from '@/service/getData'
export default {
  components: {
    alertTip,
    footNav,
    mytext
  },
  data () {
    return {
      show_calendar: true,
      tag: false,
      left: 0,
      bgleft: 0,
      bgwidth: 0,
      charCur: 0,
      recordForm: {
        date: '',
        happy: 0,
        happyText: '',
        mood: '',
        drug: '',
        diary: '',
        time: '',
        sport: '',
        drink: '',
        hasSubmit: false
      },
      buttonText: '选择',
      text: '你觉得是最近或今天的什么事情让你的心情受到了影响？',
      showAlert: false,
      markDateArr: [],
      currentDate: null,
      dailies: {}
    }
  },
  computed: {
    canSubmit () {
      return this.recordForm.date == this.currentDate
    }
  },
  mounted () {
    this.currentDate = this.getCurrentDate()
    this.getData()
  },
  methods: {
    async getData () {
      let res = await getRecordsearch(this.currentDate, 1)
      if (res.code == 0) {
        if (Object.keys(res.data).length) {
          this.dailies = res.data
          this.recordForm = this.dailies[this.currentDate]
          this.$forceUpdate()
        }
      } else {
        this.showAlert = true
        this.alertText = res.msg || res.message
      }
      setTimeout(() => {
        this.$refs.progress_btn.style.left = this.recordForm.happy + 'px'
        this.$refs.vr_btn.style.left = this.recordForm.happy - 20 + 'px'
        this.$refs.progress_bar.style.width = this.recordForm.happy + 'px'
      }, 0)
    },
    getCurrentDate () {
      var date = new Date()
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return y + '-' + m + '-' + d;
    },
    handleDateChange (date) {
      this.recordForm = defaultForm
      this.recordForm.date = date
      let month = date.split('-')[1]
      if (getStore('month') && month == getStore('month')) {
        if (Object.keys(this.dailies).length) {
          this.recordForm = this.dailies[date] ? this.dailies[date] : defaultForm
        }
      } else {
        setStore('month', month)
        this.getData()
        let dates = Object.keys(this.dailies)
        this.markDateArr = [
          {
            color: 'red',
            date: dates
          }
        ]
      }
      setTimeout(() => {
        this.$refs.progress_btn.style.left = this.recordForm.happy + 'px'
        this.$refs.vr_btn.style.left = this.recordForm.happy - 20 + 'px'
        this.$refs.progress_bar.style.width = this.recordForm.happy + 'px'
      }, 0)
    },
    async handleSubmit () {
      if (this.recordForm.drug.length > 200 || this.recordForm.diary.length > 200) {
        this.showAlert = true
        this.alertText = '字数不能超过200'
        return
      }
      var flag = true
      for (var i in this.recordForm) {
        if (!this.recordForm[i] && this.recordForm[i] !== false) {
          flag = false
          break
        }
      }
      if (flag) {
        if (this.recordForm.hasSubmit) {
          let response = await postRecordUpdate(1, this.currentDate, this.recordForm)
          if (response.code == 0) {
            this.getData()
          } else {
            this.showAlert = true
            this.alertText = response.msg || response.message
          }
        } else {
          this.recordForm.hasSubmit = true
          let res = await postRecordCreate(1, this.recordForm)
          if (res.code == 0) {
            this.getData()
          } else {
            this.showAlert = true
            this.alertText = res.msg || res.message
          }
        }
      } else {
        this.showAlert = true
        this.alertText = '请填写完整记录'
      }
    },
    closeTip () {
      this.showAlert = false
    },
    handleClick (e) {
      if (this.canSubmit) {
        this.canMove = true
        this.bgwidth = this.$refs.progress.offsetWidth
        if (!this.tag) {
          this.bgleft = this.$refs.progress_bg.getBoundingClientRect().left
          this.left = e.pageX - this.bgleft
          if (this.left <= 0) {
            this.left = 0
          } else if (this.left > this.bgwidth) {
            this.left = this.bgwidth
          }
          this.$refs.progress_btn.style.left = this.left + 'px'
          this.$refs.vr_btn.style.left = this.left - 20 + 'px'
          this.$refs.progress_bar.style.width = this.left + 'px'
          this.recordForm.happyText = parseInt((this.left / this.bgwidth) * 100)
          this.recordForm.happy = this.left
        }
      }
    },
    down (e) {
      if (this.canSubmit) {
        this.bgwidth = this.$refs.progress.offsetWidth
        this.canMove = true
        this.ox = e.targetTouches[0].pageX - this.left
        this.tag = true
      }
    },
    move (e) {
      if (this.canSubmit) {
        this.bgwidth = this.$refs.progress.offsetWidth
        if (this.tag) {
          this.left = e.targetTouches[0].pageX - this.ox
          if (this.left <= 0) {
            this.left = 0
          } else if (this.left > this.bgwidth) {
            this.left = this.bgwidth
          }
          this.$refs.progress_btn.style.left = this.left + 'px'
          this.$refs.vr_btn.style.left = this.left - 20 + 'px'
          this.$refs.progress_bar.style.width = this.left + 'px'
          this.recordForm.happyText = parseInt((this.left / this.bgwidth) * 100)
          this.recordForm.happy = this.left
        }
      }
    },
    up () {
      if (this.canSubmit) {
        this.tag = false
      }
    },
    handleCheck (type) {
      if (this.canSubmit) {
        let option = []
        let titles = ''
        if (type == 'drug') {
          option = [
            { name: '是' },
            { name: '否' },
            { name: '不确定' }
          ]
          titles = '选择服药情况'
        } else if (type == 'time') {
          for (var i = 0; i < 25; i++) {
            option.push({ name: i })
          }
          titles = '睡眠时间(小时)'
        } else if (type == 'sport') {
          option = [
            { name: '已做' },
            { name: '计划做' },
            { name: '不好说' }
          ]
          titles = '选择是否运动'
        } else if (type == 'drink') {
          option = [
            { name: '是' },
            { name: '没有' },
            { name: '不确定' }
          ]
          titles = '选择'
        }
        this.$singlepicker({
          title: titles,
          option: option,
          change: (value) => {
            console.log(value)
          }
        }).then((value) => {
          this.buttonText = value
          this.recordForm[type] = value
        }).catch((reason) => {
          console.log('catch:', reason);
        });
      }
    },
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.record-page {
  height: 100vh;
  padding-bottom: 2.56rem;
  overflow: auto;
  background: #fff;
  .record-con {
    margin-top: -1px;
    .record-item {
      .item-head {
        padding-left: 0.68rem;
        background: #b282e0;
        height: 1.536rem;
        width: 100%;
        font-size: 0.68rem;
        color: #fff;
        display: flex;
        align-items: center;
      }
      .item-detail {
        background: #fff;
        padding: 0.6826rem;
        .item-title {
          font-size: 0.6826rem;
          color: #3a3a3a;
          font-weight: 400;
        }
        .items-bottom {
          font-size: 0.6826rem;
          line-height: 1.024rem;
          display: flex;
          justify-content: space-between;
          color: #7f48b4;
          margin-bottom: 0.853rem;
          .item-left {
            width: 83%;
          }
          img.item-right {
            width: 1.024rem;
            height: 1.024rem;
          }
        }
        p.text {
          font-size: 0.512rem;
          padding-top: 0.68rem;
        }
        .my-button {
          width: 4.5653rem;
          height: 2rem;
          color: #7f48b4;
          font-size: 0.768rem;
          margin: 0.68rem auto 0;
          padding: 0.512rem 1.024rem;
          background: #ffffff;
          box-shadow: 0px 3px 6px 3px rgba(187, 117, 255, 0.3);
          border-radius: 24px;
          border: 1px solid #7f48b4;
          @include fz;
        }
        .submitted {
          padding-top: 0.6rem;
          font-size: 0.6826rem;
          color: #0058e3;
        }
      }
    }
  }
}
.progress {
  margin: 0.68rem 0.5rem 0rem 0.8rem;
  position: relative;
  width: 77%;
  .progress_bg {
    height: 10px;
    border-radius: 5px;
    margin-top: 4px;
    overflow: hidden;
    background: linear-gradient(270deg, #b282e0 0%, #8e58c2 39%, #5c179d 100%);
  }
  .progress_bar {
    width: 0;
    height: 10px;
    border-radius: 5px;
  }

  .progress_btn {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    position: absolute;
    background: #af7ede;
    left: 0px;
    margin-left: -10px;
    top: -1px;
    cursor: pointer;
    border: 2px #fff solid;
    box-sizing: border-box;
  }
  .vr-box {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0);
    position: absolute;
    left: -20px;
    top: -10px;
    z-index: 100;
  }
}
</style>