<script lang="ts">
export default {
    name: 'UiSwitch',
}
</script>

<template>
    <div class="ui-switch">
        <div
            v-for="(item, id) in props.items"
            :key="id"
            @click="onSwitchChange(id)"
            class="ui-switch__btn"
            :class="[props.modelValue === id && 'ui-switch__btn--active', props.isVallet === true && props.modelValue === id && 'ui-switch__btn--vallet text-white']"
        >
            {{ item }}
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    modelValue: {
        type: Number,
        required: true
    },
    items: {
        type: Array,
        default: () => [],
    },
    isVallet:{
        type:Boolean,
        default:false,
    }
})

const emit = defineEmits(['update:modelValue'])

function onSwitchChange(newValue: number) {
    emit('update:modelValue', newValue)
}
</script>

<style lang="scss" scoped>
.ui-switch {
    display: flex;
    border-radius: 12px;
    background: #ffffff;
    margin-bottom: 4px;
    margin-top: 12px;
    width: 100%;
    padding: 4px 5px;
    justify-content: space-between;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    &__btn {
        border-radius: 12px;
        color: #263238;
        width: 50%;
        text-align: center;

        line-height: 18px;
        font-size: 16px;
        padding: 8px 0px;
        &--active {
            background: #e1f5fe;
        }
        &--vallet {
            background: linear-gradient(96.78deg, #ce0efe -0.02%, #9012de 94.31%);
        }
    }
}
</style>
