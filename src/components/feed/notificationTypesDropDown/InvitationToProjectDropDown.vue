<script lang="ts">
export default {
    name: 'NewCommentsDropDown',
}
</script>

<template>
    <v-expansion-panel-text>
        <div class="feedPanel__card d-flex align-center">
            <div>
                <p class="txt-body3">
                    Здравствуйте, Том!
                    Нам кажется, вы то самое, недостающее звено в нашей команде. Мы сосредоточены на самых
                    крупных проектах
                    Англии и нам очень импонируют ваши методы работы.
                    Будем рады видеть в наших рядах!
                    P.S. У нас есть шляпы с полями и Томпсоны 🙄
                </p>
                <div class="w-full  flex flex-row mt-3">
                    <UiButton @click="$router.push('/messenger/chat/2')" bgColor="def" class="mr-3" style="padding: 10px 13px 9px 14px">Открыть диалог
                    </UiButton>
                    <UiButton @click="openModal" bgColor="smBlue" class="mr-3" style="padding: 10px 13px 9px 14px">
                        Отреагировать</UiButton>
                </div>
            </div>
            <v-dialog v-model="searchModalState" width="100%">

                <v-card class="ui-skills__search">
                    <div class="flex flex-row items-start justify-center mb-[48px]">
                        <img class="w-[47px] h-[47px] mr-[16px]" src="../../../assets/demo/ava-small-header.svg" alt="" />
                        <h3 class="text-left">Вас приглашают присоединиться к проекту: <h3 class="text-[#12b7ec]">Candy
                                Gangsters </h3>
                        </h3>
                    </div>
                    <div>
                        <v-row class="mb-[20px]" align="center" justify="center">
                            <v-btn @click="state = !state" class="pa-0 mr-7" min-width="32" min-href="32" variant="outlined"
                                color="#29B6F6">
                                <v-icon icon="mdi-check" :color="state ? '#29B6F6' : '#E0E0E0'" />
                            </v-btn>

                            <p class="license-text ma-0">
                                Участвовать анонимно (Команда<br />
                                проекта сможет вас опознать) <br />
                            </p>
                        </v-row>
                    </div>
                    <UiButton @click="searchModalState = false" class="mb-[13px]" x-large bgColor="blue">Присоединиться</UiButton>
                    <UiButton  @click="searchModalState = false" block x-large bgColor="def">Отправить отказ</UiButton>
                </v-card>
            </v-dialog>
            <v-spacer />
        </div>
    </v-expansion-panel-text>
</template>

<script setup lang="ts">
import left from '~/assets/left_arrrow-white.svg';
import UiButton from '~/components/ui-kit/UiButton.vue'
import { defineProps, ref } from 'vue';
let state = ref(false)

const props = defineProps({
    messageObject: {
        type: Object,

    },
});


const searchModalState = ref(false)
function openModal() {
    // chosenModalSkill.value = skill
    searchModalState.value = true
}
</script>
<style lang="scss" scoped>
.feedPanel {
    // box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);

    &__head {
        padding: 16px 14px;
    }

    &__card {
        &__title {
            margin: 0;
        }

        &__subtitle {
            color: #9e9e9e;
            margin-top: 1px;
            text-align: initial;
        }
    }
}

.feedPanel :deep() {
    .v-expansion-panels {
        border: 1px solid blue !important;
        border-radius: 12px 12px 2px 2px !important;
    }

    .v-expansion-panel__shadow {
        display: none;
    }

    .v-expansion-panel-title__overlay {
        border-radius: 12px 12px 2px 2px;
        opacity: 0;
    }

    .v-expansion-panel-text__wrapper {
        padding: 16px 14px;
        // border-top: 1px solid #e0e0e0;
    }
}

.v-expansion-panel-title {
    border-radius: 12px;

}

.v-expansion-panel-text {
    &:last-child {
        border-radius: 2px 2px 12px 12px;

    }
}

.v-expansion-panel-title--active {
    border-radius: 12px 12px 2px 2px !important;

}

.back-messages {
    font-size: 13px;
    line-height: 14px;
    letter-spacing: 0.01em;
    color: #1769aa;
    position: relative;
    text-align: right;
    z-index: 1;
}

.back-messages-after {
    right: 10px;
    top: 24px;
    width: 44px;
    height: 22px;
    position: absolute;
    background: #e1f5fe;
    border-radius: 16px;
}
</style>







