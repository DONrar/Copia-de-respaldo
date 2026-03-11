import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonButton
  ]
})
export class HomeComponent {

  nombreNegocio = 'Rancho L y L';

  productosPopulares = [
    {
      id: 1,
      nombre: 'Hamburguesa Ranchera',
      imagen: '/assets/menu/Ranchera.png',
      precio: 16000
    },
    {
      id: 2,
      nombre: 'mazorcada',
      imagen: '/assets/menu/mazorcada.png',
      precio: 12000
    },
    {
      id: 3,
      nombre: 'Picadas de carne',
      imagen: 'assets/menu/descarga.jpeg',
      precio: 25000
    },
    {
      id: 4,
      nombre: 'Churrasco',
      imagen: 'assets/menu/churrasco.jpeg',
      precio: 19000
    }
  ];

  imagenesCarrusel = [
    '/assets/menu/hamburguesa.jpeg',
    '/assets/menu/salchipapa.jpeg',
    'assets/menu/perro.jpeg',
  ];

  constructor(private router: Router) {}

  irAlMenu() {
    this.router.navigate(['/menu']);
  }

  verDetalle(producto: { id: number }) {
    this.router.navigate(['/producto', producto.id]);
  }
}
