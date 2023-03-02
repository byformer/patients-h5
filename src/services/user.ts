// 用户相关接口请求
import type { User, CodeType, UserInfo, Patient } from '@/types/user'
import { request } from '@/utils/request'

// 密码登录
export const loginByPassword = (mobile: string, password: string) =>
  request<User>('login/password', 'POST', { mobile, password })

// 发送验证码
export const sendMobileCode = (mobile: string, type: CodeType) =>
  request('/code', 'GET', { mobile, type })
// 短信登录
export const loginByMobile = (mobile: string, code: string) =>
  request<User>('/login', 'POST', { mobile, code })

export const getUserInfo = () => request<UserInfo>('patient/myUser')

export const getPatientList = () => request<Patient[]>('patient/mylist')

// 添加患者
export const addPatient = (patient: Patient) =>
  request('patient/add', 'POST', patient)
// 编辑患者
export const updatePatient = (patient: Patient) =>
  request('patient/update', 'PUT', patient)
// 删除患者
export const deletePatient = (id: string) =>
  request(`patient/del/${id}`, 'DELETE')

export const getPatientDtial = (id: string) =>
  request<Patient>(`patient/info/${id}`)
// qq登录
export const loginByQQ = (openId: string) =>
  request<User>('/login/thirdparty', 'POST', { openId, source: 'qq' })
// 绑定
export const bindMobile = (data: {
  mobile: string
  code: string
  openId: string
}) => request<User>('/login/binding', 'POST', data)
