import { Uploader } from '@/domain/media/application/storage/uploader';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';

@Injectable()
export class CloudStorage implements Uploader {
  private client: S3Client;

  constructor(private envService: EnvService) {
    this.client = new S3Client({
      region: envService.get('BUCKET_REGION'),
      endpoint: envService.get('BUCKET_ENDPOINT'),
      credentials: {
        accessKeyId: envService.get('BUCKET_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('BUCKET_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: envService.get('NODE_ENV') !== 'production',
    });
  }

  async getSignedUploadURL(filePath: string) {
    const signedUrl = await getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: this.envService.get('BUCKET_NAME'),
        Key: filePath,
      }),
      {
        expiresIn: 60, // 1min
      },
    );

    return {
      signedUrl,
    };
  }
}
