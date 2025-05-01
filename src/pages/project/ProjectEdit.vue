<template>
    <Header showID showUserMinify />
    <ProjectHeader :class="{ 'ml-[0px]': isSidePanel }" :prjAva="fullAvatarUrl" :read-only="false"  />
    <v-container >
        <ProjectCard />
        <ProjectTeam :userID="owner" :team="data.users" class="mt-12" />
        <!-- <ProjectInvesting /> -->
        <ProjectVacancys class="mt-12" />
        <ProjectStage />
        <ProjectMedia :read-only="false" class="mt-12 mb-12" />
        <div v-if="posts" v-for="post in posts ">
            <ProjectBlog :blog-data="post" :authorID="post.authorProject.id" :author="post.authorProject.name" user-type="me"
            feedCardType="newProjectStage" />
        </div>
        <UiButton @click="changeProject" bgColor="blue" class="mt-12">Опубликовать проект</UiButton>
    </v-container>
    <Footer />
</template>
<script setup lang="ts">
import Footer from '~/components/Footer.vue'
import Header from '~/components/Header.vue'
import ProjectBlog from '~/components/projects/ProjectBlog.vue'
import UiButton from '~/components/ui-kit/UiButton.vue'
import ProjectHeader from '~/components/projects/ProjectHeader.vue'
import ProjectMedia from '~/components/projects/ProjectMedia.vue'
import ProjectTeam from '~/components/projects/ProjectTeam.vue'
import ProjectCard from '~/components/projects/ProjectCard.vue'
import ProjectVacancys from '~/components/projects/ProjectVacancys.vue'
import ProjectStage from '~/components/projects/ProjectStage.vue'
// import ProjectInvesting from '~/components/projects/ProjectInvesting.vue'

import { getProjectByID, patchProject ,getProjectPosts} from '~/API/ways/project'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '~/store/projectStore'
let data = ref({
    users: [],
    avatarUrl: "",
})

const isSidePanel = ref(false);
const owner = ref();
const prjStore = useProjectStore()
const router = useRouter()
const route = useRoute()
onMounted(async () => {
    await getProjectByID(route.params.ID).then((response) => {
        try {
            data.value = response.data.object
            owner.value = response.data.object.owner.id
            // Map all fields from backend to store
            Object.assign(prjStore.$state.prjObject, response.data.object)
        } catch (e) {
            console.error('error:', e)
        }
    })

    // Check window width on mount
    isSidePanel.value = window.innerWidth >= 768;
    
    // Listen for window resize
    window.addEventListener('resize', () => {
        isSidePanel.value = window.innerWidth >= 768;
    });
})

async function changeProject() {
    prjStore.$state.prjObject.id = Number(route.params.ID)
    // Ensure all fields are present in the request body
    const projectData = {
        ...prjStore.$state.prjObject,
        // fallback defaults if any field is missing
        activityFields: prjStore.$state.prjObject.activityFields || [],
        avatarUrl: prjStore.$state.prjObject.avatarUrl || "",
        companyPreferences: prjStore.$state.prjObject.companyPreferences || "",
        competitionInfo: prjStore.$state.prjObject.competitionInfo || "",
        description: prjStore.$state.prjObject.description || "",
        descriptionHeader: prjStore.$state.prjObject.descriptionHeader || "",
        growthRateInfo: prjStore.$state.prjObject.growthRateInfo || "",
        id: Number(route.params.ID),
        marketInfo: prjStore.$state.prjObject.marketInfo || "",
        monetizationInfo: prjStore.$state.prjObject.monetizationInfo || "",
        name: prjStore.$state.prjObject.name || "",
        needInvestment: prjStore.$state.prjObject.needInvestment ?? false,
        needProfessionals: prjStore.$state.prjObject.needProfessionals ?? false,
        nickName: prjStore.$state.prjObject.nickName || "",
        otherAchievementsInfo: prjStore.$state.prjObject.otherAchievementsInfo || "",
        projectDevelopmentInfo: prjStore.$state.prjObject.projectDevelopmentInfo || "",
        projectRegistrationPlaces: prjStore.$state.prjObject.projectRegistrationPlaces || "",
        projectStage: prjStore.$state.prjObject.projectStage || "",
        slogan: prjStore.$state.prjObject.slogan || ""
    };

    await patchProject(projectData).then(() => {
        try {
            router.push('/project/' + route.params.ID)
        } catch (e) {
            console.error('error :', e)
        }
    })
}
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
const baseURL ='https://itnt.store/';

import defAva from "~/assets/demo/projectsmallphoto.svg"

const fullAvatarUrl = computed(() => {
    if(data.value.avatarUrl === "string"){
        return defAva
    }
    else{
        return data.value.avatarUrl ? `${baseURL}files/${data.value.avatarUrl}` : '';
    }
});
</script>
