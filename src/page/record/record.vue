<template>
  <div class="record-page">
    <vue-hash-calendar :visible.sync="show_calendar"
                       :showTodayButton="false"
                       pickerType="date"
                       :isShowAction="false"
                       :isShowWeekView="true"
                       :scrollChangeDate="false"></vue-hash-calendar>
    <ul class="record-con">
      <li class="record-item">
        <div class="item-head">心情记录</div>
        <div class="item-detail">
          <div class="item-title">请移动圆圈来描述一下今天的总体心情，右边代表兴奋，左边代表抑郁</div>
          <div style="display:flex;align-items:center;">
            <p class="text">抑郁</p>
            <div ref="progress"
                 class="progress">
              <!-- @touchmove="move"> -->
              <div ref="progress_bg"
                   class="progress_bg"
                   @click="handleClick($event)">
                <div ref="progress_bar"
                     class="progress_bar" />
              </div>
              <div ref="vr_btn"
                   class="vr-box">
                <!-- @touchstart="down"
                   @touchend="up"> -->
              </div>
              <div ref="progress_btn"
                   class="progress_btn" />
            </div>
            <p class="text">兴奋</p>
          </div>
          <mytext v-model="recordForm.content"
                  :text="text" />
        </div>
      </li>
      <li class="record-item">
        <div class="item-head">服药情况</div>
        <div class="item-detail">
          <div class="item-title">今天您是否已经按时按剂量服药了？或者说有把握会按时按剂量服药？</div>
          <div class="my-button"
               @click="handleCheck">{{buttonText}}</div>
        </div>
      </li>
      <li class="record-item">
        <div class="item-head">感恩日记</div>
        <div class="item-detail">
          <div class="item-title">今天有没有什么人做了什么事帮助、照顾、支持、安慰、关心了你？如果有，那么把这些人和这些事写出来吧。</div>
          <mytext v-model="recordForm.content"
                  :text="text" />
        </div>
      </li>
      <li class="record-item">
        <div class="item-head">其他</div>
        <div class="item-detail">
          <div class="items-bottom">
            <div class="item-left">感觉自己昨日大约睡了几个小时？</div>
            <img class="item-right"
                 src="../../images/right-arrow.png">
            <!-- <div class="item-right">></div> -->
          </div>
          <div class="items-bottom">
            <div class="item-left">是否运动？</div>
            <img class="item-right"
                 src="../../images/right-arrow.png">
            <!-- <div class="item-right">></div> -->
          </div>
          <div class="items-bottom">
            <div class="item-left">有没有吸食咖啡、香烟、酒精、毒品等神经物质？</div>
            <!-- <div class="item-right">></div> -->
            <img class="item-right"
                 src="../../images/right-arrow.png">
          </div>
          <div class="my-button"
               style="width:6.186rem;margin-top: 0;"
               @click="handleSubmit">保存记录</div>
        </div>
      </li>
    </ul>
    <foot-nav />
  </div>
</template>
<script>
import footNav from '../../components/footer/nav'
import mytext from '../../components/common/mytext'
export default {
  components: {
    footNav,
    mytext
  },
  data () {
    return {
      show_calendar: true,
      canMove: true,
      tag: false,
      left: 0,
      bgleft: 0,
      text: 0,
      bgwidth: 0,
      charCur: 0,
      recordForm: {
        content: '',
        content1: ''
      },
      buttonText: '选择',
      text: '你觉得是最近或今天的什么事情让你的心情受到了影响？',
      hasSubmit: false
    }
  },
  methods: {
    handleSubmit () {
      console.log(this.recordForm)
    },
    handleClick (e) {
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
        this.text = parseInt((this.left / this.bgwidth) * 100)
      }
    },
    handleCheck () {
      let option = [
        { name: '是' },
        { name: '否' },
        { name: '不确定' },
      ]
      this.$singlepicker({
        title: '选择服药情况',
        option: option,
        change: (value) => {
          console.log(value)
        }
      }).then((value) => {
        this.buttonText = value
      }).catch((reason) => {
        console.log('catch:', reason);
      });
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
          .item-right {
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
}
</style>