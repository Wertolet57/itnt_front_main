<template>
    <Header showID showUserMinify />
    <ProjectHeader />
    <v-container>
        <ProjectCard />
        <ProjectTeam class="mt-12" />
        <!-- <ProjectInvesting /> -->
        <ProjectVacancys class="mt-12" />
        <ProjectMedia :read-only="false" class="mt-12 mb-12" />
        <ProjectStage />

        <div>
            <!-- <div v-for="(file, index) in data.projectFiles" :key="file.id">
                <div v-if="file.pictureUrl && isExternalUrl(file.pictureUrl)">
                </div>
                <div class="" v-if="file.pictureUrl == null || ''">

                </div>
                <div v-else>
                    <img :src="getFileUrl(file.pictureUrl)" alt="Project Image" />
                </div>
            </div> -->
        </div>
        <UiButton @click="changeProject" bgColor="blue" class="mt-12">Опубликовать проект</UiButton>
    </v-container>
    <Footer />
</template>
<script setup lang="ts">
import Footer from '~/components/Footer.vue'
import Header from '~/components/Header.vue'

import UiButton from '~/components/ui-kit/UiButton.vue'
import ProjectHeader from '~/components/projects/ProjectHeader.vue'
import ProjectMedia from '~/components/projects/ProjectMedia.vue'
import ProjectTeam from '~/components/projects/ProjectTeam.vue'
import ProjectCard from '~/components/projects/ProjectCard.vue'
import ProjectVacancys from '~/components/projects/ProjectVacancys.vue'
import ProjectStage from '~/components/projects/ProjectStage.vue'
// import ProjectInvesting from '~/components/projects/ProjectInvesting.vue'

import { getProjectByID, patchProject } from '~/API/ways/project'

import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '~/store/projectStore'
let data = ref({})


const prjStore = useProjectStore()
const router = useRouter()
const route = useRoute()
onMounted(async () => {
    await getProjectByID(route.params.ID).then((response) => {
        try {
            data.value = response.data.object
            prjStore.$state.prjObject.name = response.data.object.name
            prjStore.$state.prjObject.slogan = response.data.object.slogan
            prjStore.$state.prjObject.nickName = response.data.object.nickName
            prjStore.$state.prjObject.description = response.data.object.description
            prjStore.$state.prjObject.descriptionHeader = response.data.object.descriptionHeader
            prjStore.$state.prjObject.avatarUrl = response.data.object.avatarUrl
        } catch (e) {
            console.error('error:', e)
        }
    })
})

async function changeProject() {
    prjStore.$state.prjObject.id = route.params.ID
    const projectData = { ...prjStore.$state.prjObject };
    delete projectData.projectStage;

    await patchProject(projectData).then(() => {
        try {
            router.push('/project/' + route.params.ID)
        } catch (e) {
            console.error('error :', e)
        }
    })
}
</script>
