// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/products';

  getProducts(): Observable<Product[]> {
    return from(
      fetch(this.apiUrl)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch products');
          return res.json();
        })
    );
  }

  getProduct(id: string): Observable<Product> {
    return from(
      fetch(`${this.apiUrl}/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch product');
          return res.json();
        })
    );
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return from(
      fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to add product');
          return res.json();
        })
    );
  }

  updateProduct(id: string, product: Product): Observable<Product> {
    return from(
      fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to update product');
          return res.json();
        })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return from(
      fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to delete product');
        })
    );
  }
}