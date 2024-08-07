<template>
    <div>
        <div class="d-flex mb-2 align-center justify-space-between">
            <p v-show="props.readOnly" style="color: #263238" class="txt-cap2">Наша команда:</p>
            <p v-show="!props.readOnly" style="color: #263238" class="txt-cap2">Участники проекта:</p>

            <UiButton @click="searchTeammateModal.open()" fit style="height: 36px; padding: 11px 16px" bgColor="smBlue"
                isSmall>
                <p class="txt-cap2">Заявки</p>
            </UiButton>
            <vue-bottom-sheet max-height="115px" full-screen ref="modalState">
                <div class="modalList">
                    <div v-for="(item, id) in joinTeamModalItems" :key="id" class="modalList__item">
                        <img :src="item.icon" alt="" />
                        <p :class="item.name === 'Пожаловаться' && 'error-txt'" class="txt-body1">{{ item.name }}</p>
                    </div>
                </div>
            </vue-bottom-sheet>
        </div>

        <!-- READONLY -->
        <div v-if="props.readOnly" class="projectTeam">
            <div class="projectTeam__list">
                <div v-for="users in teamMembers">
                    <div class="projectTeam__item d-flex justify-space-between">
                        <div class="d-flex projectTeam__item__main">
                            <img class="mr-5" src="../../assets/demo/projectsmallphoto.svg" alt="" />
                            <div class="txt-body2">
                                <p style="color: #263238">{{ users.user.login }}</p>
                                <p style="color: #9e9e9e"> {{ users.user.id }}</p>
                            </div>
                        </div>
                        <v-icon @click="modalState.open()" icon="mdi-dots-vertical" />
                    </div>
                </div>
            </div>

            <vue-bottom-sheet max-height="115px" full-screen ref="modalState">
                <div class="modalList">
                    <div v-for="(item, id) in readOnlyModalItems" :key="id" class="modalList__item">
                        <img :src="item.icon" alt="" />
                        <p :class="item.name === 'Пожаловаться' && 'error-txt'" class="txt-body1">{{ item.name }}</p>
                    </div>
                </div>
            </vue-bottom-sheet>
        </div>

        <!-- EDITABLE -->
        <div v-else>
            <div class="projectTeam__list">
                <div class="projectTeam__list">
                    <div v-for="users in teamMembers">
                        <div class="projectTeam__item--edit d-flex justify-space-between">
                            <div class="projectTeam__item__header--edit">
                                <div class="d-flex">
                                    <img class="mr-7" width="37" height="37"
                                        src="../../assets/demo/ava-small-header.svg" alt="" />

                                    <p class="txt-body2"> {{ users.user.login }}</p>
                                </div>
                                <div class="d-flex">
                                    <!-- <div class="isCEO">CEO</div> -->
                                    <div class="isCEO"> {{ users.user.id }}
                                    </div>

                                    <v-icon @click="modalState.open()" icon="mdi-dots-vertical" />
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
                <UiButton @click="joinTeam.open()" plus />
            </div>
        </div>

        <vue-bottom-sheet ref="modalState">
            <div class="modal">
                <div class="modal__list">
                    <div @click="$router.push('/'+ 'user/'  + `5`)" class="modal__list__item">
                        <img :src="account" alt="" />
                        <p class="txt-body1">
                            Открыть профиль
                        </p>
                    </div>
                    <div @click="teamRoles.open()" class="modal__list__item">
                        <img :src="commit" alt="" />
                        <p class="txt-body1">
                            Настроить полномочия

                        </p>
                    </div>
                    <div @click="delDialog" class="modal__list__item">
                        <img :src="close" alt="" />
                        <p class="txt-body1">
                            Удалить человека из проекта
                        </p>
                    </div>
                    <div @click="authority" class="modal__list__item">
                        <img :src="key" alt="" />
                        <p class="txt-body1">
                            Передать полномочия владельца проекта
                        </p>
                    </div>
                </div>
            </div>
        </vue-bottom-sheet>
        <vue-bottom-sheet ref="teamRoles">
            <div class="d-flex align-center mx-8">
                <img class="mr-3" width="30" height="30" src="../../assets/demo/ava-small-header.svg" />
                <div>
                    <div class="d-flex align-center">
                        <p class="txt-body3">qsa</p>
                    </div>
                    <p class="searchUserCard__head__subtitle txt-cap1">asas</p>

                </div>
            </div>
            <div class="mx-8">
                <v-row align="center" justify="start" class="mt-12">
                    <v-btn @click="togleState" class="pa-0 mr-7" min-width="32" min-href="32" variant="outlined"
                        color="#29B6F6">
                        <v-icon icon="mdi-check" :color="state ? '#29B6F6' : '#E0E0E0'" />
                    </v-btn>

                    <p class="license-text ma-0">
                        Может отвечать тем, кто пишет <br />
                        в личные сообщения проекту <br />
                    </p>
                </v-row>
            </div>
            <div class="mx-8">
                <v-row align="center" justify="start" class="mt-12">
                    <v-btn @click="togleState" class="pa-0 mr-7" min-width="32" min-href="32" variant="outlined"
                        color="#29B6F6">
                        <v-icon icon="mdi-check" :color="state ? '#29B6F6' : '#E0E0E0'" />
                    </v-btn>

                    <p class="license-text ma-0">
                        Может отвечать тем, кто пишет <br />
                        в личные сообщения проекту <br />
                    </p>
                </v-row>
            </div>
            <div class="mx-8">
                <v-row align="center" justify="start" class="mt-12">
                    <v-btn @click="togleState" class="pa-0 mr-7" min-width="32" min-href="32" variant="outlined"
                        color="#29B6F6">
                        <v-icon icon="mdi-check" :color="state ? '#29B6F6' : '#E0E0E0'" />
                    </v-btn>

                    <p class="license-text ma-0">
                        Может отвечать тем, кто пишет <br />
                        в личные сообщения проекту <br />
                    </p>
                </v-row>
            </div>
            <div class="mx-8">
                <v-row align="center" justify="start" class="mt-12">
                    <v-btn @click="togleState" class="pa-0 mr-7" min-width="32" min-href="32" variant="outlined"
                        color="#29B6F6">
                        <v-icon icon="mdi-check" :color="state ? '#29B6F6' : '#E0E0E0'" />
                    </v-btn>

                    <p class="license-text ma-0">
                        Может отвечать тем, кто пишет <br />
                        в личные сообщения проекту <br />
                    </p>
                </v-row>
            </div>
            <div class="mx-8">
                <v-row align="center" justify="start" class="mt-12">
                    <v-btn @click="togleState" class="pa-0 mr-7" min-width="32" min-href="32" variant="outlined"
                        color="#29B6F6">
                        <v-icon icon="mdi-check" :color="state ? '#29B6F6' : '#E0E0E0'" />
                    </v-btn>

                    <p class="license-text ma-0">
                        Может отвечать тем, кто пишет <br />
                        в личные сообщения проекту <br />
                    </p>
                </v-row>
            </div>
        </vue-bottom-sheet>
        <vue-bottom-sheet full-screen ref="joinTeam">
            <div class="searchTeammateModal px-4 modal">
                <p class="mb-2 p-4">К команде iTalent хотят присоединиться пользователи:</p>
                <div v-for="(user, index) in userss" :key="user.id" class="user-item"
                    :class="{ 'expanded': expandedIndex === index }">
                    <div class="user-header" @click="toggleExpand(index)">
                        <img :src="user.avatar" class="user-avatar" alt="User avatar">
                        <div class="user-info">
                            <div class="user-name">{{ user.name }} </div>
                            <div class="user-status">{{ user.status }}</div>
                        </div>
                        <div class="user-actions txt-cap2">
                            <button @click="$router.push('/' + `messenger/chat/39`)" class="btn-chat">Чат</button>
                        </div>
                        <div class="icon-bg">
                            <v-icon color="#1769AA"
                                :icon="expandedIndex === index ? 'mdi-chevron-up' : ' mdi-chevron-down'"></v-icon>
                        </div>
                    </div>
                    <!-- <transition name="expand"> -->
                    <div v-if="expandedIndex === index" class="user-expanded">
                        <div class="user-message">{{ user.message }}</div>
                        <div class="user-actions txt-cap2">
                            <button class="btn-decline">Отклонить</button>
                            <button @click="$router.push('/' + `messenger/chat/39`)" class="btn-chat">Чат</button>
                            <button class="btn-approve">Одобрить</button>
                        </div>
                    </div>
                    <!-- </transition> -->

                </div>
            </div>

        </vue-bottom-sheet>
        <vue-bottom-sheet ref="searchTeammateModal">
            <div class="searchTeammateModal px-4 modal">
                <p class="mb-2">Поиск человека для добавления в проект</p>
                <UiInput prepend-icon="magnify" label="Введите данные для поиска" v-model="searchQuery" />
                <div class="searchTeammateModal__items">
                    <div v-for="user in filteredUsers" :key="user.id" class="d-flex align-center">
                        <img class="mr-3" width="30" height="30" src="../../assets/demo/ava-small-header.svg" />
                        <div>
                            <div class="d-flex align-center">
                                <p class="txt-body3">{{ user.id }}</p>
                                <img class="mx-2" src="../../assets/icons/singeDot-gray.svg" />
                                <p class="searchUserCard__head__subtitle txt-cap1">{{ user.login }}</p>
                            </div>
                            <span style="color: #9e9e9e" class="txt-cap1">{{ $t('feed.time') }}</span>

                        </div>
                    </div>
                </div>
            </div>
        </vue-bottom-sheet>
        <v-dialog v-model="authority" width="100%">
            <v-card class="ui-skills__search p-4">
                <p>
                    <span>Изменение фонового изображения</span>
                </p>
                <div class="ui-skills__search__actions">
                    <UiButton @click="removeBackgroundPicture(id)" bgColor="smOutlined" isSmall>Удалить</UiButton>
                    <UiButton bgColor="smOutlined" isSmall>Заменить</UiButton>
                </div>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteMember" width="100%">
            <v-card class="ui-skills__search p-4 text-left">
                <p>Пожалуйста, подойдите к этому ответственно.</p>
                <p class="text-[#FF3D00]"> Вы дейстительно хотите исключить Анну Краснову из проекта? </p>

                <div class="ui-skills__search__actions">
                    <UiButton bgColor="smDefault" isSmall>Оставить</UiButton>
                    <UiButton bgColor="smError" isSmall>Исключить</UiButton>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
///icon
import close from '~/assets/project_team/close.svg'
import commit from '~/assets/project_team/commit.svg'
import key from '~/assets/project_team/key.svg'

//
import account from "~/assets/icons/account-blue.svg"
import UiButton from '../ui-kit/UiButton.vue'
import UiInput from '../ui-kit/UiInput.vue'
import { modalActionsList } from '~/helpers/types'
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet'
import '@webzlodimir/vue-bottom-sheet/dist/style.css'
import { ref, computed, onMounted } from 'vue'
import { reactToProposition } from '~/API/ways/notifications.ts';
import { getUserSearch } from '~/API/ways/user.ts';
import { getProjectPropositions, getUserProjectPropositions } from "~/API/ways/notifications.ts"
import { useRoute } from 'vue-router'
import ava from '../../assets/demo/ava-small-header.svg'
const state = ref(false)

function togleState() {
    state.value = !state.value
}
const userss = ref([
    { id: 1, name: 'Feofan', status: 'Team mood', avatar: ava, message: '' },
    { id: 2, name: 'Евгений Анисимов', status: 'Database ninja', avatar: ava, message: 'Здравствуйте! Кажется я тот, кого вы ищете!' }
]);

const expandedIndex = ref(null);

const toggleExpand = (index) => {
    expandedIndex.value = expandedIndex.value === index ? null : index;
};
const route = useRoute()
let authority = ref(false)
let deleteMember = ref(false)

const delDialog = () => {
    if (modalState.value) {
        modalState.value.close()
    }
    deleteMember.value = true
}
const authorityModal = () => {
    if (modalState.value) {
        modalState.value.close()
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
        type: Object,
    },
})
const users = ref<User[]>([]);
const searchQuery = ref('');

enum Answer {
    Yes = "YES",
    No = "NO"
}
const teamMembers = ref([]);
onMounted(async () => {
    //есть два ответа в id 10
    const response = await getProjectPropositions(Number(route.params.ID));
    teamMembers.value = response.data.object;
    console.log('getProjectPropositions', response)
})
onMounted(async () => {
    //есть 2 ответов в projectId 10 и userId 1
    await getUserProjectPropositions(Number(route.params.ID), localStorage.getItem('userId')).then((response) => {
        try {
            console.log('getUserProjectPropositions', response)
        } catch (e) {
            console.error('text error:', e)
        }
    })
})
const filteredUsers = computed(() => {
    if (!Array.isArray(users.value)) {
        // console.error('Users is not an array:', users.value);
        return [];
    }
    return users.value.filter(user => {
        const searchLower = searchQuery.value.toLowerCase();
        return Object.values(user).some(value =>
            String(value).toLowerCase().includes(searchLower)
        );
    });
});
const fetchUsers = async () => {
    try {
        const response = await getUserSearch();
        if (response.data && Array.isArray(response.data.object)) {
            users.value = response.data.object;
        } else {
            console.error('Fetched data is not in expected format:', response.data);
            users.value = [];
        }
        // console.log('Fetched users:', users.value);
    } catch (error) {
        console.error('Error fetching users:', error);
        users.value = [];
    }
};
const react = async (propositionAnswer: Answer) => {
    try {
        const propositionId = 3;

        const response = await reactToProposition(propositionAnswer, propositionId);
        console.log(response);

    } catch (error) {
        console.error('Error sending proposition:', error);
    }
};

// 
const teamRoles = ref(false)
const modalState = ref(null)
const searchTeammateModal = ref(null)
let joinTeam = ref(false)
const demoInfo = [
    {
        name: 'Евгений Анисимов',
        time: '3ч',
        spec: 'Младший Шеф-Повар',
    },

]


const readOnlyModalItems: modalActionsList[] = [
    {
        name: 'Открыть профиль',
        icon: account,
    },
]

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
    },
]
onMounted(fetchUsers);

</script>

<style lang="scss" scoped>
.projectTeam {
    &__list {
        display: flex;
        flex-direction: column;
        gap: 1px;
    }

    &__item {
        align-items: center;
        padding: 16px 9px 15px 16px;
        border-radius: 12px 12px 2px 2px;
        background: #fff;

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
    font-weight: bold;
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
</style>