<template>
    <Header showID show-user-minify />
    <ProjectHeader :prjAva="fullAvatarUrl" readOnly :prj-name="data.name" :prjID="data.id" :prj-slogan="data.slogan" />
    <v-container>
        <ProjectCard readOnly class="mt-12" :prj-desc-body="data.description" :prj-desc-head="data.descriptionHeader" />
        <ProjectTeam :team="data.users" class="mt-12" readOnly />
        <ProjectVacancys class="mt-12" readOnly />
        <!-- <ProjectMedia class="mt-12"  readOnly :link="data.projectFiles[3]" :adress="data.projectFiles[3].pictureUrl" /> -->
        <!-- {{ data.projectFiles[3].pictureUrl }} -->
        <!-- <ProjectMedia class="mt-12" :files="data.projectFiles" readOnly /> -->
        <!-- <img :src="data.projectFiles[1].pictureUrl" alt="1"> -->
        <ProjectStage :stage="data.projectStage" readOnly />
        <vue-bottom-sheet :click-to-close="true" :background-scrollable="false" ref="modalState">
            <div class="min-h-[350px]">
                <div class="searchTeammateModal__items">
                    <UiPost :prj-auth="true" v-model:description-header="postData.descriptionHeader"
                        @postSuccess="closeModal" v-model:description="postData.description"
                        :author-user="postData.authorUser" :author-project="postData.authorProject" card />
                </div>
            </div>
        </vue-bottom-sheet>
        <div class="my-[48px]">
            <h1>Что у меня нового:</h1>
            <UiInput @click="modalState.open()" label="Расскажите, чем запомнился день" />
        </div>

        <!-- {{ data.projectFiles[1] }} -->
        <div v-if="posts" v-for="(post, index) in posts " :key="index">
            <ProjectBlog :blog-data="post" user-type="me" withoutBg feedCardType="newProjectStage" />
        </div>
    </v-container>
    <Footer />
</template>

<script setup lang="ts">
import ProjectBlog from '~/components/projects/ProjectBlog.vue'
import ProjectStage from '~/components/projects/ProjectStage.vue'
import { onMounted, ref, computed, watch } from 'vue'
import { getProjectByID } from '~/API/ways/project.ts'
import { useRoute } from 'vue-router'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import { getPostByProject } from '~/API/ways/post';
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
        const response = await getPostByProject(Number(route.params.ID));
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
const baseURL = 'http://62.217.181.172/';

const fullAvatarUrl = computed(() => {
    return data.value.avatarUrl ? `${baseURL}files/${data.value.avatarUrl}` : '';
});
console.log(data);
console.log(fullAvatarUrl)
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
