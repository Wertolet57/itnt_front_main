<template>
    <Header showUserMinify  :routeName="$t('page.chat')" />
    <GeneralChat />
    <Footer />
</template>

<script setup lang="ts">
import GeneralChat from '~/components/Chat/GeneralChat.vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

</script>
