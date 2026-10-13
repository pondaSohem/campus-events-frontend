export interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  capacity: number;
  availableTickets: number;
  categoryId: number;
  categoryName: string;
}
