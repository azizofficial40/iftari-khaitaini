import React from 'react';
import { IftarLocation } from '../types';
import { MapPin, Clock, Phone, Utensils, ThumbsUp, ThumbsDown, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface LocationCardProps {
  location: IftarLocation;
  onClick?: () => void;
  className?: string;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onClick, className }) => {
  const isVerified = location.verificationStatus === 'verified';
  const isSuspicious = location.verificationStatus === 'suspicious';

  return (
    <div 
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-emerald-100 transition-all duration-300 cursor-pointer relative group",
        className
      )}
      onClick={onClick}
    >
      {isVerified && (
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-emerald-100 z-10">
          <CheckCircle size={12} className="text-emerald-500" /> নিশ্চিত
        </div>
      )}
      {isSuspicious && (
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-red-100 z-10">
          <AlertTriangle size={12} className="text-red-500" /> সন্দেহজনক
        </div>
      )}
      
      {location.imageUrl && (
        <div className="h-36 w-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
          <img src={location.imageUrl} alt={location.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute bottom-2 left-3 text-white">
             <span className="text-[10px] bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/20 capitalize">
                {location.category === 'mosque' ? 'মসজিদ' : 
                 location.category === 'organization' ? 'সংগঠন' : 'ব্যক্তিগত'}
             </span>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">{location.name}</h3>
          {!location.imageUrl && (
             <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-200 capitalize mt-1 inline-block">
                {location.category === 'mosque' ? 'মসজিদ' : 
                 location.category === 'organization' ? 'সংগঠন' : 'ব্যক্তিগত'}
             </span>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2.5 text-gray-600 text-sm">
            <MapPin size={16} className="mt-0.5 shrink-0 text-emerald-500" />
            <span className="line-clamp-2 text-xs md:text-sm leading-relaxed">{location.address}</span>
          </div>

          <div className="flex items-center gap-2.5 text-gray-600 text-sm">
            <Clock size={16} className="shrink-0 text-emerald-500" />
            <span className="font-medium text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded text-xs">{location.time}</span>
          </div>

          <div className="flex items-start gap-2.5 text-gray-600 text-sm">
            <Utensils size={16} className="mt-0.5 shrink-0 text-emerald-500" />
            <span className="line-clamp-1 text-xs md:text-sm italic text-gray-500">{location.menu}</span>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 mt-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">
              <ThumbsUp size={12} /> {location.votes.true}
            </span>
            <span className="flex items-center gap-1.5 text-red-500 font-medium bg-red-50 px-2 py-1 rounded-md">
              <ThumbsDown size={12} /> {location.votes.fake}
            </span>
          </div>
          <span className="text-[10px] text-gray-400">বিস্তারিত দেখুন &rarr;</span>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
