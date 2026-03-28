import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, DrawerModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header {
  menuVisivel: boolean = false;
  tituloPagina: string = 'Início';
}
