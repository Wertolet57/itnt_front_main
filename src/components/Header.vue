<script lang="ts">
export default {
    name: 'Header',
}
</script>

<template>
    <v-app-bar class="px-4 addaptive z-1 relative" :class="props.messenger ? 'header-chat' : 'header'" :elevation="0" height="46" color="white">
        <v-icon class="mr-3" @click="$router.back()" icon="mdi-arrow-left" />
        <h2 @click="copyID" v-show="props.showID">{{ chosenId }}</h2>

        <h2 v-show="props.routeName">{{ props.routeName }}</h2>
        <v-spacer v-if="search === false" />
        <div @click="toggleTopModal" class="ava cursor-pointer">
            <img v-if="fullAvatarUrl == null || fullAvatarUrl == ''" class="defAva" :src="defAva">
            <img class="img" v-else style="padding: 10px" v-if="props.showUserMinify === true" :src="fullAvatarUrl" />

        </div>
        <img class="cursor-pointer" @click="toggleProjectModal" style="padding: 10px"
            v-if="props.showControlDotsProject" :src="dots" />
        <img @click="toggleUserModal" style="padding: 10px" v-if="props.showControlDots" :src="dots" />

        <img @click="modalState.open()" style="padding: 10px" v-if="props.chat" :src="dots" />
        <vue-bottom-sheet ref="modalState">
            <div class="searchTeammateModal modal">
                <div class="modal__list">
                    <div class="modal__list__item">
                        <img :src="plus" alt="" />
                        <p class="txt-body1" @click="invite.open()">
                            Пригласить в проект
                        </p>
                    </div>
                    <div class="modal__list__item">
                        <img :src="complain" alt="" />
                        <p class="txt-body1 text-[#FF3D00]" @click="chat.open()">
                            Пожаловаться
                        </p>
                    </div>
                </div>

            </div>
        </vue-bottom-sheet>
        <vue-bottom-sheet class="h-[980px] max-h-[980px]" ref="invite">
            <div class="searchTeammateModal modal">
                <div v-if="followed && followed.length > 0">
                    <p class="mb-2">Выберите проект, в который хотите пригласить участника:</p>
                    <v-radio-group v-model="selectedProject" color="#29b6f6">
                        <v-radio v-for="(project, idx) in followed" :key="idx" class="" base-color="#29b6f6"
                            :label="project.project.name" :value="project.project.name"></v-radio>
                    </v-radio-group>
                    <UiTextArea label="Сопроводительное письмо*" v-model="props.textarea" />
                    <UiButton bg-color="blue" @click="sendProp">Отправить приглашение</UiButton>
                </div>
                <div v-else class="text-center py-4">
                    <p>У вас еще нет проектов</p>
                </div>
            </div>
        </vue-bottom-sheet>
        <vue-bottom-sheet max-height="480px" full-screen ref="chat">
            <div class="searchTeammateModal modal">
                <p class="mb-[24px]">Выберите причину жалобы на пользователя:</p>
                <div class="d-flex align-center mb-[48px]">
                    <img @click="$router.push('/user/' + lastPart)" class="mr-3 cursor-pointer" width="37" height="37"
                        :src="ava" />
                    <div>
                        <div class="d-flex cursor-pointer align-center">
                            <p class="txt-body3"> {{ lastPart }}</p>
                        </div>
                    </div>
                </div>
                <v-radio-group v-model="complaint" color="#29b6f6">
                    <v-radio class="searchTeammateModal__item" base-color="#29b6f6" label="Спам" value="Спам"></v-radio>
                    <v-radio class="searchTeammateModal__item" base-color="#29b6f6" label="Агрессивное поведение"
                        value="Агрессивное поведение"></v-radio>
                    <v-radio class="searchTeammateModal__item" base-color="#29b6f6"
                        label="Взрослый контент (ссылки, картинки, видео и т.п.)" value="Взрослый контент"></v-radio>
                </v-radio-group>
                <UiButton bg-color="blue" @click="sendComplaint">Отправить жалобу</UiButton>
            </div>
        </vue-bottom-sheet>
        <div v-if="props.search" class="d-flex w-full align-center">
            <v-spacer />
            <v-icon icon="mdi-magnify" />
        </div>
    </v-app-bar>
    <UserProject :project="project" @close="closeUserProjectModal" v-if="showUserProjectModal" />
    <UserModal :userID="lastPart" @close="user.userObj.userModalState = false"
        v-if="user.userObj.userModalState === true" />

    <TopModal @close="isModalOpen = false" v-if="user.userObj.topModalState === true" />
</template>

<script lang="ts" setup>
import defAva from "../assets/demo/defAva.svg"
import ava from '../assets/demo/ava-small-header.svg'
import complain from '../assets/icons/warning-red.svg'
import plus from '../assets/project_modal/plus.svg'
import dots from "~/assets/icons/dots-black.svg"
import UserModal from './UserModal.vue'
import TopModal from './TopModal.vue'
import UiButton from "./ui-kit/UiButton.vue"
// import UiInput from './ui-kit/UiInput.vue'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
// import { storeToRefs } from 'pinia'
import UiTextArea from "./ui-kit/UiTextArea.vue"
import { useRoute } from 'vue-router'
import { useUserStore } from '~/store/user'
import { ref, computed, onMounted } from 'vue'
import { getUserByID, postAddComplaint } from '~/API/ways/user'
import { sendProposition } from '~/API/ways/notifications'
import { getProjectByID } from '~/API/ways/project'
import UserProject from "../components/UserProject.vue"
const lastPart = ref(null);
const router = useRoute()
const selectedProject = ref('');

const modalState = ref(null)
const chat = ref(null)
const invite = ref(null)
const user = useUserStore()
const me: modalActionsList[] = [
    {
        name: 'Удалить запись',
        icon: 'account',
    },
    {
        name: 'Редактировать',
        icon: 'account',
    }
]
const sendProp = async () => {
    await sendProposition(1, 1, 1, 'dd', "PROJECT_TO_USER")
}
const complaint = ref('')
const sendComplaint = async () => {
    await postAddComplaint(lastPart.value, localStorage.getItem('userId'), complaint.value,)
}
const props = defineProps({
    showLogo: {
        type: Boolean,
        default: false,
    },
    showID: {
        type: Boolean,
        default: false,
    },
    showUserMinify: {
        type: Boolean,
        default: false,
    },
    showControlDots: {
        type: Boolean,
        default: false,
    },
    showControlDotsProject: {
        type: Boolean,
        default: false,
    },
    search: {
        type: Boolean,
        default: false,
    },
    routeName: {
        type: String,
        default: '',
    },
    chat: {
        type: Boolean,
        default: false,
    },
    messenger:{
        type: Boolean,
        default: false,
    }
})
let data = ref({})
let followed = ref([])
const project = ref()

onMounted(async () => {
    // Получаем данные пользователя (например, для аватара)
    await getUserByID(Number(localStorage.getItem("userId"))).then((response) => {
        try {
            if (response.data && response.data.object) {
                data.value = response.data.object
                console.log('Full data:', data.value)

                if (Array.isArray(data.value.projects)) {
                    data.value.projects.forEach((project, index) => {
                    })

                    followed.value = data.value.projects.filter(project => project.relationType === 'PROJECT_OWNER')
                }
            } else {
                data.value = {}
                followed.value = []
            }
        } catch (e) {
            console.error('Error:', e)
            data.value = {}
            followed.value = []
        }
    })

    // Проверяем, находимся ли мы на странице проекта
    // Пример: /project/123
    if (
        router.path.startsWith('/project/') &&
        router.params.ID &&
        router.params.ID !== 'undefined' &&
        router.params.ID !== undefined &&
        router.params.ID !== null
    ) {
        await getProjectByID(router.params.ID).then((response) => {
            try {
                if (response.data && response.data.object) {
                    project.value = response.data.object
                } else {
                    project.value = null
                }
            } catch (e) {
                console.error('Error:', e)
                project.value = null
            }
        })
    }
})

const baseURL = 'https://itnt.store/';

const fullAvatarUrl = computed(() => {
    if (!data.value || !data.value.pictureUrl) return '';
    return `${baseURL}files/${data.value.pictureUrl}`;
});
function toggleTopModal() {
    user.userObj.topModalState = !user.userObj.topModalState
}
function toggleUserModal() {
    user.userObj.userModalState = !user.userObj.userModalState
}
const showUserProjectModal = ref(false)
function closeUserProjectModal() {
    showUserProjectModal.value = false
}
function toggleProjectModal() {
    showUserProjectModal.value = !showUserProjectModal.value
}

const chosenId = computed(() => {
    return '@' + (router.params.ID ? router.params.ID : localStorage.getItem('userId'))
})

function copyID() {
    navigator.clipboard.writeText(chosenId.value)
}
</script>

<style scoped lang="scss">
.addaptive {}

.searchTeammateModal {
    min-height: 350px;

    &__items {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;
    }

    &__item {
        display: flex;
        align-items: center;
        gap: 16px;
    }
}

.ava {
    max-width: 62px;
    max-height: 58px;
    padding: 0;
    margin: 0;

    .defAva {
        padding: 10px 0 12px 0;
        width: 60px;
        height: 60px;
        border-radius: 100%;
    }

    .img {
        width: 60px;
        height: 58px;
        border-radius: 100%;
    }
}

.header {
    @media (min-width: 1200px) {
        margin-left: 80px;
        background-color: #fffeee;
        width: calc(100% - 80px) !important;
    }
}

.header-chat {
    @media (min-width: 1200px) {
        margin-left: 0;
        background-color: #fffeee;
        width: calc(100%) !important;
    }
}
</style>