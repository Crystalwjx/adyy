<template>
  <div class="information">
    <add-point v-if="increasePoints"
               :point="point" />
    <div class="title">
      {{list.title}}
    </div>
    <div v-if="list.linkurl"
         class="image">
      <div id="youkuplayer"
           style="width:100%;height:8.2773rem"></div>
    </div>
    <div v-html="list.content"
         class="content"></div>
  </div>
</template>
<script>
import video from '../video/video.js'
import addPoint from '../../components/common/addPoint'
import { getStore } from '@/config/mUtils'
import { postKnowledgeDetails } from '@/service/getData'
export default {
  data () {
    return {
      list: {
        id: null,
        title: '',
        content: '',
        linkurl: ''
      },
      point: 0,
      increasePoints: false
    }
  },
  components: {
    addPoint
  },
  created () {
    this.list = this.$route.params.detail
    let str = this.$route.params.detail.content
    if (str) {
      this.list.content = str.split('<ul').join('<ul style="padding-left: 0.6rem;"').split('<li').join('<li style="margin-left: 0.4rem;"').split('<img').join('<img style="width:100%;border-radius: 0.3413rem;margin:0.8rem 0;"')
    }
  },
  mounted () {
    const self = this
    if (self.list.linkurl) {
      let player = new YKU.Player('youkuplayer', {
        client_id: 'd9cd24a7c53821e5',
        vid: self.list.linkurl,
        newPlayer: true,
        events: {
          onPlayEnd: function () {
            self.initData()
          }
        }
      })
      document.getElementById('youkuplayer').style.width = 14.6773 + 'rem'
    } else {
      self.initData()
    }
  },
  methods: {
    async initData () {
      let res = await postKnowledgeDetails(getStore('uid'), this.list.id)
      if (res.data.getPoint) {
        this.increasePoints = true
        this.point = res.data.getPoint
        setTimeout(() => {
          this.increasePoints = false
        }, 2000)
      }
    }
  },
  destroyed () {
    this.list.content = ''
  }
}
</script>
<style lang="scss" scoped>
.information {
  min-height: 100vh;
  background: #fff;
  padding: 1.067rem 0.64rem 1.067rem 0.6826rem;
  .title {
    color: #116d3b;
    font-size: 0.853rem;
    line-height: 1.1946rem;
    margin-bottom: 0.2133rem;
    font-weight: 500;
  }
  .desc {
    font-size: 0.64rem;
    line-height: 0.896rem;
    color: #3a3a3a;
  }
  .image {
    width: 14.6773rem;
    border-radius: 0.3413rem;
    margin: 0.896rem auto 0.1706rem;
  }
  .subtitle {
    font-size: 0.5973rem;
    font-weight: 500;
    color: #23a798;
    line-height: 0.853rem;
    height: 1.2373rem;
    font-weight: 500;
    margin-bottom: 0.4693rem;
  }
  .content {
    font-size: 0.6826rem;
    line-height: 1.2rem;
    color: #3a3a3a;
    word-wrap: break-word;
  }
}
</style>