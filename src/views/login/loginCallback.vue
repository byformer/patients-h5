<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import { loginByQQ, sendMobileCode, bindMobile } from '@/services/user'
import { mobileRules, codeRules } from '@/utils/rules'
import { showSuccessToast, type FormInstance } from 'vant'
import type { User } from '@/types/user'
import useStore from '@/stores'
import { useRouter } from 'vue-router'
// 绑定手机号
const openId = ref('')
const isBind = ref(false)

onMounted(() => {
  if (window.QC.Login.check()) {
    window.QC.Login.getMe((id) => {
      openId.value = id
      // QQ，登录
      loginByQQ(id)
        .then((res) => {
          // 登录成功
          loginSuccess(res.data)
        })
        .catch(() => {
          // 登录失败
          isBind.value = true
          console.log('失败')
        })
    })
  }
})
const mobile = ref('')
const code = ref('')
const form = ref<FormInstance | null>(null)
const time = ref(0)
let timeId: number
const send = async () => {
  // 已经倒计时time的值大于0，此时不能发送验证码
  if (time.value > 0) return

  // 验证不通过报错，阻止程序继续执行
  await form.value?.validate('mobile')
  await sendMobileCode(mobile.value, 'bindMobile')
  showSuccessToast('发送成功')
  time.value = 60
  // 倒计时
  clearInterval(timeId)
  timeId = window.setInterval(() => {
    time.value--
    if (time.value <= 0) window.clearInterval(timeId)
  }, 1000)
}
onUnmounted(() => {
  window.clearInterval(timeId)
})
const router = useRouter()
const { user } = useStore()
// 登录成功、
const loginSuccess = (u: User) => {
  user.setUser(u)
  router.replace(user.returnUrl || '/user')
  user.updateResultUrl('')
  showSuccessToast('登录成功')
}

// 绑定手机号
const bind = async () => {
  const res = await bindMobile({
    mobile: mobile.value,
    code: code.value,
    openId: openId.value
  })
  loginSuccess(res.data)
}
</script>
<template>
  <div class="login-page" v-if="isBind">
    <cp-nav-bar></cp-nav-bar>
    <div class="login-head">
      <h3>手机绑定</h3>
    </div>
    <van-form autocomplete="off" ref="form">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="mobile"
        :rules="mobileRules"
      ></van-field>
      <van-field
        :rules="codeRules"
        v-model="code"
        name="code"
        placeholder="请输入验证码"
      >
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="send">{{
            time > 0 ? `${time}s后再次发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-button
          block
          round
          type="primary"
          native-type="submit"
          @click="bind"
        >
          立即绑定
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/login.scss';
.btn-send {
  cursor: pointer;
}
</style>
