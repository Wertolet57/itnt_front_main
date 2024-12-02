<template>
    <Header showID :showUserMinify="true" />
    <ProfileHeader :me="true" :read-only="true" :bg-pic="fullBannerUrl" :ava-pic="fullAvatarUrl" />

    <v-container style="padding: 0 20px; margin-bottom: 48px">
        <ProfileInfo :proposition="userInfo.openedForProposition" :user-description="userInfo.fullDescription"
            :user-name="userInfo.firstName" :city="userInfo.city ? userInfo.city.name : ''"
            :country="userInfo.country ? userInfo.country.name : ''" :user-surname="userInfo.lastName"
            :read-only="true" />
        <UiSkills @update-skills="updateUserSkills" :skillList="userInfo.interests" />
        <UiButton class="mt-4" @click="$router.push('/project/new')" bgColor="blue">{{ $t('create') }}</UiButton>
        <v-bottom-sheet inset v-model="isBottomSheetOpen" :click-to-close="true" :background-scrollable="false">
            <div class="min-h-[350px]">
                <div class="searchTeammateModal__items">
                    <UiPost :user-auth="true" v-model:description-header="postData.descriptionHeader"
                        v-model:description="postData.description" :author-project="postData.authorProject"
                        :author-user="postData.authorUser" @postSuccess="closeBottomSheet" card />
                </div>
            </div>
        </v-bottom-sheet>
        <ProjectsList class="mt-12" :projects="userInfo.projects" />
        <div class="my-[48px]">
            <h1>{{ $t('Post.new') }}</h1>
            <UiInput @click="openBottomSheet" :label="$t('Post.day')" />
        </div>
        <div v-if="posts" v-for="post in posts">
            <ProjectBlog :delete="() => deletePost(post.id)" :blog-data="post" user-type="me"
                :authorID="post.authorUser.id" :author="post.authorUser.firstName" feedCardType="newProjectStage" />
        </div>
        <div class="">
            <div class="image-gallery">
                <!-- Отображение загруженных изображений -->
                <div v-for="(image, index) in previewImages" :key="index" class="image-item">
                    <img :src="image" alt="Uploaded image" />
                    <button class="delete-btn" @click="removeImage(index)">×</button>
                </div>

                <!-- Кнопка добавления нового изображения -->
                <div v-if="previewImages.length < maxImages" class="add-item" @click="handleAddImage">
                    <span>+</span>
                </div>
                <!-- Кнопка отправки -->
                <button @click="submitImages" class="submit-btn">Отправить</button>
            </div>
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
import { getUserByID, getUserPosts } from '~/API/ways/user.ts'
import { isAuth } from '~/helpers/routerHandler'
import { delPost } from "../../API/ways/post"
import { onMounted, ref, computed } from 'vue';
import { postProject } from "~/API/ways/post";
let posts = ref();
const postData = ref({
    descriptionHeader: '',
    description: '',
    authorProject: null,
    authorUser: localStorage.getItem('userId'),
});
const isBottomSheetOpen = ref(false);
const closeBottomSheet = async () => {
    isBottomSheetOpen.value = false;
    await getPosts()
};
const openBottomSheet = async () => {
    isBottomSheetOpen.value = true;
};
const getPosts = async () => {
    try {
        const data = await getUserPosts(Number(localStorage.getItem('userId')));
        posts.value = data.data.object;
    } catch (error) {
        console.error(error);
    }
};
const deletePost = async (postID: number) => {
    try {
        await delPost(postID)
        await getPosts()
    } catch (error) {
        console.error('Ошибка при удалении поста:', error)
    }
}
onMounted(getPosts);
const modalState = ref(null);

isAuth();
onMounted(async () => {
    await fetchUserInfo();
});
let userInfo = ref({});
const fetchUserInfo = async () => {
    await getUserByID(Number(localStorage.getItem("userId"))).then((response) => {
        try {
            userInfo.value = response.data.object;
            console.log(userInfo.value)
        } catch (e) {
            console.error('text error:', e);
        }
    })
}
const updateUserSkills = async (newSkills: any) => {
    userInfo.value.interests = newSkills;
    await fetchUserInfo();
};
const baseURL = 'https://itnt.store/';

const fullAvatarUrl = computed(() => {
    return userInfo.value.pictureUrl ? `${baseURL}files/${userInfo.value.pictureUrl}` : '';
});
const fullBannerUrl = computed(() => {
    return userInfo.value.backgroundPictureUrl ? `${baseURL}files/${userInfo.value.backgroundPictureUrl}` : '';
});
const maxImages = 10;
const files = ref([]);
const previewImages = ref([]);

const handleAddImage = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (file && files.value.length < maxImages) {
      files.value.push(file);
      const reader = new FileReader();
      reader.onload = (e) => previewImages.value.push(e.target.result);
      reader.readAsDataURL(file);
    }
  };
  input.click();
};

const removeImage = (index:any) => {
  previewImages.value.splice(index, 1);
  files.value.splice(index, 1);
};

const submitImages = async () => {
  try {
    const background = files.value[0] || null;
    const otherFiles = files.value.slice(1); 
    const postData = {
      description: 'Описание проекта',
      descriptionHeader: 'Заголовок проекта',
      authorProject: { id: 1 },
      authorUser: { id: 1 },
    };
    const response = await postProject(background, otherFiles, postData);
    console.log('Успешно отправлено:', response);
  } catch (error) {
    console.error('Ошибка при отправке:', error);
  }
};
</script>

<style scoped>
.form-group {
    position: relative;
    max-width: 300px;
    margin-bottom: 40px;
}

label {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 16px;
    color: black;
    background-color: #FAFAFA;
    padding: 0 0px;
    transition: 0.2s ease;
    z-index: 1;
    pointer-events: none;
    /* Отключаем события для label, чтобы не мешать кликам по select */
}

select option:first-child {
    display: none;
}

select {
    appearance: none;
    background-color: #FAFAFA;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 15px 10px;
    font-size: 16px;
    width: 100%;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease;
}

select:focus {
    border-color: #007bff;
    outline: none;
}

select:focus+label,
/* Когда select в фокусе, label поднимается */
select:not([value=""]):valid+label {
    /* Когда значение выбрано, label поднимается */
    top: -12px;
    left: 8px;
    font-size: 16px;
    color: #007bff;
    z-index: 2;
    /* Убираем z-index после перемещения, чтобы label не закрывал select */
}

/* Стрелка для select */
select {
    position: relative;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23000000' d='M12 15.5l7-7H5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px top 50%;
    background-size: 16px;
}
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: flex-start;
  padding: 20px;
  background-color: #f7f8fa;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.image-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.image-item:hover {
  transform: scale(1.05);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.3s;
}

.delete-btn:hover {
  background: rgba(255, 0, 0, 0.8);
}

.add-item {
  width: 100px;
  height: 100px;
  border: 2px dashed #ccc;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: #f9f9f9;
  color: #aaa;
  font-size: 32px;
  transition: background 0.3s, color 0.3s;
}

.add-item:hover {
  background: #e0e0e0;
  color: #555;
}

.submit-btn {
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.3s, transform 0.2s;
}

.submit-btn:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}
</style>
