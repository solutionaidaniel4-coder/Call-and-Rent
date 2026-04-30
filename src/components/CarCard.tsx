'use client';

import { Settings, Users, Fuel, Check } from 'lucide-react';

interface CarCardProps {
  car: {
    id: string;
    name: string;
    category: string;
    price_per_day: number;
    transmission: string;
    image: string;
  };
  onBookNow: (car: any) => void;
}

export default function CarCard({ car, onBookNow }: CarCardProps) {
  const getTransmissionIcon = (transmission: string) => {
    return <Settings className="w-5 h-5 text-charcoal-600" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Economy':
        return 'bg-green-100 text-green-800';
      case 'SUV':
        return 'bg-blue-100 text-blue-800';
      case 'Premium':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-charcoal-100 overflow-hidden hover:shadow-lg hover:border-charcoal-200 transition-all duration-300">
      {/* Car Image Area */}
      <div className="relative h-48 bg-gradient-to-br from-charcoal-50 to-charcoal-100 overflow-hidden">
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(car.category)}`}>
            {car.category}
          </span>
        </div>
        
        {/* Placeholder Car */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-20 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#40E0BA20' }}>
            <svg className="w-12 h-12" style={{ color: '#40E0BA' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Car Name */}
        <h3 className="text-xl font-bold text-charcoal-900 mb-2">{car.name}</h3>
        
        {/* Specs Row */}
        <div className="flex items-center gap-4 mb-4 text-sm text-charcoal-600">
          <span className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            {car.transmission}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            5 Seats
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-charcoal-100 my-4"></div>

        {/* Price & Button Row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold" style={{ color: '#40E0BA' }}>${car.price_per_day}</div>
            <div className="text-sm text-charcoal-500">per day</div>
          </div>
          
          <button 
            onClick={() => onBookNow(car)}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
            style={{ backgroundColor: '#40E0BA' }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
