export interface Client {
  id: string;
  name: string;
  email: string,
  phone: string;
  adress: string,
  cpf: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientFormData {
  name: string;
  email: string,
  phone: string;
  adress: string,
  cpf: string;
}