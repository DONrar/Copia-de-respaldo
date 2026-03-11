// contacto.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButton, IonAccordionGroup, IonAccordion, IonItem,
  IonLabel, IonList
} from '@ionic/angular/standalone';

// Íconos de Ionicons
import { addIcons } from 'ionicons';
import {
  timeOutline, calendarOutline, alarmOutline, locationOutline,
  navigateOutline, logoWhatsapp, callOutline, businessOutline,
  todayOutline, star, checkmarkCircle, closeCircle,
  chevronDown, time
} from 'ionicons/icons';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, IonAccordionGroup, IonAccordion, IonItem,
    IonLabel, IonList
  ],
  standalone: true,
})
export class ContactoComponent {

  constructor() {
    addIcons({
      timeOutline, calendarOutline, alarmOutline, locationOutline,
      navigateOutline, logoWhatsapp, callOutline, businessOutline,
      todayOutline, star, checkmarkCircle, closeCircle,
      chevronDown, time
    });
  }

  telefono = '3203316548';
  direccion = 'La Ulloa-Rivera, Huila';
  whatsappLink = `https://wa.me/57${this.telefono}`;
  googleMapsLink = 'https://maps.app.goo.gl/LQNgedZivZ6UMyuFA';

  horariosPorDia: { [key: number]: { apertura: string, cierre: string } | null } = {
    0: { apertura: '16:00', cierre: '23:00' }, // Domingo
    1: null,                                   // Lunes (cerrado)
    2: { apertura: '17:00', cierre: '22:00' }, // Martes
    3: { apertura: '17:00', cierre: '22:00' }, // Miércoles
    4: { apertura: '17:00', cierre: '22:00' }, // Jueves
    5: { apertura: '17:00', cierre: '22:00' }, // Viernes
    6: { apertura: '16:00', cierre: '23:00' }, // Sábado
  };

  diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  get estadoActual(): { abierto: boolean, mensaje: string } {
    const ahora = new Date();
    const dia = ahora.getDay();
    const horario = this.horariosPorDia[dia];

    if (!horario) {
      return { abierto: false, mensaje: 'Cerrado hoy' };
    }

    const [aperturaHora, aperturaMin] = horario.apertura.split(':').map(Number);
    const [cierreHora, cierreMin] = horario.cierre.split(':').map(Number);

    const ahoraMinTotales = ahora.getHours() * 60 + ahora.getMinutes();
    const aperturaMinTotales = aperturaHora * 60 + aperturaMin;
    const cierreMinTotales = cierreHora * 60 + cierreMin;

    const abierto = ahoraMinTotales >= aperturaMinTotales && ahoraMinTotales <= cierreMinTotales;

    const mensaje = abierto
      ? `¡Estamos abiertos!`
      : `Cerrado por ahora. Hoy atendemos de ${this.formatoHora(horario.apertura)} a ${this.formatoHora(horario.cierre)}`;

    return { abierto, mensaje };
  }

  get horarioHoy(): { apertura: string, cierre: string } | null {
    const hoy = new Date().getDay();
    return this.horariosPorDia[hoy];
  }

  obtenerNombreDiaHoy(): string {
    return this.diasSemana[new Date().getDay()];
  }

  esHoy(index: number): boolean {
    return index === new Date().getDay();
  }

  obtenerHoraCierreHoy(): string {
    const horario = this.horarioHoy;
    return horario ? this.formatoHora(horario.cierre) : '';
  }

  formatoHora(horaStr: string): string {
    const [hora, min] = horaStr.split(':').map(Number);
    const ampm = hora >= 12 ? 'p.m.' : 'a.m.';
    const hora12 = hora % 12 === 0 ? 12 : hora % 12;
    return `${hora12}:${min.toString().padStart(2, '0')} ${ampm}`;
  }

  formatoTelefono(telefono: string): string {
    return telefono.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
}
