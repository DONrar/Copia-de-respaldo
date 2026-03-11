import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { EventosComponent } from './pages/eventos/eventos.component';
import { PaquetesComponent } from './pages/paquetes/paquetes.component';
import { ContactoComponent } from './pages/contacto/contacto.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Banquete de Eventos · Inicio' },
  { path: 'servicios', component: ServiciosComponent, title: 'Banquete de Eventos · Inicio' },
  { path: 'contacto', component: ContactoComponent, title: 'Banquete de Eventos · Inicio' },
  { path: 'paquetes', component: PaquetesComponent, title: 'Banquete de Eventos · Inicio' },
  { path: 'eventos', component: EventosComponent, title: 'Banquete de Eventos · Inicio' },
  { path: '**', redirectTo: '' }
];
