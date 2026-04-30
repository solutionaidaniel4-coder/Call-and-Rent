'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  carName?: string;
}

export default function WhatsAppButton({ carName = '' }: WhatsAppButtonProps) {
  const phoneNumber = '355XXXXXXXXX'; // Replace with actual Albanian phone number
  
  const handleClick = () => {
    const message = carName 
      ? `I am interested in renting the ${carName}.`
      : `I am interested in renting a car from Call & Rent.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-windsurf-500 hover:bg-windsurf-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
      aria-label="Contact on WhatsApp"
    >
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-windsurf-500 rounded-full animate-ping opacity-75"></div>
        <div className="absolute inset-0 bg-windsurf-500 rounded-full animate-pulse opacity-50"></div>
        
        {/* WhatsApp icon */}
        <MessageCircle className="w-6 h-6 relative z-10" />
      </div>
    </button>
  );
}
