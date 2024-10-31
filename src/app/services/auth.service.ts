import { Injectable, computed, signal } from '@angular/core';
import { Observable, from, tap, catchError, throwError, of } from 'rxjs';
import { User } from '../models/product.model';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private apiUrl = '/api';
  
  private currentUserSig = signal<User | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUserSig());
  readonly currentUser = computed(() => this.currentUserSig());

  register(user: User): Observable<User> {
    return from(
      fetch(`${this.apiUrl}/users`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
      .then(res => {
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
      })
    ).pipe(
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => new Error('Registration failed'));
      })
    );
  }

  login(email: string, password: string): Observable<User> {
    return from(
      fetch(`${this.apiUrl}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      .then(res => {
        if (!res.ok) throw new Error('Invalid credentials');
        return res.json();
      })
    ).pipe(
      tap(user => {
        this.currentUserSig.set(user);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Invalid credentials'));
      })
    );
  }

  // Check authentication status on app load
  checkAuth(): Observable<User | null> {
    return from(
      fetch(`${this.apiUrl}/users/me`, {
        credentials: 'include'
      })
      .then(res => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
    ).pipe(
      tap(user => {
        this.currentUserSig.set(user);
      }),
      catchError(() => {
        this.currentUserSig.set(null);
        return of(null);
      })
    );
  }

  logout(): Observable<void> {
    return from(
      fetch(`${this.apiUrl}/users/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      .then(res => {
        if (!res.ok) throw new Error('Logout failed');
      })
    ).pipe(
      tap(() => {
        this.currentUserSig.set(null);
        this.router.navigate(['/login']);
      }),
      catchError(error => {
        console.error('Logout error:', error);
        return throwError(() => new Error('Logout failed'));
      })
    );
  }
}