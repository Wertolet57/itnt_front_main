<template>
    <div v-if="props.readOnly === false">
        <div class="m-2">
            <p>Презентация {{ filteredProjectFiles.length }} / 10</p>
        </div>
        <div class="photo-upload grid grid-cols-4">
            <!-- Отображаем загруженные изображения -->
            <div v-for="(file, index) in filteredProjectFiles" :key="file.id" class=" relative">
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
            <p>
                <span class="font-medium">Презентация</span>
                <span class="text-[#9E9E9E] ml-[8px]">{{ filteredProjectFiles.length }} / 10</span>
            </p>
        </div>
        <div v-if="filteredProjectFiles.length > 0" class="photo-upload grid grid-cols-4">
            <div v-for="(file, index) in filteredProjectFiles" :key="file.id" class="last relative">
                <img @click="toggleDelete" :src="getFileUrl(file.pictureUrl)" alt="Project Image"
                    class="slider__image" />
                <div @click="deleteSlide(file.id)" v-if="delMode === true" class="close">
                    <span class="close__button">
                        <img :src="close" alt="">
                    </span>
                </div>
            </div>
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

    </div>


</template>

<script setup lang="ts">
import close from "../../assets/icons.svg"
import { ref, computed, onMounted, onUpdated } from 'vue';
import { addProjectSlide } from "~/API/ways/project"
import { useRoute } from 'vue-router';
import { getProjectByID, deleteProjectFile } from '~/API/ways/project'
const delMode = ref(false)
const toggleDelete = () => {
    delMode.value = !delMode.value
    console.log(delMode.value);

}
let data = ref([])
const getProjectByIDApi = async () => {
    await getProjectByID(route.params.ID).then((response) => {
        try {
            data.value = response.data.object.projectFiles
        } catch (e) {
            console.error('error:', e)
        }
    })
}
onMounted(getProjectByIDApi)
const deleteSlide = async (fileId: Number) => {
    try {
        const response = await deleteProjectFile(fileId)
        console.log(response);
        await getProjectByIDApi()

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
        await getProjectByIDApi()
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
function setLastCloseClass() {
    const closeElements = document.querySelectorAll('.close');
    closeElements.forEach((el, index) => {
        if (index === closeElements.length - 1) {
            el.classList.add('last-close');
        } else {
            el.classList.remove('last-close');
        }
    });
}
onMounted(() => {
    setLastCloseClass();
});

onUpdated(() => {
    setLastCloseClass();
});
const baseURL = https://itnt.store/files/';

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





<style scoped lang="scss">
.last{
    :last-child{
        .close {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    right: -5px;
    bottom: 2px;
    padding: 2px;
    background-color: white;
    border-radius: 50%;

    &__button {
        padding: 0;
        width: 100%;
        height: 100%;

        img {
            padding: 0px;
            background-color: #FFEBEE;
            border-radius: 50%;
            width: 100%;
            height: 100%;
        }
    }
    @media (min-width: 768px) {
        right: -8px;
        bottom: -8px;
        width: 20%;
        height: auto;

        &__button {
            padding: 0;
            width: 150%;
            height: 150%;

            img {
                padding: 0px;
                width: 100%;
                height: 100%;
            }
        }
    }

    @media (min-width: 1024px) {
        right: -8px;
        bottom: -8px;
        width: 20%;
        height: auto;
        &__button {
            padding: 0;
            width: 200%;
            height: 200%;

            img {
                padding: 0px;
                width: 100%;
                height: 100%;
            }
        }
    }
}
    }
}
.photo-upload {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 10px;
    /* Зазор между элементами */
}

.close {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    right: -5px;
    bottom: 0px;
    padding: 2px;
    background-color: white;
    border-radius: 50%;

    &__button {
        padding: 0;
        width: 100%;
        height: 100%;

        img {
            padding: 0px;
            background-color: #FFEBEE;
            border-radius: 50%;
            width: 100%;
            height: 100%;
        }
    }
    @media (min-width: 768px) {
        right: -8px;
        bottom: -8px;
        width: 20%;
        height: auto;

        &__button {
            padding: 0;
            width: 150%;
            height: 150%;

            img {
                padding: 0px;
                width: 100%;
                height: 100%;
            }
        }
    }

    @media (min-width: 1024px) {
        right: -8px;
        bottom: -8px;
        width: 20%;
        height: auto;
        &__button {
            padding: 0;
            width: 200%;
            height: 200%;

            img {
                padding: 0px;
                width: 100%;
                height: 100%;
            }
        }
    }
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
    width: auto;
    aspect-ratio: 73 / 106;
    height: auto;
    background-color: white;
    cursor: pointer;
    padding: 10px;
    align-items: center;
    justify-content: center;
    border: 1.5px solid #E0E0E0;
    border-radius: 16px;
    margin-bottom: 10px;
    background-size: cover;
    cursor: default;
    background-position: center;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
}


.file-upload-label.with-image {
    width: auto;
    aspect-ratio: 73 / 106;
    height: auto;
    border: 1.5px solid #E0E0E0;

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

.slider {
    border-radius: 16px;

    &__image {
        border: 1.5px solid #E0E0E0;
        background: no-repeat;
        background-size: cover;
        object-fit: cover;
        width: auto;
        height: auto;
        aspect-ratio: 73 / 106;
        border-radius: 16px;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    }

}
</style>