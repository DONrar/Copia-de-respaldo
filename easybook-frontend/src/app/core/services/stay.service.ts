import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environment/environment';
import { CheckInRequest, CheckOutRequest } from '../types/stay.types';


@Injectable({ providedIn: 'root' })
export class StaysService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/stays`;

  checkIn(body: CheckInRequest) {
    return firstValueFrom(this.http.post<void>(`${this.base}/check-in`, body));
  }

  checkOut(body: CheckOutRequest) {
    return firstValueFrom(this.http.post<void>(`${this.base}/check-out`, body));
  }
}
