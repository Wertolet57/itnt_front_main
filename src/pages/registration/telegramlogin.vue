<template>
    <div class="m-4" id="telegram-widget-container"></div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, onBeforeUnmount } from 'vue'
  
  // Extend the Window interface to include onTelegramAuth
  declare global {
    interface Window {
      onTelegramAuth: (user: any) => void
    }
  }
  
  onMounted(() => {
    const container = document.getElementById('telegram-widget-container')
    if (container) {
      const widgetScript = document.createElement('script')
      widgetScript.async = true
      widgetScript.src = 'https://telegram.org/js/telegram-widget.js?22'
      widgetScript.setAttribute('data-telegram-login', 'itnt_test_bot') 
      widgetScript.setAttribute('data-size', 'large')
      widgetScript.setAttribute('data-onauth', 'onTelegramAuth(user)')
      widgetScript.setAttribute('data-request-access', 'write')
  
      container.appendChild(widgetScript)
    }
  
    window.onTelegramAuth = function (user: any) {
      alert(
        'Logged in as ' +
          user.first_name +
          ' ' +
          user.last_name +
          ' (' +
          user.id +
          (user.username ? ', @' + user.username : '') +
          ')'
      )
    }
  
    onBeforeUnmount(() => {
      const container = document.getElementById('telegram-widget-container')
      if (container) {
        container.innerHTML = ''
      }
    })
  })
  </script>
  