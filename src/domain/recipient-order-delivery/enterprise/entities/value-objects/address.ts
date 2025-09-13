import { ValueObject } from '@/core/entities/value-object';

export interface AddressProps {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string | null;
}

export class Address extends ValueObject<AddressProps> {
  get street() {
    return this.props.street;
  }

  get number() {
    return this.props.number;
  }

  get city() {
    return this.props.city;
  }

  get state() {
    return this.props.state;
  }

  get zipCode() {
    return this.props.zipCode;
  }

  get complement() {
    return this.props.complement;
  }

  static create(props: AddressProps): Address {
    const address = new Address(props);
    return address;
  }
}
