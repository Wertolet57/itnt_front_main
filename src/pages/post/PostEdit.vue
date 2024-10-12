<template>
    <Header showID show-user-minify />
    <div class="comments-section">
        <div class="mx-4">
            <UiCommentBlog v-if="data && data.pictureUrls" @update="updatePost" :editable="true" :feed-card-type="'newProjectStage'"
                :blog-data="data" />
        </div>
    </div>
</template>

<script setup>
import UiCommentBlog from "../../components/ui-kit/UiCommentBlog.vue"
import Header from "../../components/Header.vue"
import { ref, onMounted, computed } from 'vue';
import defAva from "~/assets/demo/projectsmallphoto.svg"
import { useRoute, useRouter } from 'vue-router'
import { getPostById, patchPost } from "../../API/ways/post"
const baseURL = 'http://62.217.181.172/';
let data = ref({})
const route = useRoute()
const router = useRouter()
const userData = localStorage.getItem("userId")
onMounted(async () => {
    await getPostById(route.params.ID).then((response) => {
        try {
            data.value = response.data.object
        } catch (e) {
            console.error('error:', e)
        }
    })
})
const postData = {
    id: data.id,
    descriptionHeader: data.descriptionHeader,
    description: data.description
}
const updatePost = async (updatedData) => {
    try {
        await patchPost(updatedData.description, updatedData.descriptionHeader, null, updatedData.id)
        data.value = { ...updatedData }
        console.log('Post updated successfully')
        router.push('/me')
    } catch (error) {
        console.error('Error updating post:', error)
    }
}
const fullAvatarUrl = computed(() => {
    if (data.value.avatarUrl === "string") {
        return defAva
    }
    else {
        return data.value.avatarUrl ? `${baseURL}files/${data.value.avatarUrl}` : '';
    }
});
const postByID = route.params.ID
</script>

<style scoped>
.comments-section {
    margin-top: 20px;
}

.comment {
    margin-bottom: 15px;
    padding: 10px;
    border: 1px solid #ddd;
}

.reply {
    margin-left: 20px;
    padding: 5px;
    border-left: 2px solid #ddd;
}
</style>