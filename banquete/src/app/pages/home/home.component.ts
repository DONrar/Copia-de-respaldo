import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TiltDirective } from '../../shared/directives/tilt.directive';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

interface Stat {
  value: string;
  label: string;
  icon: string;
}

interface Testimonial {
  name: string;
  event: string;
  text: string;
  rating: number;
  image: string;
}

interface SocialPost {
  image: string;
  caption: string;
  likes: string;
  comments: string;
  platform: string;
}

interface UpcomingEvent {
  date: string;
  name: string;
  location: string;
  type: string;
}

interface EventMarker {
  x: number;
  y: number;
  event: string;
  date: string;
  type: string;
  icon: string;
}

interface ChatMessage {
  text: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, TiltDirective, RevealDirective, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
  trigger('modalAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.9)' }),
      animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
    ])
  ])
]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('chatbotMessages') chatbotMessages!: ElementRef;
  @ViewChild('chatInputElement') chatInputElement!: ElementRef;

  // Estadísticas animadas
  stats: Stat[] = [
    { value: '500+', label: 'Eventos realizados', icon: '🎉' },
    { value: '98%', label: 'Clientes satisfechos', icon: '⭐' },
    { value: '15+', label: 'Años de experiencia', icon: '🏆' },
    { value: '24/7', label: 'Atención personalizada', icon: '💬' }
  ];

  // Testimonios
  testimonials: Testimonial[] = [
    {
      name: 'María González',
      event: 'Boda',
      text: 'Superaron todas nuestras expectativas. La atención al detalle fue impecable.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    {
      name: 'Carlos Ramírez',
      event: 'Evento Corporativo',
      text: 'Profesionalismo y creatividad en cada aspecto. Nuestros invitados quedaron fascinados.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    },
    {
      name: 'Ana Martínez',
      event: 'Quinceañera',
      text: 'Hicieron realidad el sueño de mi hija. Todo fue mágico y memorable.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    }
  ];

  currentTestimonial = signal(0);

  // Formulario de contacto rápido
  quickContact = {
    name: '',
    phone: '',
    email: '',
    eventType: '',
    date: '',
    guests: '',
    budget: '',
    message: ''
  };

  showContactModal = signal(false);
  formSubmitted = signal(false);
  isSubmitting = false;
  minDate = new Date().toISOString().split('T')[0];

  // Galería interactiva
  galleryImages = [
    { url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200', alt: 'Boda elegante', category: 'Bodas' },
    { url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200', alt: 'Evento corporativo', category: 'Empresarial' },
    { url: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?q=80&w=1200', alt: 'Cumpleaños', category: 'Celebraciones' },
    { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200', alt: 'Decoración temática', category: 'Temáticos' },
    { url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=1200', alt: 'Banquete gourmet', category: 'Gastronomía' },
    { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200', alt: 'Mesa premium', category: 'Premium' }
  ];

  selectedCategory = signal('Todos');
  categories = ['Todos', 'Bodas', 'Empresarial', 'Celebraciones', 'Temáticos', 'Gastronomía', 'Premium'];

  // Chatbot
  chatbotOpen = signal(false);
  chatMessages: ChatMessage[] = [];
  chatInput = '';
  isOnline = true;

  // Calculadora
  calculator = {
    eventType: 'wedding',
    guests: 100,
    catering: true,
    decoration: true,
    entertainment: false,
    photography: false
  };

  calculatedPrice = signal(0);
  priceBreakdown = signal<any[]>([]);

  // Social Proof
  socialPosts: SocialPost[] = [
    {
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400',
      caption: 'Decoración temática para boda de ensueño ✨',
      likes: '2.4K',
      comments: '128',
      platform: 'Instagram'
    },
    {
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=400',
      caption: 'Evento corporativo exitoso 🏢',
      likes: '1.8K',
      comments: '89',
      platform: 'Instagram'
    },
    {
      image: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?q=80&w=400',
      caption: 'Celebración de cumpleaños mágica 🎂',
      likes: '3.2K',
      comments: '256',
      platform: 'TikTok'
    },
    {
      image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=400',
      caption: 'Banquete gourmet que encantó a todos 🍽️',
      likes: '4.1K',
      comments: '312',
      platform: 'Instagram'
    }
  ];

  // Mapa de eventos
  upcomingEvents: UpcomingEvent[] = [
    {
      date: '15 Dic 2024',
      name: 'Boda María & Carlos',
      location: 'Hacienda San José',
      type: 'Boda'
    },
    {
      date: '20 Dic 2024',
      name: 'Fiesta Navideña Corporativa',
      location: 'Centro de Convenciones',
      type: 'Corporativo'
    },
    {
      date: '05 Ene 2025',
      name: 'Quinceañera Sofia',
      location: 'Salón Diamante',
      type: 'Quinceañera'
    },
    {
      date: '12 Ene 2025',
      name: 'Lanzamiento de Producto Tech',
      location: 'Hotel Grand',
      type: 'Corporativo'
    }
  ];

  eventMarkers: EventMarker[] = [
    { x: 30, y: 40, event: 'Boda Premium', date: '15 Dic', type: 'wedding', icon: '💍' },
    { x: 60, y: 70, event: 'Evento Corporativo', date: '20 Dic', type: 'corporate', icon: '🏢' },
    { x: 45, y: 25, event: 'Quinceañera', date: '05 Ene', type: 'quince', icon: '👑' },
    { x: 75, y: 55, event: 'Fiesta Empresarial', date: '12 Ene', type: 'corporate', icon: '🎯' }
  ];

  ngOnInit(): void {
    // Rotar testimonios automáticamente
    setInterval(() => {
      this.currentTestimonial.update(val => (val + 1) % this.testimonials.length);
    }, 5000);

    // Inicializar calculadora
    this.updateCalculation();

    // Cargar estimate guardado
    const savedEstimate = localStorage.getItem('eventEstimate');
    if (savedEstimate) {
      const estimate = JSON.parse(savedEstimate);
      this.calculator = { ...this.calculator, ...estimate };
      this.updateCalculation();
    }
  }

  ngAfterViewInit(): void {
    this.scrollChatToBottom();
  }

  // Métodos de galería
  get filteredGallery() {
    if (this.selectedCategory() === 'Todos') return this.galleryImages;
    return this.galleryImages.filter(img => img.category === this.selectedCategory());
  }

  // Métodos de testimonios
  nextTestimonial() {
    this.currentTestimonial.update(val => (val + 1) % this.testimonials.length);
  }

  prevTestimonial() {
    this.currentTestimonial.update(val => val === 0 ? this.testimonials.length - 1 : val - 1);
  }

  // Métodos de modal
  openContactModal() {
    this.showContactModal.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeContactModal() {
    this.showContactModal.set(false);
    this.formSubmitted.set(false);
    document.body.style.overflow = '';
  }

  // Chatbot methods
  toggleChatbot() {
    this.chatbotOpen.update(val => !val);
    if (this.chatbotOpen() && this.chatMessages.length === 0) {
      this.addChatMessage(
        '¡Hola! Soy tu asistente virtual de eventos. ¿En qué tipo de evento estás interesado? Puedo ayudarte con cotizaciones, disponibilidad y más! 💫',
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

    // Simular typing
    setTimeout(() => {
      let response = '';
      if (userMessage.includes('hola') || userMessage.includes('holi') || userMessage.includes('buenas')) {
        response = '¡Hola! 😊 Estoy aquí para ayudarte a planificar el evento perfecto. ¿Es para una boda, evento corporativo o celebración especial?';
      } else if (userMessage.includes('boda')) {
        response = '¡Las bodas son nuestra especialidad! 💍 Tenemos paquetes desde $2,500 USD. ¿Te gustaría que te envíe más información sobre nuestras opciones para bodas?';
      } else if (userMessage.includes('precio') || userMessage.includes('costo') || userMessage.includes('cuánto')) {
        response = 'Los precios varían según el tipo de evento y servicios. Nuestros paquetes inician en:\n\n• Bodas: $2,500 - $10,000+ USD\n• Corporativos: $1,500 - $5,000 USD\n• Celebraciones: $1,000 - $3,000 USD\n\n¿Qué tipo de evento tienes en mente? 💰';
      } else if (userMessage.includes('disponibilidad') || userMessage.includes('fecha')) {
        response = '📅 Tenemos disponibilidad para los próximos 6 meses. ¿Tienes alguna fecha específica en mente? Puedes usar nuestra calculadora en la página para una cotización instantánea.';
      } else if (userMessage.includes('contacto') || userMessage.includes('teléfono') || userMessage.includes('whatsapp')) {
        response = 'Puedes contactarnos:\n\n📞 Teléfono: +57 300 123 4567\n💬 WhatsApp: https://wa.me/573235162298\n📧 Email: eventos@tuempresa.com\n\n¿Prefieres que te contacte un asesor ahora?';
      } else if (userMessage.includes('gracias') || userMessage.includes('thanks')) {
        response = '¡De nada! 😊 Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte para tu evento?';
      } else {
        response = 'Entiendo que estás interesado en nuestros servicios de eventos. ¿Podrías contarme más detalles? Por ejemplo:\n\n• Tipo de evento\n• Fecha aproximada\n• Número de invitados\n• Presupuesto estimado\n\n¡Con esta información puedo ayudarte mejor! 🎉';
      }
      this.addChatMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
  }

  quickAction(action: string) {
    switch (action) {
      case 'precios':
        this.chatInput = 'Quiero conocer precios';
        break;
      case 'disponibilidad':
        this.chatInput = 'Consultar disponibilidad de fechas';
        break;
      case 'contacto':
        this.chatInput = 'Necesito hablar con un asesor';
        break;
    }
    this.sendChatMessage();
  }

  // Calculadora methods
  updateCalculation() {
    let basePrice = 0;

    switch (this.calculator.eventType) {
      case 'wedding': basePrice = 2500; break;
      case 'corporate': basePrice = 1500; break;
      case 'birthday': basePrice = 1000; break;
      case 'quinceanera': basePrice = 2000; break;
      case 'babyShower': basePrice = 800; break;
    }

    const guestCost = this.calculator.guests * 25;
    const cateringCost = this.calculator.catering ? this.calculator.guests * 35 : 0;
    const decorationCost = this.calculator.decoration ? 800 : 0;
    const entertainmentCost = this.calculator.entertainment ? 600 : 0;
    const photographyCost = this.calculator.photography ? 500 : 0;

    const subtotal = basePrice + guestCost + cateringCost + decorationCost + entertainmentCost + photographyCost;
    const tax = subtotal * 0.19; // 19% IVA
    const serviceFee = subtotal * 0.10; // 10% servicio

    const total = subtotal + tax + serviceFee;

    this.calculatedPrice.set(Math.round(total));

    this.priceBreakdown.set([
      { name: 'Paquete base', price: basePrice },
      { name: `Invitados (${this.calculator.guests})`, price: guestCost },
      { name: 'Catering premium', price: cateringCost },
      { name: 'Decoración', price: decorationCost },
      { name: 'Entretenimiento', price: entertainmentCost },
      { name: 'Fotografía', price: photographyCost },
      { name: 'Impuestos (19%)', price: Math.round(tax) },
      { name: 'Servicio (10%)', price: Math.round(serviceFee) }
    ].filter(item => item.price > 0));
  }

  saveEstimate() {
    const estimate = {
      ...this.calculator,
      total: this.calculatedPrice(),
      breakdown: this.priceBreakdown(),
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('eventEstimate', JSON.stringify(estimate));

    // Mostrar notificación
    this.addChatMessage('¡He guardado tu cotización! 💾 Puedes recuperarla en cualquier momento. ¿Te gustaría compartirla por WhatsApp con uno de nuestros asesores?', 'bot');

    if (!this.chatbotOpen()) {
      this.toggleChatbot();
    }
  }

  async submitQuickContact() {
    const { name, phone, email, eventType, date, guests, budget, message } = this.quickContact;

    // Validación básica
    if (!name || !phone || !eventType) {
      alert('Por favor completa al menos nombre, teléfono y tipo de evento');
      return;
    }

    this.isSubmitting = true;

    try {
      // Mensaje para WhatsApp
      const whatsappMsg = `¡Hola! Me interesa cotizar un evento:\n\n` +
        `👤 Nombre: ${name}\n` +
        `📱 Teléfono: ${phone}\n` +
        `📧 Email: ${email || 'No proporcionado'}\n` +
        `🎉 Tipo de evento: ${eventType}\n` +
        `📅 Fecha: ${date || 'Por definir'}\n` +
        `👥 Invitados: ${guests || 'Por definir'}\n` +
        `💰 Presupuesto: ${budget || 'Por definir'}\n` +
        `💬 Mensaje: ${message || 'Sin mensaje adicional'}\n\n` +
        `*Cotización generada desde la web*`;

      const whatsappNumber = '573235162298'; // Reemplaza con tu número
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;

      // Mensaje para Email
      const emailSubject = `Nueva Cotización - ${eventType} - ${name}`;
      const emailBody = `Nueva solicitud de cotización:%0D%0A%0D%0A` +
        `Nombre: ${name}%0D%0A` +
        `Teléfono: ${phone}%0D%0A` +
        `Email: ${email || 'No proporcionado'}%0D%0A` +
        `Tipo de evento: ${eventType}%0D%0A` +
        `Fecha: ${date || 'Por definir'}%0D%0A` +
        `Invitados: ${guests || 'Por definir'}%0D%0A` +
        `Presupuesto: ${budget || 'Por definir'}%0D%0A` +
        `Mensaje: ${message || 'Sin mensaje adicional'}%0D%0A%0D%0A` +
        `Enviado desde la página web.`;

      const emailTo = 'eventos@tuempresa.com'; // Reemplaza con tu email
      const mailtoUrl = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;

      // Abrir WhatsApp
      window.open(whatsappUrl, '_blank');

      // Esperar y abrir email
      setTimeout(() => {
        window.open(mailtoUrl, '_blank');
        this.formSubmitted.set(true);
        this.isSubmitting = false;
      }, 1000);

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      this.isSubmitting = false;
      alert('Error al enviar el formulario. Por favor intenta nuevamente.');
    }
  }

  openWhatsApp() {
    const { name, phone } = this.quickContact;
    const message = `Hola, soy ${name}. Acabo de enviar una solicitud de cotización. Mi teléfono es ${phone}`;
    const whatsappUrl = `https://wa.me/573235162298?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  resetForm() {
    this.quickContact = {
      name: '',
      phone: '',
      email: '',
      eventType: '',
      date: '',
      guests: '',
      budget: '',
      message: ''
    };
    this.formSubmitted.set(false);
  }

  // Efecto parallax en scroll
  onScroll(event: Event) {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    parallaxElements.forEach(el => {
      const speed = 0.5;
      (el as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
    });
  }
}
