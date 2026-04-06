import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, TextareaModule, InputNumberModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css'],
})
export class ProductForm {
  @Input() productForm!: FormGroup;
}
