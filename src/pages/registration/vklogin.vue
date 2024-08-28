<!-- components/VKAuth.vue -->
<template>
  <button class="mb-8" @click="handleLogin">Войти через VK</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useVKAuth } from "../../plugins/useVKAuth"

export default defineComponent({
  setup() {
    const { user, login } = useVKAuth(52165499)

    const handleLogin = async () => {
      try {
        const session = await login()
        console.log('Авторизация успешна', session)
      } catch (error) {
        console.error('Ошибка авторизации', error)
      }
    }

    return { handleLogin, user }
  }
})
</script>