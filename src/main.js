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
Vue.use(vuePicker)
Vue.use(VueLazyload)
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
