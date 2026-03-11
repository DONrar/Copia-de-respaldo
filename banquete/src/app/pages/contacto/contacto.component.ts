import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { TiltDirective } from '../../shared/directives/tilt.directive';
import { trigger, transition, style, animate } from '@angular/animations';

interface ContactMethod {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  value: string;
  color: string;
  gradient: string;
  action: () => void;
}
@Component({
  selector: 'app-contacto',
  imports: [CommonModule, FormsModule, RouterLink, RevealDirective, TiltDirective],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss',
    animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ],
})
export class ContactoComponent {
  @ViewChild('contactForm') contactForm!: ElementRef;

  formSubmitted = signal(false);
  activeFaq = signal<number | null>(null);
  isSubmitting = false;
  minDate = new Date().toISOString().split('T')[0];

  formData = {
    nombre: '',
    email: '',
    telefono: '',
    tipoEvento: '',
    fecha: '',
    invitados: 100,
    mensaje: ''
  };

  stats = [
    { icon: '⚡', value: '< 24h', label: 'Tiempo de respuesta' },
    { icon: '⭐', value: '98%', label: 'Satisfacción' },
    { icon: '🎉', value: '500+', label: 'Eventos realizados' },
    { icon: '👥', value: '24/7', label: 'Soporte disponible' }
  ];

  contactMethods: ContactMethod[] = [
    {
      id: 'whatsapp',
      icon: '💬',
      title: 'WhatsApp',
      subtitle: 'Respuesta inmediata',
      value: '+57 312 4995 913',
      color: '#25D366',
      gradient: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
      action: () => this.openWhatsApp()
    },
    {
      id: 'phone',
      icon: '📞',
      title: 'Teléfono',
      subtitle: 'Llámanos directamente',
      value: '+573235162298',
      color: '#4facfe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      action: () => this.makeCall()
    },
    {
      id: 'email',
      icon: '📧',
      title: 'Email',
      subtitle: 'Envíanos un correo',
      value: 'eventos@tuempresa.com',
      color: '#f093fb',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      action: () => this.openEmail()
    }
  ];

  faqs = [
    {
      question: '¿Cuánto tiempo antes debo reservar?',
      answer: 'Recomendamos reservar con al menos 3-6 meses de anticipación para eventos grandes. Sin embargo, también podemos organizar eventos con menos tiempo según disponibilidad.'
    },
    {
      question: '¿Ofrecen degustación de menú?',
      answer: 'Sí, todos nuestros paquetes Premium y Signature incluyen una degustación previa sin costo. Para el paquete Esencial, la degustación tiene un costo adicional.'
    },
    {
      question: '¿Pueden adaptarse a dietas especiales?',
      answer: 'Absolutamente. Trabajamos con dietas vegetarianas, veganas, sin gluten, kosher y cualquier restricción alimenticia que tus invitados necesiten.'
    },
    {
      question: '¿Qué incluye la coordinación del evento?',
      answer: 'La coordinación incluye planificación completa, gestión de proveedores, timeline del evento, supervisión el día del evento y resolución de cualquier imprevisto.'
    },
    {
      question: '¿Tienen locaciones disponibles?',
      answer: 'Trabajamos con más de 50 locaciones premium en la ciudad. También podemos organizar eventos en la locación de tu preferencia.'
    },
    {
      question: '¿Cuál es su política de cancelación?',
      answer: 'Ofrecemos reembolso del 100% hasta 60 días antes del evento, 50% hasta 30 días antes, y el depósito no es reembolsable con menos de 30 días.'
    }
  ];

  openWhatsApp(): void {
    const phone = '573235162298';
    const message = '¡Hola! Me gustaría información sobre sus servicios de eventos.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  }

  makeCall(): void {
    window.location.href = 'tel:+573235162298';
  }

  openEmail(): void {
    window.location.href = 'camilo_acostahe@fet.edu.co';
  }

  sendViaWhatsApp(): void {
    if (!this.validateForm()) return;

    const message = this.buildMessage();
    const phone = '573235162298';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
    this.formSubmitted.set(true);
  }

  sendViaEmail(): void {
    if (!this.validateForm()) return;

    const subject = `Consulta de evento - ${this.formData.nombre}`;
    const body = this.buildMessage();
    const email = 'camilo_acostahe@fet.edu.co';

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    this.formSubmitted.set(true);
  }

  private validateForm(): boolean {
    if (!this.formData.nombre || !this.formData.email || !this.formData.telefono || !this.formData.mensaje) {
      alert('Por favor completa todos los campos obligatorios');
      return false;
    }
    return true;
  }

  private buildMessage(): string {
    return `🎉 *Nueva Consulta de Evento*\n\n` +
      `👤 *Nombre:* ${this.formData.nombre}\n` +
      `📧 *Email:* ${this.formData.email}\n` +
      `📱 *Teléfono:* ${this.formData.telefono}\n` +
      `${this.formData.tipoEvento ? `🎊 *Tipo de evento:* ${this.formData.tipoEvento}\n` : ''}` +
      `${this.formData.fecha ? `📅 *Fecha:* ${this.formData.fecha}\n` : ''}` +
      `👥 *Invitados:* ${this.formData.invitados}\n\n` +
      `💬 *Mensaje:*\n${this.formData.mensaje}`;
  }

  submitForm(): void {
    this.sendViaWhatsApp();
  }

  resetForm(): void {
    this.formData = {
      nombre: '',
      email: '',
      telefono: '',
      tipoEvento: '',
      fecha: '',
      invitados: 100,
      mensaje: ''
    };
    this.formSubmitted.set(false);
  }

  toggleFaq(index: number): void {
    this.activeFaq.set(this.activeFaq() === index ? null : index);
  }
}
