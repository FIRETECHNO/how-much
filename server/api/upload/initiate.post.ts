import {
  CreateMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { s3 } from "~/server/utils/s3"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const body = await readBody(event);
  const { fileName, contentType, keyPrefix } = body;
  if (!fileName) return { error: 'fileName required' };

  const Key = `${keyPrefix || 'job-form-videos/'}${Date.now()}_${fileName}`;

  const cmd = new CreateMultipartUploadCommand({
    Bucket: config.ycBucket,
    Key,
    ContentType: contentType || 'application/octet-stream',
  });

  const res = await s3.send(cmd);

  return {
    UploadId: res.UploadId,
    Key,
  };
});
