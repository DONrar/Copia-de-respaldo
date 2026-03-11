import { Component, OnInit, inject, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonButtons,
  IonIcon, IonItem, IonLabel, IonInput,
  IonTextarea, IonCard, IonCardContent,
  IonCardHeader, IonCardTitle, IonAlert
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { DeudasService } from 'src/app/services/deudas';
import { ProductoItem } from '../../models/producto-item.model';
import { addIcons } from 'ionicons';
import {
  arrowBack, pencil, checkmark, cartOutline, trashOutline,
  addCircleOutline, calculatorOutline, documentTextOutline,
  createOutline, informationCircleOutline, checkmarkCircle,
  closeCircle
} from 'ionicons/icons';

@Component({
  selector: 'app-editar-deuda',
  templateUrl: './editar-deuda.page.html',
  styleUrls: ['./editar-deuda.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonButtons, IonIcon,
    IonItem, IonLabel, IonInput, IonTextarea,
    IonCard, IonCardContent, IonCardHeader,
    IonCardTitle, IonAlert
  ]
})
export class EditarDeudaPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private deudasService = inject(DeudasService);
  private cdr = inject(ChangeDetectorRef);

  deudaId: string = '';
  productos: ProductoItem[] = [];
  notas: string = '';
  isAlertOpen = false;
  alertHeader = '';
  alertMessage = '';

  constructor() {
    addIcons({
      arrowBack, pencil, checkmark, cartOutline, trashOutline,
      addCircleOutline, calculatorOutline, documentTextOutline,
      createOutline, informationCircleOutline, checkmarkCircle,
      closeCircle
    });
  }

  async ngOnInit() {
    this.deudaId = this.route.snapshot.paramMap.get('id') || '';
    await this.cargarDeuda();
  }

  async cargarDeuda() {
    const deuda = await this.deudasService.obtenerDeudaPorId(this.deudaId);
    if (deuda) {
      this.productos = [...deuda.productos];
      this.notas = deuda.notas || '';
      this.calcularSubtotales();
    }
  }

  generarIdTemporal(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  agregarProducto() {
    this.productos.push({
      id: this.generarIdTemporal(),
      nombre: '',
      cantidad: 1,
      valorUnitario: 0,
      subtotal: 0
    });
    // Forzar detección de cambios
    this.cdr.detectChanges();
  }

  eliminarProducto(index: number) {
    this.productos.splice(index, 1);
    this.calcularSubtotales();
     this.cdr.detectChanges(); // También aquí
  }

  calcularSubtotales() {
    this.productos.forEach(producto => {
      producto.subtotal = this.deudasService.calcularSubtotal(
        producto.cantidad,
        producto.valorUnitario
      );
    });
  }

  calcularSubtotal(): number {
    return this.productos.reduce((total, producto) => {
      return total + (producto.cantidad * producto.valorUnitario);
    }, 0);
  }

  calcularTotal(): number {
    return this.calcularSubtotal();
  }

  cancelar(): void {
    // Navegar de regreso al detalle de la deuda
    this.router.navigate(['/detalle-deuda', this.deudaId]);
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  }

  async guardar() {
    try {
      // Validar que todos los productos tengan nombre
      const productosInvalidos = this.productos.filter(p =>
        !p.nombre.trim() || p.cantidad <= 0 || p.valorUnitario < 0
      );

      if (productosInvalidos.length > 0) {
        this.mostrarAlerta('Error', 'Todos los productos deben tener nombre y valores válidos');
        return;
      }

      await this.deudasService.actualizarDeuda(
        this.deudaId,
        this.productos,
        this.notas
      );

      this.router.navigate(['/detalle-deuda', this.deudaId]);
    } catch (error: any) {
      this.mostrarAlerta('Error', error.message || 'No se pudo actualizar la deuda');
    }
  }

  mostrarAlerta(header: string, message: string) {
    this.alertHeader = header;
    this.alertMessage = message;
    this.isAlertOpen = true;
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
}
