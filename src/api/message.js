import request from '@/utils/request'

/**
 * 查询患者的所有留言
 * @returns {Promise}
 */
export function getAllPatientMessages() {
  return request({
    url: '/doctor/message/all',
    method: 'get'
  })
}

/**
 * 查询患者给自己的所有留言
 * @returns {Promise}
 */
export function getMyPatientMessages() {
  return request({
    url: '/doctor/message/my-messages',
    method: 'get'
  })
}

/**
 * 医生回复患者留言
 * @param {Object} data - 回复数据
 * @param {number} data.messageId - 留言ID
 * @param {string} data.replyContent - 回复内容
 * @returns {Promise}
 */
export function replyToPatientMessage(data) {
  return request({
    url: '/doctor/message/reply',
    method: 'post',
    data
  })
}

/**
 * 设置留言状态
 * @param {Object} data - 状态数据
 * @param {number} data.messageId - 留言ID
 * @param {string} data.status - 状态（待定、批准、拒绝、完成）
 * @returns {Promise}
 */
export function updateMessageStatus(data) {
  return request({
    url: '/doctor/message/status',
    method: 'put',
    params: {
      messageId: data.messageId,
      status: data.status
    }
  })
}

/**
 * 查询该医生的留言数
 * @returns {Promise}
 */
export function getMessageCount() {
  return request({
    url: '/doctor/message/get/num',
    method: 'get'
  })
}

/**
 * 根据留言ID查询留言详细信息
 * @param {number} messageId - 留言ID
 * @returns {Promise}
 */
export function getMessageDetail(messageId) {
  return request({
    url: '/doctor/message/detail',
    method: 'get',
    params: { messageId }
  })
}