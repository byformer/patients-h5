import { consultFlagOptions, illnessTimeOptions } from '@/services/contants'
import type { IllnessTime } from '@/enums'
// 获取患病时间文字
export const getIllnessTimeText = (time?: IllnessTime) => {
  return illnessTimeOptions.find((item: any) => item.value === time)?.label
}
// 获取是否就诊文字
export const getConsultFlagText = (flag?: 0 | 1) => {
  return consultFlagOptions.find((item: any) => item.value === flag)?.label
}
