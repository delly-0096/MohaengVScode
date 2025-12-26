import { useState } from 'react';
import '../products/Products.css';

// 샘플 일정 데이터 (사용자 페이지 기반 개선)
const initialSchedulesData = [
  {
    id: 1,
    memberId: 'M001',
    memberName: '김지민',
    memberEmail: 'jimin@email.com',
    memberPhone: '010-1234-5678',
    title: '제주도 3박4일 여행',
    destination: '제주',
    startDate: '2024-03-20',
    endDate: '2024-03-23',
    status: '예정',
    isPublic: true,
    isAIRecommended: true,
    companions: 2,
    budget: 1500000,
    dailySchedule: [
      {
        day: 1,
        date: '2024-03-20',
        places: [
          { time: '10:00', category: '이동', name: '김포공항 → 제주공항', location: '제주시', estimatedCost: 80000 },
          { time: '12:00', category: '맛집', name: '제주 흑돼지 거리', location: '제주시 연동', rating: 4.5, estimatedCost: 45000 },
          { time: '14:00', category: '관광지', name: '용두암', location: '제주시', rating: 4.3, estimatedCost: 0 },
          { time: '16:00', category: '숙소', name: '제주 오션뷰 호텔', location: '제주시', rating: 4.7, estimatedCost: 150000 }
        ]
      },
      {
        day: 2,
        date: '2024-03-21',
        places: [
          { time: '09:00', category: '관광지', name: '성산일출봉', location: '서귀포시', rating: 4.8, estimatedCost: 5000 },
          { time: '12:00', category: '맛집', name: '성산 해녀촌', location: '서귀포시', rating: 4.6, estimatedCost: 35000 },
          { time: '14:00', category: '체험', name: '스쿠버다이빙 체험', location: '서귀포시', rating: 4.9, estimatedCost: 100000 }
        ]
      },
      {
        day: 3,
        date: '2024-03-22',
        places: [
          { time: '08:00', category: '관광지', name: '한라산 등반', location: '제주시', rating: 4.7, estimatedCost: 0 },
          { time: '17:00', category: '맛집', name: '제주 갈치조림', location: '서귀포시', rating: 4.4, estimatedCost: 40000 }
        ]
      },
      {
        day: 4,
        date: '2024-03-23',
        places: [
          { time: '10:00', category: '관광지', name: '협재해수욕장', location: '제주시', rating: 4.6, estimatedCost: 0 },
          { time: '14:00', category: '이동', name: '제주공항 → 김포공항', location: '제주시', estimatedCost: 80000 }
        ]
      }
    ],
    reservations: [
      { type: '항공', name: '서울-제주 왕복', date: '2024-03-20', status: '확정', price: 160000 },
      { type: '숙박', name: '제주 오션뷰 호텔', date: '2024-03-20~23', status: '확정', price: 450000 },
      { type: '체험', name: '스쿠버다이빙 체험', date: '2024-03-21', status: '확정', price: 100000 }
    ],
    travelLogWritten: false,
    createdAt: '2024-03-10',
    lastModified: '2024-03-15 14:30',
    views: 45,
    shareCount: 12,
    likes: 8
  },
  {
    id: 2,
    memberId: 'M002',
    memberName: '이수현',
    memberEmail: 'suhyun@email.com',
    memberPhone: '010-2345-6789',
    title: '부산 해운대 가족여행',
    destination: '부산',
    startDate: '2024-03-25',
    endDate: '2024-03-27',
    status: '예정',
    isPublic: true,
    isAIRecommended: false,
    companions: 4,
    budget: 2000000,
    dailySchedule: [
      {
        day: 1,
        date: '2024-03-25',
        places: [
          { time: '11:00', category: '이동', name: 'KTX 서울 → 부산', location: '부산역', estimatedCost: 240000 },
          { time: '13:00', category: '맛집', name: '해운대 밀면', location: '해운대구', rating: 4.4, estimatedCost: 32000 },
          { time: '15:00', category: '숙소', name: '해운대 리조트', location: '해운대구', rating: 4.8, estimatedCost: 350000 },
          { time: '17:00', category: '관광지', name: '해운대 해수욕장', location: '해운대구', rating: 4.7, estimatedCost: 0 }
        ]
      },
      {
        day: 2,
        date: '2024-03-26',
        places: [
          { time: '10:00', category: '관광지', name: '해동용궁사', location: '기장군', rating: 4.6, estimatedCost: 0 },
          { time: '13:00', category: '맛집', name: '기장 대게 거리', location: '기장군', rating: 4.5, estimatedCost: 120000 },
          { time: '16:00', category: '관광지', name: '광안대교 야경', location: '수영구', rating: 4.8, estimatedCost: 0 }
        ]
      },
      {
        day: 3,
        date: '2024-03-27',
        places: [
          { time: '09:00', category: '관광지', name: '감천문화마을', location: '사하구', rating: 4.5, estimatedCost: 0 },
          { time: '12:00', category: '맛집', name: '남포동 씨앗호떡', location: '중구', rating: 4.3, estimatedCost: 8000 },
          { time: '15:00', category: '이동', name: 'KTX 부산 → 서울', location: '부산역', estimatedCost: 240000 }
        ]
      }
    ],
    reservations: [
      { type: '숙박', name: '해운대 리조트', date: '2024-03-25~27', status: '확정', price: 700000 }
    ],
    travelLogWritten: false,
    createdAt: '2024-03-12',
    lastModified: '2024-03-14 09:15',
    views: 32,
    shareCount: 5,
    likes: 3
  },
  {
    id: 3,
    memberId: 'M003',
    memberName: '박민준',
    memberEmail: 'minjun@email.com',
    memberPhone: '010-3456-7890',
    title: '강원도 스키여행',
    destination: '강원',
    startDate: '2024-02-15',
    endDate: '2024-02-17',
    status: '완료',
    isPublic: false,
    isAIRecommended: true,
    companions: 3,
    budget: 800000,
    dailySchedule: [
      {
        day: 1,
        date: '2024-02-15',
        places: [
          { time: '07:00', category: '이동', name: '서울 → 평창', location: '평창군', estimatedCost: 30000 },
          { time: '10:00', category: '체험', name: '스키장 리프트', location: '평창군', rating: 4.6, estimatedCost: 80000 },
          { time: '18:00', category: '숙소', name: '평창 리조트', location: '평창군', rating: 4.5, estimatedCost: 200000 }
        ]
      },
      {
        day: 2,
        date: '2024-02-16',
        places: [
          { time: '09:00', category: '체험', name: '스노보드 강습', location: '평창군', rating: 4.7, estimatedCost: 100000 },
          { time: '18:00', category: '맛집', name: '평창 한우마을', location: '평창군', rating: 4.4, estimatedCost: 80000 },
          { time: '20:00', category: '체험', name: '온천', location: '평창군', rating: 4.3, estimatedCost: 15000 }
        ]
      },
      {
        day: 3,
        date: '2024-02-17',
        places: [
          { time: '10:00', category: '체험', name: '스키 프리라이딩', location: '평창군', rating: 4.6, estimatedCost: 50000 },
          { time: '15:00', category: '이동', name: '평창 → 서울', location: '서울', estimatedCost: 30000 }
        ]
      }
    ],
    reservations: [
      { type: '숙박', name: '평창 리조트', date: '2024-02-15~17', status: '이용완료', price: 400000 }
    ],
    travelLogWritten: true,
    travelLogId: 'TL003',
    createdAt: '2024-02-01',
    lastModified: '2024-02-18 10:00',
    views: 18,
    shareCount: 2,
    likes: 5
  },
  {
    id: 4,
    memberId: 'M004',
    memberName: '최유진',
    memberEmail: 'yujin@email.com',
    memberPhone: '010-4567-8901',
    title: '경주 역사탐방',
    destination: '경주',
    startDate: '2024-03-16',
    endDate: '2024-03-17',
    status: '진행중',
    isPublic: true,
    isAIRecommended: false,
    companions: 1,
    budget: 300000,
    dailySchedule: [
      {
        day: 1,
        date: '2024-03-16',
        places: [
          { time: '09:00', category: '관광지', name: '불국사', location: '경주시', rating: 4.8, estimatedCost: 6000 },
          { time: '12:00', category: '맛집', name: '경주 쌈밥거리', location: '경주시', rating: 4.3, estimatedCost: 12000 },
          { time: '14:00', category: '관광지', name: '석굴암', location: '경주시', rating: 4.7, estimatedCost: 6000 },
          { time: '17:00', category: '체험', name: '한복체험', location: '경주시', rating: 4.5, estimatedCost: 30000 },
          { time: '19:00', category: '숙소', name: '경주 한옥마을', location: '경주시', rating: 4.6, estimatedCost: 120000 }
        ]
      },
      {
        day: 2,
        date: '2024-03-17',
        places: [
          { time: '09:00', category: '관광지', name: '첨성대', location: '경주시', rating: 4.5, estimatedCost: 0 },
          { time: '11:00', category: '관광지', name: '동궁과 월지', location: '경주시', rating: 4.7, estimatedCost: 3000 },
          { time: '13:00', category: '맛집', name: '황리단길 카페', location: '경주시', rating: 4.4, estimatedCost: 15000 }
        ]
      }
    ],
    reservations: [
      { type: '체험', name: '경주 한복체험', date: '2024-03-16', status: '확정', price: 30000 }
    ],
    travelLogWritten: false,
    createdAt: '2024-03-05',
    lastModified: '2024-03-16 08:00',
    views: 56,
    shareCount: 8,
    likes: 12
  },
  {
    id: 5,
    memberId: 'M005',
    memberName: '정다은',
    memberEmail: 'daeun@email.com',
    memberPhone: '010-5678-9012',
    title: '여수 낭만여행',
    destination: '전남',
    startDate: '2024-04-01',
    endDate: '2024-04-03',
    status: '예정',
    isPublic: true,
    isAIRecommended: true,
    companions: 2,
    budget: 600000,
    dailySchedule: [
      {
        day: 1,
        date: '2024-04-01',
        places: [
          { time: '10:00', category: '이동', name: 'KTX 서울 → 여수', location: '여수시', estimatedCost: 100000 },
          { time: '13:00', category: '맛집', name: '여수 게장백반', location: '여수시', rating: 4.5, estimatedCost: 30000 },
          { time: '15:00', category: '관광지', name: '오동도', location: '여수시', rating: 4.6, estimatedCost: 0 },
          { time: '18:00', category: '숙소', name: '여수 펜션', location: '여수시', rating: 4.4, estimatedCost: 100000 }
        ]
      },
      {
        day: 2,
        date: '2024-04-02',
        places: [
          { time: '10:00', category: '체험', name: '해상케이블카', location: '여수시', rating: 4.8, estimatedCost: 26000 },
          { time: '13:00', category: '맛집', name: '여수 서대회', location: '여수시', rating: 4.3, estimatedCost: 40000 },
          { time: '16:00', category: '관광지', name: '향일암', location: '여수시', rating: 4.7, estimatedCost: 2000 },
          { time: '20:00', category: '관광지', name: '낭만포차거리', location: '여수시', rating: 4.5, estimatedCost: 50000 }
        ]
      },
      {
        day: 3,
        date: '2024-04-03',
        places: [
          { time: '10:00', category: '관광지', name: '이순신광장', location: '여수시', rating: 4.4, estimatedCost: 0 },
          { time: '14:00', category: '이동', name: 'KTX 여수 → 서울', location: '여수시', estimatedCost: 100000 }
        ]
      }
    ],
    reservations: [],
    travelLogWritten: false,
    createdAt: '2024-03-14',
    lastModified: '2024-03-14 16:20',
    views: 23,
    shareCount: 3,
    likes: 2
  },
  {
    id: 6,
    memberId: 'M006',
    memberName: '한서준',
    memberEmail: 'seojun@email.com',
    memberPhone: '010-6789-0123',
    title: '속초 당일치기',
    destination: '강원',
    startDate: '2024-03-18',
    endDate: '2024-03-18',
    status: '취소',
    isPublic: false,
    isAIRecommended: false,
    companions: 2,
    budget: 200000,
    dailySchedule: [
      {
        day: 1,
        date: '2024-03-18',
        places: [
          { time: '07:00', category: '이동', name: '서울 → 속초', location: '속초시', estimatedCost: 30000 },
          { time: '10:00', category: '관광지', name: '설악산 케이블카', location: '속초시', rating: 4.6, estimatedCost: 15000 },
          { time: '13:00', category: '맛집', name: '대포항 회센터', location: '속초시', rating: 4.5, estimatedCost: 60000 },
          { time: '16:00', category: '이동', name: '속초 → 서울', location: '서울', estimatedCost: 30000 }
        ]
      }
    ],
    reservations: [],
    cancelReason: '개인 사정으로 취소',
    cancelDate: '2024-03-17',
    travelLogWritten: false,
    createdAt: '2024-03-08',
    lastModified: '2024-03-17 11:00',
    views: 12,
    shareCount: 0,
    likes: 0
  }
];

function Schedules() {
  const [schedulesData, setSchedulesData] = useState(initialSchedulesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDestination, setFilterDestination] = useState('all');
  const [filterVisibility, setFilterVisibility] = useState('all');
  const [filterAI, setFilterAI] = useState('all');
  const [filterTravelLog, setFilterTravelLog] = useState('all');
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);

  // 장소 수 계산
  const getPlacesCount = (dailySchedule) => {
    if (!dailySchedule) return 0;
    return dailySchedule.reduce((total, day) => total + (day.places?.length || 0), 0);
  };

  // 통계 계산
  const stats = {
    total: schedulesData.length,
    upcoming: schedulesData.filter(s => s.status === '예정').length,
    ongoing: schedulesData.filter(s => s.status === '진행중').length,
    completed: schedulesData.filter(s => s.status === '완료').length,
    aiRecommended: schedulesData.filter(s => s.isAIRecommended).length,
    travelLogWritten: schedulesData.filter(s => s.travelLogWritten).length
  };

  // 상태 목록
  const statusList = ['예정', '진행중', '완료', '취소'];

  // 지역 목록
  const destinations = ['서울', '부산', '제주', '강원', '경기', '인천', '대구', '대전', '광주', '울산', '경주', '전남', '전북', '충남', '충북'];

  // 카테고리 색상
  const getCategoryClass = (category) => {
    switch (category) {
      case '관광지': return 'tourism';
      case '맛집': return 'food';
      case '숙소': return 'accommodation';
      case '체험': return 'experience';
      case '이동': return 'transport';
      default: return '';
    }
  };

  // 카테고리 아이콘
  const getCategoryIcon = (category) => {
    switch (category) {
      case '관광지': return 'bi-geo-alt';
      case '맛집': return 'bi-cup-hot';
      case '숙소': return 'bi-house';
      case '체험': return 'bi-stars';
      case '이동': return 'bi-car-front';
      default: return 'bi-pin';
    }
  };

  // 필터링된 데이터
  const filteredData = schedulesData.filter(schedule => {
    const matchesSearch = schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || schedule.status === filterStatus;
    const matchesDestination = filterDestination === 'all' || schedule.destination === filterDestination;
    const matchesVisibility = filterVisibility === 'all' ||
                              (filterVisibility === 'public' && schedule.isPublic) ||
                              (filterVisibility === 'private' && !schedule.isPublic);
    const matchesAI = filterAI === 'all' ||
                      (filterAI === 'ai' && schedule.isAIRecommended) ||
                      (filterAI === 'manual' && !schedule.isAIRecommended);
    const matchesTravelLog = filterTravelLog === 'all' ||
                             (filterTravelLog === 'written' && schedule.travelLogWritten) ||
                             (filterTravelLog === 'notWritten' && !schedule.travelLogWritten && schedule.status === '완료');
    return matchesSearch && matchesStatus && matchesDestination && matchesVisibility && matchesAI && matchesTravelLog;
  });

  // 상세 모달 열기
  const openDetailModal = (schedule) => {
    setSelectedSchedule(schedule);
    setSelectedDay(1);
    setIsDetailModalOpen(true);
  };

  // 삭제 모달 열기
  const openDeleteModal = (schedule) => {
    setSelectedSchedule(schedule);
    setIsDeleteModalOpen(true);
  };

  // 일정 삭제
  const deleteSchedule = () => {
    setSchedulesData(prev => prev.filter(s => s.id !== selectedSchedule.id));
    setIsDeleteModalOpen(false);
  };

  // 공개 설정 변경
  const toggleVisibility = (schedule) => {
    setSchedulesData(prev => prev.map(s =>
      s.id === schedule.id ? { ...s, isPublic: !s.isPublic } : s
    ));
  };

  // 금액 포맷
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // 상태 뱃지 색상
  const getStatusClass = (status) => {
    switch (status) {
      case '예정': return 'upcoming';
      case '진행중': return 'ongoing';
      case '완료': return 'completed';
      case '취소': return 'cancelled';
      default: return '';
    }
  };

  // 일수 계산
  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return '당일치기';
    return `${diffDays}박${diffDays + 1}일`;
  };

  // 예상 총 비용 계산
  const getTotalEstimatedCost = (dailySchedule) => {
    if (!dailySchedule) return 0;
    return dailySchedule.reduce((total, day) => {
      return total + day.places.reduce((dayTotal, place) => dayTotal + (place.estimatedCost || 0), 0);
    }, 0);
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>일정 관리</h1>
        <div className="header-actions">
          <button className="btn btn-outline">
            <i className="bi bi-download"></i> 엑셀 다운로드
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-calendar3"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">전체 일정</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="bi bi-calendar-plus"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.upcoming}</span>
            <span className="stat-label">예정</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <i className="bi bi-calendar-event"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.ongoing}</span>
            <span className="stat-label">진행중</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="bi bi-calendar-check"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">완료</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan">
            <i className="bi bi-robot"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.aiRecommended}</span>
            <span className="stat-label">AI 추천</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <i className="bi bi-journal-text"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.travelLogWritten}</span>
            <span className="stat-label">여행기록 작성</span>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="일정명, 회원명, 회원ID, 목적지 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">전체 상태</option>
              {statusList.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select value={filterDestination} onChange={(e) => setFilterDestination(e.target.value)}>
              <option value="all">전체 지역</option>
              {destinations.map(dest => (
                <option key={dest} value={dest}>{dest}</option>
              ))}
            </select>
            <select value={filterVisibility} onChange={(e) => setFilterVisibility(e.target.value)}>
              <option value="all">전체 공개설정</option>
              <option value="public">공개</option>
              <option value="private">비공개</option>
            </select>
            <select value={filterAI} onChange={(e) => setFilterAI(e.target.value)}>
              <option value="all">전체 생성방식</option>
              <option value="ai">AI 추천</option>
              <option value="manual">직접 작성</option>
            </select>
            <select value={filterTravelLog} onChange={(e) => setFilterTravelLog(e.target.value)}>
              <option value="all">전체 여행기록</option>
              <option value="written">작성완료</option>
              <option value="notWritten">미작성 (완료된 여행)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 일정 목록 테이블 */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>일정명</th>
              <th>회원</th>
              <th>목적지</th>
              <th>기간</th>
              <th>장소</th>
              <th>공개</th>
              <th>조회/공유</th>
              <th>상태</th>
              <th>여행기록</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(schedule => (
              <tr key={schedule.id}>
                <td>
                  <div className="schedule-title-cell">
                    <div className="schedule-title" onClick={() => openDetailModal(schedule)}>
                      {schedule.isAIRecommended && (
                        <span className="ai-badge" title="AI 추천 일정">
                          <i className="bi bi-robot"></i>
                        </span>
                      )}
                      {schedule.title}
                    </div>
                    <small className="text-muted">
                      {schedule.createdAt} 등록 · 최근 수정: {schedule.lastModified?.split(' ')[0] || schedule.createdAt}
                    </small>
                  </div>
                </td>
                <td>
                  <div>{schedule.memberName}</div>
                  <small className="text-muted">{schedule.memberId}</small>
                </td>
                <td>{schedule.destination}</td>
                <td>
                  <div>{schedule.startDate}</div>
                  <small className="text-muted">{getDuration(schedule.startDate, schedule.endDate)}</small>
                </td>
                <td>
                  <span className="places-count">
                    <i className="bi bi-geo-alt"></i> {getPlacesCount(schedule.dailySchedule)}곳
                  </span>
                </td>
                <td>
                  <button
                    className={`visibility-toggle ${schedule.isPublic ? 'public' : 'private'}`}
                    onClick={() => toggleVisibility(schedule)}
                    title={schedule.isPublic ? '공개' : '비공개'}
                  >
                    <i className={`bi ${schedule.isPublic ? 'bi-globe' : 'bi-lock'}`}></i>
                  </button>
                </td>
                <td>
                  <div className="view-share-stats">
                    <span title="조회수"><i className="bi bi-eye"></i> {schedule.views}</span>
                    <span title="공유수"><i className="bi bi-share"></i> {schedule.shareCount}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(schedule.status)}`}>
                    {schedule.status}
                  </span>
                </td>
                <td>
                  {schedule.status === '완료' ? (
                    schedule.travelLogWritten ? (
                      <span className="travel-log-badge written">
                        <i className="bi bi-journal-check"></i> 작성완료
                      </span>
                    ) : (
                      <span className="travel-log-badge not-written">
                        <i className="bi bi-journal-x"></i> 미작성
                      </span>
                    )
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="상세보기" onClick={() => openDetailModal(schedule)}>
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn-icon danger" title="삭제" onClick={() => openDeleteModal(schedule)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-calendar-x"></i>
            <p>조건에 맞는 일정이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {isDetailModalOpen && selectedSchedule && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>일정 상세 정보</h2>
              <button className="modal-close" onClick={() => setIsDetailModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              {/* 일정 헤더 */}
              <div className="schedule-detail-header">
                <h3>
                  {selectedSchedule.isAIRecommended && (
                    <span className="ai-badge large" title="AI 추천 일정">
                      <i className="bi bi-robot"></i> AI 추천
                    </span>
                  )}
                  {selectedSchedule.title}
                </h3>
                <div className="schedule-meta">
                  <span className={`status-badge ${getStatusClass(selectedSchedule.status)}`}>
                    {selectedSchedule.status}
                  </span>
                  <span className={`visibility-badge ${selectedSchedule.isPublic ? 'public' : 'private'}`}>
                    <i className={`bi ${selectedSchedule.isPublic ? 'bi-globe' : 'bi-lock'}`}></i>
                    {selectedSchedule.isPublic ? '공개' : '비공개'}
                  </span>
                </div>
              </div>

              <div className="detail-grid">
                {/* 기본 정보 */}
                <div className="detail-section">
                  <h4><i className="bi bi-info-circle"></i> 기본 정보</h4>
                  <div className="detail-row">
                    <span className="label">목적지</span>
                    <span className="value">{selectedSchedule.destination}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">여행 기간</span>
                    <span className="value">
                      {selectedSchedule.startDate} ~ {selectedSchedule.endDate}
                      <span className="sub-value">({getDuration(selectedSchedule.startDate, selectedSchedule.endDate)})</span>
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">동행 인원</span>
                    <span className="value">{selectedSchedule.companions}명</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">예산</span>
                    <span className="value">{formatPrice(selectedSchedule.budget)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">예상 총 비용</span>
                    <span className="value">{formatPrice(getTotalEstimatedCost(selectedSchedule.dailySchedule))}</span>
                  </div>
                </div>

                {/* 회원 정보 */}
                <div className="detail-section">
                  <h4><i className="bi bi-person"></i> 작성자 정보</h4>
                  <div className="detail-row">
                    <span className="label">회원명</span>
                    <span className="value">{selectedSchedule.memberName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">회원 ID</span>
                    <span className="value">{selectedSchedule.memberId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">이메일</span>
                    <span className="value">{selectedSchedule.memberEmail}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">연락처</span>
                    <span className="value">{selectedSchedule.memberPhone}</span>
                  </div>
                </div>

                {/* 통계 정보 */}
                <div className="detail-section">
                  <h4><i className="bi bi-bar-chart"></i> 통계</h4>
                  <div className="detail-row">
                    <span className="label">방문 장소</span>
                    <span className="value">{getPlacesCount(selectedSchedule.dailySchedule)}곳</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">조회수</span>
                    <span className="value">{selectedSchedule.views}회</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">공유수</span>
                    <span className="value">{selectedSchedule.shareCount}회</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">좋아요</span>
                    <span className="value">{selectedSchedule.likes}개</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">등록일</span>
                    <span className="value">{selectedSchedule.createdAt}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">최근 수정일</span>
                    <span className="value">{selectedSchedule.lastModified}</span>
                  </div>
                </div>

                {/* 여행기록 정보 (완료된 일정) */}
                {selectedSchedule.status === '완료' && (
                  <div className="detail-section">
                    <h4><i className="bi bi-journal-text"></i> 여행기록</h4>
                    <div className="detail-row">
                      <span className="label">작성 여부</span>
                      <span className="value">
                        {selectedSchedule.travelLogWritten ? (
                          <span className="travel-log-badge written">
                            <i className="bi bi-journal-check"></i> 작성완료
                          </span>
                        ) : (
                          <span className="travel-log-badge not-written">
                            <i className="bi bi-journal-x"></i> 미작성
                          </span>
                        )}
                      </span>
                    </div>
                    {selectedSchedule.travelLogWritten && selectedSchedule.travelLogId && (
                      <div className="detail-row">
                        <span className="label">여행기록 ID</span>
                        <span className="value">{selectedSchedule.travelLogId}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 취소 정보 */}
                {selectedSchedule.status === '취소' && (
                  <div className="detail-section">
                    <h4><i className="bi bi-x-circle"></i> 취소 정보</h4>
                    <div className="detail-row">
                      <span className="label">취소 사유</span>
                      <span className="value">{selectedSchedule.cancelReason || '-'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">취소일</span>
                      <span className="value">{selectedSchedule.cancelDate || '-'}</span>
                    </div>
                  </div>
                )}

                {/* 일별 상세 일정 */}
                <div className="detail-section full-width">
                  <h4><i className="bi bi-calendar-day"></i> 일별 상세 일정</h4>

                  {/* 날짜 탭 */}
                  <div className="day-tabs">
                    {selectedSchedule.dailySchedule?.map((day) => (
                      <button
                        key={day.day}
                        className={`day-tab ${selectedDay === day.day ? 'active' : ''}`}
                        onClick={() => setSelectedDay(day.day)}
                      >
                        Day {day.day}
                        <small>{day.date}</small>
                      </button>
                    ))}
                  </div>

                  {/* 선택된 날짜의 일정 */}
                  {selectedSchedule.dailySchedule?.find(d => d.day === selectedDay) && (
                    <div className="day-timeline">
                      {selectedSchedule.dailySchedule
                        .find(d => d.day === selectedDay)
                        .places.map((place, index) => (
                          <div key={index} className={`timeline-item ${getCategoryClass(place.category)}`}>
                            <div className="timeline-time">{place.time}</div>
                            <div className="timeline-marker">
                              <i className={`bi ${getCategoryIcon(place.category)}`}></i>
                            </div>
                            <div className="timeline-content">
                              <div className="timeline-header">
                                <span className={`category-badge ${getCategoryClass(place.category)}`}>
                                  {place.category}
                                </span>
                                <h5>{place.name}</h5>
                              </div>
                              <div className="timeline-details">
                                <span className="location">
                                  <i className="bi bi-geo-alt"></i> {place.location}
                                </span>
                                {place.rating && (
                                  <span className="rating">
                                    <i className="bi bi-star-fill"></i> {place.rating}
                                  </span>
                                )}
                                {place.estimatedCost > 0 && (
                                  <span className="cost">
                                    <i className="bi bi-wallet2"></i> {formatPrice(place.estimatedCost)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* 연결된 예약 */}
                {selectedSchedule.reservations?.length > 0 && (
                  <div className="detail-section full-width">
                    <h4><i className="bi bi-bookmark-check"></i> 연결된 예약</h4>
                    <div className="reservations-list">
                      {selectedSchedule.reservations.map((reservation, index) => (
                        <div key={index} className="reservation-item">
                          <span className={`badge badge-${reservation.type === '항공' ? 'info' : reservation.type === '숙박' ? 'success' : 'primary'}`}>
                            {reservation.type}
                          </span>
                          <span className="reservation-name">{reservation.name}</span>
                          <span className="reservation-date">{reservation.date}</span>
                          <span className={`reservation-status ${reservation.status === '확정' || reservation.status === '이용완료' ? 'confirmed' : ''}`}>
                            {reservation.status}
                          </span>
                          <span className="reservation-price">{formatPrice(reservation.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>닫기</button>
              <button className="btn btn-danger" onClick={() => { setIsDetailModalOpen(false); openDeleteModal(selectedSchedule); }}>삭제</button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && selectedSchedule && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>일정 삭제</h2>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="confirm-message">
                <i className="bi bi-exclamation-triangle text-warning"></i>
                <p>정말로 <strong>{selectedSchedule.title}</strong> 일정을 삭제하시겠습니까?</p>
                {selectedSchedule.reservations?.length > 0 && (
                  <p className="text-warning">
                    <i className="bi bi-exclamation-circle"></i>
                    이 일정에 연결된 {selectedSchedule.reservations.length}개의 예약이 있습니다.
                  </p>
                )}
                <p className="text-muted">이 작업은 되돌릴 수 없습니다.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>취소</button>
              <button className="btn btn-danger" onClick={deleteSchedule}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schedules;
