import { InvalidMediaTypeError } from '@/domain/media/application/use-cases/errors/invalid-media-type-error';
import { GetPresignedUploadUrlUseCase } from '@/domain/media/application/use-cases/get-presigned-upload-url';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import z from 'zod';

const getPresignedUploadUrlBodySchema = z.object({
  fileName: z.string().min(3),
  fileType: z.string().min(3),
});

type GetPresignedUploadUrlBody = z.infer<typeof getPresignedUploadUrlBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(getPresignedUploadUrlBodySchema);

@Controller('/medias/upload-url')
export class GetPresignedUploadUrlController {
  constructor(private getPresignedUploadUrl: GetPresignedUploadUrlUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(@Body(bodyValidationPipe) body: GetPresignedUploadUrlBody) {
    const result = await this.getPresignedUploadUrl.execute({
      fileName: body.fileName,
      fileType: body.fileType,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidMediaTypeError:
          throw new UnsupportedMediaTypeException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const { filePath, signedUrl } = result.value;

    return {
      filePath,
      signedUrl,
    };
  }
}
