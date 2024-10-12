<template>
    <div>
        <Swiper v-if="props.readOnly" :id="props.postId" />
        <div v-if="!props.readOnly" class="photo-upload grid grid-cols-3 gap-4">
            <div v-for="file in data" :key="file.id" class="relative">
                <img @click="toggleDelete" :src="`${baseUrl}/${file.pictureUrl}`" alt="Project Image"
                    class="slider__image" />
                <div @click="deleteSlide(file.id)" v-if="delMode === true" class="close">
                    <span class="close__button">
                        <img :src="close" alt="">
                    </span>
                </div>
            </div>
            <div v-if="data.length < 5" class="upload-wrapper">
                <label for="new-upload" class="file-upload-label">
                    <input id="new-upload" type="file" @change="handleFileChange" accept="image/*" />
                    <span class="icon">
                        <v-icon icon="mdi-plus" />
                    </span>
                </label>
            </div>
        </div>

        <v-dialog v-model="dialog" width="90%">
            <v-row class="pa-2 pt-0 pb-2 ma-0" justify="end">
                <v-icon class="close-button" @click="dialog = false" icon="mdi-close" />
            </v-row>
            <div class="flex justify-center">
                <v-img :src="selectedImageUrl" class="border" style="max-height: 80vh; max-width: 70vw;" cover
                    aspect-ratio="1"></v-img>
            </div>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPostById, delPostFile, addPostFile } from '~/API/ways/post';
import Swiper from "../components/PostSwiper.vue"
import close from "../assets/icons.svg";
const props = defineProps({
    readOnly: { type: Boolean, default: false },
    postId: { type: Number, required: true }
});
const delMode = ref(false)
const toggleDelete = () => {
    delMode.value = !delMode.value
    console.log(delMode.value);
}
const data = ref([]);
const dialog = ref(false);
const selectedImageUrl = ref<string | null>(null);

const getProjectByIDApi = async () => {
    try {
        const response = await getPostById(props.postId);
        data.value = response.data.object.pictureUrls;
    } catch (e) {
        console.error('error:', e);
    }
};

onMounted(getProjectByIDApi);

const deleteSlide = async (fileId: number) => {
    try {
        await delPostFile(fileId);
        await getProjectByIDApi();
    } catch (error) {
        console.error('Error deleting slide:', error);
    }
};

const handleFileChange = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await addPostFile(formData, props.postId);
            await getProjectByIDApi();
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }
};
const baseURL ='https://itnt.store/';
</script>

<style scoped lang="scss">
.photo-upload {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.slider__image {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: 16px;
    border: 1.5px solid #E0E0E0;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
}

.close {
    position: absolute;
    top: 8px;
    right: 8px;
    background-color: white;
    border-radius: 50%;
    padding: 4px;
    cursor: pointer;

    &__button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;
        background-color: #FFEBEE;
        border-radius: 50%;

        img {
            width: 16px;
            height: 16px;
        }
    }
}

.file-upload-label {
    display: flex;
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: white;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border: 1.5px dashed #E0E0E0;
    border-radius: 16px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
}

input[type="file"] {
    display: none;
}

.icon {
    font-size: 24px;
    color: #9E9E9E;
}
</style>