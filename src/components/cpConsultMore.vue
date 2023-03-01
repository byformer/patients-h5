<script setup lang="ts">
import { ref, computed } from 'vue'
const showPopover = ref(false)
// 是否禁用的PROPS
const props = defineProps<{
  disabled?: boolean
}>()
const actions = computed(() => [
  { text: '查看处方', disabled: props.disabled },
  { text: '删除订单' }
])
const emit = defineEmits<{
  (e: 'on-delete'): void
  (e: 'on-preview'): void
}>()
const onSelect = (action: { text: string }, i: number) => {
  // 点击选项
  if (i === i) {
    emit('on-delete')
  }
  if (i === 0) {
    emit('on-preview')
  }
}
</script>
<template>
  <div class="cp--consult-more">
    <van-popover
      placement="top-start"
      v-model:show="showPopover"
      :actions="actions"
      @select="onSelect"
    >
      <template #reference> 更多 </template>
    </van-popover>
  </div>
</template>
<style scoped lang="scss">
.cp--consult-more {
  color: var(--cp-tag);
  flex: 1;
  font-size: 13px;
}
</style>
