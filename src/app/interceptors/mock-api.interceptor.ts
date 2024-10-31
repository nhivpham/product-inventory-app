import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Product, User } from '../models/product.model';
import { MOCK_USERS, MOCK_PRODUCTS } from '../mocks/mock-data';

let mockUsers = [...MOCK_USERS];
let mockProducts = [...MOCK_PRODUCTS];

let nextProductId = Math.max(...MOCK_PRODUCTS.map(p => Number(p.id))) + 1;

const DELAY_MS = 800;

export const mockApiInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  console.log('Intercepting request:', request.url, request.method);

  // Handle Users endpoints
  if (request.url.includes('/api/users')) {
    return handleUsers(request).pipe(delay(DELAY_MS));
  }

  // Handle Products endpoints
  if (request.url.includes('/api/products')) {
    return handleProducts(request).pipe(delay(DELAY_MS));
  }

  return next(request);
};

function handleUsers(request: HttpRequest<any>): Observable<HttpEvent<any>> {
  // Login
  if (request.method === 'GET') {
    try {
      const urlParams = new URLSearchParams(request.url.split('?')[1]);
      const email = urlParams.get('email');
      const password = urlParams.get('password');

      console.log('Login attempt with:', { email, password });
      console.log('Available users:', mockUsers);
      
      const user = mockUsers.find(u => {
        const emailMatch = u.email.toLowerCase() === email?.toLowerCase();
        const passwordMatch = u.password === password;
        console.log('Comparing with user:', {
          userEmail: u.email,
          inputEmail: email,
          emailMatch,
          passwordMatch
        });
        return emailMatch && passwordMatch;
      });

      console.log('Found user:', user);

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return of(new HttpResponse({ 
          status: 200, 
          body: [userWithoutPassword] 
        }));
      }
      
      return throwError(() => new HttpErrorResponse({
        error: 'Invalid credentials',
        status: 401
      }));
    } catch (error) {
      console.error('Error in login handler:', error);
      return throwError(() => new HttpErrorResponse({
        error: 'Server error',
        status: 500
      }));
    }
  }

  // Register
  if (request.method === 'POST') {
    try {
      const newUser = request.body as User;
      console.log('Registering new user:', newUser);
      
      if (mockUsers.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
        return throwError(() => new HttpErrorResponse({
          error: 'Email already registered',
          status: 400
        }));
      }

      mockUsers = [...mockUsers, newUser];
      console.log('Updated mock users:', mockUsers);
      
      const { password: _, ...userWithoutPassword } = newUser;
      return of(new HttpResponse({ 
        status: 201, 
        body: userWithoutPassword
      }));
    } catch (error) {
      console.error('Error in register handler:', error);
      return throwError(() => new HttpErrorResponse({
        error: 'Server error',
        status: 500
      }));
    }
  }

  return throwError(() => new HttpErrorResponse({
    error: 'Method not supported',
    status: 405
  }));
}

function handleProducts(request: HttpRequest<any>): Observable<HttpEvent<any>> {
  // Get all products
  if (request.method === 'GET' && !request.url.includes('/products/')) {
    return of(new HttpResponse({ 
      status: 200, 
      body: mockProducts 
    }));
  }

  // Get single product
  if (request.method === 'GET' && request.url.includes('/products/')) {
    const id = request.url.split('/').pop();
    const product = mockProducts.find(p => p.id === id);
    
    if (product) {
      return of(new HttpResponse({ status: 200, body: product }));
    }
    
    return throwError(() => new HttpErrorResponse({
      error: 'Product not found',
      status: 404
    }));
  }

  // Add product
  if (request.method === 'POST') {
    const newProduct = {
      ...request.body,
      id: (nextProductId++).toString()
    };
    mockProducts.push(newProduct);
    return of(new HttpResponse({ status: 201, body: newProduct }));
  }

  // Update product
  if (request.method === 'PUT') {
    const id = request.url.split('/').pop();
    const index = mockProducts.findIndex(p => p.id === id);
    
    if (index > -1) {
      mockProducts[index] = request.body;
      return of(new HttpResponse({ status: 200, body: request.body }));
    }
    
    return throwError(() => new HttpErrorResponse({
      error: 'Product not found',
      status: 404
    }));
  }

  // Delete product
  if (request.method === 'DELETE') {
    const id = request.url.split('/').pop();
    const index = mockProducts.findIndex(p => p.id === id);
    
    if (index > -1) {
      mockProducts.splice(index, 1);
      return of(new HttpResponse({ status: 200 }));
    }
    
    return throwError(() => new HttpErrorResponse({
      error: 'Product not found',
      status: 404
    }));
  }

  return throwError(() => new HttpErrorResponse({
    error: 'Method not supported',
    status: 405
  }));
}