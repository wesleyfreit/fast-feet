import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface AdministratorProps {
  name: string;
  cpf: string;
  isAdmin: boolean;
  password: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Administrator extends Entity<AdministratorProps> {
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

  get password() {
    return this.props.password;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  get isAdmin() {
    return this.props.isAdmin;
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

  static create(
    props: Optional<AdministratorProps, 'isAdmin' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const administrator = new Administrator(
      {
        ...props,
        isAdmin: true,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return administrator;
  }
}
