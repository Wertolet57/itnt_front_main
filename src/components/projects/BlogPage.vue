<template>
  <Header showID show-user-minify />
  <div class="comments-section">
    <div class="mx-4 text-md font-medium" >Коментарии к проекту:</div>
    <ProjectHeader :commentText="true" :prjAva="fullAvatarUrl" :prj-name="data.name" :prjID="data.id"
      :prj-slogan="data.slogan" />
    <CommentSection :postId="2" :userId="5" />
  </div>
</template>

<script setup>
import Header from "../Header.vue"
import ProjectHeader from '../projects/ProjectHeader.vue'
import CommentSection from "./CommentSection.vue"
import { ref, onMounted, computed } from 'vue';
import defAva from "~/assets/demo/projectsmallphoto.svg"
import { useRoute } from 'vue-router'
import { getProjectByID } from '~/API/ways/project.ts'
const baseURL = 'http://62.217.181.172/';
let data = ref({})
const route = useRoute()

onMounted(async () => {
  await getProjectByID(route.params.ID).then((response) => {
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