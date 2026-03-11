import { Injectable } from '@angular/core';
import { StorageService } from './storage';
import { Cliente } from '../models/cliente.model';
import { Deuda } from '../models/deuda.model';
import { Abono } from '../models/abono.model';
import { ProductoItem } from '../models/producto-item.model';

@Injectable({
  providedIn: 'root'
})
export class DeudasService {

  constructor(private storage: StorageService) {}

  // ========== CLIENTES ==========
  async crearCliente(
  nombre: string,
  cedula?: string,
  telefono?: string,
  email?: string,
  direccion?: string,
  notas?: string
): Promise<Cliente> {
  const cliente: Cliente = {
    id: this.generarId(),
    nombre,
    cedula,
    telefono,
    email,
    direccion,
    fechaRegistro: new Date().toISOString(),
    saldoTotal: 0,
    notas
  };
  await this.storage.agregarCliente(cliente);
  return cliente;
}

  // Agregar después del método crearCliente
async actualizarCliente(
  id: string,
  nombre: string,
  cedula?: string,
  telefono?: string,
  email?: string,
  direccion?: string,
  notas?: string
): Promise<void> {
  const cliente = await this.storage.getClientePorId(id);
  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }

  cliente.nombre = nombre;
  cliente.cedula = cedula;
  cliente.telefono = telefono;
  cliente.email = email;
  cliente.direccion = direccion;
  cliente.notas = notas;

  await this.storage.actualizarCliente(cliente);
}

async eliminarCliente(id: string): Promise<void> {
  // Verificar si tiene deudas pendientes
  const deudas = await this.storage.getDeudasPorCliente(id);
  const tieneDeudasPendientes = deudas.some(d => d.estado === 'pendiente');

  if (tieneDeudasPendientes) {
    throw new Error('No se puede eliminar un cliente con deudas pendientes');
  }

  await this.storage.eliminarCliente(id);
}

  async obtenerClientes(): Promise<Cliente[]> {
    return await this.storage.getClientes();
  }

  async obtenerClientePorId(id: string): Promise<Cliente | undefined> {
    return await this.storage.getClientePorId(id);
  }

  async actualizarSaldoCliente(clienteId: string): Promise<void> {
    const deudas = await this.storage.getDeudasPorCliente(clienteId);
    const saldoTotal = deudas
      .filter(d => d.estado === 'pendiente')
      .reduce((sum, d) => sum + d.saldoPendiente, 0);

    const cliente = await this.storage.getClientePorId(clienteId);
    if (cliente) {
      cliente.saldoTotal = saldoTotal;
      await this.storage.actualizarCliente(cliente);
    }
  }

  // ========== DEUDAS ==========
  async crearDeuda(
    clienteId: string,
    productos: ProductoItem[],
    notas?: string
  ): Promise<Deuda> {
    const cliente = await this.storage.getClientePorId(clienteId);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    const total = productos.reduce((sum, p) => sum + p.subtotal, 0);

    const deuda: Deuda = {
      id: this.generarId(),
      clienteId,
      clienteNombre: cliente.nombre,
      fecha: new Date().toISOString(),
      productos,
      total,
      saldoPendiente: total,
      estado: 'pendiente',
      notas
    };

    await this.storage.agregarDeuda(deuda);
    await this.actualizarSaldoCliente(clienteId);

    return deuda;
  }

  async obtenerDeudas(): Promise<Deuda[]> {
    return await this.storage.getDeudas();
  }

  async obtenerDeudasPendientes(): Promise<Deuda[]> {
    const deudas = await this.storage.getDeudas();
    return deudas.filter(d => d.estado === 'pendiente');
  }

  async obtenerDeudasPorCliente(clienteId: string): Promise<Deuda[]> {
    return await this.storage.getDeudasPorCliente(clienteId);
  }

   // AGREGAR ESTE MÉTODO NUEVO ⬇️
  async obtenerDeudaPorId(id: string): Promise<Deuda | undefined> {
    return await this.storage.getDeudaPorId(id);
  }

  // ========== ABONOS ==========
  async registrarAbono(deudaId: string, monto: number, notas?: string): Promise<void> {
    const deuda = await this.storage.getDeudaPorId(deudaId);
    if (!deuda) {
      throw new Error('Deuda no encontrada');
    }

    if (monto <= 0 || monto > deuda.saldoPendiente) {
      throw new Error('Monto inválido');
    }

    const abono: Abono = {
      id: this.generarId(),
      deudaId,
      monto,
      fecha: new Date().toISOString(),
      notas
    };

    await this.storage.agregarAbono(abono);

    // Actualizar saldo de la deuda
    deuda.saldoPendiente -= monto;
    if (deuda.saldoPendiente <= 0) {
      deuda.estado = 'pagada';
      deuda.saldoPendiente = 0;
    }

    await this.storage.actualizarDeuda(deuda);
    await this.actualizarSaldoCliente(deuda.clienteId);
  }

  // ========== NUEVO MÉTODO: PAGAR TODAS LAS DEUDAS ==========
  async pagarTodasLasDeudas(clienteId: string, notas?: string): Promise<{
    totalPagado: number,
    deudasPagadas: number
  }> {
    const cliente = await this.storage.getClientePorId(clienteId);
    if (!cliente) {
      throw new Error('Cliente no encontrado');
    }

    // Obtener todas las deudas pendientes del cliente
    const deudasPendientes = await this.obtenerDeudasPorCliente(clienteId);
    const deudasAPagar = deudasPendientes.filter(d => d.estado === 'pendiente');

    if (deudasAPagar.length === 0) {
      throw new Error('No hay deudas pendientes para pagar');
    }

    let totalPagado = 0;
    const notaAbono = notas || 'Pago total de todas las deudas';

    // Pagar cada deuda pendiente
    for (const deuda of deudasAPagar) {
      const montoPagar = deuda.saldoPendiente;

      // Crear el abono
      const abono: Abono = {
        id: this.generarId(),
        deudaId: deuda.id,
        monto: montoPagar,
        fecha: new Date().toISOString(),
        notas: notaAbono
      };

      await this.storage.agregarAbono(abono);

      // Actualizar la deuda
      deuda.saldoPendiente = 0;
      deuda.estado = 'pagada';
      await this.storage.actualizarDeuda(deuda);

      totalPagado += montoPagar;
    }

    // Actualizar saldo del cliente
    await this.actualizarSaldoCliente(clienteId);

    return {
      totalPagado,
      deudasPagadas: deudasAPagar.length
    };
  }

  async obtenerAbonosPorDeuda(deudaId: string): Promise<Abono[]> {
    return await this.storage.getAbonosPorDeuda(deudaId);
  }

  // ========== UTILIDADES ==========
  calcularSubtotal(cantidad: number, valorUnitario: number): number {
    return cantidad * valorUnitario;
  }

  private generarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Para desarrollo/testing
  async limpiarTodosDatos(): Promise<void> {
    await this.storage.limpiarTodo();
  }

  // ========== ESTADÍSTICAS ==========
  async obtenerEstadisticas() {
    const clientes = await this.obtenerClientes();
    const deudas = await this.obtenerDeudas();
    const abonos = await this.storage.getAbonos();

    const deudasPendientes = deudas.filter(d => d.estado === 'pendiente');
    const deudasPagadas = deudas.filter(d => d.estado === 'pagada');

    const totalPorCobrar = deudasPendientes.reduce((sum, d) => sum + d.saldoPendiente, 0);
    const totalCobrado = abonos.reduce((sum, a) => sum + a.monto, 0);
    const totalVendido = deudas.reduce((sum, d) => sum + d.total, 0);

    // Top 5 clientes con más deuda
    const clientesConDeuda = clientes
      .filter(c => c.saldoTotal > 0)
      .sort((a, b) => b.saldoTotal - a.saldoTotal)
      .slice(0, 5);

    // Deudas recientes (últimas 5)
    const deudasRecientes = [...deudas]
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);

    return {
      totalClientes: clientes.length,
      totalDeudas: deudas.length,
      deudasPendientesCount: deudasPendientes.length,
      deudasPagadasCount: deudasPagadas.length,
      totalPorCobrar,
      totalCobrado,
      totalVendido,
      clientesConDeuda,
      deudasRecientes
    };
  }

  async eliminarDeuda(id: string): Promise<void> {
  // Verificar si la deuda existe
  const deuda = await this.storage.getDeudaPorId(id);
  if (!deuda) {
    throw new Error('Deuda no encontrada');
  }

  // Verificar si tiene abonos registrados
  const abonos = await this.storage.getAbonosPorDeuda(id);
  if (abonos.length > 0) {
    throw new Error('No se puede eliminar una deuda con abonos registrados');
  }

  // Eliminar la deuda
  await this.storage.eliminarDeuda(id);

  // Actualizar saldo del cliente
  await this.actualizarSaldoCliente(deuda.clienteId);
}

async actualizarDeuda(
  id: string,
  productos: ProductoItem[],
  notas?: string
): Promise<void> {
  const deuda = await this.storage.getDeudaPorId(id);
  if (!deuda) {
    throw new Error('Deuda no encontrada');
  }

  // Verificar si tiene abonos
  const abonos = await this.storage.getAbonosPorDeuda(id);
  const totalAbonado = abonos.reduce((sum, a) => sum + a.monto, 0);
  const nuevoTotal = productos.reduce((sum, p) => sum + p.subtotal, 0);

  // Si ya hay abonos, verificar que el nuevo total no sea menor al total abonado
  if (totalAbonado > 0 && nuevoTotal < totalAbonado) {
    throw new Error('El nuevo total no puede ser menor al monto ya abonado');
  }

  // Actualizar la deuda
  deuda.productos = productos;
  deuda.total = nuevoTotal;
  deuda.saldoPendiente = nuevoTotal - totalAbonado;
  deuda.notas = notas;

  // Actualizar estado si está pagada
  if (deuda.saldoPendiente <= 0) {
    deuda.estado = 'pagada';
    deuda.saldoPendiente = 0;
  }

  await this.storage.actualizarDeuda(deuda);
  await this.actualizarSaldoCliente(deuda.clienteId);
}
}
