// src/app/components/product-detail/product-detail.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { inject } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/products">Products</a></li>
          <li class="breadcrumb-item active">{{ product()?.name || 'Product Details' }}</li>
        </ol>
      </nav>

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
      } @else {
        @if (product()) {
          <div class="card shadow">
            <div class="card-body">
              <div class="row">
                <div class="col-md-8">
                  <h2 class="card-title mb-1">{{ product()!.name }}</h2>
                  <h6 class="text-muted mb-4">
                    <i class="bi bi-building me-2"></i>{{ product()!.manufacturer }}
                  </h6>

                  <div class="card bg-light mb-4">
                    <div class="card-body">
                      <h5 class="card-title mb-3">Description</h5>
                      <p class="card-text">{{ product()!.description }}</p>
                    </div>
                  </div>

                  <div class="row g-4">
                    <div class="col-sm-6">
                      <div class="card h-100">
                        <div class="card-body">
                          <h6 class="card-subtitle mb-2 text-muted">Manufacturing Date</h6>
                          <p class="card-text fs-5">
                            <i class="bi bi-calendar me-2"></i>
                            {{ product()!.manufacturingDate | date:'mediumDate' }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="card h-100">
                        <div class="card-body">
                          <h6 class="card-subtitle mb-2 text-muted">Stock Status</h6>
                          <p class="card-text fs-5">
                            <i class="bi bi-box-seam me-2"></i>
                            <span class="badge"
                              [class.bg-success]="product()!.quantity > 10"
                              [class.bg-warning]="product()!.quantity <= 10 && product()!.quantity > 0"
                              [class.bg-danger]="product()!.quantity === 0"
                            >
                              {{ product()!.quantity > 0 ? product()!.quantity + ' units in stock' : 'Out of stock' }}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="card bg-light">
                    <div class="card-body">
                      <h3 class="card-title text-primary mb-4">
                        \${{ product()!.price.toFixed(2) }}
                      </h3>

                      @if (authService.isAuthenticated()) {
                        <div class="d-grid gap-2">
                          <a [routerLink]="['/products/edit', product()!.id]" 
                             class="btn btn-warning">
                            <i class="bi bi-pencil me-2"></i>Edit Product
                          </a>
                          <button (click)="deleteProduct(product()!.id)" 
                                  class="btn btn-danger">
                            <i class="bi bi-trash me-2"></i>Delete Product
                          </button>
                          <a routerLink="/products" class="btn btn-outline-secondary">
                            <i class="bi bi-arrow-left me-2"></i>Back to Products
                          </a>
                        </div>
                      } @else {
                        <div class="d-grid">
                          <a routerLink="/products" class="btn btn-outline-secondary">
                            <i class="bi bi-arrow-left me-2"></i>Back to Products
                          </a>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authService = inject(AuthService);

  product = signal<Product | null>(null);
  isLoading = signal(false);
  error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadProduct(id);
  }

  loadProduct(id: string): void {
    this.isLoading.set(true);
    this.error.set('');

    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading product', err);
        this.error.set('Failed to load product details. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  deleteProduct(id: string): void {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error deleting product', err);
        this.error.set('Failed to delete product. Please try again.');
      }
    });
  }
}