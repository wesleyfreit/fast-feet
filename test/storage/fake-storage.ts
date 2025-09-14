import { Uploader } from '@/domain/media/application/storage/uploader';
import { faker } from '@faker-js/faker';

interface StorageFile {
  filePath: string;
  url: string;
}

export class FakeStorage implements Uploader {
  public items: StorageFile[] = [];

  async getSignedUploadURL(filePath: string) {
    const url = faker.internet.url().concat(`/${filePath}`);

    const file = {
      filePath,
      url,
    };

    this.items.push(file);

    return {
      signedUrl: `${url}?token=${faker.string.uuid()}`,
    };
  }
}
