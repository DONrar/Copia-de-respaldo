export type IncidentStatus = 'PENDING' | 'ASSIGNED' | 'DONE';

export interface CleaningIncidentDto {
  id: string;
  roomNumber: string;
  status: IncidentStatus;
  assignedStaffEmail?: string | null;
  createdAt?: string | null;
  resolvedAt?: string | null;
}

export interface AssignIncidentRequest {
  staffEmail: string;
}

export interface ResolveIncidentRequest {
  consumption: { name: string; quantity: number }[];
}
