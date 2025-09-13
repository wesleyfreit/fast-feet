import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface RecipientPersonProps {
  name: string;
  cpf: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class RecipientPerson extends Entity<RecipientPersonProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
    this.touch();
  }

  get cpf() {
    return this.props.cpf;
  }

  set cpf(cpf: string) {
    this.props.cpf = cpf;
    this.touch();
  }

  get email() {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<RecipientPersonProps, 'createdAt'>, id?: UniqueEntityID) {
    const recipientPerson = new RecipientPerson(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return recipientPerson;
  }
}
