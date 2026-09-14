import { Routes } from '@angular/router';
import { LoginComponent } from '@features/auth/login/login.component';
import { RegisterComponent } from '@features/auth/register/register.component';
import { DashboardComponent } from '@features/dashboard/dashboard.component';
import { ExpensesComponent } from '@features/expenses/expenses.component';
import { authGuard, guestGuard } from '@core/guards';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'expenses', component: ExpensesComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/dashboard' },
];
