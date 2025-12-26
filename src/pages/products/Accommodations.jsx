import { useState } from 'react';
import './Products.css';

// 숙소 유형 목록
const accommodationTypes = [
  { value: 'hotel', label: '호텔' },
  { value: 'resort', label: '리조트' },
  { value: 'pension', label: '펜션' },
  { value: 'motel', label: '모텔' },
  { value: 'guesthouse', label: '게스트하우스' },
  { value: 'hanok', label: '한옥' },
  { value: 'condo', label: '콘도' },
  { value: 'camping', label: '캠핑/글램핑' }
];

// 성급 목록
const starRatings = [
  { value: 5, label: '5성급' },
  { value: 4, label: '4성급' },
  { value: 3, label: '3성급' },
  { value: 2, label: '2성급' },
  { value: 1, label: '1성급' },
  { value: 0, label: '무등급' }
];

// 지역 목록
const regions = ['서울', '부산', '제주', '강원', '경기', '인천', '대구', '대전', '광주', '울산', '경북', '경남', '전북', '전남', '충북', '충남'];

// 침대 타입
const bedTypes = ['싱글', '더블', '퀸', '킹', '온돌'];

// 객실 특징
const roomFeatures = [
  { value: 'free_cancel', label: '무료 취소', icon: 'bi-check-circle' },
  { value: 'ocean_view', label: '오션뷰', icon: 'bi-water' },
  { value: 'mountain_view', label: '마운틴뷰', icon: 'bi-mountain' },
  { value: 'city_view', label: '시티뷰', icon: 'bi-buildings' },
  { value: 'living_room', label: '거실 포함', icon: 'bi-door-open' },
  { value: 'balcony', label: '발코니/테라스', icon: 'bi-flower1' },
  { value: 'no_smoking', label: '금연', icon: 'bi-slash-circle' },
  { value: 'kitchen', label: '주방/취사', icon: 'bi-cup-hot' }
];

// 숙소 편의시설
const facilityAmenities = [
  { value: 'wifi', label: '무료 WiFi', icon: 'bi-wifi' },
  { value: 'parking', label: '주차장', icon: 'bi-p-circle' },
  { value: 'breakfast', label: '조식', icon: 'bi-cup-hot' },
  { value: 'pool', label: '수영장', icon: 'bi-water' },
  { value: 'fitness', label: '피트니스', icon: 'bi-heart-pulse' },
  { value: 'spa', label: '스파/사우나', icon: 'bi-droplet' },
  { value: 'restaurant', label: '레스토랑', icon: 'bi-shop' },
  { value: 'bar', label: '바/라운지', icon: 'bi-cup-straw' },
  { value: 'roomService', label: '룸서비스', icon: 'bi-bell' },
  { value: 'laundry', label: '세탁 서비스', icon: 'bi-basket' },
  { value: 'smoking', label: '흡연구역', icon: 'bi-cloud' },
  { value: 'petFriendly', label: '반려동물 동반', icon: 'bi-emoji-heart-eyes' }
];

// 객실 내 시설
const roomAmenities = [
  { value: 'aircon', label: '에어컨', icon: 'bi-snow' },
  { value: 'tv', label: 'TV', icon: 'bi-tv' },
  { value: 'minibar', label: '미니바', icon: 'bi-box' },
  { value: 'refrigerator', label: '냉장고', icon: 'bi-box-seam' },
  { value: 'safe', label: '금고', icon: 'bi-safe' },
  { value: 'hairdryer', label: '헤어드라이어', icon: 'bi-wind' },
  { value: 'bathtub', label: '욕조', icon: 'bi-droplet-half' },
  { value: 'toiletries', label: '세면도구', icon: 'bi-box2' }
];

// 샘플 숙박 데이터
const initialAccommodationsData = [
  {
    id: 1,
    name: '제주 오션뷰 호텔',
    description: '제주 바다가 한눈에 보이는 프리미엄 호텔입니다. 최고급 시설과 서비스로 편안한 휴식을 제공합니다.',
    type: 'hotel',
    starRating: 5,
    region: '제주',
    location: '제주특별자치도 제주시 해안로 123',
    totalRooms: 50,
    checkIn: '15:00',
    checkOut: '11:00',
    images: [
      { id: 1, url: 'https://via.placeholder.com/800x600/3b82f6/ffffff?text=Hotel+Main', isMain: true },
      { id: 2, url: 'https://via.placeholder.com/800x600/60a5fa/ffffff?text=Room+View', isMain: false },
      { id: 3, url: 'https://via.placeholder.com/800x600/93c5fd/ffffff?text=Pool', isMain: false }
    ],
    rooms: [
      {
        id: 1,
        name: '스탠다드 더블',
        capacity: 2,
        maxCapacity: 3,
        price: 150000,
        discount: 10,
        stock: 20,
        size: 28,
        breakfast: 'included',
        bedTypes: ['더블'],
        features: ['ocean_view', 'no_smoking']
      },
      {
        id: 2,
        name: '디럭스 트윈',
        capacity: 2,
        maxCapacity: 4,
        price: 200000,
        discount: 0,
        stock: 15,
        size: 35,
        breakfast: 'none',
        bedTypes: ['싱글', '싱글'],
        features: ['ocean_view', 'balcony', 'no_smoking']
      }
    ],
    facilityAmenities: ['wifi', 'parking', 'pool', 'fitness', 'spa', 'restaurant'],
    roomAmenities: ['aircon', 'tv', 'minibar', 'refrigerator', 'safe', 'hairdryer', 'bathtub', 'toiletries'],
    addons: [
      { name: '조식 뷔페', person: 1, price: 25000 },
      { name: '스파 이용권', person: 1, price: 50000 }
    ],
    status: '운영중',
    createdAt: '2024-01-15',
    lastModified: '2024-03-10'
  },
  {
    id: 2,
    name: '부산 해운대 리조트',
    description: '해운대 해변 바로 앞에 위치한 가족 친화적인 리조트입니다. 다양한 부대시설을 갖추고 있습니다.',
    type: 'resort',
    starRating: 4,
    region: '부산',
    location: '부산광역시 해운대구 해운대해변로 456',
    totalRooms: 120,
    checkIn: '15:00',
    checkOut: '11:00',
    images: [
      { id: 1, url: 'https://via.placeholder.com/800x600/f59e0b/ffffff?text=Resort+Main', isMain: true },
      { id: 2, url: 'https://via.placeholder.com/800x600/fbbf24/ffffff?text=Beach+View', isMain: false }
    ],
    rooms: [
      {
        id: 1,
        name: '패밀리 스위트',
        capacity: 4,
        maxCapacity: 6,
        price: 350000,
        discount: 15,
        stock: 10,
        size: 55,
        breakfast: 'included',
        bedTypes: ['킹', '싱글'],
        features: ['ocean_view', 'living_room', 'balcony']
      }
    ],
    facilityAmenities: ['wifi', 'parking', 'pool', 'fitness', 'restaurant', 'bar', 'roomService'],
    roomAmenities: ['aircon', 'tv', 'minibar', 'refrigerator', 'safe', 'hairdryer'],
    addons: [],
    status: '운영중',
    createdAt: '2024-01-20',
    lastModified: '2024-03-08'
  },
  {
    id: 3,
    name: '강릉 펜션 힐링하우스',
    description: '경포대 인근의 조용한 펜션입니다. 자연 속에서 힐링하기 좋은 공간입니다.',
    type: 'pension',
    starRating: 0,
    region: '강원',
    location: '강원도 강릉시 경포로 789',
    totalRooms: 8,
    checkIn: '15:00',
    checkOut: '11:00',
    images: [
      { id: 1, url: 'https://via.placeholder.com/800x600/10b981/ffffff?text=Pension+Main', isMain: true }
    ],
    rooms: [
      {
        id: 1,
        name: '온돌방',
        capacity: 2,
        maxCapacity: 4,
        price: 120000,
        discount: 0,
        stock: 4,
        size: 20,
        breakfast: 'none',
        bedTypes: ['온돌'],
        features: ['mountain_view', 'kitchen']
      },
      {
        id: 2,
        name: '침대방',
        capacity: 2,
        maxCapacity: 3,
        price: 150000,
        discount: 0,
        stock: 4,
        size: 25,
        breakfast: 'none',
        bedTypes: ['퀸'],
        features: ['mountain_view', 'balcony']
      }
    ],
    facilityAmenities: ['wifi', 'parking'],
    roomAmenities: ['aircon', 'tv', 'refrigerator'],
    addons: [
      { name: '바베큐 세트', person: 4, price: 50000 }
    ],
    status: '운영중',
    createdAt: '2024-02-01',
    lastModified: '2024-03-05'
  },
  {
    id: 4,
    name: '경주 한옥스테이',
    description: '전통 한옥에서 특별한 하룻밤을 경험해보세요. 경주 역사 유적지와 가깝습니다.',
    type: 'hanok',
    starRating: 0,
    region: '경북',
    location: '경상북도 경주시 황남동 123',
    totalRooms: 6,
    checkIn: '15:00',
    checkOut: '11:00',
    images: [
      { id: 1, url: 'https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Hanok+Main', isMain: true },
      { id: 2, url: 'https://via.placeholder.com/800x600/a78bfa/ffffff?text=Hanok+Room', isMain: false }
    ],
    rooms: [
      {
        id: 1,
        name: '사랑채',
        capacity: 2,
        maxCapacity: 3,
        price: 180000,
        discount: 0,
        stock: 3,
        size: 18,
        breakfast: 'included',
        bedTypes: ['온돌'],
        features: ['no_smoking']
      }
    ],
    facilityAmenities: ['wifi', 'parking', 'breakfast'],
    roomAmenities: ['aircon', 'tv'],
    addons: [
      { name: '전통체험', person: 1, price: 30000 }
    ],
    status: '운영중',
    createdAt: '2024-01-25',
    lastModified: '2024-03-09'
  },
  {
    id: 5,
    name: '여수 게스트하우스',
    description: '여수 밤바다를 즐길 수 있는 아담한 게스트하우스입니다. 배낭여행객에게 추천합니다.',
    type: 'guesthouse',
    starRating: 0,
    region: '전남',
    location: '전라남도 여수시 오동도로 55',
    totalRooms: 12,
    checkIn: '16:00',
    checkOut: '10:00',
    images: [],
    rooms: [
      {
        id: 1,
        name: '도미토리 (4인실)',
        capacity: 1,
        maxCapacity: 1,
        price: 25000,
        discount: 0,
        stock: 8,
        size: 0,
        breakfast: 'none',
        bedTypes: ['싱글'],
        features: []
      }
    ],
    facilityAmenities: ['wifi'],
    roomAmenities: ['aircon'],
    addons: [],
    status: '운영중단',
    createdAt: '2024-02-15',
    lastModified: '2024-03-01'
  }
];

// 빈 객실 템플릿
const emptyRoom = {
  id: Date.now(),
  name: '',
  capacity: 2,
  maxCapacity: 4,
  price: 0,
  discount: 0,
  stock: 0,
  size: 0,
  breakfast: 'none',
  bedTypes: [],
  features: []
};

// 빈 추가옵션 템플릿
const emptyAddon = {
  name: '',
  person: 0,
  price: 0
};

function Accommodations() {
  const [accommodationsData, setAccommodationsData] = useState(initialAccommodationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 통계 계산
  const stats = {
    total: accommodationsData.length,
    operating: accommodationsData.filter(a => a.status === '운영중').length,
    stopped: accommodationsData.filter(a => a.status === '운영중단').length,
    totalRooms: accommodationsData.reduce((sum, a) => sum + a.totalRooms, 0)
  };

  // 필터링된 데이터
  const filteredData = accommodationsData.filter(accommodation => {
    const matchesSearch = accommodation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accommodation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (accommodation.description && accommodation.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || accommodation.status === filterStatus;
    const matchesType = filterType === 'all' || accommodation.type === filterType;
    const matchesRegion = filterRegion === 'all' || accommodation.region === filterRegion;
    return matchesSearch && matchesStatus && matchesType && matchesRegion;
  });

  // 금액 포맷
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // 최저가 계산
  const getLowestPrice = (accommodation) => {
    if (!accommodation.rooms || accommodation.rooms.length === 0) return 0;
    const prices = accommodation.rooms.map(r => r.price * (1 - r.discount / 100));
    return Math.min(...prices);
  };

  // 숙소 유형 라벨 가져오기
  const getTypeLabel = (type) => {
    const found = accommodationTypes.find(t => t.value === type);
    return found ? found.label : type;
  };

  // 상세 모달 열기
  const openDetailModal = (accommodation) => {
    setSelectedAccommodation(accommodation);
    setIsDetailModalOpen(true);
  };

  // 수정 모달 열기
  const openEditModal = (accommodation) => {
    setSelectedAccommodation(JSON.parse(JSON.stringify(accommodation)));
    setIsEditModalOpen(true);
  };

  // 추가 모달 열기
  const openAddModal = () => {
    setSelectedAccommodation({
      id: null,
      name: '',
      description: '',
      type: 'hotel',
      starRating: 0,
      region: '서울',
      location: '',
      totalRooms: 0,
      checkIn: '15:00',
      checkOut: '11:00',
      images: [],
      rooms: [{ ...emptyRoom, id: Date.now() }],
      facilityAmenities: [],
      roomAmenities: [],
      addons: [],
      status: '운영중',
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    });
    setIsAddModalOpen(true);
  };

  // 삭제 모달 열기
  const openDeleteModal = (accommodation) => {
    setSelectedAccommodation(accommodation);
    setIsDeleteModalOpen(true);
  };

  // 숙박 저장 (추가/수정)
  const saveAccommodation = () => {
    if (selectedAccommodation.id) {
      setAccommodationsData(prev => prev.map(a =>
        a.id === selectedAccommodation.id
          ? { ...selectedAccommodation, lastModified: new Date().toISOString().split('T')[0] }
          : a
      ));
    } else {
      const newId = Math.max(...accommodationsData.map(a => a.id)) + 1;
      setAccommodationsData(prev => [...prev, { ...selectedAccommodation, id: newId }]);
    }
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
  };

  // 숙박 삭제
  const deleteAccommodation = () => {
    setAccommodationsData(prev => prev.filter(a => a.id !== selectedAccommodation.id));
    setIsDeleteModalOpen(false);
  };

  // 상태 변경
  const toggleStatus = (accommodation) => {
    const newStatus = accommodation.status === '운영중' ? '운영중단' : '운영중';
    setAccommodationsData(prev => prev.map(a =>
      a.id === accommodation.id
        ? { ...a, status: newStatus, lastModified: new Date().toISOString().split('T')[0] }
        : a
    ));
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (field, value) => {
    setSelectedAccommodation(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 객실 추가
  const addRoom = () => {
    setSelectedAccommodation(prev => ({
      ...prev,
      rooms: [...prev.rooms, { ...emptyRoom, id: Date.now() }]
    }));
  };

  // 객실 삭제
  const removeRoom = (index) => {
    setSelectedAccommodation(prev => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index)
    }));
  };

  // 객실 정보 변경
  const handleRoomChange = (index, field, value) => {
    setSelectedAccommodation(prev => ({
      ...prev,
      rooms: prev.rooms.map((room, i) =>
        i === index ? { ...room, [field]: value } : room
      )
    }));
  };

  // 객실 침대타입 토글
  const toggleRoomBedType = (index, bedType) => {
    setSelectedAccommodation(prev => ({
      ...prev,
      rooms: prev.rooms.map((room, i) => {
        if (i !== index) return room;
        const bedTypes = room.bedTypes.includes(bedType)
          ? room.bedTypes.filter(t => t !== bedType)
          : [...room.bedTypes, bedType];
        return { ...room, bedTypes };
      })
    }));
  };

  // 객실 특징 토글
  const toggleRoomFeature = (index, feature) => {
    setSelectedAccommodation(prev => ({
      ...prev,
      rooms: prev.rooms.map((room, i) => {
        if (i !== index) return room;
        const features = room.features.includes(feature)
          ? room.features.filter(f => f !== feature)
          : [...room.features, feature];
        return { ...room, features };
      })
    }));
  };

  // 편의시설 토글
  const toggleFacilityAmenity = (amenity) => {
    setSelectedAccommodation(prev => ({
      ...prev,
      facilityAmenities: prev.facilityAmenities.includes(amenity)
        ? prev.facilityAmenities.filter(a => a !== amenity)
        : [...prev.facilityAmenities, amenity]
    }));
  };

  // 객실 내 시설 토글
  const toggleRoomAmenity = (amenity) => {
    setSelectedAccommodation(prev => ({
      ...prev,
      roomAmenities: prev.roomAmenities.includes(amenity)
        ? prev.roomAmenities.filter(a => a !== amenity)
        : [...prev.roomAmenities, amenity]
    }));
  };

  // 추가옵션 추가
  const addAddon = () => {
    setSelectedAccommodation(prev => ({
      ...prev,
      addons: [...prev.addons, { ...emptyAddon }]
    }));
  };

  // 추가옵션 삭제
  const removeAddon = (index) => {
    setSelectedAccommodation(prev => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index)
    }));
  };

  // 추가옵션 변경
  const handleAddonChange = (index, field, value) => {
    setSelectedAccommodation(prev => ({
      ...prev,
      addons: prev.addons.map((addon, i) =>
        i === index ? { ...addon, [field]: value } : addon
      )
    }));
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
          isMain: selectedAccommodation.images.length === 0
        };
        setSelectedAccommodation(prev => ({
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
    setSelectedAccommodation(prev => {
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
    setSelectedAccommodation(prev => ({
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
        <h1>숙박 관리</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="bi bi-plus-lg"></i> 숙박 등록
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-building"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">전체 숙박</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="bi bi-check-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.operating}</span>
            <span className="stat-label">운영중</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <i className="bi bi-pause-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.stopped}</span>
            <span className="stat-label">운영중단</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="bi bi-door-open"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalRooms}</span>
            <span className="stat-label">총 객실수</span>
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
              placeholder="상품명, 위치 정보, 상품 설명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">전체 상태</option>
              <option value="운영중">운영중</option>
              <option value="운영중단">운영중단</option>
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">전체 유형</option>
              {accommodationTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
              <option value="all">전체 지역</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 숙박 목록 테이블 */}
      <div className="data-table-container" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>상품명</th>
              <th>유형</th>
              <th>지역</th>
              <th>객실수</th>
              <th>최저가</th>
              <th>상태</th>
              <th style={{ width: '140px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(accommodation => (
              <tr key={accommodation.id}>
                <td>
                  <div className="product-name" onClick={() => openDetailModal(accommodation)}>
                    {accommodation.name}
                  </div>
                  {accommodation.starRating > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#d97706' }}>
                      {'★'.repeat(accommodation.starRating)}
                    </div>
                  )}
                </td>
                <td>
                  <span className="badge badge-info">{getTypeLabel(accommodation.type)}</span>
                </td>
                <td>{accommodation.region}</td>
                <td>{accommodation.totalRooms}개</td>
                <td style={{ fontWeight: 500, color: '#2563eb' }}>{formatPrice(getLowestPrice(accommodation))}</td>
                <td>
                  <span className={`status-badge ${accommodation.status === '운영중' ? 'active' : 'inactive'}`}>
                    {accommodation.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="상세보기" onClick={() => openDetailModal(accommodation)}>
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn-icon" title="수정" onClick={() => openEditModal(accommodation)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn-icon" title="상태변경" onClick={() => toggleStatus(accommodation)}>
                      <i className={`bi ${accommodation.status === '운영중' ? 'bi-pause' : 'bi-play'}`}></i>
                    </button>
                    <button className="btn-icon danger" title="삭제" onClick={() => openDeleteModal(accommodation)}>
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
            <i className="bi bi-building"></i>
            <p>조건에 맞는 숙박 정보가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {isDetailModalOpen && selectedAccommodation && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>숙박 상세 정보</h2>
              <button className="modal-close" onClick={() => setIsDetailModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                {/* 숙소 정보 */}
                <div className="detail-section">
                  <h3><i className="bi bi-building"></i> 숙소 정보</h3>
                  <div className="detail-row">
                    <span className="label">상품명</span>
                    <span className="value">{selectedAccommodation.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">유형</span>
                    <span className="value">{getTypeLabel(selectedAccommodation.type)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">등급</span>
                    <span className="value">
                      {selectedAccommodation.starRating > 0
                        ? `${selectedAccommodation.starRating}성급`
                        : '무등급'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">지역</span>
                    <span className="value">{selectedAccommodation.region}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">위치 정보</span>
                    <span className="value">{selectedAccommodation.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">총 객실 수</span>
                    <span className="value">{selectedAccommodation.totalRooms}개</span>
                  </div>
                </div>

                {/* 운영 정보 */}
                <div className="detail-section">
                  <h3><i className="bi bi-clock"></i> 운영 정보</h3>
                  <div className="detail-row">
                    <span className="label">체크인</span>
                    <span className="value">{selectedAccommodation.checkIn}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">체크아웃</span>
                    <span className="value">{selectedAccommodation.checkOut}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">등록일</span>
                    <span className="value">{selectedAccommodation.createdAt}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">상태</span>
                    <span className={`status-badge ${selectedAccommodation.status === '운영중' ? 'active' : 'inactive'}`}>
                      {selectedAccommodation.status}
                    </span>
                  </div>
                </div>

                {/* 이미지 */}
                {selectedAccommodation.images && selectedAccommodation.images.length > 0 && (
                  <div className="detail-section full-width">
                    <h3><i className="bi bi-images"></i> 상품 이미지</h3>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                      {selectedAccommodation.images.map((image, idx) => (
                        <div key={image.id || idx} style={{ position: 'relative' }}>
                          <img
                            src={image.url}
                            alt={`숙소 이미지 ${idx + 1}`}
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
                {selectedAccommodation.description && (
                  <div className="detail-section full-width">
                    <h3><i className="bi bi-card-text"></i> 상품 설명</h3>
                    <p style={{ margin: '8px 0 0 0', color: '#374151', lineHeight: 1.6 }}>{selectedAccommodation.description}</p>
                  </div>
                )}

                {/* 객실 정보 */}
                <div className="detail-section full-width">
                  <h3><i className="bi bi-door-closed"></i> 객실 정보</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                    {selectedAccommodation.rooms.map((room, idx) => (
                      <div key={idx} style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <strong>{room.name}</strong>
                          <span style={{ color: '#2563eb', fontWeight: 600 }}>
                            {room.discount > 0 && <span style={{ textDecoration: 'line-through', color: '#9ca3af', marginRight: '8px', fontSize: '0.875rem' }}>{formatPrice(room.price)}</span>}
                            {formatPrice(room.price * (1 - room.discount / 100))}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#6b7280', flexWrap: 'wrap' }}>
                          <span>기준 {room.capacity}인 / 최대 {room.maxCapacity}인</span>
                          {room.size > 0 && <span>{room.size}㎡</span>}
                          <span>잔여 {room.stock}실</span>
                          {room.breakfast === 'included' && <span style={{ color: '#059669' }}>조식 포함</span>}
                        </div>
                        {room.bedTypes.length > 0 && (
                          <div style={{ marginTop: '8px' }}>
                            {room.bedTypes.map((bed, i) => (
                              <span key={i} className="amenity-tag" style={{ marginRight: '4px' }}>{bed}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 편의시설 */}
                <div className="detail-section">
                  <h3><i className="bi bi-stars"></i> 숙소 편의시설</h3>
                  <div className="amenities-list" style={{ marginTop: '8px' }}>
                    {selectedAccommodation.facilityAmenities.map(a => {
                      const amenity = facilityAmenities.find(f => f.value === a);
                      return amenity && <span key={a} className="amenity-tag"><i className={`bi ${amenity.icon} me-1`}></i>{amenity.label}</span>;
                    })}
                    {selectedAccommodation.facilityAmenities.length === 0 && (
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>등록된 편의시설 없음</span>
                    )}
                  </div>
                </div>

                {/* 객실 내 시설 */}
                <div className="detail-section">
                  <h3><i className="bi bi-house-door"></i> 객실 내 시설</h3>
                  <div className="amenities-list" style={{ marginTop: '8px' }}>
                    {selectedAccommodation.roomAmenities.map(a => {
                      const amenity = roomAmenities.find(f => f.value === a);
                      return amenity && <span key={a} className="amenity-tag"><i className={`bi ${amenity.icon} me-1`}></i>{amenity.label}</span>;
                    })}
                    {selectedAccommodation.roomAmenities.length === 0 && (
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>등록된 시설 없음</span>
                    )}
                  </div>
                </div>

                {/* 추가 옵션 */}
                {selectedAccommodation.addons.length > 0 && (
                  <div className="detail-section full-width">
                    <h3><i className="bi bi-plus-circle"></i> 추가 옵션</h3>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {selectedAccommodation.addons.map((addon, idx) => (
                        <span key={idx} className="amenity-tag">
                          {addon.name} ({addon.person}인) - {formatPrice(addon.price)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>닫기</button>
              <button className="btn btn-primary" onClick={() => { setIsDetailModalOpen(false); openEditModal(selectedAccommodation); }}>수정</button>
            </div>
          </div>
        </div>
      )}

      {/* 수정/추가 모달 */}
      {(isEditModalOpen || isAddModalOpen) && selectedAccommodation && (
        <div className="modal-overlay" onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}>
          <div className="modal-content large" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2>{isAddModalOpen ? '숙박 등록' : '숙박 수정'}</h2>
              <button className="modal-close" onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              {/* 숙소 정보 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                  <i className="bi bi-building" style={{ marginRight: '8px' }}></i>숙소 정보
                </h4>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>상품명 *</label>
                    <input type="text" value={selectedAccommodation.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="상품명을 입력하세요" />
                  </div>
                  <div className="form-group">
                    <label>숙소 유형 *</label>
                    <select value={selectedAccommodation.type} onChange={(e) => handleInputChange('type', e.target.value)}>
                      {accommodationTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>등급</label>
                    <select value={selectedAccommodation.starRating} onChange={(e) => handleInputChange('starRating', parseInt(e.target.value))}>
                      {starRatings.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>지역 *</label>
                    <select value={selectedAccommodation.region} onChange={(e) => handleInputChange('region', e.target.value)}>
                      {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>총 객실 수</label>
                    <input type="number" value={selectedAccommodation.totalRooms} onChange={(e) => handleInputChange('totalRooms', parseInt(e.target.value) || 0)} min="0" />
                  </div>
                  <div className="form-group full-width">
                    <label>위치 정보 *</label>
                    <input type="text" value={selectedAccommodation.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="위치 정보를 입력하세요" />
                  </div>
                  <div className="form-group">
                    <label>체크인 시간 *</label>
                    <input type="time" value={selectedAccommodation.checkIn} onChange={(e) => handleInputChange('checkIn', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>체크아웃 시간 *</label>
                    <input type="time" value={selectedAccommodation.checkOut} onChange={(e) => handleInputChange('checkOut', e.target.value)} />
                  </div>
                  {isEditModalOpen && (
                    <div className="form-group">
                      <label>상태</label>
                      <select value={selectedAccommodation.status} onChange={(e) => handleInputChange('status', e.target.value)}>
                        <option value="운영중">운영중</option>
                        <option value="운영중단">운영중단</option>
                      </select>
                    </div>
                  )}
                  <div className="form-group full-width">
                    <label>상품 설명</label>
                    <textarea
                      value={selectedAccommodation.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="상품에 대한 설명을 입력하세요"
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
                  <label htmlFor="image-upload" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#f3f4f6', border: '2px dashed #d1d5db', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <i className="bi bi-cloud-upload"></i>
                    <span>이미지 업로드</span>
                  </label>
                  <input
                    id="image-upload"
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
                {selectedAccommodation.images && selectedAccommodation.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {selectedAccommodation.images.map((image, idx) => (
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

                {(!selectedAccommodation.images || selectedAccommodation.images.length === 0) && (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#9ca3af', background: '#f9fafb', borderRadius: '8px', border: '1px dashed #e5e7eb' }}>
                    <i className="bi bi-image" style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}></i>
                    <span>등록된 이미지가 없습니다.</span>
                  </div>
                )}
              </div>

              {/* 객실 정보 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                  <i className="bi bi-door-closed" style={{ marginRight: '8px' }}></i>객실 정보
                </h4>
                {selectedAccommodation.rooms.map((room, idx) => (
                  <div key={room.id || idx} style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <strong>객실 타입 {idx + 1}</strong>
                      {selectedAccommodation.rooms.length > 1 && (
                        <button type="button" className="btn btn-sm btn-outline" style={{ color: '#dc2626', borderColor: '#dc2626' }} onClick={() => removeRoom(idx)}>
                          <i className="bi bi-x"></i> 삭제
                        </button>
                      )}
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>객실명 *</label>
                        <input type="text" value={room.name} onChange={(e) => handleRoomChange(idx, 'name', e.target.value)} placeholder="예: 스탠다드 더블" />
                      </div>
                      <div className="form-group">
                        <label>기준 인원 *</label>
                        <input type="number" value={room.capacity} onChange={(e) => handleRoomChange(idx, 'capacity', parseInt(e.target.value) || 0)} min="1" />
                      </div>
                      <div className="form-group">
                        <label>최대 인원</label>
                        <input type="number" value={room.maxCapacity} onChange={(e) => handleRoomChange(idx, 'maxCapacity', parseInt(e.target.value) || 0)} min="1" />
                      </div>
                      <div className="form-group">
                        <label>1박 가격 (원) *</label>
                        <input type="number" value={room.price} onChange={(e) => handleRoomChange(idx, 'price', parseInt(e.target.value) || 0)} min="0" step="1000" />
                      </div>
                      <div className="form-group">
                        <label>할인율 (%)</label>
                        <input type="number" value={room.discount} onChange={(e) => handleRoomChange(idx, 'discount', parseInt(e.target.value) || 0)} min="0" max="100" />
                      </div>
                      <div className="form-group">
                        <label>잔여 객실 *</label>
                        <input type="number" value={room.stock} onChange={(e) => handleRoomChange(idx, 'stock', parseInt(e.target.value) || 0)} min="0" />
                      </div>
                      <div className="form-group">
                        <label>객실 크기 (㎡)</label>
                        <input type="number" value={room.size} onChange={(e) => handleRoomChange(idx, 'size', parseInt(e.target.value) || 0)} min="0" />
                      </div>
                      <div className="form-group">
                        <label>조식 포함</label>
                        <select value={room.breakfast} onChange={(e) => handleRoomChange(idx, 'breakfast', e.target.value)}>
                          <option value="none">조식 미포함</option>
                          <option value="included">조식 포함</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: '8px' }}>침대 타입</label>
                      <div className="checkbox-group">
                        {bedTypes.map(bed => (
                          <label key={bed} className="checkbox-label">
                            <input type="checkbox" checked={room.bedTypes.includes(bed)} onChange={() => toggleRoomBedType(idx, bed)} />
                            {bed}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: '8px' }}>객실 특징</label>
                      <div className="checkbox-group">
                        {roomFeatures.map(f => (
                          <label key={f.value} className="checkbox-label">
                            <input type="checkbox" checked={room.features.includes(f.value)} onChange={() => toggleRoomFeature(idx, f.value)} />
                            <i className={`bi ${f.icon}`} style={{ marginRight: '4px' }}></i>{f.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-outline" style={{ width: '100%' }} onClick={addRoom}>
                  <i className="bi bi-plus-lg" style={{ marginRight: '8px' }}></i>객실 타입 추가
                </button>
              </div>

              {/* 편의시설 및 서비스 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                  <i className="bi bi-stars" style={{ marginRight: '8px' }}></i>편의시설 및 서비스
                </h4>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: '8px' }}>숙소 편의시설</label>
                  <div className="checkbox-group">
                    {facilityAmenities.map(a => (
                      <label key={a.value} className="checkbox-label">
                        <input type="checkbox" checked={selectedAccommodation.facilityAmenities.includes(a.value)} onChange={() => toggleFacilityAmenity(a.value)} />
                        <i className={`bi ${a.icon}`} style={{ marginRight: '4px' }}></i>{a.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: '8px' }}>객실 내 시설</label>
                  <div className="checkbox-group">
                    {roomAmenities.map(a => (
                      <label key={a.value} className="checkbox-label">
                        <input type="checkbox" checked={selectedAccommodation.roomAmenities.includes(a.value)} onChange={() => toggleRoomAmenity(a.value)} />
                        <i className={`bi ${a.icon}`} style={{ marginRight: '4px' }}></i>{a.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 추가 옵션 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                  <i className="bi bi-plus-circle" style={{ marginRight: '8px' }}></i>추가 옵션 (선택사항)
                </h4>
                {selectedAccommodation.addons.map((addon, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', marginBottom: '8px', alignItems: 'end' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>옵션명</label>
                      <input type="text" value={addon.name} onChange={(e) => handleAddonChange(idx, 'name', e.target.value)} placeholder="예: 조식 뷔페" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>인원</label>
                      <input type="number" value={addon.person} onChange={(e) => handleAddonChange(idx, 'person', parseInt(e.target.value) || 0)} min="0" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>가격 (원)</label>
                      <input type="number" value={addon.price} onChange={(e) => handleAddonChange(idx, 'price', parseInt(e.target.value) || 0)} min="0" />
                    </div>
                    <button type="button" className="btn-icon danger" onClick={() => removeAddon(idx)} style={{ marginBottom: '4px' }}>
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-outline" style={{ width: '100%' }} onClick={addAddon}>
                  <i className="bi bi-plus-lg" style={{ marginRight: '8px' }}></i>추가 옵션 추가
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}>취소</button>
              <button className="btn btn-primary" onClick={saveAccommodation}>
                {isAddModalOpen ? '등록' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && selectedAccommodation && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>숙박 삭제</h2>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="confirm-message">
                <i className="bi bi-exclamation-triangle text-warning"></i>
                <p>정말로 <strong>{selectedAccommodation.name}</strong>을(를) 삭제하시겠습니까?</p>
                <p className="text-muted">이 작업은 되돌릴 수 없습니다.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>취소</button>
              <button className="btn btn-danger" onClick={deleteAccommodation}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Accommodations;
