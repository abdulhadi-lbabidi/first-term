import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Branch } from '../../types';
import { Link } from 'react-router-dom';

// Fix for default marker icon in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LiveMapProps {
  branches: Branch[];
  currentLang: string;
  selectedBranchId?: string | null;
  branchAvailability?: Record<string, number> | null;
  checkIn?: string;
  checkOut?: string;
}

// A helper component to move the map to the selected location
function MapFlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.5 });
  }, [center, map]);
  return null;
}

// Helper to create custom div icon
const createCustomIcon = (availableCount: number | null, isSelected: boolean) => {
  const hasNoAvailability = availableCount === 0;
  const countDisplay = availableCount !== null ? availableCount : '';
  const bgColor = hasNoAvailability ? 'bg-error' : (availableCount !== null ? 'bg-success' : 'bg-primary');
  
  const html = `
    <div class="relative flex flex-col items-center justify-center transform ${isSelected ? 'scale-125 z-50' : 'scale-100'} transition-transform duration-300 drop-shadow-md">
      <div class="${bgColor} text-white font-bold text-xs w-9 h-9 rounded-full flex items-center justify-center border-2 border-white relative z-10">
        ${countDisplay !== '' ? countDisplay : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`}
      </div>
      <div class="w-3 h-3 ${bgColor} rotate-45 -mt-2 border-r-2 border-b-2 border-white"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'bg-transparent border-0',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44]
  });
};

export default function LiveMap({ branches, currentLang, selectedBranchId, branchAvailability, checkIn, checkOut }: LiveMapProps) {
  const mapRef = useRef<L.Map>(null);

  // Default center (can be middle of the world or first branch)
  const defaultCenter: [number, number] = branches.length > 0 && branches[0].lat && branches[0].lng 
    ? [branches[0].lat, branches[0].lng] 
    : [25.2048, 55.2708]; // Dubai

  const selectedBranch = branches.find(b => b.id === selectedBranchId);
  const flyToCenter: [number, number] | null = selectedBranch?.lat && selectedBranch?.lng
    ? [selectedBranch.lat, selectedBranch.lng]
    : null;

  return (
    <div className="w-full h-full relative rounded-[2rem] overflow-hidden border border-border/20 shadow-xl z-0">
      <MapContainer
        center={defaultCenter}
        zoom={3}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {flyToCenter && <MapFlyTo center={flyToCenter} />}

        {branches.map((branch) => {
          if (!branch.lat || !branch.lng) return null;
          
          const availableCount = branchAvailability ? branchAvailability[branch.id] : null;
          const hasNoAvailability = availableCount === 0;
          
          let roomsUrl = `/${currentLang}/rooms?branch=${branch.id}`;
          if (checkIn && checkOut) {
            roomsUrl += `&check_in=${checkIn}&check_out=${checkOut}`;
          }

          return (
            <Marker 
              key={branch.id} 
              position={[branch.lat, branch.lng]}
              icon={createCustomIcon(availableCount, branch.id === selectedBranchId)}
            >
              <Popup className="custom-popup">
                <div className="text-center font-interfaceEn min-w-[220px]">
                  <div className="relative">
                    <img 
                      src={branch.image} 
                      alt={currentLang === 'ar' ? branch.nameAr : branch.nameEn} 
                      className={`w-full h-28 object-cover rounded-lg mb-3 shadow-sm ${hasNoAvailability ? 'grayscale' : ''}`}
                    />
                    {branchAvailability && (
                      <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm ${hasNoAvailability ? 'bg-error/90 text-white' : 'bg-success/90 text-white'}`}>
                        {hasNoAvailability 
                          ? (currentLang === 'ar' ? 'غير متاح' : 'Not available')
                          : `${availableCount}`
                        }
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-[15px] text-ink mb-1">
                    {currentLang === 'ar' ? branch.nameAr : branch.nameEn}
                  </h3>
                  <p className="text-[12px] text-muted mb-4 line-clamp-2 leading-relaxed">
                    {currentLang === 'ar' ? branch.addressAr : branch.addressEn}
                  </p>
                  
                  {hasNoAvailability ? (
                    <div className="block w-full bg-surface-soft text-muted py-2 rounded-lg text-[13px] font-semibold">
                      {currentLang === 'ar' ? 'لا يوجد غرف' : 'No Rooms'}
                    </div>
                  ) : (
                    <Link 
                      to={roomsUrl}
                      className="block w-full bg-primary text-white py-2 rounded-lg text-[13px] font-semibold hover:bg-primary-hover transition-colors"
                    >
                      {currentLang === 'ar' ? 'عرض الغرف المتاحة' : 'View Rooms'}
                    </Link>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
