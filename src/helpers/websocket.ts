import { ref } from 'vue';
import axios from 'axios';

const API = axios.create({
    baseURL: 'https://itnt.store/api',
    responseType: 'json',
    headers: {
        'X-Custom-Header': 'foobar',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
    },
});

const prefix = '/dialogs'; // Предполагаемый префикс для API диалогов

class WebSocketService {
    private socket: WebSocket | null = null;
    public messages = ref<any[]>([]);
    public connectionStatus = ref<'connecting' | 'open' | 'closed' | 'error'>('closed');

    connect(dialogId: number, userId: number) {
        const token = localStorage.getItem('userToken');
        if (!token) {
            console.error('Токен отсутствует. Невозможно установить WebSocket соединение.');
            return;
        }

        const url = `ws://62.217.181.172:8080/chat/${dialogId}/${userId}?token=${encodeURIComponent(token)}`;
        console.log(`Попытка подключения к WebSocket: ${url}`);
        this.connectionStatus.value = 'connecting';

        try {
            this.socket = new WebSocket(url);

            this.socket.onopen = () => {
                console.log('WebSocket соединение установлено');
                this.connectionStatus.value = 'open';
                // Убрано отправление токена, так как он уже в URL
            };

            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log('Получено сообщение:', message);
                this.messages.value.push(message);
            };

            this.socket.onerror = (error) => {
                console.error('Ошибка WebSocket:', error);
                this.connectionStatus.value = 'error';
            };

            this.socket.onclose = (event) => {
                console.log('WebSocket соединение закрыто:', event);
                this.connectionStatus.value = 'closed';
            };
        } catch (error) {
            console.error('Ошибка при создании WebSocket:', error);
            this.connectionStatus.value = 'error';
        }
    }

    sendMessage(dialogId: number, messageContent: any) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const message = {
                type: 'chat_message',
                dialogId: dialogId,
                content: messageContent
            };
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket не подключен');
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }

    // Метод для создания диалога (использует HTTP-запрос)
    async createDialog(dialogType: string, userId: number) {
        try {
            const response = await API.post(`${prefix}/`, {
                dialogType: dialogType,
                users: [{ id: userId }],
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании диалога:', error);
            throw error;
        }
    }
}

export const webSocketService = new WebSocketService();