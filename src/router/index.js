import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/login/login'
import scale from '@/page/scale/scale'
import scaleDetails from '@/page/scale/scaleDetails'
import notFound from '@/page/antijump/notfound'
import Complete from '@/page/finished/complete'
import Relate from '@/page/relate/relate'
import infoDetails from '@/page/relate/infoDetails'
import Record from '@/page/record/record'
import User from '@/page/user/user'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    //登录
    {
      path: '/login',
      component: Login
    },
    //量表信息
    {
      path: '/scale',
      component: scale
    },
    //量表内容
    {
      path: '/scale/:id',
      component: scaleDetails
    },
    //已完成量表
    {
      path: '/complete',
      component: Complete
    },
    //相关知识列表
    {
      path: '/record',
      component: Record
    },
    //我的
    {
      path: '/user',
      component: User
    },
    {
      path: '/relate',
      component: Relate
    },
    //相关知识
    {
      path: '/relates',
      component: infoDetails,
      name: 'relates'
    },
    {
      path: '/other',
      component: notFound
    }
  ]
})
