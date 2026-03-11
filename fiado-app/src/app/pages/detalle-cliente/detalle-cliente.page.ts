import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonList, IonItem, IonLabel,
  IonBackButton, IonButtons, IonIcon, IonBadge,
  IonFab, IonFabButton, IonChip, IonMenuButton,
  ActionSheetController, AlertController, ToastController
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  add, calendar, cart, checkmarkCircle, timeOutline,
  documentText, documentTextOutline, gridOutline, createOutline,
  callOutline, locationOutline, checkmarkCircleOutline,
  cartOutline, calendarOutline, mailOutline, cardOutline,
  ellipsisVertical, pencilOutline, trashOutline, closeOutline,
  cashOutline, walletOutline
} from 'ionicons/icons';
import { DeudasService } from 'src/app/services/deudas';
import { Cliente } from '../../models/cliente.model';
import { Deuda } from '../../models/deuda.model';
import { ExportarService } from 'src/app/services/exportar';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.page.html',
  styleUrls: ['./detalle-cliente.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonList, IonItem, IonLabel,
    IonBackButton, IonButtons, IonIcon, IonBadge,
    IonFab, IonFabButton, IonChip,
    IonMenuButton,
  ]
})
export class DetalleClientePage implements OnInit {
  cliente?: Cliente;
  deudas: Deuda[] = [];
  deudasPendientes: Deuda[] = [];
  deudasPagadas: Deuda[] = [];
  clienteId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deudasService: DeudasService,
    private exportarService: ExportarService,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    // Registrar todos los iconos
    addIcons({
      add,
      calendar,
      cart,
      checkmarkCircle,
      timeOutline,
      documentText,
      documentTextOutline,
      gridOutline,
      createOutline,
      callOutline,
      locationOutline,
      checkmarkCircleOutline,
      cartOutline,
      calendarOutline,
      mailOutline,
      cardOutline,
      ellipsisVertical,
      pencilOutline,
      trashOutline,
      closeOutline,
      cashOutline,
      walletOutline
    });
  }

  async ngOnInit() {
    this.clienteId = this.route.snapshot.paramMap.get('id') || '';
    await this.cargarDatos();
  }

  async ionViewWillEnter() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    this.cliente = await this.deudasService.obtenerClientePorId(this.clienteId);
    this.deudas = await this.deudasService.obtenerDeudasPorCliente(this.clienteId);

    this.deudasPendientes = this.deudas.filter(d => d.estado === 'pendiente');
    this.deudasPagadas = this.deudas.filter(d => d.estado === 'pagada');
  }

  async mostrarOpcionesDeuda(deuda: Deuda, event: Event) {
    event.stopPropagation();

    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones de Deuda',
      buttons: [
        {
          text: 'Ver Detalle',
          icon: 'document-text-outline',
          handler: () => {
            this.verDetalleDeuda(deuda);
          }
        },
        {
          text: 'Editar Deuda',
          icon: 'pencil-outline',
          handler: () => {
            this.editarDeuda(deuda.id);
          }
        },
        {
          text: 'Eliminar Deuda',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.confirmarEliminarDeuda(deuda);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  editarDeuda(deudaId: string) {
    this.router.navigate(['/editar-deuda', deudaId]);
  }

  async confirmarEliminarDeuda(deuda: Deuda) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de eliminar esta deuda de ${this.formatearMoneda(deuda.total)}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.eliminarDeuda(deuda.id);
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarDeuda(deudaId: string) {
    try {
      await this.deudasService.eliminarDeuda(deudaId);
      await this.cargarDatos();
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: error.message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // ========== NUEVA FUNCIONALIDAD: PAGAR TODAS LAS DEUDAS ==========
  async confirmarPagarTodasLasDeudas() {
    if (!this.cliente || this.deudasPendientes.length === 0) {
      return;
    }

    const totalAPagar = this.cliente.saldoTotal;

    const alert = await this.alertController.create({
      header: 'Pagar Todas las Deudas',
      message: `¿Deseas pagar todas las deudas pendientes de ${this.cliente.nombre}?<br><br>
                <strong>Total a pagar:</strong> ${this.formatearMoneda(totalAPagar)}<br>
                <strong>Deudas a saldar:</strong> ${this.deudasPendientes.length}`,
      inputs: [
        {
          name: 'notas',
          type: 'textarea',
          placeholder: 'Notas del pago (opcional)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Pagar Todo',
          handler: async (data) => {
            await this.pagarTodasLasDeudas(data.notas);
          }
        }
      ]
    });

    await alert.present();
  }

  async pagarTodasLasDeudas(notas?: string) {
    try {
      const resultado = await this.deudasService.pagarTodasLasDeudas(
        this.clienteId,
        notas
      );

      // Mostrar mensaje de éxito
      const toast = await this.toastController.create({
        message: `✅ Se pagaron ${resultado.deudasPagadas} deuda(s) por un total de ${this.formatearMoneda(resultado.totalPagado)}`,
        duration: 3000,
        position: 'top',
        color: 'success',
        icon: 'checkmark-circle-outline'
      });
      await toast.present();

      // Recargar datos
      await this.cargarDatos();

    } catch (error: any) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: error.message,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  agregarDeuda() {
    this.router.navigate(['/nueva-deuda', this.clienteId]);
  }

  verDetalleDeuda(deuda: Deuda) {
    this.router.navigate(['/detalle-deuda', deuda.id]);
  }

  editarCliente() {
    if (this.cliente) {
      this.router.navigate(['/editar-cliente', this.cliente.id]);
    }
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  async exportarPDFCliente() {
    await this.exportarService.generarPDFCliente(this.clienteId);
  }

  async exportarExcelCliente() {
    await this.exportarService.generarExcelCliente(this.clienteId);
  }
}
