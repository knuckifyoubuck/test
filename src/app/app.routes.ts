import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'books',
    loadComponent: () => import('./pages/books/book-list/book-list.component').then((r) => r.BookListComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page'),
  },
  {
    path: 'other',
    loadComponent: () => import('./pages/other/other.page'),
  },
  {
    path: '**',
    redirectTo: 'books',
    pathMatch: 'full'
  }
]
