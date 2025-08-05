import request from '@/utils/request'

// 医生信息相关接口

/**
 * 获取医生个人信息
 * @returns {Promise}
 */
export function getDoctorInfo() {
  return request({
    url: '/doctor/get/doctor/info',
    method: 'get'
  })
}

/**
 * 根据医生ID查询医生姓名和职称
 * @param {number} id - 医生ID
 * @returns {Promise}
 */
export function getDoctorInfoById(id) {
  return request({
    url: '/doctor/upload/info',
    method: 'get',
    params: { id }
  })
}

/**
 * 更新医生信息
 * @param {Object} doctorData - 医生信息数据
 * @param {number} doctorData.id - 医生ID
 * @param {string} doctorData.username - 用户名
 * @param {string} doctorData.name - 姓名
 * @param {string} doctorData.title - 职称
 * @param {string} doctorData.department - 科室
 * @param {string} doctorData.phone - 电话
 * @param {string} doctorData.email - 邮箱
 * @param {number} doctorData.status - 状态
 * @returns {Promise}
 */
export function updateDoctorInfo(doctorData) {
  return request({
    url: '/doctor/update/info',
    method: 'post',
    data: doctorData
  })
}

// 文件管理相关接口

/**
 * 上传文件
 * @param {FormData} formData - 包含file和category的表单数据
 * @returns {Promise}
 */
export function uploadFile(formData) {
  return request({
    url: '/doctor/doc/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 查询所有文件
 * @returns {Promise}
 */
export function getFileList() {
  return request({
    url: '/doctor/doc/list',
    method: 'get'
  })
}

/**
 * 根据文件ID查询文件详情
 * @param {number} fileId - 文件ID
 * @returns {Promise}
 */
export function getFileInfo(fileId) {
  return request({
    url: '/doctor/doc/get/info',
    method: 'get',
    params: { fileId }
  })
}

/**
 * 删除文件
 * @param {number} id - 文件ID
 * @returns {Promise}
 */
export function deleteFile(id) {
  return request({
    url: '/doctor/doc/delete/file',
    method: 'delete',
    params: { id }
  })
}

// 试卷管理相关接口

/**
 * 创建试卷
 * @param {Object} paperData - 试卷数据
 * @param {string} paperData.paperName - 试卷名
 * @param {number} paperData.resultType - 作答结果类型
 * @param {string} paperData.applicableGroup - 适用人群
 * @param {string} paperData.description - 试卷描述
 * @param {number} paperData.totalQuestions - 试卷总题数
 * @param {string} paperData.totalScoreRule - 计算得分的规则
 * @returns {Promise}
 */
export function createPaper(paperData) {
  return request({
    url: '/doctor/insert/paper',
    method: 'post',
    data: paperData
  })
}

/**
 * 插入题目
 * @param {Array} questions - 题目数组
 * @param {string} questions[].questionContent - 问题内容
 * @param {number} questions[].questionPaperId - 问卷ID
 * @param {string} questions[].answerType - 回答选项及计分规则
 * @returns {Promise}
 */
export function insertQuestions(questions) {
  return request({
    url: '/doctor/insert/question',
    method: 'post',
    data: questions
  })
}

// 统计数据相关接口

/**
 * 获取试卷数量
 * @returns {Promise}
 */
export function getPaperCount() {
  return request({
    url: '/doctor/get/paper',
    method: 'get'
  })
}

/**
 * 获取题目数量（通过获取所有试卷的题目总数）
 * @returns {Promise}
 */
export function getQuestionCount() {
  return request({
    url: '/doctor/get/paper',
    method: 'get'
  })
}

/**
 * 获取文件数量
 * @returns {Promise}
 */
export function getFileCount() {
  return request({
    url: '/doctor/doc/list',
    method: 'get'
  })
}

/**
 * 获取患者数量
 * @returns {Promise}
 */
export function getPatientCount() {
  return request({
    url: '/doctor/get/patient/info',
    method: 'get'
  })
}

// 医生详细信息相关接口

/**
 * 获取医生自我介绍和优点
 * @returns {Promise}
 */
export function getDoctorDetailInfo() {
  return request({
    url: '/doctor/info/get',
    method: 'get'
  })
}

/**
 * 插入/更新医生的自我介绍和优点
 * @param {Object} detailData - 医生详细信息数据
 * @param {number} detailData.doctorId - 医生ID
 * @param {string} detailData.introduction - 自我介绍
 * @param {string} detailData.advantage - 优点
 * @returns {Promise}
 */
export function updateDoctorDetailInfo(detailData) {
  return request({
    url: '/doctor/info/insert',
    method: 'post',
    data: detailData
  })
}