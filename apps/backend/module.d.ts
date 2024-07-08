declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    JWT_TOKEN: string;
    JWT_REFRESH_TOKEN: string;
  }
}
