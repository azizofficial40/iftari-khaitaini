import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DISTRICTS, CATEGORIES } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Crosshair } from 'lucide-react';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Default center (Sylhet)
const defaultCenter: [number, number] = [24.8949, 91.8687];

function LocationPicker({ onLocationSelect, initialPosition }: { onLocationSelect: (lat: number, lng: number) => void, initialPosition?: [number, number] }) {
  const [position, setPosition] = useState<L.LatLng | null>(initialPosition ? new L.LatLng(initialPosition[0], initialPosition[1]) : null);
  
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (initialPosition) {
       map.setView(initialPosition, 15);
    }
  }, [initialPosition, map]);

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function MyLocationButton({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const map = useMap();
  const [loading, setLoading] = useState(false);

  const handleMyLocation = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true);
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, 16);
      onLocationFound(e.latlng.lat, e.latlng.lng);
      setLoading(false);
    }).on("locationerror", function() {
      toast.error("লোকেশন পাওয়া যাচ্ছে না।");
      setLoading(false);
    });
  };

  return (
    <button
      onClick={handleMyLocation}
      className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-md text-gray-600 hover:text-emerald-600 transition-colors z-[1000] flex items-center gap-2 text-sm font-medium"
      title="আমার বর্তমান লোকেশন"
      type="button"
    >
      <Crosshair size={18} />
      {loading ? 'খোঁজা হচ্ছে...' : 'আমার লোকেশন'}
    </button>
  );
}

export default function AddLocation() {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);

  // Watch lat/lng to update map if manually entered (optional, but good for UX)
  const lat = watch('lat');
  const lng = watch('lng');

  const handleLocationSelect = (lat: number, lng: number) => {
    setValue('lat', lat.toFixed(6));
    setValue('lng', lng.toFixed(6));
    setSelectedPosition([lat, lng]);
  };

  const onSubmit = async (data: any) => {
    try {
      await addDoc(collection(db, 'locations'), {
        ...data,
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
        votes: { true: 0, fake: 0 },
        comments: [],
        isApproved: false, // Requires admin approval
        createdAt: new Date(),
        verificationStatus: 'unverified'
      });
      
      toast.success('তথ্য সফলভাবে জমা দেওয়া হয়েছে! এডমিন অ্যাপ্রুভ করলে দেখা যাবে।');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error('কোথাও ভুল হয়েছে, আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 my-4 md:my-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">নতুন ইফতার লোকেশন</h2>
        <p className="text-gray-500 text-sm">সঠিক তথ্য দিয়ে অন্যদের সাহায্য করুন</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">মসজিদ বা সংস্থার নাম <span className="text-red-500">*</span></label>
            <input 
              {...register('name', { required: true })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
              placeholder="উদাঃ শাহজালাল মাজার মসজিদ"
            />
            {errors.name && <span className="text-red-500 text-xs font-medium">নাম আবশ্যক</span>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">ধরণ <span className="text-red-500">*</span></label>
            <div className="relative">
              <select 
                {...register('category', { required: true })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none text-sm"
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">জেলা <span className="text-red-500">*</span></label>
            <div className="relative">
              <select 
                {...register('district', { required: true })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none text-sm"
              >
                {DISTRICTS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">সময় <span className="text-red-500">*</span></label>
            <input 
              {...register('time', { required: true })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
              placeholder="উদাঃ ৫:৪৫ PM"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">ঠিকানা <span className="text-red-500">*</span></label>
          <textarea 
            {...register('address', { required: true })}
            rows={2}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm resize-none"
            placeholder="বিস্তারিত ঠিকানা দিন..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">ইফতার মেনু <span className="text-red-500">*</span></label>
          <input 
            {...register('menu', { required: true })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
            placeholder="উদাঃ খিচুড়ি, ছোলা, খেজুর"
          />
        </div>

        {/* Map Picker Section */}
        <div className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-emerald-900">ম্যাপে লোকেশন সিলেক্ট করুন <span className="text-red-500">*</span></label>
            <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">আবশ্যক</span>
          </div>
          <div className="h-72 w-full rounded-xl overflow-hidden border-2 border-white shadow-sm relative z-0">
            <MapContainer 
              center={defaultCenter} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationPicker onLocationSelect={handleLocationSelect} initialPosition={selectedPosition || undefined} />
              <MyLocationButton onLocationFound={handleLocationSelect} />
            </MapContainer>
          </div>
          <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
            <Crosshair size={12} />
            ম্যাপে ক্লিক করে বা 'আমার লোকেশন' বাটন চেপে সঠিক জায়গাটি বেছে নিন
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500">Latitude</label>
            <input 
              type="number" step="any"
              {...register('lat', { required: true })}
              className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50 text-xs font-mono text-gray-600 focus:ring-1 focus:ring-emerald-500 outline-none"
              placeholder="24.89..."
              readOnly
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500">Longitude</label>
            <input 
              type="number" step="any"
              {...register('lng', { required: true })}
              className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50 text-xs font-mono text-gray-600 focus:ring-1 focus:ring-emerald-500 outline-none"
              placeholder="91.87..."
              readOnly
            />
          </div>
          {(errors.lat || errors.lng) && <p className="col-span-2 text-red-500 text-xs text-center font-medium bg-red-50 py-1 rounded">অনুগ্রহ করে ম্যাপ থেকে লোকেশন সিলেক্ট করুন</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">যোগাযোগ নম্বর (ঐচ্ছিক)</label>
          <input 
            {...register('contact')}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
            placeholder="017..."
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? 'জমা দেওয়া হচ্ছে...' : 'তথ্য জমা দিন'}
        </button>
      </form>
    </div>
  );
}
