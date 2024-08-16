<template>
    <Header showUserMinify />
    <ProjectHeader />
    <v-container>
        <ProjectCard />

        <div class="">
            <UiButton @click="postNewProject" class="mt-12" bgColor="blue">Опубликовать проект</UiButton>
        </div>
        <v-snackbar v-model="snackbarVisible" min-width="270px" max-height="46px" :timeout="3000" color="white" rounded="lg">
            <div class="flex flex-row justify-between items-center">
                Проект создан
            </div>
        </v-snackbar>
    </v-container>
    <Footer />
</template>

<script setup lang="ts">
import Footer from '~/components/Footer.vue'
import Header from '~/components/Header.vue'
import UiButton from '~/components/ui-kit/UiButton.vue'
import ProjectCard from '~/components/projects/ProjectCard.vue'
import ProjectHeader from '~/components/projects/ProjectHeader.vue'
// import ProjectMedia from '~/components/projects/ProjectMedia.vue'
// import ProjectVacancys from '~/components/projects/ProjectVacancys.vue'

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { postProject } from '~/API/ways/project'
import { useProjectStore } from '~/store/projectStore'

const prjStore = useProjectStore()
const snackbarVisible = ref(false)
const router = useRouter()

async function postNewProject() {
    await postProject(prjStore.$state.prjObject).then((response: any) => {
        try {
            console.log(response)
            snackbarVisible.value = true

            // Используем setTimeout для выполнения перехода через 5 секунд
            setTimeout(() => {
                router.push('/me')
            }, 3000)
        } catch (e) {
            console.log('error : ', e)
        }
    })
}
</script>
