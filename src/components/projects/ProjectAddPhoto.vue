<template>
    <div v-if="props.readOnly === false">
        <div class="m-2">
            <p>Презентация {{ filteredProjectFiles.length }} / 10</p>
        </div>
        <div class="photo-upload grid grid-cols-4">
            <!-- Отображаем загруженные изображения -->
            <div v-for="(file, index) in filteredProjectFiles" :key="file.id" class="images relative">
                <img @click="openDialog(index)" :src="getFileUrl(file.pictureUrl)" alt="Project Image"
                    class="slider__image" />
            </div>

            <!-- Отображаем поле для загрузки, если изображений меньше 10 -->
            <div v-if="filteredProjectFiles.length < 10" class="upload-wrapper">
                <label for="new-upload" class="file-upload-label" @click="openDialog(filteredProjectFiles.length)">
                    <input id="new-upload" type="file" @change="handleFileChange($event, filteredProjectFiles.length)"
                        accept="image/*" />
                    <span class="icon">
                        <v-icon icon="mdi-plus" />
                    </span>
                </label>
            </div>
        </div>

        <v-dialog v-model="dialog" width="90%" class="">
            <v-row class="pa-2 pt-0 pb-2 ma-0 " justify="end">
                <v-icon class="close-button" @click="dialog = false" icon="mdi-close" />
            </v-row>
            <div class="flex justify-center">
                <v-img :src="selectedImageUrl" class="border" style="max-height: 80vh; max-width: 70vw;" cover
                    aspect-ratio="1"></v-img>
            </div>
        </v-dialog>
    </div>

    <div v-if="props.readOnly === true">
        <div class="m-2">
            <p>Презентация {{ filteredProjectFiles.length }} / 10</p>
        </div>
        <div v-if="filteredProjectFiles.length > 0" class="photo-upload grid grid-cols-4">
            <div v-for="(file, index) in filteredProjectFiles" :key="file.id" class="images relative">
                <img @click="toggleDelete" :src="getFileUrl(file.pictureUrl)" alt="Project Image"
                    class="slider__image" />
                <div v-if="delMode === true" class="absolute bottom-2 right-2 close-button">
                    <p @click="deleteSlide(file.id)">X</p>
                </div>
            </div>
        </div>
    </div>


</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { addProjectSlide } from "~/API/ways/project"
import { useRoute } from 'vue-router';
import { getProjectByID, deleteProjectFile } from '~/API/ways/project'
const delMode = ref(false)
const toggleDelete = () => {
    delMode.value = !delMode.value
    console.log(delMode.value);

}
let data = ref([])
onMounted(async () => {
    await getProjectByID(route.params.ID).then((response) => {
        try {
            data.value = response.data.object.projectFiles
        } catch (e) {
            console.error('error:', e)
        }
    })
})
const deleteSlide = async (fileId: Number) => {
    try {
        const response = await deleteProjectFile(fileId)
        console.log(response);

    } catch (error) {
        console.log(error)
    }
}
const props = defineProps({
    readOnly: {
        type: Boolean,
        default: false
    }
})
const route = useRoute();
const maxFields = 10;
const inputIds = Array.from({ length: maxFields }, (_, i) => `file-upload-${i}`);
const imageUrls = ref(Array(maxFields).fill(null));
const activeIndex = ref(0);
const fileNames = ref(Array(maxFields).fill(null));
const dialog = ref(false);
const selectedImageUrl = ref<string | null>(null);

const handleFileChange = async (event: Event, index: number) => {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
        fileNames.value[index] = file.name;

        const reader = new FileReader();
        reader.onload = async () => {
            if (reader.result) {
                imageUrls.value[index] = reader.result.toString();
                await uploadFile(file, index);
                setNextActive(index);
            }
        };
        reader.readAsDataURL(file);
    }
};

const uploadFile = async (file: File, index: number) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await addProjectSlide(formData, route.params.ID);
        console.log(`Файл ${fileNames.value[index]} успешно загружен на сервер:`, response);
    } catch (error) {
        console.error(`Ошибка при загрузке файла ${fileNames.value[index]}:`, error);
    }
};

const openDialog = (index: number) => {
    if (imageUrls.value[index]) {
        selectedImageUrl.value = imageUrls.value[index];
        dialog.value = true;
    }
};

const setNextActive = (index: number) => {
    if (index < inputIds.length - 1) {
        activeIndex.value = index + 1;
    } else {
        activeIndex.value = 0;
    }
};

// Количество видимых полей
const visibleFields = computed(() => {
    return inputIds.slice(0, countUploadedPhotos() + 1);
});

// Функция для подсчета загруженных фотографий
const countUploadedPhotos = () => {
    return imageUrls.value.filter(url => url !== null).length;
};
const baseURL = 'http://62.217.181.172/files/';

const isExternalUrl = (url: string | null) => {
    return url?.startsWith('http') || url?.startsWith(',');
};

const getFileUrl = (url: string) => {
    return `${baseURL}${url}`;
};
const filteredProjectFiles = computed(() =>
    data.value.filter((file) => file.pictureUrl && !isExternalUrl(file.pictureUrl))
);
</script>





<style scoped>
.photo-upload {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* 4 колонки */
    grid-template-rows: repeat(2, 1fr);
    /* 2 ряда */
    gap: 10px;
    /* Зазор между элементами */
}

.close-button {
    width: 34px;
    height: 34px;
    background: #ffffff;
    border-radius: 6px;
}

.upload-wrapper {
    flex-basis: calc(25% - 12px);
}

.border {
    border-radius: 16px;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.file-upload-label {
    display: flex;
    min-width: 100%;
    min-height: 220px;
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
    min-height: 220px;
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