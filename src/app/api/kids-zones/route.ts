import { NextRequest, NextResponse } from 'next/server';
import { KidsZone } from '../../types';

export const dynamic = 'force-dynamic';

const DEFAULT_LAT = 37.4979;
const DEFAULT_LNG = 127.0276;
const DEFAULT_RADIUS = 10000;
const CACHE_TTL_MS = 10 * 60 * 1000;

const categoryQueries: Record<string, string[]> = {
  '전체': ['키즈카페', '실내놀이터', '어린이박물관', '어린이 체험', '키즈풀', '어린이 놀이시설'],
  '실내놀이터': ['실내놀이터', '어린이 실내놀이터'],
  '키즈카페': ['키즈카페'],
  '어린이박물관': ['어린이박물관', '어린이 박물관'],
  '체험센터': ['어린이 체험', '키즈 체험센터'],
  '키즈풀': ['키즈풀', '어린이 수영장'],
  '놀이공원': ['어린이 놀이공원', '테마파크 어린이'],
};

const categoryMatchers: Array<[string, string[]]> = [
  ['키즈카페', ['키즈카페']],
  ['실내놀이터', ['실내놀이터', '놀이터', '플레이']],
  ['어린이박물관', ['어린이박물관', '어린이 박물관', '박물관']],
  ['체험센터', ['체험', '공방', '교실', '센터']],
  ['키즈풀', ['키즈풀', '수영장', '풀']],
  ['놀이공원', ['놀이공원', '테마파크', '월드', '랜드']],
];

const semanticKeywordMap: Array<{ tags: string[]; queries: string[]; relevance: string[] }> = [
  {
    tags: ['뛰어', '뛰놀', '점프', '활동', '에너지', '신체', '트램폴린', '트램펄린', '방방'],
    queries: ['실내놀이터', '트램폴린 키즈카페', '방방 키즈카페', '점핑 키즈카페'],
    relevance: ['실내놀이터', '키즈카페', '트램폴린', '트램펄린', '방방', '점핑', '놀이시설'],
  },
  {
    tags: ['체험', '만들기', '공방', '수업', '클래스', '창의', '미술', '요리', '과학'],
    queries: ['어린이 체험', '키즈 체험센터', '어린이 미술 체험', '어린이 요리 교실'],
    relevance: ['체험', '공방', '교실', '클래스', '미술', '요리', '과학', '박물관'],
  },
  {
    tags: ['물', '물놀이', '수영', '풀', '워터', '수영장'],
    queries: ['키즈풀', '어린이 수영장', '키즈 워터파크'],
    relevance: ['키즈풀', '수영장', '수영', '워터파크', '물놀이', '풀'],
  },
  {
    tags: ['박물관', '전시', '교육', '학습', '역사', '과학관'],
    queries: ['어린이박물관', '어린이 박물관', '어린이 과학관'],
    relevance: ['어린이박물관', '박물관', '전시', '과학관', '교육'],
  },
  {
    tags: ['카페', '밥', '음식', '부모', '휴식', '아기랑', '영유아'],
    queries: ['키즈카페', '베이비카페', '서울형키즈카페'],
    relevance: ['키즈카페', '베이비카페', '서울형키즈카페', '놀이시설'],
  },
  {
    tags: ['놀이공원', '테마파크', '놀이기구', '어트랙션', '랜드'],
    queries: ['어린이 놀이공원', '어린이 테마파크', '키즈 테마파크'],
    relevance: ['놀이공원', '테마파크', '키즈', '어린이', '놀이기구'],
  },
];

interface KakaoPlace {
  id: string;
  place_name: string;
  category_name: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  place_url: string;
  distance: string;
}

interface KakaoKeywordResponse {
  documents: KakaoPlace[];
}

interface CacheEntry {
  expiresAt: number;
  zones: KidsZone[];
}

const cache = new Map<string, CacheEntry>();

function parseNumber(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getCategory(place: KakaoPlace, fallback: string) {
  const haystack = `${place.place_name} ${place.category_name}`.toLowerCase();

  for (const [category, keywords] of categoryMatchers) {
    if (keywords.some((keyword) => haystack.includes(keyword.toLowerCase()))) {
      return category;
    }
  }

  return fallback === '전체' ? '키즈카페' : fallback;
}

function getSearchPlan(category: string, query: string) {
  const trimmedQuery = normalizeSearchTerm(query);

  if (trimmedQuery) {
    const matchedSemantics = semanticKeywordMap.filter(({ tags }) =>
      tags.some((tag) => trimmedQuery.includes(tag))
    );

    if (matchedSemantics.length > 0) {
      const expandedQueries = matchedSemantics.flatMap(({ queries }) => queries);
      const relevanceKeywords = matchedSemantics.flatMap(({ relevance }) => relevance);

      return {
        queries: unique(expandedQueries).slice(0, 8),
        relevanceKeywords: unique(relevanceKeywords),
      };
    }

    return {
      queries: [trimmedQuery],
      relevanceKeywords: [],
    };
  }

  return {
    queries: categoryQueries[category] ?? categoryQueries['전체'],
    relevanceKeywords: [],
  };
}

function normalizeSearchTerm(query: string) {
  return query
    .trim()
    .replace(/[#,]/g, ' ')
    .replace(/\s+/g, ' ');
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function isRelevantPlace(place: KakaoPlace, relevanceKeywords: string[]) {
  if (relevanceKeywords.length === 0) {
    return true;
  }

  const haystack = `${place.place_name} ${place.category_name}`.toLowerCase();
  return relevanceKeywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
}

function toKidsZone(place: KakaoPlace, index: number, category: string): KidsZone {
  const resolvedCategory = getCategory(place, category);
  const distanceMeters = Number(place.distance);

  return {
    id: index + 1,
    name: place.place_name,
    category: resolvedCategory,
    lat: Number(place.y),
    lng: Number(place.x),
    address: place.road_address_name || place.address_name || '주소 정보 없음',
    phone: place.phone || '전화번호 정보 없음',
    website: place.place_url,
    description: `${place.category_name || resolvedCategory} 장소입니다. 카카오 Local API에서 가져온 실제 장소 데이터입니다.`,
    rating: 0,
    reviewCount: 0,
    distance: Number.isFinite(distanceMeters) ? Math.round(distanceMeters / 100) / 10 : 0,
    openHours: '운영시간 정보 없음',
    price: '요금 정보 없음',
    facilities: [resolvedCategory, '카카오맵 장소'],
    reviews: [],
  };
}

async function searchKeyword({
  keyword,
  lat,
  lng,
  radius,
}: {
  keyword: string;
  lat: number;
  lng: number;
  radius: number;
}) {
  const restKey = process.env.KAKAO_REST_API_KEY;

  if (!restKey) {
    throw new Error('KAKAO_REST_API_KEY is missing');
  }

  const params = new URLSearchParams({
    query: keyword,
    x: String(lng),
    y: String(lat),
    radius: String(radius),
    sort: 'distance',
    size: '15',
  });

  const response = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?${params}`, {
    headers: {
      Authorization: `KakaoAK ${restKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Kakao Local API failed with ${response.status}`);
  }

  const data = (await response.json()) as KakaoKeywordResponse;
  return data.documents;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get('category') || '전체';
  const query = searchParams.get('query') || '';
  const lat = parseNumber(searchParams.get('lat'), DEFAULT_LAT);
  const lng = parseNumber(searchParams.get('lng'), DEFAULT_LNG);
  const radius = Math.min(parseNumber(searchParams.get('radius'), DEFAULT_RADIUS), 20000);
  const cacheKey = JSON.stringify({ category, query, lat, lng, radius });
  const cached = cache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json({ zones: cached.zones, source: 'cache' });
  }

  try {
    const { queries, relevanceKeywords } = getSearchPlan(category, query);
    const results = await Promise.all(
      queries.map((keyword) => searchKeyword({ keyword, lat, lng, radius }))
    );
    const deduped = new Map<string, KakaoPlace>();

    results.flat().filter((place) => isRelevantPlace(place, relevanceKeywords)).forEach((place) => {
      const key = place.id || `${place.place_name}:${place.road_address_name || place.address_name}`;
      if (!deduped.has(key)) {
        deduped.set(key, place);
      }
    });

    const zones = Array.from(deduped.values())
      .slice(0, 30)
      .map((place, index) => toKidsZone(place, index, category));

    cache.set(cacheKey, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      zones,
    });

    return NextResponse.json({ zones, source: 'kakao', queries });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to load Kakao Local API data', zones: [] },
      { status: 502 }
    );
  }
}
