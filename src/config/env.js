/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */

let baseUrl = '';
let routerMode = 'hash';
let imgBaseUrl = '/img/';
let wxAuthUrl = '';


if (process.env.NODE_ENV == 'development') {
  baseUrl = 'http://adsf.linkwill.cn';
  // wxAuthUrl = 'http://localhost:8586/#/home?openid=oXu2T0vJyLfL_3zt6oR2tBbRuu1E';

} else if (process.env.NODE_ENV == 'production') {
  baseUrl = 'http://adsf.linkwill.cn';
  wxAuthUrl = baseUrl + '/wx/index';
}


export {
  baseUrl,
  routerMode,
  imgBaseUrl,
  wxAuthUrl
}