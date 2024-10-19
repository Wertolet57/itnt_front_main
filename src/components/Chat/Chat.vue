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
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { webSocketService } from '../../helpers/websocket.ts';

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
