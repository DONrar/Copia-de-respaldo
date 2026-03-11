export interface InventoryItemDto {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface CreateInventoryItemRequest {
  name: string;
  quantity: number;
  unit: string;
}

export interface UpdateInventoryItemRequest {
  quantity?: number;
  unit?: string;
}

export interface ConsumeRequest {
  items: { name: string; quantity: number }[];
}
