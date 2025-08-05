// 模拟API响应，用于开发测试
export const mockLogin = (loginData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟登录验证
      if (loginData.username === 'doctor1' && loginData.password === '123456' && loginData.userType === 1) {
        resolve({
          code: 0,
          message: null,
          data: {
            id: 1,
            userName: 'doctor1',
            name: '张医生',
            token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsImV4cCI6MTc1Mzk0MDUwOH0.3HPgPhITe0bSN8iuwnYFCkNcCnFxLjbkcspoIbRla_w'
          }
        })
      } else {
        reject({
          response: {
            data: {
              code: 1,
              message: '用户名或密码错误'
            }
          }
        })
      }
    }, 1000) // 模拟网络延迟
  })
}

// 模拟获取医生信息
export const mockGetDoctorInfo = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        message: null,
        data: {
          id: 1,
          username: 'doctor1',
          name: '张医生',
          title: '主任医师',
          department: '心理科',
          phone: '13800138001',
          email: 'doctor1@example.com',
          status: 0
        }
      })
    }, 500) // 模拟网络延迟
  })
}