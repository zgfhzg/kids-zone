import Slider from 'react-slick';
import { MapPin, Phone, Star, Clock, DollarSign, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { KidsZone } from '../types';

interface ZoneCarouselProps {
  zones: KidsZone[];
  onZoneClick: (zone: KidsZone) => void;
  onCurrentZoneChange: (zone: KidsZone) => void;
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

export default function ZoneCarousel({ zones, onZoneClick, onCurrentZoneChange }: ZoneCarouselProps) {
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
    return (
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-8 text-center">
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50">
      <Slider {...settings}>
        {zones.map((zone) => (
          <div key={zone.id}>
            <div className="px-6 pb-6">
              <div
                onClick={() => onZoneClick(zone)}
                className="bg-white rounded-t-3xl shadow-2xl p-6 cursor-pointer hover:shadow-3xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{zone.name}</h2>
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

                <div className="space-y-3 mb-4">
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
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
