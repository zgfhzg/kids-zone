import { MapPin, Phone, Globe, Star } from 'lucide-react';
import { KidsZone } from '../types';

interface ZoneCardProps {
  zone: KidsZone;
  onClick: () => void;
}

export default function ZoneCard({ zone, onClick }: ZoneCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{zone.name}</h3>
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            {zone.category}
          </span>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star size={16} fill="currentColor" />
          <span className="text-sm font-medium">{zone.rating}</span>
        </div>
      </div>

      <div className="space-y-2 mt-3">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin size={16} className="mt-0.5 flex-shrink-0" />
          <span>{zone.address}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={16} />
          <span>{zone.phone}</span>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2">{zone.description}</p>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          {zone.distance}km · 후기 {zone.reviewCount}개
        </p>
      </div>
    </div>
  );
}
