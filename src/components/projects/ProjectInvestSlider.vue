<template>
    <div class="main" >
        <div class="head">
            <div class="head__title">
                <div class="head__title__info">
                    <p class="txt-cap1">Участники сообщества могут приобрести долю в нашем проекте.</p>
                </div>
                <div class="head__title__info2">до <span class="head__title__info2__big">{{ shareForSale }}%</span></div>
            </div>
        </div>
        <Range />

        <div class="item">
            <div class="w-[50%]">
                <div class="item__block">от ${{ minContribution }}</div>
            </div>
            <p class="txt-body2 item__text">Минимальный взнос</p>
        </div>
        <div class="item">
            <div class="w-[50%]">
                <div class="item__block">${{ amountAttracted }}</div>
            </div>
            <p class="txt-body2 item__text">Общая стоимость продаваемой доли</p>
        </div>
        <div class="item">
            <div class="w-[50%]">
                <div class="item__block">${{ shareForSale }}</div>
            </div>
            <p class="txt-body2 item__text">Доступно к покупке</p>
        </div>
        <div class="item">
            <div class="w-[50%]">
                <div class="item__block">${{ alreadyPurchased }}</div>
            </div>
            <p class="txt-body2 item__text">Сумма уже выкупленной доли</p>
        </div>

        <UiButton @click="openInvestDetails" bgColor="blue">Инвестировать в талант</UiButton>
    </div>
    <v-bottom-sheet v-model="showInvestDetails">
        <div class="donation-block mt-4 p-[20px] text-[#263238]">
            <div class="flex flex-row items-center mb-[42px]">
                <img :src="ava" class="transaction-icon" alt="icon">
                <div class="transaction-details">
                    <p class="transaction-type">Danger Flower</p>
                    <p class="text-[#263238]">9 марта 22г  в 17:33</p>
                </div>
                <div class="transaction-amount">
                    <p>-2 ETH</p>
                    <p class="text-[#9E9E9E]">~$5 459.88</p>
                </div>
            </div>
            <div class="donation-info justify-center">
                <img :src="update" alt="Danger Flower" class="icon">
                <p>Вы отправили в проект Danger Flower пожертвование в размере <span class="span-text">2 ETH</span></p>
            </div>
            <div class="message">На развитие! Я в вас верю!</div>
            <UiButton bg-color="purple" class="mt-[50px]">Пожертвовать ещё</UiButton>
            <UiButton bg-color="def" class="mt-[15px]">Все мои операции с этим проектом</UiButton>
        </div>
    </v-bottom-sheet>
</template>

<script setup>
import Range from '../../components/projects/Range.vue'
import UiButton from '../ui-kit/UiButton.vue'
import { ref } from 'vue'
import ava from "../../assets/demo/projectsmallphoto.svg"
import update from "../../assets/vallet/update.svg"

const showInvestDetails = ref(false)

const openInvestDetails = () => {
    showInvestDetails.value = true
}

defineProps({
    minContribution: {
        type: Number,
        required: true
    },
    shareForSale: {
        type: Number,
        required: true
    },
    amountAttracted: {
        type: Number,
        required: true
    },
    alreadyPurchased: {
        type: Number,
        required: true
    }
})
</script>

<style lang="scss" scoped>
.head {
    &__title {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        width: 100%;

        &__info {
            width: 75%;
            padding: 18px 15px 17px 20px;
            border-radius: 12px;
            border: 1px solid #c7edff;
            background: $prim-var2;
            font-weight: 500;

        }

        &__info2 {
            width: 25%;
            align-items: end;
            gap: 4px;
            display: flex;
            justify-content: center;
            padding: 18px 15px 17px 20px;
            border-radius: 12px;
            border: 1px solid #c7edff;
            background: $prim-var2;

            &__big {
                font-weight: 600;
                text-align: center;
                font-size: 24px;
            }
        }
    }
}

.item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0 6px 0;
    gap: 17px;
    width: 100%;

    &__block {
        width: 116px;
        text-align: center;
        border: 1px solid $prim-var2;
        border-radius: 8px;
        padding: 10px 20px;
        color: $primary;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: 22px;
    }

    &__text {
        text-align: left;
        width: 50%;
    }
}
.span-text{
   color: #800080;
}
.donation-block {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: white;
    border-radius: 12px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.icon {
    width: 40px;
    height: 40px;
    margin-right: 10px;
}

.project-name {
    font-weight: bold;
}

.donation-amount {
    color: #888;
}

.donation-info {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.upload-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
}

.message {
    background-color: #fafafa;
    padding: 17px 22px;
    border-radius: 2px 12px 12px 12px;
    border:1px solid #E0E0E0;
}

.donate-more {
    background-color: #800080;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    margin-bottom: 10px;
}

.all-operations {
    text-align: center;
    color: #800080;
    text-decoration: underline;
}

.v-bottom-sheet {
    .donation-block {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }
}
</style>
