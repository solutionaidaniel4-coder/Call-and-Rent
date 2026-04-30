'use client';

import { X } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  selectedTransmission: string;
  onCategoryChange: (category: string) => void;
  onTransmissionChange: (transmission: string) => void;
  onClearFilters: () => void;
}

export default function FilterDrawer({
  isOpen,
  onClose,
  selectedCategory,
  selectedTransmission,
  onCategoryChange,
  onTransmissionChange,
  onClearFilters,
}: FilterDrawerProps) {
  const categories = ['all', 'Economy', 'SUV', 'Premium'];
  const transmissions = ['all', 'Manual', 'Automatic'];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors duration-200 ${
                      selectedCategory === category
                        ? 'bg-windsurf-500 text-white border-windsurf-500'
                        : 'bg-white text-charcoal-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Transmission Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Transmission</label>
              <div className="space-y-2">
                {transmissions.map((transmission) => (
                  <button
                    key={transmission}
                    onClick={() => onTransmissionChange(transmission)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors duration-200 ${
                      selectedTransmission === transmission
                        ? 'bg-windsurf-500 text-white border-windsurf-500'
                        : 'bg-white text-charcoal-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {transmission === 'all' ? 'All Transmissions' : transmission}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button
              onClick={onClose}
              className="w-full bg-windsurf-500 hover:bg-windsurf-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Apply Filters
            </button>
            <button
              onClick={onClearFilters}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
