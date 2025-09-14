import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/logic/either';
import { Injectable } from '@nestjs/common';
import { Uploader } from '../storage/uploader';
import { InvalidMediaTypeError } from './errors/invalid-media-type-error';

interface GetPresignedUploadUrlUseCaseRequest {
  fileName: string;
  fileType: string;
}

type GetPresignedUploadUrlUseCaseResponse = Either<
  InvalidMediaTypeError,
  {
    signedUrl: string;
    filePath: string;
  }
>;

@Injectable()
export class GetPresignedUploadUrlUseCase {
  constructor(private storageUploader: Uploader) {}

  async execute({
    fileName,
    fileType,
  }: GetPresignedUploadUrlUseCaseRequest): Promise<GetPresignedUploadUrlUseCaseResponse> {
    if (!/^image\/(png|jpe?g)$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidMediaTypeError(fileType));
    }

    const filePath = `${new UniqueEntityID().toString()}_${fileName.replace(/ /g, '_')}`;

    const signedUpload = await this.storageUploader.getSignedUploadURL(filePath);

    return right({
      filePath: filePath,
      signedUrl: signedUpload.signedUrl,
    });
  }
}
