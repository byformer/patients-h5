import { ref } from 'vue'
import { OrderType } from '@/enums'
import type { ConsultOrderItem } from '@/types/consuit'
import type { Knowledge, FollowType } from '@/types/consuit'
import { showImagePreview, showSuccessToast, showFailToast } from 'vant'
import { getPrescriptionPic, cancelOrder, follwTaget } from '@/services/consult'

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

export const useCanancelOrder = () => {
  // 取消订单
  const loading = ref(false)
  const onCancelOrder = (item: ConsultOrderItem) => {
    loading.value = true
    cancelOrder(item.id)
      .then((res) => {
        // 修改订单的状态
        item.status = OrderType.ConsultCancel
        item.statusValue = '已取消'
        showSuccessToast('取消成功')
      })
      .catch((err) => {
        showFailToast('取消失败')
      })
      .finally(() => {
        loading.value = false
      })
  }
  return { onCancelOrder, loading }
}
