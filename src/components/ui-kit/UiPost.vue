<template>
    <div class="card" style="padding: 15px; padding-bottom: 20px">
        <div class="d-flex mb-2">
            <p>Публикация новой записи</p>
        </div>
        <div class="ui-vacancyPanel__inputs">
            <UiInput label="Текст записи*" v-model="localDescriptionHeader" />
            <UiInput label="Что мы предлагаем*" v-model="localDescription" class="mt-[48px]" />
            <UiButton v-if="!imagePreview" bg-color="def">
                <label for="fileInput" style="cursor: pointer;">Добавить обложку для записи</label>
            </UiButton>
            <input @change="handleFileChange" type="file" id="fileInput" style="display: none;">
            
            <!-- <AddPostPhoto class="bg-black p-4" :post-id="36" :read-only="false"/> -->
            <div v-if="imagePreview" class="mt-4">
                <img class="rounded-t-[12px]" :src="imagePreview" alt="Image preview"
                    style="max-width: 100%; height: auto;" />
            </div>
            <UiButton @click="removeImage" v-if="imagePreview" bg-color="def">
                Убрать
            </UiButton>
            <UiButton v-if="props.userAuth" @click="handlePostBlogByUser" bg-color="smBlue" class="mt-[48px]">
                Опубликовать
            </UiButton>
            <UiButton v-if="props.prjAuth" @click="handlePostBlogByProject" bg-color="smBlue" class="mt-[48px]">
                Опубликовать
            </UiButton>
        </div>
    </div>
    <v-snackbar v-model="snackbarVisible" min-width="270px" max-height="46px" :timeout="3000" color="white"
        rounded="lg">
        <div class="flex flex-row justify-between items-center">
            Пост опубликован
        </div>
    </v-snackbar>
</template>

<script lang="ts" setup>
import UiButton from './UiButton.vue';
import UiInput from './UiInput.vue';
import { addPostProject, addPostUser } from "~/API/ways/post";
// import {addPostFile} from "../../API/ways/post"
import AddPostPhoto from "../AddPostPhoto.vue"
import { ref, computed } from 'vue';

const snackbarVisible = ref(false);
const image = ref<string | null>(null);
const imagePreview = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const props = defineProps({
    descriptionHeader: String,
    description: String,
    authorUser: String,
    authorProject: String,
    prjAuth: {
        type: Boolean,
        default: false,
    },
    edit: {
        type: Boolean,
        default: false,
    },
    userAuth: {
        type: Boolean,
        default: false,
    }
});
const emit = defineEmits(['update:descriptionHeader', 'update:description', 'postSuccess']);
const localDescriptionHeader = computed({
    get: () => props.descriptionHeader,
    set: (value) => emit('update:descriptionHeader', value),
});
const localDescription = computed({
    get: () => props.description,
    set: (value) => emit('update:description', value),
});

const handleFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            image.value = file.name;
            imagePreview.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};

const handlePostBlogByUser = async () => {
    try {
        const data = await addPostUser(
            localDescription.value,
            localDescriptionHeader.value,
            props.authorUser,
            image.value,
            image.value

        );
        emit('postSuccess');
        snackbarVisible.value = true;
        console.log('Post added successfully:', data);
    } catch (error) {
        console.error('Error adding post:', error);
    }
};
const handlePostBlogByProject = async () => {
    try {
        const data = await addPostProject(
            localDescription.value,
            localDescriptionHeader.value,
            props.authorProject,
            image.value,
            image.value

        );
        emit('postSuccess');
        snackbarVisible.value = true;
        console.log('Post added successfully:', data);
    } catch (error) {
        console.error('Error adding post:', error);
    }
};
const removeImage = () => {
    imagePreview.value = null;
    if (fileInput.value) {
        fileInput.value.value = ''; // Сброс инпута
    }
};
</script>

<style lang="scss" scoped>
.ui-vacancyPanel {
    &__head {
        padding: 10px 20px;
        display: flex;
        gap: 10px;
        align-items: center;
        max-width: fit-content;
        border-radius: 8px;
        background: #e1f5fe;
    }

    &__inputs {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    &--card {
        border-radius: 12px;
        background: $def-white;
        padding: 23px 20px !important;
    }
}

.photo-upload {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
}

.upload-wrapper {
    flex-basis: calc(20% - 12px);
}

.file-upload-label {
    display: flex;
    min-width: 100%;
    min-height: 120px;
    background-color: white;
    cursor: pointer;
    padding: 10px;
    align-items: center;
    justify-content: center;
    border: 1.5px solid #E0E0E0;
    border-radius: 12px;
    margin-bottom: 10px;
    background-size: cover;
    cursor: default;
    background-position: center;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    position: relative;

    .delete {
        position: absolute;
        right: -8px;
        bottom: -8px;
        background-color: white;
        border-radius: 50%;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);

    }
}

@media (max-width: 576px) {
    .file-upload-label {
        min-height: 110px;
    }
}

@media (max-width: 440px) {
    .file-upload-label {
        min-height: 110px;
    }
}

@media (max-width: 380px) {
    .file-upload-label {
        min-height: 100px;
    }
}


.file-upload-label.with-image {
    min-height: 120px;
    min-width: 100%;
}

@media (max-width: 576px) {
    .file-upload-label.with-image {
        min-height: 110px;
    }
}

@media (max-width: 440px) {
    .file-upload-label.with-image {
        min-height: 110px;
    }
}

@media (max-width: 380px) {
    .file-upload-label.with-image {
        min-height: 100px;
    }
}

.file-upload-label.active {
    cursor: pointer;
}

input[type="file"] {
    display: none;
}

.icon {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
}
</style>
