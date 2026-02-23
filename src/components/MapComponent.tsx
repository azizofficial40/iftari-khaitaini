import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { IftarLocation } from '../types';
import { Crosshair } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon missing in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Center of Sylhet Division
const defaultCenter: [number, number] = [24.8949, 91.8687];

interface MapComponentProps {
  locations: IftarLocation[];
  onMarkerClick?: (location: IftarLocation) => void;
}

function LocationMarker() {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function MyLocationButton() {
  const map = useMap();
  
  const handleMyLocation = () => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, 14);
    });
  };

  return (
    <button
      onClick={handleMyLocation}
      className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-gray-600 hover:text-emerald-600 transition-colors z-[1000]"
      title="আমার লোকেশন"
    >
      <Crosshair size={24} />
    </button>
  );
}

export default function MapComponent({ locations, onMarkerClick }: MapComponentProps) {
  const [selectedLocation, setSelectedLocation] = useState<IftarLocation | null>(null);

  return (
    <div className="relative w-full h-full z-0">
      <MapContainer 
        center={defaultCenter} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            eventHandlers={{
              click: () => {
                setSelectedLocation(location);
                if (onMarkerClick) onMarkerClick(location);
              },
            }}
          >
            <Popup>
              <div className="min-w-[200px] max-w-[250px]">
                <h3 className="font-bold text-sm mb-1">{location.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{location.menu}</p>
                <p className="text-xs font-semibold text-emerald-600">{location.time}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        <MyLocationButton />
      </MapContainer>
    </div>
  );
}
