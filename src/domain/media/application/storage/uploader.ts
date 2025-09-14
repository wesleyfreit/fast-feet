export abstract class Uploader {
  abstract getSignedUploadURL(filePath: string): Promise<{ signedUrl: string }>;
}
