import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel, IonBadge } from '@ionic/angular/standalone';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports:[CommonModule, RouterModule,
    RouterModule, // Necesario para routerLink
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonBadge,
    IonLabel]
})
export class TabsComponent implements OnInit {
  totalProductos: number = 0;

  constructor(private carritoService: CarritoService) {}

  ngOnInit() {
    this.carritoService.carrito$.subscribe(carrito => {
      this.totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    });
  }
}
