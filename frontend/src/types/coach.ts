export interface Coach {
  id: number;
  name: string;
  email: string;
  category: string;
  rating: number;
  status: "active" | "inactive";
  createdAt: string;
}
