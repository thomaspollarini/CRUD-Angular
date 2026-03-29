import { Component } from '@angular/core';
import { ProductList } from '../../components/product/product-list/product-list';

@Component({
  selector: 'app-product-crud',
  imports: [ProductList],
  templateUrl: './product-crud.html',
  styleUrl: './product-crud.css',
})
export class ProductCrud {}
