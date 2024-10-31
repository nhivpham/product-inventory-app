import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="row justify-content-center my-5">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow">
            <div class="card-header bg-primary text-white py-3">
              <h4 class="card-title mb-0 text-center">
                <i class="bi bi-person-plus me-2"></i>Create Account
              </h4>
            </div>
            <div class="card-body p-4">
              @if (error()) {
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ error() }}
                  <button type="button" class="btn-close" (click)="error.set('')"></button>
                </div>
              }

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">First Name</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      formControlName="firstName"
                      [class.is-invalid]="isFieldInvalid('firstName')"
                      placeholder="Enter first name"
                    >
                    @if (isFieldInvalid('firstName')) {
                      <div class="invalid-feedback">
                        First name is required
                      </div>
                    }
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Last Name</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      formControlName="lastName"
                      [class.is-invalid]="isFieldInvalid('lastName')"
                      placeholder="Enter last name"
                    >
                    @if (isFieldInvalid('lastName')) {
                      <div class="invalid-feedback">
                        Last name is required
                      </div>
                    }
                  </div>

                  <div class="col-12">
                    <label class="form-label">Email address</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-envelope"></i>
                      </span>
                      <input 
                        type="email" 
                        class="form-control" 
                        formControlName="email"
                        [class.is-invalid]="isFieldInvalid('email')"
                        placeholder="Enter email address"
                      >
                      @if (isFieldInvalid('email')) {
                        <div class="invalid-feedback">
                          @if (registerForm.get('email')?.errors?.['required']) {
                            Email is required
                          } @else if (registerForm.get('email')?.errors?.['email']) {
                            Please enter a valid email address
                          }
                        </div>
                      }
                    </div>
                  </div>

                  <div class="col-12">
                    <label class="form-label">Password</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-lock"></i>
                      </span>
                      <input 
                        [type]="showPassword() ? 'text' : 'password'"
                        class="form-control" 
                        formControlName="password"
                        [class.is-invalid]="isFieldInvalid('password')"
                        placeholder="Create a password"
                      >
                      <button 
                        class="btn btn-outline-secondary" 
                        type="button"
                        (click)="togglePassword()"
                      >
                        <i class="bi" [class.bi-eye-fill]="!showPassword()" [class.bi-eye-slash-fill]="showPassword()"></i>
                      </button>
                      @if (isFieldInvalid('password')) {
                        <div class="invalid-feedback">
                          @if (registerForm.get('password')?.errors?.['required']) {
                            Password is required
                          } @else if (registerForm.get('password')?.errors?.['minlength']) {
                            Password must be at least 6 characters
                          }
                        </div>
                      }
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Location</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-geo-alt"></i>
                      </span>
                      <input 
                        type="text" 
                        class="form-control" 
                        formControlName="location"
                        [class.is-invalid]="isFieldInvalid('location')"
                        placeholder="Enter your location"
                      >
                      @if (isFieldInvalid('location')) {
                        <div class="invalid-feedback">
                          Location is required
                        </div>
                      }
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label">Mobile Number</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="bi bi-phone"></i>
                      </span>
                      <input 
                        type="tel" 
                        class="form-control" 
                        formControlName="mobileNumber"
                        [class.is-invalid]="isFieldInvalid('mobileNumber')"
                        placeholder="Enter mobile number"
                      >
                      @if (isFieldInvalid('mobileNumber')) {
                        <div class="invalid-feedback">
                          Mobile number is required
                        </div>
                      }
                    </div>
                  </div>
                </div>

                <div class="d-grid gap-2 mt-4">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="registerForm.invalid || isLoading()"
                  >
                    @if (isLoading()) {
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Creating Account...
                    } @else {
                      <i class="bi bi-person-plus me-2"></i>Create Account
                    }
                  </button>
                  
                  <a routerLink="/login" class="btn btn-outline-secondary">
                    <i class="bi bi-arrow-left me-2"></i>Back to Login
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  error = signal('');
  isLoading = signal(false);
  showPassword = signal(false);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    location: ['', [Validators.required]],
    mobileNumber: ['', [Validators.required]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.error.set('');

      this.authService.register(this.registerForm.value as any).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed', err);
          this.error.set('Registration failed. Please try again.');
          this.isLoading.set(false);
        }
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}