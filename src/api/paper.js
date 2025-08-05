import request from '@/utils/request'

// 获取试卷列表
export function getPaperList() {
  return request({
    url: '/doctor/get/paper',
    method: 'get'
  })
}

// 根据试卷ID一键查询所有题目（推荐使用）
export function getAllQuestions(paperId) {
  return request({
    url: '/doctor/get/all/question',
    method: 'get',
    params: {
      paperId
    }
  })
}

// 根据试卷ID查询题目ID列表（备用）
export function getPaperQuestions(paperId) {
  return request({
    url: '/doctor/get/paper/question',
    method: 'get',
    params: {
      paperId
    }
  })
}

// 根据题目ID查询题目内容（备用）
export function getQuestionInfo(questionId) {
  return request({
    url: '/doctor/get/question/info',
    method: 'get',
    params: {
      questionId
    }
  })
}