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

const prefix = '/dialogs';

class WebSocketService {
    private socket: WebSocket | null = null;
    public messages = ref<any[]>([]);
    public connectionStatus = ref<'connecting' | 'open' | 'closed' | 'error'>('closed');

    private getToken(): string | null {
        return localStorage.getItem('userToken');
    }

    connect(dialogId: number, userId: number): void {
        const token = this.getToken();
        if (!token) {
            console.error('Токен отсутствует. Невозможно установить WebSocket соединение.');
            return;
        }

        const url = `wss:/itnt.store/socket/chat/${dialogId}/${userId}?token=${encodeURIComponent(token)}`;
        console.log(`Попытка подключения к WebSocket: ${url}`);
        this.connectionStatus.value = 'connecting';

        try {
            this.socket = new WebSocket(url);

            this.socket.onopen = () => {
                console.log('WebSocket соединение установлено');
                this.connectionStatus.value = 'open';
            };

            this.socket.onmessage = (event: MessageEvent) => {
                console.log('Сырой ответ:', event.data);
                try {
                    const message = JSON.parse(event.data);
                    console.log('Получено сообщение:', message);
                    this.messages.value.push(message);
                } catch (error) {
                    console.error('Ошибка обработки входящего сообщения:', error);
                }
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

    sendMessage(dialogId: number, message: Record<string, any>): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const payload = JSON.stringify({ dialogId, ...message });
            console.log('Отправка сообщения:', payload);
            this.socket.send(payload);
        } else {
            console.error('WebSocket не подключен или соединение закрыто');
        }
    }
    updateMessageStatus(messageId: number, readStatus: boolean): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            const statusUpdate = {
                messageId,
                readStatus,
            };
            this.socket.send(JSON.stringify(statusUpdate));
        } else {
            console.error('WebSocket соединение не установлено. Невозможно обновить статус сообщения.');
        }
    }

    onMessageStatusUpdate(callback: (messageId: number, readStatus: boolean) => void): void {
        if (this.socket) {
            this.socket.onmessage = (event: MessageEvent) => {
                const message = JSON.parse(event.data);
                if (message.type === 'status_update') {
                    callback(message.messageId, message.readStatus);
                }
            };
        }
    }
    disconnect(): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.close();
            console.log('WebSocket отключен');
        } else {
            console.warn('WebSocket уже отключен или не существует');
        }
    }

    async createDialog(dialogId: string, userId: number): Promise<any> {
        try {
            const response = await API.post(`${prefix}/`, {
                dialogType: dialogId,
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