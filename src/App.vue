<script setup lang="ts">
import stores from '@/stores'

const { user } = stores()
</script>

<template>
  <p>{{ user }}</p>
  <button
    @click="
      user.setUser({
        id: '1',
        mobile: '1',
        account: '1',
        avatar: '1',
        token: '1'
      })
    "
  >
    登录
  </button>
  <button @click="user.delUser()">退出</button>
</template>
