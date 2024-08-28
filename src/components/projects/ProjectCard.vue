<template>
    <div class="projectCard ">
        <!-- READONLY -->
        <div v-if="props.readOnly">
            <!-- <div class="projectCard__slider"> -->
                <v-carousel  class="elevation-1" :show-arrows="false">
                    <v-carousel-item v-for="(file, index) in data.projectFiles" :key="file.id"
                        :src="getFileUrl(file.pictureUrl)" reverse-transition="fade-transition"
                        transition="fade-transition">
                        <template #default>
                            <!-- Вы можете добавить дополнительные элементы здесь, если нужно -->
                            <img :src="getFileUrl(file.pictureUrl)" alt="Project Image" class="d-block w-100" />
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
                <ProjectAddPhoto />
                <!-- <div class="projectCard__editable__pics__grid">
                    <img v-for="i in 7" width="73" height="106" src="@/assets/demo/projectSmallCard.svg" />
                    <div @click="addProjectPhoto" class="projectCard__editable__pics__adder">
                        <v-icon icon="mdi-plus" />
                    </div>
                </div> -->
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
import slide from '../../assets/demo/projectSmallCard.svg'
import UiPrompt from '../ui-kit/UiPrompt.vue'
import UiInput from '../ui-kit/UiInput.vue'
import UiTextArea from '../ui-kit/UiTextArea.vue'
import ProjectAddPhoto from './ProjectAddPhoto.vue';
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '~/store/projectStore'
import UiSkills from '../ui-kit/UiSkills.vue'
import { getProjectByID } from '~/API/ways/project'
import { useRoute } from 'vue-router'
const route = useRoute()
const { prjObject } = storeToRefs(useProjectStore())
let data = ref({})
onMounted(async () => {
    await getProjectByID(route.params.ID).then((response) => {
        try {
            data.value = response.data.object
        } catch (e) {
            console.error('error:', e)
        }
    })
})
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

const isExternalUrl = (url: string) => {
    return url.startsWith('http');
};

const getFileUrl = (url: string) => {
    return `${baseURL}${url}`;
};

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
</style>
