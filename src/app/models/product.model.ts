export interface Product {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  manufacturingDate: string;
  price: number;
  quantity: number;
}

export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  location: string;
  mobileNumber: string;
}