import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-costumer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './costumer-form.html',
  styleUrl: './costumer-form.css',
})
export class CostumerForm {
  @Input() customerForm!: FormGroup;
}
