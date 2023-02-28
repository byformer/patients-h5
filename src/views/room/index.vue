<script setup lang="ts">
import RoomStatus from './compoenets/roomStatus.vue'
import RoomAction from './compoenets/roomAction.vue'
import RoomMessage from './compoenets/roomMessage.vue'
import { io } from 'socket.io-client'
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { baseURL } from '@/utils/request'
import type { TimeMessages, Message } from '@/types/room'
import useStore from '@/stores'
import { useRoute } from 'vue-router'
import type { Socket } from 'socket.io-client'
import { MsgType, OrderType } from '@/enums'
import type { ConsultOrderItem, Image } from '@/types/consuit'
import { getConsultOrderDetail } from '@/services/consult'
import dayjs from 'dayjs'
import { showToast } from 'vant'
const { user } = useStore()

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
      data.forEach((item: any, i: any) => {
        // 记录消息分组第一组的时间，作为下次获取聊天记录的时间
        if (i === 0) time.value = item.createTime
        arr.push({
          id: item.createTime,
          msgType: MsgType.Notify,
          createTime: item.createTime,
          msg: {
            content: item.createTime
          }
        })
        // arr.push(...item.items)
        item.items.forEach((item: any) => {
          arr.push({ ...item, notScroll: initiaMsg.value === false })
        })
      })
      // 将处理好的数据放置list中
      list.value.unshift(...arr)
      // 关闭加载效果
      loading.value = false
      if (!data.length) {
        showToast('没有聊天记录了 ')
      }
      // 第一次需要滚动到最底部
      nextTick(() => {
        if (initiaMsg.value) {
          // 把默认加载到的消息设置为已读
          socket.emit('updateMsgStatus', arr[arr.length - 1].id)
          window.scrollTo(0, document.body.scrollHeight)
          initiaMsg.value = false
        }
      })
    })
    // 等链接成功来监听事件，注册事件，订单状态变更
    socket.on('statusChange', async () => {
      const res = await getConsultOrderDetail(route.query.orderId as string)
      consult.value = res.data
    })
  })
// 接诊状态的控制
// 1.组件挂载后，需要知道当前的接诊状态
// 2.订单状态变更后，需要只知道已经变化，更新当前接诊状态
// 3. 依赖状态
// 3.1 状态栏需要条件渲染，有倒计时
//  3.2 状态栏 有禁用和启用
const consult = ref<ConsultOrderItem>()
onMounted(async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
})
// 发送文字信息
// 1. 底部操作栏组件，输入信息后需要传入给父组件（index.vue）组件
// 由父组件来发送请求
const sendText = (text: string) => {
  // 根据后台约定发送消息
  socket.emit('sendChatMsg', {
    from: user.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: {
      content: text
    }
  })
  // 接收消息
  socket.on('receiveChatMsg', async (msg: Message) => {
    list.value.push(msg)
    // 是一个promise，等下一帧在执行（等DOM渲染完成）
    await nextTick()
    // 修改消息为已读
    socket.emit('updateMsgStatus', msg.id)
    // 滚动到最低部
    window.scrollTo(0, document.body.scrollHeight)
  })
}

// 发送图片信息
// 1. 底部操作栏组件，上传图片，成功后传递给父组件
// 2. 由父组件来发送消息，通过emit发送消息，sendChatMsg
const sendImage = (img: Image) => {
  // 根据后台约定发送消息
  socket.emit('sendChatMsg', {
    from: user.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: {
      pictures: img
    }
  })
}

// 加载更多聊天记录
// 消息默认滚动到最低部
// 1. 实现下拉刷新效果
// 2. 下拉刷新后，发送一个获取聊天就记录的消息给后台
// 3. 触发聊天记录事件，
// 3.1  判断如果有数据就继续追加到数组，如果没有数据，轻提示没有数据
// 3.2  第二次，第三次....不需要滚动到底部
const initiaMsg = ref(true)
const loading = ref(false)
// 初始化值是当前时间 YYYY-MM-DD HH:mm:ss
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const onRefrsh = () => {
  socket.emit('getChatMsgList', 20, time.value, consult.value?.id)
}
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <RoomStatus :status="consult?.status" :countdown="consult?.countdown" />
    <van-pull-refresh v-model="loading" @refresh="onRefrsh">
      <room-message :list="list"></room-message>
    </van-pull-refresh>
    <room-action
      @send-text="sendText"
      @send-image="sendImage"
      :disabled="consult?.status !== OrderType.ConsultChat"
    />
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
