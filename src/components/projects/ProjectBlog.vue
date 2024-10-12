<template>
    <div v-if="blogData" class="feedCard mb-4">
        <div :class="{ 'feedCard__head-empty': withoutBg, 'feedCard__head': !withoutBg }" :style="headStyle">
            <div class="d-flex align-center">
                <div>
                    <div class="d-flex align-center">
                        <span class="txt-cap1 text-grey">{{ $t('feed.time') }}</span>
                    </div>
                    <p v-if="withoutBg" class="txt-body3 text-black mb-2">post id: {{ blogData.id }}</p>
                    <p v-else @click="$router.push(`user/${authorID}`)"
                        class="txt-body3 p-0 text-start text-white mb-2">
                        {{ author }}
                    </p>
                </div>
            </div>
            <button @click="modalState.open()">
                <v-icon :class="{ 'text-black': withoutBg }" icon="mdi-dots-vertical" />
            </button>
        </div>
        <div class="feedCard__body">
            <p class="txt-cap1">
                {{ props.blogData.descriptionHeader }}
            </p>
            <p class="txt-cap1 mt-4">
                {{ props.blogData.description }}
            </p>
        </div>
        <div class="" v-if="blogData && blogData.pictureUrls && blogData.pictureUrls.length > 0">
            <AddPostPhoto :post-id="blogData.id" :read-only="true"/>
        </div>
        <div v-if="props.userType == 'me'" class="feedCard__footer">
            <div class="d-flex align-center">
                <UiButton @click="shareBlog" bgColor="def " class="mr-3" :imgSrc="share"
                    style="padding: 10px 13px 10px 14px" onlyIcon />
                <div @click="$router.push(`${blogData.id}` + '/postComment')" class="def">
                    <img :src="chat" width="20" height="20" alt="">
                    <p class="text-xs text-center p-0 m-0">2</p>
                </div>
            </div>
            <Fire :prjType="false" :id="props.blogData.id" />
        </div>
        <div v-if="props.userType == 'user'" class="feedCard__footer">
            <UiButton bgColor="def" class="feedCard__footer__button"
                @click="$router.push(`${blogData.id}` + '/postComment')" fit>
                <p class="txt-cap1">Обсудить этот пост</p>
            </UiButton>
            <div class="d-flex align-center">
                <UiButton @click="shareBlog" bgColor="def" class="mr-3" :imgSrc="share"
                    style="padding: 11px 13px 9px 14px" onlyIcon />
                <Fire :prjType="false" :id="props.blogData.id" />
            </div>
        </div>
    </div>
    <vue-bottom-sheet ref="modalState">
        <div class="modal">
            <div class="modal__list">
                <template v-if="userType === 'user'">
                    <div @click="complaint" class="modal__list__item">
                        <img src="@/assets/icons/warning-red.svg" alt="" />
                        <p class="txt-body1 text-[#FF3D00]">Сообщить о нарушении</p>
                    </div>
                </template>
                <template v-else>
                    <div @click="props.delete" class="modal__list__item">
                        <img :src="trash" alt="" />
                        <p class="txt-body1">Удалить запись</p>
                    </div>
                    <div @click="$router.push(`post/${blogData.id}`)" class="modal__list__item">
                        <img :src="edit_icon" alt="" />
                        <p class="txt-body1">Редактировать</p>
                    </div>
                </template>
            </div>
        </div>
    </vue-bottom-sheet>

    <vue-bottom-sheet v-if="postData" ref="blogState">
        <UiPost :user-auth="true" v-model:description-header="postData.descriptionHeader"
            v-model:description="postData.description" :author-project="postData.authorProject"
            :author-user="postData.authorUser" card />
    </vue-bottom-sheet>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import UiButton from '../ui-kit/UiButton.vue'
import UiPost from '../ui-kit/UiPost.vue'
import Fire from '../Fire.vue'
import { addComplaint, getPostById } from "@/API/ways/post"
import share from "@/assets/icons/share-black.svg"
import chat from "@/assets/icons/chat-black.svg"
import bgImage from "@/assets/Frame221.png"
import trash from "@/assets/trash_blue.svg"
import edit_icon from "@/assets/edit_icon.svg"
import AddPostPhoto from "../AddPostPhoto.vue"
const props = defineProps({
    feedCardType: { type: String, default: '' },
    userType: { type: String, default: '' },
    blogData: { type: Object },
    withoutBg: { type: Boolean },
    author: { type: String },
    authorID: { type: [Number, String] },
    authorType: { type: String },
    delete: { type: Function, }
})

const modalState = ref(null)
const blogState = ref(null)
const postData = ref(null)
const complaintData = ref(null)

const headStyle = computed(() => ({
    'background-image': `url(${bgImage})`,
    'height': props.withoutBg ? 'auto' : '120px',
    'color': props.withoutBg ? 'black' : 'white'
}))


const shareBlog = () => {
    try {
        navigator.share({
            title: 'ITNT',
            text: 'Откройте для себя ITNT.',
            url: `http://62.113.105.220/${props.blogData.id}/postComment`,
        })
    } catch (error) {
        console.error('Ошибка при попытке поделиться:', error)
    }
}

const complaint = async () => {
    try {
        complaintData.value = await addComplaint(Number(props.blogData.id), Number(localStorage.getItem('userId')), '123')
    } catch (error) {
        console.error('Ошибка при отправке жалобы:', error)
    }
}
const getPost = async () => {
    try {
        const response = await getPostById(props.blogData.id)
        postData.value = response.data.object
    } catch (error) {
        console.error('Ошибка при получении поста:', error)
    }
}
onMounted(getPost)
</script>
<style scoped lang="scss">
.def {
    border-radius: 12px;
    padding: 4px 16px;
    border: 1px solid #9e9e9e33;
    background: linear-gradient(0deg, #ffffff, #ffffff),
        linear-gradient(0deg, rgba(158, 158, 158, 0.2), rgba(158, 158, 158, 0.2));
    box-shadow: 0px 12px 10px -10px rgba(0, 0, 0, 0.15),
        // 10px 40px 10px -23px rgba(0, 0, 0, 0.15);

}

.feedCard {
    padding: 0px 0px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 16px;

    &__head,
    &__head-empty {
        padding: 16px 6px 16px 19px;
        background-size: cover;
        // height: 128px;
        background-position: center;
        display: flex;
        border-radius: 12px 12px 2px 2px;
        align-items: flex-start;
        color: #ffffff;
        justify-content: space-between;

        &__subtitle {
            color: #9e9e9e;
            margin-top: 1px;
            text-align: initial;
        }
    }

    &__head {
        padding: 16px 6px 16px 19px;
    }

    &__head-empty {
        padding: 16px 6px 0px 19px;

    }

    &__body {
        padding: 0px 14px;

        text-align: left;

        &__slider {
            display: flex;
            gap: 16px;
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
        padding: 12px 14px;
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
