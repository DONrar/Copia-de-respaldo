
// packages.component.ts
import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TiltDirective } from '../../shared/directives/tilt.directive';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { trigger, transition, style, animate } from '@angular/animations';

interface Package {
  id: string;
  name: string;
  icon: string;
  pricePerPerson: number;
  color: string;
  gradient: string;
  features: string[];
  popular: boolean;
  description: string;
}

interface QuoteData {
  packageId: string;
  guests: number;
  eventDate: string;
  eventType: string;
  additionalServices: string[];
}
@Component({
  selector: 'app-paquetes',
  standalone: true,
  imports: [CommonModule, FormsModule, TiltDirective, RevealDirective],
  templateUrl: './paquetes.component.html',
  styleUrl: './paquetes.component.scss'
})
export class PaquetesComponent implements OnInit {
  selectedPackage = signal<string | null>(null);
  viewMode = signal<'grid' | 'compare'>('grid');
  showQuote = signal(false);
  quoteSaved = signal(false);

  minDate = new Date().toISOString().split('T')[0];

  packages: Package[] = [
    {
      id: 'esencial',
      name: 'Esencial',
      icon: '👥',
      pricePerPerson: 45,
      color: '#4facfe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: 'Perfecto para eventos íntimos y elegantes',
      features: [
        'Buffet estándar (3 tiempos)',
        'Decoración base elegante',
        'Coordinación del día',
        'Meseros profesionales',
        'Mantelería premium',
        'Centro de mesa básico',
        'Montaje y desmontaje',
        'Vajilla y cubertería'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: '⭐',
      pricePerPerson: 75,
      color: '#f093fb',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: 'La opción favorita para eventos memorables',
      features: [
        'Menú personalizado (5 tiempos)',
        'Decoración temática completa',
        'Staff completo (meseros + capitán)',
        'Barra libre 4 horas',
        'Iluminación ambiental LED',
        'Photobooth profesional',
        'Coordinador de eventos dedicado',
        'Mantelería y vajilla premium',
        'Música ambiental',
        'Menú infantil disponible'
      ],
      popular: true
    },
    {
      id: 'signature',
      name: 'Signature',
      icon: '✨',
      pricePerPerson: 120,
      color: '#f6d365',
      gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      description: 'La experiencia definitiva en eventos de lujo',
      features: [
        'Chef invitado en vivo',
        'Diseño integral personalizado',
        'Música en vivo y DJ profesional',
        'Barra premium ilimitada',
        'Montaje escenográfico único',
        'Fotografía y video 4K',
        'Menú degustación (7 tiempos)',
        'Coordinación VIP completa',
        'Valet parking incluido',
        'Recuerdos personalizados',
        'Sommelier profesional',
        'Show de fuegos artificiales'
      ],
      popular: false
    }
  ];

  quoteData: QuoteData = {
    packageId: '',
    guests: 100,
    eventDate: '',
    eventType: 'wedding',
    additionalServices: []
  };

  additionalServices = [
    { id: 'cocktail', name: 'Cóctel de bienvenida', icon: '🍸', price: 8 },
    { id: 'liveMusic', name: 'Música en vivo', icon: '🎵', price: 15 },
    { id: 'photoVideo', name: 'Foto y video profesional', icon: '📸', price: 20 },
    { id: 'fireworks', name: 'Show de fuegos artificiales', icon: '🎆', price: 12 },
    { id: 'flowers', name: 'Arreglos florales premium', icon: '💐', price: 10 },
    { id: 'valet', name: 'Servicio de valet parking', icon: '🚗', price: 5 }
  ];

  // Computed values
  selectedPackageName = computed(() => {
    const pkg = this.packages.find(p => p.id === this.selectedPackage());
    return pkg?.name || '';
  });

  selectedPackageGradient = computed(() => {
    const pkg = this.packages.find(p => p.id === this.selectedPackage());
    return pkg?.gradient || '';
  });

  basePrice = computed(() => {
    const pkg = this.packages.find(p => p.id === this.selectedPackage());
    return pkg ? pkg.pricePerPerson * this.quoteData.guests : 0;
  });

  guestsPrice = computed(() => this.basePrice());

  additionalServicesPrice = computed(() => {
    return this.quoteData.additionalServices.reduce((total, serviceId) => {
      const service = this.additionalServices.find(s => s.id === serviceId);
      return total + (service ? service.price * this.quoteData.guests : 0);
    }, 0);
  });

  subtotal = computed(() => this.basePrice() + this.additionalServicesPrice());

  taxes = computed(() => Math.round(this.subtotal() * 0.19));

  totalPrice = computed(() => this.subtotal() + this.taxes());

  allFeatures = [
    'Buffet estándar (3 tiempos)',
    'Menú personalizado (5 tiempos)',
    'Menú degustación (7 tiempos)',
    'Decoración base elegante',
    'Decoración temática completa',
    'Diseño integral personalizado',
    'Coordinación del día',
    'Coordinador de eventos dedicado',
    'Coordinación VIP completa',
    'Meseros profesionales',
    'Staff completo (meseros + capitán)',
    'Barra libre 4 horas',
    'Barra premium ilimitada',
    'Iluminación ambiental LED',
    'Montaje escenográfico único',
    'Photobooth profesional',
    'Fotografía y video 4K',
    'Chef invitado en vivo',
    'Música en vivo y DJ profesional',
    'Valet parking incluido',
    'Recuerdos personalizados',
    'Sommelier profesional'
  ];

  ngOnInit(): void {
    // Cargar cotización guardada si existe
    const savedQuote = localStorage.getItem('savedPackageQuote');
    if (savedQuote) {
      const parsed = JSON.parse(savedQuote);
      this.quoteData = parsed.quoteData;
      this.selectedPackage.set(parsed.packageId);
      this.showQuote.set(true);
    }
  }

  selectPackage(id: string): void {
    this.selectedPackage.set(id);
    this.quoteData.packageId = id;
    this.showQuote.set(true);
    this.quoteSaved.set(false);

    // Smooth scroll to quote section
    setTimeout(() => {
      const quoteSection = document.querySelector('.quote-section');
      quoteSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  toggleService(serviceId: string): void {
    const index = this.quoteData.additionalServices.indexOf(serviceId);
    if (index > -1) {
      this.quoteData.additionalServices.splice(index, 1);
    } else {
      this.quoteData.additionalServices.push(serviceId);
    }
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.quoteSaved.set(false);
  }

  saveQuote(): void {
    const pkg = this.packages.find(p => p.id === this.selectedPackage());
    const quoteToSave = {
      packageId: this.selectedPackage(),
      packageName: pkg?.name,
      quoteData: this.quoteData,
      pricing: {
        base: this.basePrice(),
        additional: this.additionalServicesPrice(),
        subtotal: this.subtotal(),
        taxes: this.taxes(),
        total: this.totalPrice()
      },
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('savedPackageQuote', JSON.stringify(quoteToSave));
    this.quoteSaved.set(true);

    setTimeout(() => {
      this.quoteSaved.set(false);
    }, 3000);
  }

  sendToWhatsApp(): void {
    const pkg = this.packages.find(p => p.id === this.selectedPackage());
    if (!pkg) return;

    const services = this.quoteData.additionalServices
      .map(id => this.additionalServices.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const message = `🎉 *Cotización de Evento - Paquete ${pkg.name}*\n\n` +
      `📅 *Detalles del Evento:*\n` +
      `• Tipo: ${this.getEventTypeName()}\n` +
      `• Fecha: ${this.quoteData.eventDate || 'Por definir'}\n` +
      `• Invitados: ${this.quoteData.guests}\n\n` +
      `💰 *Resumen Financiero:*\n` +
      `• Paquete base: $${this.basePrice().toLocaleString()}\n` +
      `• Servicios adicionales: $${this.additionalServicesPrice().toLocaleString()}\n` +
      `• Subtotal: $${this.subtotal().toLocaleString()}\n` +
      `• Impuestos (19%): $${this.taxes().toLocaleString()}\n` +
      `• *Total: $${this.totalPrice().toLocaleString()}*\n\n` +
      `${services ? `✨ *Servicios adicionales:* ${services}\n\n` : ''}` +
      `Me gustaría recibir más información sobre este paquete.`;

    const phone = '573235162298';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  sendToEmail(): void {
    const pkg = this.packages.find(p => p.id === this.selectedPackage());
    if (!pkg) return;

    const subject = `Cotización ${pkg.name} - ${this.getEventTypeName()}`;
    const body = `Cotización de Evento - Paquete ${pkg.name}\n\n` +
      `Detalles del Evento:\n` +
      `Tipo: ${this.getEventTypeName()}\n` +
      `Fecha: ${this.quoteData.eventDate || 'Por definir'}\n` +
      `Invitados: ${this.quoteData.guests}\n\n` +
      `Resumen Financiero:\n` +
      `Paquete base: $${this.basePrice().toLocaleString()}\n` +
      `Servicios adicionales: $${this.additionalServicesPrice().toLocaleString()}\n` +
      `Subtotal: $${this.subtotal().toLocaleString()}\n` +
      `Impuestos (19%): $${this.taxes().toLocaleString()}\n` +
      `Total: $${this.totalPrice().toLocaleString()}\n\n` +
      `Me gustaría recibir más información.\n\nSaludos.`;

    const email = 'eventos@tuempresa.com';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  }

  contactAdvisor(): void {
    const message = '¡Hola! Estoy interesado en crear un evento personalizado. ¿Podrían ayudarme?';
    const phone = '573235162298';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  private getEventTypeName(): string {
    const types: { [key: string]: string } = {
      wedding: 'Boda',
      corporate: 'Evento Corporativo',
      birthday: 'Cumpleaños',
      quinceanera: 'Quinceañera',
      babyShower: 'Baby Shower',
      graduation: 'Graduación',
      other: 'Otro'
    };
    return types[this.quoteData.eventType] || 'Evento';
  }
}
