<template>
    <div>
        <Header :showUserMinify="true" :routeName="lastPart" :chat="true" />
        <div class="chat-container">
            <div class="messages-container">
                <div v-if="messages.length > 0" class="date-container">
                    <div class="date text-center rounded-xl d-inline-block">{{ $t('feed.today') }}</div>
                </div>
                <div v-for="message in messages" :key="index" class="message my-message ">
                    <!-- :class="['message', message.isMine ? 'my-message' : 'other-message']"> -->
                    <div class="message-content">{{ message.messageText }}</div>
                    <div class="message-info flex items-center">
                        <span class="message-time text-[9E9E9E] mr-[8px] ">{{ message.timestamp ? formatDate(message.timestamp) : '00:00' }}</span>
                        <!-- <span v-if="message.isMine" class="message-status">
                            <img :src="message.read ? delivered : chat" alt="">
                        </span> -->
                        <span class="message-status">
                            <img :src="delivered" alt="">
                            <!-- <img :src="message.readStatus ? delivered : chat" alt=""> -->
                        </span>
                    </div>
                </div>
            </div>
            <div class="input-container">
                <div class="inner-input">
                    <input v-model="newMessage" @keyup.enter="sendMessageAPI" placeholder="Введите сообщение..."
                        :disabled="connectionStatus !== 'open'" />
                    <button @click="sendMessageAPI" :disabled="connectionStatus !== 'open'">
                        <img :src="chat" alt="Send" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Header from '~/components/Header.vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { getDialogMessages, sendMessage } from "../../API/ways/dialog";
import { webSocketService } from '../../helpers/websocket.ts';
import { useRoute } from 'vue-router';
import chat from '../../assets/icons/chat.svg';
import delivered from '~/assets/chat/delivered.svg';
const newMessage = ref('');
const messages = ref([]);
const currentDialogId = ref<number | null>(null);
const connectionStatus = webSocketService.connectionStatus;
const userId = ref(localStorage.getItem("userId"));
const route = useRoute();
const lastPart = ref<string | null>(null);

const connectToWebSocket = () => {
    if (currentDialogId.value && userId.value) {
        webSocketService.connect(currentDialogId.value, userId.value);
    } else {
        console.error('DialogId или UserId не установлены');
    }
};

const getDialog = async (id: string) => {
    try {
        const response = await getDialogMessages(id);
        messages.value = response.data.object;
    } catch (error) {
        console.error('Ошибка при получении сообщений:', error);
    }
};

const sendMessageAPI = async () => {
    try {
        const data = {
            dialogType: "GROPE",
            messageText: newMessage.value.trim(),
            readStatus: false,
            // messageDate: new Date().toISOString(),
            user: {
                id: userId.value
            }
        };
        if (lastPart.value) {
            await sendMessage(lastPart.value, data);
            newMessage.value = '';
        }
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
    }
};
const formatDate = (isoDate:any) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
onMounted(() => {
    const fullPath = window.location.origin + route.fullPath;
    lastPart.value = fullPath.split('/').pop();

    if (lastPart.value) {
        currentDialogId.value = parseInt(lastPart.value, 10); 
        connectToWebSocket();
        getDialog(lastPart.value); 
    } else {
        console.error('Не удалось получить ID чата из строки пути');
    }
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
    display: flex;
    flex-direction:column;
    justify-content: start;
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
    height: calc(100vh - 140px);
    display: flex;
    flex-direction: column;
    justify-content: end;
}

.date-container {
    display: flex;
    justify-content: center;
    padding: 10px;
    align-items: center;
    flex-direction: column;
    justify-content: end;
}

.messages-container {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: end;
}

.message {
    max-width: 100%;
    min-width: 10%;
    margin-bottom: 15px;
    border: .1px solid #E0E0E0;
   
}
.message-content{
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
