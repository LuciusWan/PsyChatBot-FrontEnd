import request from '@/utils/request'

// 添加专家信息
export const addExpert = (data) => {
  const formData = new FormData()
  
  // 添加文件
  if (data.icon) {
    formData.append('icon', data.icon)
  }
  
  // 添加其他字段
  formData.append('name', data.name)
  formData.append('contactInformationType', data.contactInformationType)
  formData.append('contactInformation', data.contactInformation)
  formData.append('introduction', data.introduction)
  formData.append('field', data.field)
  if (data.status) {
    formData.append('status', data.status)
  }
  
  return request.post('/doctor/expert/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 根据ID获取专家信息
export const getExpertById = (id) => {
  return request.get('/doctor/expert/get', {
    params: { id }
  })
}

// 获取所有专家信息
export const getExpertList = () => {
  return request.get('/doctor/expert/list')
}

// 根据专业领域查询专家
export const getExpertsByField = (field) => {
  return request.get('/doctor/expert/field', {
    params: { field }
  })
}

// 更新专家信息
export const updateExpert = (data) => {
  const formData = new FormData()
  
  // 添加ID（必填）
  formData.append('id', data.id)
  
  // 添加文件（可选）
  if (data.icon) {
    formData.append('icon', data.icon)
  }
  
  // 添加其他字段（可选）
  if (data.name) formData.append('name', data.name)
  if (data.contactInformationType) formData.append('contactInformationType', data.contactInformationType)
  if (data.contactInformation) formData.append('contactInformation', data.contactInformation)
  if (data.introduction) formData.append('introduction', data.introduction)
  if (data.field) formData.append('field', data.field)
  if (data.status) formData.append('status', data.status)
  
  return request.post('/doctor/expert/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除专家（软删除）
export const deleteExpert = (id) => {
  return request.delete('/doctor/expert/delete', {
    params: { id }
  })
}

// 获取专家总数
export const getExpertCount = () => {
  return request.get('/doctor/expert/count')
}