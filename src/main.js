// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import './config/rem'
import 'font-awesome/scss/font-awesome.scss'
import { getStore } from '@/config/mUtils'
import { getApplicationStatus } from '@/service/getData'
import router from './router'
import vuePicker from './vue-picker'
import VueLazyload from 'vue-lazyload'
import vueHashCalendar from 'vue-hash-calendar'
// 引入组件CSS样式
import 'vue-hash-calendar/lib/vue-hash-calendar.css'
// 注册组件库
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.use(vueHashCalendar)
Vue.use(vuePicker)
Vue.use(VueLazyload)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
