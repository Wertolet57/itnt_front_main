<template>
    <div :class="{'has-folder': hasFolders}">
        <ChatFolders v-if="hasFolders" />
        <div v-if="chatData" v-for="chat in chatData" class="">
            <div @click="navigateToChat(chat.id)" v-if="lastMessages[chat?.id]" class="card shadow-none cursor-pointer">
                <span class="card__image  border-chatThird">
                    <img class="rounded-[100%] w-[40px] h-auto max-h-[40px] aspect-square"
                        :src="getOtherUser(chat)?.pictureUrl ? `${baseAvaURL}/files/${getOtherUser(chat).pictureUrl}` : avatar"
                        alt="User Avatar" />
                </span>
                <!-- {{ chat }} -->
                <!-- {{ lastMessages[chat?.id].dialog.users }} -->
                <!-- <div class="" v-for="user in lastMessages[chat?.id].dialog.users">
                    {{ user.id }}
                </div> -->
                <!-- {{ getOtherUser(chat)?.login }} -->
                <div class="flex flex-col flex-1">
                    <div class="flex flex-row justify-between flex-1">
                        <div v-if="lastMessages[chat?.id]?.user?.id == userId" class="card__name">
                            {{
                                getOtherUser(chat)?.firstName && getOtherUser(chat)?.lastName
                                    ? `${getOtherUser(chat)?.firstName} ${getOtherUser(chat)?.lastName}`
                                    : getOtherUser(chat)?.firstName || getOtherUser(chat)?.lastName || getOtherUser(chat)?.login
                            }}
                            <p class="font-normal mt-[4px] text-sm"><span class="text-gray-400 font-normal">Вы</span> {{
                                lastMessages[chat?.id]?.messageText }}</p>
                        </div>
                        <div v-else class="card__name">
                            {{
                                lastMessages[chat?.id]?.user.firstName && lastMessages[chat?.id]?.user.lastName
                                    ? `${lastMessages[chat?.id]?.user.firstName} ${lastMessages[chat?.id]?.user.lastName}`
                                    : lastMessages[chat?.id]?.user.firstName || lastMessages[chat?.id]?.user.lastName ||
                                    lastMessages[chat?.id]?.user.login
                            }}
                            <p class="font-normal mt-[4px] text-sm">{{ lastMessages[chat?.id]?.messageText }}</p>
                        </div>
                        <div v-if="lastMessages[chat?.id]?.messageDate" class="flex flex-row items-start gap-[6px]">
                            <p class="card__time">{{ formatDate(lastMessages[chat?.id]?.messageDate) }}</p>
                            <div class="w-[20px]">
                                <img v-if="lastMessages[chat?.id]?.user?.id == userId"
                                    :src="lastMessages[chat?.id]?.readStatus ? seen : delivered" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="fixed bottom-20 right-6 bg-marine z-[10000]  rounded-[12px]">
            <button @click="showSheet = true" class="p-[10px]"><img :src="plus" alt=""></button>
            <transition name="bottom-sheet">
                <div v-if="showSheet" style="overflow-y: auto;" class="bottom-sheet bg-white text-left"
                    @click="showPopup = false">
                    <div class="searchTeammateModal modal">
                        <h6 class="text mb-2">Создание новой беседы</h6>
                        <UiInput prepend-icon="magnify" label="Введите данные для поиска" v-model="searchQuery" />
                        <div class="mt-4 date rounded-xl d-inline-block">Результаты поиска:</div>
                        <div class="searchTeammateModal__items">
                            <div v-for="user in users" :key="user?.id" class="d-flex align-center"
                                @click="() => openUser(user?.id)">
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
                    <v-btn @click="showSheet = false" class="close-btn text-white mr-2" icon="mdi-check" color="#00e676" />
                </div>
            </transition>
        </div>
    </div>
</template>
<script setup lang="ts">
import ava from "../../assets/demo/defAva.svg"
import avatar from '~/assets/Profile/Photo.svg'
// import send from '~/assets/chat/send.svg'
import seen from '~/assets/chat/seen.svg'
import delivered from '~/assets/chat/delivered.svg'
import ChatFolders from './ChatFolders.vue'
import plus from '~/assets/modal_icon/plus.svg'
import UiInput from '~/components/ui-kit/UiInput.vue'
import { ref, watch, computed, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { getUserSearch } from '~/API/ways/user'
import { getDialog, getDialogMessages, createDialog, getDialogLastMessage } from '~/API/ways/dialog';
import debounce from 'lodash/debounce';

interface User {
    id: number;
    firstName?: string;
    pictureUrl?: string;
    login?: string;
}

const router = useRouter()
const showSheet = ref(false)
const userId = ref(localStorage.getItem('userId'))
const navigateToChat = (chatId: any) => {
    if (chatId) {
        router.push(`/messenger/chat/${chatId}`);
    } else {
        console.error('ID чата не указан!');
    }
};

const hasFolders = computed(() => {
    return router.currentRoute.value.path.includes('/messenger') && !router.currentRoute.value.path.includes('/chat/');
});

const getOtherUser = (currentChat: any) => {
    return lastMessages.value[currentChat?.id]?.dialog?.users?.find(
        (user: User) => user.id !== Number(userId.value)
    ) || null;
};
let showPopup = ref(false)
const openUser = async (userId: number) => {
    try {
        const response = await createDialog(userId);

        const chatId = response?.data?.object?.id;
        if (chatId) {
            console.log('Созданный chat.id:', chatId);
            router.push(`/messenger/chat/${chatId}`);
        } else {
            console.error('Не удалось получить chat.id. Проверьте структуру ответа:', response);
        }
    } catch (error) {
        console.error('Ошибка при создании диалога:', error);
    }
};
const lastMessages = ref<Record<number, any>>({});
const getLastMessages = async () => {
    if (!chatData.value || chatData.value.length === 0) {
        console.error("Список чатов пуст или не загружен.");
        return;
    }

    try {
        const promises = chatData.value.map(async (chat: any) => {
            try {
                const response = await getDialogLastMessage(chat.id);
                return { chatId: chat.id, message: response.data.object };
            } catch (error) {
                console.error(`Ошибка получения сообщения для чата ${chat.id}:`, error);
                return { chatId: chat.id, message: null };
            }
        });
        const results = await Promise.all(promises);
        results.forEach(({ chatId, message }) => {
            if (message) {
                lastMessages.value[chatId] = message;
            }
        });

        console.log("Последние сообщения:", lastMessages.value);
    } catch (error) {
        console.error("Ошибка при получении последних сообщений:", error);
    }
};

const chatData = ref()

const showDialog = async () => {
    try {
        const response = await getDialog();
        chatData.value = response.data.object
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
const chatDataId = ref()
const showDialogById = async () => {
    try {
        const response = await getDialogMessages(46);
        chatDataId.value = response.data.object
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};
const searchQuery = ref('');
const users = ref([]);

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
function formatDate(inputDate: any) {
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
const baseAvaURL = 'https://itnt.store/';

watch(searchQuery, (newQuery) => {
    searchUsers(newQuery);
});

onMounted(showDialog);
onMounted(showDialogById)
onMounted(getLastMessages)
watch(chatData, (newData) => {
    if (newData && newData.length > 0) {
        getLastMessages();
    }
});

</script>



<style scoped lang="scss">
.date {
    background: rgba(224, 224, 224, 0.5);
    font-size: 13px !important;
    letter-spacing: 0.01em !important;
    padding: 6px 20px;
    line-height: 14px;
}

.card {
    // font-family: Roboto;
    display: flex;
    flex-direction: row;
    background-color: #fff;
    padding: 9px 6px 13px 13px;
    border-bottom: 1px solid gainsboro;
    border-radius: 0px;

    &__image {
        position: relative;
        width: 40px;
        height: 40px;
        border: 3px solid #C7EDFF;
        border-radius: 100%;
        margin-right: 13px;

        &__chip {
            position: absolute;
            bottom: 0;
            left: 20px;
        }
    }

    &__v2 {
        position: relative;
        width: 40px;
        height: 40px;
        margin-right: 13px;
        border: 3px solid #85CFAB;
        border-radius: 99%;
        z-index: 99;

        &__chip {
            z-index: 999;
            position: absolute;
            bottom: -10px;
            // left:2px;
            text-align: center;
            display: flex;
            justify-content: center;
            padding: 0;
            width: 29px;
            height: 22px;
            color: white;
            left: 2px;
            background-color: #00E676;
        }
    }

    &__name {
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 1%;
        line-height: 18px;
    }

    &__time {
        font-size: 13px;
        font-weight: 400;
        letter-spacing: 1%;
        line-height: 14px;
        color: #9E9E9E;
    }

    &__message {
        font-size: 13px;
        font-weight: 400;
        letter-spacing: 1%;
        line-height: 14px;
        color: black;

        &__you {
            color: #9E9E9E;

        }
    }
}

.has-folder {
    @media (min-width: 1200px) {
        margin-left: 80px;
        width: calc(100% - 80px);
    }
}

.searchTeammateModal {
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
</style>