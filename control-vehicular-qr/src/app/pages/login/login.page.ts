import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth-service';
import { IonHeader, IonToolbar, IonInput, IonItem, IonLabel, IonCardSubtitle, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonContent, IonTitle, IonButton } from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  imports: [IonButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonHeader, IonToolbar, IonInput, IonItem, IonLabel, CommonModule, ReactiveFormsModule, CommonModule, FormsModule],
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials = {
    username: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...'
    });
    await loading.present();

    this.authService.login(this.credentials).subscribe({
      next: async (success) => {
        await loading.dismiss();
        if (success) {
          this.router.navigateByUrl('/scanner', { replaceUrl: true });
        } else {
          this.showToast('Credenciales incorrectas');
        }
      },
      error: async (error) => {
        await loading.dismiss();
        this.showToast('Error de conexión');
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
