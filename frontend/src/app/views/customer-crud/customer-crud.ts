import { Component } from '@angular/core';
import { CustomerList } from '../../components/customer/customer-list/customer-list';

@Component({
  selector: 'app-customer-crud',
  imports: [CustomerList],
  templateUrl: './customer-crud.html',
  styleUrl: './customer-crud.css',
})
export class CustomerCrud {}
