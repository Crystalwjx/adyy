<template>
  <div class="relate-info">
    <div class="refresh-moudle"
         @touchstart="touchStart($event)"
         @touchmove="touchMove($event)"
         @touchend="touchEnd($event)"
         :style="{transform: 'translate3d(0,' + top + 'px, 0)'}">
      <header class="pull-refresh">
        <slot name="pull-refresh">
          <div class="down-tip"
               v-if="dropDownState==1">
            <img v-if="dropDownInfo.downImg"
                 class="down-img"
                 :src="require('../../images/'+dropDownInfo.downImg)">
            <span class="refresh-text">{{dropDownInfo.downText}}</span>
          </div>
          <div class="up-tip"
               v-if="dropDownState==2">
            <img v-if="dropDownInfo.upImg"
                 class="up-img"
                 :src="require('../../images/'+dropDownInfo.upImg)">
            <span class="refresh-text">{{dropDownInfo.upText}}</span>
          </div>
          <div class="refresh-tip"
               v-if="dropDownState==3">
            <img v-if="dropDownInfo.refreshImg"
                 class="refresh-img"
                 :src="require('../../images/'+dropDownInfo.refreshImg)">
            <span class="refresh-text">{{dropDownInfo.refreshText}}</span>
          </div>
        </slot>
      </header>
      <slot></slot>
      <div v-if="banner[0].cms.linkurl || banner[0].cms.content"
           @click="toDetails(banner[0].cms)"
           class="image">
        <p v-if="banner[0].title"
           class="title">{{banner[0].title}}</p>
        <img :src="banner[0].imgurl">
      </div>
      <div class="info-list">
        <div v-for="(item,index) in list"
             :key="index"
             class="list-item">
          <h2>{{item[0].catagory_name}}</h2>
          <div v-for="(subitem,subindex) in item"
               :key="subindex"
               class="list-con"
               @click="toDetails(subitem)">
            <div class="img">
              <img v-lazy="subitem.imgurl">
              <img v-if="subitem.type==1"
                   class="icon"
                   src="../../images/icon_video.png">
            </div>
            <div class="title"
                 :class="{'over':!subitem.linkurl}">{{isTooLong(subitem.title)}}</div>
          </div>
        </div>
      </div>
    </div>
    <player v-if="showPlayPage"
            :imgSrc="imgSrc"
            :musicInfo="musicInfo"
            @gotoclose="gotoclose">
    </player>
    <foot-nav></foot-nav>
  </div>
</template>
<script>
import { getKnowledgeList, getKnowledgeBanner } from '@/service/getData'
import footNav from '../../components/footer/nav'
import player from '../../components/common/player'
import { setStore, getStore } from '@/config/mUtils'
export default {
  data () {
    return {
      banner: [
        {
          id: null,
          title: '',
          imgurl: '',
          cms: {
            title: '',
            linkurl: '',
            content: ''
          }
        }
      ],
      list: [],
      bannerIndex: 0,
      timer: null,
      defaultOffset: 30, // 默认高度, 相应的修改.releshMoudle的margin-top和.down-tip, .up-tip, .refresh-tip的height
      top: 0,
      scrollIsToTop: 0,
      startY: 0,
      isDropDown: false, // 是否下拉
      isRefreshing: false, // 是否正在刷新
      dropDownState: 1, // 显示1:下拉可以刷新, 2:松开立即刷新, 3:正在刷新数据中...
      dropDownInfo: {
        downText: '下拉刷新',
        downImg: 'arrow.png',
        upText: '松开刷新',
        upImg: 'arrow.png',
        refreshText: '刷新中...',
        refreshImg: 'arrow.png'
      },
      showPlayPage: false,
      imgSrc: '',
      musicInfo: null,
    }
  },
  components: {
    footNav,
    player
  },
  created () {
    if (document.querySelector('.down-tip')) {
      // 获取不同手机的物理像素（dpr）,以便适配rem
      this.defaultOffset = document.querySelector('.down-tip').clientHeight || this.defaultOffset
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    async initData () {
      const self = this
      let res = await getKnowledgeBanner()
      if (res.code == 0) {
        self.banner = res.data.list
      }
      let rdata = await getKnowledgeList(getStore('uid'))
      if (rdata.code == 0) {
        self.list = rdata.data.list
      }
    },
    toDetails (subitem) {
      if (subitem.type == 3) {
        this.imgSrc = subitem.imgurl
        this.musicInfo = subitem.linkurl
        this.showPlayPage = true
      } else {
        this.$router.push({ name: 'relates', params: { detail: subitem } })
      }
    },
    gotoclose () {
      this.showPlayPage = false
    },
    isTooLong (str) {
      if (str.length >= 35) {
        return str.slice(0, 34) + '...'
      } else {
        return str
      }
    },
    touchStart (e) {
      this.startY = e.targetTouches[0].pageY
    },
    touchMove (e) {
      this.scrollIsToTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop // safari 获取scrollTop用window.pageYOffset
      if (e.targetTouches[0].pageY > this.startY) {
        // 下拉
        this.isDropDown = true
        if (this.scrollIsToTop === 0 && !this.isRefreshing) {
          // 拉动的距离
          let diff = e.targetTouches[0].pageY - this.startY - this.scrollIsToTop
          this.top = Math.pow(diff, 0.8) + (this.dropDownState === 3 ? this.defaultOffset : 0)
          if (this.top >= this.defaultOffset) {
            this.dropDownState = 2
            e.preventDefault()
          } else {
            this.dropDownState = 1
            // 去掉会导致ios无法刷新
            e.preventDefault()
          }
        }
      } else {
        this.isDropDown = false
        this.dropDownState = 1
      }
    },
    touchEnd (e) {
      if (this.isDropDown && !this.isRefreshing) {
        if (this.top >= this.defaultOffset) {
          this.refresh()
          this.isRefreshing = true
        } else {
          this.isRefreshing = false
          this.isDropDown = false
          this.dropDownState = 1
          this.top = 0
        }
      }
    },
    refresh () {
      this.dropDownState = 3
      this.top = this.defaultOffset
      setTimeout(() => {
        this.initData()
        this.refreshDone()
      }, 1200)
    },
    // 刷新完成
    refreshDone () {
      this.isRefreshing = false
      this.isDropDown = false
      this.dropDownState = 1
      this.top = 0
    }
  },
  destroyed () { //eslint-disable-line
    // clearInterval(this.timer)
  }
}
</script>
<style lang="scss" scoped>
.relate-info {
  background: #fff;
  min-height: 100vh;
  padding-bottom: 2.56rem;
  .image {
    width: 100%;
    position: relative;
    .title {
      max-width: 90%;
      min-width: 33%;
      overflow: hidden;
      padding: 0.6rem 0.8rem;
      white-space: nowrap;
      text-align: center;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 0.256rem;
      font-size: 0.896rem;
      color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    img {
      width: 100%;
      min-height: 4.26rem;
      vertical-align: middle;
    }
  }
  .info-list {
    padding: 0 0.64rem 0 0.6826rem;
    .list-item {
      font-size: 0.768rem;
      h2 {
        font-size: 0.768rem;
        padding: 0.7253rem 0 0.256rem 0;
        color: #25b667;
        line-height: 1.067rem;
        border-bottom: 1px solid #b0edcc;
        text-indent: 0.426rem;
        position: relative;
      }
      h2:before {
        content: "";
        width: 3px;
        height: 0.853rem;
        position: absolute;
        top: 0.8rem;
        left: 0;
        background-color: #09ca61;
      }
      .list-con {
        display: flex;
        padding: 0.426rem 0;
        border-bottom: 1px solid #c4f1d9;
        .img {
          width: 5.12rem;
          height: 3.84rem;
          border-radius: 0.3413rem;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            border-radius: 0.3413rem;
          }
          .icon {
            position: absolute;
            width: 1.7rem;
            height: 1.7rem;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
          img[lazy="loading"] {
            background: #ccc;
          }
        }
        .title {
          line-height: 1.067rem;
          color: #3a3a3a;
          flex: 1;
          margin-left: 0.6826rem;
          display: flex;
          align-items: center;
        }
      }
      div.list-con:last-of-type {
        border: 0;
      }
    }
  }
}
.refresh-moudle {
  width: 100%;
  margin-top: -30px;
  -webkit-overflow-scrolling: touch; /* ios5+ */
}

.pull-refresh {
  width: 100%;
  color: #999;
  transition-duration: 200ms;
  font-size: 24px;
}

.refresh-moudle .down-tip,
.up-tip,
.refresh-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
}

.down-img {
  width: 12px;
  height: 12px;
  margin-right: 10px;
  transform: rotate(0deg);
  animation: anticlockwise 0.8s ease;
}

@keyframes anticlockwise {
  0% {
    transform: rotate(-180deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.up-img {
  width: 12px;
  height: 12px;
  margin-right: 10px;
  transform: rotate(180deg);
  animation: clockwise 0.8s ease;
}

@keyframes clockwise {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-180deg);
  }
}

.refresh-img {
  width: 12px;
  height: 12px;
  margin-right: 10px;
  animation: rotating 1.5s linear infinite;
}
.refresh-text {
  font-size: 12px;
}
@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
</style>