import { Component } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonThumbnail,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonAlert
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonThumbnail,
    IonLabel,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonAlert
  ],
  standalone: true,
})
export class CarritoComponent implements ViewWillEnter {
  carrito: { producto: any; cantidad: number }[] = [];
  total: number = 0;
  isAlertOpen = false;
  alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
    },
    {
      text: 'Vaciar',
      role: 'confirm',
      cssClass: 'alert-button-danger'
    },
  ];

  constructor(private carritoService: CarritoService) {}

  ionViewWillEnter(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    const data = localStorage.getItem('carrito');
    const plano = data ? JSON.parse(data) : [];
    this.carrito = this.agruparProductos(plano);
    this.calcularTotal();
    this.carritoService.actualizarCarrito(this.carrito);
  }

  private generarClaveUnica(producto: any): string {
    const base = producto.id ?? producto.nombre;
    return producto.presentacion ? `${base}_${producto.presentacion}` : base;
  }

  agruparProductos(productos: any[]): { producto: any, cantidad: number }[] {
    const mapa = new Map<string, { producto: any, cantidad: number }>();

    for (const p of productos) {
      const key = this.generarClaveUnica(p);
      if (mapa.has(key)) {
        mapa.get(key)!.cantidad += 1;
      } else {
        mapa.set(key, { producto: p, cantidad: 1 });
      }
    }

    return Array.from(mapa.values());
  }

  getPrecioProducto(producto: any): number {
    return producto.precioFinal || producto.precio;
  }

  calcularTotal(): void {
    this.total = this.carrito.reduce((sum, item) =>
      sum + (this.getPrecioProducto(item.producto) * item.cantidad), 0);
  }

  getTotalItems(): number {
    return this.carrito.reduce((total, item) => total + item.cantidad, 0);
  }

  modificarCantidad(index: number, cambio: number): void {
    const nuevaCantidad = this.carrito[index].cantidad + cambio;

    if (nuevaCantidad < 1) {
      this.eliminarProducto(index);
    } else {
      this.carrito[index].cantidad = nuevaCantidad;
      this.actualizarCarrito();
    }
  }

  eliminarProducto(index: number): void {
    this.carrito.splice(index, 1);
    this.actualizarCarrito();
  }

  mostrarConfirmacionVaciar(): void {
    this.isAlertOpen = true;
  }

  setOpen(isOpen: boolean): void {
    this.isAlertOpen = isOpen;
  }

  manejarAlerta(event: any): void {
    if (event.detail.role === 'confirm') {
      this.vaciarCarrito();
    }
  }

  actualizarCarrito(): void {
    const plano: any[] = [];
    this.carrito.forEach(item => {
      for (let i = 0; i < item.cantidad; i++) {
        plano.push(item.producto);
      }
    });

    localStorage.setItem('carrito', JSON.stringify(plano));
    this.carritoService.actualizarCarrito(this.carrito);
    this.calcularTotal();
  }

  vaciarCarrito(): void {
    this.carrito = [];
    this.total = 0;
    localStorage.removeItem('carrito');
    this.carritoService.actualizarCarrito([]);
    this.isAlertOpen = false;
  }

  get mensajeWhatsApp(): string {
    let mensaje = '¡Hola! Me gustaría hacer el siguiente pedido:\n\n';
    mensaje += '📦 *DETALLE DEL PEDIDO*\n';

    this.carrito.forEach((item, i) => {
      const precio = this.getPrecioProducto(item.producto);
      const subtotal = precio * item.cantidad;
      const nombreCompleto = item.producto.presentacion ?
        `${item.producto.nombre} (${item.producto.presentacion})` :
        item.producto.nombre;

      mensaje += `\n${i + 1}. *${nombreCompleto}*\n`;
      mensaje += `   Cantidad: ${item.cantidad}\n`;
      mensaje += `   Precio unitario: $${precio}\n`;
      mensaje += `   Subtotal: $${subtotal.toFixed(2)}\n`;
    });

    mensaje += `\n💰 *TOTAL: $${this.total.toFixed(2)}*\n\n`;
    mensaje += 'Por favor confirmen disponibilidad y tiempo de entrega. ¡Gracias! 🚀';

    return encodeURIComponent(mensaje);
  }

  get linkWhatsApp(): string {
    const numero = '573203316548';
    return `https://wa.me/${numero}?text=${this.mensajeWhatsApp}`;
  }
}
