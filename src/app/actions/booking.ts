'use server';

import { supabase, Car, Booking, ContactForm } from '@/lib/supabase';

// Get all available cars
export async function getCars(): Promise<Car[]> {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'your_supabase_project_url') {
      // Return mock data for testing
      return [
        {
          id: '1',
          name: 'BMW 3 Series',
          category: 'Premium',
          price_per_day: 150,
          transmission: 'Automatic',
          image: '/api/placeholder/400/300',
          status: 'available',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Mercedes C-Class',
          category: 'Premium',
          price_per_day: 160,
          transmission: 'Automatic',
          image: '/api/placeholder/400/300',
          status: 'available',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Toyota RAV4',
          category: 'SUV',
          price_per_day: 120,
          transmission: 'Automatic',
          image: '/api/placeholder/400/300',
          status: 'available',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Nissan Sentra',
          category: 'Economy',
          price_per_day: 80,
          transmission: 'Manual',
          image: '/api/placeholder/400/300',
          status: 'available',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }

    if (!supabase) {
      // This should not happen since we have mock data fallback above
      return [];
    }

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('status', 'available')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching cars:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

// Get all bookings from the database
export async function getBookings(): Promise<Booking[]> {
  try {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

// Create a new booking
export async function createBooking(bookingData: Omit<Booking, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<Booking> {
  try {
    if (!supabase) {
      // Return mock booking for testing
      return {
        ...bookingData,
        id: 'mock-booking-' + Date.now(),
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
    
    if (!bookingData) {
      throw new Error('Booking data is required');
    }

    // First, check if the car is still available
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('status')
      .eq('id', bookingData.car_id)
      .single();

    if (carError || car?.status !== 'available') {
      throw new Error('Car is no longer available');
    }

    // Create the booking
    const { data: newBooking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        ...bookingData,
        status: 'pending'
      }])
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      throw new Error('Failed to create booking');
    }

    // Update car status to 'rented'
    const { error: updateError } = await supabase
      .from('cars')
      .update({ status: 'rented' })
      .eq('id', bookingData.car_id);

    if (updateError) {
      console.error('Error updating car status:', updateError);
      // Don't throw here, the booking was created successfully
    }

    return newBooking;
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
}

// Check if car is available for the selected dates
export async function checkCarAvailability(carId: string, pickUpDate: string, dropOffDate?: string): Promise<{
  isAvailable: boolean;
  conflictingBookings?: Booking[];
}> {
  try {
    const startDate = new Date(pickUpDate);
    const endDate = dropOffDate ? new Date(dropOffDate) : new Date(pickUpDate);
    
    // Default to 1 day if no drop-off date specified
    if (!dropOffDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    if (!supabase) {
      // Mock availability check - always return available for testing
      return {
        isAvailable: true,
        conflictingBookings: undefined
      };
    }

    // Get all confirmed bookings for this car
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('car_id', carId)
      .in('status', ['confirmed', 'pending']);

    if (error) {
      console.error('Error checking availability:', error);
      return { isAvailable: false };
    }

    const conflictingBookings = bookings?.filter(booking => {
      const bookingStart = new Date(booking.pick_up_date);
      const bookingEnd = booking.drop_off_date ? new Date(booking.drop_off_date) : new Date(booking.pick_up_date);
      const requestedStart = new Date(pickUpDate);
      const requestedEnd = dropOffDate ? new Date(dropOffDate) : new Date(pickUpDate);

      return (
        (requestedStart >= bookingStart && requestedStart <= bookingEnd) ||
        (requestedEnd >= bookingStart && requestedEnd <= bookingEnd) ||
        (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
      );
    });

    return {
      isAvailable: conflictingBookings.length === 0,
      conflictingBookings: conflictingBookings.length > 0 ? conflictingBookings : undefined
    };
  } catch (error) {
    console.error('Error in checkCarAvailability:', error);
    return { isAvailable: false };
  }
}

// Calculate total price based on days and price per day
export async function calculateTotalPrice(pricePerDay: number, pickUpDate: string, dropOffDate?: string): Promise<{
  totalPrice: number;
  days: number;
}> {
  const startDate = new Date(pickUpDate);
  const endDate = dropOffDate ? new Date(dropOffDate) : new Date(pickUpDate);
  
  // Default to 1 day if no drop-off date specified
  if (!dropOffDate) {
    endDate.setDate(endDate.getDate() + 1);
  }
  
  // Calculate the difference in days
  const timeDifference = endDate.getTime() - startDate.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  const days = Math.max(1, daysDifference);
  
  return {
    totalPrice: pricePerDay * days,
    days
  };
}

// Send contact form data to Supabase
export async function sendContactForm(formData: {
  name: string;
  email?: string;
  phone: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    if (!formData) {
      throw new Error('Form data is required');
    }

    if (!supabase) {
      // Mock success for testing
      return {
        success: true,
        message: 'Your message has been sent successfully! We will contact you soon.'
      };
    }

    const { data, error } = await supabase
      .from('contact_forms')
      .insert([formData])
      .select()
      .single();

    if (error) {
      console.error('Error saving contact form:', error);
      return {
        success: false,
        message: 'Failed to save your message. Please try again.'
      };
    }

    return {
      success: true,
      message: 'Your message has been sent successfully! We will contact you soon.'
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      message: 'An error occurred while sending your message.'
    };
  }
}
