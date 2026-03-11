import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { ApiService, QrScanResponse } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ScannerPage  {
 scanActive = false;
  currentUser: any;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  async startScanner() {
    const status = await BarcodeScanner.checkPermission({ force: true });

    if (status.granted) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scanActive = false;
        this.processQr(result.content);
      }
    }
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  async processQr(qrToken: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Escaneando QR...'
    });
    await loading.present();

    this.apiService.escanearQr(qrToken).subscribe({
      next: async (response) => {
        await loading.dismiss();
        if (response.success) {
          this.router.navigate(['/scan-result'], {
            state: { scanData: response.data }
          });
        } else {
          this.showToast('Error al escanear QR');
        }
      },
      error: async (error) => {
        await loading.dismiss();
        this.showToast('Error de conexión');
      }
    });
  }

  async manualInput() {
    const alert = await this.alertCtrl.create({
      header: 'Ingresar QR manualmente',
      inputs: [
        {
          name: 'qrToken',
          type: 'text',
          placeholder: 'Código QR'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Escanear',
          handler: (data) => {
            if (data.qrToken) {
              this.processQr(data.qrToken);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Está seguro de que desea cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.authService.logout();
            this.router.navigateByUrl('/login', { replaceUrl: true });
          }
        }
      ]
    });

    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  ionViewWillLeave() {
    this.stopScanner();
  }
}
