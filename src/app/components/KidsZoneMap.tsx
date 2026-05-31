import { MapPin } from 'lucide-react';
import { KidsZone } from '../types';

interface KidsZoneMapProps {
  zones: KidsZone[];
  onMarkerClick: (zone: KidsZone) => void;
  selectedZone: KidsZone | null;
}

const categoryColors: Record<string, string> = {
  '실내놀이터': '#ef4444',
  '키즈카페': '#3b82f6',
  '어린이박물관': '#22c55e',
  '체험센터': '#f97316',
  '키즈풀': '#a855f7',
  '놀이공원': '#eab308'
};

export default function KidsZoneMap({ zones, onMarkerClick, selectedZone }: KidsZoneMapProps) {
  const centerLat = 37.4979;
  const centerLng = 127.0276;

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {zones.map((zone, index) => {
          const lngOffset = (zone.lng - centerLng) * 420;
          const latOffset = (centerLat - zone.lat) * 520;
          const fallbackX = 18 + (index % 5) * 16;
          const fallbackY = 28 + Math.floor(index / 5) * 18;
          const x = Math.max(10, Math.min(90, 50 + lngOffset || fallbackX));
          const y = Math.max(18, Math.min(86, 50 + latOffset || fallbackY));
          const isSelected = selectedZone?.id === zone.id;

          return (
            <g key={zone.id}>
              <circle
                cx={x}
                cy={y}
                r={isSelected ? "5" : "3.8"}
                fill={categoryColors[zone.category] || '#6b7280'}
                opacity="0.3"
                className="transition-all"
              />
              <g
                onClick={() => onMarkerClick(zone)}
                style={{ cursor: 'pointer' }}
                className="hover:scale-110 transition-transform"
              >
                <path
                  d={`M ${x},${y + 3.8} C ${x - 3.8},${y - 1} ${x - 2.8},${y - 6.4} ${x},${y - 6.4} C ${x + 2.8},${y - 6.4} ${x + 3.8},${y - 1} ${x},${y + 3.8} Z`}
                  fill={categoryColors[zone.category] || '#6b7280'}
                  stroke="white"
                  strokeWidth={isSelected ? "0.9" : "0.6"}
                  vectorEffect="non-scaling-stroke"
                />
                <circle
                  cx={x}
                  cy={y - 2.2}
                  r={isSelected ? "1.7" : "1.35"}
                  fill="white"
                />
                <text
                  x={x}
                  y={y - 1.55}
                  textAnchor="middle"
                  fontSize={isSelected ? "2.2" : "1.8"}
                  fill={categoryColors[zone.category] || '#6b7280'}
                  fontWeight="bold"
                  dominantBaseline="middle"
                >
                  {zone.id}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <MapPin size={16} className="text-blue-600" />
          <span>내 위치 주변</span>
        </h3>
        <div className="space-y-1">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-gray-700">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
