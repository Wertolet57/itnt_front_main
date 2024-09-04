<template>
    <div class="projectCard ">
        <!-- READONLY -->
        <div v-if="props.readOnly">
            <!-- <div class="projectCard__slider"> -->
            <v-carousel             delimiter-icon="mdi-minus"
            interval="3000" cycle class="elevation-1 slider" :show-arrows="false">
                <v-carousel-item class="slider__image" v-for="(file, index) in filteredProjectFiles" :key="file.id"
                    :src="getFileUrl(file.pictureUrl)" reverse-transition="fade-transition"
                    transition="fade-transition">
                    <template #default>
                        <img :src="getFileUrl(file.pictureUrl)" alt="Project Image" class="slider__image" />
                    </template>
                </v-carousel-item>
            </v-carousel>
            <!-- </div> -->
            <div class="projectCard__tags">
                <div class="projectCard__tags--tag txt-body2">Инвестиции</div>
                <div class="projectCard__tags--tag txt-body2">Стартапы</div>
                <div class="projectCard__tags--tag txt-body2">Нетворкинг</div>
            </div>
            <div class="projectCard__info">
                <p class="projectCard__info__title txt-body1">{{ props?.prjDescHead }}</p>
                <p class="projectCard__info__title txt-body2 flex-wrap">
                    {{ props?.prjDescBody }}
                </p>
            </div>
        </div>

        <!-- EDITABLE -->
        <div v-else>
            <!-- Фотографии проекта -->
            <div class="projectCard__editable__pics">
                <div v-if="data.length > 0" class="photo-upload grid grid-cols-4">
                    <div v-for="(file, index) in filteredProjectFiles" :key="file.id" class="images relative">
                        <img @click="toggleDelete" :src="getFileUrl(file.pictureUrl)" alt="Project Image"
                            class="slider__image" />
                        <div v-if="delMode === true" class="absolute bottom-2 right-2 close-button">
                            <p @click="deleteSlide(file.id)">X</p>
                        </div>
                    </div>
        
                </div>
                <ProjectAddPhoto :read-only="false"/>
                <ProjectAddPhoto :read-only="true"/>
            </div>

            <!-- Теги проекта -->
            <div class="projectCard__editable__tags">
                <p>Ваш проект в трёх словах (теги)*</p>

                <UiSkills skillsType="Project" />
            </div>

            <!-- Описание проекта -->
            <div class="projectCard__editable__info">
                <p>Опишите проект</p>

                <UiInput label="Заголовок*" v-model="prjObject.descriptionHeader" />

                <div>
                    <!-- TODO: сделатб хелпер под правила -->
                    <UiTextArea :class="descriptionClass" :rules="[(v) => v.length <= 1024 || 'Max 1024 characters']"
                        counter label="Описание проекта*" v-model="prjObject.description" />

                    <UiPrompt :projectCard="true">

                        Текст, выделенный зелёным цветом, будет отображаться на мини-карточке проекта в разных
                        местах
                        приложения, где пространство ограничено. А полное описание будет отображаться на странице вашего
                        проекта.
                    </UiPrompt>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import UiPrompt from '../ui-kit/UiPrompt.vue'
import UiInput from '../ui-kit/UiInput.vue'
import UiTextArea from '../ui-kit/UiTextArea.vue'
import ProjectAddPhoto from './ProjectAddPhoto.vue';
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '~/store/projectStore'
import UiSkills from '../ui-kit/UiSkills.vue'
import { getProjectByID, deleteProjectFile } from '~/API/ways/project'
import { useRoute } from 'vue-router'
const route = useRoute()
const { prjObject } = storeToRefs(useProjectStore())
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
const deleteSlide = async (fileId:Number)=>{
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
        default: false,
    },
    prjDescHead: {
        type: String,
    },
    prjDescBody: {
        type: String,
    },
})
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
const descriptionClass = () => {
    return prjObject.value.description.length < 300 ? 'green' : '';
}
</script>

<style lang="scss" scoped>
.projectCard {
    &__slider {
        display: flex;
        gap: 20px;
        -ms-overflow-style: none;
        scrollbar-width: none;
        overflow-x: scroll;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    &__tags {
        display: flex;
        justify-content: space-between;
        margin-top: 24px;
        margin-bottom: 48px;

        &--tag {
            border-radius: 8px;
            background: $prim-var2;
            padding: 6px 18px;
            color: #1769aa;
        }
    }

    &__info {
        &__title {
            margin-bottom: 12px;
        }
    }

    // EDITABLE
    &__editable {
        &__pics {
            p {
                margin-bottom: 18px;
            }

            &__grid {
                display: flex;
                gap: 16px;
                flex-wrap: wrap;
            }

            &__adder {
                height: 106px;
                width: 73px;
                background: $def-white;
                border-radius: 12px;
                align-items: center;
                justify-content: center;
                display: flex;
            }
        }

        &__tags {
            margin-top: 43px;
            margin-bottom: 48px;

            p {
                margin-bottom: 16px;
            }
        }

        &__info {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
    }
}
.close-button{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white; 
    padding:6px 8px; 
    border-radius: 50%; 
    cursor: pointer;
}
.close-icon {
}

.photo-upload {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* 4 колонки */
    grid-template-rows: repeat(2, 1fr);
    /* 2 ряда */
    gap: 10px;
    /* Зазор между элементами */
}

.slider {
    // width: 100%;
    // height: 100%;
    border-radius: 16px;

    &__image {
        background: no-repeat;
        width: 100%;
        height: 100%;
        border-radius: 16px;
        /* Задайте высоту контейнера */
        object-fit: cover;
    }
}
</style>
