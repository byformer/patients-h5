<script setup lang="ts">
import RoomStatus from './compoenets/roomStatus.vue'
import RoomAction from './compoenets/roomAction.vue'
import RoomMessage from './compoenets/roomMessage.vue'
import { io } from 'socket.io-client'
import { onMounted, onUnmounted } from 'vue'
import { baseURL } from '@/utils/request'
import useStore from '@/stores'
import { useRoute } from 'vue-router'
import type { Socket } from 'engine.io-client'
const { user } = useStore()
const route = useRoute()
// 1. 建立连接
//    安装socket.io-lient
//    组件挂载完成，建立连接，组件挂载，关闭连接
let socket: Socket
onUnmounted(() => {
  socket.close()
}),
  onMounted(() => {
    socket = io(baseURL, {
      //身份验证
      auth: {
        token: `Bearer ${user.user?.token}`
      },
      // 订单id
      query: {
        orderId: route.query.orderId
      }
    })
    //   连接成功 connect 固定
    socket.on('connect', () => {
      console.log('连接成功')
    })
    socket.on('disconnect', () => {
      console.log('断开连接')
    })
    socket.on('error', (error) => {
      console.log('发生错误', error)
    })
  })
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <RoomStatus />
    <room-message></room-message>
    <room-action />
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);
  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
