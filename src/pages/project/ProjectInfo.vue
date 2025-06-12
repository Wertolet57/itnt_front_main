<template>
    <Header showControlDotsProject showID show-user-minify />
    <v-container>
        <ProjectHeader
            :class="{ 'ml-[0px]': isSidePanel }"
            :prjAva="fullAvatarUrl"
            readOnly
            :prj-name="data.name"
            :prjID="data.id"
            :prj-slogan="data.slogan"
        />
        <ProjectCard readOnly class="mt-12" :prj-desc-body="data.description" :prj-desc-head="data.descriptionHeader" />
        <ProjectTeam :userID="owner" :team="data.users" class="mt-12" readOnly />
        <ProjectVacancys :project-name="data.name" :project-id="data.id" class="mt-12" readOnly />
        <ProjectStage :stage="data.projectStage" readOnly />
        <ProjectMedia class="mt-12" readOnly />
        <vue-bottom-sheet :click-to-close="true" :background-scrollable="false" ref="modalState">
            <div class="min-h-[350px]">
                <div class="searchTeammateModal__items">
                    <UiPost
                        :prj-auth="true"
                        v-model:description-header="postData.descriptionHeader"
                        @postSuccess="closeModal"
                        v-model:description="postData.description"
                        :author-user="postData.authorUser"
                        :author-project="postData.authorProject"
                        card
                    />
                </div>
            </div>
        </vue-bottom-sheet>
        <v-bottom-sheet inset v-model="isBottomSheetOpen" :click-to-close="true" :background-scrollable="false">
            <div class="min-h-[350px]">
                <div class="searchTeammateModal__items">
                    <UiPost
                        :user-auth="true"
                        v-model:description-header="postData.descriptionHeader"
                        v-model:description="postData.description"
                        :author-project="postData.authorProject"
                        @postSuccess="closeBottomSheet"
                        :author-user="postData.authorUser"
                        card
                    />
                </div>
            </div>
        </v-bottom-sheet>
        <div v-if="data && data.owner && data.owner.id == userID" class="my-[48px]">
            <h1 class="font-medium">Что у нас нового:</h1>
            <UiInput @click="openBottomSheet" label="Расскажите, чем запомнился день" />
        </div>
        <div class="mt-8 mb-2" v-else>
            <h1 class="font-medium">Блог проекта:</h1>
        </div>
        <div v-if="posts" v-for="post in posts">
            <ProjectBlog
                :blog-data="post"
                :authorID="post.authorProject.id"
                :author="post.authorProject.name"
                user-type="user"
                feedCardType="newProjectStage"
            />
        </div>
    </v-container>
    <Footer />
</template>

<script setup lang="ts">
import ProjectBlog from '~/components/projects/ProjectBlog.vue'
import ProjectStage from '~/components/projects/ProjectStage.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { getProjectByID, addUser, setNewOwner, getVacancy, getProjectPosts } from '~/API/ways/project.ts'
import { useRoute } from 'vue-router'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
const userID = localStorage.getItem('userId')
const vacancy = ref()
onMounted(async () => {
    await getVacancy(Number(route.params.ID)).then((response) => {
        try {
            vacancy.value = response.data.object
        } catch (e) {
            console.error('error:', e)
        }
    })
})
let data = ref({})
const route = useRoute()
const modalState = ref(null)
const isBottomSheetOpen = ref(false)
const owner = ref()
const closeBottomSheet = async () => {
    isBottomSheetOpen.value = false
    await getPosts()
}
const openBottomSheet = async () => {
    isBottomSheetOpen.value = true
}

onMounted(async () => {
    await getProjectByID(route.params.ID).then((response) => {
        try {
            data.value = response.data.object
            owner.value = response.data.object.owner.id
        } catch (e) {
            console.error('error:', e)
        }
    })
})
let posts = ref()
const getPosts = async () => {
    try {
        const response = await getProjectPosts(Number(route.params.ID))
        posts.value = response.data.object
        console.log(response)
    } catch (e) {
        console.error('error:', e)
    }
}
onMounted(getPosts)
const postData = ref({
    descriptionHeader: '',
    description: '',
    authorProject: route.params.ID,
})
const baseURL = 'https://itnt.store/'
import defAva from '~/assets/demo/projectsmallphoto.svg'

const fullAvatarUrl = computed(() => {
    if (data.value.avatarUrl === 'string') {
        return defAva
    } else {
        return data.value.avatarUrl ? `${baseURL}files/${data.value.avatarUrl}` : ''
    }
})

const isSidePanel = ref(false)

onMounted(() => {
    // Check window width on mount
    isSidePanel.value = window.innerWidth >= 768

    // Listen for window resize
    window.addEventListener('resize', () => {
        isSidePanel.value = window.innerWidth >= 768
    })
})

import Footer from '~/components/Footer.vue'
import Header from '~/components/Header.vue'
import UiInput from '../../components/ui-kit/UiInput.vue'

import UiPost from '../../components/ui-kit/UiPost.vue'
import ProjectHeader from '~/components/projects/ProjectHeader.vue'
import ProjectCard from '~/components/projects/ProjectCard.vue'
import ProjectMedia from '~/components/projects/ProjectMedia.vue'
import ProjectTeam from '~/components/projects/ProjectTeam.vue'
import ProjectVacancys from '~/components/projects/ProjectVacancys.vue'
</script>
