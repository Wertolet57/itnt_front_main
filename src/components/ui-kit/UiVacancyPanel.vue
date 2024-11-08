<script lang="ts">
export default {
    name: 'UiVacancyPanel',
}
</script>

<template>
    <!-- READONLY -->
    <div v-if="props.readOnly">
        <v-expansion-panels>
            <v-expansion-panel class="ui-vacancyPanel rounded-lg">
                <v-expansion-panel-title :class="props.card && 'ui-vacancyPanel--card'" class="pa-0 pl-2 pr-4">
                    <div class="ui-vacancyPanel__head txt-body2">
                        <v-icon icon="mdi-account-outline" size="small" />
                        {{ props.data.offer }}
                    </div>
                </v-expansion-panel-title>

                <v-expansion-panel-text>
                    <p class="txt-body2 mb-4">
                        {{ props.data.description }}
                    </p>

                    <div class="ui-vacancyPanel__head mb-2">
                        <v-icon icon="mdi-wallet-outline" />
                        Мы предлагаем
                    </div>

                    <p class="txt-body2 mb-6">{{ props.data.offer }}</p>

                    <UiButton @click="modalState.open()" bg-color="def">Мне это подходит!</UiButton>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>

        <vue-bottom-sheet ref="modalState">
            <div class="ui-vacancyPanel__modal px-4">
                <p class='font-medium text-lg'>Запрос на вступление в проект</p>

                <div class="ui-vacancyPanel__modal__info">
                    <div class="flex flex-row  my-[14px]">
                        <img :src="defPrjImg" class="box-shadow mr-[16px] rounded-[50%]">
                        <div class="flex flex-col">
                            <p class="font-medium">{{ props.project }}</p>
                            <p class="font-medium text-[#9E9E9E]">{{ props.data.offer }}</p>
                        </div>
                    </div>

                    <UiTextArea label="Сопроводительное письмо*" v-model="propMessage" />
                </div>

                <UiButton bgColor="blue" @click="sendPropositions" class="mt-8">Подтвердить</UiButton>
            </div>
        </vue-bottom-sheet>
    </div>

    <!-- EDITABLE -->
    <div v-else class="card" style="padding: 15px; padding-bottom: 20px">
        <div v-if="vacancyParams.archive == true" class="">
            <div class="">
                <UiTextArea label="Описание*" v-model="vacancyParams.description" />
                <UiInput label="Что мы предлагаем*" v-model="vacancyParams.offer" />

                <UiButton @click="archiveVacancy(false)" class="mt-4" bg-color="blue__no__shadow" >Разархивировать</UiButton>
            </div>
        </div>
        <div v-if="vacancyParams.archive == false" class="">
            <div class="d-flex mb-2">
                <v-spacer />
                <v-icon @click="vacancyPanel.open()" icon="mdi-dots-vertical" />
            </div>

            <div class="ui-vacancyPanel__inputs">
                <UiTextArea label="Описание*" v-model="vacancyParams.description" />
                <UiInput label="Что мы предлагаем*" v-model="vacancyParams.offer" />
                <div v-if="isFormChanged" class="flex flex-row justify-end gap-[12px]">
                    <UiButton isSmall @click="resetForm" class="mt-4" bg-color="def2">Отмена</UiButton>
                    <UiButton isSmall @click="changeVacancy" class="mt-4" bg-color="blue">Сохранить</UiButton>
                </div>
            </div>
        </div>

        <vue-bottom-sheet ref="vacancyPanel">
            <div class="modal">
                <div class="modal__list">
                    <div v-for="(item, id) in editableModalItems" :key="id" class="modal__list__item">
                        <img :src="item.icon" alt="" />
                        <p v-if="item.name === 'Архивировать'" @click="archiveVacancy(true)" class="txt-body1">
                            {{ item.name }}
                        </p>
                        <p v-if="item.name === 'Удалить вакансию'" @click="deleteVacancys" class="txt-body1">
                            {{ item.name }}
                        </p>
                    </div>
                </div>
            </div>
        </vue-bottom-sheet>
    </div>
</template>

<script lang="ts" setup>
import delate from "~/assets/demo/delate.svg"
import archieve from "~/assets/demo/archieve.svg"
import defPrjImg from '../../assets/defPrj.svg'

import UiButton from './UiButton.vue'
import UiInput from './UiInput.vue'
import UiTextArea from './UiTextArea.vue'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import { ref, computed, onMounted } from 'vue'
import { modalActionsList } from '~/helpers/types'
import { sendProposition } from '~/API/ways/notifications';
import { useRoute } from 'vue-router';
import { patchVacancy, getVacancy, deleteVacancy, getVacancyById } from '~/API/ways/project'
const router = useRoute()
const props = defineProps({
    data: {
        type: Object || Array,
        default: () => [],
    },
    card: {
        type: Boolean,
        default: false,
    },
    project: {
        type: String,
    },
    readOnly: {
        type: Boolean,
        default: false,
    },
    archieve: {
        type: Boolean,
        default: false,
    },
    vacancyID: {
        type: Number
    }
})
const initialVacancyParams = ref({
    description: props.data.description,
    offer: props.data.offer,
    archive: props.data.archive,
});
const vacancyParams = ref({
    description: props.data.description,
    offer: props.data.offer,
    archive: props.data.archive
});
const isFormChanged = computed(() => {
    return (
        vacancyParams.value.description !== initialVacancyParams.value.description ||
        vacancyParams.value.offer !== initialVacancyParams.value.offer ||
        vacancyParams.value.archive !== initialVacancyParams.value.archive
    );
});
// API call to get vacancy details
const getVacancyApi = async () => {
    try {
        const response = await getVacancy(router.params.ID);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
};
const getVacancyByIDApi = async () => {
    try {
        const response = await getVacancyById(router.params.ID, props.vacancyID);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
};

// Function to update vacancy data
const changeVacancy = async () => {
    const vacancyData = {
        description: vacancyParams.value.description,
        offer: vacancyParams.value.offer,
        id: props.vacancyID
    };

    try {
        await patchVacancy(router.params.ID, vacancyData); // Update the vacancy using its ID
        await getVacancyApi(); // Refresh data
        initialVacancyParams.value = { ...vacancyParams.value }; // Update the initial parameters
        console.log('Vacancy updated successfully');
    } catch (error) {
        console.error('Error updating vacancy:', error);
    }
};

// Function to archive the vacancy
const archiveVacancy = async (type: Boolean) => {
    const vacancyData = {
        description: vacancyParams.value.description,
        offer: vacancyParams.value.offer,
        id: props.vacancyID,
        archive: type
    };
    try {
        await patchVacancy(router.params.ID, vacancyData);
        await getVacancyByIDApi();
        console.log('Vacancy archived successfully');
    } catch (error) {
        console.error('Error archiving vacancy:', error);
    }
};

// Function to delete the vacancy
const deleteVacancys = async () => {
    try {
        await deleteVacancy(router.params.ID, props.vacancyID);
        await getVacancyApi();
        console.log('Vacancy deleted successfully');
    } catch (error) {
        console.error('Error deleting vacancy:', error);
    }
};
const resetForm = () => {
    vacancyParams.value = { ...initialVacancyParams.value };
};
// Fetch vacancy data on component mount
onMounted(getVacancyApi);
onMounted(getVacancyByIDApi);
const modalState = ref(null)
const vacancyPanel = ref(null)
const propMessage = ref('')
const sendPropositions = async () => {
    const proposition = {
        answer: 'YES',
        message: propMessage.value,
        project: {
            id: router.params.ID,
        },
        propositionDirection: 'USER_TO_PROJECT',
        user: {
            id: localStorage.getItem('userId'),
        },
    };
    try {
        await sendProposition(proposition);
    } catch (error) {
        console.error(error);
    }
};


const editableModalItems: modalActionsList[] = [
    {
        name: 'Удалить вакансию',
        icon: delate,
    },
    {
        name: 'Архивировать',
        icon: archieve,
    },
]
</script>

<style lang="scss" scoped>
.ui-vacancyPanel {
    &__head {
        padding: 10px 20px;
        display: flex;
        gap: 10px;
        align-items: center;
        max-width: fit-content;
        border-radius: 8px;
        background: #e1f5fe;
    }

    &__inputs {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    &--card {
        border-radius: 12px;
        background: $def-white;
        padding: 23px 20px !important;
    }
}

.ui-vacancyPanel :deep() {
    border: 1px solid $def-white;

    .v-expansion-panel__shadow {
        display: none;
    }

    .v-expansion-panel-title__overlay {
        opacity: 0;
    }

    .v-expansion-panel-text__wrapper {
        padding: 23px 20px;
        padding-top: 8px;
    }

    .v-expansion-panel-title__overlay {
        border-radius: 12px;
        background: $def-white;
        padding: 23px 20px !important;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    }
}

.v-expansion-panel--active {
    border-radius: 12px !important;
    background: #ffffff;
    border: #c7edff 1px solid !important;
}
.box-shadow {
    background-color: white; /* Цвет фона бокса */
    border-radius: 50%; /* Для круглой формы */
    box-shadow: 0 0 0px rgba(0, 0, 0, 0.1),
                0 0 20px rgba(0, 0, 0, 0.1),
                0 0 0px rgba(0, 0, 0, 0.1);
}

</style>
