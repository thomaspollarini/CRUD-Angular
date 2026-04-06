import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { MessageService, ConfirmationService } from 'primeng/api';

import { CustomerService } from '../../../services/customer.service';
import { Customer, CustomerFormData } from '../../../models/customer.model';
import { CostumerForm } from '../costumer-form/costumer-form';

import { cpfFormatValidator, phoneFormatValidator } from '../../../shared/utils/string.utils';

@Component({
  selector: 'app-customer-list',
  imports: [
    CommonModule,
    ToastModule,
    DialogModule,
    ConfirmDialog,
    ButtonModule,
    TableModule,
    CostumerForm,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerList implements OnInit, OnDestroy {
  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.customerService.loadCustomers().pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get customers() {
    return this.customerService.customers;
  }

  //variaveis de controle para mostrar os p-dialog
  displayNewDialog = false;
  displayEditDialog = false;

  //variavel para salvar id do cliente que será editado
  editingCustomerId: string | null = null;

  //Objeto para coleta dos dados
  customerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', phoneFormatValidator()),
    address: new FormControl(''),
    cpf: new FormControl('', [Validators.required, cpfFormatValidator()]),
  });

  openNewCustomerForm() {
    this.customerForm.reset({
      name: '',
      email: '',
      phone: '',
      address: '',
      cpf: '',
    });
    this.displayNewDialog = true;
  }

  closeNewCustomerForm() {
    this.displayNewDialog = false;
  }

  saveNewCustomer() {
    const formData = this.customerForm.getRawValue() as CustomerFormData;

    this.customerService
      .createCustomer(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (created) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: `Cliente "${created.name}" criado com sucesso.`,
            life: 3000,
          });
          this.closeNewCustomerForm();
        },
        error: (err) => {
          console.error('Erro ao criar cliente:', err);
          const errorMsg = err.error?.message || err.message || 'Erro desconhecido';
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Ocorreu um erro ao criar o cliente: ${errorMsg}`,
            life: 3000,
          });
        },
        complete: () => {
          console.log('Operação concluída');
        },
      });
  }

  openEditCustomer(customer: Customer) {
    this.editingCustomerId = customer.id;

    this.customerForm.patchValue({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      cpf: customer.cpf,
    });

    this.displayEditDialog = true;
  }

  saveEditCustomer() {
    if (!this.editingCustomerId) return;

    const formData = this.customerForm.value as CustomerFormData;

    this.customerService
      .updateCustomer(this.editingCustomerId, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: `Cliente "${updated.name}" atualizado com sucesso.`,
            life: 3000,
          });
          this.closeEditDialog();
        },
        error: (err) => {
          console.error('Erro ao atualizar cliente:', err);
          const errorMsg = err.error?.message || err.message || 'Erro desconhecido';
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Ocorreu um erro ao atualizar o cliente: ${errorMsg}`,
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
    this.editingCustomerId = null;
  }

  deleteCustomer(id: string, customerName: string) {
    this.confirmationService.confirm({
      message: `Você está prestes a excluir o cliente "${customerName}". Esta ação não pode ser desfeita.`,
      header: 'Excluir Cliente',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      defaultFocus: 'reject',
      accept: () => {
        this.customerService
          .deleteCustomer(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (deleted) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso!',
                detail: `Cliente excluído com sucesso.`,
                life: 3000,
              });
            },
            error: (err) => {
              console.error('Erro ao excluir cliente:', err);
              const errorMsg = err.error?.message || err.message || 'Erro desconhecido';
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: `Ocorreu um erro ao excluir o cliente: ${errorMsg}`,
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
}
