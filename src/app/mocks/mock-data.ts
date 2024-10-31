import { Product, User } from '../models/product.model';

export const MOCK_USERS: User[] = [
  {
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    location: 'Test Location',
    mobileNumber: '123-456-7890'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Gaming Laptop XR',
    description: 'High-performance gaming laptop with RTX 4080, 32GB RAM',
    manufacturer: 'TechCorp',
    manufacturingDate: '2024-01-15',
    price: 2499.99,
    quantity: 50
  },
  {
    id: '2',
    name: 'Wireless Gaming Mouse',
    description: 'Ultra-responsive wireless mouse with 20K DPI sensor',
    manufacturer: 'GameTech',
    manufacturingDate: '2024-02-20',
    price: 79.99,
    quantity: 200
  },
  {
    id: '3',
    name: '4K Gaming Monitor',
    description: '27" 4K monitor with 144Hz refresh rate and HDR',
    manufacturer: 'ViewTech',
    manufacturingDate: '2024-03-01',
    price: 599.99,
    quantity: 75
  },
  {
    id: '4',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with Cherry MX switches',
    manufacturer: 'KeyTech',
    manufacturingDate: '2024-02-15',
    price: 149.99,
    quantity: 100
  }
];