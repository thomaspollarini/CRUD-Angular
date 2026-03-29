import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';

import { MessageService, ConfirmationService } from 'primeng/api';

import { Product, ProductFormData } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'],
})
export class ProductList implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  displayNewDialog = false;
  displayEditDialog = false;

  editingProductId: string | null = null;

  get products() {
    return this.productService.products;
  }

  // Objeto usado para criar um novo produto, pegando informações do formulário
  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    stock: new FormControl(0, [Validators.required, Validators.min(0)]),
  });

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.productService.loadProducts().pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openNewProductForm() {
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
    });
    this.displayNewDialog = true;
  }

  closeNewDialog() {
    this.displayNewDialog = false;
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
    });
  }

  saveNewProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = this.productForm.getRawValue() as ProductFormData;

    this.productService
      .createProduct(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (created) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: `Produto "${created.name}" criado com sucesso.`,
            life: 3000,
          });
          this.closeNewDialog();
        },
        error: (err) => {
          console.error('Erro ao criar produto:', err);
          const errorMsg = err.error?.message || err.message || 'Erro desconhecido';
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Ocorreu um erro ao criar o produto: ${errorMsg}`,
            life: 3000,
          });
        },
        complete: () => {
          console.log('Operação concluída');
        },
      });
  }

  openEditProduct(product: Product) {
    this.editingProductId = product.id;

    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });

    this.displayEditDialog = true;
  }

  saveEditProduct() {
    if (this.productForm.invalid || !this.editingProductId) return;

    const formData = this.productForm.value as ProductFormData;

    this.productService
      .updateProduct(this.editingProductId, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: `Produto "${updated.name}" atualizado com sucesso.`,
            life: 3000,
          });
          this.closeEditDialog();
        },
        error: (err) => {
          console.error('Erro ao atualizar produto:', err);
          const errorMsg = err.error?.message || err.message || 'Erro desconhecido';
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Ocorreu um erro ao atualizar o produto: ${errorMsg}`,
            life: 3000,
          });
        },
        complete: () => {
          console.log('Operação concluída');
        },
      });
  }

  closeEditDialog() {
    this.displayEditDialog = false;
    this.editingProductId = null;
    this.productForm.reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
    });
  }

  deleteProduct(id: string, productName: string) {
    this.confirmationService.confirm({
      message: `Você está prestes a excluir o produto "${productName}". Esta ação não pode ser desfeita.`,
      header: 'Excluir Produto',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      defaultFocus: 'reject',
      accept: () => {
        this.productService
          .deleteProduct(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (deleted) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso!',
                detail: `Produto excluído com sucesso.`,
                life: 3000,
              });
            },
            error: (err) => {
              console.error('Erro ao excluir produto:', err);
              const errorMsg = err.error?.message || err.message || 'Erro desconhecido';
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: `Ocorreu um erro ao excluir o produto: ${errorMsg}`,
                life: 3000,
              });
            },
            complete: () => {
              console.log('Operação concluída');
            },
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelado',
          detail: 'Exclusão cancelada pelo usuário.',
          life: 2000,
        });
      },
    });
  }

  formatPrice(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
