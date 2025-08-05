# 专家管理API文档

## 默认返回参数

| 参数名     | 类型     | 说明                |
| ------- | ------ | ----------------- |
| code    | int    | 0代表正常返回,1代表有异常    |
| message | string | 正常为null,有异常就是异常信息 |
| data    | object | 返回的数据             |

## 专家管理接口

### 添加专家信息

| 地址                | 请求方法 |
| ----------------- | ---- |
| /doctor/expert/add | POST |

#### 请求参数

| 参数名                     | 类型         | 说明                          |
| ----------------------- | ---------- | --------------------------- |
| icon                    | file       | 专家头像图片文件（可选）                |
| name                    | string     | 专家姓名                        |
| contactInformationType  | string     | 联系方式类型（如：电话、邮箱、微信等）         |
| contactInformation      | string     | 联系方式                        |
| introduction            | string     | 专家介绍                        |
| field                   | string     | 专业领域                        |
| status                  | string     | 专家状态（默认为active，可选：active、deleted） |

#### 返回参数

| 参数名                     | 类型     | 说明                              |
| ----------------------- | ------ | ------------------------------- |
| id                      | long   | 专家ID                            |
| name                    | string | 专家姓名                            |
| contactInformationType  | string | 联系方式类型                          |
| contactInformation      | string | 联系方式                            |
| introduction            | string | 专家介绍                            |
| icon                    | string | 专家头像URL                         |
| field                   | string | 专业领域                            |
| status                  | string | 专家状态                            |
| createdAt               | string | 创建时间（格式：YYYY-MM-DD HH:MM:SS）   |
| updatedAt               | string | 更新时间（格式：YYYY-MM-DD HH:MM:SS）   |

#### 样例返回结果

```json
{
    "code": 0,
    "message": null,
    "data": {
        "id": 1,
        "name": "张心理医生",
        "contactInformationType": "电话",
        "contactInformation": "13800138000",
        "introduction": "资深心理咨询师，擅长青少年心理问题咨询",
        "icon": "https://web-tlias-lucius.oss-cn-hangzhou.aliyuncs.com/expert-icon-123.jpg",
        "field": "青少年心理",
        "status": "active",
        "createdAt": "2025-01-27 10:30:00",
        "updatedAt": "2025-01-27 10:30:00"
    }
}
```

### 根据ID获取专家信息

| 地址                | 请求方法 |
| ----------------- | ---- |
| /doctor/expert/get | GET  |

#### 请求参数

| 参数名 | 类型   | 说明   |
| --- | ---- | ---- |
| id  | long | 专家ID |

#### 返回参数

同添加专家信息的返回参数

#### 样例返回结果

```json
{
    "code": 0,
    "message": null,
    "data": {
        "id": 1,
        "name": "张心理医生",
        "contactInformationType": "电话",
        "contactInformation": "13800138000",
        "introduction": "资深心理咨询师，擅长青少年心理问题咨询",
        "icon": "https://web-tlias-lucius.oss-cn-hangzhou.aliyuncs.com/expert-icon-123.jpg",
        "field": "青少年心理",
        "status": "active",
        "createdAt": "2025-01-27 10:30:00",
        "updatedAt": "2025-01-27 10:30:00"
    }
}
```

### 获取所有专家信息

| 地址                 | 请求方法 |
| ------------------ | ---- |
| /doctor/expert/list | GET  |

#### 无请求参数

#### 返回参数

返回专家信息数组，每个专家信息的字段同上

#### 样例返回结果

```json
{
    "code": 0,
    "message": null,
    "data": [
        {
            "id": 1,
            "name": "张心理医生",
            "contactInformationType": "电话",
            "contactInformation": "13800138000",
            "introduction": "资深心理咨询师，擅长青少年心理问题咨询",
            "icon": "https://web-tlias-lucius.oss-cn-hangzhou.aliyuncs.com/expert-icon-123.jpg",
            "field": "青少年心理",
            "status": "active",
            "createdAt": "2025-01-27 10:30:00",
            "updatedAt": "2025-01-27 10:30:00"
        },
        {
            "id": 2,
            "name": "李心理专家",
            "contactInformationType": "邮箱",
            "contactInformation": "li.expert@example.com",
            "introduction": "专注于成人焦虑症治疗，有10年临床经验",
            "icon": "https://web-tlias-lucius.oss-cn-hangzhou.aliyuncs.com/expert-icon-456.jpg",
            "field": "成人心理",
            "status": "active",
            "createdAt": "2025-01-27 11:00:00",
            "updatedAt": "2025-01-27 11:00:00"
        }
    ]
}
```

### 根据专业领域查询专家

| 地址                  | 请求方法 |
| ------------------- | ---- |
| /doctor/expert/field | GET  |

#### 请求参数

| 参数名   | 类型     | 说明   |
| ----- | ------ | ---- |
| field | string | 专业领域 |

#### 返回参数

返回专家信息数组，每个专家信息的字段同上

#### 样例返回结果

```json
{
    "code": 0,
    "message": null,
    "data": [
        {
            "id": 1,
            "name": "张心理医生",
            "contactInformationType": "电话",
            "contactInformation": "13800138000",
            "introduction": "资深心理咨询师，擅长青少年心理问题咨询",
            "icon": "https://web-tlias-lucius.oss-cn-hangzhou.aliyuncs.com/expert-icon-123.jpg",
            "field": "青少年心理",
            "status": "active",
            "createdAt": "2025-01-27 10:30:00",
            "updatedAt": "2025-01-27 10:30:00"
        }
    ]
}
```

### 更新专家信息

| 地址                   | 请求方法 |
| -------------------- | ---- |
| /doctor/expert/update | POST |

#### 请求参数

| 参数名                     | 类型         | 说明                          |
| ----------------------- | ---------- | --------------------------- |
| id                      | long       | 专家ID（必填）                    |
| icon                    | file       | 专家头像图片文件（可选）                |
| name                    | string     | 专家姓名（可选）                    |
| contactInformationType  | string     | 联系方式类型（可选）                  |
| contactInformation      | string     | 联系方式（可选）                    |
| introduction            | string     | 专家介绍（可选）                    |
| field                   | string     | 专业领域（可选）                    |
| status                  | string     | 专家状态（可选）                    |

#### 返回参数

同添加专家信息的返回参数

#### 样例返回结果

```json
{
    "code": 0,
    "message": null,
    "data": {
        "id": 1,
        "name": "张心理医生（更新）",
        "contactInformationType": "电话",
        "contactInformation": "13800138001",
        "introduction": "资深心理咨询师，擅长青少年心理问题咨询，更新介绍",
        "icon": "https://web-tlias-lucius.oss-cn-hangzhou.aliyuncs.com/expert-icon-new.jpg",
        "field": "青少年心理",
        "status": "active",
        "createdAt": "2025-01-27 10:30:00",
        "updatedAt": "2025-01-27 14:30:00"
    }
}
```

### 删除专家（软删除）

| 地址                     | 请求方法   |
| ---------------------- | ------ |
| /doctor/expert/delete  | DELETE |

#### 请求参数

| 参数名 | 类型   | 说明   |
| --- | ---- | ---- |
| id  | long | 专家ID |

#### 返回参数

| 参数名     | 类型     | 说明     |
| ------- | ------ | ------ |
| code    | int    | 状态码    |
| message | string | 返回消息   |
| data    | string | 操作结果信息 |

#### 样例返回结果

```json
{
    "code": 0,
    "message": null,
    "data": "删除专家成功"
}
```

### 获取专家总数

| 地址                   | 请求方法 |
| -------------------- | ---- |
| /doctor/expert/count | GET  |

#### 无请求参数

#### 返回参数

| 参数名     | 类型     | 说明     |
| ------- | ------ | ------ |
| code    | int    | 状态码    |
| message | string | 返回消息   |
| data    | long   | 专家总数   |

#### 样例返回结果

```json
{
    "code": 0,
    "message": null,
    "data": 15
}
```

## 错误处理

### 常见错误码

| 错误码 | 说明       |
| --- | -------- |
| 0   | 操作成功     |
| 1   | 操作失败或异常  |

### 常见错误信息

- "添加专家失败：[具体错误信息]"
- "获取专家信息失败：[具体错误信息]"
- "获取专家列表失败：[具体错误信息]"
- "根据专业领域查询专家失败：[具体错误信息]"
- "更新专家信息失败：[具体错误信息]"
- "删除专家失败：[具体错误信息]"
- "获取专家总数失败：[具体错误信息]"
- "专家不存在"

## 注意事项

1. 所有接口都需要登录认证，请在请求头中携带有效的JWT token
2. 图片上传支持常见格式（jpg、jpeg、png、gif等），文件大小限制为5MB
3. 专家状态字段只接受 "active"（激活）和 "deleted"（已删除）两种值
4. 软删除操作不会真正删除数据，只是将状态标记为 "deleted"
5. 查询接口默认只返回状态为 "active" 的专家信息
6. 专业领域查询支持模糊匹配
7. 所有时间字段格式为：YYYY-MM-DD HH:MM:SS