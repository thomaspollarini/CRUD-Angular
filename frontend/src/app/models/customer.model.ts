export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  cpf: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  cpf: string;
}
