<script lang="ts">
export default {
    name: 'RatingProjectCard',
}
</script>

<template>
    <v-card class="card">
        <div class="card__head">
            <div v-if="allData && allData.avatarUrl" class="card__head__main">
                <h2>{{ listID }}</h2>

                <img v-if="allData.avatarUrl === null || allData.avatarUrl == 'string'"
                    @click="$router.push('/project/' + props.projectInfoSet.id)" alt="" :src="defAva"
                    class="cursor-pointer w-[37px] rounded-[100%]" />
                <img v-else @click="$router.push('/project/' + props.projectInfoSet.id)" alt="" :src="fullAvatarUrl"
                    class="cursor-pointer w-[37px] h-[37px] rounded-[100%]" />
                <div>
                    <p @click="$router.push('/project/' + props.projectInfoSet.id)" class="txt-body3 cursor-pointer">{{
                props.projectInfoSet.name }}</p>
                    <p style="color: #9e9e9e" class="txt-cap1">Здоровье, стартапы, приложение</p>
                </div>
            </div>
            <v-icon @click="modalState.open()" icon="mdi-dots-vertical" color="#263238" class="font-weight-bold" />
        </div>

        <div class="card__stats">
            <div class="card__stats--chip ">
                <img width="14" height="14" src="@/assets/icons/account-black.svg" alt="" />
                <p class="txt-cap1"><span class="pl-1.5 pr-1">&#183;</span> {{ props.projectInfoSet.usersCount }}
                </p>
            </div>
            <div class="card__stats--chip">
                <img width="14" height="14" src="@/assets/icons/search-black.svg" alt="" />
                <p v-if="allData" class="txt-cap1"><span class="pl-1.5 pr-1">&#183;</span> {{ allData.vacancyCount }}
                </p>
            </div>

            <div class="card__stats--chip" v-if="allData && allData.projectStage">
                <p v-if="allData.projectStage === 'CUST_DEV'" class="txt-cap1">St: Пре-сид раунд </p>
                <p v-if="allData.projectStage === 'IDEA'" class="txt-cap1">St: Сид раунд </p>
                <p v-if="allData.projectStage === 'TEAM_GATHERING'" class="txt-cap1">St: Ангельский раунд </p>
                <p v-if="allData.projectStage === 'FIRST_CLIENT'" class="txt-cap1">St: Раунд А </p>
                <p v-if="allData.projectStage === 'FIRST_PAYING_CLIENT'" class="txt-cap1">St: Раунд B </p>
                <p v-if="allData.projectStage === 'SECOND_STAGE'" class="txt-cap1">St: Раунд D </p>

            </div>
        </div>
        <div v-if="followed && followed.users" class=" text-black" v-for="user in followed.users">
            <div v-show="user.user.id == userId && user.relationType === 'PROJECT_FOLLOWER'" class="">
                подписан
            </div>
            <div v-show="user.user.id == userId && user.relationType === 'PROJECT_FOLLOWER'" class="">
                подписаться
            </div>

        </div>
        <div class="card__main">
            <img v-if="filteredProjectFiles.length == 0" src="../../assets/demo/projectSmallCard.svg" alt="" />
            <div @click="dialog = true" class="images" v-if="filteredProjectFiles.length > 0"
                :key="filteredProjectFiles[0].id">
                <img class="image" :src="getFileUrl(filteredProjectFiles[0].pictureUrl)" alt="Project Image" />
            </div>

            <div>
                <p class="card__main__text txt-cap1">
                    {{ props.projectInfoSet.descriptionHeader }}
                </p>

                <div @click="$router.push('/project/' + props.projectInfoSet.id)" class="card__main__route">
                    <p class="txt-cap1">Подробнее о проекте</p>
                    <img src="../../assets/icons/arrow-left-blue.svg" alt="" />
                </div>
            </div>
        </div>
    </v-card>

    <vue-bottom-sheet max-height="270px" full-screen ref="modalState">
        <div class="modal">
            <div class="modal__list">
                <div v-for="(item, id) in modalItems" @click="item?.func" :key="id" class="modal__list__item">
                    <img :src="item.icon" alt="" />
                    <p :class="item.name === 'Пожаловаться' && 'error-txt'" class="txt-body1">{{ item.name }}</p>
                </div>
                <div class="modal__list__item">
                    <img :src="warning" alt="" />
                    <p @click="complainState.open()" class="txt-body1 error-txt">Пожаловаться</p>
                </div>
            </div>
        </div>
    </vue-bottom-sheet>
    <vue-bottom-sheet max-height="380px" full-screen ref="complainState">
        <div class="searchTeammateModal modal">
            <p class="mb-2">Выберите причину жалобы на пользователя:</p>
            <div class="d-flex align-center mb-[16px]">
                    <img @click="$router.push('/project/' + props.projectInfoSet.id)" class="mr-3 cursor-pointer" width="37"
                        height="37" src="../../assets/demo/ava-small-header.svg" />
                    <div>
                        <div class="d-flex cursor-pointer align-center">
                            <p class="txt-body3">{{ props.projectInfoSet.name }}</p>
                        </div>
                    </div>
                </div>
                <v-radio-group v-model="complaint" color="#29b6f6">
                    <v-radio class="mb-[10px]" base-color="#29b6f6" label="Спам" value="Спам"></v-radio>
                    <v-radio class="mb-[10px]" base-color="#29b6f6" label="Агрессивное поведение"
                        value="Агрессивное поведение"></v-radio>
                    <v-radio class="mb-[10px]" base-color="#29b6f6"
                        label="Взрослый контент (ссылки, картинки, видео и т.п.)" value="Взрослый контент"></v-radio>
                </v-radio-group>
                <UiButton bg-color="blue" @click="sendComplaint">Отправить жалобу</UiButton>
            <!-- <UiTextArea v-model="complaint" /> -->
            <!-- <UiButton bg-color="blue" @click="sendComplaint">Отправить жалобу</UiButton> -->
        </div>
    </vue-bottom-sheet>
    <v-dialog class="elevation-0" v-model="dialog" width="90%">
        <v-row class="pa-2 pt-0 pb-2 ma-0" justify="end">
            <v-icon class="close-button" @click="dialog = false" icon="mdi-close" />
        </v-row>
        <Swiper :id="props.projectInfoSet.id" />

        <div @click="$router.push('/project/' + props.projectInfoSet.id)" class="slider-card text-center pt-4">
            <p class="slider-button ma-0">Открыть проект<v-icon icon="mdi-arrow-right" size="x-small" /></p>
        </div>
    </v-dialog>
</template>

<script setup lang="ts">
import Swiper from '../projects/Swiper.vue'

import project from "~/assets/project_modal/project.svg"
import share from "~/assets/icons/share-blue.svg"
import warning from "~/assets/icons/warning-red.svg"
import defAva from "~/assets/demo/projectsmallphoto.svg"
// import statistic from "~/assets/modal_icon/statistic.svg"
import UiTextArea from "~/components/ui-kit/UiTextArea.vue"
import UiButton from "~/components/ui-kit/UiButton.vue"
import follow from "~/assets/modal_icon/follow.svg"
import { ref, computed, onMounted } from 'vue'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import { modalActionsList } from '~/helpers/types'
import { addFollow, addComplaint, getProjectByID } from "~/API/ways/project"
import { useRouter } from 'vue-router'
const router = useRouter()
const complainState = ref(false)
const modalState = ref(false)
const dialog = ref(false)
const userId = ref(localStorage.getItem('userId'))
let allData = ref()
const filterUsers = ref([]);
let data = ref([])
const followed = ref([])
onMounted(async () => {
    await getProjectByID(props.projectInfoSet.id).then((response) => {
        try {
            allData.value = response.data.object
            followed.value = response.data.object.users
            data.value = response.data.object.projectFiles
            if (Array.isArray(followed.value)) {
                // Фильтруем пользователей
                filterUsers.value = followed.value.filter(user => user.user.id === userId);

                console.log('Filtered users:', filterUsers.value);

                // Проверяем наличие PROJECT_OWNER и PROJECT_FOLLOWER
                const hasProjectOwner = filterUsers.value.some(user => user.relationType === 'PROJECT_OWNER');
                const hasProjectFollower = filterUsers.value.some(user => user.relationType === 'PROJECT_FOLLOWER');

                // Если оба значения присутствуют, логируем их
                if (hasProjectOwner && hasProjectFollower) {
                    console.log('User has both relation types:', filterUsers.value);
                } else {
                    console.log('No match for both relation types');
                }
            } else {
                console.error('followed.value is not an array');
            }
        } catch (e) {
            console.error('error:', e)
        }
    })
})
const props = defineProps({
    projectInfoSet: {
        type: Object || Array,
        default: () => { },
    },
    listID: {
        type: Number,
    },
})
const complaint = ref('')

const sendComplaint = async () => {
    await addComplaint(props.projectInfoSet.id, Number(localStorage.getItem('userId')), complaint.value,)
}
const modalItems: modalActionsList[] = [
    {
        name: 'Открыть проект',
        icon: project,
        func: () => {
            router.push('/project/' + props.projectInfoSet.id)
        },
    },
    {
        name: 'Отписаться',
        icon: follow,
        func: async () => {
            try {
                const response = await addFollow(Number(props.projectInfoSet.id), Number(localStorage.getItem("userId")));
                console.log(response);
            } catch (error) {
                console.error('Ошибка при подписке на проект:', error);
            }
        }
    },
    {
        name: 'Поделиться',
        icon: share,
        func: () => {
            try {
                navigator.share({
                    title: 'ITNT',
                    text: 'Откройте для себя ITNT.',
                    url: 'http://62.113.105.220/project/' + props.projectInfoSet.id,
                })
            } catch (error) {
                console.log('error :' + error)
            }

        },
    },
    // {
    //     name: 'Статистика проекта',
    //     icon: statistic,
    // },
]
const baseURL = 'http://62.217.181.172/';

const isExternalUrl = (url: string | null) => {
    return url?.startsWith('http') || url?.startsWith(',');
};

const getFileUrl = (url: string) => {
    return `${baseURL}files/${url}`;
};
const filteredProjectFiles = computed(() =>
    data.value.filter((file) => file.pictureUrl && !isExternalUrl(file.pictureUrl))
);
const fullAvatarUrl = computed(() => {
    return props.projectInfoSet.avatarUrl ? `${baseURL}files/${props.projectInfoSet.avatarUrl}` : `${defAva}`;
});

</script>

<style lang="scss" scoped>
.card {
    border-radius: 12px;
    border: 1px solid rgba(223, 223, 223, 0.3);
    padding: 14px 8px 10px 14px;

    &__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;

        &__main {
            display: flex;
            align-items: center;
            gap: 7px;
        }
    }

    &__stats {
        display: flex;
        gap: 7px;

        &--chip {
            padding: 3px 10px;
            align-items: center;
            display: flex;
            border-radius: 16px;
            border: 1px solid $def-black;
        }
    }

    &__main {
        display: flex;
        gap: 8px;
        margin-top: 10px;

        &__text {
            margin-bottom: 6px;
            width: 223px;
            min-height: 111px;
        }

        &__route {
            display: flex;
            color: $primary;
            align-items: center;
            justify-content: center;
        }
    }

    &__list {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 0 25px;

        &__item {
            display: flex;
            align-items: center;
            gap: 15px;
        }
    }
}

.close-button {
    width: 34px;
    height: 34px;
    background: #ffffff;
    border-radius: 6px;
}

.slider {
    filter: drop-shadow(0px 0px 12px rgba(0, 0, 0, 0.1));
    border-radius: 12px 12px 0 0;
}

.image {
    border-radius: 16px;
    background: no-repeat;
    min-width: 89px;
    max-width: 89px;
    min-height: 135px;
    max-height: 135px;
    /* Задайте высоту контейнера */
    object-fit: cover;
}

.slider-card {
    height: 52px;
    z-index: 2;
    background: #29b6f6;
    border-radius: 0px 0px 12px 12px;
}

.slider-button {
    font-size: 18px;
    line-height: 22px;
    color: #ffffff;
}

.v-carousel__controls {
    background: none !important;
}
</style>
