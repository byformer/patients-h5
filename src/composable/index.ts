import { ref } from 'vue'
import { follwTaget } from '@/services/consult'
import type { Knowledge, FollowType } from '@/types/consuit'
import { showImagePreview } from 'vant'
import { getPrescriptionPic } from '@/services/consult'
export const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  const follow = async (item: Knowledge) => {
    try {
      loading.value = true
      await follwTaget(item.id, type)

      item.likeFlag = item.likeFlag === 1 ? 0 : 1
    } finally {
      loading.value = false
    }
  }
  return { loading, follow }
}

export const usePreviewPrescription = () => {
  // 查看处方
  const showPrescription = async (id?: string) => {
    if (id) {
      const res = await getPrescriptionPic(id)

      showImagePreview([res.data.url])
    }
  }
  return { showPrescription }
}
