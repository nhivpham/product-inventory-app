import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  styles: [`
    .hover-shadow {
      transition: box-shadow 0.3s ease;
    }
    .hover-shadow:hover {
      box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
    }
  `],
  template: `
    <div class="container">
      <div class="row mb-4 align-items-center">
        <div class="col">
          <h2 class="mb-0">Products</h2>
        </div>
        @if (authService.isAuthenticated()) {
          <div class="col-auto">
            <a routerLink="/products/add" class="btn btn-primary">
              <i class="bi bi-plus-lg me-2"></i>Add Product
            </a>
          </div>
        }
      </div>

      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="input-group">
            <span class="input-group-text bg-light">
              <i class="bi bi-search text-muted"></i>
            </span>
            <input 
              type="text" 
              class="form-control border-start-0"
              placeholder="Search products by name or description..."
              [(ngModel)]="searchTerm"
              (input)="filterProducts()"
            >
          </div>
        </div>
      </div>

      @if (error()) {
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ error() }}
          <button type="button" class="btn-close" (click)="error.set('')"></button>
        </div>
      }

      @if (isLoading()) {
        <div class="d-flex justify-content-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      } @else if (filteredProducts().length === 0) {
        <div class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          @if (searchTerm) {
            No products found matching your search criteria.
          } @else {
            No products available. Add some products to get started!
          }
        </div>
      } @else {
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          @for (product of filteredProducts(); track product.id) {
            <div class="col">
              <div class="card h-100 shadow-sm hover-shadow">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title text-truncate mb-0">{{ product.name }}</h5>
                    <span class="badge rounded-pill"
                      [class.bg-success]="product.quantity > 10"
                      [class.bg-warning]="product.quantity <= 10 && product.quantity > 0"
                      [class.bg-danger]="product.quantity === 0"
                    >
                      {{ product.quantity > 0 ? product.quantity + ' in stock' : 'Out of stock' }}
                    </span>
                  </div>
                  
                  <h6 class="card-subtitle mb-2 text-muted">
                    <i class="bi bi-building me-1"></i>{{ product.manufacturer }}
                  </h6>
                  
                  <p class="card-text text-muted mb-3">
                    {{ product.description | slice:0:100 }}{{ product.description.length > 100 ? '...' : '' }}
                  </p>

                  <div class="d-flex justify-content-between align-items-center mt-auto">
                    <span class="h5 mb-0 text-primary">\${{ product.price.toFixed(2) }}</span>
                    
                    <div class="btn-group">
                      <a [routerLink]="['/products', product.id]" 
                         class="btn btn-outline-primary btn-sm">
                        <i class="bi bi-eye me-1"></i>Details
                      </a>
                      @if (authService.isAuthenticated()) {
                        <a [routerLink]="['/products/edit', product.id]" 
                           class="btn btn-outline-warning btn-sm">
                          <i class="bi bi-pencil me-1"></i>Edit
                        </a>
                        <button (click)="deleteProduct(product.id)" 
                                class="btn btn-outline-danger btn-sm">
                          <i class="bi bi-trash me-1"></i>Delete
                        </button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  authService = inject(AuthService);

  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  isLoading = signal(false);
  error = signal('');
  searchTerm = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.error.set('');
    
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.filteredProducts.set(products);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.error.set('Failed to load products. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  filterProducts(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProducts.set(this.products());
      return;
    }

    const searchTerm = this.searchTerm.toLowerCase();
    const filtered = this.products().filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.manufacturer.toLowerCase().includes(searchTerm)
    );
    this.filteredProducts.set(filtered);
  }

  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        console.error('Error deleting product', err);
        this.error.set('Failed to delete product. Please try again.');
      }
    });
  }
}