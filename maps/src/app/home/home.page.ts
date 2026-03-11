import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { GoogleMap } from '@capacitor/google-maps';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})

export class HomePage implements AfterViewInit {
  @ViewChild('map') mapRef?: ElementRef<HTMLElement>;
  private map?: GoogleMap;

  async ngAfterViewInit() {
    if (!this.mapRef) return;

    this.map = await GoogleMap.create({
      id: 'my-map', // identificador único
      element: this.mapRef.nativeElement, // referencia al <capacitor-google-map>
      apiKey: 'AIzaSyD49dmiTD_82REBS8zLOOABXLzv56pBVKk  ', // también se usa para web
      config: {
        center: {
          lat: 6.2442, // Ej: Medellín
          lng: -75.5812,
        },
        zoom: 14,
      },
    });

    // Marcador de ejemplo
    await this.map.addMarker({
      coordinate: {
        lat: 6.2442,
        lng: -75.5812,
      },
      title: 'Marcador de ejemplo',
      snippet: 'Hola mapa 👋',
    });
  }
}
