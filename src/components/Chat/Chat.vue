<template>
    <div>
        <Header :showUserMinify="true" :routeName="lastPart" :chat="true" />
        <!-- <div>Статус соединения: {{ connectionStatus }}</div> -->
        <ul>
            <li v-for="message in messages" :key="message.id">
                {{ message.content }}
            </li>
        </ul>
        <div class="" v-if="messages">

            {{ messages }}
        </div>
        <div class="input-container">
            <div class="inner-input">
                <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Введите сообщение..."
                    :disabled="connectionStatus !== 'open'" />
                <button @click="sendMessage" :disabled="connectionStatus !== 'open'">
                    <img :src="chat" alt="Send" />
                </button>
            </div>
        </div>
        <!-- <button @click="createNewDialog" :disabled="connectionStatus === 'connecting'">Создать новый диалог</button> -->
    </div>
</template>

<script lang="ts" setup>
import Header from '~/components/Header.vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { getDialogMessages, getDialogByID, sendMessage } from "../../API/ways/dialog";
import { webSocketService } from '../../helpers/websocket.ts';
import { useRoute } from 'vue-router';
import chat from '../../assets/icons/chat.svg';

const newMessage = ref('');
const messages = webSocketService.messages;
const currentDialogId = ref<number | null>(null);
const connectionStatus = webSocketService.connectionStatus;
const userId = ref(localStorage.getItem("userId"));
const route = useRoute();
const lastPart = ref(null);

const connectToWebSocket = () => {
    if (currentDialogId.value && userId.value) {
        webSocketService.connect(currentDialogId.value, userId.value);
    } else {
        console.error('DialogId или UserId не установлены');
    }
};
const getDialog = async () => {
    try {
        messages.value = await getDialogMessages(currentDialogId.value);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};
// const datas =ref()
// const getDialogList = async () => {
//     try {
//         datas.value = await getDialogByID(currentDialogId.value);
//     } catch (error) {
//         console.error('Error fetching messages:', error);
//     }
// };
// const createNewDialog = async () => {
//     try {
//         const newDialog = await webSocketService.createDialog('personal', userId.value);
//         currentDialogId.value = newDialog.id;
//         webSocketService.disconnect();
//         connectToWebSocket();
//     } catch (error) {
//         console.error('Не удалось создать новый диалог', error);
//     }
// };
const sendMessageAPI =async ()=>{
    try {
        const data ={
            "id": 1,
            "messageText": "string",
            "readStatus": true,
        }
        const response = await sendMessage(1,data)
    } catch (error) {
        
    }
}
const sendMessage = () => {
    if (newMessage.value.trim() && currentDialogId.value && connectionStatus.value === 'open') {
        webSocketService.sendMessage(currentDialogId.value, newMessage.value);
        newMessage.value = '';
    } else if (connectionStatus.value !== 'open') {
        console.error('Невозможно отправить сообщение: соединение не открыто');
    }
};

onMounted(() => {
    currentDialogId.value = 1;
    connectToWebSocket();

    const fullPath = window.location.origin + route.fullPath;
    lastPart.value = fullPath.split('/').pop();
    getDialog();
    // getDialogList();
});

onUnmounted(() => {
    webSocketService.disconnect();
});

watch(connectionStatus, (newStatus) => {
    if (newStatus === 'closed' || newStatus === 'error') {
        setTimeout(connectToWebSocket, 5000);
    }
});
</script>

<style scoped lang="scss">
.v-application .v-card,
.v-application .v-list-item,
.v-application .v-card-text {
    box-shadow: none !important;
    background: none;
}

.chat-screen {
    height: calc(100vh - 140px);
    overflow-y: auto;
}

.sent-message,
.received-message {
    display: flex;
    margin-bottom: 10px;
}

.sent-message {
    justify-content: flex-end;
}

.received-message {
    justify-content: flex-start;
}

.flex-none,
.flex-none-sent {
    flex: unset;
    border: 1px solid rgba(133, 207, 171, 0.15);
    border-radius: 12px 12px 2px 12px;
}

.radius-sent {
    border-radius: 12px 2px 12px 12px;
}

.radius-recieved {
    border-radius: 12px 12px 12px 2px;
}

.input-container {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    padding: 10px;
    background-color: #ffffff;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}

.inner-input {
    border: 1px solid #ddd;
    flex: 1;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    border-radius: 12px;
}

.inner-input:focus-within {
    outline: 2px solid #29B6F6;
}

input {
    width: 100%;
    outline: none;
}

button {
    padding: 10px;
    border: none;
    color: white;
}
</style>
