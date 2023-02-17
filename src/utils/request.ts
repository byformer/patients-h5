import axios from 'axios'
import { showToast } from 'vant'
import useStore from '@/stores'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL: 'https://consult-api.itheima.net/',
  timeout: 5000
})

instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const { user } = useStore()
    if (user.user?.token && config.headers) {
      config.headers.Authorization = `Bearer ${user.user.token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    // status是200则表示响应成功
    // 如果不是 10000则给用户提示
    // TODO 3. 处理业务失败
    if (res.data.code !== 10000) {
      showToast(res.data.message || '网络异常')
      return Promise.reject(res.data)
    }

    // TODO 4. 摘取核心响应数据h
    return res.data
  },
  (err) => {
    // TODO 5. 处理401错误
    return Promise.reject(err)
  }
)

export default instance
