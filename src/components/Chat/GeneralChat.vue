<template>
    <ChatFolders />
    <div v-if="chatData" v-for="chat in chatData" class="">
        <div @click="$router.push(`/messenger/chat/${ chat.id }`)" class="card shadow-none cursor-pointer">
            <span class="card__image  border-chatThird">
                <img :src="avatar" alt="User Avatar" />
            </span>
            <div class="flex flex-col flex-1">
                <div class="flex flex-row justify-between flex-1">
                    <p class="card__name">{{  chat.id }}</p>
                    <div class="flex flex-row items-center gap-[6px]">
                        <img :src="delivered" alt="">
                        <p class="card__time">15:12</p>
                    </div>
                </div>
                <!-- <p class="card__message"><span class="card__message__you">Вы:</span> Это не критично, давай через
                    недельку вернёмся к этому
                    вопросу👍
                </p> -->
            </div>
        </div>        
    </div>
    <!-- <div v-if="chatData" v-for="chat in chatDataId" class="">
        <button>
            {{ chat.id }}
        </button>
        
    </div> -->
    <div class="absolute bottom-20 right-6 bg-marine  rounded-[12px]">
        <button @click="showSheet = true" class="p-[10px]"><img :src="plus" alt=""></button>
        <transition name="bottom-sheet">
            <div v-if="showSheet" style="overflow-y: auto;" class="bottom-sheet bg-white text-left"
                @click="showPopup = false">
                <div class="searchTeammateModal modal">
                    <h6 class="text mb-2">Создание новой беседы</h6>
                    <UiInput prepend-icon="magnify" label="Введите данные для поиска" v-model="searchQuery" />
                    <div class="mt-4 date rounded-xl d-inline-block">Пользователи из ваших контактов:</div>
                    <div class="searchTeammateModal__items">
                        <div v-for="user in filteredUsers" :key="user.id" class="d-flex align-center"
                         @click="() => openUser(user.id)">
                            <img class="mr-3" width="37" height="37" src="../../assets/demo/ava-small-header.svg" />
                            <div>
                                <div class="d-flex align-center">
                                    <p class="txt-body3">{{ user.id }}</p>
                                </div>
                                <p class="txt-cap1 text-[#9E9E9E]">{{ user.login }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4 date rounded-xl d-inline-block">Взаимная подписка:</div>
                    <div class="searchTeammateModal__items">
                        <div v-for="user in filteredUsers" :key="user.id" class="d-flex align-center"
                        @click="() => openUser(user.id)">
                            <img class="mr-3" width="37" height="37" src="../../assets/demo/ava-small-header.svg" />
                            <div>
                                <div class="d-flex align-center">
                                    <p class="txt-body3">{{ user.id }}</p>
                                </div>
                                <p class="txt-cap1 text-[#9E9E9E]">{{ user.login }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <v-btn @click="showSheet = false" class="close-btn text-white mr-2" icon="mdi-check" color="#00e676" />
            </div>
        </transition>
    </div>
</template>
<script setup lang="ts">

import avatar from '~/assets/Profile/Photo.svg'
// import send from '~/assets/chat/send.svg'
// import seen from '~/assets/chat/seen.svg'
import delivered from '~/assets/chat/delivered.svg'
import ChatFolders from './ChatFolders.vue'
import plus from '~/assets/modal_icon/plus.svg'
import UiInput from '~/components/ui-kit/UiInput.vue'
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { getUserSearch } from '~/API/ways/user'
import { getDialog , getDialogMessages ,createDialog} from '~/API/ways/dialog';
const router = useRouter()
const showSheet = ref(false)

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



// const newDialog = async (user:number) => {
//     try {
//         const response = await createDialog(user);
//         console.log('response', response)
//     } catch (error) {
//         console.error('Error fetching users:', error);
//     }
// };
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
interface User {
    id: number;
    roles: Array<any>;
    login: string;
    confirmed: boolean;
    errorConfirm: boolean;
}
const users = ref<User[]>([]);
const searchQuery = ref('');
const filteredUsers = computed(() => {
    if (!Array.isArray(users.value)) {
        console.error('Users is not an array:', users.value);
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
onMounted(fetchUsers);
onMounted(showDialog);
onMounted(showDialogById)
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
            text-align:center;
            display:flex;
            justify-content: center;
            padding: 0;
            width: 29px;
            height:22px;
            color:white;
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