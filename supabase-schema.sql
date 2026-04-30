-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Economy', 'SUV', 'Premium')),
  price_per_day DECIMAL(10,2) NOT NULL CHECK (price_per_day > 0),
  transmission TEXT NOT NULL CHECK (transmission IN ('Manual', 'Automatic')),
  image TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  car_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  pick_up_date DATE NOT NULL,
  drop_off_date DATE,
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price > 0),
  price_per_day DECIMAL(10,2) NOT NULL CHECK (price_per_day > 0),
  days INTEGER NOT NULL CHECK (days > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_forms table
CREATE TABLE IF NOT EXISTS contact_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_category ON cars(category);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_pick_up_date ON bookings(pick_up_date);

-- Create updated_at trigger for cars
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cars_updated_at BEFORE UPDATE
    ON cars FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE
    ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample cars data
INSERT INTO cars (name, category, price_per_day, transmission, image, status) VALUES
('Toyota Corolla', 'Economy', 35.00, 'Manual', '/images/toyota-corolla.jpg', 'available'),
('Honda Civic', 'Economy', 40.00, 'Automatic', '/images/honda-civic.jpg', 'available'),
('Ford Explorer', 'SUV', 65.00, 'Automatic', '/images/ford-explorer.jpg', 'available'),
('Toyota RAV4', 'SUV', 70.00, 'Automatic', '/images/toyota-rav4.jpg', 'available'),
('BMW 3 Series', 'Premium', 85.00, 'Automatic', '/images/bmw-3-series.jpg', 'available'),
('Mercedes C-Class', 'Premium', 95.00, 'Automatic', '/images/mercedes-c-class.jpg', 'available')
ON CONFLICT DO NOTHING;

-- Set up Row Level Security (RLS)
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Cars are viewable by everyone" ON cars
    FOR SELECT USING (true);

CREATE POLICY "Bookings are viewable by everyone" ON bookings
    FOR SELECT USING (true);

CREATE POLICY "Contact forms are insertable by everyone" ON contact_forms
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Contact forms are viewable by everyone" ON contact_forms
    FOR SELECT USING (true);
