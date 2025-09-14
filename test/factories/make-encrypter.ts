import { Encrypter } from '@/domain/recipient-order-delivery/application/cryptography/encrypter';
import { Role } from '@/domain/recipient-order-delivery/enterprise/entities/enums/role';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncrypterFactory {
  constructor(private encrypter: Encrypter) {}

  async makeEncryption(subject: string, role: Role = Role.USER): Promise<string> {
    const encryption = await this.encrypter.encrypt(
      { role },
      { subject, expiresIn: '1h' },
    );

    return encryption;
  }
}
