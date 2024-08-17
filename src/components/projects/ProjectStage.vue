<template>
    <div v-if="readOnly"  class="stepper">
        <div class="stepper-header">
            <div v-for="(step, index) in steps" :key="index" class="step-icon" :class="{
                'active': currentStep === index + 1,
                'completed': currentStep > index + 1
            }">
                <img v-if="currentStep > index + 1" :src="NULL" alt="">

                <img v-else-if="currentStep === index + 1" :src="step.activeIcon" alt="Active">
                <span class="not-active" v-else></span>
            </div>
            <v-icon icon="mdi-dots-vertical" />
        </div>
        <div class="stepper-content">
            <div class="flex flex-row">
                <span :class="currentStepContent.spanClass" class="mr-2"></span>
                <h2>{{ currentStepContent.title }}</h2>
            </div>
            <div class="flex flex-col" v-html="currentStepContent.content"></div>
        </div>
        <!-- <div class="stepper-actions">
            <UiButton :fit="false" :class="currentStepContent.colorClass" @click="selectStep" v-if="currentStep !== 2">
                Выбрать этот этап
            </UiButton>
            <UiButton bg-color="def" class="text-black" v-if="currentStep === 2">
                Вы сейчас на этой стадии
            </UiButton>
        </div> -->
    </div>
    <div v-else  class="stepper">
        <div class="stepper-header">
            <div v-for="(step, index) in steps" :key="index" class="step-icon" :class="{
                'active': currentStep === index + 1,
                'completed': currentStep > index + 1
            }" @click="setStep(index + 1)">
                <img v-if="currentStep > index + 1" :src="NULL" alt="">

                <img v-else-if="currentStep === index + 1" :src="step.activeIcon" alt="Active">
                <span class="not-active" v-else></span>
            </div>
            <v-icon icon="mdi-dots-vertical" />
        </div>
        <div class="stepper-content">
            <div class="flex flex-row">
                <span :class="currentStepContent.spanClass" class="mr-2"></span>
                <h2>{{ currentStepContent.title }}</h2>
            </div>
            <div class="flex flex-col" v-html="currentStepContent.content"></div>
        </div>
        <div class="stepper-actions">
            <UiButton :fit="false" :class="currentStepContent.colorClass" @click="selectStep" v-if="currentStep !== 2">
                Выбрать этот этап
            </UiButton>
            <UiButton bg-color="def" class="text-black" v-if="currentStep === 2">
                Вы сейчас на этой стадии
            </UiButton>
        </div>
    </div>
</template>

<script setup>
import A from '../../assets/icons/projectStages/A.svg'
import B from '../../assets/icons/projectStages/B.svg'
import C from '../../assets/icons/projectStages/C.svg'
import D from '../../assets/icons/projectStages/D.svg'

import NULL from '../../assets/icons/projectStages/NULL.svg'
import UiButton from '../ui-kit/UiButton.vue'
import { ref, computed } from 'vue'
const props = defineProps({
    readOnly:{
        type:Boolean,
        default:false,
    }
})
const steps = [
    {
        title: 'Заказ', activeIcon: A, title: 'Пре-сид раунд (Pre-seed) - первые шаги проекта',spanClass:'pr-1 we-linear-blue', colorClass: 'button-blue',

        content: `<p class="text-[14px] font-[500] pt-2">На этой стадии создатели инвестируют собственные средства. О временных рамках и лимитах финансирования говорить не приходится. Стартаперы стремятся привлечь максимум денег как можно быстрее</p>`
    },
    {
        title: 'Доставка', activeIcon: A, title: 'Сид раунд (Seed-раунд)',spanClass:'we-linear-blue', colorClass: 'button-blue',

        content: `<span class="text-[14px] font-[500] pt-2">На этой стадии привлекают от 25 тыс до 1 млн $. Деньги нужны для того, чтобы завершить разработку прототипа или довести его до требований рынка.</span>
    <span class="text-[14px] font-[500] pt-3 m-0">Главный продукт - программа, итогом сид раунда должен стать финальный релиз программы.</span>
    <span class="text-[14px] font-[500] pt-3 m-0">Основная сложность - показать инвесторам перспективы проекта и правильно оценить необходимый объем финансирования.</span>
    `},
    {
        title: 'Подтверждение', activeIcon: B, title: 'Ангельский раунд',spanClass:'we-linear-green', colorClass: 'button-green',

        content: `<p class="text-[14px] font-[500]">Главная особенность ангельского раунда в том, что стартапы привлекают скорее не инвесторов, а менторов. Помощь бизнес-ангелов в организации всех процессов бывает настолько существенной, что финансы часто уходят на второй план.
        </p>
       <p class="text-[14px] font-[500] pt-3">Ангельский раунд можно назвать и разновидностью seed раунда. Главная сложность здесь - вовремя понять, что вашему стартапу нужны не только деньги, но и организационная поддержка. И, конечно, бывает непросто найти инвестора и ментора в одном лице.</p> ` },
    {
        title: 'Заказ', activeIcon: B, title: 'Раунд А (Stage A)', spanClass:'we-linear-green',colorClass: 'button-green',

        content: `<p class="text-[14px] font-[500] pt-2">Эта стадия наступает если стартап успешно прошел сид-раунд. Стартапы привлекают суммы от 500 тысяч долларов.</p>
    <p class="text-[14px] font-[500] pt-3">Основные задачи: </p>
        <ul class="py-3 text-[14px] font-[500]">
            <li  class="list-disc list-inside p-0 ml-4">организовать серийное производство (постоянную работу сервиса);</li>
            <li  class="list-disc list-inside p-0 ml-4">нанять полноценную команду.</li>
        </ul>
<p class="text-[14px] font-[500]">Раунд А может быть первым для компании, если предыдущие задачи основатели стартапа решили собственными ресурсами.</p>` },
    {
        title: 'Доставка', activeIcon: D, title: 'Раунд B (Stage B)',spanClass:'we-linear-purple', colorClass: 'button-purple',

        content: `<p class="text-[14px] font-[500] pt-2">На этой стадии происходит масштабирование компаний. Раунд B начинается когда стартап достигает финансовых показателей, оговоренных с инвесторами на стадии А.</p>
       <p class="text-[14px] font-[500] pt-3"> Среди задач этого этапа:</p>
        <ul class="py-3 text-[14px] font-[500]">
            <li class="list-disc list-inside p-0 ml-4">рост прибыли;</li>
            <li  class="list-disc list-inside p-0 ml-4">завоевание новых рынков сбыта продукции;</li>
            <li  class="list-disc list-inside p-0 ml-4">расширение охвата в занятой нише.</li>
        </ul>
        <p class="text-[14px] font-[500]"> Возможные риски:
</p>
        <ul class="py-3 text-[14px] font-[500]">
            <li  class="list-disc list-inside p-0 ml-4">неэффективная работа команды;</li>
            <li  class="list-disc list-inside p-0 ml-4">непонимание того, как достичь задач;</li>
            <li  class="list-disc list-inside p-0 ml-4">неправильные решения при масштабировании.</li>
        </ul>`  },
    {
        title: 'Подтверждение', activeIcon: D, title: 'Раунд C (Stage C)', spanClass:'we-linear-purple',colorClass: 'button-purple',

        content: `<p class="text-[14px] font-[500] pt-2">Перед компанией и ее создателями стоит задача - достичь самоокупаемости. Стартап становится прибыльным только на стадии раунда C. После этого раунда компания способна существовать самостоятельно.
        </p>
        <p class="text-[14px] font-[500] pt-3">Главная сложность в том, чтобы наконец превратить смелый эксперимент в стабильный и прогнозируемый бизнес-проект. До этой стадии доходят далеко не все стартапы. Очень многие не достигают успеха из-за недостатка знаний и опыта, неспособности мыслить как бизнесмен, а не просто креативить.</p>` },
    {
        title: 'Подтверждение', activeIcon: C, title: 'Раунд D (Stage D)',spanClass:'we-linear-orange', colorClass: 'button-orange',

        content: `<p class="text-[14px] font-[500] pt-2"> Это финансирование перед продажей стратегическому инвестору или выходом на IPO
        </p>
        <p class="text-[14px] font-[500] pt-3">Основная сложность для компаний - привлечь стратегического инвестора, показать покупателям свою ценность.</p>` }
]

const total = computed(() => {
    return subtotal.value + shippingCost.value
})
const currentStep = ref(1)

const currentStepContent = computed(() => {
    return steps[currentStep.value - 1]
})

const setStep = (step) => {
    currentStep.value = step
}

const nextStep = () => {
    if (currentStep.value < steps.length) {
        currentStep.value++
    }
}

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--
    }
}
const selectStep = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++
  }
}
</script>

<style scoped lang="scss">
p {
    margin: 0;
    padding: 0
}

.button-blue {
    color: #fff;
    max-width: 100%;
    background: linear-gradient(96.78deg, #13d5ff -0.02%, #12a1de 94.31%);
    border: 1px solid #12b7ec;
    box-sizing: border-box;
    box-shadow: 0 22px 22px -17px #29b6f6;
    border-radius: 12px;
}

.button-green {
    color: #000;
    max-width: 100%;
    border: 0px;
    background: linear-gradient(96.78deg, #0efe51 -0.02%, #12dea1 94.31%);
    box-shadow: 0 22px 22px -17px #29f67b;
    border-radius: 12px;
}

.button-purple {
    color: #fff;
    max-width: 100%;
    border: 0px;
    background: linear-gradient(96.78deg, #ce0efe -0.02%, #9012de 94.31%);
    box-shadow: 0 22px 22px -17px #9c29f6;
    border-radius: 12px;
}

.button-orange {
    color: #fff;
    border: 0px;
    max-width: 100%;
    background: linear-gradient(96.78deg, #ffaf13 -0.02%, #ff7313 94.31%);
    box-shadow: 0 22px 22px -17px #f68b29;
    border-radius: 12px;
}
.we-linear-blue {
    width: 5px;
    height: 28px;
    background-color: #29b6f6;
    border-radius: 8px;
}

.we-linear-purple {
    width: 5px;
    height: 28px;
    background: linear-gradient(96.78deg, #ce0efe -0.02%, #9012de 94.31%);
    border-radius: 8px;
}

.we-linear-green {
    width: 5px;
    height: 28px;
    background: linear-gradient(96.78deg, #0efe51 -0.02%, #12dea1 94.31%);
    border-radius: 8px;
}

.we-linear-orange {
    width: 5px;
    height: 28px;
    background: linear-gradient(96.78deg, #ffaf13 -0.02%, #ff7313 94.31%);
    border-radius: 8px;
}

.stepper {
    background-color: white;
    border-radius: 12px;
    /* max-width: 600px; */
    margin-top:48px;
    padding: 12px;
}

.stepper-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.step-icon {
    // width: 30px;
    // height: 30px;
    border-radius: 50%;
    background-color: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    img {
        max-width: 28px;
        max-height: 28px;
    }
}

.not-active {
    border: 1px solid #ddd;
    border-radius: 50%;
    width: 28px;
    height: 28px;
}

.step-icon.active {
    /* background-color: #4CAF50; */
    color: white;
}

.stepper-content {
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.stepper-actions {
    display: flex;
    width: 100%;
    // justify-content: space-between;
    flex-direction: column;
}

button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
}

button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
}
</style>