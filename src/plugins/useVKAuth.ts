// composables/useVKAuth.ts
import { ref } from 'vue'

export function useVKAuth(appId: number) {
  const isInitialized = ref(false)
  const user = ref<VKAuthResponse['session'] | null>(null)

  const initVK = () => {
    return new Promise<void>((resolve) => {
      if (isInitialized.value) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = 'https://vk.com/js/api/openapi.js?169'
      script.async = true
      script.onload = () => {
        window.VK.init({ apiId: appId })
        isInitialized.value = true
        resolve()
      }
      document.head.appendChild(script)
    })
  }

  const login = async () => {
    await initVK()
    return new Promise<VKAuthResponse['session']>((resolve, reject) => {
      window.VK.Auth.login((response) => {
        if (response.session) {
          user.value = response.session
          resolve(response.session)
        } else {
          reject(new Error('VK Auth failed'))
        }
      }, 2 | 4194304) // 2 = friends, 4194304 = email
    })
  }

  return {
    user,
    login,
  }
}