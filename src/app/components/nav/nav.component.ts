import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="bi bi-box-seam me-2"></i>Product Inventory
        </a>
        
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/products" routerLinkActive="active">
                <i class="bi bi-grid me-1"></i>Products
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/about" routerLinkActive="active">
                <i class="bi bi-info-circle me-1"></i>About
              </a>
            </li>
          </ul>
          
          <ul class="navbar-nav">
            @if (!authService.isAuthenticated()) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active">
                  <i class="bi bi-box-arrow-in-right me-1"></i>Login
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/register" routerLinkActive="active">
                  <i class="bi bi-person-plus me-1"></i>Register
                </a>
              </li>
            } @else {
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" 
                   role="button" 
                   data-bs-toggle="dropdown"
                   aria-expanded="false"
                >
                  <i class="bi bi-person-circle me-1"></i>
                  {{ authService.currentUser()?.firstName }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <a class="dropdown-item" routerLink="/profile">
                      <i class="bi bi-person me-2"></i>Profile
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a class="dropdown-item text-danger" href="#" (click)="logout($event)">
                      <i class="bi bi-box-arrow-right me-2"></i>Logout
                    </a>
                  </li>
                </ul>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      margin-bottom: 1.5rem;
    }
    .nav-link {
      padding: 0.5rem 1rem;
    }
  `]
})
export class NavComponent {
  authService = inject(AuthService);

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
  }
}