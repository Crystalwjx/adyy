import Vue from 'vue';

import picker from './picker'
import multipicker from './multipicker'
import singlepicker from './singlepicker'

export default (Vue, options) => {

  Vue.prototype.$picker = picker
  Vue.prototype.$multipicker = multipicker
  Vue.prototype.$singlepicker = singlepicker
}

export { picker, multipicker, singlepicker }