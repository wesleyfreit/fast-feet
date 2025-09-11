import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface DeliveryPersonProps {
  name: string;
  cpf: string;
  isAdmin: boolean;
  password: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class DeliveryPerson extends Entity<DeliveryPersonProps> {
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
    props: Optional<DeliveryPersonProps, 'isAdmin' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const deliveryPerson = new DeliveryPerson(
      {
        ...props,
        isAdmin: false,
        createdAt: new Date(),
      },
      id,
    );

    return deliveryPerson;
  }
}
