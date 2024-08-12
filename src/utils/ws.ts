import { ElMessage } from 'element-plus';

import { useUserStore } from '@/store/modules/user';

class Ws {
  client: WebSocket | undefined;

  constructor() {
    if (!this.client) {
      this.open();
    }
  }

  send(event: string, data: Record<string, any> = {}) {
    this.open();

    if (this.client?.readyState === WebSocket.OPEN) {
      this.client?.send(
        JSON.stringify({
          event,
          data: {
            headers: this.getHeaders(),
            body: data,
          },
        }),
      );
    } else if (this.client?.readyState === WebSocket.CONNECTING) {
      this.client.addEventListener('open', () => this.send(event, data));
    }
  }

  open() {
    if (!this.client || this.client.readyState === WebSocket.CLOSED) {
      this.client = new WebSocket(import.meta.env.VITE_APP_WS);
      this.client.addEventListener('open', this.onOpen);
      this.client.addEventListener('close', this.onClose);
      this.client.addEventListener('error', this.onError);
      this.client.addEventListener('message', this.onMessage);
    }
  }

  close() {
    if (this.client) {
      this.client.close();
    }
  }

  onOpen(event: Event) {
    console.log('WebSocket is open now.');
  }

  onClose(event: CloseEvent) {
    console.log('WebSocket is closed now.');
  }

  onError(event: Event) {
    console.log('WebSocket error: ', event);
  }

  onMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);

    if (data.event === 'error') {
      ElMessage.error({
        message: data.data.message,
        duration: 1500,
        onClose: () => {
          if (data.data.status === 401) {
            const userStore = useUserStore();
            console.log('userStore: ', userStore);

            // userStore.clear().then(() => {
            //   location.reload();
            // });
          }
        },
      });
    }
  }

  private getHeaders() {
    const userStore = useUserStore();

    return {
      authorization: `Bearer ${userStore.token}`,
    };
  }
}

const ws = new Ws();

export { ws };
