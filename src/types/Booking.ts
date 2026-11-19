export interface Booking {
  id: number;
  eventId: number;
  eventTitle: string;
  userId: string;
  bookingDate: string;
  numberOfTickets: number;
  totalAmount: number;
  status: string;
}
export interface CreateBookingDto {
  eventId: number;
  numberOfTickets: number;
}
