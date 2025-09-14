import { HashComparer } from '@/domain/recipient-order-delivery/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/recipient-order-delivery/application/cryptography/hash-generator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HasherFactory {
  constructor(
    private hasher: HashGenerator,
    private comparer: HashComparer,
  ) {}

  async makeHashing(plain: string): Promise<string> {
    const hashing = await this.hasher.hash(plain);

    return hashing;
  }

  async hashingCompare(plain: string, hash: string): Promise<boolean> {
    const compare = await this.comparer.compare(plain, hash);

    return compare;
  }
}
