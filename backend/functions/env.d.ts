declare namespace NodeJS {
    interface ProcessEnv {
        TABLE_NAME: string;
        API_URL: string;
        STAGE: 'local' | 'dev' | 'prod';
    }
}
