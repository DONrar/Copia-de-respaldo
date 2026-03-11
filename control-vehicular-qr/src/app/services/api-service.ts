import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  username: string;
  nombreCompleto: string;
  roles: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface QrScanRequest {
  qrToken: string;
}

export interface PersonaInfo {
  id: number;
  nombre: string;
  documento: string;
  foto: string;
  tipo: string;
  torre: string;
  apartamento: string;
  email: string;
  telefono: string;
}

export interface VehiculoAsociado {
  idVehiculo: number;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  tipo: string;
  rol: string;
  activo: boolean;
  fechaAutorizacion: string;
  fechaVencimiento: string;
  vigente: boolean;
}

export interface EstadoPago {
  estado: string;
  fechaUltimoPago: string;
  mensaje: string;
  permiteIngreso: boolean;
}

export interface UltimoMovimiento {
  id: number;
  tipoMovimiento: string;
  fechaHora: string;
  placaVehiculo: string;
  marcaVehiculo: string;
  autorizado: boolean;
}

export interface QrScanResponse {
  persona: PersonaInfo;
  vehiculos: VehiculoAsociado[];
  estadoPago: EstadoPago;
  ultimoMovimiento: UltimoMovimiento;
  puedeIngresarSalir: boolean;
  mensaje: string;
}

export interface RegistrarMovimientoRequest {
  qrToken: string;
  placa: string;
  tipoMovimiento: string;
  observaciones?: string;
}

export interface Movimiento {
  id: number;
  nombrePersona: string;
  documentoPersona: string;
  placaVehiculo: string;
  marcaVehiculo: string;
  tipoMovimiento: string;
  fechaHora: string;
  autorizado: boolean;
  motivoDenegacion: string;
  observaciones: string;
  estadoPagoAlMomento: string;
  apartamentoAlMomento: string;
  usuarioRegistro: string;
}

export interface RegistrarMovimientoResponse {
  exitoso: boolean;
  mensaje: string;
  movimiento: Movimiento;
  alertas: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://tu-backend.com/api/v1'; // Cambiar por tu URL

  constructor(private http: HttpClient) {}

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const { value } = await Preferences.get({ key: 'token' });
    return new HttpHeaders({
      'Authorization': `Bearer ${value}`,
      'Content-Type': 'application/json'
    });
  }

  // Login
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/auth/login`,
      credentials
    );
  }

  // Escanear QR
  escanearQr(qrToken: string): Observable<ApiResponse<QrScanResponse>> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => {
        return this.http.post<ApiResponse<QrScanResponse>>(
          `${this.apiUrl}/qr/scan`,
          { qrToken },
          { headers }
        );
      })
    );
  }

  // Registrar movimiento
  registrarMovimiento(request: RegistrarMovimientoRequest): Observable<ApiResponse<RegistrarMovimientoResponse>> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => {
        return this.http.post<ApiResponse<RegistrarMovimientoResponse>>(
          `${this.apiUrl}/qr/movimiento`,
          request,
          { headers }
        );
      })
    );
  }

  // Validar token
  validateToken(): Observable<ApiResponse<any>> {
    return from(this.getAuthHeaders()).pipe(
      switchMap(headers => {
        return this.http.get<ApiResponse<any>>(
          `${this.apiUrl}/auth/validate`,
          { headers }
        );
      })
    );
  }
}
