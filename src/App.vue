<template>
    <v-app>
        <v-main style="background-color: #fafafa; min-height: 100vh; overflow-y: auto; -webkit-overflow-scrolling: touch;">
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup lang="ts"></script>

<style>
html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
}

.v-application {
    height: 100%;
    overflow-x: hidden;
}

.v-main {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
</style>
