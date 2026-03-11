import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { firstValueFrom } from 'rxjs';

import {
  CleaningIncidentDto,
  AssignIncidentRequest,
  ResolveIncidentRequest,
  IncidentStatus
} from '../types/incidents.types';

@Injectable({ providedIn: 'root' })
export class IncidentsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/incidents`;

  list(status?: IncidentStatus) {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return firstValueFrom(this.http.get<CleaningIncidentDto[]>(this.base, { params }));
  }

  assign(id: string, body: AssignIncidentRequest) {
    return firstValueFrom(this.http.post<void>(`${this.base}/${id}/assign`, body));
  }

  resolve(id: string, body: ResolveIncidentRequest) {
    return firstValueFrom(this.http.post<void>(`${this.base}/${id}/resolve`, body));
  }
}
