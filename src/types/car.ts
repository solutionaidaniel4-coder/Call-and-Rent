export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  transmission: 'manual' | 'automatic';
  fuel: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  passengers: number;
  category: 'luxury' | 'sports' | 'suv' | 'sedan' | 'electric';
  available: boolean;
}
