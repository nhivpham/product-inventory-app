import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { formGuard } from './guards/form.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    children: [
      {
        path: '',
        component: ProductListComponent
      },
      {
        path: 'add',
        component: ProductFormComponent,
        canActivate: [authGuard],
        canDeactivate: [formGuard]
      },
      {
        path: 'edit/:id',
        component: ProductFormComponent,
        canActivate: [authGuard],
        canDeactivate: [formGuard]
      },
      {
        path: ':id',
        component: ProductDetailComponent
      }
    ]
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]  
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];