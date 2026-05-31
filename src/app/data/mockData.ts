import { KidsZone } from '../types';

export const mockKidsZones: KidsZone[] = [
  {
    id: 1,
    name: '점핑킹 강남점',
    category: '실내놀이터',
    lat: 37.4979,
    lng: 127.0276,
    address: '서울특별시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    website: 'https://example.com/jumpking',
    description: '아이들이 마음껏 뛰어놀 수 있는 대형 실내 놀이터입니다. 트램펄린, 볼풀, 미끄럼틀 등 다양한 시설을 갖추고 있습니다.',
    rating: 4.5,
    reviewCount: 342,
    distance: 1.2,
    openHours: '평일 10:00-20:00, 주말 10:00-21:00',
    price: '어린이 15,000원, 보호자 무료',
    facilities: ['트램펄린', '볼풀', '미끄럼틀', '수유실', '주차장', '카페'],
    reviews: [
      {
        rating: 5,
        author: '김엄마',
        date: '2026-05-20',
        comment: '아이가 너무 좋아해요! 시설도 깨끗하고 직원분들도 친절합니다.'
      },
      {
        rating: 4,
        author: '이아빠',
        date: '2026-05-15',
        comment: '주말엔 사람이 많아서 조금 복잡하지만 평일에 가면 쾌적합니다.'
      },
      {
        rating: 5,
        author: '박맘',
        date: '2026-05-10',
        comment: '5살 아들이 3시간 동안 신나게 놀았어요. 재방문 의사 100%!'
      }
    ]
  },
  {
    id: 2,
    name: '키즈카페 토이스토리',
    category: '키즈카페',
    lat: 37.5012,
    lng: 127.0396,
    address: '서울특별시 강남구 역삼동 456-7',
    phone: '02-2345-6789',
    website: 'https://example.com/toystory',
    description: '음식과 놀이를 함께 즐길 수 있는 프리미엄 키즈카페입니다. 건강한 유기농 재료로 만든 식사 메뉴를 제공합니다.',
    rating: 4.7,
    reviewCount: 521,
    distance: 0.8,
    openHours: '매일 11:00-21:00',
    price: '입장료 12,000원 (음료 1잔 포함)',
    facilities: ['놀이시설', '카페', '독서공간', '미술놀이', 'WiFi', '주차장'],
    reviews: [
      {
        rating: 5,
        author: '최엄마',
        date: '2026-05-25',
        comment: '음식이 정말 맛있어요. 아이도 엄마도 만족!'
      },
      {
        rating: 4,
        author: '정아빠',
        date: '2026-05-18',
        comment: '시설 관리가 잘 되어있고 안전해요.'
      },
      {
        rating: 5,
        author: '강맘',
        date: '2026-05-12',
        comment: '직원분들이 아이들을 잘 챙겨주셔서 안심하고 이용했어요.'
      }
    ]
  },
  {
    id: 3,
    name: '서울어린이박물관',
    category: '어린이박물관',
    lat: 37.5219,
    lng: 127.0411,
    address: '서울특별시 광진구 능동로 216',
    phone: '02-3456-7890',
    website: 'https://example.com/seoulchildmuseum',
    description: '체험형 전시를 통해 아이들의 상상력과 창의력을 키울 수 있는 어린이 전문 박물관입니다.',
    rating: 4.8,
    reviewCount: 892,
    distance: 2.5,
    openHours: '화-일 10:00-18:00 (월요일 휴관)',
    price: '어린이 5,000원, 성인 7,000원',
    facilities: ['전시관', '체험실', '수유실', '식당', '기념품샵', '주차장'],
    reviews: [
      {
        rating: 5,
        author: '윤엄마',
        date: '2026-05-22',
        comment: '교육적이면서도 재미있어요. 아이가 배우면서 즐겁게 놀았어요.'
      },
      {
        rating: 5,
        author: '송아빠',
        date: '2026-05-16',
        comment: '전시 내용이 알차고 체험 프로그램도 다양합니다.'
      },
      {
        rating: 4,
        author: '임맘',
        date: '2026-05-11',
        comment: '주말에는 예약 필수! 평일이 더 여유롭습니다.'
      }
    ]
  },
  {
    id: 4,
    name: '키즈앤키즈 체험센터',
    category: '체험센터',
    lat: 37.4833,
    lng: 127.0322,
    address: '서울특별시 서초구 서초대로 789',
    phone: '02-4567-8901',
    website: 'https://example.com/kidsnkids',
    description: '직업 체험, 과학 실험, 요리 교실 등 다양한 체험 프로그램을 운영하는 어린이 체험 센터입니다.',
    rating: 4.6,
    reviewCount: 438,
    distance: 1.9,
    openHours: '평일 10:00-19:00, 주말 09:00-20:00',
    price: '프로그램별 상이 (10,000-30,000원)',
    facilities: ['체험실', '교육실', '대기실', '카페', '수유실', '주차장'],
    reviews: [
      {
        rating: 5,
        author: '한엄마',
        date: '2026-05-24',
        comment: '아이가 요리 체험을 너무 재밌어했어요. 다음엔 과학 실험 해보려구요!'
      },
      {
        rating: 4,
        author: '조아빠',
        date: '2026-05-19',
        comment: '프로그램이 알차고 강사분들이 전문적이에요.'
      },
      {
        rating: 5,
        author: '오맘',
        date: '2026-05-13',
        comment: '직업 체험 프로그램이 특히 좋았어요. 강력 추천!'
      }
    ]
  },
  {
    id: 5,
    name: '스플래시 키즈풀',
    category: '키즈풀',
    lat: 37.5145,
    lng: 127.0589,
    address: '서울특별시 송파구 올림픽로 321',
    phone: '02-5678-9012',
    website: 'https://example.com/splashkids',
    description: '사계절 이용 가능한 실내 키즈 워터파크입니다. 다양한 수심과 슬라이드로 안전하게 물놀이를 즐길 수 있습니다.',
    rating: 4.4,
    reviewCount: 673,
    distance: 3.2,
    openHours: '매일 09:00-21:00',
    price: '어린이 20,000원, 성인 15,000원',
    facilities: ['키즈풀', '슬라이드', '사우나', '탈의실', '수영복대여', '주차장'],
    reviews: [
      {
        rating: 4,
        author: '서엄마',
        date: '2026-05-21',
        comment: '수질 관리가 잘 되어있고 시설이 깨끗해요.'
      },
      {
        rating: 5,
        author: '안아빠',
        date: '2026-05-17',
        comment: '아이가 물을 무서워했는데 여기서 완전 극복했어요!'
      },
      {
        rating: 4,
        author: '류맘',
        date: '2026-05-14',
        comment: '주말엔 사람이 많지만 시설이 좋아서 만족스러워요.'
      }
    ]
  },
  {
    id: 6,
    name: '롯데월드 어드벤처',
    category: '놀이공원',
    lat: 37.5111,
    lng: 127.0981,
    address: '서울특별시 송파구 올림픽로 240',
    phone: '1661-2000',
    website: 'https://example.com/lotteworld',
    description: '실내외 테마파크와 어린이 전용 놀이기구가 있는 대형 놀이공원입니다. 다양한 공연과 퍼레이드도 즐길 수 있습니다.',
    rating: 4.9,
    reviewCount: 1523,
    distance: 4.1,
    openHours: '평일 10:00-21:00, 주말 09:30-22:00',
    price: '어린이 46,000원, 성인 59,000원 (자유이용권)',
    facilities: ['놀이기구', '공연장', '식당가', '기념품샵', '수유실', '주차장'],
    reviews: [
      {
        rating: 5,
        author: '신엄마',
        date: '2026-05-26',
        comment: '아이와 함께 하루종일 즐겁게 놀았어요. 추억 가득!'
      },
      {
        rating: 5,
        author: '홍아빠',
        date: '2026-05-23',
        comment: '시설도 좋고 직원분들도 친절합니다. 강추!'
      },
      {
        rating: 4,
        author: '장맘',
        date: '2026-05-20',
        comment: '주말엔 대기시간이 길지만 그래도 가볼만한 가치가 있어요.'
      }
    ]
  }
];

export const categories = [
  '전체',
  '실내놀이터',
  '키즈카페',
  '어린이박물관',
  '체험센터',
  '키즈풀',
  '놀이공원'
];
