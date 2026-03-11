import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TiltDirective } from '../../shared/directives/tilt.directive';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { FormsModule } from '@angular/forms';

interface Event {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  location: string;
  image: string;
  guests: number;
  featured?: boolean;
  gallery?: string[];
}

interface Testimonial {
  eventType: string;
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

interface EventService {
  icon: string;
  name: string;
}

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TiltDirective,
    RevealDirective,
    FormsModule
  ],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ]),
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9) translateY(50px)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 1, 1)',
          style({ opacity: 0, transform: 'scale(0.9) translateY(20px)' }))
      ])
    ])
  ]
})
export class EventosComponent implements AfterViewInit, OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('chatbotMessages') chatbotMessages!: ElementRef;
  @ViewChild('chatInputElement') chatInputElement!: ElementRef;

  // Eventos recientes con información detallada
  events: Event[] = [
    {
      id: '1',
      title: 'Boda Mar & Cielo',
      subtitle: 'Una celebración frente al océano',
      category: 'Boda',
      date: 'Octubre 2024',
      location: 'Cartagena',
      image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?q=80&w=1400',
      guests: 180,
      featured: true,
      gallery: [
        'https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?q=80&w=400',
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=400',
        'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400'
      ]
    },
    {
      id: '2',
      title: 'Gala Empresarial Tech Summit',
      subtitle: 'Innovación y networking de alto nivel',
      category: 'Corporativo',
      date: 'Septiembre 2024',
      location: 'Bogotá',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1400',
      guests: 250,
      gallery: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400'
      ]
    },
    {
      id: '3',
      title: 'Fiesta Temática Años 80',
      subtitle: 'Cumpleaños lleno de color y diversión',
      category: 'Cumpleaños',
      date: 'Agosto 2024',
      location: 'Medellín',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1400',
      guests: 120,
      featured: true,
      gallery: [
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400',
        'https://images.unsplash.com/photo-1530023367847-a683933f4172?q=80&w=400'
      ]
    },
    {
      id: '4',
      title: 'Aniversario Romántico',
      subtitle: 'Celebración íntima bajo las estrellas',
      category: 'Aniversario',
      date: 'Julio 2024',
      location: 'Villa de Leyva',
      image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1400',
      guests: 50,
      gallery: [
        'https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=400'
      ]
    },
    {
      id: '5',
      title: 'Quinceañera de Ensueño',
      subtitle: 'Una noche mágica para recordar',
      category: 'Quinceañera',
      date: 'Junio 2024',
      location: 'Cali',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1400',
      guests: 200,
      gallery: [
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=400'
      ]
    },
    {
      id: '6',
      title: 'Baby Shower Garden Party',
      subtitle: 'Celebración al aire libre',
      category: 'Baby Shower',
      date: 'Mayo 2024',
      location: 'Pereira',
      image: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?q=80&w=1400',
      guests: 80,
      gallery: [
        'https://images.unsplash.com/photo-1530023367847-a683933f4172?q=80&w=400'
      ]
    },
    {
      id: '7',
      title: 'Lanzamiento de Producto',
      subtitle: 'Evento corporativo de alto impacto',
      category: 'Corporativo',
      date: 'Abril 2024',
      location: 'Bogotá',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1400',
      guests: 300,
      featured: true,
      gallery: [
        'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=400'
      ]
    },
    {
      id: '8',
      title: 'Graduación Universitaria',
      subtitle: 'Celebrando logros y nuevos comienzos',
      category: 'Graduación',
      date: 'Marzo 2024',
      location: 'Barranquilla',
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1400',
      guests: 150,
      gallery: [
        'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=400'
      ]
    }
  ];

  // Testimonios de eventos
  eventTestimonials: Testimonial[] = [
    {
      eventType: 'Boda',
      text: 'Increíble experiencia. Todo fue perfecto desde el principio hasta el final. La atención al detalle fue excepcional.',
      author: 'María González',
      event: 'Boda en Cartagena',
      rating: 5
    },
    {
      eventType: 'Corporativo',
      text: 'Profesionalismo total. Nuestros clientes quedaron impresionados con la organización y calidad del evento.',
      author: 'Carlos Ramírez',
      event: 'Tech Summit 2024',
      rating: 5
    },
    {
      eventType: 'Cumpleaños',
      text: 'La mejor fiesta de mi vida. Cada detalle estaba pensado para hacerme sentir especial. ¡Gracias!',
      author: 'Ana Martínez',
      event: 'Fiesta Temática Años 80',
      rating: 5
    },
    {
      eventType: 'Quinceañera',
      text: 'Hicieron realidad el sueño de mi hija. Una noche mágica que nunca olvidaremos.',
      author: 'Laura Fernández',
      event: 'Quinceañera de Sofia',
      rating: 5
    }
  ];

  // Servicios por categoría
  eventServices: { [key: string]: EventService[] } = {
    'Boda': [
      { icon: '🍽️', name: 'Catering Gourmet' },
      { icon: '🎨', name: 'Decoración Premium' },
      { icon: '📸', name: 'Fotografía Profesional' },
      { icon: '🎵', name: 'Música y Entretenimiento' }
    ],
    'Corporativo': [
      { icon: '🏢', name: 'Logística Completa' },
      { icon: '📊', name: 'Equipos AV' },
      { icon: '🍽️', name: 'Coffee Breaks' },
      { icon: '🎤', name: 'Presentaciones' }
    ],
    'Cumpleaños': [
      { icon: '🎂', name: 'Torta Personalizada' },
      { icon: '🎪', name: 'Animación' },
      { icon: '🎨', name: 'Decoración Temática' },
      { icon: '📸', name: 'Fotos Instantáneas' }
    ],
    'Quinceañera': [
      { icon: '👑', name: 'Ceremonia Especial' },
      { icon: '💃', name: 'Coreografía' },
      { icon: '📸', name: 'Sesión de Fotos' },
      { icon: '🎂', name: 'Torta de 15' }
    ],
    'Baby Shower': [
      { icon: '👶', name: 'Decoración Temática' },
      { icon: '🎮', name: 'Juegos y Actividades' },
      { icon: '🎁', name: 'Mesa de Regalos' },
      { icon: '📸', name: 'Fotos del Evento' }
    ],
    'Graduación': [
      { icon: '🎓', name: 'Ambientación Especial' },
      { icon: '📸', name: 'Fotos de Grados' },
      { icon: '🍽️', name: 'Buffet Especial' },
      { icon: '🎵', name: 'Música y Baile' }
    ],
    'Aniversario': [
      { icon: '💕', name: 'Decoración Romántica' },
      { icon: '🍷', name: 'Bar de Cocteles' },
      { icon: '📸', name: 'Sesión de Pareja' },
      { icon: '🎂', name: 'Torta Aniversario' }
    ]
  };

  // Estado de navegación
  canScrollLeft = signal(false);
  canScrollRight = signal(true);
  currentScrollPosition = signal(0);
  progress = signal(0);

  // Evento seleccionado para modal
  selectedEvent = signal<Event | null>(null);

  // Filtro de categoría
  selectedCategory = signal<string>('Todos');
  searchQuery = '';
  viewMode = signal<'grid' | 'list'>('grid');

  categories = ['Todos', 'Boda', 'Corporativo', 'Cumpleaños', 'Quinceañera', 'Baby Shower', 'Graduación', 'Aniversario'];

  // Favoritos
  favoriteEvents = signal<string[]>([]);

  // Testimonios slider
  currentTestimonial = signal(0);

  // Chatbot
  chatbotOpen = signal(false);
  chatMessages: ChatMessage[] = [];
  chatInput = '';
  isOnline = true;

  // Lightbox
  lightboxOpen = false;
  currentImageIndex = 0;

  // Estadísticas
  totalPhotos = computed(() => {
    return this.events.reduce((total, event) => total + (event.gallery?.length || 0), 0);
  });

  // Eventos filtrados
  filteredEvents = computed(() => {
    let filtered = this.events;
    const category = this.selectedCategory();
    const query = this.searchQuery.toLowerCase();

    if (category !== 'Todos') {
      filtered = filtered.filter(e => e.category === category);
    }

    if (query) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.subtitle.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  // Eventos destacados
  featuredEvents = computed(() => {
    return this.events.filter(e => e.featured);
  });

  ngOnInit(): void {
    // Cargar favoritos del localStorage
    const savedFavorites = localStorage.getItem('eventFavorites');
    if (savedFavorites) {
      this.favoriteEvents.set(JSON.parse(savedFavorites));
    }

    // Auto-rotar testimonios
    setInterval(() => {
      this.nextTestimonial();
    }, 5000);
  }

  ngAfterViewInit(): void {
    this.updateScrollState();
    this.scrollContainer?.nativeElement.addEventListener('scroll', () => this.updateScrollState());

    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.addEventListener('scroll', () => {
        this.checkScrollButtons();
      });
    }
  }

  onScroll() {
    this.updateScrollState();
  }

  private updateScrollState() {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = Math.max(1, scrollWidth - clientWidth);

    this.canScrollLeft.set(scrollLeft > 10);
    this.canScrollRight.set(scrollLeft < scrollWidth - clientWidth - 10);
    this.currentScrollPosition.set(scrollLeft);
    this.progress.set(scrollLeft / maxScroll);
  }

  // Navegación
  scrollLeft() {
    if (!this.scrollContainer) return;
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollTo({
      left: container.scrollLeft - scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    if (!this.scrollContainer) return;
    const container = this.scrollContainer.nativeElement;
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollTo({
      left: container.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  }

  checkScrollButtons() {
    if (!this.scrollContainer) return;
    const container = this.scrollContainer.nativeElement;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    this.canScrollLeft.set(scrollLeft > 10);
    this.canScrollRight.set(scrollLeft < scrollWidth - clientWidth - 10);
    this.currentScrollPosition.set(scrollLeft);
  }

  // Modal y detalles
  openEventDetails(event: Event) {
    this.selectedEvent.set(event);
    document.body.style.overflow = 'hidden';
  }

  closeEventDetails() {
    this.selectedEvent.set(null);
    document.body.style.overflow = '';
  }

  // Filtros
  filterByCategory(category: string) {
    this.selectedCategory.set(category);
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  onSearchChange() {
    // El computed filteredEvents se actualiza automáticamente
  }

  // Iconos y utilidades
  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Boda': '💍',
      'Corporativo': '🏢',
      'Cumpleaños': '🎂',
      'Quinceañera': '👑',
      'Baby Shower': '👶',
      'Graduación': '🎓',
      'Aniversario': '💕'
    };
    return icons[category] || '🎉';
  }

  getCategoryCount(category: string): number {
    if (category === 'Todos') return this.events.length;
    return this.events.filter(e => e.category === category).length;
  }

  getCategoryPercentage(category: string): number {
    const count = this.getCategoryCount(category);
    return Math.round((count / this.events.length) * 100);
  }

  // Favoritos
  toggleFavorite(eventId: string) {
    const current = this.favoriteEvents();
    if (current.includes(eventId)) {
      this.favoriteEvents.set(current.filter(id => id !== eventId));
    } else {
      this.favoriteEvents.set([...current, eventId]);
    }
    // Guardar en localStorage
    localStorage.setItem('eventFavorites', JSON.stringify(this.favoriteEvents()));
  }

  isFavorited(eventId: string): boolean {
    return this.favoriteEvents().includes(eventId);
  }

  // Compartir evento
  shareEvent(event: Event) {
    const shareText = `Mira este increíble evento: ${event.title} - ${event.subtitle}`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback para copiar al portapapeles
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('¡Enlace copiado al portapapeles!');
    }
  }

  // Descargar información - FIXED: changed event.guest to event.guests
  downloadEventInfo(event: Event) {
    const content = `
      EVENTO: ${event.title}
      Descripción: ${event.subtitle}
      Categoría: ${event.category}
      Fecha: ${event.date}
      Ubicación: ${event.location}
      Invitados: ${event.guests}

      ¡Contáctanos para un evento similar!
      Tel: +57 300 123 4567
      Email: eventos@empresa.com
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evento-${event.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Testimonios slider
  nextTestimonial() {
    this.currentTestimonial.update(val =>
      val === this.eventTestimonials.length - 1 ? 0 : val + 1
    );
  }

  prevTestimonial() {
    this.currentTestimonial.update(val =>
      val === 0 ? this.eventTestimonials.length - 1 ? 0 : val - 1 : val - 1
    );
  }

  // Servicios del evento
  getEventServices(category: string): EventService[] {
    return this.eventServices[category] || [];
  }

  // Lightbox
  openLightbox(index: number) {
    this.currentImageIndex = index;
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxOpen = false;
    if (!this.selectedEvent()) {
      document.body.style.overflow = '';
    }
  }

  nextImage() {
    if (!this.selectedEvent()?.gallery) return;
    this.currentImageIndex =
      this.currentImageIndex === this.selectedEvent()!.gallery!.length - 1
        ? 0
        : this.currentImageIndex + 1;
  }

  prevImage() {
    if (!this.selectedEvent()?.gallery) return;
    this.currentImageIndex =
      this.currentImageIndex === 0
        ? this.selectedEvent()!.gallery!.length - 1
        : this.currentImageIndex - 1;
  }

  // Chatbot methods
  toggleChatbot() {
    this.chatbotOpen.update(val => !val);
    if (this.chatbotOpen() && this.chatMessages.length === 0) {
      this.addChatMessage(
        '¡Hola! Soy tu asistente de eventos. ¿Te gustaría información sobre algún evento en particular o necesitas ayuda para planificar el tuyo? 🎉',
        'bot'
      );
    }

    if (this.chatbotOpen()) {
      setTimeout(() => {
        this.chatInputElement?.nativeElement?.focus();
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

    // Simular respuesta del bot
    setTimeout(() => {
      let response = '';
      if (userMessage.includes('precio') || userMessage.includes('costo')) {
        response = 'Los precios varían según el tipo de evento y servicios. ¿Qué tipo de evento tienes en mente? Podemos cotizar desde $1,500 USD. 💰';
      } else if (userMessage.includes('disponibilidad') || userMessage.includes('fecha')) {
        response = '📅 Tenemos disponibilidad para los próximos 6 meses. ¿Tienes alguna fecha específica en mente?';
      } else if (userMessage.includes('boda')) {
        response = '💍 ¡Las bodas son nuestra especialidad! Paquetes desde $2,500 USD. ¿Te gustaría ver algunos de nuestros trabajos recientes?';
      } else if (userMessage.includes('corporativo')) {
        response = '🏢 Para eventos corporativos ofrecemos servicios completos de logística, catering y tecnología. ¿Es para una conferencia, lanzamiento o reunión?';
      } else {
        response = 'Puedo ayudarte con:\n\n• Información de precios 💰\n• Disponibilidad de fechas 📅\n• Tipos de eventos 🎉\n• Servicios incluidos ✨\n\n¿Por dónde quieres empezar?';
      }
      this.addChatMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
  }

  quickAction(action: string) {
    switch (action) {
      case 'precios':
        this.chatInput = 'Quiero conocer precios de eventos';
        break;
      case 'disponibilidad':
        this.chatInput = 'Consultar disponibilidad de fechas';
        break;
      case 'categorias':
        this.chatInput = 'Qué tipos de eventos hacen';
        break;
    }
    this.sendChatMessage();
  }
}
