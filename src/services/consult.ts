import { request } from '@/utils/request'
import type {
  KnowledgeParams,
  KnowledgePage,
  DoctorPage,
  PageParams,
  FollowType
} from '@/types/consuit'

// 文章详情
export const getKnowledgePage = (params: KnowledgeParams) =>
  request<KnowledgePage>('patient/home/knowledge', 'GET', params)

// 关注医生 home/page/doc
export const getDoctorPage = (params: PageParams) =>
  request<DoctorPage>('patient/home/knowledge', 'GET', params)
// 关注目标
export const follwTaget = (id: string | number, type?: FollowType) => {
  request('like', 'POST', { id, type })
}
