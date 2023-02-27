<script setup lang="ts">
import RoomStatus from './compoenets/roomStatus.vue'
import RoomAction from './compoenets/roomAction.vue'
import RoomMessage from './compoenets/roomMessage.vue'
import { io } from 'socket.io-client'
import { onMounted, onUnmounted } from 'vue'
import { baseURL } from '@/utils/request'
import type { TimeMessages, Message } from '@/types/room'
import useStore from '@/stores'
import { useRoute } from 'vue-router'
import type { Socket } from 'socket.io-client'
import { MsgType } from '@/enums'
// import dayjs from 'dayjs'
import { ref } from 'vue'
const { user } = useStore()
// 初始化值是当前时间 YYYY-MM-DD HH:mm:ss
// const initialMsg = ref(true)
// const loading = ref(false)
// const time = ref(dayjs().format('YYY-MM-DD HH:mm:ss'))
const route = useRoute()
// 1. 建立连接
//    安装socket.io-lient
//    组件挂载完成，建立连接，组件挂载，关闭连接
let socket: Socket
const list = ref<Message[]>([])
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
      // 默认一个空的聊天数组
      list.value = []
      console.log('连接成功')
    })
    socket.on('disconnect', () => {
      console.log('断开连接')
    })
    socket.on('error', (error) => {
      console.log('发生错误', error)
    })
    // 聊天记录
    // 绑定消息事件
    // 拿到消息列表之后处理消息列表
    socket.on('chatMsgList', ({ data }: { data: TimeMessages }) => {
      // 处理消息：分组的时间自己组织一条通用消息，items取出来放后面
      const arr: Message[] = []
      data.forEach((item: any) => {
        // 记录消息分组第一组的时间，作为下次获取聊天记录的时间
        // if (i === 0) time.value = item.createTime
        arr.push({
          id: item.createTime,
          msgType: MsgType.Notify,
          createTime: item.createTime,
          msg: {
            content: item.createTime
          }
        })
        arr.push(...item.items)
        // item.items.forEach((item: Message) => {
        //   // eslint-disable-next-line no-undef
        //   arr.push({ ...item, notScroll: initialMsg.value === false })
        // })
      })
      // 将处理好的数据放置list中
      list.value.unshift(...arr)
    })
  })
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <RoomStatus />
    <room-message :list="list"></room-message>
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
