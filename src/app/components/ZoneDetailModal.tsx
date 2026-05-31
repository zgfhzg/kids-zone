import { X, MapPin, Phone, Globe, Clock, Star, DollarSign } from 'lucide-react';
import { KidsZone } from '../types';

interface ZoneDetailModalProps {
  zone: KidsZone | null;
  onClose: () => void;
}

export default function ZoneDetailModal({ zone, onClose }: ZoneDetailModalProps) {
  if (!zone) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{zone.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              {zone.category}
            </span>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={18} fill="currentColor" />
              <span className="font-medium">{zone.rating}</span>
              <span className="text-sm text-gray-500">({zone.reviewCount})</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-gray-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">주소</p>
                <p className="text-gray-700">{zone.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={20} className="text-gray-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">전화번호</p>
                <a href={`tel:${zone.phone}`} className="text-blue-600 hover:underline">
                  {zone.phone}
                </a>
              </div>
            </div>

            {zone.website && (
              <div className="flex items-start gap-3">
                <Globe size={20} className="text-gray-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">홈페이지</p>
                  <a
                    href={zone.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {zone.website}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Clock size={20} className="text-gray-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">운영시간</p>
                <p className="text-gray-700">{zone.openHours}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign size={20} className="text-gray-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">이용요금</p>
                <p className="text-gray-700">{zone.price}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">시설 소개</h3>
            <p className="text-gray-700 leading-relaxed">{zone.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">주요 시설</h3>
            <div className="flex flex-wrap gap-2">
              {zone.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">최근 후기</h3>
            <div className="space-y-3">
              {zone.reviews.map((review, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-sm font-medium">{review.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">{review.author}</span>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
