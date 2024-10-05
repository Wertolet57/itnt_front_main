<template>
    <div v-if="props.readOnly">
        <div class="d-flex mb-3 align-center">
            <p style="color: #263238" class="txt-cap2 mr-5">Будем рады видеть в команде:</p>
        </div>
        <div class="" v-if="vacancy" v-for="job in vacancy">
            <UiVacancyPanel class="mb-2" :project="props.projectName" card readOnly :data="job" />
        </div>
    </div>
    <div v-else>
        <div v-if="vacancy.length > 0" class="d-flex mb-3 align-center justify-space-between">
            <p style="color: #263238" class="txt-cap2 mr-5">Открытые вакансии</p>
            <UiButton @click="modalState.open()" fit style="height: 36px; padding: 11px 16px; font-size: 16px" isSmall>
                Архив
            </UiButton>
            <vue-bottom-sheet ref="modalState">
                <div class="min-h-[350px]">
                    <p class="mb-2 px-4 pl-12 py-2">Архив ваших вакансий:</p>
                    <div class="searchTeammateModal__items mx-4" v-if="vacancy" v-for="job in vacancy">
                        <v-expansion-panels class="top-overlay" v-if="job.archive == true">
                            <v-expansion-panel class=" rounded-[16px]" elevation="0">
                                <v-expansion-panel-title overlay="none" class="feedPanel__head">
                                    <template v-slot:actions="{ expanded }">

                                        <img :src="commit">
                                    </template>
                                    <div class="projectTeam__item d-flex justify-space-between">
                                        <div class="d-flex projectTeam__item__main">
                                            <div class="txt-body2">
                                                <p style="color: #263238">{{ job.offer }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </v-expansion-panel-title>

                                <v-expansion-panel-text>
                                    <UiVacancyPanel :vacancyID="job.id" card :data="job" />
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                            <v-expansion-panel class="rounded-[16px]" elevation="0">
                                <v-expansion-panel-title overlay="none" class="feedPanel__head">
                                    <template v-slot:actions="{ expanded }">

                                        <img :src="commit">
                                    </template>
                                    <div class="projectTeam__item d-flex justify-space-between">
                                        <div class="d-flex projectTeam__item__main">
                                            <div class="txt-body2">
                                                <p style="color: #263238">{{ job.offer }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </v-expansion-panel-title>

                                <v-expansion-panel-text>
                                    <UiVacancyPanel :vacancyID="job.id" card :data="job" />
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </div>
                </div>

            </vue-bottom-sheet>

        </div>
        <div class=" my-2" v-if="vacancy" v-for="job in vacancy">
            <UiVacancyPanel v-if="job.archive == false" :vacancyID="job.id" card :data="job" />

        </div>
        <div class="d-flex mt-2 justify-space-between align-center">
            Добавить вакансию
            <UiButton @click="vacansyState.open()" plus />
        </div>
        <div>

        </div>
        <vue-bottom-sheet ref="vacansyState">
            <div class="min-h-[350px] p-4">
                <!-- <input type="checkbox" label="Должность*" v-model="vacancyParams.archive" /> -->
                <UiTextArea label="Описание*" v-model="vacancyParams.description" />
                <UiInput label="Что мы предлагаем*" v-model="vacancyParams.offer" />
                <div class="" @click="vacansyState.close()">
                    <UiButton class="mt-4" @click="postVacancy" bg-color="blue">Добавить вакансию</UiButton>
                </div>
            </div>

        </vue-bottom-sheet>
        <v-snackbar v-model="snackbarVisible" min-width="270px" max-height="46px" :timeout="4000" color="white"
            rounded="lg">
            <div class="flex flex-row justify-between items-center">
                Вакансия добавлена в проект
            </div>
        </v-snackbar>
    </div>



</template>

<script setup lang="ts">
import commit from "../../assets/icons/commit.svg"
import UiVacancyPanel from '../ui-kit/UiVacancyPanel.vue'
import UiButton from '../ui-kit/UiButton.vue'
import UiInput from '../ui-kit/UiInput.vue'
import UiTextArea from '../ui-kit/UiTextArea.vue'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import { ref, onMounted } from 'vue'
import { sendProposition, getProjectPropositions } from '~/API/ways/notifications'
import { addVacancy, getVacancy } from '~/API/ways/project'
import { useRoute } from 'vue-router'
const props = defineProps({
    readOnly: {
        type: Boolean,
        default: false,
    },
    projectId: {
        type: Number
    },
    projectName: {
        type: String
    }
})
const vacancy = ref([])
const getVacancyApi = async () => {
    try {
        const response = await getVacancy(router.params.ID)
        vacancy.value = response.data.object
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
onMounted(getVacancyApi)
const router = useRoute()
const snackbarVisible = ref(false)
const vacancyParams = ref({
    archive: false,
    description: '',
    offer: '',
});
const postVacancy = async () => {
    try {
        await addVacancy(router.params.ID, vacancyParams.value);
        vacansyState.value = false
        snackbarVisible.value = true
        await getVacancyApi()
    } catch (error) {
        console.error('Error adding vacancy:', error);
    }
};
const getProjectPropositionsApi = async () => {
    try {
        const response = await getProjectPropositions(Number(router.params.ID));
        console.log('getProjectPropositions', response)
    } catch (error) {

    }
}

onMounted(getProjectPropositionsApi)
// const sendProp = async () => {
//     console.log(localStorage.getItem('userId'), router.params.ID);

//     if (localStorage.getItem('userId') && router.params.ID) {
//         try {
//             const response = await sendProposition(router.params.ID, 1, 'vacancy', "US")
//             console.log(response)
//             await getProjectPropositionsApi()
//         } catch (error) {
//             console.error('Error sending proposition:', error)
//         }
//     }
// }


const modalState = ref(null)
const vacansyState = ref(false)
</script>

<style scoped lang="scss">
.searchTeammateModal {
    &__items {
        display: flex;
        flex-direction: column;
        gap: 10px;

    }

    &__item {
        display: flex;
        align-items: center;
        gap: 16px;
    }
}

.top-overlay {
    position: relative;
    border-radius: 16px;
    box-shadow: 0px -1px 2.5px rgba(0, 0, 0, 0.1), 0px 1px 2.5px rgba(0, 0, 0, 0.1);

}
</style>
