'use client';

import { useState } from 'react';
import ContactModal from './ContactModal';

interface HeaderProps {
  onContactClick?: () => void;
}

export default function Header({ onContactClick }: HeaderProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
    onContactClick?.();
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-charcoal-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#40E0BA' }}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-charcoal-900 tracking-tight">Call & Rent</span>
              </div>
            </div>

            {/* Contact Us Button */}
            <div className="flex items-center">
              <button 
                onClick={handleContactClick}
                className="font-semibold py-2.5 px-5 rounded-xl text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
                style={{ backgroundColor: '#40E0BA' }}
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={handleCloseContactModal} />
    </>
  );
}
