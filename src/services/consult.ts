import { request } from '@/utils/request'
import type {
  KnowledgeParams,
  KnowledgePage,
  DoctorPage,
  PageParams,
  FollowType,
  TopDep,
  Image,
  ConsultOrderPreParams,
  ConsultOrderPreData,
  PartialConsult,
  ConsultOrderItem,
  ConsultOrderListParams,
  ConsultOrderPage
} from '@/types/consuit'

// 文章详情
export const getKnowledgePage = (params: KnowledgeParams) =>
  request<KnowledgePage>('patient/home/knowledge', 'GET', params)

// 关注医生 home/page/doc
export const getDoctorPage = (params: PageParams) =>
  request<DoctorPage>('patient/home/knowledge', 'GET', params)
// 关注目标
export const follwTaget = (id: string | number, type: FollowType = 'doc') => {
  request('like', 'POST', { id, type })
}

export const getAllDep = () => request<TopDep[]>('dep/all')
// 上传图片
export const uploadImage = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return request<Image>('upload', 'POST', fd)
}

// 获取生成订单信息
export const getConsultOrderPre = (params: ConsultOrderPreParams) =>
  request<ConsultOrderPreData>('patient/consult/order/pre', 'GET', params)

// 生成订单
export const createConsultOrder = (data: PartialConsult) =>
  request<{ id: string }>('/patient/consult/order', 'POST', data)

// 生成支付地址
export const getConsultOrderPay = (data: {
  paymentMethod: 0 | 1
  orderId: string
  payCallback: string
}) => request<{ payUrl: string }>('patient/consult/pay', 'POST', data)

// 订单详情
export const getConsultOrderDetail = (orderId: string) =>
  request<ConsultOrderItem>('patient/consult/order/detail', 'GET', { orderId })

// 查看处方
export const getPrescriptionPic = (id: string) =>
  request<{ url: string }>(`/patient/consult/prescription/${id}`)

// 提交评价

export const evaluateConsultOrder = (data: {
  docId: string
  orderId: string
  score: number
  content: string
  anonymousFlag: 0 | 1
}) => request<{ id: string }>('/patient/order/evaluate', 'POST', data)

// 问诊记录分页查询

export const getConsultOrderList = (params: ConsultOrderListParams) =>
  request<ConsultOrderPage>('/patient/consult/order/list', 'GET', params)
// 取消订单
export const cancelOrder = (id: string) =>
  request(`/patient/order/cancel/${id}`, 'PUT')
// 删除订单
export const deletelOrder = (id: string) =>
  request(`/patient/order/${id}`, 'DELETE')
