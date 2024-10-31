// src/app/mock-api.ts
import { Product } from '../models/product.model';
import { MOCK_PRODUCTS } from '../mocks/mock-data';

let mockProducts = [...MOCK_PRODUCTS];
let nextProductId = Math.max(...MOCK_PRODUCTS.map(p => parseInt(p.id))) + 1;  // Keep as number

window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

  const url = input.toString();
  const method = init?.method || 'GET';

  // Handle different API endpoints
  if (url.includes('/products')) {
    // GET all products
    if (method === 'GET' && !url.includes('/products/')) {
      return new Response(JSON.stringify(mockProducts), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // GET single product
    if (method === 'GET' && url.includes('/products/')) {
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

    // POST new product
    if (method === 'POST') {
      const newProduct = {
        ...JSON.parse(init?.body as string),
        id: nextProductId.toString()  // Convert to string only when assigning
      };
      nextProductId++;  // Increment the number
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