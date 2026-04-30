import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create Supabase client if properly configured
export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_project_url' 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Types for our database tables
export interface Car {
  id: string;
  name: string;
  category: string;
  price_per_day: number;
  transmission: string;
  image: string;
  status: 'available' | 'rented';
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  car_id: string;
  car_name: string;
  customer_name: string;
  whatsapp_number: string;
  pick_up_date: string;
  drop_off_date?: string;
  total_price: number;
  price_per_day: number;
  days: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface ContactForm {
  id: string;
  name: string;
  email?: string;
  phone: string;
  message: string;
  created_at: string;
}
