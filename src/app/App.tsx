'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bookmark, ChevronLeft, LocateFixed, MapPin, Menu, Search, SlidersHorizontal, X } from 'lucide-react';
import KidsZoneMap from './components/KidsZoneMap';
import ZoneCarousel from './components/ZoneCarousel';
import { mockKidsZones, categories } from './data/mockData';
import { KidsZone } from './types';

const SAVED_ZONES_STORAGE_KEY = 'kids-zone.saved-zones';

function getZoneKey(zone: KidsZone) {
  return `${zone.name}|${zone.address}`;
}

export default function App() {
  const defaultCenter = { lat: 37.4979, lng: 127.0276 };
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [zones, setZones] = useState<KidsZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<KidsZone | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [searchCenter, setSearchCenter] = useState(defaultCenter);
  const [hasMapMoved, setHasMapMoved] = useState(false);
  const [manualSearchVersion, setManualSearchVersion] = useState(0);
  const [showSearchDetail, setShowSearchDetail] = useState(false);
  const [showAreaResultsList, setShowAreaResultsList] = useState(true);
  const [isBottomPanelHidden, setIsBottomPanelHidden] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [savedZones, setSavedZones] = useState<KidsZone[]>([]);
  const [isLoadingZones, setIsLoadingZones] = useState(true);
  const [isInitialLocationResolved, setIsInitialLocationResolved] = useState(false);
  const [dataSource, setDataSource] = useState<'kakao' | 'cache' | 'mock'>('mock');
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const rawSavedZones = window.localStorage.getItem(SAVED_ZONES_STORAGE_KEY);
      if (rawSavedZones) {
        setSavedZones(JSON.parse(rawSavedZones) as KidsZone[]);
      }
    } catch {
      setSavedZones([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SAVED_ZONES_STORAGE_KEY, JSON.stringify(savedZones));
  }, [savedZones]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setIsInitialLocationResolved(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setMapCenter(currentCenter);
        setSearchCenter(currentCenter);
        setHasMapMoved(false);
        setShowAreaResultsList(true);
        setIsInitialLocationResolved(true);
      },
      () => {
        setShowAreaResultsList(true);
        setIsInitialLocationResolved(true);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000 * 60 * 5,
        timeout: 5000,
      }
    );
  }, []);

  useEffect(() => {
    if (!isInitialLocationResolved) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsLoadingZones(true);
      setLoadError(null);
      setShowSearchDetail(false);
      setIsBottomPanelHidden(false);

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
  }, [selectedCategory, searchQuery, searchCenter, manualSearchVersion, isInitialLocationResolved]);

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

  const handleMapMarkerClick = (zone: KidsZone) => {
    setSelectedZone(zone);
    setShowSearchDetail(true);
    setIsBottomPanelHidden(false);
  };

  const handleCurrentZoneChange = (zone: KidsZone) => {
    setSelectedZone(zone);
  };

  const isZoneSaved = (zone: KidsZone) => {
    const zoneKey = getZoneKey(zone);
    return savedZones.some((savedZone) => getZoneKey(savedZone) === zoneKey);
  };

  const handleToggleSave = (zone: KidsZone) => {
    const zoneKey = getZoneKey(zone);

    setSavedZones((currentSavedZones) => {
      if (currentSavedZones.some((savedZone) => getZoneKey(savedZone) === zoneKey)) {
        return currentSavedZones.filter((savedZone) => getZoneKey(savedZone) !== zoneKey);
      }

      return [zone, ...currentSavedZones];
    });
  };

  return (
    <div className="relative h-dvh min-h-dvh w-full overflow-hidden bg-gray-50">
      <div className="absolute inset-0 z-0">
        <KidsZoneMap
          zones={filteredZones}
          center={mapCenter}
          onMarkerClick={handleMapMarkerClick}
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
              type="button"
              onClick={() => setShowMainMenu((isOpen) => !isOpen)}
              aria-label="메뉴 열기"
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>

          {showMainMenu && (
            <div className="absolute right-4 top-14 z-50 w-48 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setShowFilters((isOpen) => !isOpen);
                  setShowMainMenu(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                <SlidersHorizontal size={17} />
                필터
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSavedItems(true);
                  setIsBottomPanelHidden(false);
                  setShowMainMenu(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50"
              >
                <span className="inline-flex items-center gap-3">
                  <Bookmark size={17} />
                  저장된 항목
                </span>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                  {savedZones.length}
                </span>
              </button>
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="#뛰어놀기 #체험 #물놀이처럼 검색하세요..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAreaResultsList(false);
              }}
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
                  setShowSearchDetail(false);
                  setShowAreaResultsList(true);
                  setShowSavedItems(false);
                  setIsBottomPanelHidden(false);
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

      {showSavedItems ? (
        isBottomPanelHidden ? (
          <button
            type="button"
            onClick={() => setIsBottomPanelHidden(false)}
            className="absolute bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-lg"
          >
            <Bookmark size={16} />
            저장된 항목 보기
          </button>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 z-50 px-4 pb-4">
            <div className="max-h-[72vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSavedItems(false)}
                    aria-label="저장된 항목 닫기"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <h2 className="text-lg font-bold text-gray-900">저장된 항목</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBottomPanelHidden(true)}
                  aria-label="패널 닫기"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>

              {savedZones.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-gray-500">
                  저장된 항목이 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {savedZones.map((zone) => (
                    <div key={getZoneKey(zone)} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50">
                      <Bookmark size={18} className="mt-1 shrink-0 text-blue-600" fill="currentColor" />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedZone(zone);
                          setSelectedCategory('전체');
                          setSearchQuery('');
                          setShowSavedItems(false);
                          setShowSearchDetail(true);
                          setShowAreaResultsList(true);
                          setIsBottomPanelHidden(false);
                        }}
                        className="min-w-0 flex-1 text-left"
                      >
                        <span className="block truncate font-semibold text-gray-900">{zone.name}</span>
                        <span className="mt-1 block truncate text-sm text-gray-600">{zone.address}</span>
                        <span className="mt-1 block text-xs text-blue-600">{zone.category} · {zone.distance}km</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleSave(zone)}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        <ZoneCarousel
          zones={filteredZones}
          onCurrentZoneChange={handleCurrentZoneChange}
          selectedZone={selectedZone}
          showResultList={searchQuery.trim().length > 0 || showAreaResultsList}
          showSearchDetail={showSearchDetail}
          isPanelHidden={isBottomPanelHidden}
          onResultSelect={(zone) => {
            setSelectedZone(zone);
            setShowSearchDetail(true);
          }}
          onBackToResults={() => setShowSearchDetail(false)}
          onHidePanel={() => setIsBottomPanelHidden(true)}
          onShowPanel={() => setIsBottomPanelHidden(false)}
          isZoneSaved={isZoneSaved}
          onToggleSave={handleToggleSave}
        />
      )}

    </div>
  );
}
