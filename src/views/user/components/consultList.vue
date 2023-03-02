<script setup lang="ts">
import type { ConsultType } from '@/enums'
import ConsultItem from './consultItem.vue'
import { ref } from 'vue'
import type { ConsultOrderItem, ConsultOrderListParams } from '@/types/consuit'
import { getConsultOrderList } from '@/services/consult'
// 1. 准备好查询参数
// 2. 实现加载更多效果
// 3. 触发加载更多操作时，发请求获取数据
// 4. 拿到后台数据后：
// 4.1  有数据，追加列表
// 4.2  无数据，置为完成
// 5. 渲染
const props = defineProps<{
  type: ConsultType
}>()
const params = ref<ConsultOrderListParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})
const list = ref<ConsultOrderItem[]>([])
const loading = ref(false)
const finished = ref(false)
// 不满一屏
const onload = async () => {
  const res = await getConsultOrderList(params.value)
  list.value.push(...res.data.rows)
  loading.value = false
  if (params.value.current < res.data.pageTotal) {
    // 准备下一页页码
    params.value.current++
  } else {
    // 加载完成
    finished.value = true
  }
}
// 删除一条订单
const onDelete = (id: string) => {
  // const index = list.value.find((item) => item.id === id)
  // list.value.splice(index, 1)
  list.value = list.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onload"
    >
      <consult-item
        @on-delete="onDelete"
        v-for="item in list"
        :key="item.id"
        :item="item"
      ></consult-item>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>
