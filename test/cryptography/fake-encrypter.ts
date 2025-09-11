import {
  Encrypter,
  EncryptOptions,
} from '@/domain/identity/application/cryptography/encrypter';

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Buffer | object, options?: EncryptOptions): Promise<string> {
    const objectPayload = { ...payload, ...options };
    return JSON.stringify(objectPayload);
  }
}
