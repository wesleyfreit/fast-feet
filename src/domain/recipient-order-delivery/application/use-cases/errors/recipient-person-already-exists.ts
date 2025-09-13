import { UseCaseError } from '@/core/errors/use-case-error';

export class RecipientPersonAlreadyExistsError extends Error implements UseCaseError {
  constructor() {
    super(`Recipient Person already exists.`);
  }
}
