export interface CheckInRequest {
  roomNumber: string;
  guestEmail: string;
  guestFullName: string;
}

export interface CheckOutRequest {
  roomNumber: string;
  assignedStaffEmail?: string | null;
}
