export interface EventDto {
  title: string;
  description: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  capacity: number;
  categoryId: number;
}
