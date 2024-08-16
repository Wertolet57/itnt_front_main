<script lang="ts">
export default {
    name: 'UiPost',
}
</script>

<template>
    <div v-if="props.prjAuth" class="card" style="padding: 15px; padding-bottom: 20px">
        <div class="d-flex mb-2">
            <p>Публикация новой записи</p>
        </div>
        <div class="ui-vacancyPanel__inputs">
            <UiInput label="Текст записи*" v-model="localDescriptionHeader" />
            <UiInput label="Что мы предлагаем*" v-model="localDescription" class="mt-[48px]" />
            <UiButton bg-color="def">Добавить обложку для записи <input type="file" /></UiButton>
            <UiButton @click="handlePostBlogByProject" bg-color="smBlue" class="mt-[48px]">Опубликовать</UiButton>
        </div>
    </div>
    <div v-if="props.userAuth" class="card" style="padding: 15px; padding-bottom: 20px">
        <div class="d-flex mb-2">
            <p>Публикация новой записи</p>
        </div>
        <div class="ui-vacancyPanel__inputs">
            <UiInput label="Текст записи*" v-model="localDescriptionHeader" />
            <UiInput label="Что мы предлагаем*" v-model="localDescription" class="mt-[48px]" />
            <UiButton bg-color="def">Добавить обложку для записи <input type="file" /></UiButton>
            <UiButton @click="handlePostBlogByUser" bg-color="smBlue" class="mt-[48px]">Опубликовать</UiButton>
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
// import scrip from "~/assets/demo/scrip.svg";
import UiButton from './UiButton.vue';
import UiInput from './UiInput.vue';
// import file from "~/assets/icons/media/ppt-blue.svg";
// import { addPost } from "~/API/ways/user";
import { addPostProject, addPostUser } from "~/API/ways/post";
import { ref, computed } from 'vue';
const snackbarVisible = ref(false)
const props = defineProps({
    descriptionHeader: String,
    description: String,
    authorUser: String,
    authorProject: String,
    prjAuth: {
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
const handlePostBlogByUser = async () => {
    try {
        const data = await addPostUser(
            localDescription.value,
            localDescriptionHeader.value,
            props.authorUser,
        );
        emit('postSuccess');

        snackbarVisible.value = true
        console.log('Post added successfully:', data);
        // Add additional logic after successful post
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
        );
        emit('postSuccess');

        snackbarVisible.value = true
        console.log('Post added successfully:', data);
        // Add additional logic after successful post
    } catch (error) {
        console.error('Error adding post:', error);
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
