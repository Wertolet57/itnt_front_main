<template>
    <Header class="mb-[40px]" :showUserMinify="true" :routeName="chatId" :chat="true" />
    <div class="flex w-full min-h-[98%] h-[98%] flex-col">
        <div ref="messagesContainer" class="messages-container min-h-full overflow-y-auto" v-if="messages.length > 0">
            <div v-for="message in messages" :key="message.id" :data-id="message.id" class="messages-container mx-2">
                <div class="date-container">
                    <!-- <div class="date text-center rounded-xl d-inline-block">{{ message?.messageDate }}</div> -->
                </div>
                <div :class="['message', isMyMessage(message) ? 'my-message' : 'other-message']" class="flex flex-col">
                    <div class="message-content break-words">
                        {{ message?.messageText }}
                    </div>
                    <div class="message-info flex items-center mt-2">
                        <span class="message-time text-gray-500 text-xs pl-3 mr-2">
                            {{ message?.messageDate ? formatDate(message?.messageDate) : '00:00' }}
                        </span>
                        <span class="message-status">
                            <img :class="isMyMessage(message) ? '' : 'hidden'"
                                :src="message.readStatus ? seen : delivered" alt="status" class="w-4 h-4" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="input-wrapper fixed bottom-[40px] w-full h-[2%]">
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
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from '~/components/Header.vue';
import { getDialogMessages, sendMessage, markAsRead } from "../../API/ways/dialog";
import { webSocketService } from '../../helpers/websocket.ts';
import chat from '../../assets/icons/chat.svg';
import delivered from '~/assets/chat/delivered.svg';
import seen from '~/assets/chat/seen.svg';
import { nextTick } from 'vue';

const route = useRoute();
const chatId = ref(route.params.ID);
const userId = ref(localStorage.getItem("userId"));
const newMessage = ref('');
const messages = webSocketService.messages;
const connectionStatus = webSocketService.connectionStatus;
const messagesContainer = ref(null);
const observedMessages = new WeakSet();
const isMyMessage = (message) => {
    return message?.user?.id == userId.value;
};
const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
const getDateLabel = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    messageDate.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - messageDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) {
        return messageDate.toLocaleDateString('ru-RU', { weekday: 'long' });
    }
    return messageDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const connectToWebSocket = () => {
    if (chatId.value && userId.value) {
        webSocketService.connect(Number(chatId.value), Number(userId.value));
    } else {
        console.error('DialogId или UserId не установлены');
    }
};
const getDialog = async (id) => {
    try {
        const response = await getDialogMessages(id);
        messages.value = response.data.object;
    } catch (error) {
        console.error('Ошибка при получении сообщений:', error);
    }
};
const sendMessageAPI = async (messageData) => {
    try {
        if (chatId.value) {
            await sendMessage(Number(chatId.value), messageData);
            await getDialog(Number(chatId.value));
        }
    } catch (error) {
        console.error('Ошибка при отправке сообщения через API:', error);
    }
};
const sendMessageWebSocket = async () => {
    if (newMessage.value.trim() && chatId.value) {
        const messageData = {
            dialogType: "GROPE",
            messageText: newMessage.value.trim(),
            readStatus: false,
            user: { id: userId.value }
        };
        webSocketService.sendMessage(Number(chatId.value), messageData);
        await sendMessageAPI(messageData);
        newMessage.value = '';
    }
};
const markMessagesAsRead = async () => {
    const container = messagesContainer.value;
    if (!container) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(async (entry) => {
            const message = entry.target;
            const messageId = message.getAttribute('data-id');

            // Проверяем, пересекается ли элемент, его id и readStatus
            if (
                entry.isIntersecting &&
                messageId &&
                !observedMessages.has(message)
            ) {
                const targetMessage = messages.value.find(msg => msg.id === Number(messageId));

                // Убедимся, что сообщение существует и его readStatus — false
                if (targetMessage && !targetMessage.readStatus) {
                    try {
                        await markAsRead(Number(messageId));
                        observedMessages.add(message);

                        // Обновляем статус прочтения в массиве сообщений
                        targetMessage.readStatus = true;
                    } catch (error) {
                        console.error(`Ошибка при вызове markAsRead для messageId ${messageId}:`, error);
                    }
                }
            }
        });
    });

    // Добавляем только сообщения с readStatus === false
    messages.value.forEach((msg) => {
        if (!msg.readStatus) {
            const messageElement = container.querySelector(`[data-id="${msg.id}"]`);
            if (messageElement) {
                observer.observe(messageElement);
            }
        }
    });

    onUnmounted(() => observer.disconnect());
};

const groupedMessages = computed(() => {
    const groups = {};

    messages.value.forEach(message => {
        const date = new Date(message.messageDate);
        date.setHours(0, 0, 0, 0);
        const dateKey = date.getTime();

        if (!groups[dateKey]) {
            groups[dateKey] = {
                label: getDateLabel(message.messageDate),
                messages: []
            };
        }

        groups[dateKey].messages.push(message);
    });

    return Object.entries(groups)
        .sort(([a], [b]) => b - a)
        .map(([_, group]) => group);
});

onMounted(async () => {
    if (chatId.value) {
        await getDialog(Number(chatId.value));
        connectToWebSocket();
        await nextTick();
        markMessagesAsRead();
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

webSocketService.onMessageStatusUpdate((messageId, readStatus) => {
    const message = messages.value.find(msg => msg.id === messageId);
    if (message) {
        message.readStatus = readStatus;
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
    height: 100vh;
    overflow: hidden;
}

.messages-wrapper {
    flex-grow: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 10px;
    position: relative;
}

.messages-container {
    display: flex;
    overflow-y: auto;
    flex-direction: column;
    justify-content: flex-end;
    // gap: 10px;
    // height: 100%;
    overflow-y: auto;
    scroll-behavior: smooth;
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
    max-width: 80%;
    min-width: 10%;
    margin-bottom: 5px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    border: 0.1px solid #E0E0E0;
    word-break: break-all;
    width: auto;
}

.message-content {
    padding: 10px 10px 6px 14px;
    word-break: break-all;
    max-width: 100%;
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
    // height:60px;
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
