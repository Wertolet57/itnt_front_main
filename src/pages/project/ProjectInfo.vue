<template>
    <Header showID show-user-minify />
    <ProjectHeader :prjAva="fullAvatarUrl" readOnly :prj-name="data.name" :prjID="data.id" :prj-slogan="data.slogan" />
    <v-container>
        <ProjectCard readOnly class="mt-12" :prj-desc-body="data.description" :prj-desc-head="data.descriptionHeader" />
        <ProjectTeam :team="data.users" class="mt-12" readOnly />
        <ProjectVacancys :project-name="data.name" :project-id="data.id" class="mt-12" readOnly />
        <ProjectStage :stage="data.projectStage" readOnly />
        <ProjectMedia class="mt-12" readOnly />
        <vue-bottom-sheet :click-to-close="true" :background-scrollable="false" ref="modalState">
            <div class="min-h-[350px]">
                <div class="searchTeammateModal__items">
                    <UiPost :prj-auth="true" v-model:description-header="postData.descriptionHeader"
                        @postSuccess="closeModal" v-model:description="postData.description"
                        :author-user="postData.authorUser" :author-project="postData.authorProject" card />
                </div>
            </div>
        </vue-bottom-sheet>
        <div v-if="data && data.owner && data.owner.id == userID" class="my-[48px] ">
            <h1 class="font-medium">Что у нас нового:</h1>
            <UiInput @click="modalState.open()" label="Расскажите, чем запомнился день" />
        </div>
        <div class="mt-8 mb-2" v-else>
            <h1 class="font-medium">Блог проекта:</h1>
        </div>
        <div v-if="posts" v-for="post in posts">
            <ProjectBlog :blog-data="post" :authorID="post.authorProject.id" :author="post.authorProject.name" user-type="user"
            feedCardType="newProjectStage" />
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
const userID = localStorage.getItem("userId")
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
const addUsers = async () => {
    try {
        const response = await addUser(10, 24)
        console.log(response);
    } catch (error) {

    }
}
const setNewOwners = async () => {
    try {
        const response = await setNewOwner(10, 7)
        console.log(response);
    } catch (error) {

    }
}
let data = ref({})
const route = useRoute()
const modalState = ref(null);
const closeModal = () => {
    if (modalState.value) {
        modalState.value.close();
    }
};
onMounted(async () => {
    await getProjectByID(route.params.ID).then((response) => {
        try {
            data.value = response.data.object
        } catch (e) {
            console.error('error:', e)
        }
    })
})
let posts = ref()
onMounted(async () => {
    try {
        const response = await getProjectPosts(Number(route.params.ID));
        posts.value = response.data.object
        console.log(response);
    } catch (e) {
        console.error('error:', e);
    }
});
const postData = ref({
    descriptionHeader: '',
    description: '',
    authorProject: route.params.ID,
});
const baseURL ='https://itnt.store/';
import defAva from "~/assets/demo/projectsmallphoto.svg"

const fullAvatarUrl = computed(() => {
    if (data.value.avatarUrl === "string") {
        return defAva
    }
    else {
        return data.value.avatarUrl ? `${baseURL}files/${data.value.avatarUrl}` : '';
    }
});

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
