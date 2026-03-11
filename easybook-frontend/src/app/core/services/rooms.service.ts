import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment'; 
import { firstValueFrom } from 'rxjs';
import { CreateRoomRequest, RoomDto } from '../types/room.types';
@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class RoomsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/rooms`;

  list() {
    return firstValueFrom(this.http.get<RoomDto[]>(this.base));
  }
  create(req: CreateRoomRequest) {
    return firstValueFrom(this.http.post<RoomDto>(this.base, req));
  }
  get(number: string) {
    return firstValueFrom(this.http.get<RoomDto>(`${this.base}/${encodeURIComponent(number)}`));
  }
  update(number: string, patch: Partial<RoomDto>) {
    return firstValueFrom(this.http.put<RoomDto>(`${this.base}/${encodeURIComponent(number)}`, patch));
  }
  remove(number: string) {
    return firstValueFrom(this.http.delete<void>(`${this.base}/${encodeURIComponent(number)}`));
  }
}
