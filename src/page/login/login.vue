<template>
  <div>
    <div v-if="!onLine"
         class="abnormal">
      <img src="../../images/ic_network.png">
      <p>请检查您的网络设置</p>
    </div>
    <div style="overflow:hidden;"
         v-else>
      <div class="address-desc">您申请的是：</div>
      <div class="address-info">
        <img src="../../images/ic_location.png">
        <span>{{hospital_name}}</span>
      </div>
      <div v-if="applicationStatus == 0"
           class="login-content">
        <img class="img-service"
             src="../../images/icon_service.png">
        <div class="description">
          <p>请联系您的社区医生</p>
          <p>并耐心等待</p>
          <p>医生为您开通授权</p>
        </div>
      </div>
      <form v-else
            class="login-content"
            onsubmit="return false">
        <section class="input_container phonenum">
          <label>
            <span class="field">手机号:&nbsp;</span>
          </label>
          <input type="text"
                 name="phone"
                 maxlength="11"
                 v-model="userForm.phoneNumber"
                 autocomplete="off" />
        </section>
        <section class="input_container phonecode">
          <label>
            <span class="field">验证码:&nbsp;</span>
          </label>
          <input type="text"
                 name="mobileCode"
                 :style="{borderColor:(isCorrect ? '#ef0202' : '#979797')}"
                 maxlength="6"
                 v-model="userForm.mobileCode"
                 autocomplete="off" />
          <button :class="{isError:isCorrect}"
                  @click="getVerifyCode"
                  v-show="!computedTime">获取验证码</button>
          <button @click.prevent
                  v-show="computedTime">已发送({{computedTime}}s)</button>
        </section>
        <section class="gender-field">
          <label>
            <span class="field">您的身份是：</span>
          </label>
          <div>
            <div class="gender-field-group">
              <input type="radio"
                     id="one"
                     value="1"
                     v-model="userForm.gender" />
              <label for="one">患者</label>
            </div>
            <div class="gender-field-group">
              <input type="radio"
                     id="two"
                     value="2"
                     v-model="userForm.gender" />
              <label for="two">家属</label>
            </div>
          </div>
        </section>
        <section class="input_container relation"
                 v-if="userForm.gender == 2">
          <label>
            <span class="field">与患者的关系：</span>
          </label>
          <div class="con-relation"
               v-html="userForm.relation"
               @click="checkBind"></div>
          <img class="ic-img"
               src="../../images/ic_back.png">
        </section>
        <section class="input_container relation"
                 v-if="userForm.gender == 2">
          <label>
            <span class="field">患者的手机号：</span>
          </label>
          <input type="text"
                 name="phone"
                 :class="{'is-error':patientPhoneIsRight}"
                 maxlength="11"
                 v-model="userForm.patientPhone"
                 autocomplete="off" />
        </section>
        <div v-if="isCorrect || numIsCorrect"
             class="warning">{{alertTitle}}</div>
        <div class="btn-submit"
             :class="userForm.gender==1?canClick?'':'unClick':canClick2?'':'unClick'"
             @click="applyPermission">申请开通权限</div>
      </form>
    </div>
    <foot-info></foot-info>
  </div>
</template>
<script>
import footInfo from '../../components/footer/foot'
import { getRelation, getApplicationStatus, postApplication, mobileCode } from '@/service/getData'
import { setStore, getStore } from '@/config/mUtils'
export default {
  data () {
    return {
      onLine: navigator.onLine,//网络状态
      isCorrect: false,
      numIsCorrect: false,
      phoneIsCorrect: false,//验证患者手机号
      patientPhoneIsRight: false,
      phoneCorrect: false,
      alertTitle: '',
      validate_token: null, //获取短信时返回的验证值，登录时需要
      computedTime: 0, //倒数记时
      userForm: {
        phoneNumber: '',
        mobileCode: '',
        gender: 1,
        patientPhone: '',
        relation: '',
      },
      relationArr: [],
      hospital_id: null,// 医院id
      hospital_name: null,// 医院名称
      uid: null,// 用户id
      applicationStatus: null,//-1=无申请，0=新申请,等待授权，1=通过，2=无效
    }
  },
  components: {
    footInfo
  },
  computed: {
    //判断手机号码
    rightPhoneNumber: function () {
      return /^1\d{10}$/gi.test(this.userForm.phoneNumber)
    },
    rightPatientPhone () {
      return /^1\d{10}$/gi.test(this.userForm.patientPhone)
    },
    canClick () {
      return this.rightPhoneNumber && this.userForm.mobileCode && this.userForm.gender
    },
    canClick2 () {
      return this.userForm.phoneNumber && this.userForm.mobileCode && this.userForm.gender && this.userForm.patientPhone && this.userForm.relation
    }
  },
  created () {
    if (this.$route.query.user_id && this.$route.query.hospital_name && this.$route.query.hospital_id) {
      this.uid = this.$route.query.user_id
      this.hospital_id = this.$route.query.hospital_id
      this.hospital_name = this.$route.query.hospital_name
      setStore('uid', this.$route.query.user_id)
      setStore('hid', this.$route.query.hospital_id)
      setStore('hname', this.$route.query.hospital_name)
    } else {
      this.uid = getStore('uid')
      this.hospital_id = getStore('hid')
      this.hospital_name = getStore('hname')
    }
  },
  mounted () {
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
    document.body.addEventListener('touchstart', function (e) { })
    this.initData()
  },
  methods: {
    async initData () {
      let rData = await getRelation()
      if (rData.code == 0) {
        for (let i in rData.data.relations) {
          this.relationArr.push(rData.data.relations[i]);
        }
      }
      this.getStatus()
    },
    async getVerifyCode () {
      if (this.rightPhoneNumber) {
        this.isCorrect = false
        this.computedTime = 60;
        this.timer = setInterval(() => {
          this.computedTime--;
          if (this.computedTime <= 0) {
            this.computedTime = 0;
            clearInterval(this.timer)
          }
        }, 1000)
      } else {
        this.isCorrect = true
        this.alertTitle = '手机号码错误，请重新输入'
      }
      //发送短信验证码
      let res = await mobileCode(this.userForm.phoneNumber, '109');
      if (res.code == 0 && res.data && res.data.validate_token) {
        this.validate_token = res.data.validate_token
      }
    },
    async getStatus () {
      let res = await getApplicationStatus(this.uid)
      if (res.code == 0) {
        this.applicationStatus = res.data.status
        if (this.applicationStatus == 1) {
          this.$router.replace('/scale')
        }
      }
    },
    async applyPermission () {
      if (this.userForm.gender == 1) {
        if (this.canClick) {
          let res = await postApplication(this.uid, this.userForm.phoneNumber, this.userForm.mobileCode, this.validate_token, this.userForm.gender, this.hospital_id)
          if (res.code == 0) {
            this.isCorrect = false
            this.getStatus()
          } else {
            this.isCorrect = true
            this.alertTitle = res.msg
          }
        }
      } else {
        if (this.canClick2) {
          if (!this.rightPatientPhone) {
            this.patientPhoneIsRight = true
            this.numIsCorrect = true
            this.alertTitle = '手机号码错误，请重新输入'
          } else {
            this.patientPhoneIsRight = false
            switch (this.userForm.relation) {
              case '儿子':
                this.userForm.relation = 1
                break;
              case '女儿':
                this.userForm.relation = 2
                break;
              case '父母':
                this.userForm.relation = 3
                break;
              case '其他':
                this.userForm.relation = 4
                break;
            }
            let res = await postApplication(this.uid, this.userForm.phoneNumber, this.userForm.mobileCode, this.validate_token, this.userForm.gender, this.hospital_id, this.userForm.relation, this.userForm.patientPhone)
            if (res.code == 0) {
              this.isCorrect = false
              this.getStatus()
            } else {
              this.isCorrect = true
              this.alertTitle = res.msg
            }
          }
        }
      }
    },
    checkBind () {
      let option = [];
      for (var i = 0; i < this.relationArr.length; i++) {
        option.push({
          name: this.relationArr[i]
        })
      }
      this.$singlepicker({
        // value: '其他',
        title: '选择关系',
        option: option,
        change: (value) => {
          console.log(value)
        }
      }).then((value) => {
        this.userForm.relation = value
      }).catch((reason) => {
        console.log('catch:', reason);
      });
    },
    updateOnlineStatus (e) {
      const { type } = e;
      this.onLine = type === 'online';
    },
  },
  beforeDestroy () {
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/mixin";
.address-desc {
  height: 0.853rem;
  line-height: 0.853rem;
  font-size: 0.5973rem;
  color: rgba(255, 255, 255, 0.87);
  margin-left: 1.408rem;
  margin-top: 1.706rem;
  font-weight: 400;
}
.address-info {
  margin-left: 1.408rem;
  margin-top: 0.1706rem;
  font-size: 0.853rem;
  color: rgba(255, 255, 255, 0.87);
  font-weight: 500;
  display: flex;
  align-items: center;
  img {
    @include wh(1.024rem, 1.024rem);
  }
  span {
    display: block;
    height: 1.024rem;
    line-height: 1.1946rem;
    margin-left: 0.0853rem;
    font-family: PingFangSC-Medium, PingFang SC;
  }
}
.login-content {
  @include wh(14.6346rem, 17.1946rem);
  background: #fff;
  border-radius: 0.768rem;
  margin: 0.7253rem auto 0;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.4);
  padding: 0 0.9813rem 0 0.9386rem;
  box-sizing: border-box;
  font-size: 0.6826rem;
  color: #3a3a3a;
  overflow: hidden;
  position: relative;
  .input_container {
    @include fz;
    font-weight: 400;
    position: relative;
  }
  .phonenum {
    margin-top: 1.8346rem;
    input[type="text"] {
      @include wh(10.1973rem, 1.536rem);
      font-size: 0.6826rem;
      color: #5c5c5c;
      background-color: transparent;
      padding-left: 0.384rem;
      outline: none;
      border-radius: 0.1706rem;
      border: 1px solid #979797;
    }
  }
  .phonecode {
    margin-top: 0.426rem;
    input[type="text"] {
      @include wh(5.76rem, 1.536rem);
      color: #5c5c5c;
      background-color: transparent;
      font-size: 0.6826rem;
      padding-left: 0.384rem;
      outline: none;
      border-radius: 0.1706rem;
      border: 1px solid #979797;
    }
    button {
      @include sc(0.5973rem, #fff);
      border-radius: 0.1706rem;
      border: 1px solid #b27de6;
      border-radius: 0.1706rem;
      background-color: #b27de6;
      @include wh(4.1813rem, 1.536rem);
      margin-left: 0.256rem;
    }
    .isError {
      border: 0;
      background: #ef0202;
    }
  }
  .gender-field {
    height: 0.896rem;
    line-height: 0.896rem;
    margin-top: 1.6213rem;
    position: relative;
    .gender-field-group {
      position: absolute;
      top: 0;
      left: 4.906rem;
    }
    div.gender-field-group:last-of-type {
      left: 8.576rem;
    }
  }
  .is-error {
    border-color: #ef0202 !important;
  }
  .relation {
    margin-top: 0.5546rem;
    input[type="text"],
    .con-relation {
      @include wh(7.808rem, 1.536rem);
      line-height: 1.4506rem;
      color: #474747;
      font-size: 0.853rem;
      background-color: transparent;
      padding-left: 0.384rem;
      outline: none;
      border-radius: 0.1706rem;
      border: 1px solid #979797;
    }
    input[type="text"] {
      font-size: 0.6826rem;
    }
    .ic-img {
      @include wh(0.512rem, 0.2986rem);
      position: absolute;
      right: 0.426rem;
      top: 0.64rem;
    }
  }
  section.relation:last-of-type {
    margin-top: 0.384rem !important;
  }
  .warning {
    width: 12.7146rem;
    text-align: center;
    font-size: 0.768rem;
    color: #ef0202;
    position: absolute;
    bottom: 4.266rem;
  }
  .btn-submit {
    @include fc(7.3386rem, 2.0053rem);
    box-shadow: 0px 4px 8px 3px rgba(187, 117, 255, 0.3);
    border-radius: 1.024rem;
    color: #fff;
    background: #7f48b4;
    position: absolute;
    bottom: 1.664rem;
    left: 3.626rem;
  }
  .unClick {
    background: #b8b8b8;
    box-shadow: 0 0 0;
  }
  .img-service {
    @include wh(4.608rem, 4.608rem);
    margin-top: 3.1573rem;
    margin-left: 4.096rem;
  }
  .description {
    margin-top: 2.091rem;
    p {
      width: 100%;
      text-align: center;
      color: #3a3a3a;
      font-size: 1.024rem;
      line-height: 1.408rem;
      font-weight: 500;
    }
  }
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
</style>