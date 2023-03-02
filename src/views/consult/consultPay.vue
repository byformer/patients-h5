<script setup lang="ts">
import { getConsultOrderPre, createConsultOrder } from '@/services/consult'
import useStore from '@/stores'
import type { ConsultOrderPreData } from '@/types/consuit'
import type { Patient } from '@/types/user'
import { getPatientDtial } from '@/services/user'
import { ref, onMounted } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import { onBeforeRouteLeave } from 'vue-router'
import router from '@/router'
// 获取订单相关信息
const { consult } = useStore()
const payInfo = ref<ConsultOrderPreData>()
const loadPayInfo = async () => {
  const res = await getConsultOrderPre({
    type: consult.consult.type,
    illnessType: consult.consult.illnessType
  })
  payInfo.value = res.data
}
const patient = ref<Patient>()
const loadPatient = async () => {
  if (consult.consult.patientId) {
    const res = await getPatientDtial(consult.consult.patientId)
    patient.value = res.data
  }
}
onMounted(() => {
  // 判断是否没有了问诊信息(已经生成了订单，本地清空了)
  // if (
  //   !consult.consult.type ||
  //   !consult.consult.illnessType ||
  //   !consult.consult.depId ||
  //   !consult.consult.patientId
  // ) {
  //   return showDialog({
  //     title: '温馨提示',
  //     message:
  //       '问诊信息不完成请重新填写，如有未支付的问诊订单可在问诊记录中继续支付',
  //     closeOnPopstate: false
  //   }).then(() => {
  //     router.push('/')
  //   })
  // }
  loadPayInfo()
  loadPatient()
})

const agree = ref(false)
const loading = ref(false)
const show = ref(false)
const orderId = ref('')
// const paymentMethod = ref<0 | 1>()
const submit = async () => {
  if (!agree.value) return showToast('请勾选我已同意支付协议')
  loading.value = true
  const res = await createConsultOrder(consult.consult)
  orderId.value = res.data.id
  loading.value = false
  consult.clear()
  // 打开
  show.value = true
}
// 进行支付
// 1. 隐藏抽屉按钮的关闭
// 2. 再关闭抽屉的时候，来个确认框提示，仍要关闭，问诊记录 ，继续支付 ，关闭确认框
// 3. 如果已经生成订单了回退的时候需要拦截
// 4. 生成支付地址跳转，调后台的接口
// 5. 刷新页面的时候，判断问诊记录是否存在，不存在就alert提示，确认之后回到首页
const onClose = () => {
  return showConfirmDialog({
    title: '温馨提示',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付',
    confirmButtonColor: 'var(--cp-primary)'
  })
    .then(() => {
      // 不想关闭抽屉
      return false
    })
    .catch(() => {
      orderId.value = ''
      router.push('/user/consult')
      return true
    })
}
onBeforeRouteLeave(() => {
  // 离开当前路由
  if (orderId.value) return false
})
// const pay = async () => {
//   if (paymentMethod.value === undefined) return showToast('请选择支付方式')
//   showLoadingToast('跳转支付')
//   if (orderId.value) {
//     const res = await getConsultOrderPay({
//       paymentMethod: paymentMethod.value,
//       orderId: orderId.value,
//       payCallback: 'http://localhost:5173/room'
//     })
//     location.href = res.data.payUrl
//   }
// }
</script>

<template>
  <div class="consult-pay-page" v-if="payInfo && patient">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo?.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell
        title="实付款"
        :value="`¥${payInfo.actualPayment.toFixed(2)}`"
        class="pay-price"
      />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient.name} | ${patient.genderValue} | ${patient.age}岁`"
      ></van-cell>
      <van-cell
        title="病情描述"
        :label="consult.consult.illnessDesc"
      ></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree"
        >我已同意 <span class="text">支付协议</span></van-checkbox
      >
    </div>
    <van-submit-bar
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      :loading="loading"
      @click="submit"
    />
    <!-- 支付方式 -->
    <!--   <van-action-sheet
      v-model:show="show"
      title="选择支付方式"
      :closeable="false"
      :before-close="onClose"
      :close-on-popstate="false"
    >
      <div class="pay-type">
        <p class="amount">￥{{ payInfo.actualPayment.toFixed(2) }}</p>
        <van-cell-group>
          <van-cell title="微信支付" @click="paymentMethod = 0">
            <template #icon><cp-icon name="consult-wechat" /></template>
            <template #extra
              ><van-checkbox :checked="paymentMethod === 0"
            /></template>
          </van-cell>
          <van-cell title="支付宝支付" @click="paymentMethod = 1">
            <template #icon><cp-icon name="consult-alipay" /></template>
            <template #extra
              ><van-checkbox :checked="paymentMethod === 1"
            /></template>
          </van-cell>
        </van-cell-group>
        <div class="btn">
          <van-button type="primary" round block @click="pay"
            >立即支付</van-button
          >
        </div>
      </div>
    </van-action-sheet> -->
    <!-- 抽屉组件 -->
    <cp-pay-sheet
      :order-id="orderId"
      v-model:show="show"
      :on-close="onClose"
      :actual-payment="payInfo.actualPayment"
      pay-callback="/room"
    ></cp-pay-sheet>
  </div>
  <div class="consult-pay-page" v-else>
    <van-skeleton title :row="4" />
    <van-skeleton title :row="5" />
    <van-skeleton title :row="3" />
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}

.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
</style>
