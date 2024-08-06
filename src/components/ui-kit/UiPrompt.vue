<script lang="ts">
export default {
    name: 'UiPrompt',
}
</script>

<template>
    <v-card v-show="promptState" class="ui-prompt pl-4 pr-3 py-4">
        <v-row no-gutters align="center">
            <v-icon v-if="props.projectCard" class="text-[#00A152]" icon="mdi-alert-circle-outline" size="18" />
            <v-icon v-else icon="mdi-alert-circle-outline" size="18" />
            <p v-if="props.projectCard" class="ui-prompt__title2 ma-0 ml-2">Почему текст позеленел?</p>
            <p v-else class="ui-prompt__title ma-0 ml-2">{{ $t('prompts.title') }}</p>

            <v-spacer></v-spacer>

            <v-icon icon="mdi-close" @click="promptState = !promptState" size="14" />
        </v-row>

        <p class="ui-prompt__text text-left mt-4">
            <slot />
        </p>
    </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { Ref } from 'vue'

const promptState: Ref<Boolean> = ref(true)
const props = defineProps({
    projectCard: {
        type: Boolean,
        default: false,
    },
})</script>

<style lang="scss" scoped>
.ui-prompt {
    border: 1px solid rgba(224, 224, 224, 0.5);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05) !important;
    border-radius: 2px 12px 12px 12px;

    width: 100%;

    &__title {
        font-size: 13px;
        // line-height: 14px;
        letter-spacing: 0.01em;
        color: #263238;
    }
    &__title2 {
        font-size: 13px;
        // line-height: 14px;
        letter-spacing: 0.01em;
        color: #00A152;
    }
    &__text {
        font-weight: 400;
        font-size: 13px;
        line-height: 14px;
        white-space: pre-line;
        color: #9e9e9e;
        line-height: 14px;
        letter-spacing: 0.13px;
    }
}
</style>
