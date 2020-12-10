 <template>
  <div class="alet_container">
    <div class="alet_box">
      <div class="alet_option">
        <span @click="closeDtip">取消</span>
        <span style="color:#7f48b4;font-weight:600;"
              @click="handleSubmit">发送</span>
      </div>
      <textarea v-model="order"
                class="alet_text"></textarea>
      <div class="alet_len">{{order.length}}/200</div>
    </div>
    <alert-tip v-if="showAlert"
               @closeTip="closeTip"
               :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
import { postEnjoinCreate } from '@/service/getData'
import alertTip from './alertTip'
import { getStore } from '@/config/mUtils'

export default {
  components: {
    alertTip
  },
  data () {
    return {
      showAlert: false,
      alertText: null,
      order: ''
    }
  },
  mounted () {

  },
  methods: {
    async handleSubmit () {
      if (this.order.length > 200) {
        this.showAlert = true
        this.alertText = '字数不能超过200'
      } else {
        let res = await postEnjoinCreate(getStore('uid'), this.order)
        if (res.code == 0) {
          this.closeDtip()
        } else {
          this.showAlert = true
          this.alertText = res.msg || res.message
        }
      }
    },
    closeDtip () {
      this.$emit('closeDtip')
    },
    closeTip () {
      this.showAlert = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
.alet_container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  .alet_box {
    width: 91.7%;
    height: 11.1rem;
    background: #e7dbf3;
    border-radius: 0.768rem;
    padding: 0.5546rem;
    .alet_option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 1.7rem;
      font-size: 0.6826rem;
      color: #777777;
      padding: 0rem 0.256rem;
    }
    .alet_text {
      @include wh(100%, 7.168rem);
      padding: 0.384rem;
      font-size: 0.768rem;
      font-weight: 400;
      color: #3a3a3a;
      line-height: 1.067rem;
      overflow-y: auto;
    }
    .alet_len {
      display: flex;
      justify-content: flex-end;
      color: #9574b7;
      line-height: 0.853rem;
      font-size: 0.6rem;
    }
  }
}
</style>
