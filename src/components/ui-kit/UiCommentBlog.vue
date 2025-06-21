<template>
    <div v-if="props.blogData" class="feedCard mb-4">
        <!-- head -->
        <div v-if="props.withoutBg" class="feedCard__head-empty">
            <div class="d-flex align-center">
                <div>
                    <div class="d-flex align-center">
                        <span style="color: #9e9e9e" class="txt-cap1">{{ time }}</span>
                    </div>
                    <p class="txt-body3 text-black mb-2"> post id: {{ props.blogData.id }}</p>
                </div>
            </div>
            <button v-if="props.editable == false" @click="modalState.open()">
                <v-icon class="text-black" icon="mdi-dots-vertical" />
            </button>
        </div>
        <div v-else class="feedCard__head"
            :style="{ 'background-image': 'url(' + backgroundImageUrl + ')', 'height': imageHeight, 'color': Color }">
            <div class="d-flex align-center">
                <div>
                    <div class="d-flex align-center">
                        <span style="color: #9e9e9e" class="txt-cap1">{{ time }}</span>
                    </div>
                    <p @click="$router.push(`/${authorType}/${authorID}`)" class="txt-body3 p-0 text-start mb-2">
                         {{ author }}
                    </p>
                </div>
            </div>
            <button v-if="props.editable == false" @click="modalState?.open()">
                <v-icon icon="mdi-dots-vertical" />
            </button>
        </div>
        <div class="" v-if="blogData && blogData.pictureUrls && blogData.pictureUrls.length > 0">
            <AddPostPhoto :post-id="blogData.id" :read-only="true"/>
        </div>
        <!-- body -->
        <div v-if="props.editable == false" class="feedCard__body">
            <!-- Новый этап проекта -->
            <div v-if="props.feedCardType === 'newProjectStage'">
                <p class="txt-cap1">
                    {{ props.blogData.descriptionHeader }}
                </p>
                <p class="txt-cap1 mt-4">
                    {{ props.blogData.description }}
                </p>
                <p class="txt-cap1 mt-1">

                </p>
            </div>


            <!-- Слайдер -->
            <div v-if="props.feedCardType === 'newProjectPhotos'">
                <p class="txt-cap1">
                    {{ props.blogData.descriptionHeader }}
                </p>
                <div class="feedCard__body__slider">
                    <img width="135" v-for="i in 5" height="204" src="../../assets/demo/demo-rec1.png" />
                </div>
            </div>
        </div>
        <div v-if="props.editable == true" class="feedCard__body">
            <!-- Новый этап проекта -->
            <div v-if="props.feedCardType === 'newProjectStage'">
                <UiInput label="Заголовок" v-model="localBlogData.descriptionHeader" />
                <UiInput label="Описание" class="mt-4" v-model="localBlogData.description" />
            </div>
            <AddPostPhoto class="p-4" :post-id="blogData.id" :read-only="false" />

            <!-- Слайдер -->
            <div v-if="props.feedCardType === 'newProjectPhotos'">
                <p class="txt-cap1">
                    {{ props.blogData.descriptionHeader }}
                </p>
                <div class="feedCard__body__slider">
                    <img width="135" v-for="i in 5" height="204" src="../../assets/demo/demo-rec1.png" />
                </div>
            </div>
        </div>
        <!-- footer -->
        <div v-if="props.editable == false" class="feedCard__footer">
            <div class="d-flex align-center">
                <UiButton @click="shareBlog" bgColor="def " class="mr-3" :imgSrc="share"
                    style="padding: 10px 13px 10px 14px" onlyIcon />
            </div>
            <Fire :prjType="false" :id="props.blogData.id" />
        </div>
        <div v-if="props.editable == true" class="feedCard__footer">
            <UiButton @click="emitUpdate" bgColor="blue" class="mr-3">Сохранить</UiButton>
        </div>
        <vue-bottom-sheet ref="modalState">
            <div class="modal">
                <div class="modal__list">
                    <div @click="complaint" class="modal__list__item">
                        <img src="../../assets/icons/warning-red.svg" alt="" />
                        <p class="txt-body1 text-[#FF3D00]">
                            Сообщить об нарушении
                        </p>
                    </div>
                </div>

            </div>
        </vue-bottom-sheet>
    </div>
</template>

<script lang="ts" setup>
import AddPostPhoto from '../AddPostPhoto.vue'
import share from "~/assets/icons/share-black.svg"
import bgImage from "~/assets/Frame221.png"
import Fire from '../Fire.vue'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import UiButton from '../ui-kit/UiButton.vue'
import UiInput from '../ui-kit/UiInput.vue'
import { computed, ref, watch } from 'vue'
import { addComplaint } from "../../API/ways/post"
const props = defineProps({
    feedCardType: {
        type: String,
        default: '',
    },
    blogData: {
        type: Object,
    },
    withoutBg: {
        type: Boolean,
    },
    editable: {
        type: Boolean,
        default: false
    }
})

let complaintData = ref()
const complaint = async () => {
    const data = addComplaint(Number(props.blogData.id), Number(localStorage.getItem('userId')), '123')
    complaintData.value = data;

}
const emit = defineEmits(['update'])

const localBlogData = ref({ ...props.blogData })

watch(() => props.blogData, (newVal) => {
    localBlogData.value = { ...newVal }
}, { deep: true })

const emitUpdate = () => {
    emit('update', {
        description: localBlogData.value.description,
        descriptionHeader: localBlogData.value.descriptionHeader,
        backgroundPictureUrl: null,
        id: localBlogData.value.id,
    })
}
const modalState = ref<any>(null)
const shareBlog = () => {
    try {
        navigator.share({
            title: 'ITNT',
            text: 'Откройте для себя ITNT.',
            url: 'http://62.113.105.220/post/' + `${props.blogData.id}`,
        })
    } catch (error) {
        console.log('error :' + error)
    }
}

const baseURL = 'https://itnt.store/';

const backgroundImageUrl = computed(() => {
    return props.blogData?.backgroundPictureUrl ? `${baseURL}files/${props.blogData.backgroundPictureUrl}` : bgImage;
});

const hasCustomImage = computed(() => {
    return !!props.blogData?.backgroundPictureUrl;
});

const imageHeight = computed(() => {
    return '120px';
});

const Color = computed(() => {
    return hasCustomImage.value ? 'white' : 'black'
});

const feedCardSubtitle = computed(() => {
    if (props.feedCardType === 'newProjectStage') {
        return ' Перешли на новый этап:'
    } else if (props.feedCardType === 'newProjectPhotos') {
        return ' В проекте обновились фото: '
    }
});

const authorID = computed(() => {
    return props.blogData?.authorProject ? props.blogData?.authorProject.id : props.blogData?.authorUser.id;
});

const authorType = computed(() => {
    return props.blogData?.authorProject ? "project" : "user";
});

const author = computed(() => {
    return props.blogData?.authorProject ? props.blogData?.authorProject.name : props.blogData?.authorUser?.firstName;
});

const time = computed(() => {
    return props.blogData?.created?.split("T")[0];
});

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
