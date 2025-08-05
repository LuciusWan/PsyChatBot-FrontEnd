import request from '@/utils/request'
import { mockLogin } from './mock'

/**
 * 用户登录
 * @param {Object} loginData - 登录数据
 * @param {string} loginData.username - 用户名
 * @param {string} loginData.password - 密码
 * @param {number} loginData.userType - 用户类型 (0是患者1是医生)
 * @returns {Promise} - 登录结果
 */
export function login(loginData) {
  // 通过环境变量控制是否使用mock数据
  // 如果设置了 VITE_USE_MOCK=true，则使用mock数据
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    console.log('使用Mock数据登录')
    return mockLogin(loginData)
  }
  
  // 使用真实API
  console.log('使用真实API登录')
  return request({
    url: '/login',
    method: 'post',
    data: loginData
  })
}

/**
 * 医生注册
 * @param {Object} registerData - 注册数据
 * @param {string} registerData.username - 用户名
 * @param {string} registerData.password - 密码
 * @param {string} registerData.name - 真实姓名
 * @param {string} registerData.department - 科室
 * @param {string} registerData.phone - 手机号
 * @param {string} registerData.email - 邮箱
 * @returns {Promise} - 注册结果
 */
export function register(registerData) {
  return request({
    url: '/doctor/insert',
    method: 'post',
    data: registerData
  })
}

/**
 * 获取用户信息
 * @returns {Promise} - 用户信息
 */
export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}