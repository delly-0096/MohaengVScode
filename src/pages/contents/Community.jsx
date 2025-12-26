import { useState } from 'react';
import {
  RiSearchLine,
  RiEyeLine,
  RiDeleteBinLine,
  RiAlertLine,
  RiChat3Line,
  RiUserLine,
  RiCalendarLine,
  RiHeartLine,
  RiMessage2Line,
  RiFilterLine,
  RiEyeOffLine,
  RiCheckLine,
  RiBookOpenLine,
  RiMapPinLine,
  RiTeamLine,
  RiTimeLine,
  RiGroupLine,
  RiEditLine,
  RiPriceTag3Line,
  RiCloseLine,
  RiAddLine,
  RiImageLine,
  RiBookmarkLine,
  RiStarFill,
  RiSendPlaneLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

// 카테고리 정의
const categories = {
  all: { label: '전체', color: '#6b7280' },
  notice: { label: '공지', color: '#dc2626' },
  free: { label: '자유', color: '#6b7280' },
  companion: { label: '동행', color: '#2563eb' },
  info: { label: '정보', color: '#059669' },
  qna: { label: 'Q&A', color: '#7c3aed' },
  review: { label: '후기', color: '#d97706' }
};

// 여행톡 더미 데이터 (사용자 페이지와 동일한 구조)
const initialTalkData = [
  {
    id: 1,
    category: 'notice',
    title: '[필독] 여행톡 이용 규칙 안내',
    author: '운영자',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80',
    date: '2024-03-01',
    views: 1234,
    likes: 56,
    reports: 0,
    status: 'active',
    tags: ['공지사항', '필독', '이용규칙'],
    content: '<p>안녕하세요, 모행 여행톡 이용자 여러분!</p><p>여행톡은 여행자들이 서로 소통하고 정보를 나누는 커뮤니티입니다.</p>',
    comments: []
  },
  {
    id: 2,
    category: 'companion',
    title: '3월 말 제주도 2박3일 같이 가실 분~',
    author: 'travel_lover',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80',
    date: '2024-03-15',
    views: 328,
    likes: 24,
    reports: 0,
    status: 'active',
    tags: ['제주도', '동행구함', '2박3일'],
    content: '<p>3월 28일부터 30일까지 제주도 여행 계획 중인데 같이 가실 분 계신가요?</p>',
    comments: [
      { id: 1, author: '여행좋아', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80', date: '2024-03-15 14:30', text: '저도 가고 싶어요! 혹시 여자만 가능한가요?' },
      { id: 2, author: 'travel_lover', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80', date: '2024-03-15 14:45', text: '성별 무관해요~ 편하게 연락주세요!' },
      { id: 3, author: 'jeju_lover', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80', date: '2024-03-15 15:20', text: '제주도민인데 맛집 추천해드릴게요!' }
    ]
  },
  {
    id: 3,
    category: 'info',
    title: '오사카 맛집 리스트 총정리 (2024년 최신)',
    author: 'foodie_kim',
    authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100&h=100&fit=crop&q=80',
    date: '2024-03-14',
    views: 2156,
    likes: 187,
    reports: 2,
    status: 'reported',
    tags: ['오사카', '일본맛집', '라멘'],
    content: '<p>지난 2월에 오사카 다녀왔는데요, 직접 가본 맛집들 정리해봤습니다!</p>',
    comments: [
      { id: 1, author: 'japan_trip', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&q=80', date: '2024-03-14 18:00', text: '와 정리 감사해요! 저장해놓고 가야겠어요' },
      { id: 2, author: 'osaka_fan', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80', date: '2024-03-14 19:30', text: '이치란 진짜 맛있죠!!' }
    ]
  },
  {
    id: 4,
    category: 'free',
    title: '방콕 여행 다녀왔어요! 너무 좋았던 경험 공유합니다',
    author: 'adventure_park',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&q=80',
    date: '2024-03-14',
    views: 567,
    likes: 43,
    reports: 0,
    status: 'active',
    tags: ['방콕', '태국여행', '왓아룬'],
    content: '<p>저번 주에 방콕 4박 5일 다녀왔는데 정말 최고였어요!</p>',
    comments: [
      { id: 1, author: 'thai_lover', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80', date: '2024-03-14 16:00', text: '방콕 진짜 좋죠! 저도 왓아룬 일몰 보고 감동받았어요' }
    ]
  },
  {
    id: 5,
    category: 'qna',
    title: '일본 교통카드 뭘로 사야 할까요?',
    author: 'newbie_traveler',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&q=80',
    date: '2024-03-13',
    views: 445,
    likes: 12,
    reports: 0,
    status: 'active',
    tags: ['일본여행', '교통카드', '스이카'],
    content: '<p>4월에 일본 여행 처음 가는데요, 교통카드 종류가 너무 많아서 뭘 사야 할지 모르겠어요</p>',
    comments: [
      { id: 1, author: 'japan_expert', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&q=80', date: '2024-03-13 10:00', text: '스이카나 이코카 아무거나 사셔도 돼요!' },
      { id: 2, author: 'tokyo_guide', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&q=80', date: '2024-03-13 11:30', text: 'JR패스는 7일권 기준 도쿄-오사카 왕복 신칸센 타면 본전이에요.' },
      { id: 3, author: 'travel_helper', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80', date: '2024-03-13 14:00', text: '저도 처음에 고민 많이 했는데, 그냥 공항에서 스이카 사세요.' }
    ]
  },
  {
    id: 6,
    category: 'companion',
    title: '4월 초 도쿄 디즈니 같이 가실 분 구해요!',
    author: 'disney_fan',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
    date: '2024-03-13',
    views: 234,
    likes: 18,
    reports: 0,
    status: 'active',
    tags: ['도쿄', '디즈니랜드', '동행구함'],
    content: '<p>혼자 디즈니 가려니까 좀 외로울 것 같아서요 ㅠㅠ</p>',
    comments: [
      { id: 1, author: 'disney_love', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80', date: '2024-03-13 20:00', text: '저 디즈니 너무 좋아해요!! 같이 가고 싶은데 일정이 안 맞네요 ㅠㅠ' }
    ]
  },
  {
    id: 7,
    category: 'review',
    title: '모행 AI 일정 추천 써봤는데 대박이에요!',
    author: 'happy_trip',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
    date: '2024-03-11',
    views: 345,
    likes: 28,
    reports: 0,
    status: 'active',
    tags: ['모행', 'AI추천', '후기'],
    content: '<p>이번에 모행 AI로 일정 추천받아서 여행 다녀왔는데 정말 좋았어요!</p>',
    comments: []
  }
];

// 지금모행 채팅방 카테고리 정의
const chatCategories = {
  free: { label: '자유', color: '#667eea', icon: 'chat-dots' },
  companion: { label: '동행', color: '#f5576c', icon: 'people' },
  local: { label: '지역', color: '#4facfe', icon: 'geo-alt' },
  theme: { label: '테마', color: '#43e97b', icon: 'palette' }
};

// 지금모행 채팅방 더미 데이터 (사용자 페이지와 동일한 구조)
const initialMohaengData = [
  {
    id: 'room1',
    name: '제주도 여행 이야기',
    category: 'local',
    categoryLabel: '지역',
    currentUsers: 23,
    maxUsers: 50,
    createdBy: 'travel_master',
    createdAt: '2024-03-15',
    status: 'active',
    reports: 0,
    users: [
      { id: 'user1', name: 'travel_master', status: 'online', isCreator: true },
      { id: 'user2', name: 'jeju_lover', status: 'online' },
      { id: 'user3', name: 'trip_kim', status: 'away' },
      { id: 'user4', name: 'adventure_lee', status: 'online' },
      { id: 'user5', name: 'wanderer', status: 'offline' }
    ],
    messages: [
      { id: 1, sender: 'travel_master', message: '안녕하세요! 제주도 여행 정보 나누는 방입니다~', time: '14:30', date: '2024-03-15' },
      { id: 2, sender: 'jeju_lover', message: '저 이번 주말에 제주도 가요! 맛집 추천 부탁드려요', time: '14:32', date: '2024-03-15' },
      { id: 3, sender: 'adventure_lee', message: '흑돼지는 꼭 드세요! 서귀포 쪽이 맛있어요', time: '14:35', date: '2024-03-15' },
      { id: 4, sender: 'trip_kim', message: '성산일출봉 일출도 추천드려요', time: '14:40', date: '2024-03-15' },
      { id: 5, sender: 'jeju_lover', message: '감사합니다! 꼭 가볼게요 ㅎㅎ', time: '14:42', date: '2024-03-15' }
    ]
  },
  {
    id: 'room2',
    name: '3월 도쿄 동행 구해요',
    category: 'companion',
    categoryLabel: '동행',
    currentUsers: 8,
    maxUsers: 10,
    createdBy: 'tokyo_lover',
    createdAt: '2024-03-14',
    status: 'active',
    reports: 0,
    users: [
      { id: 'user1', name: 'tokyo_lover', status: 'online', isCreator: true },
      { id: 'user2', name: 'japan_fan', status: 'online' },
      { id: 'user3', name: 'disney_lover', status: 'online' }
    ],
    messages: [
      { id: 1, sender: 'tokyo_lover', message: '3월 20일~23일 도쿄 여행 같이 가실 분!', time: '10:00', date: '2024-03-14' },
      { id: 2, sender: 'japan_fan', message: '저 관심있어요! 일정 어떻게 되나요?', time: '10:15', date: '2024-03-14' },
      { id: 3, sender: 'tokyo_lover', message: '디즈니랜드 하루, 시부야/하라주쿠 하루, 아사쿠사 하루 생각중이에요', time: '10:20', date: '2024-03-14' },
      { id: 4, sender: 'disney_lover', message: '디즈니 저도 가고 싶었어요!! 같이 가요~', time: '10:25', date: '2024-03-14' }
    ]
  },
  {
    id: 'room3',
    name: '여행 자유 수다방',
    category: 'free',
    categoryLabel: '자유',
    currentUsers: 45,
    maxUsers: 100,
    createdBy: 'mohaeng_admin',
    createdAt: '2024-03-01',
    status: 'active',
    reports: 0,
    users: [
      { id: 'user1', name: 'mohaeng_admin', status: 'online', isCreator: true },
      { id: 'user2', name: 'travel_kim', status: 'online' },
      { id: 'user3', name: 'nomad_j', status: 'away' }
    ],
    messages: [
      { id: 1, sender: 'mohaeng_admin', message: '자유롭게 여행 이야기 나눠요~', time: '09:00', date: '2024-03-01' },
      { id: 2, sender: 'travel_kim', message: '오늘 날씨 좋네요! 어디론가 떠나고 싶어요', time: '11:30', date: '2024-03-15' },
      { id: 3, sender: 'nomad_j', message: '저는 내일 부산 가요 ㅎㅎ', time: '11:35', date: '2024-03-15' }
    ]
  },
  {
    id: 'room4',
    name: '맛집 탐방 동호회',
    category: 'theme',
    categoryLabel: '테마',
    currentUsers: 31,
    maxUsers: 50,
    createdBy: 'food_explorer',
    createdAt: '2024-03-10',
    status: 'reported',
    reports: 3,
    users: [
      { id: 'user1', name: 'food_explorer', status: 'online', isCreator: true },
      { id: 'user2', name: 'foodie_kim', status: 'online' },
      { id: 'user3', name: 'gourmet_lee', status: 'offline' }
    ],
    messages: [
      { id: 1, sender: 'food_explorer', message: '맛집 정보 공유해요!', time: '15:00', date: '2024-03-10' },
      { id: 2, sender: 'foodie_kim', message: '서울 을지로에 진짜 맛있는 냉면집 있어요', time: '15:10', date: '2024-03-15' },
      { id: 3, sender: 'gourmet_lee', message: '어디요? 알려주세요!', time: '15:12', date: '2024-03-15' },
      { id: 4, sender: 'foodie_kim', message: '을지면옥이요! 줄 좀 서야해요', time: '15:15', date: '2024-03-15' },
      { id: 5, sender: 'suspicious_user', message: '[신고된 메시지]', time: '16:00', date: '2024-03-15' }
    ]
  },
  {
    id: 'room5',
    name: '오사카 여행 정보',
    category: 'local',
    categoryLabel: '지역',
    currentUsers: 17,
    maxUsers: 30,
    createdBy: 'osaka_guide',
    createdAt: '2024-03-12',
    status: 'active',
    reports: 0,
    users: [
      { id: 'user1', name: 'osaka_guide', status: 'online', isCreator: true },
      { id: 'user2', name: 'japan_trip', status: 'online' }
    ],
    messages: [
      { id: 1, sender: 'osaka_guide', message: '오사카 여행 정보 공유합니다!', time: '12:00', date: '2024-03-12' },
      { id: 2, sender: 'japan_trip', message: '이치란 라멘 진짜 맛있죠?', time: '12:30', date: '2024-03-15' },
      { id: 3, sender: 'osaka_guide', message: '네! 도톤보리 본점 추천해요', time: '12:35', date: '2024-03-15' }
    ]
  }
];

// 여행기록 더미 데이터 (사용자 페이지와 동일한 구조)
const initialLogsData = [
  {
    id: 1,
    title: '제주도 3박4일, 혼자여도 괜찮아',
    author: 'travel_lover',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80',
    location: '제주도, 대한민국',
    dateRange: '2024.03.15 - 2024.03.18',
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop&q=80',
    imageCount: 5,
    likes: 328,
    comments: 24,
    bookmarks: 45,
    views: 1520,
    createdAt: '2024-03-18',
    status: 'active',
    reports: 0,
    tags: ['제주도', '혼자여행', '힐링', '일출'],
    intro: '처음으로 혼자 떠난 제주도 여행! 혼자여도 괜찮다, 오히려 좋다라는 걸 깨달았던 특별한 시간이었어요.',
    days: [
      {
        day: 1,
        date: '3월 15일 (금)',
        places: [
          { name: '성산일출봉', address: '제주 서귀포시 성산읍', image: 'https://images.unsplash.com/photo-1578469645742-46cae010e5d4?w=600&h=400&fit=crop&q=80', rating: 5, time: '06:00 ~ 08:00', review: '새벽 5시에 일어나 일출을 보러 갔어요. 정상에서 바라본 일출은 정말 장관이었습니다.' },
          { name: '해녀의집', address: '제주 서귀포시 성산읍', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&q=80', rating: 4, time: '12:00 ~ 13:30', review: '성산일출봉 근처에서 점심으로 해산물을 맛봤어요. 전복죽이 정말 맛있었습니다!' }
        ]
      },
      {
        day: 2,
        date: '3월 16일 (토)',
        places: [
          { name: '협재해수욕장', address: '제주 제주시 한림읍', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&q=80', rating: 5, time: '09:00 ~ 12:00', review: '에메랄드빛 바다가 정말 예뻤어요. 백사장을 걸으며 힐링했습니다.' }
        ]
      }
    ],
    outro: '이번 제주도 여행은 혼자서도 충분히 행복할 수 있다는 걸 알게 해준 소중한 시간이었어요.',
    commentsList: [
      { id: 1, author: 'foodie_kim', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80', text: '와 너무 예뻐요! 저도 가고 싶어지네요', time: '3일 전', likes: 12 },
      { id: 2, author: 'adventure_park', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80', text: '성산일출봉 일출 정말 최고죠!', time: '2일 전', likes: 8 },
      { id: 3, author: 'photo_jenny', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80', text: '혼자여행 저도 도전해보고 싶어요! 용기가 생기네요 ㅎㅎ', time: '1일 전', likes: 5 }
    ]
  },
  {
    id: 2,
    title: '부산 맛집 투어 완전 정복!',
    author: 'foodie_kim',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
    location: '부산, 대한민국',
    dateRange: '2024.03.01 - 2024.03.03',
    coverImage: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&h=600&fit=crop&q=80',
    imageCount: 8,
    likes: 512,
    comments: 45,
    bookmarks: 89,
    views: 2340,
    createdAt: '2024-03-05',
    status: 'active',
    reports: 2,
    tags: ['부산', '맛집투어', '해운대', '먹방'],
    intro: '부산 하면 역시 먹방이죠! 2박 3일 동안 부산의 유명 맛집들을 돌아다녔어요.',
    days: [
      {
        day: 1,
        date: '3월 1일 (금)',
        places: [
          { name: '자갈치시장', address: '부산 중구 자갈치해안로', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop&q=80', rating: 5, time: '11:00 ~ 14:00', review: '자갈치시장에서 먹은 회는 정말 인생 회였어요. 싱싱한 회와 매운탕이 완벽했습니다.' }
        ]
      }
    ],
    outro: '다음에 부산 오면 또 먹방 투어 해야겠어요. 부산 음식은 정말 최고!',
    commentsList: [
      { id: 1, author: 'travel_lover', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80', text: '맛집 리스트 공유 부탁드려요!', time: '4일 전', likes: 15 }
    ]
  },
  {
    id: 3,
    title: '강릉 & 속초 3일, 완벽 휴양 여행!',
    author: 'adventure_park',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
    location: '강릉, 대한민국',
    dateRange: '2024.02.20 - 2024.02.22',
    coverImage: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=600&h=600&fit=crop&q=80',
    imageCount: 12,
    likes: 287,
    comments: 31,
    bookmarks: 52,
    views: 1680,
    createdAt: '2024-02-25',
    status: 'active',
    reports: 0,
    tags: ['강릉', '속초', '정동진', '일출'],
    intro: '정동진의 일출은 정말 환상적이었어요. 강릉과 속초의 맛집도 다 정복했습니다!',
    days: [
      {
        day: 1,
        date: '2월 20일 (화)',
        places: [
          { name: '정동진', address: '강원도 강릉시 강동면', image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=600&h=400&fit=crop&q=80', rating: 5, time: '05:30 ~ 08:00', review: '정동진에서 일출을 봤는데 정말 감동이었어요.' }
        ]
      }
    ],
    outro: '강원도 해안가 여행은 언제나 옳다!',
    commentsList: [
      { id: 1, author: 'hiking_master', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80', text: '정동진 일출 보려면 몇시에 가야하나요?', time: '1주 전', likes: 3 }
    ]
  },
  {
    id: 4,
    title: '경주의 봄, 벚꽃 만개한 불국사',
    author: 'photo_jenny',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80',
    location: '경주, 대한민국',
    dateRange: '2024.04.05 - 2024.04.07',
    coverImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=600&fit=crop&q=80',
    imageCount: 15,
    likes: 892,
    comments: 67,
    bookmarks: 134,
    views: 4520,
    createdAt: '2024-04-10',
    status: 'reported',
    reports: 3,
    tags: ['경주', '불국사', '벚꽃', '봄여행'],
    intro: '경주의 봄은 정말 아름다웠어요. 불국사 앞에서 찍은 사진들이 너무 마음에 들어요!',
    days: [
      {
        day: 1,
        date: '4월 5일 (금)',
        places: [
          { name: '불국사', address: '경북 경주시 불국로', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop&q=80', rating: 5, time: '09:00 ~ 12:00', review: '벚꽃 만개한 불국사는 정말 장관이었어요.' }
        ]
      }
    ],
    outro: '봄에 경주 여행 강력 추천드려요!',
    commentsList: [
      { id: 1, author: 'travel_lover', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80', text: '사진이 너무 예뻐요! 카메라 뭐 쓰세요?', time: '5일 전', likes: 8 },
      { id: 2, author: 'spring_lover', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80', text: '저도 올해 경주 가려고 했는데 참고할게요!', time: '3일 전', likes: 4 }
    ]
  },
  {
    id: 5,
    title: '여수 밤바다, 신혼여행 기록',
    author: 'couple_trip',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&q=80',
    location: '여수, 대한민국',
    dateRange: '2024.03.20 - 2024.03.23',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop&q=80',
    imageCount: 20,
    likes: 743,
    comments: 54,
    bookmarks: 112,
    views: 3250,
    createdAt: '2024-03-25',
    status: 'active',
    reports: 0,
    tags: ['여수', '신혼여행', '밤바다', '낭만'],
    intro: '여수 신혼여행 기록. 평생 잊지 못할 추억이 되었어요.',
    days: [
      {
        day: 1,
        date: '3월 20일 (수)',
        places: [
          { name: '여수 밤바다', address: '전남 여수시 돌산읍', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&q=80', rating: 5, time: '19:00 ~ 22:00', review: '여수 밤바다는 정말 낭만적이었어요.' }
        ]
      }
    ],
    outro: '신혼여행으로 여수 강력 추천드려요!',
    commentsList: [
      { id: 1, author: 'romantic_trip', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&q=80', text: '너무 로맨틱해요! 결혼 축하드려요!', time: '1주 전', likes: 20 }
    ]
  }
];

function Community() {
  const [activeTab, setActiveTab] = useState('talk');

  // 여행톡 상태
  const [talkData, setTalkData] = useState(initialTalkData);
  const [talkSearch, setTalkSearch] = useState('');
  const [talkCategoryFilter, setTalkCategoryFilter] = useState('all');
  const [talkStatusFilter, setTalkStatusFilter] = useState('all');

  // 지금모행 상태
  const [mohaengData, setMohaengData] = useState(initialMohaengData);
  const [mohaengSearch, setMohaengSearch] = useState('');
  const [mohaengStatusFilter, setMohaengStatusFilter] = useState('all');

  // 여행기록 상태
  const [logsData, setLogsData] = useState(initialLogsData);
  const [logsSearch, setLogsSearch] = useState('');
  const [logsStatusFilter, setLogsStatusFilter] = useState('all');

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, item: null, type: null });
  const [editModal, setEditModal] = useState({ isOpen: false, item: null, type: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null, type: null });
  const [hideModal, setHideModal] = useState({ isOpen: false, item: null, type: null });
  const [commentDeleteModal, setCommentDeleteModal] = useState({ isOpen: false, postId: null, commentId: null });
  const [commentEditModal, setCommentEditModal] = useState({ isOpen: false, postId: null, comment: null });
  const [writeModal, setWriteModal] = useState(false);
  // 여행기록 댓글 모달 상태
  const [logCommentDeleteModal, setLogCommentDeleteModal] = useState({ isOpen: false, logId: null, commentId: null });
  const [logCommentEditModal, setLogCommentEditModal] = useState({ isOpen: false, logId: null, comment: null });
  const [editLogCommentText, setEditLogCommentText] = useState('');

  // 수정 폼 상태
  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    content: '',
    tags: ''
  });
  const [editCommentText, setEditCommentText] = useState('');

  // 여행기록 수정 폼 상태
  const [editLogForm, setEditLogForm] = useState({
    title: '',
    intro: '',
    outro: '',
    tags: ''
  });

  // 글쓰기 폼 상태
  const [writeForm, setWriteForm] = useState({
    category: 'notice',
    title: '',
    content: '',
    tags: ''
  });

  // 필터링
  const filteredTalk = talkData.filter(t => {
    const matchesSearch = t.title.includes(talkSearch) || t.author.includes(talkSearch);
    const matchesCategory = talkCategoryFilter === 'all' || t.category === talkCategoryFilter;
    const matchesStatus = talkStatusFilter === 'all' || t.status === talkStatusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredMohaeng = mohaengData.filter(m => {
    const matchesSearch = m.name.includes(mohaengSearch) || m.createdBy.includes(mohaengSearch) || m.categoryLabel.includes(mohaengSearch);
    const matchesStatus = mohaengStatusFilter === 'all' || m.status === mohaengStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredLogs = logsData.filter(l => {
    const matchesSearch = l.title.includes(logsSearch) || l.author.includes(logsSearch) || l.location.includes(logsSearch);
    const matchesStatus = logsStatusFilter === 'all' || l.status === logsStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // 카운트
  const talkReportedCount = talkData.filter(t => t.status === 'reported').length;
  const mohaengReportedCount = mohaengData.filter(m => m.status === 'reported').length;
  const logsReportedCount = logsData.filter(l => l.status === 'reported').length;
  const totalReportedCount = talkReportedCount + mohaengReportedCount + logsReportedCount;

  // 상세보기
  const handleViewDetail = (item, type) => {
    setDetailModal({ isOpen: true, item, type });
  };

  // 수정 모달 열기
  const handleEdit = (item, type) => {
    if (type === 'talk') {
      setEditForm({
        title: item.title,
        category: item.category,
        content: item.content.replace(/<[^>]*>/g, ''), // HTML 태그 제거
        tags: item.tags?.join(', ') || ''
      });
    } else if (type === 'logs') {
      setEditLogForm({
        title: item.title,
        intro: item.intro || '',
        outro: item.outro || '',
        tags: item.tags?.join(', ') || ''
      });
    }
    setEditModal({ isOpen: true, item, type });
  };

  // 수정 저장
  const handleEditSave = () => {
    const { item, type } = editModal;
    if (type === 'talk') {
      setTalkData(prev => prev.map(t =>
        t.id === item.id
          ? {
              ...t,
              title: editForm.title,
              category: editForm.category,
              content: `<p>${editForm.content}</p>`,
              tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            }
          : t
      ));
    } else if (type === 'logs') {
      setLogsData(prev => prev.map(l =>
        l.id === item.id
          ? {
              ...l,
              title: editLogForm.title,
              intro: editLogForm.intro,
              outro: editLogForm.outro,
              tags: editLogForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            }
          : l
      ));
    }
    setEditModal({ isOpen: false, item: null, type: null });
    alert('수정되었습니다.');
  };

  // 삭제
  const handleDelete = (item, type) => {
    setDeleteModal({ isOpen: true, item, type });
  };

  const handleDeleteConfirm = () => {
    const { item, type } = deleteModal;
    if (type === 'talk') {
      setTalkData(prev => prev.filter(t => t.id !== item.id));
    } else if (type === 'mohaeng') {
      setMohaengData(prev => prev.filter(m => m.id !== item.id));
    } else if (type === 'logs') {
      setLogsData(prev => prev.filter(l => l.id !== item.id));
    }
    setDeleteModal({ isOpen: false, item: null, type: null });
    alert('삭제되었습니다.');
  };

  // 숨김/공개
  const handleHide = (item, type) => {
    setHideModal({ isOpen: true, item, type });
  };

  const handleHideConfirm = () => {
    const { item, type } = hideModal;
    if (type === 'talk') {
      setTalkData(prev => prev.map(t => t.id === item.id ? { ...t, status: 'hidden' } : t));
    } else if (type === 'mohaeng') {
      setMohaengData(prev => prev.map(m => m.id === item.id ? { ...m, status: 'hidden' } : m));
    } else if (type === 'logs') {
      setLogsData(prev => prev.map(l => l.id === item.id ? { ...l, status: 'hidden' } : l));
    }
    setHideModal({ isOpen: false, item: null, type: null });
    alert('숨김 처리되었습니다.');
  };

  const handleUnhide = (item, type) => {
    if (type === 'talk') {
      setTalkData(prev => prev.map(t => t.id === item.id ? { ...t, status: 'active' } : t));
    } else if (type === 'mohaeng') {
      setMohaengData(prev => prev.map(m => m.id === item.id ? { ...m, status: 'active' } : m));
    } else if (type === 'logs') {
      setLogsData(prev => prev.map(l => l.id === item.id ? { ...l, status: 'active' } : l));
    }
    alert('공개되었습니다.');
  };

  // 신고 해제
  const handleClearReport = (item, type) => {
    if (type === 'talk') {
      setTalkData(prev => prev.map(t => t.id === item.id ? { ...t, status: 'active', reports: 0 } : t));
    } else if (type === 'mohaeng') {
      setMohaengData(prev => prev.map(m => m.id === item.id ? { ...m, status: 'active', reports: 0 } : m));
    } else if (type === 'logs') {
      setLogsData(prev => prev.map(l => l.id === item.id ? { ...l, status: 'active', reports: 0 } : l));
    }
    alert('신고가 해제되었습니다.');
  };

  // 댓글 수정
  const handleCommentEdit = (postId, comment) => {
    setEditCommentText(comment.text);
    setCommentEditModal({ isOpen: true, postId, comment });
  };

  const handleCommentEditSave = () => {
    const { postId, comment } = commentEditModal;
    setTalkData(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(c =>
            c.id === comment.id ? { ...c, text: editCommentText } : c
          )
        };
      }
      return post;
    }));
    setCommentEditModal({ isOpen: false, postId: null, comment: null });
    setEditCommentText('');
    // 상세보기 모달 데이터도 업데이트
    if (detailModal.item?.id === postId) {
      const updatedPost = talkData.find(p => p.id === postId);
      if (updatedPost) {
        setDetailModal(prev => ({
          ...prev,
          item: {
            ...prev.item,
            comments: prev.item.comments.map(c =>
              c.id === comment.id ? { ...c, text: editCommentText } : c
            )
          }
        }));
      }
    }
    alert('댓글이 수정되었습니다.');
  };

  // 댓글 삭제
  const handleCommentDelete = (postId, commentId) => {
    setCommentDeleteModal({ isOpen: true, postId, commentId });
  };

  const handleCommentDeleteConfirm = () => {
    const { postId, commentId } = commentDeleteModal;
    setTalkData(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(c => c.id !== commentId)
        };
      }
      return post;
    }));
    // 상세보기 모달 데이터도 업데이트
    if (detailModal.item?.id === postId) {
      setDetailModal(prev => ({
        ...prev,
        item: {
          ...prev.item,
          comments: prev.item.comments.filter(c => c.id !== commentId)
        }
      }));
    }
    setCommentDeleteModal({ isOpen: false, postId: null, commentId: null });
    alert('댓글이 삭제되었습니다.');
  };

  // 여행기록 댓글 수정
  const handleLogCommentEdit = (logId, comment) => {
    setEditLogCommentText(comment.text);
    setLogCommentEditModal({ isOpen: true, logId, comment });
  };

  const handleLogCommentEditSave = () => {
    const { logId, comment } = logCommentEditModal;
    setLogsData(prev => prev.map(log => {
      if (log.id === logId) {
        return {
          ...log,
          commentsList: log.commentsList.map(c =>
            c.id === comment.id ? { ...c, text: editLogCommentText } : c
          )
        };
      }
      return log;
    }));
    // 상세보기 모달 데이터도 업데이트
    if (detailModal.item?.id === logId) {
      setDetailModal(prev => ({
        ...prev,
        item: {
          ...prev.item,
          commentsList: prev.item.commentsList.map(c =>
            c.id === comment.id ? { ...c, text: editLogCommentText } : c
          )
        }
      }));
    }
    setLogCommentEditModal({ isOpen: false, logId: null, comment: null });
    setEditLogCommentText('');
    alert('댓글이 수정되었습니다.');
  };

  // 여행기록 댓글 삭제
  const handleLogCommentDelete = (logId, commentId) => {
    setLogCommentDeleteModal({ isOpen: true, logId, commentId });
  };

  const handleLogCommentDeleteConfirm = () => {
    const { logId, commentId } = logCommentDeleteModal;
    setLogsData(prev => prev.map(log => {
      if (log.id === logId) {
        return {
          ...log,
          commentsList: log.commentsList.filter(c => c.id !== commentId)
        };
      }
      return log;
    }));
    // 상세보기 모달 데이터도 업데이트
    if (detailModal.item?.id === logId) {
      setDetailModal(prev => ({
        ...prev,
        item: {
          ...prev.item,
          commentsList: prev.item.commentsList.filter(c => c.id !== commentId)
        }
      }));
    }
    setLogCommentDeleteModal({ isOpen: false, logId: null, commentId: null });
    alert('댓글이 삭제되었습니다.');
  };

  // 글쓰기 모달 열기
  const handleOpenWrite = () => {
    setWriteForm({
      category: 'notice',
      title: '',
      content: '',
      tags: ''
    });
    setWriteModal(true);
  };

  // 글쓰기 저장
  const handleWriteSave = () => {
    if (!writeForm.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!writeForm.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    const newPost = {
      id: Math.max(...talkData.map(t => t.id)) + 1,
      category: writeForm.category,
      title: writeForm.title,
      author: '관리자',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80',
      date: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      reports: 0,
      status: 'active',
      tags: writeForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      content: `<p>${writeForm.content.replace(/\n/g, '</p><p>')}</p>`,
      comments: []
    };

    setTalkData(prev => [newPost, ...prev]);
    setWriteModal(false);
    alert('게시글이 등록되었습니다.');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="badge badge-success">정상</span>;
      case 'reported': return <span className="badge badge-danger">신고됨</span>;
      case 'hidden': return <span className="badge badge-gray">숨김</span>;
      default: return <span className="badge badge-gray">{status}</span>;
    }
  };

  const getCategoryBadge = (category) => {
    const cat = categories[category];
    if (!cat) return null;
    return (
      <span
        className="badge"
        style={{
          background: `${cat.color}20`,
          color: cat.color,
          border: `1px solid ${cat.color}40`
        }}
      >
        {cat.label}
      </span>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">커뮤니티 관리</h1>
          <p className="page-subtitle">
            여행톡, 지금모행, 여행기록을 통합 관리합니다.
            {totalReportedCount > 0 && <span className="text-danger"> (신고된 컨텐츠 {totalReportedCount}건)</span>}
          </p>
        </div>
      </div>

      {totalReportedCount > 0 && (
        <div className="alert alert-danger mb-3">
          <RiAlertLine />
          <span>신고된 컨텐츠가 {totalReportedCount}건 있습니다. 확인이 필요합니다.</span>
        </div>
      )}

      {/* 탭 메뉴 */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('talk')}
            style={{
              padding: '16px 24px',
              border: 'none',
              background: activeTab === 'talk' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'talk' ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: activeTab === 'talk' ? '8px 8px 0 0' : 0
            }}
          >
            <RiChat3Line />
            여행톡
            {talkReportedCount > 0 && (
              <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: 10, fontSize: '0.75rem' }}>
                {talkReportedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('mohaeng')}
            style={{
              padding: '16px 24px',
              border: 'none',
              background: activeTab === 'mohaeng' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'mohaeng' ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: activeTab === 'mohaeng' ? '8px 8px 0 0' : 0
            }}
          >
            <RiTeamLine />
            지금모행
            {mohaengReportedCount > 0 && (
              <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: 10, fontSize: '0.75rem' }}>
                {mohaengReportedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            style={{
              padding: '16px 24px',
              border: 'none',
              background: activeTab === 'logs' ? 'var(--primary-color)' : 'transparent',
              color: activeTab === 'logs' ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: activeTab === 'logs' ? '8px 8px 0 0' : 0
            }}
          >
            <RiBookOpenLine />
            여행기록
            {logsReportedCount > 0 && (
              <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: 10, fontSize: '0.75rem' }}>
                {logsReportedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 여행톡 탭 */}
      {activeTab === 'talk' && (
        <div className="card">
          <div className="filter-bar">
            <div className="search-bar">
              <RiSearchLine className="search-bar-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="제목, 작성자 검색"
                value={talkSearch}
                onChange={(e) => setTalkSearch(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <RiFilterLine />
              <select
                className="form-input form-select"
                value={talkCategoryFilter}
                onChange={(e) => setTalkCategoryFilter(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="all">전체 카테고리</option>
                <option value="notice">공지사항</option>
                <option value="free">자유게시판</option>
                <option value="companion">동행 구하기</option>
                <option value="info">정보 공유</option>
                <option value="qna">여행 Q&A</option>
                <option value="review">후기</option>
              </select>
              <select
                className="form-input form-select"
                value={talkStatusFilter}
                onChange={(e) => setTalkStatusFilter(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="all">전체 상태</option>
                <option value="active">정상</option>
                <option value="reported">신고됨</option>
                <option value="hidden">숨김</option>
              </select>
              <button className="btn btn-primary" onClick={handleOpenWrite} style={{ marginLeft: 8 }}>
                <RiAddLine style={{ marginRight: 4 }} /> 글쓰기
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>카테고리</th>
                  <th>제목</th>
                  <th style={{ width: 120 }}>작성자</th>
                  <th style={{ width: 60 }}>조회</th>
                  <th style={{ width: 50 }}>좋아요</th>
                  <th style={{ width: 50 }}>댓글</th>
                  <th style={{ width: 50 }}>신고</th>
                  <th style={{ width: 90 }}>작성일</th>
                  <th style={{ width: 70, whiteSpace: 'nowrap' }}>상태</th>
                  <th style={{ width: 110 }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredTalk.map(item => (
                  <tr key={item.id} style={{ opacity: item.status === 'hidden' ? 0.6 : 1 }}>
                    <td>{getCategoryBadge(item.category)}</td>
                    <td>
                      <div className="font-medium" style={{ cursor: 'pointer' }} onClick={() => handleViewDetail(item, 'talk')}>
                        {item.title}
                        {item.comments.length > 0 && (
                          <span style={{ color: 'var(--primary-color)', marginLeft: 4 }}>[{item.comments.length}]</span>
                        )}
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {item.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} style={{ fontSize: '0.7rem', color: '#6b7280', background: '#f3f4f6', padding: '1px 6px', borderRadius: 4 }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src={item.authorAvatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                        {item.author}
                      </div>
                    </td>
                    <td>{item.views.toLocaleString()}</td>
                    <td>{item.likes}</td>
                    <td>{item.comments.length}</td>
                    <td>{item.reports > 0 ? <span className="text-danger font-medium">{item.reports}</span> : '-'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{item.date}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{getStatusBadge(item.status)}</td>
                    <td>
                      <div className="table-actions">
                        <button className="table-action-btn" title="상세보기" onClick={() => handleViewDetail(item, 'talk')}><RiEyeLine /></button>
                        <button className="table-action-btn" title="수정" style={{ color: 'var(--primary-color)' }} onClick={() => handleEdit(item, 'talk')}><RiEditLine /></button>
                        {item.status === 'hidden' ? (
                          <button className="table-action-btn" title="공개하기" style={{ color: 'var(--success-color)' }} onClick={() => handleUnhide(item, 'talk')}><RiCheckLine /></button>
                        ) : (
                          <button className="table-action-btn" title="숨김" style={{ color: 'var(--warning-color)' }} onClick={() => handleHide(item, 'talk')}><RiEyeOffLine /></button>
                        )}
                        <button className="table-action-btn delete" title="삭제" onClick={() => handleDelete(item, 'talk')}><RiDeleteBinLine /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button className="pagination-btn" disabled>&lt;</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">&gt;</button>
          </div>
        </div>
      )}

      {/* 지금모행 탭 */}
      {activeTab === 'mohaeng' && (
        <div className="card">
          <div className="filter-bar">
            <div className="search-bar">
              <RiSearchLine className="search-bar-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="채팅방명, 개설자, 카테고리 검색"
                value={mohaengSearch}
                onChange={(e) => setMohaengSearch(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <RiFilterLine />
              <select
                className="form-input form-select"
                value={mohaengStatusFilter}
                onChange={(e) => setMohaengStatusFilter(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="all">전체 상태</option>
                <option value="active">정상</option>
                <option value="reported">신고됨</option>
                <option value="hidden">숨김</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>채팅방명</th>
                  <th style={{ width: 80 }}>카테고리</th>
                  <th style={{ width: 100 }}>개설자</th>
                  <th style={{ width: 90 }}>인원</th>
                  <th style={{ width: 70 }}>메시지</th>
                  <th style={{ width: 50 }}>신고</th>
                  <th style={{ width: 90 }}>개설일</th>
                  <th style={{ width: 70, whiteSpace: 'nowrap' }}>상태</th>
                  <th style={{ width: 100 }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredMohaeng.map(item => (
                  <tr key={item.id} style={{ opacity: item.status === 'hidden' ? 0.6 : 1 }}>
                    <td>
                      <div
                        className="member-info"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleViewDetail(item, 'mohaeng')}
                      >
                        <div
                          className="avatar"
                          style={{
                            background: `linear-gradient(135deg, ${chatCategories[item.category]?.color || '#667eea'}, ${chatCategories[item.category]?.color || '#667eea'}88)`,
                            color: 'white'
                          }}
                        >
                          <RiChat3Line />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.currentUsers >= item.maxUsers && (
                            <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 500 }}>만석</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          background: `${chatCategories[item.category]?.color || '#667eea'}20`,
                          color: chatCategories[item.category]?.color || '#667eea'
                        }}
                      >
                        {item.categoryLabel}
                      </span>
                    </td>
                    <td>{item.createdBy}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <RiGroupLine style={{ color: 'var(--primary-color)' }} />
                        <span style={{ fontWeight: item.currentUsers >= item.maxUsers ? 600 : 400, color: item.currentUsers >= item.maxUsers ? '#ef4444' : 'inherit' }}>
                          {item.currentUsers}/{item.maxUsers}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <RiMessage2Line style={{ color: '#6b7280' }} />
                        {item.messages?.length || 0}
                      </div>
                    </td>
                    <td>{item.reports > 0 ? <span className="text-danger font-medium">{item.reports}</span> : '-'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{item.createdAt}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{getStatusBadge(item.status)}</td>
                    <td>
                      <div className="table-actions">
                        <button className="table-action-btn" title="상세보기" onClick={() => handleViewDetail(item, 'mohaeng')}><RiEyeLine /></button>
                        {item.status === 'hidden' ? (
                          <button className="table-action-btn" title="공개하기" style={{ color: 'var(--success-color)' }} onClick={() => handleUnhide(item, 'mohaeng')}><RiCheckLine /></button>
                        ) : (
                          <button className="table-action-btn" title="숨김" style={{ color: 'var(--warning-color)' }} onClick={() => handleHide(item, 'mohaeng')}><RiEyeOffLine /></button>
                        )}
                        <button className="table-action-btn delete" title="삭제" onClick={() => handleDelete(item, 'mohaeng')}><RiDeleteBinLine /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button className="pagination-btn" disabled>&lt;</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">&gt;</button>
          </div>
        </div>
      )}

      {/* 여행기록 탭 */}
      {activeTab === 'logs' && (
        <div className="card">
          <div className="filter-bar">
            <div className="search-bar">
              <RiSearchLine className="search-bar-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="제목, 작성자, 여행지 검색"
                value={logsSearch}
                onChange={(e) => setLogsSearch(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <RiFilterLine />
              <select
                className="form-input form-select"
                value={logsStatusFilter}
                onChange={(e) => setLogsStatusFilter(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="all">전체 상태</option>
                <option value="active">정상</option>
                <option value="reported">신고됨</option>
                <option value="hidden">숨김</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>썸네일</th>
                  <th>제목</th>
                  <th style={{ width: 130 }}>작성자</th>
                  <th style={{ width: 100 }}>여행지</th>
                  <th style={{ width: 60 }}>사진</th>
                  <th style={{ width: 60 }}>좋아요</th>
                  <th style={{ width: 50 }}>댓글</th>
                  <th style={{ width: 50 }}>신고</th>
                  <th style={{ width: 90 }}>작성일</th>
                  <th style={{ width: 70, whiteSpace: 'nowrap' }}>상태</th>
                  <th style={{ width: 110 }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(item => (
                  <tr key={item.id} style={{ opacity: item.status === 'hidden' ? 0.6 : 1 }}>
                    <td>
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                        onClick={() => handleViewDetail(item, 'logs')}
                      >
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        {item.imageCount > 1 && (
                          <span style={{
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                            background: 'rgba(0,0,0,0.6)',
                            color: 'white',
                            fontSize: '0.65rem',
                            padding: '2px 4px',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                          }}>
                            <RiImageLine /> {item.imageCount}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="font-medium" style={{ cursor: 'pointer' }} onClick={() => handleViewDetail(item, 'logs')}>
                        {item.title}
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {item.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} style={{ fontSize: '0.7rem', color: '#6b7280', background: '#f3f4f6', padding: '1px 6px', borderRadius: 4 }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src={item.authorAvatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                        {item.author}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <RiMapPinLine style={{ color: 'var(--primary-color)' }} />
                        <span style={{ fontSize: '0.85rem' }}>{item.location.split(',')[0]}</span>
                      </div>
                    </td>
                    <td>{item.imageCount}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <RiHeartLine style={{ color: '#ef4444' }} />
                        {item.likes}
                      </div>
                    </td>
                    <td>{item.commentsList?.length || 0}</td>
                    <td>{item.reports > 0 ? <span className="text-danger font-medium">{item.reports}</span> : '-'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{item.createdAt}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{getStatusBadge(item.status)}</td>
                    <td>
                      <div className="table-actions">
                        <button className="table-action-btn" title="상세보기" onClick={() => handleViewDetail(item, 'logs')}><RiEyeLine /></button>
                        <button className="table-action-btn" title="수정" style={{ color: 'var(--primary-color)' }} onClick={() => handleEdit(item, 'logs')}><RiEditLine /></button>
                        {item.status === 'hidden' ? (
                          <button className="table-action-btn" title="공개하기" style={{ color: 'var(--success-color)' }} onClick={() => handleUnhide(item, 'logs')}><RiCheckLine /></button>
                        ) : (
                          <button className="table-action-btn" title="숨김" style={{ color: 'var(--warning-color)' }} onClick={() => handleHide(item, 'logs')}><RiEyeOffLine /></button>
                        )}
                        <button className="table-action-btn delete" title="삭제" onClick={() => handleDelete(item, 'logs')}><RiDeleteBinLine /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button className="pagination-btn" disabled>&lt;</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">&gt;</button>
          </div>
        </div>
      )}

      {/* 여행톡 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen && detailModal.type === 'talk'}
        onClose={() => setDetailModal({ isOpen: false, item: null, type: null })}
        title="여행톡 상세"
        size="large"
        footer={detailModal.item?.status === 'reported' && (
          <>
            <button className="btn btn-secondary" onClick={() => setDetailModal({ isOpen: false, item: null, type: null })}>닫기</button>
            <button className="btn btn-success" onClick={() => { handleClearReport(detailModal.item, 'talk'); setDetailModal({ isOpen: false, item: null, type: null }); }}>신고 해제</button>
            <button className="btn btn-danger" onClick={() => { setDetailModal({ isOpen: false, item: null, type: null }); handleDelete(detailModal.item, 'talk'); }}>삭제</button>
          </>
        )}
      >
        {detailModal.item && detailModal.type === 'talk' && (
          <div>
            {/* 게시글 정보 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                {getCategoryBadge(detailModal.item.category)}
                {getStatusBadge(detailModal.item.status)}
                {detailModal.item.reports > 0 && (
                  <span className="badge badge-danger">신고 {detailModal.item.reports}건</span>
                )}
              </div>
              <h3 style={{ marginBottom: 12 }}>{detailModal.item.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={detailModal.item.authorAvatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  <span className="font-medium" style={{ color: 'var(--text-color)' }}>{detailModal.item.author}</span>
                </div>
                <span><RiCalendarLine style={{ marginRight: 4 }} />{detailModal.item.date}</span>
                <span><RiEyeLine style={{ marginRight: 4 }} />{detailModal.item.views.toLocaleString()}</span>
                <span><RiHeartLine style={{ marginRight: 4 }} />{detailModal.item.likes}</span>
                <span><RiMessage2Line style={{ marginRight: 4 }} />{detailModal.item.comments.length}</span>
              </div>
              {detailModal.item.tags && detailModal.item.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                  {detailModal.item.tags.map((tag, idx) => (
                    <span key={idx} style={{ fontSize: '0.8rem', color: 'var(--primary-color)', background: '#EEF2FF', padding: '4px 10px', borderRadius: 16 }}>
                      <RiPriceTag3Line style={{ marginRight: 4 }} />#{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 게시글 본문 */}
            <div style={{ padding: 20, background: 'var(--bg-color)', borderRadius: 8, marginBottom: 24, lineHeight: 1.8 }}>
              <div dangerouslySetInnerHTML={{ __html: detailModal.item.content }} />
            </div>

            {/* 댓글 섹션 */}
            <div>
              <h4 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiMessage2Line /> 댓글 ({detailModal.item.comments.length})
              </h4>
              {detailModal.item.comments.length === 0 ? (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-color)', borderRadius: 8 }}>
                  등록된 댓글이 없습니다.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {detailModal.item.comments.map(comment => (
                    <div key={comment.id} style={{ padding: 16, background: 'var(--bg-color)', borderRadius: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <img src={comment.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span className="font-medium">{comment.author}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{comment.date}</span>
                            </div>
                            <p style={{ margin: 0, lineHeight: 1.6 }}>{comment.text}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            className="table-action-btn"
                            title="수정"
                            style={{ color: 'var(--primary-color)' }}
                            onClick={() => handleCommentEdit(detailModal.item.id, comment)}
                          >
                            <RiEditLine />
                          </button>
                          <button
                            className="table-action-btn delete"
                            title="삭제"
                            onClick={() => handleCommentDelete(detailModal.item.id, comment.id)}
                          >
                            <RiDeleteBinLine />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* 지금모행 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen && detailModal.type === 'mohaeng'}
        onClose={() => setDetailModal({ isOpen: false, item: null, type: null })}
        title="지금모행 채팅방 상세"
        size="large"
        footer={detailModal.item?.status === 'reported' && (
          <>
            <button className="btn btn-secondary" onClick={() => setDetailModal({ isOpen: false, item: null, type: null })}>닫기</button>
            <button className="btn btn-success" onClick={() => { handleClearReport(detailModal.item, 'mohaeng'); setDetailModal({ isOpen: false, item: null, type: null }); }}>신고 해제</button>
            <button className="btn btn-danger" onClick={() => { setDetailModal({ isOpen: false, item: null, type: null }); handleDelete(detailModal.item, 'mohaeng'); }}>삭제</button>
          </>
        )}
      >
        {detailModal.item && detailModal.type === 'mohaeng' && (
          <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            {/* 채팅방 헤더 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: 16,
              background: `linear-gradient(135deg, ${chatCategories[detailModal.item.category]?.color || '#667eea'}15, ${chatCategories[detailModal.item.category]?.color || '#667eea'}05)`,
              borderRadius: 12,
              marginBottom: 20
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: `linear-gradient(135deg, ${chatCategories[detailModal.item.category]?.color || '#667eea'}, ${chatCategories[detailModal.item.category]?.color || '#667eea'}88)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem'
              }}>
                <RiChat3Line />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{detailModal.item.name}</h3>
                  <span
                    className="badge"
                    style={{
                      background: `${chatCategories[detailModal.item.category]?.color || '#667eea'}20`,
                      color: chatCategories[detailModal.item.category]?.color || '#667eea'
                    }}
                  >
                    {detailModal.item.categoryLabel}
                  </span>
                  {getStatusBadge(detailModal.item.status)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', gap: 16 }}>
                  <span><RiUserLine style={{ marginRight: 4 }} />개설자: {detailModal.item.createdBy}</span>
                  <span><RiCalendarLine style={{ marginRight: 4 }} />{detailModal.item.createdAt}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: detailModal.item.currentUsers >= detailModal.item.maxUsers ? '#ef4444' : 'var(--primary-color)' }}>
                  {detailModal.item.currentUsers}/{detailModal.item.maxUsers}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>참여 인원</div>
                {detailModal.item.reports > 0 && (
                  <span className="badge badge-danger" style={{ marginTop: 4 }}>신고 {detailModal.item.reports}건</span>
                )}
              </div>
            </div>

            {/* 두 컬럼 레이아웃: 참여자 목록 + 채팅 내역 */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
              {/* 참여자 목록 */}
              <div>
                <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiGroupLine /> 참여자 ({detailModal.item.users?.length || 0})
                </h4>
                <div style={{
                  background: 'var(--bg-color)',
                  borderRadius: 8,
                  padding: 12,
                  maxHeight: 400,
                  overflowY: 'auto'
                }}>
                  {(!detailModal.item.users || detailModal.item.users.length === 0) ? (
                    <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      참여자 정보가 없습니다.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {detailModal.item.users.map((user, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '8px 12px',
                          background: user.isCreator ? '#FEF3C7' : 'white',
                          borderRadius: 8,
                          border: user.isCreator ? '1px solid #F59E0B' : '1px solid transparent'
                        }}>
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'var(--primary-color)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            position: 'relative'
                          }}>
                            {user.name.charAt(0).toUpperCase()}
                            <span style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              border: '2px solid white',
                              background: user.status === 'online' ? '#22c55e' : user.status === 'away' ? '#f59e0b' : '#9ca3af'
                            }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: user.isCreator ? 600 : 400, display: 'flex', alignItems: 'center', gap: 4 }}>
                              {user.name}
                              {user.isCreator && <span style={{ fontSize: '0.65rem', background: '#F59E0B', color: 'white', padding: '1px 4px', borderRadius: 4 }}>방장</span>}
                            </div>
                            <div style={{
                              fontSize: '0.7rem',
                              color: user.status === 'online' ? '#22c55e' : user.status === 'away' ? '#f59e0b' : '#9ca3af'
                            }}>
                              {user.status === 'online' ? '온라인' : user.status === 'away' ? '자리비움' : '오프라인'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 채팅 내역 */}
              <div>
                <h4 style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiMessage2Line /> 채팅 내역 ({detailModal.item.messages?.length || 0})
                </h4>
                <div style={{
                  background: '#f8fafc',
                  borderRadius: 8,
                  padding: 16,
                  height: 400,
                  overflowY: 'auto',
                  border: '1px solid var(--border-color)'
                }}>
                  {(!detailModal.item.messages || detailModal.item.messages.length === 0) ? (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-secondary)' }}>
                      <RiChat3Line style={{ fontSize: '2rem', marginBottom: 8, opacity: 0.5 }} />
                      <p>채팅 내역이 없습니다.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {detailModal.item.messages.map((msg, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: 10 }}>
                          <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: 'var(--primary-color)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            flexShrink: 0
                          }}>
                            {msg.sender.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{msg.sender}</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{msg.date} {msg.time}</span>
                            </div>
                            <div style={{
                              background: 'white',
                              padding: '10px 14px',
                              borderRadius: '0 12px 12px 12px',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                              lineHeight: 1.5,
                              fontSize: '0.9rem'
                            }}>
                              {msg.message}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 여행기록 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen && detailModal.type === 'logs'}
        onClose={() => setDetailModal({ isOpen: false, item: null, type: null })}
        title="여행기록 상세"
        size="large"
        footer={detailModal.item?.status === 'reported' && (
          <>
            <button className="btn btn-secondary" onClick={() => setDetailModal({ isOpen: false, item: null, type: null })}>닫기</button>
            <button className="btn btn-success" onClick={() => { handleClearReport(detailModal.item, 'logs'); setDetailModal({ isOpen: false, item: null, type: null }); }}>신고 해제</button>
            <button className="btn btn-danger" onClick={() => { setDetailModal({ isOpen: false, item: null, type: null }); handleDelete(detailModal.item, 'logs'); }}>삭제</button>
          </>
        )}
      >
        {detailModal.item && detailModal.type === 'logs' && (
          <div style={{ maxHeight: '75vh', overflowY: 'auto' }}>
            {/* 커버 이미지 */}
            <div style={{ position: 'relative', height: 250, overflow: 'hidden', borderRadius: 12, marginBottom: 20 }}>
              <img
                src={detailModal.item.coverImage}
                alt={detailModal.item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 100,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.5))'
              }} />
              <span style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                padding: '4px 10px',
                borderRadius: 16,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <RiImageLine /> {detailModal.item.imageCount} 장
              </span>
            </div>

            {/* 작성자 정보 & 상태 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={detailModal.item.authorAvatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div className="font-medium" style={{ fontSize: '1rem' }}>{detailModal.item.author}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {detailModal.item.createdAt} · {detailModal.item.location}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {getStatusBadge(detailModal.item.status)}
                {detailModal.item.reports > 0 && (
                  <span className="badge badge-danger">신고 {detailModal.item.reports}건</span>
                )}
              </div>
            </div>

            {/* 제목 */}
            <h2 style={{ marginBottom: 12, fontSize: '1.5rem' }}>{detailModal.item.title}</h2>

            {/* 여행 정보 */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 16, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <RiMapPinLine style={{ color: 'var(--primary-color)' }} /> {detailModal.item.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <RiCalendarLine style={{ color: 'var(--primary-color)' }} /> {detailModal.item.dateRange}
              </span>
            </div>

            {/* 태그 */}
            {detailModal.item.tags && detailModal.item.tags.length > 0 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {detailModal.item.tags.map((tag, idx) => (
                  <span key={idx} style={{
                    fontSize: '0.85rem',
                    color: 'var(--primary-color)',
                    background: '#EEF2FF',
                    padding: '4px 12px',
                    borderRadius: 16
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 통계 */}
            <div style={{
              display: 'flex',
              gap: 16,
              padding: '12px 16px',
              background: 'var(--bg-color)',
              borderRadius: 8,
              marginBottom: 20
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <RiHeartLine style={{ color: '#ef4444' }} /> 좋아요 {detailModal.item.likes}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <RiMessage2Line style={{ color: 'var(--primary-color)' }} /> 댓글 {detailModal.item.commentsList?.length || 0}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <RiBookmarkLine style={{ color: '#f59e0b' }} /> 저장 {detailModal.item.bookmarks}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <RiEyeLine style={{ color: '#6b7280' }} /> 조회 {detailModal.item.views.toLocaleString()}
              </span>
            </div>

            {/* 인트로 */}
            <div style={{ padding: 16, background: 'var(--bg-color)', borderRadius: 8, marginBottom: 24, lineHeight: 1.8 }}>
              {detailModal.item.intro}
            </div>

            {/* 일차별 여행 기록 */}
            {detailModal.item.days && detailModal.item.days.map((day, dayIdx) => (
              <div key={dayIdx} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <span style={{
                    background: 'linear-gradient(135deg, var(--primary-color), #7c3aed)',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}>
                    DAY {day.day}
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{day.date}</span>
                </div>

                {day.places.map((place, placeIdx) => (
                  <div key={placeIdx} style={{
                    background: '#f8fafc',
                    borderRadius: 12,
                    overflow: 'hidden',
                    marginBottom: 16
                  }}>
                    <div style={{ height: 160, overflow: 'hidden' }}>
                      <img src={place.image} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <RiMapPinLine style={{ color: 'var(--primary-color)' }} />
                          {place.name}
                        </h4>
                        <div style={{ color: '#fbbf24', display: 'flex', gap: 2 }}>
                          {[...Array(5)].map((_, i) => (
                            <RiStarFill key={i} style={{ opacity: i < place.rating ? 1 : 0.3 }} />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{place.address}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <RiTimeLine style={{ color: 'var(--primary-color)' }} /> {place.time}
                      </p>
                      <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.95rem' }}>{place.review}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* 아웃트로 */}
            {detailModal.item.outro && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(74, 144, 217, 0.08), rgba(124, 58, 237, 0.08))',
                padding: 20,
                borderRadius: 12,
                marginBottom: 24
              }}>
                <p style={{ margin: 0, fontStyle: 'italic', lineHeight: 1.7 }}>{detailModal.item.outro}</p>
              </div>
            )}

            {/* 댓글 섹션 */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
              <h4 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiMessage2Line /> 댓글 ({detailModal.item.commentsList?.length || 0})
              </h4>
              {(!detailModal.item.commentsList || detailModal.item.commentsList.length === 0) ? (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-color)', borderRadius: 8 }}>
                  등록된 댓글이 없습니다.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {detailModal.item.commentsList.map(comment => (
                    <div key={comment.id} style={{ padding: 16, background: 'var(--bg-color)', borderRadius: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <img src={comment.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span className="font-medium">{comment.author}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{comment.time}</span>
                              {comment.likes > 0 && (
                                <span style={{ fontSize: '0.75rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <RiHeartLine /> {comment.likes}
                                </span>
                              )}
                            </div>
                            <p style={{ margin: 0, lineHeight: 1.6 }}>{comment.text}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            className="table-action-btn"
                            title="수정"
                            style={{ color: 'var(--primary-color)' }}
                            onClick={() => handleLogCommentEdit(detailModal.item.id, comment)}
                          >
                            <RiEditLine />
                          </button>
                          <button
                            className="table-action-btn delete"
                            title="삭제"
                            onClick={() => handleLogCommentDelete(detailModal.item.id, comment.id)}
                          >
                            <RiDeleteBinLine />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* 게시글 수정 모달 */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, item: null, type: null })}
        title={editModal.type === 'logs' ? '여행기록 수정' : '게시글 수정'}
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setEditModal({ isOpen: false, item: null, type: null })}>취소</button>
            <button className="btn btn-primary" onClick={handleEditSave}>저장</button>
          </>
        }
      >
        {editModal.item && editModal.type === 'talk' && (
          <div>
            <div className="form-group">
              <label className="form-label">카테고리</label>
              <select
                className="form-input form-select"
                value={editForm.category}
                onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="notice">공지사항</option>
                <option value="free">자유게시판</option>
                <option value="companion">동행 구하기</option>
                <option value="info">정보 공유</option>
                <option value="qna">여행 Q&A</option>
                <option value="review">후기</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">제목</label>
              <input
                type="text"
                className="form-input"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">내용</label>
              <textarea
                className="form-input"
                rows={10}
                value={editForm.content}
                onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">태그 (쉼표로 구분)</label>
              <input
                type="text"
                className="form-input"
                value={editForm.tags}
                onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="제주도, 맛집, 여행"
              />
            </div>
          </div>
        )}
        {editModal.item && editModal.type === 'logs' && (
          <div>
            {/* 커버 이미지 미리보기 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ position: 'relative', height: 150, overflow: 'hidden', borderRadius: 8 }}>
                <img
                  src={editModal.item.coverImage}
                  alt={editModal.item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 8 }}>
                * 커버 이미지는 사용자 페이지에서만 변경할 수 있습니다.
              </p>
            </div>
            <div className="form-group">
              <label className="form-label">제목</label>
              <input
                type="text"
                className="form-input"
                value={editLogForm.title}
                onChange={(e) => setEditLogForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">인트로 (여행 소개글)</label>
              <textarea
                className="form-input"
                rows={4}
                value={editLogForm.intro}
                onChange={(e) => setEditLogForm(prev => ({ ...prev, intro: e.target.value }))}
                style={{ resize: 'vertical' }}
                placeholder="여행 시작 부분에 표시되는 소개글입니다."
              />
            </div>
            <div className="form-group">
              <label className="form-label">아웃트로 (마무리 글)</label>
              <textarea
                className="form-input"
                rows={4}
                value={editLogForm.outro}
                onChange={(e) => setEditLogForm(prev => ({ ...prev, outro: e.target.value }))}
                style={{ resize: 'vertical' }}
                placeholder="여행 기록 마지막에 표시되는 마무리 글입니다."
              />
            </div>
            <div className="form-group">
              <label className="form-label">태그 (쉼표로 구분)</label>
              <input
                type="text"
                className="form-input"
                value={editLogForm.tags}
                onChange={(e) => setEditLogForm(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="제주도, 혼자여행, 힐링"
              />
            </div>
            <div style={{ padding: 12, background: '#FEF3C7', borderRadius: 8, fontSize: '0.875rem', color: '#92400E' }}>
              <strong>안내:</strong> 일차별 장소 정보는 사용자 페이지에서만 수정할 수 있습니다. 이곳에서는 제목, 소개글, 태그만 수정 가능합니다.
            </div>
          </div>
        )}
      </Modal>

      {/* 댓글 수정 모달 */}
      <Modal
        isOpen={commentEditModal.isOpen}
        onClose={() => setCommentEditModal({ isOpen: false, postId: null, comment: null })}
        title="댓글 수정"
        size="medium"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setCommentEditModal({ isOpen: false, postId: null, comment: null })}>취소</button>
            <button className="btn btn-primary" onClick={handleCommentEditSave}>저장</button>
          </>
        }
      >
        {commentEditModal.comment && (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={commentEditModal.comment.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
              <div>
                <div className="font-medium">{commentEditModal.comment.author}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{commentEditModal.comment.date}</div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">댓글 내용</label>
              <textarea
                className="form-input"
                rows={4}
                value={editCommentText}
                onChange={(e) => setEditCommentText(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 글쓰기 모달 */}
      <Modal
        isOpen={writeModal}
        onClose={() => setWriteModal(false)}
        title="게시글 작성"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setWriteModal(false)}>취소</button>
            <button className="btn btn-primary" onClick={handleWriteSave}>등록</button>
          </>
        }
      >
        <div>
          <div className="form-group">
            <label className="form-label">카테고리</label>
            <select
              className="form-input form-select"
              value={writeForm.category}
              onChange={(e) => setWriteForm(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="notice">공지사항</option>
              <option value="free">자유게시판</option>
              <option value="companion">동행 구하기</option>
              <option value="info">정보 공유</option>
              <option value="qna">여행 Q&A</option>
              <option value="review">후기</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">제목 <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-input"
              value={writeForm.title}
              onChange={(e) => setWriteForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="제목을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label className="form-label">내용 <span className="text-danger">*</span></label>
            <textarea
              className="form-input"
              rows={12}
              value={writeForm.content}
              onChange={(e) => setWriteForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="내용을 입력하세요"
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">태그 (쉼표로 구분)</label>
            <input
              type="text"
              className="form-input"
              value={writeForm.tags}
              onChange={(e) => setWriteForm(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="공지사항, 이벤트, 안내"
            />
          </div>
          {writeForm.category === 'notice' && (
            <div style={{ padding: 12, background: '#FEF3C7', borderRadius: 8, fontSize: '0.875rem', color: '#92400E' }}>
              <strong>안내:</strong> 공지사항은 게시판 상단에 고정되어 모든 사용자에게 노출됩니다.
            </div>
          )}
        </div>
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null, type: null })}
        onConfirm={handleDeleteConfirm}
        title={
          deleteModal.type === 'talk' ? '게시글 삭제' :
          deleteModal.type === 'mohaeng' ? '채팅방 삭제' :
          '여행기록 삭제'
        }
        message={`정말 "${deleteModal.item?.title || deleteModal.item?.name}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="삭제"
        type="danger"
      />

      {/* 숨김 확인 모달 */}
      <ConfirmModal
        isOpen={hideModal.isOpen}
        onClose={() => setHideModal({ isOpen: false, item: null, type: null })}
        onConfirm={handleHideConfirm}
        title={
          hideModal.type === 'talk' ? '게시글 숨김' :
          hideModal.type === 'mohaeng' ? '채팅방 숨김' :
          '여행기록 숨김'
        }
        message={`"${hideModal.item?.title || hideModal.item?.name}"을(를) 숨김 처리하시겠습니까?`}
        confirmText="숨김"
        type="warning"
      />

      {/* 댓글 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={commentDeleteModal.isOpen}
        onClose={() => setCommentDeleteModal({ isOpen: false, postId: null, commentId: null })}
        onConfirm={handleCommentDeleteConfirm}
        title="댓글 삭제"
        message="정말 이 댓글을 삭제하시겠습니까?"
        confirmText="삭제"
        type="danger"
      />

      {/* 여행기록 댓글 수정 모달 */}
      <Modal
        isOpen={logCommentEditModal.isOpen}
        onClose={() => setLogCommentEditModal({ isOpen: false, logId: null, comment: null })}
        title="댓글 수정"
        size="medium"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setLogCommentEditModal({ isOpen: false, logId: null, comment: null })}>취소</button>
            <button className="btn btn-primary" onClick={handleLogCommentEditSave}>저장</button>
          </>
        }
      >
        {logCommentEditModal.comment && (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={logCommentEditModal.comment.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%' }} />
              <div>
                <div className="font-medium">{logCommentEditModal.comment.author}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{logCommentEditModal.comment.time}</div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">댓글 내용</label>
              <textarea
                className="form-input"
                rows={4}
                value={editLogCommentText}
                onChange={(e) => setEditLogCommentText(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 여행기록 댓글 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={logCommentDeleteModal.isOpen}
        onClose={() => setLogCommentDeleteModal({ isOpen: false, logId: null, commentId: null })}
        onConfirm={handleLogCommentDeleteConfirm}
        title="댓글 삭제"
        message="정말 이 댓글을 삭제하시겠습니까?"
        confirmText="삭제"
        type="danger"
      />
    </div>
  );
}

export default Community;
