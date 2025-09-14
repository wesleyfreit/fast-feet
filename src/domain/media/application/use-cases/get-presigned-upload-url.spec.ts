import { FakeStorage } from 'test/storage/fake-storage';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetPresignedUploadUrlUseCase } from './get-presigned-upload-url';

let storage: FakeStorage;
let sut: GetPresignedUploadUrlUseCase;

describe('Get Presigned Upload Url Use Case', () => {
  beforeEach(async () => {
    storage = new FakeStorage();

    sut = new GetPresignedUploadUrlUseCase(storage);
  });

  it('should be able to get a presigned upload url', async () => {
    const result = await sut.execute({
      fileName: 'avatar.png',
      fileType: 'image/png',
    });

    expect(result.isRight()).toBe(true);

    expect(result.value).toEqual(
      expect.objectContaining({
        signedUrl: expect.any(String),
        filePath: expect.stringContaining('avatar.png'),
      }),
    );
  });
});
