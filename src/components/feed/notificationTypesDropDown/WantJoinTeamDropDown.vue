<script lang="ts">
export default {
    name: 'InvitationToProjectDropDown',
}
</script>
<template>
    <v-expansion-panel-text>
    <v-expansion-panels v-for="(info, id) in demoInfo" :key="id">
        <v-expansion-panels>
            <v-expansion-panel class="feedPanel">
                <v-expansion-panel-title class="feedPanel">
                    <template v-slot:actions="{ expanded }">
                        <div class="bg-[#e1f5fe] px-2 rounded-[16px]">
                            <v-icon color="#1769AA" :icon="expanded ? 'mdi-chevron-up' : ' mdi-chevron-down'"></v-icon>
                        </div>
                    </template>
                    <img width="30" height="30" class="mr-3" src="../../../assets/demo/ava-small-header.svg" alt="" />

                    <div>
                        <div class="feedPanel__card__title align-center d-flex">
                            <p class="txt-body3">Danger Flower</p>
                            <img class="mx-2" src="../../../assets/icons/singeDot-gray.svg" />
                            <span style="color: #9e9e9e" class="txt-cap1">{{ $t('feedPanels.time') }}</span>
                        </div>

                        <p class="feedPanel__card__subtitle txt-cap1">
                            {{ $t('feedPanels.addToProject') }} {{ demoInfo.length }} {{
                                $t('feedPanels.specialist')
                            }}
                        </p>
                    </div>

                    <v-spacer></v-spacer>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                    <div class="feedPanel__card d-flex align-center">
                        <div>
                            <p class="txt-body3">
                                Здравствуйте, Том!
                                Нам кажется, вы то самое, недостающее звено в нашей команде. Мы сосредоточены на
                                самых
                                крупных проектах
                                Англии и нам очень импонируют ваши методы работы.
                                Будем рады видеть в наших рядах!
                                P.S. У нас есть шляпы с полями и Томпсоны 🙄
                            </p>

                        </div>
                        <v-spacer />
                    </div>
                </v-expansion-panel-text>

            </v-expansion-panel>
        </v-expansion-panels>
    </v-expansion-panels>
</v-expansion-panel-text>
</template>


<script setup lang="ts">
const props = defineProps({
    messageObject: {
        type: Object,

    },
});

const demoInfo = [
    {
        name: 'Евгений Анисимов',
        time: '3ч',
        spec: 'Младший Шеф-Повар',
    },
    {
        name: 'Евгений Анисимов',
        time: '3ч',
        spec: 'Младший Шеф-Повар',
    },
]
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