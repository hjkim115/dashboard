import {
  S3Client,
  PutObjectCommand,
  S3ClientConfig,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

if (typeof process.env.S3_REGION !== 'string') {
  throw Error('S3_REGION environment variable is not set!')
}

if (typeof process.env.S3_ACCESS_KEY_ID !== 'string') {
  throw Error('S3_ACCESS_KEY_ID environment variable is not set!')
}

if (typeof process.env.S3_SECRET_ACCESS_KEY !== 'string') {
  throw Error('S3_SECRET_ACCESS_KEY environment variable is not set!')
}

if (typeof process.env.S3_BUCKET_NAME !== 'string') {
  throw Error('S3_BUCKET_NAME environment variable is not set!')
}

const config: S3ClientConfig = {
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
}

const client = new S3Client(config)

export async function getUploadUrl(store: string, fileName: string) {
  const putObjectParams: PutObjectCommandInput = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${store}/${fileName}`,
  }
  const putObjectCommand = new PutObjectCommand(putObjectParams)

  const uploadUrl = await getSignedUrl(client, putObjectCommand, {
    expiresIn: 60,
  })

  return uploadUrl
}
