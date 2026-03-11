import { CommonModule } from '@angular/common';
import { Component, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TiltDirective } from '../../shared/directives/tilt.directive';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  image: string;
  popular?: boolean;
  basePrice: number;
}

interface Process {
  step: number;
  title: string;
  description: string;
  icon: string;
}

interface Addon {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: string;
  basePrice: number;
}

interface ServiceTestimonial {
  service: string;
  text: string;
  author: string;
  event: string;
  rating: number;
}

interface ChatMessage {
  text: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

interface ServiceInquiry {
  name: string;
  phone: string;
  email: string;
  eventDate: string;
  budget: string;
  message: string;
  selectedServices: string[];
}

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, RouterLink, TiltDirective, RevealDirective, FormsModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss',
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-30px)', height: 0, overflow: 'hidden' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)', height: '*' })
        )
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 1, 1)',
          style({ opacity: 0, transform: 'translateY(-20px)', height: 0 })
        )
      ])
    ])
  ]
})
export class ServiciosComponent implements AfterViewInit {
  @ViewChild('chatbotMessages') chatbotMessages!: ElementRef;
  @ViewChild('chatInputElement') chatInputElement!: ElementRef;

  // Servicios principales con información detallada
  services: Service[] = [
    {
      id: 'catering',
      icon: '🍽️',
      title: 'Catering Gourmet',
      description: 'Menús personalizados diseñados por chefs expertos con ingredientes premium seleccionados.',
      features: [
        'Menús personalizados a tu gusto',
        'Degustación previa incluida',
        'Opciones vegetarianas y veganas',
        'Cocina en vivo disponible',
        'Bebidas y coctelería premium',
        'Servicio de mesa profesional'
      ],
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200',
      popular: true,
      basePrice: 2500
    },
    {
      id: 'decoracion',
      icon: '🎨',
      title: 'Decoración & Diseño',
      description: 'Conceptos creativos únicos que transforman espacios en experiencias memorables.',
      features: [
        'Diseño conceptual personalizado',
        'Arreglos florales premium',
        'Iluminación arquitectónica',
        'Mobiliario de lujo',
        'Textiles y mantelería fina',
        'Montaje y desmontaje incluido'
      ],
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?q=80&w=1200',
      basePrice: 1800
    },
    {
      id: 'logistica',
      icon: '⚡',
      title: 'Logística Integral',
      description: 'Coordinación completa para que no te preocupes por ningún detalle del evento.',
      features: [
        'Coordinación general del evento',
        'Personal capacitado',
        'Gestión de proveedores',
        'Timeline detallado',
        'Atención de emergencias',
        'Seguimiento post-evento'
      ],
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200',
      basePrice: 1200
    },
    {
      id: 'entretenimiento',
      icon: '🎭',
      title: 'Entretenimiento',
      description: 'Shows en vivo, música y animación para hacer tu evento inolvidable.',
      features: [
        'DJ y bandas en vivo',
        'Shows y performances',
        'Animación infantil',
        'Photo booth personalizado',
        'Video mapping',
        'Pirotecnia y efectos especiales'
      ],
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200',
      basePrice: 1500
    },
    {
      id: 'tecnologia',
      icon: '📱',
      title: 'Tecnología & AV',
      description: 'Equipos audiovisuales de última generación para presentaciones impactantes.',
      features: [
        'Pantallas LED gigantes',
        'Sistema de sonido profesional',
        'Proyecciones y mapping',
        'Streaming en vivo',
        'Grabación profesional',
        'Apps de evento personalizadas'
      ],
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200',
      basePrice: 2000
    },
    {
      id: 'transporte',
      icon: '🚗',
      title: 'Transporte VIP',
      description: 'Traslados cómodos y seguros para tus invitados con vehículos de lujo.',
      features: [
        'Vehículos de lujo',
        'Choferes profesionales',
        'Rutas planificadas',
        'Shuttle para invitados',
        'Valet parking',
        'Coordinación de llegadas'
      ],
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1200',
      basePrice: 800
    }
  ];

  // Proceso de trabajo
  process: Process[] = [
    {
      step: 1,
      title: 'Consulta Inicial',
      description: 'Conversamos sobre tu visión, necesidades y presupuesto',
      icon: '💬'
    },
    {
      step: 2,
      title: 'Propuesta Personalizada',
      description: 'Diseñamos un plan detallado con opciones y cotización',
      icon: '📋'
    },
    {
      step: 3,
      title: 'Planificación',
      description: 'Coordinamos cada detalle y confirmamos proveedores',
      icon: '📅'
    },
    {
      step: 4,
      title: 'Ejecución Perfecta',
      description: 'Realizamos tu evento sin contratiempos ni estrés',
      icon: '✨'
    }
  ];

  // Servicios adicionales
  addons: Addon[] = [
    { id: 'invitaciones', name: 'Invitaciones Digitales', description: 'Diseños animados personalizados', icon: '💌', price: 'Desde $150', basePrice: 150 },
    { id: 'recuerdos', name: 'Recuerdos Personalizados', description: 'Souvenirs únicos para invitados', icon: '🎁', price: 'Desde $5/u', basePrice: 5 },
    { id: 'maquillaje', name: 'Maquillaje & Peinado', description: 'Estilistas profesionales', icon: '💄', price: 'Desde $80', basePrice: 80 },
    { id: 'fotografia', name: 'Fotografía & Video', description: 'Cobertura completa HD/4K', icon: '📸', price: 'Desde $800', basePrice: 800 },
    { id: 'torta', name: 'Torta Personalizada', description: 'Diseños exclusivos a medida', icon: '🎂', price: 'Desde $200', basePrice: 200 },
    { id: 'bar', name: 'Bar de Cocteles', description: 'Mixólogos profesionales', icon: '🍸', price: 'Desde $500', basePrice: 500 }
  ];

  // Testimonios de servicios
  serviceTestimonials: ServiceTestimonial[] = [
    {
      service: 'Catering Gourmet',
      text: 'La comida fue el punto destacado de nuestra boda. Cada plato era una obra de arte y el sabor era increíble.',
      author: 'María González',
      event: 'Boda',
      rating: 5
    },
    {
      service: 'Decoración & Diseño',
      text: 'Transformaron completamente el espacio. Nuestros invitados no podían creer lo hermoso que quedó todo.',
      author: 'Carlos Ramírez',
      event: 'Aniversario',
      rating: 5
    },
    {
      service: 'Logística Integral',
      text: 'No tuve que preocuparme por nada. Todo fluyó perfectamente gracias a su coordinación impecable.',
      author: 'Ana Martínez',
      event: 'Evento Corporativo',
      rating: 5
    }
  ];

  selectedService = signal<string | null>(null);
  hoveredCard = signal<string | null>(null);
  selectedServices = signal<string[]>([]);
  selectedAddons = signal<string[]>([]);

  // Chatbot
  chatbotOpen = signal(false);
  chatMessages: ChatMessage[] = [];
  chatInput = '';
  isOnline = true;

  // Modal
  showContactModal = signal(false);
  serviceInquiry: ServiceInquiry = {
    name: '',
    phone: '',
    email: '',
    eventDate: '',
    budget: '',
    message: '',
    selectedServices: []
  };

  ngAfterViewInit(): void {
    this.scrollChatToBottom();
  }

  // Métodos de selección de servicios
  selectService(serviceId: string) {
    this.selectedService.set(
      this.selectedService() === serviceId ? null : serviceId
    );
  }

  getSelectedServiceData() {
    return this.services.find(s => s.id === this.selectedService());
  }

  onCardHover(serviceId: string | null) {
    this.hoveredCard.set(serviceId);
  }

  // Calculadora de servicios
  isServiceSelected(serviceId: string): boolean {
    return this.selectedServices().includes(serviceId);
  }

  toggleServiceSelection(serviceId: string) {
    const current = this.selectedServices();
    if (current.includes(serviceId)) {
      this.selectedServices.set(current.filter(id => id !== serviceId));
    } else {
      this.selectedServices.set([...current, serviceId]);
    }
  }

  getServicePrice(serviceId: string): number {
    const service = this.services.find(s => s.id === serviceId);
    return service?.basePrice || 0;
  }

  getSelectedServices() {
    return this.services.filter(s => this.selectedServices().includes(s.id));
  }

  getTotalPrice(): number {
    const servicesTotal = this.getSelectedServices().reduce((total, service) => total + service.basePrice, 0);
    const addonsTotal = this.addons
      .filter(a => this.selectedAddons().includes(a.id))
      .reduce((total, addon) => total + addon.basePrice, 0);

    return servicesTotal + addonsTotal;
  }

  getPriceBreakdown() {
    const services = this.getSelectedServices().map(service => ({
      name: service.title,
      price: service.basePrice
    }));

    const addons = this.addons
      .filter(a => this.selectedAddons().includes(a.id))
      .map(addon => ({
        name: addon.name,
        price: addon.basePrice
      }));

    return [...services, ...addons];
  }

  addToCalculator(serviceId: string) {
    if (!this.selectedServices().includes(serviceId)) {
      this.selectedServices.set([...this.selectedServices(), serviceId]);
    }
    this.selectedService.set(null); // Cerrar panel de detalles
  }

  addAddonToCalculator(addon: Addon) {
    if (!this.selectedAddons().includes(addon.id)) {
      this.selectedAddons.set([...this.selectedAddons(), addon.id]);
    }
  }

  saveCalculatorEstimate() {
    const estimate = {
      services: this.getSelectedServices(),
      addons: this.addons.filter(a => this.selectedAddons().includes(a.id)),
      total: this.getTotalPrice(),
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('servicesEstimate', JSON.stringify(estimate));
    this.addChatMessage('¡He guardado tu cotización! 💾 Puedes recuperarla en cualquier momento.', 'bot');

    if (!this.chatbotOpen()) {
      this.toggleChatbot();
    }
  }

  // Proceso interactivo
  startWithService(serviceId: string) {
    this.selectService(serviceId);
    this.addToCalculator(serviceId);
    setTimeout(() => {
      document.querySelector('.services-calculator')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }

  // Chatbot methods
  toggleChatbot() {
    this.chatbotOpen.update(val => !val);
    if (this.chatbotOpen() && this.chatMessages.length === 0) {
      this.addChatMessage(
        '¡Hola! Soy tu asistente especializado en servicios de eventos. ¿En qué servicio estás interesado o necesitas ayuda para armar tu paquete ideal? 🎉',
        'bot'
      );
    }

    if (this.chatbotOpen()) {
      setTimeout(() => {
        this.chatInputElement.nativeElement.focus();
      }, 300);
    }
  }

  addChatMessage(text: string, type: 'user' | 'bot') {
    this.chatMessages.push({ text, type, timestamp: new Date() });
    this.scrollChatToBottom();
  }

  scrollChatToBottom() {
    setTimeout(() => {
      if (this.chatbotMessages) {
        this.chatbotMessages.nativeElement.scrollTop = this.chatbotMessages.nativeElement.scrollHeight;
      }
    }, 100);
  }

  sendChatMessage() {
    if (!this.chatInput.trim()) return;

    this.addChatMessage(this.chatInput, 'user');
    const userMessage = this.chatInput.toLowerCase();
    this.chatInput = '';

    // Simular typing y respuesta
    setTimeout(() => {
      let response = '';
      if (userMessage.includes('catering') || userMessage.includes('comida')) {
        response = '🍽️ Nuestro servicio de catering gourmet incluye menús personalizados, degustación previa y opciones para todas las dietas. Precios desde $2,500 USD. ¿Te interesa conocer más detalles?';
      } else if (userMessage.includes('decoración') || userMessage.includes('decoracion')) {
        response = '🎨 La decoración premium incluye diseño conceptual, arreglos florales, iluminación y mobiliario. Creamos ambientes únicos desde $1,800 USD. ¿Tienes algún estilo en mente?';
      } else if (userMessage.includes('precio') || userMessage.includes('costo')) {
        response = '💰 Los precios varían según el servicio:\n\n• Catering: $2,500+\n• Decoración: $1,800+\n• Logística: $1,200+\n• Entretenimiento: $1,500+\n\n¿Qué servicio te interesa más?';
      } else if (userMessage.includes('paquete') || userMessage.includes('combo')) {
        response = '📦 Los paquetes combinados tienen descuentos especiales. Por ejemplo:\nCatering + Decoración: 15% off\nServicio completo: 25% off\n\n¿Quieres que te arme una propuesta?';
      } else {
        response = 'Puedo ayudarte con información sobre:\n\n🍽️ Catering gourmet\n🎨 Decoración premium\n⚡ Logística integral\n🎭 Entretenimiento\n📱 Tecnología & AV\n🚗 Transporte VIP\n\n¿Por cuál servicio quieres empezar?';
      }
      this.addChatMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
  }

  quickAction(action: string) {
    switch (action) {
      case 'precios':
        this.chatInput = 'Quiero conocer precios de todos los servicios';
        break;
      case 'catering':
        this.chatInput = 'Información sobre el servicio de catering';
        break;
      case 'paquetes':
        this.chatInput = 'Ver opciones de paquetes combinados';
        break;
    }
    this.sendChatMessage();
  }

  // Modal methods
  openContactModal() {
    this.serviceInquiry.selectedServices = this.selectedServices();
    this.showContactModal.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeContactModal() {
    this.showContactModal.set(false);
    document.body.style.overflow = '';
  }

  getSelectedServicesForModal() {
    return this.services.filter(s => this.serviceInquiry.selectedServices.includes(s.id));
  }

  removeServiceFromModal(serviceId: string) {
    this.serviceInquiry.selectedServices = this.serviceInquiry.selectedServices.filter(id => id !== serviceId);
  }

  openContactWithEstimate() {
    this.serviceInquiry.selectedServices = this.selectedServices();
    this.openContactModal();
  }

  submitServiceInquiry() {
    // Aquí iría la lógica para enviar el formulario
    console.log('Service inquiry:', this.serviceInquiry);

    // Simular envío exitoso
    this.closeContactModal();
    this.addChatMessage('¡He recibido tu solicitud de cotización! 📩 Te contactaremos dentro de 24 horas con una propuesta detallada.', 'bot');

    if (!this.chatbotOpen()) {
      this.toggleChatbot();
    }
  }
}
