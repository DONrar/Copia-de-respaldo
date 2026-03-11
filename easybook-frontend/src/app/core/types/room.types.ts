export interface RoomDto {
  id: string;
  number: string;
  type: string;  // 'single' | 'double' | 'deluxe' (según backend)
  status?: string; // AVAILABLE | OCCUPIED | DIRTY | CLEANING (si lo expones)
}

export interface CreateRoomRequest {
  number: string;
  type: string;
}
