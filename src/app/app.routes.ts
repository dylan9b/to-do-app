import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
    ],
  },
  {
    path: 'todos',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./todos/todos.component').then((m) => m.TodosComponent),
  },
  // {
  //   path: '',
  //   redirectTo: 'auth/login',
  //   pathMatch: 'full',
  // },
  {
    path: '**',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
