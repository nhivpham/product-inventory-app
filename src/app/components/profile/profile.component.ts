import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container my-4">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow">
            <div class="card-header bg-primary text-white d-flex align-items-center">
              <i class="bi bi-person-circle fs-4 me-2"></i>
              <h4 class="mb-0">Profile Details</h4>
            </div>
            <div class="card-body">
              @if (authService.currentUser(); as user) {
                <div class="row g-4">
                  <div class="col-md-6">
                    <div class="card h-100">
                      <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">Contact Information</h6>
                        <div class="mb-3">
                          <label class="text-muted small">Email Address</label>
                          <p class="mb-0">
                            <i class="bi bi-envelope me-2 text-primary"></i>
                            {{ user.email }}
                          </p>
                        </div>
                        <div class="mb-0">
                          <label class="text-muted small">Mobile Number</label>
                          <p class="mb-0">
                            <i class="bi bi-phone me-2 text-primary"></i>
                            {{ user.mobileNumber }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="card h-100">
                      <div class="card-body">
                        <h6 class="card-subtitle mb-2 text-muted">Personal Information</h6>
                        <div class="mb-3">
                          <label class="text-muted small">Full Name</label>
                          <p class="mb-0">
                            <i class="bi bi-person me-2 text-primary"></i>
                            {{ user.firstName }} {{ user.lastName }}
                          </p>
                        </div>
                        <div class="mb-0">
                          <label class="text-muted small">Location</label>
                          <p class="mb-0">
                            <i class="bi bi-geo-alt me-2 text-primary"></i>
                            {{ user.location }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <div class="card bg-light">
                      <div class="card-body">
                        <h6 class="card-subtitle mb-3 text-muted">Account Actions</h6>
                        <div class="d-flex gap-2">
                          <button class="btn btn-outline-primary" disabled>
                            <i class="bi bi-pencil me-2"></i>Edit Profile
                          </button>
                          <button class="btn btn-outline-danger" disabled>
                            <i class="bi bi-shield-lock me-2"></i>Change Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } @else {
                <div class="alert alert-warning">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  Please log in to view your profile details.
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  authService = inject(AuthService);
}