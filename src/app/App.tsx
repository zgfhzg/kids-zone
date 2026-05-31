'use client';

import { useState, useMemo } from 'react';
import { Search, MapPin, Menu } from 'lucide-react';
import KidsZoneMap from './components/KidsZoneMap';
import ZoneCarousel from './components/ZoneCarousel';
import ZoneDetailModal from './components/ZoneDetailModal';
import { mockKidsZones, categories } from './data/mockData';
import { KidsZone } from './types';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<KidsZone | null>(mockKidsZones[0]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredZones = useMemo(() => {
    let filtered = mockKidsZones;

    if (selectedCategory !== '전체') {
      filtered = filtered.filter(zone => zone.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(zone =>
        zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

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
              placeholder="장소명, 주소로 검색하세요..."
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
            <p className="text-xs text-gray-600">
              총 <span className="font-semibold text-blue-600">{filteredZones.length}</span>개의 키즈존
            </p>
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
