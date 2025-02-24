<template>
    <div>
        <div class="head">
            <div class="head__title">
                <div class="head__title__info">
                    <p class="txt-cap1">Участники сообщества могут приобрести долю в нашем проекте.</p>
                </div>
                <div class="head__title__info2">до <span class="head__title__info2__big">20%</span></div>
            </div>
        </div>
        <Range />

        <div class="item">
            <div class="w-[50%]">
                <div class="item__block">от $100</div>
            </div>
            <p class="txt-body2 item__text">Минимальный взнос</p>
        </div>
        <div class="item">
            <div class="w-[50%]">
                <div class="item__block">$20 000</div>
            </div>
            <p class="txt-body2 item__text">Общая стоимость продаваемой доли</p>
        </div>
        <div class="item">
            <div class="w-[50%]">
                <div class="item__block">$16 000</div>
            </div>
            <p class="txt-body2 item__text">Доступно к покупке</p>
        </div>
        <div class="item">
            <div class="w-[50%]">
                <div class="item__block">$4000</div>
            </div>
            <p class="txt-body2 item__text">Сумма уже выкупленной доли</p>
        </div>

        <UiButton bgColor="blue">Инвестировать в талант</UiButton>
    </div>
</template>

<script setup>
import Range from '../../components/projects/Range.vue'
import UiButton from '../ui-kit/UiButton.vue'
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
</style>
