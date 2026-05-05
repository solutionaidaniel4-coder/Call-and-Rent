'use client';

import { useState, useMemo, useEffect } from 'react';
import CarCard from '@/components/CarCard';
import FilterDrawer from '@/components/FilterDrawer';
import Header from '@/components/Header';
import { getCars, sendCarInquiry } from '@/app/actions/booking';
import { Car } from '@/lib/supabase';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('all');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inquiryMessage, setInquiryMessage] = useState<string>('');

  // Fetch cars from Supabase on component mount
  useEffect(() => {
    const fetchCarsData = async () => {
      try {
        const carsData = await getCars();
        setCars(carsData);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarsData();
  }, []);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedTransmission('all');
  };

  const handleInquire = async (carId: string, carName: string) => {
    setInquiryMessage(`Sending inquiry for ${carName}...`);
    try {
      const result = await sendCarInquiry(carId, carName);
      setInquiryMessage(result.message);
      setTimeout(() => setInquiryMessage(''), 5000);
    } catch (error) {
      setInquiryMessage('Failed to send inquiry. Please try again.');
      setTimeout(() => setInquiryMessage(''), 5000);
    }
  };

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const categoryMatch = selectedCategory === 'all' || car.category === selectedCategory;
      const transmissionMatch = selectedTransmission === 'all' || car.transmission === selectedTransmission;
      return categoryMatch && transmissionMatch;
    });
  }, [selectedCategory, selectedTransmission, cars]);

  const categories = ['all', 'Economy', 'SUV', 'Premium'];
  const transmissions = ['all', 'Manual', 'Automatic'];

  return (
    <div className="min-h-screen bg-cream windsurf-pattern">
      {/* Sticky Header */}
      <Header />

      {/* Inquiry Notification Banner */}
      {inquiryMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-charcoal-900 text-white px-6 py-3 rounded-xl shadow-lg">
          <p className="text-sm font-medium">{inquiryMessage}</p>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-charcoal-900 tracking-tight">
              Drive Tirana <span style={{ color: '#2ee5b5' }}>Your Way</span>
            </h1>
            <p className="text-lg md:text-xl text-charcoal-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Premium car rentals in Tirana with 24/7 support and no hidden fees
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-charcoal-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2ee5b5' }}></div>
                Instant Booking
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2ee5b5' }}></div>
                Free Cancellation
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2ee5b5' }}></div>
                24/7 Support
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal-900 mb-2">Choose Your Vehicle</h2>
            <p className="text-charcoal-600">Select from our premium fleet of vehicles</p>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="w-full bg-white border border-charcoal-200 rounded-xl px-4 py-3 flex items-center justify-between hover:border-windsurf-300 transition-all shadow-sm"
            >
              <span className="text-charcoal-700 font-medium">Filters</span>
              <div className="flex items-center space-x-2">
                {(selectedCategory !== 'all' || selectedTransmission !== 'all') && (
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#2ee5b5', color: 'white' }}>
                    {selectedCategory !== 'all' && selectedTransmission !== 'all' ? '2' : '1'}
                  </span>
                )}
                <svg className="w-5 h-5 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            <div className="mt-3 text-sm text-charcoal-500 text-center">
              Showing {filteredCars.length} of {cars.length} cars
            </div>
          </div>

          {/* Desktop Filter Bar */}
          <div className="hidden lg:flex items-center justify-center gap-4 mb-8">
            {/* Category Filter */}
            <div className="flex items-center gap-2 bg-white rounded-xl border border-charcoal-200 p-1 shadow-sm">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'text-charcoal-900 shadow-sm'
                      : 'text-charcoal-600 hover:text-charcoal-900'
                  }`}
                  style={selectedCategory === category ? { backgroundColor: '#2ee5b515' } : {}}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>

            <div className="w-px h-8 bg-charcoal-200"></div>

            {/* Transmission Filter */}
            <div className="flex items-center gap-2 bg-white rounded-xl border border-charcoal-200 p-1 shadow-sm">
              {transmissions.map((transmission) => (
                <button
                  key={transmission}
                  onClick={() => setSelectedTransmission(transmission)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedTransmission === transmission
                      ? 'text-charcoal-900 shadow-sm'
                      : 'text-charcoal-600 hover:text-charcoal-900'
                  }`}
                  style={selectedTransmission === transmission ? { backgroundColor: '#2ee5b515' } : {}}
                >
                  {transmission === 'all' ? 'All' : transmission}
                </button>
              ))}
            </div>

            <div className="w-px h-8 bg-charcoal-200"></div>

            {/* Results Count */}
            <span className="text-sm text-charcoal-500">
              {filteredCars.length} cars
            </span>
          </div>
        </div>
      </section>

      {/* Car Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} onInquire={handleInquire} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2ee5b515' }}>
                <svg className="w-8 h-8" style={{ color: '#2ee5b5' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-charcoal-600 text-lg mb-2">No cars match your filters</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTransmission('all');
                }}
                className="text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: '#2ee5b5' }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        selectedCategory={selectedCategory}
        selectedTransmission={selectedTransmission}
        onCategoryChange={setSelectedCategory}
        onTransmissionChange={setSelectedTransmission}
        onClearFilters={handleClearFilters}
      />

    </div>
  );
}
