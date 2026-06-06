import Slider from 'react-slick';
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronUp, Clock, DollarSign, Globe, List, Map, MapPin, Phone, Star } from 'lucide-react';
import { KidsZone } from '../types';

interface ZoneCarouselProps {
  zones: KidsZone[];
  onZoneClick: (zone: KidsZone) => void;
  onCurrentZoneChange: (zone: KidsZone) => void;
  selectedZone: KidsZone | null;
  showResultList: boolean;
  showSearchDetail: boolean;
  isPanelHidden: boolean;
  onResultSelect: (zone: KidsZone) => void;
  onBackToResults: () => void;
  onHidePanel: () => void;
  onShowPanel: () => void;
}

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50"
    >
      <ChevronRight size={24} className="text-gray-700" />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50"
    >
      <ChevronLeft size={24} className="text-gray-700" />
    </button>
  );
}

function ZoneDetailCard({
  zone,
  onClick,
  compact = false,
}: {
  zone: KidsZone;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white cursor-pointer transition-shadow ${
        compact ? 'p-5' : 'rounded-t-3xl shadow-2xl p-6 hover:shadow-3xl'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold mb-2`}>{zone.name}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-block px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 font-medium">
              {zone.category}
            </span>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={18} fill="currentColor" />
              <span className="font-semibold">{zone.rating}</span>
              <span className="text-sm text-gray-500">({zone.reviewCount})</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`${compact ? 'space-y-2' : 'space-y-3'} mb-4`}>
        <div className="flex items-start gap-3">
          <MapPin size={20} className="text-gray-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-gray-700">{zone.address}</p>
            <p className="text-sm text-blue-600 mt-1">📍 {zone.distance}km</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone size={20} className="text-gray-600 flex-shrink-0" />
          <a href={`tel:${zone.phone}`} className="text-blue-600 hover:underline">
            {zone.phone}
          </a>
        </div>

        {zone.website && (
          <div className="flex items-center gap-3">
            <Globe size={20} className="text-gray-600 flex-shrink-0" />
            <a
              href={zone.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm truncate"
            >
              홈페이지 방문
            </a>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Clock size={20} className="text-gray-600 flex-shrink-0" />
          <p className="text-gray-700 text-sm">{zone.openHours}</p>
        </div>

        <div className="flex items-center gap-3">
          <DollarSign size={20} className="text-gray-600 flex-shrink-0" />
          <p className="text-gray-700 text-sm">{zone.price}</p>
        </div>
      </div>

      <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
        {zone.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {zone.facilities.slice(0, 4).map((facility, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {facility}
          </span>
        ))}
        {zone.facilities.length > 4 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            +{zone.facilities.length - 4}
          </span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">탭하여 상세정보 보기</p>
      </div>
    </div>
  );
}

export default function ZoneCarousel({
  zones,
  onZoneClick,
  onCurrentZoneChange,
  selectedZone,
  showResultList,
  showSearchDetail,
  isPanelHidden,
  onResultSelect,
  onBackToResults,
  onHidePanel,
  onShowPanel,
}: ZoneCarouselProps) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    afterChange: (current: number) => {
      if (zones[current]) {
        onCurrentZoneChange(zones[current]);
      }
    }
  };

  if (zones.length === 0) {
    if (isPanelHidden) {
      return (
        <button
          type="button"
          onClick={onShowPanel}
          className="absolute bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-lg"
        >
          <ChevronUp size={16} />
          결과 보기
        </button>
      );
    }

    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-8 text-center z-50">
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onHidePanel}
            className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700"
          >
            <Map size={16} />
            지도만 보기
          </button>
        </div>
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      </div>
    );
  }

  if (isPanelHidden) {
    return (
      <button
        type="button"
        onClick={onShowPanel}
        className="absolute bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-lg"
      >
        {showResultList ? <List size={16} /> : <ChevronUp size={16} />}
        {showResultList ? '검색 결과 보기' : '장소 카드 보기'}
      </button>
    );
  }

  if (showResultList) {
    const currentZone = selectedZone && zones.some((zone) => zone.id === selectedZone.id)
      ? selectedZone
      : zones[0];

    if (showSearchDetail) {
      return (
        <div className="absolute bottom-0 left-0 right-0 z-50 px-4 pb-4">
          <div className="max-h-[72vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-100 bg-white px-5 py-3">
              <button
                type="button"
                onClick={onBackToResults}
                className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700"
              >
                <ArrowLeft size={16} />
                목록 보기
              </button>
              <button
                type="button"
                onClick={onHidePanel}
                className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700"
              >
                <Map size={16} />
                지도만 보기
              </button>
            </div>
            <ZoneDetailCard
              zone={currentZone}
              compact
              onClick={() => onZoneClick(currentZone)}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="absolute bottom-0 left-0 right-0 z-50 px-4 pb-4">
        <div className="max-h-[72vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl">
          <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-gray-900">이 지역 검색 결과</h2>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  {zones.length}곳
                </span>
                <button
                  type="button"
                  onClick={onHidePanel}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700"
                >
                  <Map size={16} />
                  지도만 보기
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-[58vh] overflow-y-auto divide-y divide-gray-100">
            {zones.map((zone) => {
              const isSelected = currentZone.id === zone.id;

              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => {
                    onCurrentZoneChange(zone);
                    onResultSelect(zone);
                  }}
                  className={`flex w-full items-start gap-3 px-5 py-3 text-left transition ${
                    isSelected ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {zone.id}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-gray-900">{zone.name}</span>
                    <span className="mt-1 block truncate text-sm text-gray-600">{zone.address}</span>
                    <span className="mt-1 block text-xs text-blue-600">{zone.category} · {zone.distance}km</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50">
      <div className="absolute -top-12 right-6 z-20">
        <button
          type="button"
          onClick={onHidePanel}
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-lg"
        >
          <Map size={16} />
          지도만 보기
        </button>
      </div>
      <Slider {...settings}>
        {zones.map((zone) => (
          <div key={zone.id}>
            <div className="px-6 pb-6">
              <ZoneDetailCard zone={zone} onClick={() => onZoneClick(zone)} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
