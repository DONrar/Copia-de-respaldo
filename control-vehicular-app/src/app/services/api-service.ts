// src/app/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';

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

export interface PersonaInfo {
  id: number;
  nombre: string;
  documento: string;
  foto?: string;
  tipo: string;
  torre: string;
  apartamento: string;
  email?: string;
  telefono?: string;
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
  vigente: boolean;
}

export interface EstadoPago {
  estado: string;
  mensaje: string;
  permiteIngreso: boolean;
  fechaUltimoPago?: string;
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
  ultimoMovimiento?: UltimoMovimiento;
  puedeIngresarSalir: boolean;
  mensaje: string;
}

export interface RegistrarMovimientoRequest {
  qrToken: string;
  placa: string;
  tipoMovimiento: 'ENTRADA' | 'SALIDA';
  observaciones?: string;
}

export interface RegistrarMovimientoResponse {
  exitoso: boolean;
  mensaje: string;
  movimiento?: any;
  alertas?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private storage: Storage | null = null;

  // ⚠️ IMPORTANTE: Cambiar esta URL por la IP de tu máquina cuando pruebes en dispositivo físico
  // Para emulador Android: use 10.0.2.2:8080
  // Para dispositivo físico: use tu IP local (ej: 192.168.1.100:8080)
  private baseUrl = ' https://control-vehicular-0-0-1.onrender.com/api/v1';


  private token: string | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initStorage();
  }

  private async initStorage(): Promise<void> {
    if (!this.storage) {
      const { Storage } = await import('@ionic/storage-angular');
      this.storage = new Storage();
      await this.storage.create();
      this.token = await this.storage.get('jwt_token');
    }
  }

  private async ensureStorageReady(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  // ========== CONFIGURACIÓN ==========

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  // ========== AUTENTICACIÓN ==========

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.baseUrl}/auth/login`,
      { username, password }
    ).pipe(
      switchMap(async (response) => {
        if (response.success && response.data.token) {
          await this.ensureStorageReady();
          this.token = response.data.token;
          await this.storage?.set('jwt_token', this.token);
          await this.storage?.set('user_data', response.data);
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  async logout(): Promise<void> {
    await this.ensureStorageReady();
    this.token = null;
    await this.storage?.remove('jwt_token');
    await this.storage?.remove('user_data');
    await this.storage?.remove('last_qr_token');
  }

  async isAuthenticated(): Promise<boolean> {
    await this.ensureStorageReady();
    const token = await this.storage?.get('jwt_token');
    return token !== null && token !== undefined;
  }

  async getUserData(): Promise<LoginResponse | null> {
    await this.ensureStorageReady();
    return await this.storage?.get('user_data');
  }

  // ========== QR SCAN ==========

  escanearQr(qrToken: string): Observable<QrScanResponse> {
    return from(this.ensureStorageReady()).pipe(
      switchMap(() =>
        this.http.post<ApiResponse<QrScanResponse>>(
          `${this.baseUrl}/qr/scan`,
          { qrToken },
          { headers: this.getHeaders() }
        )
      ),
      map((response) => {
        // Guardar último QR escaneado
        this.storage?.set('last_qr_token', qrToken);
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  // ========== MOVIMIENTOS ==========

  registrarMovimiento(
    qrToken: string,
    placa: string,
    tipoMovimiento: 'ENTRADA' | 'SALIDA',
    observaciones?: string
  ): Observable<RegistrarMovimientoResponse> {
    return from(this.ensureStorageReady()).pipe(
      switchMap(() =>
        this.http.post<ApiResponse<RegistrarMovimientoResponse>>(
          `${this.baseUrl}/qr/movimiento`,
          {
            qrToken,
            placa,
            tipoMovimiento,
            observaciones
          },
          { headers: this.getHeaders() }
        )
      ),
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  // ========== VALIDACIÓN ==========

  validarAutorizacion(qrToken: string, placa: string): Observable<any> {
    return from(this.ensureStorageReady()).pipe(
      switchMap(() =>
        this.http.post<ApiResponse<any>>(
          `${this.baseUrl}/qr/validar`,
          { qrToken, placa },
          { headers: this.getHeaders() }
        )
      ),
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  // ========== HEALTH CHECK ==========

  healthCheck(): Observable<any> {
    return this.http.get<ApiResponse<string>>(
      `${this.baseUrl}/qr/health`
    ).pipe(
      map((response) => response.data),
      catchError(this.handleError)
    );
  }

  // ========== HELPERS ==========

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);

    let errorMessage = 'Error en la comunicación con el servidor';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor. Verifique su conexión.';
    } else if (error.status === 401) {
      errorMessage = 'Sesión expirada. Por favor inicie sesión nuevamente.';
    } else if (error.status === 403) {
      errorMessage = 'No tiene permisos para realizar esta acción.';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado.';
    } else if (error.status >= 500) {
      errorMessage = 'Error del servidor. Intente nuevamente más tarde.';
    }

    return throwError(() => new Error(errorMessage));
  }
}
