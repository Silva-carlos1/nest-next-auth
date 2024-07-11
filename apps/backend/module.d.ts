declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    JWT_TOKEN: string;
    JWT_REFRESH_TOKEN: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
  }
}
