<template>
    <div>
        <div>Статус соединения: {{ connectionStatus }}</div>
        <ul>
            <li v-for="message in messages" :key="message.id">
                {{ message.content }}
            </li>
        </ul>
        <input placeholder="Введите сообщение..." v-model="newMessage" @keyup.enter="sendMessage"
            :disabled="connectionStatus !== 'open'" />
        <button @click="sendMessage" :disabled="connectionStatus !== 'open'">Отправить</button>
        <button @click="createNewDialog" :disabled="connectionStatus === 'connecting'">Создать новый диалог</button>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue';
import { webSocketService } from '../../helpers/websocket';

const newMessage = ref('');
const messages = webSocketService.messages;
const currentDialogId = ref<number | null>(null);
const connectionStatus = webSocketService.connectionStatus;
const userId = ref(5); // Пример, замените на реальное получение ID пользователя

const connectToWebSocket = () => {
    if (currentDialogId.value && userId.value) {
        webSocketService.connect(currentDialogId.value, userId.value);
    } else {
        console.error('DialogId или UserId не установлены');
    }
};

onMounted(() => {
    // Здесь вы должны получить реальный dialogId, например из параметров маршрута
    currentDialogId.value = 1; // Пример
    connectToWebSocket();
});

onUnmounted(() => {
    webSocketService.disconnect();
});

watch(connectionStatus, (newStatus) => {
    console.log('Статус соединения изменился:', newStatus);
    if (newStatus === 'closed' || newStatus === 'error') {
        // Попытка переподключения через 5 секунд
        setTimeout(connectToWebSocket, 5000);
    }
});

const sendMessage = () => {
    if (newMessage.value.trim() && currentDialogId.value && connectionStatus.value === 'open') {
        webSocketService.sendMessage(currentDialogId.value, newMessage.value);
        newMessage.value = '';
    } else if (connectionStatus.value !== 'open') {
        console.error('Невозможно отправить сообщение: соединение не открыто');
    }
};

const createNewDialog = async () => {
    try {
        const newDialog = await webSocketService.createDialog('personal', userId.value);
        currentDialogId.value = newDialog.id;
        webSocketService.disconnect();
        connectToWebSocket();
    } catch (error) {
        console.error('Не удалось создать новый диалог', error);
    }
};

</script>
<!-- <template>
    <div class="">
        <Header showUserMinify :routeName="lastPart" :chat="true" />
        <div class="chat-container">
            <div class="date-container">
                <div class="date text-center rounded-xl d-inline-block">{{ $t('feed.today') }}</div>
            </div>
            <div class="messages-container">
                <div v-for="message in messagess" :key="message.id"
                    :class="['message', message.isMine ? 'my-message' : 'other-message']">
                    <div class="message-content">{{ message.text }}</div>
                    <div class="message-info">
                        <span class="message-time mr-1">{{ formatTime(message.timestamp) }}</span>
                        <span v-if="message.isMine" class="message-status">
                            <img :src="message.read ? delivered : chat" alt="">
                        </span>
                    </div>
                </div>
            </div>
            <div class="input-container">
                <div class="inner-input">
                    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
                    <button @click="sendMessage"><img :src="chat" alt=""></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { io } from '../../../node_modules/socket.io-client/build/esm/index';
import { sendMessage, getDialogByID } from '~/API/ways/dialog';
import { useRoute } from 'vue-router';
import chat from '../../assets/icons/chat.svg';
import ChatInput from '~/components/ui-kit/ChatInput.vue';
import Header from '~/components/Header.vue';
import delivered from '~/assets/chat/delivered.svg';

const messagess = ref([
    { id: 1, text: 'Привет! Слушай, тут в в обновлении статуса новых сообщений возникла какая-то ерунда, пока что в голову приходит только одно решение. Ставим в приоритет?', timestamp: '2024-08-01T10:00:00', isMine: false, read: true },
    { id: 2, text: 'Это не критично, давай через недельку вернёмся к этому вопросу 👍', timestamp: '2024-08-01T10:01:00', isMine: true, read: true },
    { id: 3, text: 'How are you?', timestamp: '2024-08-01T10:02:00', isMine: false, read: false },
]);

const newMessage = ref('');

const sendMessages = () => {
    if (newMessage.value.trim() !== '') {
        messages.value.push({
            id: Date.now(),
            text: newMessage.value,
            timestamp: new Date().toISOString(),
            isMine: true,
            read: false,
        });
        newMessage.value = '';
    }
};

const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};
const route = useRoute();
const lastPart = ref(null);
const messages = ref([]);
const socket = ref(null);
const token = localStorage.getItem('userToken')
const initializeSocket = () => {
    socket.value = io(`ws://62.217.181.172:8080/chat/1/5?token=${token}`, {
        query: {
            userId: 5,
            dialogId: 9,
        },
    });
    // socket.value = io(https://itnt.store/dialog', {
    //     query: {
    //         userId: 1,
    //         dialogId: 9,
    //     },
    // });
    socket.value.on('connect', () => {
        console.log('Connected to the server.');
    });

    socket.value.on('disconnect', () => {
        console.log('Disconnected from the server.');
    });

    socket.value.on('message', (message) => {
        messages.value.push(message);
    });
};

const disconnectSocket = () => {
    if (socket.value) {
        socket.value.disconnect();
    }
};

onMounted(() => {
    initializeSocket();

    const fullPath = window.location.origin + route.fullPath;
    const parts = fullPath.split('/');
    lastPart.value = parts[parts.length - 1];
    showMessages();
});

onUnmounted(() => {
    disconnectSocket();
});

const showMessages = async () => {
    try {
        const response = await getDialogByID(lastPart.value);
        messages.value = response.data.messages;
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
};

const sendApiMessage = async () => {
    const project = {
        messageText: 'sdsd',
        readStatus: true,
    };

    try {
        const response = await sendMessage(1, project);
        return response.data;
    } catch (error) {
        console.error('Failed to send message:', error);
    }
};
</script>

<style scoped lang="scss">
.v-application .v-card {
    box-shadow: none !important;
    background: none;
}

.v-application .v-list-item {
    box-shadow: none !important;
    background: none;
}

.v-application .v-card-text {
    box-shadow: none !important;
    background: none;
}

.chat-message {
    background: none;
    display: unset !important;
    white-space: break-spaces;
}

.chat-screen {
    height: calc(100vh - 140px);
    overflow-y: auto;
}

.sent-message {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
}

.received-message {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 10px;
}

.flex-none {
    flex: unset;
    border: 1px solid rgba(133, 207, 171, 0.15);
    border-radius: 12px 12px 2px 12px;
}

.flex-none-sent {
    flex: unset;
    border: 1px solid rgba(133, 207, 171, 0.15);
    border-radius: 12px 12px 12px 2px;
}

.radius-sent {
    border-radius: 12px 2px 12px 12px;
}

.radius-recieved {
    border-radius: 12px 12px 12px 2px;
}

.input {
    position: absolute;
    bottom: 0px;
    left: 0;
    right: 0;
    background-color: white;
    z-index: 999;
    padding-top: 10px;
}

.date {
    display: flex;
    justify-content: center;
    width: 100px;
    background: rgba(224, 224, 224, 0.5);
    font-size: 13px !important;
    letter-spacing: 0.01em !important;
    padding: 6px 20px;
    line-height: 14px;
}

.chat-container {
    display: flex;
    flex-direction: column;
    height: auto;
}

.date-container {
    display: flex;
    justify-content: center;
    padding: 10px;
}

.messages-container {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.message {
    max-width: 100%;
    min-width: 10%;
    margin-bottom: 15px;
    padding: 10px;
    border: .1px solid #E0E0E0;
}

.my-message {
    border-radius: 12px 12px 2px 12px;
    background-color: #E1F5FE;
    align-self: flex-end;
}

.other-message {
    border-radius: 12px 12px 12px 2px;
    background-color: #ffffff;
    align-self: flex-start;
}

.message-info {
    font-size: 0.8em;
    color: #888;
    display: flex;
    justify-content: flex-end;
}

.input-container {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 10px;
    background-color: #ffffff;
}

.inner-input {
    border: 1px solid #ddd;
    outline-color: #29B6F6;
    flex: 1;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
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
    padding: 10px 0px;
    border: none;
    color: white;
}
</style> -->