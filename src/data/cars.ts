import { Car } from '@/lib/supabase';

// This will be populated by the Supabase fetch
export let cars: Car[] = [];

// Function to fetch cars from Supabase
export async function fetchCars() {
  try {
    const { getCars } = await import('@/app/actions/booking');
    cars = await getCars();
    return cars;
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

// Initialize cars on module load
fetchCars().catch(console.error);
