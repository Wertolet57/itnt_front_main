<template>
    <Header showID showUserMinify showControlDots />
    <ProfileHeader :bg-pic="fullBannerUrl" :ava-pic="fullAvatarUrl" readOnly />
    <v-container class="pa-6" style="padding: 0 20px; margin-bottom: 48px">
        <div v-if="!hasData">
            <ProfileInfo :userId="data.id" :proposition="data.openedForProposition" :profile="true"
                :userName="data.firstName" :userSurname="data.lastName" :userDescription="data.fullDescription" />
            <p class="text-center text-[18px] font-[16px]">Пользователь ещё не поделился подробной информацией о себе
                исвоих навыках.</p>
        </div>
        <div class="" v-else>
            <ProfileInfo :proposition="data.openedForProposition" :profile="true" :userName="data.firstName"
                :userSurname="data.lastName" :userDescription="data.fullDescription" />
            <UiSkills :skillList="data.interests" readOnly />
            <ProjectsList :read-only="true" class="my-8" :projects="data.projects" />
        </div>
        <div v-if="posts" v-for="post in posts">
            <ProjectBlog :blog-data="post" :authorID="post.authorUser.id" :author="post.authorUser.firstName"
                user-type="user" feedCardType="newProjectStage" />
        </div>
    </v-container>
    <Footer />
</template>

<script setup lang="ts">
// ui-kit
// import UiButton from '~/components/ui-kit/UiButton.vue'
import UiSkills from '~/components/ui-kit/UiSkills.vue'
import UiInput from '~/components/ui-kit/UiInput.vue'
// page components
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import ProfileInfo from '~/components/profile/ProfileInfo.vue'
import ProjectsList from '~/components/profile/ProjectsList.vue'
import ProfileHeader from '~/components/profile/ProfileHeader.vue'
import ProjectBlog from '~/components/projects/ProjectBlog.vue'
import { onMounted, ref, computed } from 'vue'
import { getUserByID, getUserPosts } from '~/API/ways/user.ts'
import { useRoute } from 'vue-router'
const route = useRoute();
const lastPart = ref(null);

let data = ref({})
onMounted(() => {
    const fullPath = window.location.origin + route.fullPath;
    const parts = fullPath.split('/');
    lastPart.value = parts[parts.length - 1];
    console.log(lastPart.value);

});
onMounted(async () => {
    try {
        const response = await getUserByID(lastPart.value);
        data.value = response.data.object;
        console.log(response);
    } catch (e) {
        console.error('error:', e);
    }
})


let posts = ref()
onMounted(async () => {
    try {
        const response = await getUserPosts(lastPart.value);
        posts.value = response.data.object;

        console.log(response);
    } catch (e) {
        console.error('error:', e);
    }
})
const hasData = computed(() => {
    const excludedKeys = ['id', 'login', 'confirmed', 'loginType', 'errorConfirm', 'firstEntry', '', '', '']
    return Object.entries(data.value).some(([key, value]) => {
        return !excludedKeys.includes(key) && value !== null && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
    })
})
const baseURL ='https://itnt.store/';

const fullAvatarUrl = computed(() => {
    return data.value.pictureUrl ? `${baseURL}files/${data.value.pictureUrl}` : '';
});
const fullBannerUrl = computed(() => {
    return data.value.backgroundPictureUrl ? `${baseURL}files/${data.value.backgroundPictureUrl}` : '';
});
</script>

<style scoped></style>
