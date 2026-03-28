import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { Header } from './components/template/header/header';
import {Footer} from  './components/template/footer/footer';
import { Home } from './views/home/home'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Home],
  templateUrl: 'app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
