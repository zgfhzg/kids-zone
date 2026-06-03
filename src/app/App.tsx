'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, Menu, LocateFixed } from 'lucide-react';
import KidsZoneMap from './components/KidsZoneMap';
import ZoneCarousel from './components/ZoneCarousel';
import ZoneDetailModal from './components/ZoneDetailModal';
import { mockKidsZones, categories } from './data/mockData';
import { KidsZone } from './types';

export default function App() {
  const defaultCenter = { lat: 37.4979, lng: 127.0276 };
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [zones, setZones] = useState<KidsZone[]>(mockKidsZones);
  const [selectedZone, setSelectedZone] = useState<KidsZone | null>(mockKidsZones[0]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [searchCenter, setSearchCenter] = useState(defaultCenter);
  const [hasMapMoved, setHasMapMoved] = useState(false);
  const [manualSearchVersion, setManualSearchVersion] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingZones, setIsLoadingZones] = useState(true);
  const [dataSource, setDataSource] = useState<'kakao' | 'cache' | 'mock'>('mock');
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsLoadingZones(true);
      setLoadError(null);

      try {
        const params = new URLSearchParams({
          category: selectedCategory,
          query: searchQuery,
          lat: String(searchCenter.lat),
          lng: String(searchCenter.lng),
        });
        const response = await fetch(`/api/kids-zones?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch kids zones');
        }

        const data = (await response.json()) as {
          zones: KidsZone[];
          source: 'kakao' | 'cache';
          queries?: string[];
        };
        const nextZones = data.zones.length > 0 ? data.zones : mockKidsZones;

        setZones(nextZones);
        setDataSource(data.zones.length > 0 ? data.source : 'mock');
        setSelectedZone((currentZone) => {
          if (!nextZones.length) {
            return null;
          }

          return nextZones.find((zone) => zone.name === currentZone?.name) ?? nextZones[0];
        });
      } catch (error) {
        if (!controller.signal.aborted) {
          setZones(mockKidsZones);
          setSelectedZone(mockKidsZones[0]);
          setDataSource('mock');
          setLoadError('실제 장소 데이터를 불러오지 못해 샘플 데이터를 표시 중입니다.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingZones(false);
        }
      }
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [selectedCategory, searchQuery, searchCenter, manualSearchVersion]);

  const filteredZones = useMemo(() => {
    let filtered = zones;

    if (selectedCategory !== '전체') {
      filtered = filtered.filter(zone => zone.category === selectedCategory);
    }

    if (searchQuery && dataSource === 'mock') {
      filtered = filtered.filter(zone =>
        zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery, zones, dataSource]);

  const sourceLabel = dataSource === 'mock' ? '샘플 데이터' : '카카오 Local API';
  const hasSearchableMapMove =
    hasMapMoved &&
    (Math.abs(mapCenter.lat - searchCenter.lat) > 0.0002 ||
      Math.abs(mapCenter.lng - searchCenter.lng) > 0.0002);

  const handleZoneClick = (zone: KidsZone) => {
    setSelectedZone(zone);
    setShowDetailModal(true);
  };

  const handleCurrentZoneChange = (zone: KidsZone) => {
    setSelectedZone(zone);
  };

  return (
    <div className="relative h-dvh min-h-dvh w-full overflow-hidden bg-gray-50">
      <div className="absolute inset-0 z-0">
        <KidsZoneMap
          zones={filteredZones}
          onMarkerClick={setSelectedZone}
          selectedZone={selectedZone}
          onCenterChange={(center, isUserMove) => {
            setMapCenter(center);
            if (isUserMove) {
              setHasMapMoved(true);
            }
          }}
        />
      </div>

      <div className="absolute top-0 left-0 right-0 z-40">
        <div className="bg-white/95 backdrop-blur-sm shadow-md p-4">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="text-blue-600" size={28} />
            <h1 className="text-xl font-bold text-gray-900 flex-1">키즈존 맵</h1>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="#뛰어놀기 #체험 #물놀이처럼 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          {showFilters && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          <div className="mt-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-gray-600">
                총 <span className="font-semibold text-blue-600">{filteredZones.length}</span>개의 키즈존
                <span className="ml-2 text-gray-400">
                  {isLoadingZones ? '불러오는 중' : sourceLabel}
                </span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchCenter(mapCenter);
                  setHasMapMoved(false);
                  setManualSearchVersion((version) => version + 1);
                }}
                disabled={!hasSearchableMapMove || isLoadingZones}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
              >
                <LocateFixed size={14} />
                이 지역 검색
              </button>
            </div>
            {loadError && (
              <p className="mt-1 text-xs text-red-500">{loadError}</p>
            )}
          </div>
        </div>
      </div>

      <ZoneCarousel
        zones={filteredZones}
        onZoneClick={handleZoneClick}
        onCurrentZoneChange={handleCurrentZoneChange}
      />

      {showDetailModal && selectedZone && (
        <ZoneDetailModal
          zone={selectedZone}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
}
