declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: 'development' | 'production';
      NODE_NAME: string;
      HOSTNAME?: string;
      SECURE?: 'true' | 'false';
      PORT?: string;
    }
  }
}

export {};
