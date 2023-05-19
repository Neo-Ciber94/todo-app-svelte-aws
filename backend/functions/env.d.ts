declare namespace NodeJS {
    interface ProcessEnv {
        TABLE_NAME: string;
        API_URL: string;
        AWS_SAM_LOCAL: 'true' | undefined;
    }
}
