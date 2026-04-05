import { Routes } from '@angular/router';
import { Home } from './views/home/home';
import { ProductCrud } from './views/product-crud/product-crud';
import { CustomerCrud } from './views/customer-crud/customer-crud';

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
    path: 'customers',
    component: CustomerCrud,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
