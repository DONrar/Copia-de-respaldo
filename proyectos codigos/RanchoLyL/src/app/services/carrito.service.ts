import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private carrito = new BehaviorSubject<{ producto: any, cantidad: number }[]>([]);
  carrito$ = this.carrito.asObservable();

  constructor() {
    this.cargarDesdeStorage();
  }

  getCarrito(): { producto: any, cantidad: number }[] {
    return this.carrito.value;
  }

  actualizarCarrito(nuevoCarrito: { producto: any, cantidad: number }[]) {
    this.carrito.next(nuevoCarrito);
    this.guardarEnStorage(nuevoCarrito);
  }

  agregarProducto(producto: any) {
    const current = this.carrito.value;
    // Crear una clave única que incluya la presentación para hamburguesas
    const key = this.generarClaveUnica(producto);
    const found = current.find(item => this.generarClaveUnica(item.producto) === key);

    if (found) {
      found.cantidad += 1;
    } else {
      current.push({ producto, cantidad: 1 });
    }

    this.actualizarCarrito(current);
  }

  getTotalCantidad(): number {
    return this.carrito.value.reduce((acc, item) => acc + item.cantidad, 0);
  }

  private generarClaveUnica(producto: any): string {
    const base = producto.id ?? producto.nombre;
    // Si tiene presentación (hamburguesas), incluirla en la clave
    return producto.presentacion ? `${base}_${producto.presentacion}` : base;
  }

  private cargarDesdeStorage() {
    const data = localStorage.getItem('carrito');
    const plano = data ? JSON.parse(data) : [];
    const agrupado = this.agruparProductos(plano);
    this.carrito.next(agrupado);
  }

  private guardarEnStorage(planoAgrupado: { producto: any; cantidad: number }[]) {
    const plano: any[] = [];
    planoAgrupado.forEach(item => {
      for (let i = 0; i < item.cantidad; i++) {
        plano.push(item.producto);
      }
    }); 
    localStorage.setItem('carrito', JSON.stringify(plano));
  }

  private agruparProductos(productos: any[]): { producto: any, cantidad: number }[] {
    const mapa = new Map<string, { producto: any, cantidad: number }>();
    for (const p of productos) {
      const key = this.generarClaveUnica(p);
      if (mapa.has(key)) {
        mapa.get(key)!.cantidad += 1;
      } else {
        mapa.set(key, { producto: p, cantidad: 1 });
      }
    }
    return Array.from(mapa.values());
  }
}
