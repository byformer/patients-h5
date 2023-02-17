<script setup lang="ts" name="Login">
import { ref, onUnmounted } from 'vue'
import { mobileRules, passwordeRules, codeRules } from '@/utils/rules'
import { showToast, showSuccessToast, type FormInstance } from 'vant'
import { loginByPassword, sendMobileCode, loginByMobile } from '@/services/user'
import useStore from '@/stores'
import router from '@/router'
import { useRoute } from 'vue-router'
const agree = ref(false)
const show = ref(false)
const { user } = useStore()
const route = useRoute()
// 存储表单数据
const mobile = ref('13230000001')
const password = ref('')
const code = ref('')

const login = async () => {
  //  当表单效验后出发 submit 时间， 触发这个函数
  if (!agree.value) return showToast('请勾选协议')
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value)

  //   成功
  user.setUser(res.data)
  router.replace((route.query.returnUrl as string) || '/user')
  showSuccessToast('登录成功')
}

// 短信登录界面
const isPass = ref(true)
const form = ref<FormInstance>()
const time = ref(0)
let timeId: number
const send = async () => {
  // 已经倒计时time的值大于0，此时不能发送验证码
  if (time.value > 0) return

  // 验证不通过报错，阻止程序继续执行
  await form.value?.validate('mobile')
  await sendMobileCode(mobile.value, 'login')
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
</script>
<template>
  <div class="login-page">
    <cp-nav-bar
      right-text="注册"
      @click-right="$router.push('regiter')"
    ></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ isPass ? '短信验证码登录' : '密码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
  </div>
  <!-- form表单 -->
  <van-form autocomplete="off" @submit="login">
    <van-field
      v-model="mobile"
      type="text"
      name="mobile"
      placeholder="请输入手机号"
      :rules="mobileRules"
      maxlength="11"
    ></van-field>
    <van-field
      v-if="isPass"
      v-model="password"
      :rules="passwordeRules"
      :type="show ? 'text' : 'password'"
      placeholder="请输入密码"
      maxlength="24"
    >
      <template #button>
        <cp-icon
          @click="show = !show"
          :name="`login-eye-${show ? 'on' : 'off'}`"
        ></cp-icon>
      </template>
    </van-field>
    <van-field
      v-model="code"
      :rules="codeRules"
      v-else
      placeholder="请输入验证码"
    >
      <template #button>
        <span class="btn-send" :class="{ active: time > 0 }" @click="send">
          {{ time > 0 ? `${time}s后再次发送` : '发送验证码' }}
        </span>
      </template>
    </van-field>
    <div class="cp-cell">
      <van-checkbox v-model="agree">
        <span>我已同意</span>
        <a href="javascript:;">用户协议</a>
        <span>及</span>
        <a href="javascript:;">隐私条款</a>
      </van-checkbox>
    </div>
    <div class="cp-cell">
      <van-button native-type="submit" block round type="primary"
        >登 录</van-button
      >
    </div>
    <div class="cp-cell">
      <a href="javascript:;">忘记密码？</a>
    </div>
  </van-form>

  <!-- 底部 -->
  <div class="login-other">
    <van-divider>第三方登录</van-divider>
    <div class="icon">
      <img src="@/assets/qq.svg" alt="" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }

  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;

    h3 {
      font-weight: normal;
      font-size: 24px;
    }

    a {
      font-size: 15px;
    }
  }

  &-other {
    margin-top: 60px;
    padding: 0 30px;

    .icon {
      display: flex;
      justify-content: center;

      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}

.van-form {
  padding: 0 14px;

  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }

  .btn-send {
    color: var(--cp-primary);

    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
