# Supabase Integration Setup Guide

## Overview
This guide will help you set up the Supabase integration for the Call & Rent car rental platform.

## Prerequisites
- A Supabase account (https://supabase.com)
- Node.js and npm installed

## Step 1: Create Supabase Project
1. Go to https://supabase.com and sign in
2. Click "New Project" 
3. Choose your organization
4. Enter project name: `call-and-rent`
5. Set a strong database password
6. Choose a region closest to your users
7. Click "Create new project"

## Step 2: Get Project Credentials
1. Once your project is ready, go to Settings > API
2. Copy the Project URL and Anon Key
3. Update your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 3: Set Up Database Tables
1. Go to the SQL Editor in your Supabase project
2. Copy and paste the contents of `supabase-schema.sql`
3. Click "Run" to execute the SQL

This will create:
- `cars` table with status column (available/rented)
- `bookings` table with user info, car ID, and total price
- `contact_forms` table for contact submissions
- Proper indexes and RLS policies
- Sample car data

## Step 4: Install Dependencies
```bash
npm install @supabase/supabase-js
```

## Step 5: Verify Integration
1. Start your development server:
```bash
npm run dev
```

2. The application should now:
- Fetch cars from Supabase instead of static data
- Save bookings to the database
- Update car status when booked
- Store contact form submissions

## Database Schema

### Cars Table
```sql
CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Economy', 'SUV', 'Premium')),
  price_per_day DECIMAL(10,2) NOT NULL,
  transmission TEXT NOT NULL CHECK (transmission IN ('Manual', 'Automatic')),
  image TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  car_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  pick_up_date DATE NOT NULL,
  drop_off_date DATE,
  total_price DECIMAL(10,2) NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  days INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Features Implemented

### 1. Live Car Data
- Cars are fetched from Supabase database
- Only shows cars with status 'available'
- Real-time updates when cars are booked

### 2. Booking System
- Creates booking records in Supabase
- Automatically updates car status to 'rented'
- Calculates total price based on rental days
- Stores customer information and dates

### 3. Contact Forms
- Contact submissions saved to database
- Proper validation and error handling
- Success/error feedback to users

### 4. Data Integrity
- Foreign key constraints between bookings and cars
- Check constraints for valid categories and statuses
- Row Level Security (RLS) policies for public access

## Testing the Integration

1. **Test Car Loading**: 
   - Visit the homepage
   - Cars should load from Supabase database
   - Check browser console for any errors

2. **Test Booking Creation**:
   - Select a car and click "Select Car"
   - Fill out the booking form
   - Submit the booking
   - Check Supabase dashboard for new booking record
   - Verify car status changed to 'rented'

3. **Test Contact Form**:
   - Click "Contact Us" in header
   - Fill and submit the form
   - Check Supabase dashboard for new contact record

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure your Supabase project allows requests from your domain
2. **Connection Errors**: Verify your environment variables are correct
3. **Permission Errors**: Check RLS policies in Supabase

### Debug Tips
- Check browser console for JavaScript errors
- Verify network requests in browser dev tools
- Check Supabase logs for database errors
- Ensure environment variables are loaded correctly

## Production Deployment

For production deployment:
1. Add your Supabase credentials to your hosting platform's environment variables
2. Ensure your database has proper backup policies
3. Consider implementing additional security measures
4. Set up monitoring for database performance

## Next Steps

Potential enhancements:
- Add authentication for admin users
- Implement real-time updates with Supabase Realtime
- Add file storage for car images
- Implement payment processing
- Add analytics and reporting
