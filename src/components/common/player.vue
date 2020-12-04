<template>
  <div class="player-tip">
    <header id='head_top'>
      <section class="head_goclose"
               @click="gotoclose">
        <i class="icon">
          <img src='../../images/icons/ic_close@2x.png' />
        </i>
      </section>
      <section class="title_head">
        <slot name="headTitle"></slot>
      </section>
    </header>
    <section class="curriculum-info player-box">
      <div>
        <div class="day">
          <slot name="title"></slot>
        </div>
        <div class="name">
          <slot name="slogan"></slot>
        </div>
      </div>
      <div class="intro">
        <img :src="imgSrc"
             :style="{animationPlayState:(played?'running':'paused')}" />
      </div>
      <div class="desc">
        <div>
          <slot name="musicDesc"></slot>
        </div>
        <div class="music-name">
          <slot name="relaxName"></slot>
        </div>
      </div>
      <div class="player">
        <div class="controls">
          <audio @canplay='onCanpay'
                 @timeupdate="onTimeupdate"
                 @ended="onEnded"
                 :loop="false"
                 controls
                 ref='myAudio'
                 id="myAudio"
                 style="width: 100%;"></audio>
          <div class="control-item">
            <img src="../../images/icons/ic_backward.png" />
          </div>
          <div class="control-item play-ctrl">
            <i v-if="played && timeNow == 0"
               class="zp-ic pause">
              <img src="../../images/icons/btn_pause_normal@2x.png">
            </i>
            <i v-else
               class="zp-ic"
               :class="playedClass"
               @click="play">
              <img :src="icons[playedClass]">
            </i>
          </div>
          <div class="control-item">
            <img src="../../images/icons/ic_forward.png" />
          </div>
        </div>
        <div class="progress">
          <div class="stime">{{progressCurr}}</div>
          <div class="line">
            <div class="mask"
                 :style="{width: progressRate+'%'}"></div>
            <div class="bar"
                 :style="{left: progressRate+'%'}"></div>
          </div>
          <div class="etime">{{progressDura}}</div>
        </div>
      </div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
    </section>
  </div>
</template>


<script>
import headTop from '../../components/header/head'
// import {
//   postCurriculemStart,
//   postCurriculemFinished,
// } from 'src/service/getData'

export default {
  data () {
    return {
      curriculum: {},
      played: false,
      timeNow: 0,
      timeDuration: undefined,
      patientCourseId: 0,
      icons: {
        play: require('../../images/icons/btn_play_press@2x.png'),
        pause: require('../../images/icons/btn_pause@2x.png'),
      }
    }
  },
  props: ['musicInfo', 'isCurriculum', 'imgSrc'],
  created () {
  },
  destroyed () {
  },
  beforeDestroyed () {
  },
  mounted () {
    this.curriculum = this.musicInfo
    this.$refs.myAudio.src = this.musicInfo.media
  },
  computed: {
    progressCurr () {
      let m = ~~(this.timeNow / 60),
        s = this.timeNow % 60;
      s = s < 10 ? '0' + s : s;
      return m + ':' + s;
    },
    progressDura () {
      if (this.timeDuration) {
        let m = ~~(this.timeDuration / 60),
          s = this.timeDuration % 60;
        s = s < 10 ? '0' + s : s;
        return m + ':' + s;
      }
      return '0:00';
    },
    progressRate () {
      return (this.timeNow / this.timeDuration * 100).toFixed(4)
    },
    playedClass () {
      return this.played
        ? 'pause'
        : 'play'
    }
  },

  methods: {
    // async start () {
    //   let id = this.musicInfo.id;
    //   let res = await postCurriculemStart(id);
    //   console.log('curriculum.start:', id)
    //   if (res) {
    //     if (res.code == 0 && !res.message) {
    //       this.play(1)
    //       this.patientCourseId = res.data.id
    //     } else if (res.data && res.data.redirect == 1) {
    //       this.showAlert = true;
    //       this.alertText = '登录信息已过期，请重新登录';
    //       this.alertHanlder = function () {
    //         this.$router.push('/login');
    //         return
    //       }
    //       return
    //     } else if (res.msg) {
    //       this.showAlert = true;
    //       this.alertText = res.msg;
    //       return
    //     }
    //   }
    // },

    // async finished () {
    //   let id = this.patientCourseId;
    //   let res = await postCurriculemFinished(id);
    //   console.log('curriculum.finished:', id)
    //   if (res) {
    //     if (res.code == 0 && !res.message) {
    //       this.$router.replace({ path: '/encourage/curriculum/' + id })
    //     } else if (res.data && res.data.redirect == 1) {
    //       this.showAlert = true;
    //       this.alertText = '登录信息已过期，请重新登录';
    //       this.alertHanlder = function () {
    //         this.$router.push('/login');
    //         return
    //       }
    //       return
    //     } else if (res.msg) {
    //       this.showAlert = true;
    //       this.alertText = res.msg;
    //       return
    //     }
    //   }
    // },

    play (can) {
      const self = this;
      let player = self.$refs.myAudio;
      if (!player.paused) {
        player.pause()
        this.played = false
      } else {
        player.play()
        this.played = true
      }
    },
    onCanpay () {
      this.timeDuration = parseInt(this.$refs.myAudio.duration);
      if (this.isCurriculum) {
        this.start();
      }
    },
    onTimeupdate: function (res) {
      this.fuck = res.target.currentTime;
      this.timeNow = parseInt(res.target.currentTime)
    },
    onEnded: function () {
      console.log('onEnded')
      if (this.isCurriculum) {
        this.finished();
      }
    },
    gotoclose () {
      this.$emit('gotoclose')
    }
  }
}

</script>

<style lang="scss" scoped>
@import "../../style/mixin";
@import "../../style/play";
#head_top {
  background-color: #427afa;
  @include wh(100%, 2rem);
  position: relative;
  @include fz;
}

.title_head {
  @include sc(0.768rem, #fff);
}

.head_goclose {
  display: flex;
  align-items: center;
  width: 0.81rem;
  height: 2rem;
  line-height: 2rem;
  position: absolute;
  right: 0.6rem;
  > i.icon {
    display: block;
    width: 0.81rem;
    height: 0.81rem;
    > img {
      display: block;
      width: 100%;
    }
  }
}
.player-box {
  padding: 0 0.6rem;
  height: calc(100vh - 2rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:before,
  &:after {
    content: "";
    display: block;
  }
  .day,
  .name,
  .intro,
  .desc,
  .player {
    width: 100%;
  }
  .day {
    margin-top: 0;
  }
  .name {
    margin-top: 0.3rem;
  }
  .intro {
    margin: 0 auto 0.5rem;
    img {
      width: 9rem;
      height: 9rem;
    }
  }
  .player {
    .controls {
      margin-top: 0rem;
    }
  }
  .desc {
    display: none;
  }
}
</style>