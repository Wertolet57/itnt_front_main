<template>
    <div class="projectInvesting">
        <!-- header -->
        <div class="projectInvesting__head mb-3 align-center">
            <p style="color: #263238" class="txt-cap2 mb-4">Краудинвестинг:</p>
            <div class="txt-cap1 d-flex align-center" style="color: #9e9e9e">
                <img class="mr-2" src="../../assets/icons/question-blue.svg" />
                <p style="color: #9e9e9e">
                    Что такое Краудинвестинг и почему он может быть вам интересен?
                    <span class="color-blue"> Узнать </span>
                </p>
            </div>
        </div>
        <!-- body -->
        <div class="projectInvesting__body">
            <ProjectInvestSlider />

            <div class="mt-[48px] mb-4">
                <div class="comment bg-gray-100">
                    <div>
                        Мы все очень любим “Danger Flower”, но проект не может существовать на одном нашем энтузиазме.
                        Серверы нужно содержать, а нам хотелось бы уделять проекту всё своё время, не отвлекаясь на
                        основную работу, которая нас кормит. По этому мы запускаем кампанию по привлечению народных
                        инвестиций.
                    </div>
                    <br>
                    <span>
                        Краудинвестинг позволяет совершать как крупные, так и микро-инвестиции от $100.
                    </span>
                </div>
            </div>
            <div class="flex flex-row justify-between mb-[24px]">

                <div class="projectMedia__item w-[50%] flex justify-center">
                    <div class="flex flex-col">
                        <div style="gap: 10px" class="d-flex align-center">
                            <img src="../../assets/youtube.svg" />
                            <p class="txt-cap1 cursor-pointer">
                                YouTube
                            </p>
                        </div>
                        <p class="font-normal text-sm pb-[16px]">Демонстрация продукта</p>
                    </div>
                </div>

                <div class="projectMedia__item w-[50%] flex justify-center">
                    <div class="flex flex-col">
                        <div style="gap: 10px" class="d-flex align-center">
                            <img src="../../assets/icons/media/ppt-blue.svg" />
                            <p style="color: #9e9e9e" class="txt-cap1 cursor-pointer">
                                7.2 Mb
                            </p>
                        </div>
                        <p class="font-normal text-sm">Питч для инвесторов</p>
                    </div>
                </div>
            </div>

            <UiButton class="mb-[48px]" bgColor="def">Мне интересно, но есть вопросы</UiButton>
            <Stat/>
            <UiButton class="mt-[48px]" bgColor="orange">Сделать взнос в обмен на долю</UiButton>

        </div>
    </div>
</template>

<script setup lang="ts">
import Stat from "./Stat.vue"
import ProjectInvestSlider from './ProjectInvestSlider.vue'
import UiButton from '../ui-kit/UiButton.vue'
</script>

<style lang="scss" scoped>
.projectInvesting {
    &__body {
        border-radius: 12px;
        background: #fff;
        padding: 30px 20px 40px 20px;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    }
}

.comment {
    border-radius: 2px 12px 12px 12px;
    // background-color: #9A9A9A;
    padding: 20px;
}
</style>
