<template>
    <Header :routeName="$t('page.feed')" showUserMinify />
    <v-col class="pa-0 text-center">
        <v-container class="pa-6">
            <!-- <div class="mb-4 date rounded-xl d-inline-block">{{ $t('feed.today') }}</div>

            <div class="feed__column">
                <FeedPanels />
                <FeedCard feedCardType="newProjectStage" />
                <FeedCard feedCardType="newProjectDiscussed" />
            </div> -->
        </v-container>
        <v-container class="pa-6 pt-0">
            
            <div class="feed__column">
            </div>
            <div v-if="posts && posts.object" v-for="(post, index) in posts.object" :key="index">
                <div v-if="post.authorProject">
                    <ProjectBlog :authorType="'project'" :blog-data="post" :authorID="post.authorProject.id"
                    :author="post.authorProject.name" user-type="user" feedCardType="newProjectStage" />
                </div>
                <div v-else-if="post.authorUser">
                    <ProjectBlog :authorType="'user'" :blog-data="post" :authorID="post.authorUser.id"
                    :author="post.authorUser.firstName || post.authorUser.id || 'Неизвестный пользователь'"
                    user-type="user" feedCardType="newProjectStage" />
                </div>
                <v-skeleton-loader  :elevation="5" type="image, list-item-two-line,list-item-two-line"></v-skeleton-loader>
            </div>
        </v-container>
    </v-col>
    <Footer />
</template>

<script lang="ts" setup>
import ProjectBlog from '~/components/projects/ProjectBlog.vue'
import { onMounted, ref } from 'vue';
import { getPost } from '~/API/ways/post';
import Footer from '~/components/Footer.vue';
import FeedCard from '~/components/feed/FeedCard.vue';
import Header from '~/components/Header.vue';
// import FeedPost from '~/components/feed/FeedPost.vue';
import FeedPanels from '~/components/feed/FeedPanels.vue';
let posts = ref();
const getPosts = async () => {
    try {
        const data = await getPost();
        posts.value = data.data;
    } catch (error) {
        console.error(error);
    }
};
console.log(posts, 'postes');
onMounted(getPosts);
</script>

<style lang="scss" scoped>
.feed {
    &__column {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
}

.date {
    background: rgba(224, 224, 224, 0.5);
    font-size: 13px !important;
    letter-spacing: 0.01em !important;
    padding: 6px 20px;
    line-height: 14px;
}
</style>
