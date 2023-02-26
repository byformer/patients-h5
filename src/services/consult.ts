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
  ConsultOrderPreData
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
