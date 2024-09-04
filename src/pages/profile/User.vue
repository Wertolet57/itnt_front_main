<template>
    <Header showID :showUserMinify="true" />
    <ProfileHeader :read-only="true" :bg-pic="fullBannerUrl" :ava-pic="fullAvatarUrl" />
    <v-container style="padding: 0 20px; margin-bottom: 48px">
        <ProfileInfo :proposition="userInfo.openedForProposition" :user-description="userInfo.fullDescription"
            :user-name="userInfo.firstName" :city="userInfo.city" :country="userInfo.country"
            :user-surname="userInfo.lastName" :read-only="true" />
        <UiSkills :skillList="userInfo.lastName" />
        <UiButton class="mt-4" @click="$router.push('/project/new')" bgColor="blue">Создать проект</UiButton>
        <!-- {{ userInfo }} -->

        <vue-bottom-sheet :click-to-close="true" :background-scrollable="false" ref="modalState">
            <div class="min-h-[350px]">
                <div class="searchTeammateModal__items">
                    <UiPost :user-auth="true" v-model:description-header="postData.descriptionHeader"
                        v-model:description="postData.description" :author-project="postData.authorProject"
                        @postSuccess="closeModal" :author-user="postData.authorUser" card />
                </div>
            </div>
        </vue-bottom-sheet>
        <ProjectsList class="mt-12" :projects="userInfo.projects" />
        <div class="my-[48px]">
            <h1>Что у меня нового:</h1>
            <UiInput @click="modalState.open()" label="Расскажите, чем запомнился день" />
        </div>
        <!-- <div v-for="(post, id) in posts" :key="id" class="mt-6">
            <div class="" v-for="(object, id) in post.object" :key="id">
                <FeedPost :post="object" :id="object.id" />
            </div>
        </div> -->
        <button @click="addComments">addComments</button>
        <div v-if="posts && posts.object" v-for="(post, index) in posts" :key="index">
            <ProjectBlog :blog-data="post" user-type="me" withoutBg feedCardType="newProjectStage" />
        </div>
    </v-container>
    <Footer />
</template>

<script setup lang="ts">
import ProjectBlog from '~/components/projects/ProjectBlog.vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import UiPost from '~/components/ui-kit/UiPost.vue'
import UiButton from '~/components/ui-kit/UiButton.vue'
import UiInput from '~/components/ui-kit/UiInput.vue'
import UiSkills from '~/components/ui-kit/UiSkills.vue'
import ProfileInfo from '~/components/profile/ProfileInfo.vue'
import ProjectsList from '~/components/profile/ProjectsList.vue'
import ProfileHeader from '~/components/profile/ProfileHeader.vue'
import { getUserByID } from '~/API/ways/user.ts'
import { isAuth } from '~/helpers/routerHandler'
import { onMounted, ref, computed } from 'vue';
import { getPostByUser, addComment } from '~/API/ways/post';
// import FeedPost from '~/components/feed/FeedPost.vue';
let posts = ref();
const closeModal = () => {
    if (modalState.value) {
        modalState.value.close();
    }
};
const addComments = async () => {
    const postComment = {
        post: {
            id: 5
        },
        user: {
            id: 5
        },
        message: 'sdsdsdsdsd',
    };
    try {
        const data = await addComment(postComment);
        posts.value = data?.data?.object
    } catch (error) {
        console.error('Error adding comment:', error);
    }
};

const getPosts = async () => {
    try {
        const data = await getPostByUser(Number(localStorage.getItem('userId')));
        posts.value = data.data.object;
    } catch (error) {
        console.error(error);
    }
};
const postData = ref({
    descriptionHeader: '',
    description: '',
    authorProject: null,
    authorUser: localStorage.getItem('userId'),
});
onMounted(getPosts);
const modalState = ref(null);

isAuth();

let userInfo = ref({});
onMounted(async () => {
    await getUserByID(Number(localStorage.getItem("userId"))).then((response) => {
        try {
            userInfo.value = response.data.object;
            console.log(userInfo.value)
        } catch (e) {
            console.error('text error:', e);
        }
    })
})
const baseURL = 'http://62.217.181.172/';

const fullAvatarUrl = computed(() => {
    return userInfo.value.pictureUrl ? `${baseURL}files/${userInfo.value.pictureUrl}` : '';
});
const fullBannerUrl = computed(() => {
    return userInfo.value.backgroundPictureUrl ? `${baseURL}files/${userInfo.value.backgroundPictureUrl}` : '';
});
</script>

<style scoped></style>
