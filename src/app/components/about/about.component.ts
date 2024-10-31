import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="row justify-content-center mb-4">
        <div class="col-lg-8">
          <div class="card shadow">
            <div class="card-body text-center py-5">
              <i class="bi bi-box-seam display-1 text-primary mb-4"></i>
              <h1 class="display-4 mb-3">Product Inventory System</h1>
              <p class="lead text-muted">
                A modern inventory management solution for tracking and managing your products efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="row row-cols-1 row-cols-md-2 g-4 mb-4">
        <div class="col">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-gear-fill text-primary fs-4 me-2"></i>
                <h3 class="card-title mb-0">Features</h3>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex align-items-center">
                  <i class="bi bi-check2-circle text-success me-2"></i>
                  Product Management
                </li>
                <li class="list-group-item d-flex align-items-center">
                  <i class="bi bi-check2-circle text-success me-2"></i>
                  Inventory Tracking
                </li>
                <li class="list-group-item d-flex align-items-center">
                  <i class="bi bi-check2-circle text-success me-2"></i>
                  Real-time Stock Updates
                </li>
                <li class="list-group-item d-flex align-items-center">
                  <i class="bi bi-check2-circle text-success me-2"></i>
                  Search & Filtering
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-tools text-primary fs-4 me-2"></i>
                <h3 class="card-title mb-0">Technology Stack</h3>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex align-items-center">
                  <i class="bi bi-check2-circle text-success me-2"></i>
                  Angular 18
                </li>
                <li class="list-group-item d-flex align-items-center">
                  <i class="bi bi-check2-circle text-success me-2"></i>
                  TypeScript
                </li>
                <li class="list-group-item d-flex align-items-center">
                  <i class="bi bi-check2-circle text-success me-2"></i>
                  Bootstrap 5
                </li>
                <li class="list-group-item d-flex align-items-center">
                  <i class="bi bi-check2-circle text-success me-2"></i>
                  RESTful API
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-body">
              <h3 class="card-title d-flex align-items-center mb-3">
                <i class="bi bi-shield-check text-primary fs-4 me-2"></i>
                Security Features
              </h3>
              <div class="row g-4">
                <div class="col-md-6">
                  <div class="d-flex align-items-start">
                    <i class="bi bi-lock-fill text-primary me-2 mt-1"></i>
                    <div>
                      <h5>Authentication</h5>
                      <p class="text-muted mb-0">Secure user authentication system to protect sensitive data.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-start">
                    <i class="bi bi-person-badge text-primary me-2 mt-1"></i>
                    <div>
                      <h5>Authorization</h5>
                      <p class="text-muted mb-0">Role-based access control for different user permissions.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-start">
                    <i class="bi bi-shield-lock text-primary me-2 mt-1"></i>
                    <div>
                      <h5>Data Protection</h5>
                      <p class="text-muted mb-0">Encrypted data storage and secure data transmission.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex align-items-start">
                    <i class="bi bi-activity text-primary me-2 mt-1"></i>
                    <div>
                      <h5>Activity Monitoring</h5>
                      <p class="text-muted mb-0">Track and log all system activities for security audit.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent {}
