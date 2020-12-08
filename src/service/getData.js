import fetch from '../config/fetch'
import { getStore } from '../config/mUtils'

/**
 * 获取患者关系
 */
export const getRelation = () => fetch('/apply/relation');

/**
 * 获取授权申请状态
 */
export const getApplicationStatus = (uid) => fetch('/apply/index', { uid });

/**
 * 提交授权申请
 */
export const postApplication = (uid, mobile, verifycode, validate_token, role, hospital_id, families_relation, families_mobile) => fetch('/apply/submit', {
  uid,
  mobile,
  verifycode,
  validate_token,
  role,
  hospital_id,
  families_relation,
  families_mobile
}, 'POST');

/**
 * 开始测查
 */
export const postStartTest = (uid, id) => fetch('/test/start', {
  uid,
  id
}, 'POST');

/**
 * 完成测查
 */
export const postFinishTest = (uid, id, current, results) => fetch('/test/finish', {
  uid,
  id,
  current,
  results
}, 'POST');

/**
 * 测查列表
 */
export const getTestList = (uid) => fetch('/test/index', { uid });

/**
 * 测查报告
 */
export const getTestReport = (uid, id) => fetch('/test/report', { uid, id });

/**
 * 测查详情
 */
// export const getTestInfo = (uid, id) => fetch('/test/info', { uid, id });
export const getTestInfo = (id) => fetch('/scale/info', { id }, 'POST');

/**
 * 获取短信验证码
 */
export const mobileCode = (phone, scene) => fetch('/verifycode/send', {
  mobile: phone,
  scene: scene
}, 'POST');

/**
 * 测查历史
 */
export const getTestHistory = (uid) => fetch('/test/history', { uid });

/**
 * 我的信息
 */
export const getUserInfo = (uid) => fetch('/user/info', { uid });

/**
 * 相关知识列表
 */
export const getKnowledgeList = (uid) => fetch('/knowledge/list', { uid });

/**
 * 相关知识横幅
 */
export const getKnowledgeBanner = () => fetch('/knowledge/banner');

/**
 * 相关知识详情
 */
export const postKnowledgeDetails = (uid, cmsItemId) => fetch('/knowledge/createpoint', { uid, cmsItemId }, 'POST');

/**
 * 获取每日记录
 */
export const getRecordsearch = (date, uid) => fetch('/record/search', { date, uid });

/**
 * 获取医嘱信息 Type: 1: 医生 2: 我
 */
export const getEnjoinList = () => fetch('/enjoin/list');

/**
 * 添加医嘱信息
 */
export const postEnjoinCreate = (uid, content) => fetch('/enjoin/create', { uid, content }, 'POST');
