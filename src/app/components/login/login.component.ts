import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="row justify-content-center my-5">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-header bg-primary text-white py-3">
              <h4 class="card-title mb-0 text-center">
                <i class="bi bi-box-arrow-in-right me-2"></i>Login
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

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
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
                      placeholder="Enter your email"
                    >
                    @if (isFieldInvalid('email')) {
                      <div class="invalid-feedback">
                        @if (loginForm.get('email')?.errors?.['required']) {
                          Email is required
                        } @else if (loginForm.get('email')?.errors?.['email']) {
                          Please enter a valid email address
                        }
                      </div>
                    }
                  </div>
                </div>

                <div class="mb-4">
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
                      placeholder="Enter your password"
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
                        Password is required
                      </div>
                    }
                  </div>
                </div>

                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    [disabled]="loginForm.invalid || isLoading()"
                  >
                    @if (isLoading()) {
                      <span class="spinner-border spinner-border-sm me-2"></span>
                      Signing in...
                    } @else {
                      <i class="bi bi-box-arrow-in-right me-2"></i>Sign In
                    }
                  </button>
                  
                  <a routerLink="/register" class="btn btn-outline-secondary">
                    <i class="bi bi-person-plus me-2"></i>Create New Account
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  error = signal('');
  isLoading = signal(false);
  showPassword = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.error.set('');
  
      const { email, password } = this.loginForm.value;
      console.log('Submitting login form:', { email, password }); 
  
      this.authService.login(email!, password!).subscribe({
        next: (user) => {
          console.log('Login successful:', user); 
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.error.set('Invalid email or password');
          this.isLoading.set(false);
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }
}