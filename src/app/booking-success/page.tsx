'use client';

import { useEffect, useState } from 'react';
import { Check, MapPin, Calendar, CreditCard, Car } from 'lucide-react';
import Link from 'next/link';

interface BookingDetails {
  userName: string;
  carName: string;
  totalPrice: number;
  pickUpDate: string;
  dropOffDate?: string;
  days: number;
  paymentMethod: 'pickup' | 'online';
}

export default function BookingSuccess() {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch booking details from URL params or API
    // For now, we'll use mock data from localStorage or URL params
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    // Mock booking details - in production, this would come from your database
    const mockBooking: BookingDetails = {
      userName: 'Alex Johnson', // This would come from the booking data
      carName: 'BMW 3 Series',
      totalPrice: 425.00,
      pickUpDate: '2024-06-15',
      dropOffDate: '2024-06-18',
      days: 3,
      paymentMethod: 'online'
    };

    // Simulate loading and then set booking details
    setTimeout(() => {
      setBookingDetails(mockBooking);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-windsurf-500"></div>
          <p className="mt-4 text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find your booking details.</p>
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-windsurf-500 text-white rounded-lg hover:bg-windsurf-600 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Animated Checkmark */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-windsurf-50 mb-6 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-windsurf-500 flex items-center justify-center animate-bounce">
                <Check className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Success Message */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Ride is Ready, <span style={{ color: '#40E0BA' }}>{bookingDetails.userName}!</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Booking confirmed! We've sent the details to your WhatsApp.
            </p>
          </div>

          {/* Booking Summary Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-windsurf-500 to-windsurf-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Car className="w-8 h-8 text-white" />
                  <h2 className="text-2xl font-bold text-white">Booking Summary</h2>
                </div>
                <div className="text-white">
                  <span className="text-sm opacity-90">Booking ID</span>
                  <p className="font-mono font-semibold">#CRN-2024-{Math.floor(Math.random() * 10000)}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Car Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Car className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{bookingDetails.carName}</h4>
                          <p className="text-gray-600">Premium Category</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transmission:</span>
                          <span className="font-medium">Automatic</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Seats:</span>
                          <span className="font-medium">5 Adults</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fuel:</span>
                          <span className="font-medium">Petrol</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pickup Location */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup Location</h3>
                    <div className="bg-windsurf-50 rounded-lg p-6 border border-windsurf-200">
                      <div className="flex items-start space-x-3">
                        <MapPin className="w-6 h-6 text-windsurf-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Tirana International Airport</h4>
                          <p className="text-gray-600 text-sm mt-1">
                            Mother Teresa Square, Tirana, Albania<br />
                            Arrivals Hall - Look for "Call & Rent" sign
                          </p>
                          <p className="text-sm text-windsurf-600 font-medium mt-2">
                            Open 24/7
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rental Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Period</h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Pick-up</p>
                            <p className="font-semibold">{new Date(bookingDetails.pickUpDate).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}</p>
                            <p className="text-sm text-gray-600">10:00 AM</p>
                          </div>
                        </div>
                        
                        {bookingDetails.dropOffDate && (
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600">Drop-off</p>
                              <p className="font-semibold">{new Date(bookingDetails.dropOffDate).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</p>
                              <p className="text-sm text-gray-600">10:00 AM</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Total Rental Period</span>
                            <span className="font-semibold text-gray-900">{bookingDetails.days} {bookingDetails.days === 1 ? 'day' : 'days'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Daily Rate</span>
                          <span className="font-medium">${(bookingDetails.totalPrice / bookingDetails.days).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rental Days</span>
                          <span className="font-medium">{bookingDetails.days}</span>
                        </div>
                        {bookingDetails.paymentMethod === 'online' && (
                          <div className="flex justify-between text-green-600">
                            <span>Online Discount (5%)</span>
                            <span className="font-medium">-${(bookingDetails.totalPrice * 0.05).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">Total Paid</span>
                            <span className="text-2xl font-bold" style={{ color: '#40E0BA' }}>
                              ${bookingDetails.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Payment Method: {bookingDetails.paymentMethod === 'online' ? 'Paid Online' : 'Pay at Pickup'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Information</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">·</span>
                <span>Please bring a valid driver's license and credit card for pickup</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">·</span>
                <span>A security deposit of $200 will be held on your credit card</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">·</span>
                <span>Free cancellation up to 24 hours before pickup</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">·</span>
                <span>WhatsApp support available at +355 69 123 4567</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Browse More Cars
            </Link>
            <button 
              onClick={() => window.print()}
              className="inline-flex items-center justify-center px-8 py-4 bg-windsurf-500 text-white rounded-lg hover:bg-windsurf-600 transition-colors font-semibold"
            >
              Print Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
