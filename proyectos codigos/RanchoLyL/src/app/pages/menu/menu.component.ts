import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarritoComponent } from '../carrito/carrito.component';
import { RouterLink } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonModal,
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
  IonList, IonButtons
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  searchOutline, appsOutline, eyeOutline, cartOutline,
  closeOutline, restaurantOutline, waterOutline,
  sparklesOutline, flameOutline, iceCreamOutline,
  wineOutline, pizzaOutline, fastFoodOutline,
  refreshOutline, arrowUpOutline, star
} from 'ionicons/icons';
import { CarritoService } from 'src/app/services/carrito.service';

interface Producto {
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  descripcion: string;
  presentacion?: string;
  precioFinal?: number;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  imports: [IonButtons, CommonModule, FormsModule, ReactiveFormsModule, CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonModal,
    IonRadioGroup,
    IonRadio,
    IonItem,
    IonLabel,
    IonList],
  styleUrls: ['./menu.component.scss'],
  standalone: true,
}) export class MenuComponent {

  categorias = ['Hamburguesas', 'helados', 'bebidas', 'especiales', 'otros'];
  filtro = '';
  categoriaSeleccionada = '';

  // Modal para selección de presentación
  isModalOpen = false;
  productoSeleccionado: Producto | null = null;
  presentacionSeleccionada = '';

  presentaciones = [
    { value: 'pan', label: 'Pan', precioAdicional: 0 },
    { value: 'picada', label: 'Patacón Picada', precioAdicional: 0 },
    { value: 'patacon-entera', label: 'Patacón Entera', precioAdicional: 2000 }
  ];

  constructor(
    private toastController: ToastController,
    private carritoService: CarritoService
  ) {
    addIcons({
      searchOutline, appsOutline, eyeOutline, cartOutline,
      closeOutline, restaurantOutline, waterOutline,
      sparklesOutline, flameOutline, iceCreamOutline,
      wineOutline, pizzaOutline, fastFoodOutline,
      refreshOutline, arrowUpOutline, star
    });
  }

  productos: Producto[] = [
    /* HAMBURGUESAS */
    {
      nombre: 'Hamburguesa Clásica',
      precio: 10000,
      imagen: '/assets/menu/hamburguesa.jpeg',
      categoria: 'Hamburguesas',
      descripcion: 'Pan, carne de res, lechuga, cebolla caramelizada, jamon, ripio, papa a la francesa, huevo de codorniz y patacon ',
    },
    {
      nombre: 'Ranchera ',
      precio: 16000,
      imagen: '/assets/menu/Ranchera.png',
      categoria: 'Hamburguesas',
      descripcion: 'Corizo, maíz tierno, tocineta, carne de res, lechuga, cebolla caramelizada, jamon, ripio, papa a la francesa, huevo de codorniz y patacon ',
    },
    {
      nombre: 'Mixta de res y pechuga',
      precio: 16000,
      imagen: '/assets/menu/Mixta (2).png',
      categoria: 'Hamburguesas',
      descripcion: 'Carne de res, Pechuga a la plancha, maíz tierno, lechuga, cebolla caramelizada, jamon, ripio, papa a la francesa, huevo de codorniz y patacon ',
    },
    {
      nombre: 'Doble carne de res ',
      precio: 16000,
      imagen: '/assets/menu/doble.jpeg',
      categoria: 'Hamburguesas',
      descripcion: 'Doble Carne de res, maíz tierno, lechuga, cebolla caramelizada, jamon, ripio, papa a la francesa, huevo de codorniz y patacon ',
    },

    /* ESPECIALES */
    {
      nombre: 'Churrasco',
      precio: 19000,
      imagen: 'assets/menu/churrasco.jpeg',
      categoria: 'especiales',
      descripcion: '220 Gr lomo de res, patacon, papa a la francesa y ensalada',
    },
    {
      nombre: 'Fundido de pechuga',
      precio: 11000,
      imagen: 'assets/menu/fundido.jpeg',
      categoria: 'especiales',
      descripcion: 'pechuga a la plancha, jamon, queso, patacon, papa a la francesa y ensalada',
    },
    {
      nombre: 'Alitas BBQ',
      precio: 15000,
      imagen: 'assets/menu/alitas.jpeg',
      categoria: 'especiales',
      descripcion: 'papa a la francesa, patacon, Alas y ensalada',
    },
    {
      nombre: 'Costillitas BBQ',
      precio: 17000,
      imagen: 'assets/menu/costilltas.png',
      categoria: 'especiales',
      descripcion: 'Papas criollas, patacon, Costilla ahumada de cerdo y ensalada',
    },
    {
      nombre: 'Picadas de carne',
      precio: 25000,
      imagen: 'assets/menu/descarga.jpeg',
      categoria: 'especiales',
      descripcion: 'Lomo de res, pechuga a la plancha, chorizo, papa a la francesa, patacona y ensalada',
    },

    /* OTROS */
    {
      nombre: 'Salchipapa',
      precio: 8000,
      imagen: '/assets/menu/salchipapa.jpeg',
      categoria: 'otros',
      descripcion: 'Papa a la francesa, salchicha, jamon, queso y ripio',
    },
    {
      nombre: 'perro caliente',
      precio: 10000,
      imagen: '/assets/menu/perro.jpeg',
      categoria: 'otros',
      descripcion: 'Pan, salchicha americana, jamon, queso, ripio y salsas',
    },
    {
      nombre: 'Chorizo',
      precio: 6000,
      imagen: '/assets/menu/chorizo.jpeg',
      categoria: 'otros',
      descripcion: 'Chorizo, patacon y limon',
    },
    {
      nombre: 'Mazorcada',
      precio: 12000,
      imagen: '/assets/menu/mazorcada.png',
      categoria: 'otros',
      descripcion: 'Papa a la francesa, carne desmechada de res y de pollo, queso y papa ripio ',
    },
    {
      nombre: 'Choriperro',
      precio: 10000,
      imagen: '/assets/menu/perro.jpeg',
      categoria: 'otros',
      descripcion: 'Pan, chorizo, jamon, queso, ripio y salsas ',
    },
    {
      nombre: 'Nugguest de pollo',
      precio: 9000,
      imagen: '/assets/menu/nugguets.jpeg',
      categoria: 'otros',
      descripcion: '5 Nugguets, papa a la francesa y ensalada',
    },
    {
      nombre: 'Suizo',
      precio: 11000,
      imagen: '/assets/menu/suizo.jpeg',
      categoria: 'otros',
      descripcion: 'Salchicha suiza, papa a la francesa, jamon, queso, huevo de codorniz y ensalada',
    },

    /* CONOS */
    {
      nombre: 'Cono de 1 bola',
      precio: 3500,
      imagen: '/assets/menu/cono1.jpeg',
      categoria: 'helados',
      descripcion: '1 bola de helado, glaseado y chispitas',
    },
    {
      nombre: 'Cono de 2 bolas',
      precio: 6000,
      imagen: '/assets/menu/cono2.jpeg',
      categoria: 'helados',
      descripcion: '2 bolas de helado, glaseado y chispitas',
    },
    {
      nombre: 'Cono de 3 bolas',
      precio: 8500,
      imagen: '/assets/menu/cono3.png',
      categoria: 'helados',
      descripcion: '3 bolas de helado, glaseado y chispitas',
    },
    {
      nombre: 'Canasta JR',
      precio: 9000,
      imagen: '/assets/menu/canasta2.jpeg',
      categoria: 'helados',
      descripcion: '2 bolas de helado, fresa, cereza, gomitas, glaseado y chispitas ',
    }, {
      nombre: 'Conasta de helado',
      precio: 12000,
      imagen: '/assets/menu/canasta3.jpeg',
      categoria: 'helados',
      descripcion: '3 bolas de helado, fresas, barquillo, cereza, gomitas, glaseado y chispitas',
    },
    {
      nombre: 'Banana Split',
      precio: 14000,
      imagen: '/assets/menu/banana.jpeg',
      categoria: 'helados',
      descripcion: '4 bolas de helado, fresas, barquillo, cereza, gomitas, glaseado y chispitas, galleta wafer y banano',
    },

    /* JUGOS */
    {
      nombre: 'Jugos naturales',
      precio: 5000,
      imagen: '/assets/menu/jugos.jpeg',
      categoria: 'bebidas',
      descripcion: 'Sabores: maracuya, cholupa, lulo, mora',
    },
    {
      nombre: 'Cerezada',
      precio: 7000,
      imagen: '/assets/menu/cerezada.jpeg',
      categoria: 'bebidas',
      descripcion: '',
    },
    {
      nombre: 'Limonada de coco',
      precio: 8000,
      imagen: '/assets/menu/coco.jpeg',
      categoria: 'bebidas',
      descripcion: '',
    },
    {
      nombre: 'Limonada de hiervabuena',
      precio: 7000,
      imagen: '/assets/menu/hierva.jpeg',
      categoria: 'bebidas',
      descripcion: '',
    },
    {
      nombre: 'Sodas',
      precio: 8000,
      imagen: '/assets/menu/sodas.jpeg',
      categoria: 'bebidas',
      descripcion: 'Sodas de maracuya, frutos rojos y frutos verdes',
    },
  ];

  get productosFiltrados() {
    return this.productos.filter(p =>
      (this.filtro === '' || p.nombre.toLowerCase().includes(this.filtro.toLowerCase())) &&
      (this.categoriaSeleccionada === '' || p.categoria === this.categoriaSeleccionada)
    );
  }

  saboresJugos = [
    { value: 'maracuya', label: 'Maracuyá', precioAdicional: 0 },
    { value: 'cholupa', label: 'Cholupa', precioAdicional: 0 },
    { value: 'lulo', label: 'Lulo', precioAdicional: 0 },
    { value: 'mora', label: 'Mora', precioAdicional: 0 }
  ];

  // Agregar estas propiedades para el modal de sabores:
  saborSeleccionado = '';

  // Modificar el método esHamburguesa para incluir jugos:
  esHamburguesa(categoria: string): boolean {
    return categoria.toLowerCase() === 'hamburguesas';
  }

  // Agregar nuevo método para jugos:
  esJugoNatural(nombre: string): boolean {
    return nombre.toLowerCase().includes('jugos naturales');
  }

  abrirModalPresentacion(producto: Producto, event: Event) {
    event.stopPropagation();
    this.productoSeleccionado = producto;
    this.presentacionSeleccionada = 'pan'; // Selección por defecto
    this.isModalOpen = true;
  }

  confirmarPresentacion() {
    if (this.productoSeleccionado && this.presentacionSeleccionada) {
      const presentacion = this.presentaciones.find(p => p.value === this.presentacionSeleccionada);

      const productoConPresentacion: Producto = {
        ...this.productoSeleccionado,
        presentacion: presentacion?.label || '',
        precioFinal: this.productoSeleccionado.precio + (presentacion?.precioAdicional || 0)
      };

      this.carritoService.agregarProducto(productoConPresentacion);

      const mensaje = presentacion?.precioAdicional ?
        `✅ ${productoConPresentacion.nombre} (${presentacion.label}) agregada al carrito - $${productoConPresentacion.precioFinal}` :
        `✅ ${productoConPresentacion.nombre} (${presentacion?.label}) agregada al carrito`;

      this.mostrarToast(mensaje);
      this.animarIconoCarrito();

      this.cerrarModal();
    }
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
      color: 'dark',
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  agregarAlCarrito(producto: Producto, event: Event) {
  if (this.esHamburguesa(producto.categoria)) {
    this.abrirModalPresentacion(producto, event);
    return;
  }

  if (this.esJugoNatural(producto.nombre)) {
    this.abrirModalSabores(producto, event);
    return;
  }

  if (this.esSoda(producto.nombre)) {
    this.abrirModalSodas(producto, event);
    return;
  }

  this.carritoService.agregarProducto(producto);
  this.mostrarToast(`✅ ${producto.nombre} agregado al carrito`);

  const target = event.target as HTMLElement;
  target.classList.add('pulse-on-click');
  setTimeout(() => target.classList.remove('pulse-on-click'), 300);

  this.animarIconoCarrito();
}

abrirModalSodas(producto: Producto, event: Event) {
  event.stopPropagation();
  this.productoSeleccionado = producto;
  this.saborSodaSeleccionado = 'frutos-rojos'; // valor por defecto
  this.isModalOpen = true;
}


abrirModalSabores(producto: Producto, event: Event) {
  event.stopPropagation();
  this.productoSeleccionado = producto;
  this.saborSeleccionado = 'maracuya'; // Selección por defecto
  this.isModalOpen = true;
}

confirmarSabor() {
  if (this.productoSeleccionado && this.saborSeleccionado) {
    const sabor = this.saboresJugos.find(s => s.value === this.saborSeleccionado);

    const productoConSabor: Producto = {
      ...this.productoSeleccionado,
      presentacion: sabor?.label || '', // Usamos el campo presentacion para guardar el sabor
      precioFinal: this.productoSeleccionado.precio + (sabor?.precioAdicional || 0)
    };

    this.carritoService.agregarProducto(productoConSabor);

    const mensaje = `✅ ${productoConSabor.nombre} (${sabor?.label}) agregado al carrito - $${productoConSabor.precioFinal || productoConSabor.precio}`;

    this.mostrarToast(mensaje);
    this.animarIconoCarrito();

    this.cerrarModal();
  }
}
  private animarIconoCarrito() {
    // 🛒 Animación del ícono del carrito en el tab
    const icono = document.getElementById('icono-carrito');
    if (icono) {
      icono.classList.remove('carrito-animado'); // Reinicia animación si ya estaba
      void icono.offsetWidth; // Force reflow para reiniciar animación
      icono.classList.add('carrito-animado');
    }
  }

  // Modificar el método cerrarModal:
cerrarModal() {
  this.isModalOpen = false;
  this.productoSeleccionado = null;
  this.presentacionSeleccionada = '';
  this.saborSeleccionado = ''; // Limpiar también el sabor seleccionado
}

// Modificar getPrecioConPresentacion para incluir sabores:
getPrecioConPresentacion(): number {
  if (!this.productoSeleccionado) return 0;

  if (this.esJugoNatural(this.productoSeleccionado.nombre)) {
    const sabor = this.saboresJugos.find(s => s.value === this.saborSeleccionado);
    return this.productoSeleccionado.precio + (sabor?.precioAdicional || 0);
  }

  if (this.esSoda(this.productoSeleccionado.nombre)) {
    const sabor = this.saboresSodas.find(s => s.value === this.saborSodaSeleccionado);
    return this.productoSeleccionado.precio + (sabor?.precioAdicional || 0);
  }

  const presentacion = this.presentaciones.find(p => p.value === this.presentacionSeleccionada);
  return this.productoSeleccionado.precio + (presentacion?.precioAdicional || 0);
}

confirmarSoda() {
  if (this.productoSeleccionado && this.saborSodaSeleccionado) {
    const sabor = this.saboresSodas.find(s => s.value === this.saborSodaSeleccionado);

    const productoConSabor: Producto = {
      ...this.productoSeleccionado,
      presentacion: sabor?.label || '',
      precioFinal: this.productoSeleccionado.precio + (sabor?.precioAdicional || 0)
    };

    this.carritoService.agregarProducto(productoConSabor);

    const mensaje = `✅ ${productoConSabor.nombre} (${sabor?.label}) agregado al carrito - $${productoConSabor.precioFinal || productoConSabor.precio}`;

    this.mostrarToast(mensaje);
    this.animarIconoCarrito();
    this.cerrarModal();
  }
}



esSoda(nombre: string): boolean {
  return nombre.toLowerCase().includes('sodas');
}

saboresSodas = [
  { value: 'frutos-rojos', label: 'Frutos Rojos', precioAdicional: 0 },
  { value: 'frutos-verdes', label: 'Frutos Verdes', precioAdicional: 0 },
  { value: 'maracuya', label: 'Maracuyá', precioAdicional: 0 }
];

saborSodaSeleccionado = '';

  getIconoCategoria(categoria: string): string {
    const iconos: { [key: string]: string } = {
      'Hamburguesas': 'fastFoodOutline',
      'helados': 'iceCreamOutline',
      'bebidas': 'wineOutline',
      'especiales': 'flameOutline',
      'otros': 'pizzaOutline'
    };
    return iconos[categoria] || 'appsOutline';
  }

  getIconoBoton(producto: Producto): string {
    if (this.necesitaSeleccion(producto)) {
      return 'optionsOutline';
    }
    return 'cartOutline';
  }

  getTextoBoton(producto: Producto): string {
    if (this.esHamburguesa(producto.categoria)) {
      return 'Elegir Presentación';
    }
    if (this.esJugoNatural(producto.nombre) || this.esSoda(producto.nombre)) {
      return 'Elegir Sabor';
    }
    return 'Agregar';
  }

  necesitaSeleccion(producto: Producto): boolean {
    return this.esHamburguesa(producto.categoria) ||
           this.esJugoNatural(producto.nombre) ||
           this.esSoda(producto.nombre);
  }

  getIconoModal(): string {
    if (!this.productoSeleccionado) return 'optionsOutline';

    if (this.esHamburguesa(this.productoSeleccionado.categoria)) {
      return 'restaurantOutline';
    }
    if (this.esJugoNatural(this.productoSeleccionado.nombre)) {
      return 'waterOutline';
    }
    if (this.esSoda(this.productoSeleccionado.nombre)) {
      return 'sparklesOutline';
    }
    return 'optionsOutline';
  }

  getTituloModal(): string {
    if (!this.productoSeleccionado) return 'Personalizar';

    if (this.esHamburguesa(this.productoSeleccionado.categoria)) {
      return 'Seleccionar Presentación';
    }
    if (this.esJugoNatural(this.productoSeleccionado.nombre)) {
      return 'Seleccionar Sabor';
    }
    if (this.esSoda(this.productoSeleccionado.nombre)) {
      return 'Seleccionar Sabor';
    }
    return 'Personalizar';
  }

  getPresentacionSeleccionada(): string {
    if (this.esHamburguesa(this.productoSeleccionado?.categoria || '') && this.presentacionSeleccionada) {
      const presentacion = this.presentaciones.find(p => p.value === this.presentacionSeleccionada);
      return presentacion?.label || '';
    }
    if (this.esJugoNatural(this.productoSeleccionado?.nombre || '') && this.saborSeleccionado) {
      const sabor = this.saboresJugos.find(s => s.value === this.saborSeleccionado);
      return sabor?.label || '';
    }
    if (this.esSoda(this.productoSeleccionado?.nombre || '') && this.saborSodaSeleccionado) {
      const sabor = this.saboresSodas.find(s => s.value === this.saborSodaSeleccionado);
      return sabor?.label || '';
    }
    return '';
  }

  isSeleccionValida(): boolean {
    if (!this.productoSeleccionado) return false;

    if (this.esHamburguesa(this.productoSeleccionado.categoria)) {
      return !!this.presentacionSeleccionada;
    }
    if (this.esJugoNatural(this.productoSeleccionado.nombre)) {
      return !!this.saborSeleccionado;
    }
    if (this.esSoda(this.productoSeleccionado.nombre)) {
      return !!this.saborSodaSeleccionado;
    }
    return true;
  }

  confirmarSeleccion() {
    if (!this.productoSeleccionado) return;

    if (this.esHamburguesa(this.productoSeleccionado.categoria)) {
      this.confirmarPresentacion();
    } else if (this.esJugoNatural(this.productoSeleccionado.nombre)) {
      this.confirmarSabor();
    } else if (this.esSoda(this.productoSeleccionado.nombre)) {
      this.confirmarSoda();
    }
  }

  // Métodos para funcionalidades adicionales
  tieneDescuento(producto: Producto): boolean {
    // Ejemplo: algunos productos podrían tener descuento
    return producto.nombre.toLowerCase().includes('especial') ||
           producto.precio > 15000;
  }

  getDescuento(producto: Producto): number {
    // Ejemplo de cálculo de descuento
    return producto.precio > 20000 ? 15 : 10;
  }

  getPrecioOriginal(producto: Producto): number {
    const descuento = this.getDescuento(producto);
    return Math.round(producto.precio / (1 - descuento / 100));
  }

  cargarImagenPorDefecto(event: any) {
    event.target.src = '/assets/menu/placeholder.jpg';
  }

  verDetalles(producto: Producto) {
    // Podría implementarse un modal de detalles
    console.log('Ver detalles:', producto);
  }

  limpiarFiltros() {
    this.filtro = '';
    this.categoriaSeleccionada = '';
  }

  trackByProducto(index: number, producto: Producto): string {
    return producto.nombre;
  }

  // ... (mantener el resto de métodos existentes)
}
