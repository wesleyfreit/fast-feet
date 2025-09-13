export abstract class Encrypter {
  abstract encrypt(
    payload: Buffer | object,
    options?: Record<string, unknown>,
  ): Promise<string>;
}
