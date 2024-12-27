<script lang="ts">
export default {
    name: 'ProjectCard',
}
</script>

<template>
    <div v-if="!isHidden" class="project-card">
        <div class="">
            <v-icon v-if="props.readOnly === true" class="hidden" />
            <v-icon v-if="props.readOnly === false" @click="modalState.open()" icon="mdi-dots-vertical" color="#263238"
                class="absolute  p-0 m-0" />
            <div class="project-card__info">
                <img class="" v-if="projects && projects.isAnonymous && projects.isAnonymous === true" width="41"
                    height="38" src="../../assets/icons/anonProject.svg" />
                <div class="text-start px-4">
                    <p @click="router.push('/project/' + props.projectInfo.project.id)"
                        class="project-card__info__name cursor-pointer">{{ props.projectInfo.project.name }}</p>
                    <p class="project-card__info__position">{{ props.projectInfo.project.slogan }}</p>
                </div>
            </div>
            <div class="project-card__img">
                <img @click="router.push('/project/' + props.projectInfo.project.id)"
                class=" cursor-pointer" :src="displayAvatarUrl" alt="Project Image" />
            </div>
        </div>
    </div>
    <div v-else class="">
        <div :style="props.projectInfo.isAnon === false ? 'padding-left: 52px' : ''" class="project-card__info">
            <img v-if="props.projectInfo.isAnon" width="41" height="38" src="../../assets/icons/anonProject.svg" />
            <div class="text-start px-4">
                <p class="project-card__info__name ">{{ props.projectInfo.project.name }}</p>
                <p class="project-card__info__position">{{ props.projectInfo.project.slogan }}</p>
            </div>
        </div>
        <div class="project-card__anominus">
            <img class="" :src="anonimus" alt="" />
        </div>
    </div>
    <vue-bottom-sheet :max-height="'90%'" ref="modalState">
        <div class="modal">
            <div class="modal__list">
                <div class="modal__list__item">
                    <img :src="anonimus" alt="">
                    <p v-if="projects" @click="Anonim(!projects.isAnonymous)">
                        {{ projects.isAnonymous ? 'Отключить анонимное участие' : 'Включить анонимное участие' }}
                    </p>
                    <p class="" v-else> Включить анонимное участие </p>
                </div>
                <div v-for="(item, id) in modalItems" @click="item?.func" :key="id" class="modal__list__item">
                    <img :src="item.icon" alt="" />
                    <p :class="item.name === 'Пожаловаться' && 'error-txt'" class="txt-body1">{{ item.name }}</p>
                </div>
                <button @click="quickMenu(!projects.isInQuickMenu)" v-if="projects" class="btn">
                    <img :src="projects.isInQuickMenu ? minus : plus" alt="">
                    {{ projects.isInQuickMenu ? 'Убрать проект из быстрого меню' : 'Добавить проект в быстрое меню' }}
                </button>
                <button @click="quickMenu(!projects.isInQuickMenu)" v-else class="btn">
                    <img :src="plus" alt="">
                    {{ 'Добавить проект в быстрое меню' }}
                </button>
            </div>
        </div>
    </vue-bottom-sheet>
</template>

<script setup lang="ts">
import defPrjImg from '../../assets/defPrj.svg'
import anonimus from "~/assets/project_modal/annonimus.svg"
// import hidden from "~/assets/Profile/hideProjectCard.svg"
import hide from "~/assets/project_modal/hide.svg"
import project from "~/assets/project_modal/project.svg"
import share from "~/assets/project_modal/share.svg"
import plus from "~/assets/project_modal/plus.svg"
import minus from "~/assets/project_modal/minus.svg"
import { getUserProjects, postAnonimProjects, postMenuProjects } from '~/API/ways/user.ts'
import { useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue'
import { modalActionsList } from '~/helpers/types'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'


const props = defineProps({
    projectInfo: {
        type: Object || Array,
    },
    prjID: {
        type: Number,
    },
    readOnly: {
        type: Boolean,
        default: false
    }
})

const router = useRouter();
const projects = ref()
// const getProjects = async () => {
//     try {
//         const data = await getUserProjects(props.projectInfo.project.id);
//         projects.value = data.data.object;
//     } catch (error) {
//         console.error(error);
//     }
// };
// onMounted(getProjects);
// const Anonim = async (anonim: Boolean) => {
//     try {
//         const response = await postAnonimProjects(anonim, props.projectInfo.project.id);
//         console.log(response);
//         await getProjects();
//     } catch (error) {
//         console.error(error);
//     }
// };
// const quickMenu = async (quick: Boolean) => {
//     try {
//         const response = await postMenuProjects(quick, props.projectInfo.project.id);
//         console.log(response);
//         await getProjects();

//     } catch (error) {
//         console.error(error);
//     }
// }

const modalState = ref(false)

const modalItems: modalActionsList[] = [
    {
        name: 'Не показывать проект в профиле',
        icon: hide,

    },
    {
        name: 'Открыть проект',
        icon: project,
        func: () => {
            router.push('/project/' + props.projectInfo.project.id)
        },
    },
    {
        name: 'Поделиться проектом',
        icon: share,
        func: () => {
            try {
                navigator.share({
                    title: 'ITNT',
                    text: 'Откройте для себя ITNT.',
                    url: 'http://62.113.105.220/project/' + props.projectInfo.project.id,
                })
            } catch (error) {
                console.log('error :' + error)
            }
        },
    },
]
const baseURL = 'https://itnt.store/';
const fullAvatarUrl = props.projectInfo?.project.avatarUrl;
const displayAvatarUrl = computed(() => {
    return fullAvatarUrl && fullAvatarUrl.trim() !== ''
        ? `${baseURL}files/${fullAvatarUrl}`
        : defPrjImg;
});
</script>

<style lang="scss" scoped>
.btn {
    display: flex;
    flex-direction: row;
    // justify-content:center;
    text-align: center;
    border: 1px solid #29B6F6;
    gap: 12px;
    border-radius: 12px;
    padding: 10px 13px 10px 10px;
}

.project-card {
    min-height: 94px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width: 100%;
    background-color: white;
    margin-bottom: 2px;
    border-radius: 4px;
    overflow: hidden;

    &__info {
        display: flex;
        align-items: center;
        gap: 11px;
        padding: 28px 0;

        img {
            border-radius: 0px 12px 12px 0px !important;
        }

        &__name {
            color: $primary;
            font-size: 15px;
            font-weight: 500;
        }

        &__position {
            color: #1769AA;
            opacity: 0.5;
            font-size: 15px;
            font-weight: 400;
        }
    }

    &__img {
        // box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
        position: absolute;
        right: -18px;
        top: -18px;
        overflow: hidden;
        border-radius: 100%;
        border: 6px #E1F5FE solid;
        background-color: white;
        img{
            width: 96px;
            height: 96px;
            
        }
    }

    &__anominus {
        padding: 7px 8.5px;
        background-color: #E1F5FE;
        align-items: start;
        position: absolute;
        top: 30%;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }

    :first-child {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    &:last-child {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }
}

.modal {
    padding: 0 25px;
    padding-bottom: 40px;

    &__list {
        display: flex;
        flex-direction: column;
        gap: 20px;

        &__item {
            display: flex;
            align-items: center;
            gap: 15px;
        }
    }
}

.project-card:not(.project-card ~ .project-card) {
    border-radius: 12px 12px 2px 2px;
}
</style>