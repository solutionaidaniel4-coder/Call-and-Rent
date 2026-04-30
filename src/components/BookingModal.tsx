'use client';

import { useState, useEffect } from 'react';
import { X, Settings, Users, CreditCard, Truck } from 'lucide-react';
import { createBooking, calculateTotalPrice, checkCarAvailability } from '@/app/actions/booking';
import { createStripeCheckoutSession } from '@/app/actions/stripe';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: {
    id: string;
    name: string;
    category: string;
    price_per_day: number;
    transmission: string;
    image: string;
  };
}

export default function BookingModal({ isOpen, onClose, car }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    whatsappNumber: '',
    pickUpDate: '',
    dropOffDate: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'pickup' | 'online'>('pickup');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [totalPrice, setTotalPrice] = useState({ totalPrice: 0, days: 1 });
  const [availability, setAvailability] = useState<{ isAvailable: boolean; conflictingBookings?: any[] } | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  // Calculate total price and check availability whenever dates or price changes
  useEffect(() => {
    if (formData.pickUpDate) {
      const calculation = calculateTotalPrice(car.price_per_day, formData.pickUpDate, formData.dropOffDate);
      setTotalPrice(calculation);
      
      // Check availability
      const checkAvailability = async () => {
        setIsCheckingAvailability(true);
        try {
          const availabilityResult = await checkCarAvailability(car.id, formData.pickUpDate, formData.dropOffDate);
          setAvailability(availabilityResult);
        } catch (error) {
          console.error('Error checking availability:', error);
          setAvailability({ isAvailable: false });
        } finally {
          setIsCheckingAvailability(false);
        }
      };
      
      checkAvailability();
    } else {
      setTotalPrice({ totalPrice: 0, days: 1 });
      setAvailability(null);
    }
  }, [formData.pickUpDate, formData.dropOffDate, car.price_per_day, car.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const finalPrice = calculateFinalPrice();
      const bookingData = {
        car_id: car.id,
        car_name: car.name,
        customer_name: formData.name,
        whatsapp_number: formData.whatsappNumber,
        pick_up_date: formData.pickUpDate,
        drop_off_date: formData.dropOffDate || null,
        total_price: finalPrice,
        price_per_day: car.price_per_day,
        days: totalPrice.days,
      };
      
      if (paymentMethod === 'online') {
        setSubmitMessage('Creating secure payment session...');
        
        // Create Stripe checkout session
        const { url, error } = await createStripeCheckoutSession(bookingData);
        
        if (error) {
          setSubmitMessage('Failed to create payment session. Please try again.');
          return;
        }
        
        // Redirect to Stripe checkout (in real implementation)
        setSubmitMessage('Redirecting to secure payment...');
        // window.location.href = url; // Uncomment in production
        
        // For demo purposes, simulate successful payment after 2 seconds
        setTimeout(() => {
          setSubmitMessage('Payment successful! Booking confirmed. We will contact you via WhatsApp within 24 hours.');
          setTimeout(() => {
            onClose();
            setSubmitMessage('');
            setCurrentStep(1);
          }, 2000);
        }, 2000);
      } else {
        // Pay at pickup
        const booking = await createBooking(bookingData);
        setSubmitMessage('Booking confirmed! Please pay at pickup. We will contact you via WhatsApp within 24 hours.');
        
        setTimeout(() => {
          onClose();
          setSubmitMessage('');
          setCurrentStep(1);
        }, 3000);
      }
    } catch (error) {
      setSubmitMessage('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentMethodChange = (method: 'pickup' | 'online') => {
    setPaymentMethod(method);
  };

  const calculateFinalPrice = () => {
    const basePrice = totalPrice.totalPrice;
    return paymentMethod === 'online' ? basePrice * 0.95 : basePrice; // 5% discount for online
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Complete Your Booking</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-windsurf-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 1 ? 'bg-windsurf-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Select Dates</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-windsurf-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 2 ? 'bg-windsurf-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Your Info</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${currentStep >= 3 ? 'text-windsurf-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= 3 ? 'bg-windsurf-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Car Details - Always Visible */}
          <div className="w-1/2 p-6 border-r border-gray-200">
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm font-medium">Car Image</span>
                </div>
              </div>
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  {car.category}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{car.name}</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                ¥{car.price_per_day}
                <span className="text-lg text-gray-600 font-normal">/day</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{car.transmission} Transmission</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">5 Seats</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Air Conditioning</span>
              </div>
            </div>

            {/* Price Summary - Always Visible */}
            {formData.pickUpDate && (
              <div className="mt-6 bg-windsurf-50 rounded-lg p-4 border border-windsurf-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-charcoal-600">Daily Rate:</span>
                  <span className="font-semibold text-charcoal-900">${car.price_per_day}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-charcoal-600">Days:</span>
                  <span className="font-semibold text-charcoal-900">{totalPrice.days}</span>
                </div>
                {paymentMethod === 'online' && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-green-600">Online Discount (5%):</span>
                    <span className="font-semibold text-green-600">-${(totalPrice.totalPrice * 0.05).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-windsurf-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-charcoal-900">Total Price:</span>
                    <span className="text-xl font-bold" style={{ color: '#40E0BA' }}>${calculateFinalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Availability Status */}
            {availability && (
              <div className={`mt-4 rounded-lg p-3 ${
                availability.isAvailable 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {availability.isAvailable ? (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Available for selected dates</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Already Reserved - Please choose different dates</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dynamic Content Based on Step */}
          <div className="w-1/2 p-6">
            {/* Step 1: Date Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Rental Dates</h3>
                
                <div>
                  <label htmlFor="pickUpDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Pick-up Date *
                  </label>
                  <input
                    type="date"
                    id="pickUpDate"
                    name="pickUpDate"
                    value={formData.pickUpDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-windsurf-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="dropOffDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Drop-off Date (Optional)
                  </label>
                  <input
                    type="date"
                    id="dropOffDate"
                    name="dropOffDate"
                    value={formData.dropOffDate}
                    onChange={handleChange}
                    min={formData.pickUpDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-windsurf-500 focus:border-transparent transition-colors"
                  />
                </div>

                {isCheckingAvailability && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-windsurf-600"></div>
                    <p className="text-sm text-gray-600 mt-2">Checking availability...</p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!formData.pickUpDate || isCheckingAvailability || !availability?.isAvailable}
                    className="px-6 py-2 bg-windsurf-500 text-white rounded-lg hover:bg-windsurf-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: User Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-windsurf-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-windsurf-500 focus:border-transparent transition-colors"
                    placeholder="+355 12 345 6789"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!formData.name || !formData.whatsappNumber}
                    className="px-6 py-2 bg-windsurf-500 text-white rounded-lg hover:bg-windsurf-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handlePaymentMethodChange('pickup')}
                    className={`w-full p-4 border rounded-lg text-left transition-colors ${
                      paymentMethod === 'pickup'
                        ? 'border-windsurf-500 bg-windsurf-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <Truck className="w-6 h-6 text-windsurf-600 mr-3" />
                      <div>
                        <div className="font-semibold text-gray-900">Pay at Pickup</div>
                        <div className="text-sm text-gray-600">Cash or Card when you collect the car</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePaymentMethodChange('online')}
                    className={`w-full p-4 border rounded-lg text-left transition-colors ${
                      paymentMethod === 'online'
                        ? 'border-windsurf-500 bg-windsurf-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center">
                      <CreditCard className="w-6 h-6 text-windsurf-600 mr-3" />
                      <div>
                        <div className="font-semibold text-gray-900">Pay Online Now</div>
                        <div className="text-sm font-medium" style={{ color: '#40E0BA' }}>Save 5% - ${calculateFinalPrice().toFixed(2)}</div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Submit Message */}
                {submitMessage && (
                  <div className={`rounded-lg p-3 text-sm ${
                    submitMessage.includes('confirmed') 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {submitMessage}
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-windsurf-500 text-white rounded-lg hover:bg-windsurf-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Processing...' : paymentMethod === 'online' ? 'Pay Now' : 'Complete Booking'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            By completing this booking, you agree to our terms and conditions. We'll contact you via WhatsApp within 24 hours to confirm your reservation.
          </p>
        </div>
      </div>
    </div>
  );
}
