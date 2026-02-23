import React, { useState } from 'react';
import { useLocations } from '../hooks/useLocations';
import MapComponent from '../components/MapComponent';
import LocationCard from '../components/LocationCard';
import LocationDetailsModal from '../components/LocationDetailsModal';
import { Search, Filter, Map as MapIcon, List } from 'lucide-react';
import { DISTRICTS, CATEGORIES, IftarLocation } from '../types';

export default function Home() {
  const { locations, loading } = useLocations();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [filterDistrict, setFilterDistrict] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<IftarLocation | null>(null);

  const filteredLocations = locations.filter(loc => {
    const matchesDistrict = filterDistrict ? loc.district === filterDistrict : true;
    const matchesCategory = filterCategory ? loc.category === filterCategory : true;
    const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          loc.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white rounded-2xl md:rounded-3xl p-6 md:p-12 text-center relative overflow-hidden shadow-2xl border border-emerald-700/50">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 drop-shadow-sm">
            ইফতারি খাইতাইনি
          </h1>
          <p className="text-base md:text-xl text-emerald-100 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            সিলেট বিভাগের আজকের ইফতার লোকেশন ম্যাপে দেখুন। খুঁজে নিন আপনার কাছের ইফতার বিতরণের স্থান।
          </p>
          
          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative group">
            <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-md group-hover:blur-lg transition-all opacity-0 group-hover:opacity-100"></div>
            <input
              type="text"
              placeholder="স্থান বা মসজিদের নাম খুঁজুন..."
              className="w-full py-3.5 px-6 pr-14 rounded-full text-gray-800 bg-white/95 backdrop-blur-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/30 shadow-xl transition-all placeholder:text-gray-400 text-sm md:text-base relative z-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 p-2.5 rounded-full text-white hover:bg-emerald-500 transition-colors z-20 shadow-md">
              <Search size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Filters & View Toggle */}
      <div className="sticky top-[72px] z-40 bg-gray-50/95 backdrop-blur-sm py-2 -mx-4 px-4 md:static md:bg-transparent md:p-0 md:mx-0">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200/60">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <select 
              className="px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all min-w-[120px]"
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
            >
              <option value="">সকল জেলা</option>
              {DISTRICTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>

            <select 
              className="px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all min-w-[120px]"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">সকল ধরণ</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="flex bg-gray-100 p-1.5 rounded-lg w-full md:w-auto">
            <button 
              onClick={() => setViewMode('map')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-semibold transition-all ${viewMode === 'map' ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
            >
              <MapIcon size={16} /> ম্যাপ
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-semibold transition-all ${viewMode === 'list' ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
            >
              <List size={16} /> লিস্ট
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
        {/* List View */}
        <div className={`lg:col-span-1 overflow-y-auto pr-1 space-y-4 ${viewMode === 'map' ? 'hidden lg:block' : 'block'}`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">তথ্য লোড হচ্ছে...</p>
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">কোন তথ্য পাওয়া যায়নি</h3>
              <p className="text-gray-500 text-sm">অন্য কিওওয়ার্ড দিয়ে চেষ্টা করুন</p>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              <p className="text-sm text-gray-500 font-medium px-1">মোট {filteredLocations.length} টি লোকেশন পাওয়া গেছে</p>
              {filteredLocations.map(location => (
                <LocationCard 
                  key={location.id} 
                  location={location} 
                  onClick={() => setSelectedLocation(location)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Map View */}
        <div className={`lg:col-span-2 bg-gray-100 rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative ${viewMode === 'list' ? 'hidden lg:block' : 'block h-full'}`}>
          <MapComponent 
            locations={filteredLocations} 
            onMarkerClick={setSelectedLocation}
          />
        </div>
      </div>

      {/* Details Modal */}
      {selectedLocation && (
        <LocationDetailsModal 
          location={selectedLocation} 
          onClose={() => setSelectedLocation(null)} 
        />
      )}
    </div>
  );
}
