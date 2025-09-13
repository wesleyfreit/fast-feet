import { Encrypter } from '@/domain/recipient-order-delivery/application/cryptography/encrypter';

export class FakeEncrypter implements Encrypter {
  async encrypt(
    payload: Buffer | object,
    options?: Record<string, unknown>,
  ): Promise<string> {
    const objectPayload = { ...payload, ...options };
    return JSON.stringify(objectPayload);
  }
}
