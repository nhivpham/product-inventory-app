import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../models/product.model';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = '/api';
  
  private currentUserSig = signal<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  
  readonly isAuthenticated = computed(() => !!this.currentUserSig());
  readonly currentUser = computed(() => this.currentUserSig());

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  login(email: string, password: string): Observable<User> {
    console.log('Attempting login with:', { email, password });
    
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${email}&password=${password}`)
      .pipe(
        map(users => {
          console.log('Login response:', users);
          
          if (!Array.isArray(users) || users.length === 0) {
            throw new Error('Invalid credentials');
          }
          
          const user = users[0];
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
