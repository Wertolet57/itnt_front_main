<template>
    <div class="projectHeader">
        <div v-if="props.readOnly || props.commentText" class="ava">
            <img :src="props.prjAva" />
        </div>
        <div class="back w-full" v-else>
            <div class="upload-wrapper">
                <div v-if="!props.prjAva" class="mx-auto cursor-pointer">
                    <v-file-input @change="uploadImage" accept="image/png, image/jpeg, image/bmp"
                        class="input-file bg-black" />
                    <img src="../../assets/img/regSteps/addProfilePic.svg" class="rounded-circle" height="208"
                        width="208" />
                </div>
                <div v-else class="ava">
                    <img :src="props.prjAva" height="208" width="208" />
                </div>
            </div>
        </div>

        <div v-if="props.readOnly" class="projectHeader__container">
            <h2>{{ props.prjName }}</h2>
            <div v-if="props.prjType" class="projectHeader__capital">{{ props.prjType }}</div>
            <p>{{ props.prjSlogan }}</p>
            <div class="projectHeader__controls">
                <div class="d-flex justify-space-between mt-2 mb-4">
                    <UiButton :bgColor="isFollowing ? 'def' : 'blue'" @click="isFollowing ? deletefollow() : follow()" style="max-width: 152px">
                        {{ isFollowing ? 'Отписаться' : 'Подписаться' }}
                    </UiButton>
                    <v-snackbar v-model="snackbarVisible" min-width="270px" max-height="46px" :timeout="5000"
                        color="white " rounded="lg">
                        <div class="flex flex-row justify-between items-center">
                            {{ isFollowing ? 'Подписка оформлена' : 'Вы отписались' }}
                        </div>
                    </v-snackbar>
                    <UiButton @click="shareProject()" :imgSrc="shareIcon" onlyIcon />
                    <Fire :id="props.prjID" />
                </div>
                <UiButton @click="$router.push(`/`+ props.prjID + '/blogComment')" bgColor="def"
                    :imgSrc="messageIcon">
                    Обсуждение проекта</UiButton>
            </div>
        </div>
        <!-- Comment Page Header -->
        <div v-if="props.commentText" class="">
            <div class="mt-5 mb-7 mx-4">
                <div class="d-flex justify-space-between">
                    <h2>{{ props.prjName }}</h2>
                    <div v-show="props.prjType" class="projectHeader__capital txt-body1">{{ props.prjType }}</div>
                </div>
                <p class="txt-body1">{{ props?.prjSlogan }}</p>
            </div>
        </div>
        <!-- EDITABLE -->
        <div class="projectHeader__edit" v-if="!props.commentText && !props.readOnly">
            <UiInput label="Название проекта*" v-model="prjObject.name" :required="true" />
            <UiInput label="Слоган" v-model="prjObject.slogan" :required="true" />
            <UiInput label="id проекта" v-model="nickName" :required="true" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Fire from '../Fire.vue';
import UiButton from '../ui-kit/UiButton.vue';
import UiInput from '../ui-kit/UiInput.vue';
import { storeToRefs } from 'pinia'
import { addProjectAvatar, addFollow, delFollow, getProjectByID } from '~/API/ways/project.ts';
import { getUserByID } from '~/API/ways/user';
import messageIcon from "~/assets/icons/message-black.svg";
import { useProjectStore } from '~/store/projectStore'

import shareIcon from "~/assets/icons/share-black.svg";
const route = useRoute();
const props = defineProps({
    readOnly: { type: Boolean, default: false, },
    commentText: { type: Boolean, default: false, },
    prjName: String,
    prjSlogan: String,
    prjType: String,
    prjID: Number,
    prjAva: String
});
const userID = localStorage.getItem("userId");
const prjAva = ref(props.prjAva);
const snackbarVisible = ref(false);
const isFollowing = ref(false);
const user = ref();
const followers = ref([]);
const projects = ref([]);
const { prjObject } = storeToRefs(useProjectStore())
onMounted(async () => {
    try {
        user.value = (await getUserByID(Number(userID))).data.object;
        const projectData = await getProjectByID(route.params.ID);
        projects.value = projectData.data.object.users;
        followers.value = projects.value.filter(user => user.relationType === 'PROJECT_FOLLOWER');
    } catch (error) {
        console.error('Error loading data:', error);
    }
});
const nickName = ref('itnthub' + `${prjObject.nickName}`)

async function uploadImage(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
        await addProjectAvatar(formData, Number(route.params.ID));
        prjAva.value = URL.createObjectURL(file);
    } catch (error) {
        console.error('Error uploading avatar:', error);
    }
}
async function checkFollowStatus() {
    try {
        const response = await getProjectByID(route.params.ID);
        const followers = response.data.object.users.filter(relation => relation.relationType === 'PROJECT_FOLLOWER');
        // Проверяем, есть ли текущий пользователь среди подписчиков
        isFollowing.value = followers.some(follower => follower.user.id === Number(userID));
    } catch (e) {
        console.error('Error fetching project followers:', e);
    }
}


async function follow() {
    try {
        await addFollow(Number(props.prjID));
        isFollowing.value = true;
        snackbarVisible.value = true;
    } catch (error) {
        console.error('Error following project:', error);
    }
}
async function deletefollow() {
    try {
        await delFollow(Number(props.prjID), userID);
        isFollowing.value = false;
        snackbarVisible.value = true;
    } catch (error) {
        console.error('Error following project:', error);
    }
}
function shareProject() {
    try {
        navigator.share({
            title: 'ITNT',
            text: 'Check out ITNT!',
            url: 'http://62.113.105.220/'
        });
    } catch (error) {
        console.error('Error sharing project:', error);
    }
}
onMounted(() => {
    checkFollowStatus();
});
</script>

<style lang="scss" scoped>
.projectHeader {
    width: 100%;
    padding-top: 18px;

    &__container {
        padding: 20px;
    }

    &__edit {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 20px;
    }

    &__capital {
        padding: 5px 15px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        background: $def-white;
    }
}

.input-file {
    min-width: 228px;
    min-height: 320px;
    left: 50%;
    z-index: 1;
    transform: translate(-50%, -12%);
    position: absolute;
    opacity: 0;
}

.ava {
    display: flex;
    padding: 0 0 0 20px;
    justify-content: start;

    img {
        aspect-ratio: 110 / 106;
        max-width: 20%;
        height: auto;
        border-radius: 100%;
    }
}
</style>
