import axios, { type Method } from 'axios'
import { showToast } from 'vant'
import useStore from '@/stores'
import router from '@/router'

type Data<T> = {
  code: number
  message: string
  data: T
}
const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
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
    if (err.response.status === 401) {
      const { user } = useStore()
      user.delUser()
      // 跳转登录
      router.push({
        path: '/login',
        query: { returnUrl: router.currentRoute.value?.fullPath }
      })
    }
    return Promise.reject(err)
  }
)

const request = <T>(
  url: string,
  method: string = 'get',
  submitData?: Object
) => {
  return instance.request<T, Data<T>>({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
export { baseURL, instance, request }
