import { useEffect, useRef, useState } from 'react';
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

declare global {
  interface Window {
    kakao?: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (container: HTMLElement, options: Record<string, unknown>) => KakaoMap;
        CustomOverlay: new (options: Record<string, unknown>) => KakaoOverlay;
        event: {
          addListener: (target: unknown, event: string, handler: () => void) => void;
        };
      };
    };
    __kakaoMapsPromise?: Promise<void>;
  }
}

interface KakaoMap {
  setCenter: (position: unknown) => void;
  setLevel: (level: number) => void;
}

interface KakaoOverlay {
  setMap: (map: KakaoMap | null) => void;
}

function loadKakaoMaps() {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (window.kakao?.maps) {
    return new Promise<void>((resolve) => window.kakao?.maps.load(resolve));
  }

  if (window.__kakaoMapsPromise) {
    return window.__kakaoMapsPromise;
  }

  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_JS_KEY;

  window.__kakaoMapsPromise = new Promise<void>((resolve, reject) => {
    if (!appKey) {
      reject(new Error('NEXT_PUBLIC_KAKAO_MAP_JS_KEY is missing'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.async = true;
    script.onload = () => window.kakao?.maps.load(resolve);
    script.onerror = () => reject(new Error('Failed to load Kakao Maps SDK'));
    document.head.appendChild(script);
  });

  return window.__kakaoMapsPromise;
}

export default function KidsZoneMap({ zones, onMarkerClick, selectedZone }: KidsZoneMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const overlaysRef = useRef<KakaoOverlay[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    loadKakaoMaps()
      .then(() => {
        if (!isMounted || !window.kakao?.maps || !mapContainerRef.current || mapRef.current) {
          return;
        }

        const centerZone = selectedZone ?? zones[0];
        const center = new window.kakao.maps.LatLng(
          centerZone?.lat ?? 37.4979,
          centerZone?.lng ?? 127.0276
        );

        mapRef.current = new window.kakao.maps.Map(mapContainerRef.current, {
          center,
          level: 6,
        });
        setMapReady(true);
      })
      .catch(() => {
        if (isMounted) {
          setLoadError('카카오맵 SDK를 불러오지 못했습니다.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedZone, zones]);

  useEffect(() => {
    const kakaoMaps = window.kakao?.maps;

    if (!mapReady || !kakaoMaps || !mapRef.current) {
      return;
    }

    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = zones.map((zone) => {
      const isSelected = selectedZone?.id === zone.id;
      const color = categoryColors[zone.category] || '#6b7280';
      const marker = document.createElement('button');
      marker.type = 'button';
      marker.title = zone.name;
      marker.className = 'kakao-zone-marker';
      marker.style.backgroundColor = color;
      marker.style.width = isSelected ? '42px' : '34px';
      marker.style.height = isSelected ? '42px' : '34px';
      marker.style.borderWidth = isSelected ? '4px' : '3px';
      marker.style.boxShadow = isSelected
        ? `0 14px 30px ${color}55`
        : '0 10px 22px rgba(15, 23, 42, 0.2)';
      marker.innerHTML = `<span>${zone.id}</span>`;
      marker.addEventListener('click', () => onMarkerClick(zone));

      const overlay = new kakaoMaps.CustomOverlay({
        position: new kakaoMaps.LatLng(zone.lat, zone.lng),
        content: marker,
        yAnchor: 1,
        zIndex: isSelected ? 20 : 10,
      });

      overlay.setMap(mapRef.current);
      return overlay;
    });

    if (selectedZone) {
      mapRef.current.setCenter(new kakaoMaps.LatLng(selectedZone.lat, selectedZone.lng));
      mapRef.current.setLevel(5);
    }
  }, [zones, selectedZone, onMarkerClick, mapReady]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-100">
      <div ref={mapContainerRef} className="absolute inset-0" />

      {loadError && (
        <div className="absolute inset-x-4 top-40 z-20 rounded-lg bg-white p-4 text-sm text-gray-700 shadow-lg">
          {loadError}
        </div>
      )}

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
