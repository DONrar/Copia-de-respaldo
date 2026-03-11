import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonAvatar,
  IonChip,
  IonLabel,
  IonList,
  IonItem,
  IonRadioGroup,
  IonRadio,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonButtons,
  IonSpinner,
  IonBadge,
  AlertController,
  ToastController,
  LoadingController,
  ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  qrCodeOutline,
  logOutOutline,
  carOutline,
  checkmarkCircle,
  alertCircle,
  closeCircle,
  arrowForwardCircle,
  arrowBackCircle,
  shieldCheckmarkOutline,
  personCircleOutline,
  homeOutline,
  cardOutline,
  warningOutline, colorPaletteOutline, alertCircleOutline, timeOutline } from 'ionicons/icons';import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHintALLOption,
  CapacitorBarcodeScannerCameraDirection,
  CapacitorBarcodeScannerScanOrientation,
  CapacitorBarcodeScannerAndroidScanningLibrary,
} from '@capacitor/barcode-scanner';

import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { ApiService, QrScanResponse, VehiculoAsociado } from '../../services/api-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonAvatar,
    IonChip,
    IonLabel,
    IonList,
    IonItem,
    IonRadioGroup,
    IonRadio,
    IonSegment,
    IonSegmentButton,
    IonText,
    IonButtons,
    IonSpinner,
    IonBadge
  ]
})
export class HomePage implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private loadingController = inject(LoadingController);
  private actionSheetController = inject(ActionSheetController);

  personaInfo: QrScanResponse | null = null;
  placaSeleccionada: string = '';
  tipoMovimiento: 'ENTRADA' | 'SALIDA' = 'ENTRADA';
  loading = false;
  scanActive = false;
  lastQrToken: string = '';
  usuarioActual: string = '';

  constructor() {
    addIcons({shieldCheckmarkOutline,logOutOutline,personCircleOutline,qrCodeOutline,cardOutline,homeOutline,carOutline,colorPaletteOutline,alertCircleOutline,arrowForwardCircle,arrowBackCircle,closeCircle,timeOutline,checkmarkCircle,alertCircle,warningOutline});
  }

  async ngOnInit() {
    await this.checkAuthentication();
    await this.loadUserData();
  }

  async checkAuthentication() {
    const isAuth = await this.apiService.isAuthenticated();
    if (!isAuth) {
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }

  async loadUserData() {
    const userData = await this.apiService.getUserData();
    if (userData) {
      this.usuarioActual = userData.nombreCompleto;
    }
  }

   async escanearQR() {
    try {
      // Marcar UI como escaneando
      this.scanActive = true;
      document.body.classList.add('scanner-active');

      // Vibración suave antes de abrir la cámara
      await Haptics.impact({ style: ImpactStyle.Light });

      // Llamar al plugin oficial
      const result = await CapacitorBarcodeScanner.scanBarcode({
        // Escanear cualquier tipo de código, pero tú usarás QR
        hint: CapacitorBarcodeScannerTypeHintALLOption.ALL,
        scanText: 'Escanear código QR',
        scanInstructions: 'Apunta la cámara al QR del residente',
        cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
        scanOrientation: CapacitorBarcodeScannerScanOrientation.PORTRAIT,
        android: {
          // Usa MLKIT (recomendado); puedes cambiar a ZXING si quieres
          scanningLibrary: CapacitorBarcodeScannerAndroidScanningLibrary.MLKIT,
        },
        web: {
          showCameraSelection: true,
          scannerFPS: 30,
        },
      });

      // Restaurar UI
      this.scanActive = false;
      document.body.classList.remove('scanner-active');

      const qrContent = result?.ScanResult;

      if (qrContent) {
        // Vibración de éxito
        await Haptics.impact({ style: ImpactStyle.Medium });

        console.log('QR Escaneado:', qrContent);
        await this.consultarPersona(qrContent);
      } else {
        await this.showToast('No se detectó contenido en el código QR', 'warning');
      }
    } catch (error: any) {
      console.error('Error escaneando QR:', error);
      this.scanActive = false;
      document.body.classList.remove('scanner-active');

      // Mensaje más amigable según el tipo de error
      const errorMsg =
        error?.message?.toString().includes('denied') ||
        error?.message?.toString().includes('NotAllowed')
          ? 'Permiso de cámara denegado. Por favor habilítelo en los ajustes del dispositivo.'
          : 'No se pudo escanear el código QR. Intente nuevamente.';

      await this.showAlert('Error', errorMsg);
    }
  }


  async consultarPersona(qrToken: string) {
    const loading = await this.loadingController.create({
      message: 'Consultando información...',
      spinner: 'crescent',
      duration: 10000
    });
    await loading.present();

    this.lastQrToken = qrToken;

    this.apiService.escanearQr(qrToken).subscribe({
      next: async (data) => {
        await loading.dismiss();
        this.personaInfo = data;

        // Vibración de éxito
        await Haptics.impact({ style: ImpactStyle.Heavy });

        console.log('Persona encontrada:', data);

        // Seleccionar automáticamente el primer vehículo si solo hay uno
        if (data.vehiculos.length === 1) {
          this.placaSeleccionada = data.vehiculos[0].placa;
        }

        // Mostrar alerta si está en mora
        if (!data.estadoPago.permiteIngreso) {
          await this.showToast(
            `⚠️ ${data.persona.nombre} está en MORA de administración`,
            'warning',
            3000
          );
        }
      },
      error: async (error) => {
        await loading.dismiss();
        await Haptics.impact({ style: ImpactStyle.Heavy });
        await this.showAlert('Error', error.message);
      }
    });
  }

  async registrarMovimiento() {
    if (!this.placaSeleccionada || !this.tipoMovimiento) {
      await this.showAlert('Error', 'Debe seleccionar un vehículo y tipo de movimiento');
      return;
    }

    // Confirmación
    const confirmed = await this.showConfirmation(
      `¿Confirmar ${this.tipoMovimiento}?`,
      `Vehículo: ${this.placaSeleccionada}`
    );

    if (!confirmed) return;

    const loading = await this.loadingController.create({
      message: `Registrando ${this.tipoMovimiento.toLowerCase()}...`,
      spinner: 'crescent'
    });
    await loading.present();

    this.apiService.registrarMovimiento(
      this.lastQrToken,
      this.placaSeleccionada,
      this.tipoMovimiento
    ).subscribe({
      next: async (response) => {
        await loading.dismiss();

        if (response.exitoso) {
          // Vibración de éxito
          await Haptics.impact({ style: ImpactStyle.Heavy });

          await this.showSuccessAlert(
            '✅ Movimiento Registrado',
            response.mensaje,
            response.alertas
          );

          // Limpiar formulario
          this.cancelar();
        } else {
          // Vibración de error
          await Haptics.impact({ style: ImpactStyle.Heavy });

          await this.showAlert(
            '❌ Movimiento Denegado',
            response.mensaje
          );
        }
      },
      error: async (error) => {
        await loading.dismiss();
        await Haptics.impact({ style: ImpactStyle.Heavy });
        await this.showAlert('Error', error.message);
      }
    });
  }

  cancelar() {
    this.personaInfo = null;
    this.placaSeleccionada = '';
    this.tipoMovimiento = 'ENTRADA';
    this.lastQrToken = '';
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Está seguro que desea salir?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salir',
          role: 'destructive',
          handler: async () => {
            await this.apiService.logout();
            this.router.navigate(['/login'], { replaceUrl: true });
            await this.showToast('Sesión cerrada', 'success');
          }
        }
      ]
    });
    await alert.present();
  }

  async showPermissionAlert(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Permiso de Cámara',
        message: 'Necesitamos acceso a la cámara para escanear códigos QR',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: 'Permitir',
            handler: () => resolve(true)
          }
        ]
      });
      await alert.present();
    });
  }

  async showConfirmation(header: string, message: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: 'Confirmar',
            handler: () => resolve(true)
          }
        ]
      });
      await alert.present();
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showSuccessAlert(header: string, message: string, alertas?: string[]) {
    let fullMessage = message;
    if (alertas && alertas.length > 0) {
      fullMessage += '\n\n' + alertas.join('\n');
    }

    const alert = await this.alertController.create({
      header,
      message: fullMessage,
      buttons: ['OK'],
      cssClass: 'success-alert'
    });
    await alert.present();
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success', duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'top',
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  getEstadoPagoColor(): string {
    if (!this.personaInfo) return 'medium';
    return this.personaInfo.estadoPago.permiteIngreso ? 'success' : 'warning';
  }

  getEstadoPagoIcon(): string {
    if (!this.personaInfo) return 'alert-circle';
    return this.personaInfo.estadoPago.permiteIngreso ? 'checkmark-circle' : 'warning-outline';
  }
}
