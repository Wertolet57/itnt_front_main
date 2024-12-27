<template>
    <Header class="mb-[40px]" :showUserMinify="true" :routeName="chatId" :chat="true" />
    <div class="flex w-full h-full flex-col">
        <div ref="messagesContainer" class="flex w-full h-[100%] flex-col justify-end">
            <div class="">
                <div class="messages-wrapper">
                    <div class="messages-container" v-if="messages.length > 0">
                        <div class="date-container">
                            <div class="date text-center rounded-xl d-inline-block">{{ $t('feed.today') }}</div>
                        </div>

                        <div v-for="message in messages" :key="message.id"
                            :class="['message', isMyMessage(message) ? 'my-message' : 'other-message']">
                            <div class="message-content">{{ message?.messageText }}</div>
                            <div class="message-info flex items-center">
                                <span class="message-time text-[9E9E9E] pl-[12px] mr-[8px]">
                                    {{ message?.messageDate ? formatDate(message?.messageDate) : '00:00' }}
                                </span>
                                <span class="message-status">
                                    <img :src="message.readStatus ? seen : delivered" alt="status" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex items-end w-full sticky bottom-[0px]">
            <div class="input-container w-full">
                <div class="inner-input">
                    <input v-model="newMessage" @keyup.enter="sendMessageWebSocket" placeholder="Введите сообщение..."
                        :disabled="connectionStatus !== 'open'" />
                    <button @click="sendMessageWebSocket" :disabled="connectionStatus !== 'open'">
                        <img :src="chat" alt="Send" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from '~/components/Header.vue';
import { getDialogMessages, sendMessage } from "../../API/ways/dialog";
import { webSocketService } from '../../helpers/websocket.ts';
import chat from '../../assets/icons/chat.svg';
import delivered from '~/assets/chat/delivered.svg';
import seen from '~/assets/chat/seen.svg';
// Refs
const newMessage = ref('');
const messages = webSocketService.messages;
const currentDialogId = ref<number | null>(null);
const connectionStatus = webSocketService.connectionStatus;
const userId = ref(localStorage.getItem("userId"));
const route = useRoute();
const lastPart = ref<string | null>(null);
const messagesContainer = ref<HTMLDivElement | null>(null);
const myMessage = ref();
const sentMessage = ref()
const messageList = ref([]);
const messageObserver = ref();
const chatId = ref(String(route.params.ID)); 

const isMyMessage = (message: any) => {
    return message?.user?.id == userId.value;
};
const scrollToBottom = () => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
};

// Connect to WebSocket
const connectToWebSocket = () => {
    if (chatId.value && userId.value) {
        webSocketService.connect(Number(chatId.value), Number(userId.value));
    } else {
        console.error('DialogId или UserId не установлены');
    }
};

// Fetch dialog messages
const getDialog = async (id: number) => {
    try {
        const response = await getDialogMessages(id);
        messages.value = response.data.object;
        sentMessage.value = response.data?.object?.user?.id;
        scrollToBottom();
    } catch (error) {
        console.error('Ошибка при получении сообщений:', error);
    }
};

// Send message via API
const sendMessageAPI = async (messageData: Object) => {
    try {
        if (chatId.value) {
            const response = await sendMessage(Number(chatId.value), messageData);
            myMessage.value = response.data.object;
            await getDialog(Number(chatId.value));
        }
        setTimeout(scrollToBottom, 100);
    } catch (error) {
        console.error('Ошибка при отправке сообщения через API:', error);
    }
};

// Send message via WebSocket
const sendMessageWebSocket = () => {
    if (newMessage.value.trim() && chatId.value) {
        const messageData = {
            dialogType: "GROPE",
            messageText: newMessage.value.trim(),
            readStatus: false,
            user: {
                id: userId.value
            }
        };
        webSocketService.sendMessage(Number(chatId.value), messageData);
        sendMessageAPI(messageData);
        newMessage.value = '';
        setTimeout(scrollToBottom, 100);
    } else {
        console.error('Сообщение пустое или DialogId не установлен');
    }
};

webSocketService.onMessageStatusUpdate((messageId, readStatus) => {
    const message = messages.value.find(msg => msg.id === messageId);
    if (message) {
        message.readStatus = readStatus;
    }
});

const formatDate = (isoDate: any) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

onMounted(() => {
    if (chatId.value) {
        currentDialogId.value = chatId.value;
        connectToWebSocket();
        getDialog(Number(chatId.value));
    } else {
        console.error('Не удалось получить ID чата из router params');
    }
    webSocketService.messages.value.length > 0 && scrollToBottom();
});

onUnmounted(() => {
    webSocketService.disconnect();
});
onMounted(() => {
    const config = { childList: true, subtree: true };

    messageObserver.value = new MutationObserver(() => {
        scrollToBottom();
    });

    const messagesWrapper = document.querySelector('.messages-wrapper');
    if (messagesWrapper) {
        messageObserver.value.observe(messagesWrapper, config);
    }
});

onUnmounted(() => {
    if (messageObserver.value) {
        messageObserver.value.disconnect();
    }
});
// Watch for connection status changes
watch(connectionStatus, (newStatus) => {
    if (newStatus === 'closed' || newStatus === 'error') {
        setTimeout(connectToWebSocket, 5000);
    }
});

watch(messages, () => {
    setTimeout(scrollToBottom, 10);
});
</script>

<style scoped lang="scss">
.v-application .v-card,
.v-application .v-list-item,
.v-application .v-card-text {
    box-shadow: none !important;
    background: none;
}

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
    height: calc(100vh + 140px);
    overflow: hidden;
}

.messages-wrapper {
    flex-grow: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 10px;
    max-height: calc(100vh - 150px);
}

.messages-container {
    display: flex;
    overflow-y: auto;
    flex-direction: column;
    justify-content: flex-end;
    gap: 10px;
}

.date-container {
    display: flex;
    justify-content: center;
    padding: 10px;
    align-items: center;
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


.message {
    max-width: 100%;
    min-width: 10%;
    margin-bottom: 15px;
    border: .1px solid #E0E0E0;

}

.message-content {
    padding: 10px 15px 6px 14px;
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
    padding: 0px 6px 2px 0px;
    font-size: 0.8em;
    color: #888;
    display: flex;
    justify-content: flex-end;
}

.input-container {
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
