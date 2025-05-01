<template>
    <div class="feedCard">
        <!-- head -->
        <div class="feedCard__head">
            <div class="d-flex align-center">
                <img @click="$router.push(`user/${props.post?.createdBy?.id}`)" class="mr-3 cursor-pointer" width="30" height="30" :src="fullAvatarUrl" />
                <div>
                    <div class="d-flex align-center">
                        <p @click="$router.push(`user/${props.post?.createdBy?.id}`)" class="txt-body3 cursor-pointer">
                            {{ props.post?.createdBy.firstName && props.post?.createdBy.lastName
                    ? `${props.post.createdBy.firstName} ${props.post.createdBy.lastName}`
                    : props.post?.createdBy.firstName || props.post?.createdBy.login }}
                        </p>
                        <img class="mx-2" src="../../assets/icons/singeDot-gray.svg" />
                        <span style="color: #9e9e9e" class="txt-cap1">{{ formatDate(props.post?.created) }}</span>
                    </div>

                    <p class="feedCard__head__subtitle txt-cap1">
                        {{ feedCardSubtitle }}

                        <span v-if="props.feedCardType === 'NEW_STAGE'" class="color-blue">{{
                    props.post?.relatedProject.projectStage }}</span>
                    </p>
                </div>
            </div>
            <v-icon @click="modalState.open()" icon="mdi-dots-vertical" color="#263238" class="font-weight-bold" />
        </div>

        <!-- body -->
        <div class="feedCard__body">
            <p> {{ postDescHeader }}</p>
            <p> {{ postDesc }}</p>

            <!-- Новый этап проекта -->
            <div v-if="props.feedCardType === 'NEW_STAGE'">
                <p class="txt-cap1">
                    {{ props.post?.description }}
                </p>
            </div>
            <!-- !Новый этап проекта -->

            <!-- Новый файл -->
            <div v-if="props.feedCardType === 'newFile'" class="d-flex">
                <img style="margin-right: 3px" src="../../assets/icons/media/ppt-blue.svg" alt="" />
                <div class="d-flex flex-column justify-space-between">
                    <p class="txt-cap1 color-blue">{{ $t('feed.invest') }}</p>
                    <p style="color: #9e9e9e" class="txt-cap1">7.2 Mb</p>
                </div>
            </div>

            <!-- Слайдер -->
            <div class="feedCard__body__slider" v-if="props.feedCardType === 'NEW_ATTACHMENT'">
                <div class="flex flex-row w-[135px] h-[204px] rounded-[12px]" v-for="file in filteredProjectFiles">
                    <img style="border-radius: 12px !important; object-fit: cover;" width="135" height="204"
                        :src="getFileUrl(file.pictureUrl)" alt="Project Image" class="rounded-[12px]" />
                </div>
            </div>

            <!-- Проекту требуются специалисты -->
            <div v-if="props.feedCardType === 'NEW_VACANCY'">
                <!-- {{ props.post?.relatedProject?.vacancy }} -->
                <div class="" v-for="vacancy in props.post?.relatedProject?.vacancy">
                    <UiVacancyPanel readOnly :data="vacancy" />
                </div>
            </div>

            <!-- Проект активно обсуждается -->
            <div v-if="props.feedCardType === 'PROJECT_ACTIVITY'"></div>
        </div>

        <!-- footer -->
        <div class="feedCard__footer">
            <UiButton bgColor="def" class="feedCard__footer__button" fit>
                <p @click="$router.push('project/' + props.post?.relatedProject?.id)"
                    v-if="props.feedCardType != 'PROJECT_ACTIVITY'" class="txt-cap1">{{ $t('feed.GoTo') }}</p>
                <p @click="$router.push('/' + props.post?.relatedProject?.id + '/blogComment')" v-else class="txt-cap1">
                    {{ $t('feed.comments') }}</p>
            </UiButton>
            <!-- <UiButton bgColor="def"></UiButton> -->
            <div class="d-flex align-center">
                <UiButton @click="sharePost" v-if="props.feedCardType != 'PROJECT_ACTIVITY'" bgColor="def" class="mr-3"
                    :imgSrc="share" style="padding: 10px 13px 9px 14px" onlyIcon />

                <Fire :prjType="false" :id="props.post.id" />
            </div>
        </div>
    </div>
    <vue-bottom-sheet max-height="100px" full-screen ref="modalState">
        <div class="modal">
            <div class="modal__list">
                <div v-for="(item, id) in modalItems" @click="item?.func" :key="id" class="modal__list__item">
                    <img :src="item.icon" alt="" />
                    <p class="error-txt txt-body1">{{ item.name }}</p>
                </div>
            </div>
        </div>
    </vue-bottom-sheet>
</template>

<script lang="ts" setup>
import ava from "../../assets/demo/defAva.svg"
import warning from "~/assets/icons/warning-red.svg"
import share from "~/assets/icons/share-black.svg";
import Fire from '../Fire.vue'
import UiButton from '../ui-kit/UiButton.vue'
import UiVacancyPanel from '../ui-kit/UiVacancyPanel.vue'
import { computed, ref } from 'vue'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import { modalActionsList } from '~/helpers/types'
const modalState = ref(false)
const modalItems: modalActionsList[] = [
    {
        name: 'Сообщить о нарушении',
        icon: warning,
    },
]
const props = defineProps({
    feedCardType: {
        type: String,
        default: '',
    },
    comment: {
        type: Boolean,
        default: '',
    },
    message: {
        type: String,
        default: '',
    },
    id: {
        type: String,
        default: '',
    },
    post: {
        type: Object,
        default: () => { },
    },
    postID: {
        type: Number,
        default: 0,
    },
    postDescHeader: {
        type: String,
        required: false,
    },
    postDesc: {
        reqired: false,
        type: String
    }
})

const feedCardSubtitle = computed(() => {
    if (props.feedCardType === 'PROJECT_ACTIVITY') {
        return 'Проект активно обсуждается'
    } else if (props.feedCardType === 'NEW_VACANCY') {
        return 'Проекту требуются специалисты'
    } else if (props.feedCardType === 'NEW_STAGE') {
        return ' Перешли на новый этап:'
    } else if (props.feedCardType === 'NEW_ATTACHMENT') {
        return ' В проекте обновились фото: '
    } else if (props.feedCardType === 'newFile') {
        return 'Добавили вложение: '
    }
})
const sharePost = () => {
    try {
        navigator.share({
            title: 'ITNT',
            text: 'Откройте для себя ITNT.',
            url: 'http://62.113.105.220/blog/' + props.post?.id,
        })
    } catch (error) {
        console.log('error :' + error)
    }
}
const baseURL = 'https://itnt.store/files/';

const isExternalUrl = (url: string | null) => {
    return url?.startsWith('http') || url?.startsWith(',');
};

const getFileUrl = (url: string) => {
    return `${baseURL}${url}`;
};
const filteredProjectFiles = computed(() =>
    props.post?.relatedProject.projectFiles.filter((file) => file.pictureUrl && !isExternalUrl(file.pictureUrl))
);
const baseAvaURL = 'https://itnt.store/';

const fullAvatarUrl = computed(() => {
    return props.post?.createdBy.pictureUrl ? `${baseAvaURL}files/${props.post?.createdBy.pictureUrl}` : ava;
});
function formatDate(inputDate:any) {
    const date = new Date(inputDate);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffMs / (1000 * 60)) % 60;

        if (diffHours > 0) {
            return `${diffHours}ч назад`;
        } else {
            return `${diffMinutes}м назад`;
        }
    } else if (isYesterday) {
        return `Вчера в ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}.${month}.${year} в ${hours}:${minutes}`;
    }
}
</script>

<style scoped lang="scss">
.feedCard {
    padding: 16px 14px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__head {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &__subtitle {
            color: #9e9e9e;
            margin-top: 1px;
            text-align: initial;
        }
    }

    &__body {
        text-align: left;

        &__slider {
            display: flex;
            gap: 16px;
            flex-direction: row !important;
            -ms-overflow-style: none;
            /* Internet Explorer 10+ */
            scrollbar-width: none;
            overflow-x: scroll;

            &::-webkit-scrollbar {
                display: none;
                /* Safari and Chrome */
            }
        }
    }

    &__vacancy {
        &__head {
            padding: 10px 20px;
            display: flex;
            gap: 10px;
            align-items: center;
            max-width: fit-content;
            border-radius: 8px;
            background: #e1f5fe;
        }
    }

    &__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &__button {
            padding: 14.5px 20px;
            box-shadow: 0px -1px 0px 0px rgba(0, 0, 0, 0.2) inset, 0px 23px 10px -23px rgba(0, 0, 0, 0.15);
        }
    }
}

.feedCard__panel :deep() {
    border: 1px solid $def-white;

    .v-expansion-panel__shadow {
        display: none;
    }

    .v-expansion-panel-title__overlay {
        opacity: 0;
    }

    .v-expansion-panel-text__wrapper {
        padding: 23px 20px;
        padding-top: 8px;
    }
}

.v-expansion-panel--active {
    border-radius: 12px !important;
    background: #ffffff;
    border: #c7edff 1px solid !important;
}
</style>
<script lang="ts">
export default {
    name: 'FeedCard',
}
</script>