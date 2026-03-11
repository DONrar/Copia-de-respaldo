import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSpinner,
  IonText,
  IonIcon,
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, personOutline, shieldCheckmark, alertCircleOutline, flashOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner,
    IonText,
    IonIcon
  ]
})
export class LoginPage {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);

  credentials = {
    username: '',
    password: ''
  };

  loading = false;
  errorMessage = '';

  constructor() {
    addIcons({shieldCheckmark,personOutline,lockClosedOutline,alertCircleOutline,flashOutline});
    this.checkIfAlreadyAuthenticated();
  }

  async checkIfAlreadyAuthenticated() {
    const isAuth = await this.apiService.isAuthenticated();
    if (isAuth) {
      this.router.navigate(['/home'], { replaceUrl: true });
    }
  }

  async login() {
    // Validación básica
    if (!this.credentials.username || !this.credentials.password) {
      await this.showAlert('Error', 'Por favor ingrese usuario y contraseña');
      return;
    }

    // Mostrar loading
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    this.loading = true;
    this.errorMessage = '';

    // Realizar login
    this.apiService.login(
      this.credentials.username,
      this.credentials.password
    ).subscribe({
      next: async (response) => {
        this.loading = false;
        await loading.dismiss();

        console.log('Login exitoso:', response);

        // Mostrar mensaje de bienvenida
        await this.showSuccessAlert(
          'Bienvenido',
          `Hola ${response.nombreCompleto}`
        );

        // Navegar al home
        this.router.navigate(['/home'], { replaceUrl: true });
      },
      error: async (error) => {
        this.loading = false;
        await loading.dismiss();

        this.errorMessage = error.message || 'Usuario o contraseña incorrectos';

        await this.showAlert(
          'Error de Autenticación',
          this.errorMessage
        );
      }
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }

  async showSuccessAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Continuar'],
      cssClass: 'success-alert'
    });
    await alert.present();
  }

  // Método para llenar credenciales de prueba (solo desarrollo)
  fillTestCredentials() {
    this.credentials.username = 'guarda1';
    this.credentials.password = 'guarda123';
  }
}
