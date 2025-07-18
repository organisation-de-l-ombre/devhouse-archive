declare namespace NodeJS {
  // eslint-disable-next-line unicorn/prevent-abbreviations
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";

    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_DATABASE: string;
    POSTGRES_USERNAME: string;
    POSTGRES_PASSWORD: string;

    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    BUCKET_HOST: string;
    BUCKET_PORT: string;
    BUCKET_NAME: string;
    S3_PUBLIC: string;
    S3_PRIVATE: string;
  }
}
