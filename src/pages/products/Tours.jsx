import { useState } from 'react';
import './Products.css';

// 카테고리 목록
const categories = [
  { value: 'tour', label: '투어' },
  { value: 'activity', label: '액티비티' },
  { value: 'ticket', label: '입장권/티켓' },
  { value: 'class', label: '클래스/체험' },
  { value: 'transfer', label: '교통/이동' }
];

// 지역 목록
const regions = [
  { group: '수도권', items: [{ value: 'seoul', label: '서울' }, { value: 'gyeonggi', label: '경기' }, { value: 'incheon', label: '인천' }] },
  { group: '강원권', items: [{ value: 'gangwon', label: '강원' }] },
  { group: '충청권', items: [{ value: 'daejeon', label: '대전' }, { value: 'sejong', label: '세종' }, { value: 'chungbuk', label: '충북' }, { value: 'chungnam', label: '충남' }] },
  { group: '전라권', items: [{ value: 'gwangju', label: '광주' }, { value: 'jeonbuk', label: '전북' }, { value: 'jeonnam', label: '전남' }] },
  { group: '경상권', items: [{ value: 'busan', label: '부산' }, { value: 'daegu', label: '대구' }, { value: 'ulsan', label: '울산' }, { value: 'gyeongbuk', label: '경북' }, { value: 'gyeongnam', label: '경남' }] },
  { group: '제주권', items: [{ value: 'jeju', label: '제주' }] }
];

// 소요시간 목록
const durations = [
  { value: '1', label: '1시간 이내' },
  { value: '3', label: '1~3시간' },
  { value: '6', label: '3~6시간' },
  { value: 'day', label: '하루 이상' }
];

// 샘플 데이터
const initialToursData = [
  {
    id: 1,
    name: '제주 스쿠버다이빙 체험',
    category: 'activity',
    region: 'jeju',
    duration: '3',
    location: '제주특별자치도 서귀포시 중문관광로 123',
    description: '제주 바다에서 스쿠버다이빙을 체험해보세요. 초보자도 안전하게 즐길 수 있습니다.',
    operatingHours: '09:00 ~ 18:00',
    durationText: '약 2시간 (실제 체험 40분)',
    ageLimit: '만 10세 이상',
    minPeople: 1,
    maxPeople: 8,
    bookingTimes: ['09:00', '11:00', '14:00', '16:00'],
    includes: '전문 강사 지도\n장비 대여\n수중 사진 촬영',
    excludes: '픽업/샌딩 서비스\n개인 물품',
    notice: '건강상 문제가 있는 분은 사전에 알려주세요.',
    originalPrice: 100000,
    salePrice: 80000,
    discountRate: 20,
    stock: 50,
    startDate: '2024-12-01',
    endDate: '2025-03-31',
    images: [
      { id: 1, url: 'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Scuba+Diving', isMain: true },
      { id: 2, url: 'https://via.placeholder.com/800x600/60a5fa/ffffff?text=Underwater', isMain: false }
    ],
    status: '판매중',
    createdAt: '2024-11-15',
    lastModified: '2024-12-01'
  },
  {
    id: 2,
    name: '경주 역사 문화 투어',
    category: 'tour',
    region: 'gyeongbuk',
    duration: '6',
    location: '경상북도 경주시 첨성로 140',
    description: '경주의 주요 역사 유적지를 전문 가이드와 함께 둘러보는 투어입니다.',
    operatingHours: '09:00 ~ 17:00',
    durationText: '약 5시간',
    ageLimit: '전 연령',
    minPeople: 2,
    maxPeople: 20,
    bookingTimes: ['09:00', '13:00'],
    includes: '전문 가이드\n입장료\n중식 제공',
    excludes: '개인 경비',
    notice: '편한 신발을 착용해주세요.',
    originalPrice: 50000,
    salePrice: 45000,
    discountRate: 10,
    stock: 100,
    startDate: '2024-12-01',
    endDate: '2025-06-30',
    images: [
      { id: 1, url: 'https://via.placeholder.com/800x600/f59e0b/ffffff?text=Gyeongju+Tour', isMain: true }
    ],
    status: '판매중',
    createdAt: '2024-11-20',
    lastModified: '2024-12-05'
  },
  {
    id: 3,
    name: '에버랜드 입장권',
    category: 'ticket',
    region: 'gyeonggi',
    duration: 'day',
    location: '경기도 용인시 처인구 포곡읍 에버랜드로 199',
    description: '에버랜드 1일 자유이용권입니다.',
    operatingHours: '10:00 ~ 22:00',
    durationText: '하루 종일',
    ageLimit: '전 연령',
    minPeople: 1,
    maxPeople: 99,
    bookingTimes: ['10:00'],
    includes: '1일 자유이용권\n로스트밸리 사파리 1회',
    excludes: '식사\n개인 사물함',
    notice: '시즌에 따라 운영시간이 변경될 수 있습니다.',
    originalPrice: 65000,
    salePrice: 52000,
    discountRate: 20,
    stock: 500,
    startDate: '2024-12-01',
    endDate: '2025-12-31',
    images: [
      { id: 1, url: 'https://via.placeholder.com/800x600/10b981/ffffff?text=Everland', isMain: true },
      { id: 2, url: 'https://via.placeholder.com/800x600/34d399/ffffff?text=Theme+Park', isMain: false }
    ],
    status: '판매중',
    createdAt: '2024-11-01',
    lastModified: '2024-11-30'
  },
  {
    id: 4,
    name: '부산 요리 클래스',
    category: 'class',
    region: 'busan',
    duration: '3',
    location: '부산광역시 해운대구 마린시티1로 20',
    description: '부산의 전통 음식을 직접 만들어보는 요리 클래스입니다.',
    operatingHours: '10:00 ~ 18:00',
    durationText: '약 2시간 30분',
    ageLimit: '만 12세 이상',
    minPeople: 2,
    maxPeople: 8,
    bookingTimes: ['10:00', '14:00'],
    includes: '모든 재료\n레시피북\n완성 요리 시식',
    excludes: '앞치마',
    notice: '알레르기가 있으신 분은 사전에 알려주세요.',
    originalPrice: 60000,
    salePrice: 55000,
    discountRate: 8,
    stock: 30,
    startDate: '2024-12-01',
    endDate: '2025-02-28',
    images: [
      { id: 1, url: 'https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Cooking+Class', isMain: true }
    ],
    status: '판매중',
    createdAt: '2024-11-25',
    lastModified: '2024-12-02'
  },
  {
    id: 5,
    name: '인천공항 ↔ 서울역 리무진',
    category: 'transfer',
    region: 'incheon',
    duration: '1',
    location: '인천광역시 중구 공항로 272',
    description: '인천공항에서 서울역까지 편하게 이동하세요.',
    operatingHours: '05:00 ~ 23:00',
    durationText: '약 1시간',
    ageLimit: '전 연령',
    minPeople: 1,
    maxPeople: 99,
    bookingTimes: ['05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
    includes: '편도 버스 탑승권',
    excludes: '수하물 추가 요금',
    notice: '출발 15분 전까지 탑승장에 도착해주세요.',
    originalPrice: 18000,
    salePrice: 15000,
    discountRate: 17,
    stock: 999,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    images: [
      { id: 1, url: 'https://via.placeholder.com/800x600/ec4899/ffffff?text=Airport+Limousine', isMain: true }
    ],
    status: '판매중',
    createdAt: '2024-01-01',
    lastModified: '2024-11-20'
  },
  {
    id: 6,
    name: '강원도 스키 렌탈 패키지',
    category: 'activity',
    region: 'gangwon',
    duration: 'day',
    location: '강원도 평창군 대관령면 올림픽로 715',
    description: '스키 장비 렌탈과 리프트권이 포함된 패키지입니다.',
    operatingHours: '08:30 ~ 17:00',
    durationText: '하루 종일',
    ageLimit: '만 7세 이상',
    minPeople: 1,
    maxPeople: 50,
    bookingTimes: ['08:30'],
    includes: '스키 장비 렌탈\n리프트권\n보험',
    excludes: '스키복 렌탈\n식사',
    notice: '초보자는 강습을 권장합니다.',
    originalPrice: 120000,
    salePrice: 99000,
    discountRate: 18,
    stock: 0,
    startDate: '2024-12-01',
    endDate: '2025-03-15',
    images: [],
    status: '매진',
    createdAt: '2024-11-01',
    lastModified: '2024-12-10'
  }
];

// 빈 폼 데이터
const emptyFormData = {
  id: null,
  name: '',
  category: 'tour',
  region: 'seoul',
  duration: '3',
  location: '',
  description: '',
  operatingHours: '',
  durationText: '',
  ageLimit: '',
  minPeople: 1,
  maxPeople: 10,
  bookingTimes: [],
  includes: '',
  excludes: '',
  notice: '',
  originalPrice: 0,
  salePrice: 0,
  discountRate: 0,
  stock: 0,
  startDate: '',
  endDate: '',
  images: [],
  status: '판매중',
  createdAt: new Date().toISOString().split('T')[0],
  lastModified: new Date().toISOString().split('T')[0]
};

function Tours() {
  const [toursData, setToursData] = useState(initialToursData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [selectedTour, setSelectedTour] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newBookingTime, setNewBookingTime] = useState('');

  // 통계 계산
  const stats = {
    total: toursData.length,
    active: toursData.filter(t => t.status === '판매중').length,
    soldout: toursData.filter(t => t.status === '매진').length,
    inactive: toursData.filter(t => t.status === '판매중지').length
  };

  // 필터링된 데이터
  const filteredData = toursData.filter(tour => {
    const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || tour.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || tour.category === filterCategory;
    const matchesRegion = filterRegion === 'all' || tour.region === filterRegion;
    return matchesSearch && matchesStatus && matchesCategory && matchesRegion;
  });

  // 금액 포맷
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // 카테고리 라벨 가져오기
  const getCategoryLabel = (categoryValue) => {
    const found = categories.find(c => c.value === categoryValue);
    return found ? found.label : categoryValue;
  };

  // 지역 라벨 가져오기
  const getRegionLabel = (regionValue) => {
    for (const group of regions) {
      const found = group.items.find(r => r.value === regionValue);
      if (found) return found.label;
    }
    return regionValue;
  };

  // 소요시간 라벨 가져오기
  const getDurationLabel = (durationValue) => {
    const found = durations.find(d => d.value === durationValue);
    return found ? found.label : durationValue;
  };

  // 상세 모달 열기
  const openDetailModal = (tour) => {
    setSelectedTour(tour);
    setIsDetailModalOpen(true);
  };

  // 수정 모달 열기
  const openEditModal = (tour) => {
    setSelectedTour(JSON.parse(JSON.stringify(tour)));
    setIsEditModalOpen(true);
  };

  // 추가 모달 열기
  const openAddModal = () => {
    setSelectedTour({ ...emptyFormData });
    setIsAddModalOpen(true);
  };

  // 삭제 모달 열기
  const openDeleteModal = (tour) => {
    setSelectedTour(tour);
    setIsDeleteModalOpen(true);
  };

  // 저장 (추가/수정)
  const saveTour = () => {
    if (selectedTour.id) {
      setToursData(prev => prev.map(t =>
        t.id === selectedTour.id
          ? { ...selectedTour, lastModified: new Date().toISOString().split('T')[0] }
          : t
      ));
    } else {
      const newId = Math.max(...toursData.map(t => t.id)) + 1;
      setToursData(prev => [...prev, { ...selectedTour, id: newId }]);
    }
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
  };

  // 삭제
  const deleteTour = () => {
    setToursData(prev => prev.filter(t => t.id !== selectedTour.id));
    setIsDeleteModalOpen(false);
  };

  // 상태 변경
  const toggleStatus = (tour) => {
    const statusOrder = ['판매중', '판매중지', '매진'];
    const currentIndex = statusOrder.indexOf(tour.status);
    const newStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    setToursData(prev => prev.map(t =>
      t.id === tour.id
        ? { ...t, status: newStatus, lastModified: new Date().toISOString().split('T')[0] }
        : t
    ));
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (field, value) => {
    setSelectedTour(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 예약 시간 추가
  const addBookingTime = () => {
    if (newBookingTime && !selectedTour.bookingTimes.includes(newBookingTime)) {
      setSelectedTour(prev => ({
        ...prev,
        bookingTimes: [...prev.bookingTimes, newBookingTime].sort()
      }));
      setNewBookingTime('');
    }
  };

  // 예약 시간 삭제
  const removeBookingTime = (time) => {
    setSelectedTour(prev => ({
      ...prev,
      bookingTimes: prev.bookingTimes.filter(t => t !== time)
    }));
  };

  // 프리셋 시간 추가
  const addPresetTimes = (preset) => {
    let times = [];
    if (preset === 'morning') {
      times = ['09:00', '10:00', '11:00'];
    } else if (preset === 'afternoon') {
      times = ['13:00', '14:00', '15:00', '16:00'];
    } else if (preset === 'hourly') {
      times = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    }
    const newTimes = [...new Set([...selectedTour.bookingTimes, ...times])].sort();
    setSelectedTour(prev => ({ ...prev, bookingTimes: newTimes }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = {
          id: Date.now() + Math.random(),
          url: reader.result,
          isMain: selectedTour.images.length === 0
        };
        setSelectedTour(prev => ({
          ...prev,
          images: [...prev.images, newImage]
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // 이미지 삭제
  const removeImage = (imageId) => {
    setSelectedTour(prev => {
      const newImages = prev.images.filter(img => img.id !== imageId);
      // 대표이미지가 삭제되면 첫번째 이미지를 대표이미지로 설정
      if (newImages.length > 0 && !newImages.some(img => img.isMain)) {
        newImages[0].isMain = true;
      }
      return { ...prev, images: newImages };
    });
  };

  // 대표이미지 설정
  const setMainImage = (imageId) => {
    setSelectedTour(prev => ({
      ...prev,
      images: prev.images.map(img => ({
        ...img,
        isMain: img.id === imageId
      }))
    }));
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>투어/체험/티켓 관리</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="bi bi-plus-lg"></i> 상품 등록
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-ticket-perforated"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">전체 상품</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="bi bi-check-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">판매중</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <i className="bi bi-x-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.soldout}</span>
            <span className="stat-label">매진</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <i className="bi bi-pause-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.inactive}</span>
            <span className="stat-label">판매중지</span>
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
              placeholder="상품명, 위치, 설명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">전체 상태</option>
              <option value="판매중">판매중</option>
              <option value="판매중지">판매중지</option>
              <option value="매진">매진</option>
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">전체 카테고리</option>
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
              <option value="all">전체 지역</option>
              {regions.map(group => (
                <optgroup key={group.group} label={group.group}>
                  {group.items.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 상품 목록 테이블 */}
      <div className="data-table-container" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>상품명</th>
              <th>카테고리</th>
              <th>지역</th>
              <th>판매가</th>
              <th>재고</th>
              <th>상태</th>
              <th style={{ width: '140px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(tour => (
              <tr key={tour.id}>
                <td>
                  <div className="product-name" onClick={() => openDetailModal(tour)}>
                    {tour.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {getDurationLabel(tour.duration)}
                  </div>
                </td>
                <td>
                  <span className="badge badge-info">{getCategoryLabel(tour.category)}</span>
                </td>
                <td>{getRegionLabel(tour.region)}</td>
                <td>
                  <div style={{ fontWeight: 500, color: '#2563eb' }}>{formatPrice(tour.salePrice)}</div>
                  {tour.discountRate > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#dc2626' }}>{tour.discountRate}% 할인</div>
                  )}
                </td>
                <td>
                  <span className={tour.stock === 0 ? 'text-danger' : ''}>
                    {tour.stock}개
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${tour.status === '판매중' ? 'active' : tour.status === '매진' ? 'soldout' : 'inactive'}`}>
                    {tour.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="상세보기" onClick={() => openDetailModal(tour)}>
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn-icon" title="수정" onClick={() => openEditModal(tour)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn-icon" title="상태변경" onClick={() => toggleStatus(tour)}>
                      <i className={`bi ${tour.status === '판매중' ? 'bi-pause' : 'bi-play'}`}></i>
                    </button>
                    <button className="btn-icon danger" title="삭제" onClick={() => openDeleteModal(tour)}>
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
            <i className="bi bi-ticket-perforated"></i>
            <p>조건에 맞는 상품 정보가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {isDetailModalOpen && selectedTour && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>상품 상세 정보</h2>
              <button className="modal-close" onClick={() => setIsDetailModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="detail-grid">
                {/* 기본 정보 */}
                <div className="detail-section">
                  <h3><i className="bi bi-info-circle"></i> 기본 정보</h3>
                  <div className="detail-row">
                    <span className="label">상품명</span>
                    <span className="value">{selectedTour.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">카테고리</span>
                    <span className="value">{getCategoryLabel(selectedTour.category)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">지역</span>
                    <span className="value">{getRegionLabel(selectedTour.region)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">소요시간</span>
                    <span className="value">{getDurationLabel(selectedTour.duration)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">위치 정보</span>
                    <span className="value">{selectedTour.location}</span>
                  </div>
                </div>

                {/* 가격 정보 */}
                <div className="detail-section">
                  <h3><i className="bi bi-currency-dollar"></i> 가격/재고 정보</h3>
                  <div className="detail-row">
                    <span className="label">정가</span>
                    <span className="value">{formatPrice(selectedTour.originalPrice)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">판매가</span>
                    <span className="value" style={{ color: '#2563eb', fontWeight: 600 }}>{formatPrice(selectedTour.salePrice)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">할인율</span>
                    <span className="value">{selectedTour.discountRate}%</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">재고</span>
                    <span className="value">{selectedTour.stock}개</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">판매 기간</span>
                    <span className="value">{selectedTour.startDate} ~ {selectedTour.endDate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">상태</span>
                    <span className={`status-badge ${selectedTour.status === '판매중' ? 'active' : selectedTour.status === '매진' ? 'soldout' : 'inactive'}`}>
                      {selectedTour.status}
                    </span>
                  </div>
                </div>

                {/* 이미지 */}
                {selectedTour.images && selectedTour.images.length > 0 && (
                  <div className="detail-section full-width">
                    <h3><i className="bi bi-images"></i> 상품 이미지</h3>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                      {selectedTour.images.map((image, idx) => (
                        <div key={image.id || idx} style={{ position: 'relative' }}>
                          <img
                            src={image.url}
                            alt={`상품 이미지 ${idx + 1}`}
                            style={{
                              width: '150px',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: image.isMain ? '3px solid #2563eb' : '1px solid #e5e7eb'
                            }}
                          />
                          {image.isMain && (
                            <span style={{
                              position: 'absolute',
                              top: '4px',
                              left: '4px',
                              background: '#2563eb',
                              color: 'white',
                              fontSize: '0.625rem',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}>대표</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 상품 설명 */}
                <div className="detail-section full-width">
                  <h3><i className="bi bi-card-text"></i> 상품 설명</h3>
                  <p style={{ margin: '8px 0 0 0', color: '#374151', lineHeight: 1.6 }}>{selectedTour.description}</p>
                </div>

                {/* 이용 안내 */}
                <div className="detail-section full-width">
                  <h3><i className="bi bi-clock"></i> 이용 안내</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>운영 시간</div>
                      <div>{selectedTour.operatingHours || '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>소요 시간</div>
                      <div>{selectedTour.durationText || '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>연령 제한</div>
                      <div>{selectedTour.ageLimit || '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>최소/최대 인원</div>
                      <div>{selectedTour.minPeople}명 ~ {selectedTour.maxPeople}명</div>
                    </div>
                  </div>
                </div>

                {/* 예약 가능 시간 */}
                <div className="detail-section full-width">
                  <h3><i className="bi bi-calendar-check"></i> 예약 가능 시간</h3>
                  <div className="amenities-list" style={{ marginTop: '8px' }}>
                    {selectedTour.bookingTimes.map((time, idx) => (
                      <span key={idx} className="amenity-tag">{time}</span>
                    ))}
                    {selectedTour.bookingTimes.length === 0 && (
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>등록된 시간 없음</span>
                    )}
                  </div>
                </div>

                {/* 포함/불포함 사항 */}
                <div className="detail-section">
                  <h3><i className="bi bi-check-circle"></i> 포함 사항</h3>
                  <pre style={{ margin: '8px 0 0 0', fontFamily: 'inherit', whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedTour.includes || '-'}</pre>
                </div>
                <div className="detail-section">
                  <h3><i className="bi bi-x-circle"></i> 불포함 사항</h3>
                  <pre style={{ margin: '8px 0 0 0', fontFamily: 'inherit', whiteSpace: 'pre-wrap', color: '#374151' }}>{selectedTour.excludes || '-'}</pre>
                </div>

                {/* 유의 사항 */}
                {selectedTour.notice && (
                  <div className="detail-section full-width">
                    <h3><i className="bi bi-exclamation-triangle"></i> 유의 사항</h3>
                    <p style={{ margin: '8px 0 0 0', color: '#374151', lineHeight: 1.6 }}>{selectedTour.notice}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>닫기</button>
              <button className="btn btn-primary" onClick={() => { setIsDetailModalOpen(false); openEditModal(selectedTour); }}>수정</button>
            </div>
          </div>
        </div>
      )}

      {/* 수정/추가 모달 */}
      {(isEditModalOpen || isAddModalOpen) && selectedTour && (
        <div className="modal-overlay" onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}>
          <div className="modal-content large" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2>{isAddModalOpen ? '상품 등록' : '상품 수정'}</h2>
              <button className="modal-close" onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              {/* 기본 정보 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                  <i className="bi bi-info-circle" style={{ marginRight: '8px' }}></i>기본 정보
                </h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>카테고리 *</label>
                    <select value={selectedTour.category} onChange={(e) => handleInputChange('category', e.target.value)}>
                      {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>지역 *</label>
                    <select value={selectedTour.region} onChange={(e) => handleInputChange('region', e.target.value)}>
                      {regions.map(group => (
                        <optgroup key={group.group} label={group.group}>
                          {group.items.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>소요시간 *</label>
                    <select value={selectedTour.duration} onChange={(e) => handleInputChange('duration', e.target.value)}>
                      {durations.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>상품명 *</label>
                    <input type="text" value={selectedTour.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="상품명을 입력하세요" />
                  </div>
                  <div className="form-group full-width">
                    <label>위치 정보 *</label>
                    <input type="text" value={selectedTour.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="위치 정보를 입력하세요" />
                  </div>
                  <div className="form-group full-width">
                    <label>상품 설명 *</label>
                    <textarea
                      value={selectedTour.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="상품에 대한 상세 설명을 입력하세요"
                      rows={3}
                      style={{ resize: 'vertical', minHeight: '80px' }}
                    />
                  </div>
                </div>
              </div>

              {/* 이미지 관리 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                  <i className="bi bi-images" style={{ marginRight: '8px' }}></i>이미지 관리
                </h4>

                {/* 이미지 업로드 */}
                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="tour-image-upload" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#f3f4f6', border: '2px dashed #d1d5db', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <i className="bi bi-cloud-upload"></i>
                    <span>이미지 업로드</span>
                  </label>
                  <input
                    id="tour-image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <span style={{ marginLeft: '12px', fontSize: '0.75rem', color: '#6b7280' }}>
                    * 여러 이미지를 한번에 선택할 수 있습니다. 첫번째 이미지가 대표이미지로 설정됩니다.
                  </span>
                </div>

                {/* 이미지 미리보기 */}
                {selectedTour.images && selectedTour.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {selectedTour.images.map((image, idx) => (
                      <div key={image.id || idx} style={{ position: 'relative' }}>
                        <img
                          src={image.url}
                          alt={`이미지 ${idx + 1}`}
                          style={{
                            width: '120px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: image.isMain ? '3px solid #2563eb' : '1px solid #e5e7eb'
                          }}
                        />
                        {image.isMain && (
                          <span style={{
                            position: 'absolute',
                            top: '4px',
                            left: '4px',
                            background: '#2563eb',
                            color: 'white',
                            fontSize: '0.625rem',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>대표</span>
                        )}
                        <div style={{
                          position: 'absolute',
                          bottom: '4px',
                          right: '4px',
                          display: 'flex',
                          gap: '4px'
                        }}>
                          {!image.isMain && (
                            <button
                              type="button"
                              onClick={() => setMainImage(image.id)}
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '4px',
                                border: 'none',
                                background: 'rgba(37, 99, 235, 0.9)',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem'
                              }}
                              title="대표이미지로 설정"
                            >
                              <i className="bi bi-star"></i>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              border: 'none',
                              background: 'rgba(220, 38, 38, 0.9)',
                              color: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem'
                            }}
                            title="삭제"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(!selectedTour.images || selectedTour.images.length === 0) && (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', background: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb' }}>
                    <i className="bi bi-image" style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}></i>
                    <span>등록된 이미지가 없습니다.</span>
                  </div>
                )}
              </div>

              {/* 이용 안내 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                  <i className="bi bi-clock" style={{ marginRight: '8px' }}></i>이용 안내
                </h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>운영 시간 *</label>
                    <input type="text" value={selectedTour.operatingHours} onChange={(e) => handleInputChange('operatingHours', e.target.value)} placeholder="예: 09:00 ~ 18:00" />
                  </div>
                  <div className="form-group">
                    <label>소요 시간 (텍스트) *</label>
                    <input type="text" value={selectedTour.durationText} onChange={(e) => handleInputChange('durationText', e.target.value)} placeholder="예: 약 2시간 (실제 체험 40분)" />
                  </div>
                  <div className="form-group">
                    <label>연령 제한</label>
                    <input type="text" value={selectedTour.ageLimit} onChange={(e) => handleInputChange('ageLimit', e.target.value)} placeholder="예: 만 10세 이상" />
                  </div>
                  <div className="form-group">
                    <label>최소 인원</label>
                    <input type="number" value={selectedTour.minPeople} onChange={(e) => handleInputChange('minPeople', parseInt(e.target.value) || 1)} min="1" />
                  </div>
                  <div className="form-group">
                    <label>최대 인원</label>
                    <input type="number" value={selectedTour.maxPeople} onChange={(e) => handleInputChange('maxPeople', parseInt(e.target.value) || 1)} min="1" />
                  </div>
                </div>

                {/* 예약 가능 시간 */}
                <div style={{ marginTop: '16px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: '8px' }}>예약 가능 시간</label>
                  <div className="amenities-list" style={{ marginBottom: '8px' }}>
                    {selectedTour.bookingTimes.map((time, idx) => (
                      <span key={idx} className="amenity-tag" style={{ cursor: 'pointer' }} onClick={() => removeBookingTime(time)}>
                        {time} <i className="bi bi-x" style={{ marginLeft: '4px' }}></i>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input type="time" value={newBookingTime} onChange={(e) => setNewBookingTime(e.target.value)} style={{ width: '140px' }} />
                    <button type="button" className="btn btn-outline btn-sm" onClick={addBookingTime}>시간 추가</button>
                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>빠른 추가:</span>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => addPresetTimes('morning')}>오전</button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => addPresetTimes('afternoon')}>오후</button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => addPresetTimes('hourly')}>1시간 단위</button>
                  </div>
                </div>

                <div className="form-grid" style={{ marginTop: '16px' }}>
                  <div className="form-group">
                    <label>포함 사항</label>
                    <textarea
                      value={selectedTour.includes}
                      onChange={(e) => handleInputChange('includes', e.target.value)}
                      placeholder="포함 항목을 줄바꿈으로 구분"
                      rows={3}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <div className="form-group">
                    <label>불포함 사항</label>
                    <textarea
                      value={selectedTour.excludes}
                      onChange={(e) => handleInputChange('excludes', e.target.value)}
                      placeholder="불포함 항목을 줄바꿈으로 구분"
                      rows={3}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>유의 사항</label>
                    <textarea
                      value={selectedTour.notice}
                      onChange={(e) => handleInputChange('notice', e.target.value)}
                      placeholder="예약 및 이용 시 유의해야 할 사항"
                      rows={2}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>

              {/* 가격 및 재고 정보 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                  <i className="bi bi-currency-dollar" style={{ marginRight: '8px' }}></i>가격 및 재고 정보
                </h4>
                <div className="form-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                  <div className="form-group">
                    <label>정가 (원)</label>
                    <input type="number" value={selectedTour.originalPrice} onChange={(e) => handleInputChange('originalPrice', parseInt(e.target.value) || 0)} min="0" step="1000" />
                  </div>
                  <div className="form-group">
                    <label>판매가 (원) *</label>
                    <input type="number" value={selectedTour.salePrice} onChange={(e) => handleInputChange('salePrice', parseInt(e.target.value) || 0)} min="0" step="1000" />
                  </div>
                  <div className="form-group">
                    <label>할인율 (%)</label>
                    <input type="number" value={selectedTour.discountRate} onChange={(e) => handleInputChange('discountRate', parseInt(e.target.value) || 0)} min="0" max="100" />
                  </div>
                  <div className="form-group">
                    <label>재고 수량 *</label>
                    <input type="number" value={selectedTour.stock} onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)} min="0" />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>판매 시작일 *</label>
                    <input type="date" value={selectedTour.startDate} onChange={(e) => handleInputChange('startDate', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>판매 종료일 *</label>
                    <input type="date" value={selectedTour.endDate} onChange={(e) => handleInputChange('endDate', e.target.value)} />
                  </div>
                  {isEditModalOpen && (
                    <div className="form-group">
                      <label>상태</label>
                      <select value={selectedTour.status} onChange={(e) => handleInputChange('status', e.target.value)}>
                        <option value="판매중">판매중</option>
                        <option value="판매중지">판매중지</option>
                        <option value="매진">매진</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}>취소</button>
              <button className="btn btn-primary" onClick={saveTour}>
                {isAddModalOpen ? '등록' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && selectedTour && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>상품 삭제</h2>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="confirm-message">
                <i className="bi bi-exclamation-triangle text-warning"></i>
                <p>정말로 <strong>{selectedTour.name}</strong>을(를) 삭제하시겠습니까?</p>
                <p className="text-muted">이 작업은 되돌릴 수 없습니다.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>취소</button>
              <button className="btn btn-danger" onClick={deleteTour}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tours;
