import { Routes } from '@angular/router';
import { Home } from './views/home/home';
import { ProductCrud } from './views/product-crud/product-crud';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'products',
    component: ProductCrud,
  },
  {
    path: '**',
    redirectTo: '',
  }
];
