import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [CardModule, ButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  welcomeTitle = 'Bem-vindo ao Sistema CRUD';
  projectDescription = 'Este projeto foi desenvolvido para práticar a integração entre Angular e PrimeNG, focado no gerenciamento eficiente de Clientes, Fornecedores e Produtos. Posteriormente será integrado com um backend em Spring Boot para fornecer uma experiência completa de CRUD (Create, Read, Update, Delete).';
}
