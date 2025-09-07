import { UploadPartCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3 } from "~/server/utils/s3"


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const q = getQuery(event);
  let { Key, UploadId, PartNumber } = q;
  if (!Key || !UploadId || !PartNumber) return { error: 'Key, UploadId, PartNumber required' };

  Key = Key.toString()

  const cmd = new UploadPartCommand({
    Bucket: config.ycBucket,
    Key,
    PartNumber: Number(PartNumber),
    UploadId: UploadId as string,
    // Body is omitted — presigned URL will allow PUT directly
  });

  const url = await getSignedUrl(s3, cmd, { expiresIn: 3600 });
  return { url };
});