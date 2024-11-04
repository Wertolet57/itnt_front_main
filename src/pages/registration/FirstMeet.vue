<template>
    <v-row class="container pa-0 ma-0" justify="center" align="center">
        <v-col align="center" class="pa-0">
            <img src="../../assets/img/logos/itnt.svg" />
            <div>
                <v-row align="center" justify="center" class="mt-12 d-flex" no-gutters style="flex-wrap: nowrap;">
                    <v-btn @click="togleState" class="pa-0 mr-3 ml-4" min-width="32" min-height="32" variant="outlined"
                        color="#29B6F6">
                        <v-icon icon="mdi-check" :color="state ? '#29B6F6' : '#E0E0E0'" />
                    </v-btn>
                    <p class="license-text mx-0 ma-0">
                        {{ $t('confirm') }}
                        <router-link class="license-href" to="/agreement"> {{ $t('user_agreement') }} </router-link>
                    </p>
                </v-row>    

            </div>
            <div class="pl-5 pr-5 mt-14">
                <UiButton @click="state && $router.push('/entry')" block x-large :bgColor="state ? 'blue' : 'def'">{{
                        $t('continue')
                    }}</UiButton>
            </div>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import UiButton from '~/components/ui-kit/UiButton.vue'
// console.log(localStorage.getItem('selectedLanguage'))
const state = ref(false)

function togleState() {
    state.value = !state.value
}
</script>

<style lang="scss">
.container {
    height: 100vh;
}

.license-text {
    font-size: 14px;
    text-align: left;
    line-height: 18px;
    color: #9e9e9e;
}

.license-href {
    color: #29b6f6;
    text-decoration: none;
}
</style>
