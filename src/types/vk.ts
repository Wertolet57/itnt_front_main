// types/vk.ts
export interface VKAuthResponse {
    session: {
      mid: number;
      sid: string;
      sig: string;
      secret: string;
      expire: number;
    };
    status: 'connected' | 'not_authorized' | 'unknown';
    settings: number;
  }
  
  declare global {
    interface Window {
      VK: {
        init: (params: { apiId: number }) => void;
        Auth: {
          login: (callback: (response: VKAuthResponse) => void, settings?: number) => void;
        };
      };
    }
  }