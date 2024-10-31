// src/app/interceptors/mock-api.interceptor.ts
import { Product } from '../models/product.model';
import { MOCK_PRODUCTS, MOCK_USERS } from '../mocks/mock-data';

let mockProducts = [...MOCK_PRODUCTS];
let nextProductId = Math.max(...MOCK_PRODUCTS.map(p => parseInt(p.id))) + 1;
let activeSession: { user: any } | null = null;

window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

  const url = input.toString();
  const method = init?.method || 'GET';

  // Auth endpoints
  if (url.includes('/api/users')) {
    // Login endpoint
    if (url.includes('/login') && method === 'POST') {
      const { email, password } = JSON.parse(init?.body as string);
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        activeSession = { user: userWithoutPassword };
        return new Response(JSON.stringify(userWithoutPassword), { status: 200 });
      }
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    // Check auth status endpoint
    if (url.includes('/me') && method === 'GET') {
      if (activeSession?.user) {
        return new Response(JSON.stringify(activeSession.user), { status: 200 });
      }
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    // Logout endpoint
    if (url.includes('/logout') && method === 'POST') {
      activeSession = null;
      return new Response(null, { status: 200 });
    }

    // Register endpoint
    if (method === 'POST') {
      const newUser = JSON.parse(init?.body as string);
      const userExists = MOCK_USERS.some(u => u.email === newUser.email);
      
      if (userExists) {
        return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
      }
      
      MOCK_USERS.push(newUser);
      const { password: _, ...userWithoutPassword } = newUser;
      return new Response(JSON.stringify(userWithoutPassword), { status: 201 });
    }
  }

  // Product endpoints
  if (url.includes('/products')) {
    // Allow GET requests without authentication
    if (method === 'GET') {
      // GET all products
      if (!url.includes('/products/')) {
        return new Response(JSON.stringify(mockProducts), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // GET single product
      const id = url.split('/').pop();
      const product = mockProducts.find(p => p.id === id);
      
      if (product) {
        return new Response(JSON.stringify(product), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    // Require authentication for all other methods (POST, PUT, DELETE)
    if (!activeSession) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // POST new product
    if (method === 'POST') {
      const newProduct = {
        ...JSON.parse(init?.body as string),
        id: nextProductId.toString()
      };
      nextProductId++;
      mockProducts.push(newProduct);
      return new Response(JSON.stringify(newProduct), { status: 201 });
    }

    // PUT update product
    if (method === 'PUT') {
      const id = url.split('/').pop();
      const index = mockProducts.findIndex(p => p.id === id);
      if (index > -1) {
        mockProducts[index] = JSON.parse(init?.body as string);
        return new Response(JSON.stringify(mockProducts[index]), { status: 200 });
      }
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    // DELETE product
    if (method === 'DELETE') {
      const id = url.split('/').pop();
      const index = mockProducts.findIndex(p => p.id === id);
      if (index > -1) {
        mockProducts.splice(index, 1);
        return new Response(null, { status: 200 });
      }
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }
  }

  return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
};