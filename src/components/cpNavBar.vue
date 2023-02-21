<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  title?: string
  rightText?: string
  back?: () => void
}>()
// 点击返回上一个页面
const router = useRouter()
const onClickLeft = () => {
  if (props.back) return props.back()


  // 实现返回
  //   如果有上一个页面的记录，可以执行back返回
  // 没有记录跳转首页
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}

const emit = defineEmits<{
  (e: 'click-right'): void
}>()

const onClickRight = () => {
  // 点击右侧按文字，钮执行的逻辑
  emit('click-right')
}
</script>
<template>
  <van-nav-bar
    left-arrow
    fixed
    @click-left="onClickLeft"
    :title="title"
    :right-text="rightText"
    @click-right="onClickRight"
  ></van-nav-bar>
</template>
<style scoped lang="scss">
::v-deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
