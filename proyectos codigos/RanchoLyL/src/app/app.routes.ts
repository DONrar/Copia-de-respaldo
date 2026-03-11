import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ContactoComponent } from './pages/contacto/contacto.component'; 
import { WhatsappButtonComponent } from './shared/whatsapp-button/whatsapp-button.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { TabsComponent } from './shared/tabs/tabs.component';

export const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: HomeComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'contacto', component: ContactoComponent },
      { path: 'carrito', component: CarritoComponent },
    ]
  },
  {
    path: 'id',
    loadComponent: () => import('./id/id.page').then( m => m.IdPage)
  }

];
