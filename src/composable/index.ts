import { ref, onMounted } from 'vue'
import { OrderType } from '@/enums'
import type { ConsultOrderItem } from '@/types/consuit'
import type { Knowledge, FollowType } from '@/types/consuit'
import { showImagePreview, showSuccessToast, showFailToast } from 'vant'
import {
  getPrescriptionPic,
  cancelOrder,
  follwTaget,
  deletelOrder
} from '@/services/consult'
import type { OrderDetail } from '@/types/order'
import { getMedicalOrderDetail } from '@/services/order'

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

// 删除订单，删除成功做的事不确定，可以通过函数来实现
export const useDeleteOreder = (cb: (id: string) => void) => {
  const deleteLoading = ref(false)
  const delteteConsultOrder = async (item: ConsultOrderItem) => {
    deleteLoading.value = true
    try {
      await deletelOrder(item.id)
      //  成功，通知父组件删除这条信息，并且提示,详情就是跳转页面
      // emit('on-delete', item.id)
      showSuccessToast('删除成功 ')
      cb && cb(item.id)
    } catch (error) {
      showFailToast('删除失败')
    } finally {
      deleteLoading.value = false
    }
  }
  return { deleteLoading, delteteConsultOrder }
}

export const useOrderDetail = (id: string) => {
  const order = ref<OrderDetail>()
  const loading = ref(false)
  onMounted(async () => {
    loading.value = true
    try {
      const res = await getMedicalOrderDetail(id)
      order.value = res.data
    } finally {
      loading.value = false
    }
  })
  return { loading, order  }
}
