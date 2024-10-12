<template>
  <Header showID show-user-minify />
  <div class="comments-section">
    <div class="mx-4">
      <UiCommentBlog :feed-card-type="'newProjectStage'" :blog-data="data" />
    </div>
    <div class="mx-4 text-md font-medium">Коментарии к посту:</div>
    <CommentSection :postId="postByID" :userId="userData" />
  </div>
</template>

<script setup>
import UiCommentBlog from "../ui-kit/UiCommentBlog.vue"
import Header from "../Header.vue"
import ProjectHeader from '../projects/ProjectHeader.vue'
import CommentSection from "./CommentSection.vue"
import { ref, onMounted, computed } from 'vue';
import defAva from "~/assets/demo/projectsmallphoto.svg"
import { useRoute } from 'vue-router'
import { getPostById } from "../../API/ways/post"
const baseURL ='https://itnt.store/';
let data = ref({})
const route = useRoute()
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