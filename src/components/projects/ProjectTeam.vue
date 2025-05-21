<template>
    <div>
        <div class="d-flex mb-2 align-center justify-space-between">
            <p v-show="props.readOnly" style="color: #263238" class="txt-cap2">Наша команда:</p>
            <p v-show="!props.readOnly" style="color: #263238" class="txt-cap2">Участники проекта:</p>
            <UiButton v-if="checkOrders && checkOrders.id && checkOrders.id == props.userID" @click="joinTeam.open()" fit
                style="height: 36px; padding: 11px 16px" bgColor="smBlue" isSmall>
                <p @click="joinTeam.open()" class="txt-cap2">Заявки
                <div v-if="teamMembers.length > 0" class="length">{{ teamMembers.length }}</div>
                </p>
            </UiButton>
            <vue-bottom-sheet max-height="245px" full-screen ref="modalState">
                <div class="modalList">
                    <div class="modalList__item flex flex-row">
                        <img :src="account" alt="" />
                        <p class="txt-body1">Открыть профиль</p>
                    </div>
                </div>
            </vue-bottom-sheet>
        </div>

        <!-- READONLY -->
        <div v-if="props.readOnly" class="projectTeam">
            <div class="projectTeam__list">
                <div v-for="users in props.team" :key="users.user.id">
                    <div v-if="users.relationType === 'PROJECT_USER'"
                        class="projectTeam__item d-flex justify-space-between">
                        <div class="d-flex projectTeam__item__main">
                            <img v-if="users.user.pictureUrl" class="mr-5" :src="`${baseURL}/files/${users.user.pictureUrl}`" alt="" />
                            <img v-else class="mr-5 w-[35px] h-[35px]" :src="ava" alt="" />
                            <div class="txt-body2">
                                <p style="color: #263238">{{ users.user.firstName }}</p>
                                <p style="color: #9e9e9e"> {{ users.user.id }}</p>
                            </div>
                        </div>
                        <v-icon @click="openModal(users.user.id)" icon="mdi-dots-vertical" />
                    </div>
                </div>
            </div>

            <vue-bottom-sheet max-height="105px" full-screen ref="modalState">
                <div class="modalList">
                    <div @click="$router.push('/user/' + selectedUserId)" class="modalList__item flex flex-row">
                        <img :src="account" alt="" />
                        <p class="txt-body1">Открыть профиль</p>
                    </div>
                </div>
            </vue-bottom-sheet>
        </div>

        <!-- EDITABLE -->
        <div v-else>
            <div class="projectTeam__list">
                <div class="projectTeam__list">
                    <div v-for="users in props.team" :key="users.user.id">
                        <div v-if="users.relationType === 'PROJECT_USER'"
                            class="projectTeam__item--edit d-flex justify-space-between">
                            <vue-bottom-sheet max-height="245px" full-screen ref="editState">
                                <div class="modalList">
                                    <div @click="$router.push('/' + `user/${users.user.id}`)"
                                        class="modalList__item flex flex-row">
                                        <img :src="account" alt="" />
                                        <p class="txt-body1">Открыть профиль</p>
                                    </div>
                                    <div @click="delDialog" class="modalList__item flex flex-row">
                                        <img :src="close" alt="" />
                                        <p class="txt-body1 error-txt">Удалить человека из проекта</p>
                                    </div>
                                    <div @click="authorityModal" class="modalList__item flex flex-row">
                                        <img :src="key" alt="" />
                                        <p class="txt-body1">Передать полномочия владельца проекта</p>
                                    </div>
                                </div>
                            </vue-bottom-sheet>
                            <div class="projectTeam__item__header--edit">
                                <div class="d-flex">
                                    <img class="mr-7" width="37" height="37"
                                        src="../../assets/demo/ava-small-header.svg" alt="" />
                                    <p class="txt-body2"> {{ users.user.login }}</p>
                                </div>
                                <div class="d-flex">
                                    <div class="isCEO"> {{ users.user.id }}</div>
                                    <v-icon @click="editState.open()" icon="mdi-dots-vertical" />
                                </div>
                            </div>
                            <div class="projectTeam__item__body--edit">
                                <v-icon icon="mdi-eye-off-outline" />
                                <UiInput style="max-width: 250px" label="Должность*" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="d-flex mt-2 justify-space-between align-center">
                Пригласить участника
                <UiButton @click="searchTeammateModal.open()" plus />
            </div>
        </div>
        <vue-bottom-sheet full-screen ref="joinTeam">
            <div class="searchTeammateModal modal">
                <p class="mb-2 p-4">К команде iTalent хотят присоединиться пользователи:</p>
                <div v-for="(user, index) in teamMembers" :key="user.id" class="user-item"
                    :class="{ 'expanded': expandedIndex === index }">
                    <div class="user-header" @click="toggleExpand(index)">
                        <img :src="ava" class="user-avatar" alt="User avatar">
                        <div class="user-info">
                            <div class="user-name">{{ user.user.firstName }} </div>
                            <div class="user-status">{{ user.user.login }}</div>
                        </div>
                        <div v-if="expandedIndex !== index" class="user-actions txt-cap2">
                            <button @click="$router.push('/' + `messenger/chat/${user.user.id}`)"
                                class="btn-chat">Чат</button>
                        </div>
                        <div class="icon-bg">
                            <v-icon color="#1769AA"
                                :icon="expandedIndex === index ? 'mdi-chevron-up' : ' mdi-chevron-down'"></v-icon>
                        </div>
                    </div>
                    <div v-if="expandedIndex === index" class="user-expanded">
                        <div class="user-message">{{ user.message }}</div>
                        <div class="user-actions txt-cap2">
                            <button @click="react(Answer.No, user.id)" class="btn-decline">Отклонить</button>
                            <button @click="$router.push('/' + `messenger/chat/${user.user.id}`)" class="btn-chat">Чат</button>
                            <div @click="addUsers(user)">
                                <button class="btn-approve">Одобрить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </vue-bottom-sheet>
        <vue-bottom-sheet ref="searchTeammateModal">
            <div class="searchTeammateModal px-4 modal">
                <p class="mb-2">Поиск человека для добавления в проект</p>
                <UiInput prepend-icon="magnify" label="Введите данные для поиска" v-model="searchQuery" />
                <div class="searchTeammateModal__items">
                    <div v-for="user in users" :key="user?.id" class="d-flex align-center"
                        @click="() => openUser(user)">
                        <img class="mr-3 rounded-[100%] shadow-xl w-[37px] h-[37px]" width="37" height="37"
                            :src="user?.pictureUrl ? `${baseAvaURL}/files/${user.pictureUrl}` : ava" />
                        <div>
                            <div class="d-flex align-center">
                                <p class="txt-body3">{{ user?.firstName || `#${user?.id}` }}</p>
                            </div>
                            <p class="txt-cap1 text-[#9E9E9E]">{{ user?.login }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </vue-bottom-sheet>
        <v-dialog v-model="inviteDialog" width="100%">
            <v-card class="ui-skills__search p-4 text-left">
                <div class="d-flex align-center">
                    <img class="mr-3 rounded-[100%] shadow-xl w-[40px] h-[40px]" width="37" height="37"
                        :src="inviteId?.pictureUrl ? `${baseAvaURL}/files/${inviteId.pictureUrl}` : ava" />
                    <div class="mt-2 gap-0 ">
                        <p class=" mb-1">{{ inviteId?.firstName || `#${inviteId?.id}` }}</p>
                        <p class="txt-cap1 text-[#9E9E9E]">{{ inviteId?.login }}</p>
                    </div>
                </div>
                <UiTextArea label="Сопроводительное письмо*" v-model="inviteText" />
                <div class="">
                    <UiButton class="mt-4" @click="sendProp" bg-color="blue">Отправить пришлашение</UiButton>
                </div>
            </v-card>
        </v-dialog>
        <v-dialog v-model="authority" width="100%">
            <v-card class="ui-skills__search p-4">
                <p>Передача ключей от проекта!  Вы собираетесь передать полный контроль над проектом другому
                    человеку. Отменить это будет невозможно, вы потеряете роль владельца Danger Flower и не сможете
                    управлять проектом.  Будьте осторожны, опасайтесь мошенников.  
                </p>
                <p class="text-[#FF3D00]"> Передать ключи от проекта Анне Красновой? </p>
                <div class="ui-skills__search__actions">
                    <UiButton bgColor="" isSmall>Нет</UiButton>
                    <UiButton bgColor="smError" isSmall>Передать</UiButton>
                </div>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteMember" width="100%">
            <v-card class="ui-skills__search p-4 text-left">
                <p>Пожалуйста, подойдите к этому ответственно.</p>
                <p class="text-[#FF3D00]"> Вы дейстительно хотите исключить Анну Краснову из проекта? </p>
                <div class="ui-skills__search__actions">
                    <UiButton bgColor="" isSmall>Оставить</UiButton>
                    <UiButton bgColor="smError" isSmall>Исключить</UiButton>
                </div>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="3000" class="snackbar-above">
            {{ snackbar.message }}
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
///icon
import close from '~/assets/project_team/close.svg'
import commit from '~/assets/project_team/commit.svg'
import key from '~/assets/project_team/key.svg'
import ava from "~/assets/demo/defAva.svg"

//
import UiTextArea from '../ui-kit/UiTextArea.vue'
import account from "~/assets/icons/account-blue.svg"
import UiButton from '../ui-kit/UiButton.vue'
import UiInput from '../ui-kit/UiInput.vue'
import { modalActionsList } from '~/helpers/types'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import { ref, computed, onMounted, watch } from 'vue'
import { reactToProposition } from '~/API/ways/notifications.ts';
import { getUserSearch } from '~/API/ways/user.ts';
import { getProjectPropositions, sendProposition } from "~/API/ways/notifications.ts"
import { useRoute } from 'vue-router'
import { getProjectByID, addUser } from "../../API/ways/project.ts"
import debounce from 'lodash/debounce';
import { createDialog } from '~/API/ways/dialog';

const snackbar = ref({
    visible: false,
    message: '',
    color: 'success',
});

const showSnackbar = (message: string, color: string = 'success') => {
    snackbar.value.message = message;
    snackbar.value.color = color;
    snackbar.value.visible = true;
};

const state = ref(false)
const checkOrders = ref()
const editState = ref(false)
const selectedUserId = ref(null)
const baseURL = 'https://itnt.store/';

const openModal = (userId) => {
    selectedUserId.value = userId
    modalState.value.open()
}
onMounted(async () => {
    const response = await getProjectByID(Number(route.params.ID));
    checkOrders.value = response.data.object.owner;
})
function togleState() {
    state.value = !state.value
}
const inviteDialog = ref(false)
const inviteId = ref<any>(null)
const inviteText = ref('')
const openUser = async (user: any) => {
    inviteId.value = user
    inviteDialog.value = true
};
const sendProp = async () => {
    const proposition = {
        message: inviteText.value,
        user: {
            id: inviteId.value.id,
        },
        project: {
            id: Number(route.params.ID),
        },
        propositionDirection: "PROJECT_TO_USER",

    }
    try {
        const response = await sendProposition(proposition);
        console.log('createDialog', response)
        inviteDialog.value = false
        inviteText.value = ''
    } catch (error) {
        console.error('Error creating dialog:', error);
    }
};
const expandedIndex = ref<number | null>(null);

const toggleExpand = (index) => {
    expandedIndex.value = expandedIndex.value === index ? null : index;
};
const route = useRoute()
let authority = ref(false)
let deleteMember = ref(false)

const delDialog = () => {
    if (editState.value) {
        editState.value.close()
    }
    deleteMember.value = true
}
const authorityModal = () => {
    if (editState.value) {
        editState.value.close()
    }
    authority.value = true
}
interface User {
    id: number;
    roles: Array<any>;
    login: string;
    confirmed: boolean;
    errorConfirm: boolean;
}
const props = defineProps({
    readOnly: {
        type: Boolean,
        default: false,
    },
    team: {
        type: Array,
        default: () => []
    },
    userID: {
        type: Number
    }
})

enum Answer {
    Yes = "YES",
    No = "NO"
}
const teamMembers = ref<any[]>([]);
const getProjectPropositionsApi = async () => {
    try {
        const response = await getProjectPropositions(Number(route.params.ID));
        teamMembers.value = response.data.object;
        console.log('getProjectPropositions', response)
    } catch (error) {

    }

}
onMounted(getProjectPropositionsApi)
const searchQuery = ref('');
const users = ref<any[]>([]);

const searchUsers = debounce(async (query: string) => {
    if (!query.trim()) {
        users.value = [];
        return;
    }

    try {
        const response = await getUserSearch({
            searchString: query
        });
        users.value = response.data.object;
    } catch (error) {
        console.error('Error searching users:', error);
        users.value = [];
    }
}, 300);
const addUsers = async (userObj: any) => {
    try {
        await react(Answer.Yes, userObj.id);
        const response = await addUser(route.params.ID, userObj.user.id);
        if (response.data.operationResult === "ERROR" && response.data.operationInfo === "The user is already a member of the project") {
            showSnackbar("Такой пользователь уже находится в команде", "error");
        } else {
            showSnackbar("Пользователь успешно добавлен в команду", "success");
        }
        await getProjectPropositionsApi();
    } catch (error) {
        console.error(error);
        showSnackbar("Произошла ошибка при добавлении пользователя", "error");
    }
};

const react = async (propositionAnswer: Answer, propositionId: number) => {
    try {
        const response = await reactToProposition(propositionAnswer, propositionId);
        showSnackbar(
            propositionAnswer === Answer.Yes
                ? "Запрос успешно одобрен"
                : "Запрос отклонен",
            "success"
        );
        console.log(response);
    } catch (error) {
        console.error('Error sending proposition:', error);
        showSnackbar("Произошла ошибка при обработке запроса", "error");
    }
};
const baseAvaURL = 'https://itnt.store/';

const teamRoles = ref(false)
const modalState = ref(null)
const searchTeammateModal = ref(null)
let joinTeam = ref(false)


const editableModalItems: modalActionsList[] = [
    {
        name: 'Открыть профиль',
        icon: account,
    },
]
const joinTeamModalItems: modalActionsList[] = [
    {
        name: 'Открыть профиль',
        icon: account,
    },
    {
        name: 'Настроить полномочия',
        icon: commit,
    },
    {
        name: 'Удалить человека из проекта',
        icon: close,
    },
    {
        name: 'Передать полномочия владельца проекта',
        icon: key,
        func: () => {

        }
    },
]
watch(searchQuery, (newQuery) => {
    searchUsers(newQuery);
});

// Добавлено: вотчер для inviteDialog
watch(inviteDialog, (val) => {
    if (val && searchTeammateModal.value) {
        searchTeammateModal.value.close();
    }
});

</script>

<style lang="scss" scoped>
.length {
    position: absolute;
    top: -8px;
    right: -6px;
    border-radius: 50%;
    padding: 4px 6px;
    background: red;
}

.projectTeam {
    &__list {
        display: flex;
        flex-direction: column;
        gap: 1px;
    }

    &__item {
        align-items: center;
        padding: 16px 9px 15px 16px;
        background: #fff;

        &--first {
            border-radius: 12px 12px 2px 2px;
        }

        &--last {
            border-radius: 2px 2px 12px 12px;
        }

        &--edit {
            display: flex;
            flex-direction: column;
            background: white;
        }

        &__header {
            &--edit {
                display: flex;
                justify-content: space-between;
                padding-top: 16px;
                padding-left: 24px;
                padding-right: 8px;
            }
        }

        &__body {
            &--edit {
                display: flex;
                justify-content: space-between;
                padding-right: 14px;
                padding-bottom: 23px;
                padding-left: 30px;
                align-items: center;
            }
        }
    }
}

.searchTeammateModal {
    padding: 0;
    margin: 0;
    width: 100%;

    &__items {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;
        min-height: 350px;
    }

    &__item {
        display: flex;
        align-items: center;
        gap: 16px;
    }
}

.isCEO {
    color: #29b6f6;
    font-weight: 400;
}

.modalList {
    padding: 0 20px;

    &__item {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 20px;
        padding: 10px 0 0 0;
    }
}

.feedPanel :deep() {
    .v-expansion-panels {
        border: 1px solid blue !important;
        border-radius: 12px 12px 2px 2px !important;
    }

    .v-expansion-panel__shadow {
        display: none;
    }

    .v-expansion-panel-title__overlay {
        border-radius: 12px 12px 2px 2px;
        opacity: 0;
    }

    .v-expansion-panel-text__wrapper {
        padding: 16px 14px;
        // border-top: 1px solid #e0e0e0;
    }
}

.user-item {
    padding: 0px 10px;
    border-top: 1px solid #e0e0e0;
    overflow: hidden;
    background-color: #fff;

    &:last-child {
        border-bottom: 1px solid #e0e0e0;
    }
}

.user-header {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.user-info {
    flex-grow: 1;
}

.icon-bg {
    background-color: #E1F5FE;
    padding: 0px 10px;
    border-radius: 8px;
}

.user-name {
    font-weight: 400;
}

.user-status {
    color: #666;
    font-size: 0.9em;
}

.expand-icon {
    transition: transform 0.3s ease;
}

.expand-enter-active,
.expand-leave-active {
    transition: max-height 0.3s ease, opacity 0.3s ease;
    max-height: 300px;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    max-height: 0;
    opacity: 0;
}

.user-expanded {
    overflow: hidden;
    padding: 12px;
}

.user-message {
    margin-bottom: 10px;
}

.user-actions {
    display: flex;
    justify-content: start;
}

.user-actions button {
    padding: 9px 16px;
    // border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-right: 16px;
}

.btn-decline {
    border: 1px solid #E0E0E0;
    background-color: #fff;
}

.btn-chat {
    border: 1px solid #E0E0E0;
    background-color: #fff;
}

.btn-approve {
    background-color: #3498db;
    color: white;
}

.ui-skills {
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);

    &__search {
        padding: 40px 30px 30px 30px;
        border-radius: 20px !important;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05) !important;

        p {
            font-weight: 400;
            // margin-bottom: 24px;
            text-align: left;
        }

        &__actions {
            display: flex;
            justify-content: space-between;
        }
    }

}

.snackbar-above {
    z-index: 9999999 !important; // Ensure it is above the bottom sheet
}
::v-deep(.bottom-sheet__backdrop){
    z-index: 1000 !important;
}
</style>