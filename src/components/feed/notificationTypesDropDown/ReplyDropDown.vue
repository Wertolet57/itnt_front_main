<script lang="ts">
export default {
    name: 'replyDropDown',
}
</script>
<template>
    <v-expansion-panel-text>
        <div class="feedPanel__card d-flex align-center">
            <img width="30" height="30" src="../../../assets/demo/ava-small-header.svg" class="mr-3" />

            <div>
                <div class="feedPanel__card__title d-flex align-center">
                    <p class="txt-body3">Евгений Анисимов </p>
                    <img class="mx-2" src="../../../assets/icons/singeDot-gray.svg" />
                    <span style="color: #9e9e9e" class="txt-cap1">3ч назад </span>
                </div>

                <p class="feedPanel__card__subtitle text-black text-xs txt-body3">
                    @realthomashardy, Проверь личку, скинул тебе ссылку, отпишись ;)
                    А то иногда ссылка почему то не доходит 🤔
                </p>
            </div>
            <v-spacer />
        </div>
        <div class="w-full  flex flex-row mt-3">
            <UiButton :is-small="true" bgColor="def" class="mr-3" style="padding: 10px 13px 9px 14px">Ответить
            </UiButton>
            <UiButton :fit="true" bgColor="smBlue" class="mr-3" style="padding: 10px 13px 9px 14px">
                К коментарию <img width="30" height="30" :src="left" alt=""></UiButton>
        </div>
        
    </v-expansion-panel-text>
</template>

<script setup lang="ts">

import left from '~/assets/left_arrrow-white.svg';
import UiButton from '~/components/ui-kit/UiButton.vue'
const props = defineProps({
    messageObject: {
        type: Object,
    },
});
</script>
<style lang="scss" scoped>
.feedPanel {

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
        // border: 1px solid blue !important;
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
