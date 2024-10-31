// src/app/components/product-form/product-form.component.ts
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { inject } from '@angular/core';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a routerLink="/products">Products</a></li>
          <li class="breadcrumb-item active">{{ isEditing() ? 'Edit' : 'Add' }} Product</li>
        </ol>
      </nav>

      @if (error()) {
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ error() }}
          <button type="button" class="btn-close" (click)="error.set('')"></button>
        </div>
      }

      <div class="card shadow">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">{{ isEditing() ? 'Edit' : 'Add' }} Product</h4>
        </div>
        <div class="card-body">
          <form form [formGroup]="productForm" #formDir="ngForm" (ngSubmit)="onSubmit()">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Product Name</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-box-seam"></i>
                  </span>
                  <input 
                    type="text" 
                    class="form-control" 
                    formControlName="name"
                    [class.is-invalid]="isFieldInvalid('name')"
                    placeholder="Enter product name"
                  >
                  @if (isFieldInvalid('name')) {
                    <div class="invalid-feedback">
                      Product name is required
                    </div>
                  }
                </div>
              </div>

              <div class="col-md-6">
                <label class="form-label">Manufacturer</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-building"></i>
                  </span>
                  <input 
                    type="text" 
                    class="form-control" 
                    formControlName="manufacturer"
                    [class.is-invalid]="isFieldInvalid('manufacturer')"
                    placeholder="Enter manufacturer name"
                  >
                  @if (isFieldInvalid('manufacturer')) {
                    <div class="invalid-feedback">
                      Manufacturer is required
                    </div>
                  }
                </div>
              </div>

              <div class="col-12">
                <label class="form-label">Description</label>
                <textarea 
                  class="form-control" 
                  rows="3" 
                  formControlName="description"
                  [class.is-invalid]="isFieldInvalid('description')"
                  placeholder="Enter product description"
                ></textarea>
                @if (isFieldInvalid('description')) {
                  <div class="invalid-feedback">
                    Description is required
                  </div>
                }
              </div>

              <div class="col-md-4">
                <label class="form-label">Manufacturing Date</label>
                <input 
                  type="date" 
                  class="form-control" 
                  formControlName="manufacturingDate"
                  [class.is-invalid]="isFieldInvalid('manufacturingDate')"
                  [max]="currentDate()"
                >
                @if (isFieldInvalid('manufacturingDate')) {
                  <div class="invalid-feedback">
                    Valid manufacturing date is required
                  </div>
                }
              </div>

              <div class="col-md-4">
                <label class="form-label">Price ($)</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input 
                    type="number" 
                    class="form-control" 
                    formControlName="price"
                    [class.is-invalid]="isFieldInvalid('price')"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  >
                  @if (isFieldInvalid('price')) {
                    <div class="invalid-feedback">
                      @if (productForm.get('price')?.errors?.['required']) {
                        Price is required
                      } @else if (productForm.get('price')?.errors?.['min']) {
                        Price must be greater than 0
                      }
                    </div>
                  }
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label">Quantity</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-boxes"></i>
                  </span>
                  <input 
                    type="number" 
                    class="form-control" 
                    formControlName="quantity"
                    [class.is-invalid]="isFieldInvalid('quantity')"
                    min="0"
                    step="1"
                    placeholder="0"
                  >
                  @if (isFieldInvalid('quantity')) {
                    <div class="invalid-feedback">
                      @if (productForm.get('quantity')?.errors?.['required']) {
                        Quantity is required
                      } @else if (productForm.get('quantity')?.errors?.['min']) {
                        Quantity cannot be negative
                      }
                    </div>
                  }
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-end gap-2 mt-4">
              <button 
                type="button" 
                class="btn btn-outline-secondary" 
                routerLink="/products"
                [disabled]="isLoading()"
              >
                <i class="bi bi-x-lg me-2"></i>Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="productForm.invalid || isLoading()"
              >
                @if (isLoading()) {
                  <span class="spinner-border spinner-border-sm me-2"></span>
                  {{ isEditing() ? 'Updating...' : 'Creating...' }}
                } @else {
                  <i class="bi" [class.bi-plus-lg]="!isEditing()" [class.bi-check-lg]="isEditing()"></i>
                  {{ isEditing() ? 'Update' : 'Create' }} Product
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  @ViewChild('formDir') formDir!: NgForm;
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditing = signal(false);
  isLoading = signal(false);
  error = signal('');
  productId = '';

  // Get current date in YYYY-MM-DD format for date input max attribute
  currentDate = signal(new Date().toISOString().split('T')[0]);

  productForm = this.fb.group({
    name: ['', [Validators.required]],
    manufacturer: ['', [Validators.required]],
    description: ['', [Validators.required]],
    manufacturingDate: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    if (this.productId) {
      this.isEditing.set(true);
      this.loadProduct();
    }
  }

  loadProduct(): void {
    this.isLoading.set(true);
    this.error.set('');

    this.productService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading product', err);
        this.error.set('Failed to load product details. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.isLoading.set(true);
      this.error.set('');

      const productData = this.productForm.value as Product;
      const request = this.isEditing()
        ? this.productService.updateProduct(this.productId, { ...productData, id: this.productId })
        : this.productService.addProduct(productData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error saving product', err);
          this.error.set(`Failed to ${this.isEditing() ? 'update' : 'create'} product. Please try again.`);
          this.isLoading.set(false);
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}