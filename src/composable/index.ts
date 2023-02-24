import { ref } from 'vue'
import { follwTaget } from '@/services/consult'
import type { Knowledge, FollowType } from '@/types/consuit'
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
