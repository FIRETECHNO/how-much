import {
  S3Client
} from '@aws-sdk/client-s3';

const config = useRuntimeConfig()

export const s3 = new S3Client({
  region: process.env.YC_REGION || 'ru-central1',
  endpoint: process.env.YC_ENDPOINT || 'https://storage.yandexcloud.net',
  credentials: {
    accessKeyId: config.ycAccessKeyId,
    secretAccessKey: config.ycSecretAccessKey,
  },
});