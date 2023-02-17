import type { FieldRule } from 'vant'

// 表单效验
const mobileRules: FieldRule[] = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
]
const passwordeRules: FieldRule[] = [
  { required: true, message: '请输入密码' },
  { pattern: /^\w{8,24}$/, message: '密码需要8-24位字符' }
]

export { mobileRules, passwordeRules }
