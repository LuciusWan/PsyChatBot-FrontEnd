import request from '@/utils/request'

/**
 * 查询患者信息
 * @returns {Promise} - 患者列表
 */
export function getPatientList() {
  return request({
    url: '/doctor/get/patient/info',
    method: 'get'
  })
}