// src/app/services/auth.service.ts
import { Injectable, computed, signal } from '@angular/core';
import { Observable, from } from 'rxjs';
import { User } from '../models/product.model';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private apiUrl = '/api';
  
  private currentUserSig = signal<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  
  readonly isAuthenticated = computed(() => !!this.currentUserSig());
  readonly currentUser = computed(() => this.currentUserSig());

  register(user: User): Observable<User> {
    return from(
      fetch(`${this.apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
        .then(res => {
          if (!res.ok) throw new Error('Registration failed');
          return res.json();
        })
    );
  }

  login(email: string, password: string): Observable<User> {
    return from(
      fetch(`${this.apiUrl}/users?email=${email}&password=${password}`)
        .then(res => {
          if (!res.ok) throw new Error('Invalid credentials');
          return res.json();
        })
        .then(users => {
          const user = Array.isArray(users) ? users[0] : users;
          if (!user) {
            throw new Error('Invalid credentials');
          }
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSig.set(user);
          return user;
        })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSig.set(null);
    this.router.navigate(['/login']);
  }
}