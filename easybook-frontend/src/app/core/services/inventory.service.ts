import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import {
  InventoryItemDto,
  CreateInventoryItemRequest,
  UpdateInventoryItemRequest,
  ConsumeRequest
} from '../types/inventory.types';
import { firstValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})


@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/inventory`;

  list() {
    return firstValueFrom(this.http.get<InventoryItemDto[]>(this.base));
  }

  create(req: CreateInventoryItemRequest) {
    return firstValueFrom(this.http.post<InventoryItemDto>(this.base, req));
  }

  update(id: string, req: UpdateInventoryItemRequest) {
    return firstValueFrom(this.http.put<InventoryItemDto>(`${this.base}/${id}`, req));
  }

  consume(req: ConsumeRequest) {
    return firstValueFrom(this.http.post<void>(`${this.base}/consume`, req));
  }
}
