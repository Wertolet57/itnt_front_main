<template>
    <div class="slider-container pb-[24px]">
        <input type="range" class="slider" :min="min" :max="max" :step="step" v-model="sliderValue"
            @input="updateSliderFill">
        <div class="flex justify-between">
            <div class="text-[#263238] font-medium">
                {{ sliderValue }}%
                <span class="text-[#9E9E9E] font-normal">
                    - продано на сегодня
                </span>
            </div>
            <div class="text-[#263238] font-medium">
                {{ remainingValue }}%
                <span class="text-[#9E9E9E] font-normal">
                    - продано на сегодня
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    initialValue: { type: Number, default: 50 }
});

const sliderValue = ref(props.initialValue);

const remainingValue = computed(() => {
    return props.max - sliderValue.value;
});

const updateSliderFill = () => {
    const percent = ((sliderValue.value - props.min) / (props.max - props.min)) * 100;
    document.documentElement.style.setProperty('--slider-fill', `${percent}%`);
};

onMounted(() => {
    updateSliderFill();
});
</script>

<style scoped>
.slider-container {
    /* width: 300px; */
    margin: 20px auto;
}

.slider {
    -webkit-appearance: none;
    width: 100%;
    height: 22px;
    border-radius: 16px;
    background-image: linear-gradient(to right, #29B6F6 var(--slider-fill, 0%), #C7EDFF var(--slider-fill, 0%));
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
}

.slider::-webkit-slider-runnable-track {
    background-image: linear-gradient(to right, #29B6F6 var(--slider-fill, 0%), #C7EDFF var(--slider-fill, 0%));
    border-radius: 16px;
}

.slider::-moz-range-track {
    background-image: linear-gradient(to right, #29B6F6 var(--slider-fill, 0%), #C7EDFF var(--slider-fill, 0%));
    border-radius: 16px;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 37px;
    height: 22px;
    border-radius: 16px;
    background-color: white;
    border: 2px solid #29B6F6;
    cursor: pointer;
    /* margin-top: -2px; */
}

.slider::-moz-range-thumb {
    width: 37px;
    height: 20px;
    border-radius: 16px;
    background-color: white;
    border: 2px solid #29B6F6;
    cursor: pointer;
}
</style>