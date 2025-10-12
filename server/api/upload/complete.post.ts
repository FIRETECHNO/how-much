import {
  CompleteMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import { s3 } from "~/server/utils/s3"


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const body = await readBody(event);
  const { Key, UploadId, Parts } = body; // Parts = [{ ETag, PartNumber }, ...]
  if (!Key || !UploadId || !Parts) return { error: 'Key, UploadId, Parts required' };

  console.log(body);


  const cmd = new CompleteMultipartUploadCommand({
    Bucket: config.ycBucket,
    Key,
    UploadId,
    MultipartUpload: { Parts },
  });

  const res = await s3.send(cmd);
  return res;
});