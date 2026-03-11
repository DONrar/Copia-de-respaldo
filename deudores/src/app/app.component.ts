import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StorageService } from './core/storage/storage';
import { PwaPersistenceService } from './core/persistence/pwa-persistence';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private storage = inject(StorageService);
  private persist = inject(PwaPersistenceService);
  private toastCtrl = inject(ToastController);

  async ngOnInit() {
    await this.storage.init();                           // Inicializa IndexedDB
    const granted = await this.persist.request();        // Pide persistencia PWA
    const toast = await this.toastCtrl.create({
      message: granted ? 'Almacenamiento protegido ✅' : 'Almacenamiento estándar ⚠️',
      duration: 1500, position: 'bottom'
    });
    await toast.present();
  }
}
