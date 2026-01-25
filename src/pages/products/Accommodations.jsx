import { useEffect, useState } from 'react';
import './Products.css';
import api from '../../api/api';
import AccommodationMap from './AccommodationMap';
import axios from 'axios';


// 숙소 유형 목록
const accommodationTypes = [
  { value: 'hotel', label: '호텔' },
  { value: 'resort', label: '리조트' },
  { value: 'pension', label: '펜션' },
  { value: 'guesthouse', label: '게스트하우스' },

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
const bedTypes = ['싱글', '더블', '퀸', '킹'];

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

  // 서버의 PaginationInfoVO 전체를 저장
  const [pagingData, setPagingData] = useState(null);
  
  // 페이징 파라미터 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // searchWord와 매핑
  const [searchType, setSearchType] = useState('all');
  
  // 기타 UI 상태들 (모달 등)
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [accommodationsData, setAccommodationsData] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  

const fetchAccommodationList = () => {
  api.get('/admin/products/accommodations')
    .then(res => {
      console.log("API 응답 데이터:", res.data);
      setAccommodationsData(res.data.dataList || []);
    })
    .catch(err => console.error("목록 로딩 실패:", err));
};

// 2. 페이지 처음 열릴 때 실행
useEffect(() => {
  fetchAccommodationList();
}, []);


  // 통계 계산
  const stats = {
  total: accommodationsData.length,

  operating: accommodationsData.filter(
    a => a.approveStatus === '판매중'
  ).length,

  stopped: accommodationsData.filter(
    a => a.approveStatus === '판매중단'
  ).length,

  totalRooms: accommodationsData.reduce(
    (sum, a) => sum + Number(a.totalRooms || 0),
    0
  )
};

  // 필터링된 데이터
 const filteredData = accommodationsData.filter(accommodation => {
  const search = searchTerm.toLowerCase();

  const name = accommodation.accomName || "";
  const address = accommodation.addr1 || "";

  const matchesSearch =
    name.toLowerCase().includes(search) ||
    address.toLowerCase().includes(search);

  const matchesStatus =
    filterStatus === 'all' || accommodation.status === filterStatus;

  const matchesType =
    filterType === 'all' || accommodation.type === filterType;

  const matchesRegion =
    filterRegion === 'all' || accommodation.region === filterRegion;

  return matchesSearch && matchesStatus && matchesType && matchesRegion;
});

  // 금액 포맷
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // 최저가 계산
  const getLowestPrice = (accommodation) => {
    if (!accommodation.roomTypeList || accommodation.roomTypeList.length === 0) return 0;
    const prices = accommodation.roomTypeList.map(r => r.price * (1 - r.discount / 100));
    return Math.min(...prices);
  };

  // 숙소 유형 라벨 및 클래스 맵
  const ACC_TYPE_MAP = {
  B02010500: { label: "리조트", class: "badge-primary" },
  B02010100: { label: "호텔", class: "badge-info" },
  B02010700: { label: "펜션", class: "badge-success" },
  B02011100: { label: "게스트하우스", class: "badge-warning" },
};

  // 숙소 유형 라벨 가져오기
  const getTypeLabel = (type) => {
    return ACC_TYPE_MAP[type]?.label || "기타";
  };

  // 지역 코드 라벨 맵
  const AREA_CODE_LABEL_MAP = {
  1: "서울",
  2: "인천",
  3: "대전",
  4: "대구",
  5: "광주",
  6: "부산",
  7: "울산",
  8: "세종",
  31: "경기",
  32: "강원",
  33: "충북",
  34: "충남",
  35: "경북",
  36: "경남",
  37: "전북",
  38: "전남",
  39: "제주",
};

const getAreaLabel = (areaCode) => {
  return AREA_CODE_LABEL_MAP[areaCode] || "기타";
};

  // 상세 모달 열기
const openDetailModal = async (accommodation) => {
  console.log('🔥 클릭된 숙박', accommodation);
  try {
    const tripProdNo = accommodation.tripProdNo;
    
    // axios 대신 공통 설정이 담긴 'api' 인스턴스를 사용하는 것이 좋습니다.
    // 경로를 컨트롤러와 똑같이 맞춰줍니다.
    const res = await api.get(`/admin/products/accommodations/${tripProdNo}`);
    
    console.log('✅ 상세 응답 데이터:', res.data);

    // 데이터가 정상적으로 들어왔는지 확인 후 상태 업데이트
    if (res.data) {
      setSelectedAccommodation(res.data);
      setIsDetailModalOpen(true);
    } else {
      console.error("데이터가 비어있습니다.");
    }
  } catch (e) {
    console.error("상세 조회 에러 상세:", e.response || e);
    alert('숙박 상세 조회 실패');
  }
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

  /**
   * 숙박 판매 승인 핸들러
   */
  // 승인 핸들러
const handleApprove = async (tripProdNo) => {
  if (!window.confirm("이 숙박 상품을 최종 승인하시겠습니까?\n승인 시 즉시 '판매중' 상태로 전환됩니다.")) return;

  try {
    const response = await api.patch(`/admin/products/accommodations/approve/${tripProdNo}`);
    
    if (response.status === 200) {
      alert("✅ 상품 승인이 완료되었습니다!");
      setIsDetailModalOpen(false); // 모달 닫기
      fetchAccommodationList();    // 목록 새로고침 (리더가 쓰는 목록 함수명으로 맞춰줘!)
    }
  } catch (error) {
    console.error("승인 오류:", error);
    alert("승인 처리 중 문제가 발생했습니다. 서버 로그를 확인해주세요.");
  }
};

// 판매 중지/재개 핸들러
const handleToggleSale = async (item) => {
  const isCurrentlySelling = item?.delYn === 'N';
  const newDelYn = isCurrentlySelling ? 'Y' : 'N';
  const actionText = isCurrentlySelling ? "판매 중지" : "판매 재개(복구)";

  if (!window.confirm(`이 상품을 ${actionText} 하시겠습니까?`)) return;

  try {
    const response = await api.patch('/admin/products/accommodations/toggle-sale', {
      tripProdNo: item.tripProdNo,
      delYn: newDelYn
    });

    if (response.status === 200) {
      alert(`✅ ${actionText} 처리가 완료되었습니다.`);
      setIsDetailModalOpen(false);
      fetchAccommodationList(); // 목록 새로고침
    }
  } catch (error) {
    console.error("상태 변경 오류:", error);
    alert("상태 변경 중 오류가 발생했습니다.");
  }
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
      rooms: [...prev.roomTypeList, { ...emptyRoom, id: Date.now() }]
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
      rooms: prev.roomTypeList.map((room, i) =>
        i === index ? { ...room, [field]: value } : room
      )
    }));
  };

  // 객실 침대타입 토글
  const toggleRoomBedType = (index, bedType) => {
    setSelectedAccommodation(prev => ({
      ...prev,
      rooms: prev.roomTypeList.map((room, i) => {
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
      rooms: prev.roomTypeList.map((room, i) => {
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
            <span className="stat-label">판매중</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <i className="bi bi-pause-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.stopped}</span>
            <span className="stat-label">판매중단</span>
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
              <option value="판매중">판매중</option>
              <option value="판매중단">판매중단</option>
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
              <tr key={accommodation.tripProdNo}>
                <td>
                  <div className="product-name" onClick={() => openDetailModal(accommodation)}>
                    {accommodation.accName}
                  </div>
                  {accommodation.starGrade > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#d97706' }}>
                      {'★'.repeat(accommodation.starGrade)}
                    </div>
                  )}
                </td>
                <td>
                  <span className="badge badge-info">{getTypeLabel(accommodation.accCatCd)}</span>
                </td>
                <td>{getAreaLabel(accommodation.areaCode)}</td>
                <td>{accommodation.totalRooms}개</td>
                <td style={{ fontWeight: 500, color: '#2563eb' }}>{formatPrice(accommodation.minPrice)}</td>
                <td>
                  <span className={`status-badge ${accommodation.approveStatus === '판매중' ? 'active' : 'inactive'}`}>
                    {accommodation.approveStatus}
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
                      <i className={`bi ${accommodation.approveStatus === '판매중' ? 'bi-pause' : 'bi-play'}`}></i>
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
                <div className="detail-section" style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
                    <i className="bi bi-building-fill" style={{ color: '#4f46e5' }}></i>
                    <span>숙소 기본 정보</span>
                  </h3>
                  
                  <div className="detail-grid-internal" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* 1. 상품명 (가장 크게 강조) */}
                    <div className="detail-row" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className="label" style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>숙박 상품명</span>
                      <span className="value" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
                        {selectedAccommodation.accName}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '4px' }}>
                      {/* 2. 숙소 유형 & 등급 */}
                      <div className="detail-row-group">
                        <span className="label" style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>카테고리 및 등급</span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '4px 10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                            {getTypeLabel(selectedAccommodation.accCatCd)}
                          </span>
                          <span style={{ background: '#FFF7ED', color: '#EA580C', padding: '4px 10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                            <i className="bi bi-star-fill me-1"></i>
                            {selectedAccommodation.starGrade > 0 ? `${selectedAccommodation.starGrade}성급` : '무등급'}
                          </span>
                        </div>
                      </div>

                      {/* 3. 총 객실 수 */}
                      <div className="detail-row-group">
                        <span className="label" style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '6px' }}>운영 규모</span>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#334155' }}>
                          <i className="bi bi-door-open me-2" style={{ color: '#64748b' }}></i>
                          총 {selectedAccommodation.totalRooms}개 객실
                        </div>
                      </div>
                    </div>

                    {/* 4. 지역 정보 (리더의 로직 그대로 유지하며 스타일 업그레이드) */}
                    <div className="detail-row" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <span className="label" style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '8px' }}>소재지 정보</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {(() => {
                          const areaMap = {
                            "1": "서울", "2": "인천", "3": "대전", "4": "대구", "5": "광주", "6": "부산", "7": "울산", "8": "세종", 
                            "31": "경기", "32": "강원", "33": "충북", "34": "충남", "35": "경북", "36": "경남", "37": "전북", "38": "전남", "39": "제주"
                          };
                          const code = String(selectedAccommodation.areaCode || selectedAccommodation.AREACODE || "");
                          const areaName = areaMap[code] || "미지정";
                          const cityName = selectedAccommodation.cityNm || "";

                          return (
                            <>
                              <span style={{ background: '#F1F5F9', color: '#475569', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid #e2e8f0' }}>
                                {areaName} {cityName ? `· ${cityName}` : ""}
                              </span>
                              <span style={{ fontSize: '0.95rem', color: '#64748b' }}>
                                {selectedAccommodation.addr1}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 운영 정보 */}
                <div className="detail-section" style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                    <i className="bi bi-clock-history" style={{ color: '#4f46e5' }}></i>
                    <span>운영 및 등록 정보</span>
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '24px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>체크인</div>
                          <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.1rem' }}>{selectedAccommodation.checkInTime}</div>
                        </div>
                        <div style={{ width: '1px', height: '30px', background: '#e2e8f0', alignSelf: 'center' }}></div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>체크아웃</div>
                          <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.1rem' }}>{selectedAccommodation.checkOutTime}</div>
                        </div>
                      </div>
                      
                      {/* 운영 상태 배지 강조 */}
                      <span style={{
                        padding: '6px 14px',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        background: selectedAccommodation.approveStatus === '운영중' ? '#dcfce7' : '#f1f5f9',
                        color: selectedAccommodation.approveStatus === '운영중' ? '#166534' : '#64748b',
                        border: selectedAccommodation.approveStatus === '운영중' ? '1px solid #bbf7d0' : '1px solid #e2e8f0'
                      }}>
                        <i className={`bi ${selectedAccommodation.approveStatus === '운영중' ? 'bi-play-circle-fill' : 'bi-pause-circle'} me-1`}></i>
                        {selectedAccommodation.approveStatus}
                      </span>
                    </div>

                    <div style={{ 
                      marginTop: '10px', 
                      padding: '12px', 
                      background: '#f8fafc', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: '0.85rem' 
                    }}>
                      <span style={{ color: '#64748b' }}>최초 등록일</span>
                      <span style={{ color: '#1e293b', fontWeight: 600 }}>
                        {selectedAccommodation.regDt || selectedAccommodation.REG_DT || '날짜 정보 없음'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. 위치 확인 섹션 - 가로 꽉 채우고 지도 소환! */}
                <div className="detail-section full-width" style={{ marginTop: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <i className="bi bi-geo-alt-fill" style={{ color: '#ef4444' }}></i>
                    <span>위치 및 지도 확인</span>
                  </h3>
                  
                  <div style={{ 
                    padding: '20px', 
                    background: '#fff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }}>
                    {/* 주소 안내창 */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      marginBottom: '20px',
                      padding: '14px 20px',
                      background: '#fef2f2',
                      borderRadius: '12px',
                      border: '1px solid #fee2e2'
                    }}>
                      <i className="bi bi-pin-map-fill" style={{ color: '#ef4444', fontSize: '1.2rem' }}></i>
                      <span style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 600 }}>
                        {selectedAccommodation.addr1}
                      </span>
                    </div>

                    {/* ★ 지도 소환 ★ */}
                    <div style={{ 
                      borderRadius: '12px', 
                      overflow: 'hidden', 
                      border: '1px solid #f1f5f9',
                      height: '300px', 
                      width: '100%',
                      position: 'relative',
                      background: '#f8fafc' // 지도 로딩 전 배경색
                    }}>
                      {/* 주의: 상단에 import AccommodationMap from './AccommodationMap'; 
                        가 되어 있어야 함! 
                      */}
                      <AccommodationMap 
                        lat={Number(selectedAccommodation.mapy)} 
                        lng={Number(selectedAccommodation.mapx)} 
                      />
                    </div>
                  </div>
                </div>

                {/* 이미지 */}
                <div className="detail-section full-width" style={{ marginTop: '32px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <i className="bi bi-images" style={{ color: '#2563eb' }}></i>
                    <span>숙소 갤러리</span>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 400 }}>
                      (총 {selectedAccommodation.imageList?.length || 0}장)
                    </span>
                  </h3>

                  {selectedAccommodation.imageList && selectedAccommodation.imageList.length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: '16px',
                      marginTop: '12px'
                    }}>
                      {selectedAccommodation.imageList.map((image, idx) => (
                        <div key={image.fileNo || idx} style={{ 
                          position: 'relative', 
                          borderRadius: '12px', 
                          overflow: 'hidden',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          border: image.isMain ? '3px solid #2563eb' : '1px solid #e2e8f0',
                          aspectRatio: '3/2' // 이미지 비율 통일
                        }}>
                          <img
                            src={image.filePath}
                            alt={image.fileOriginalName}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          />
                          {image.isMain && (
                            <span style={{
                              position: 'absolute',
                              top: '8px',
                              left: '8px',
                              background: '#2563eb',
                              color: 'white',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '6px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}>
                              대표 이미지
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      marginTop: '12px',
                      padding: '40px',
                      border: '2px dashed #e2e8f0',
                      borderRadius: '16px',
                      textAlign: 'center',
                      color: '#94a3b8',
                      background: '#f8fafc'
                    }}>
                      <i className="bi bi-image-fill" style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}></i>
                      등록된 상품 이미지가 없습니다.
                    </div>
                  )}
                </div>

                {/* 2. 상품 설명 섹션 개선 */}
                <div className="detail-section full-width" style={{ marginTop: '32px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <i className="bi bi-card-text" style={{ color: '#4f46e5' }}></i>
                    <span>상품 상세 설명</span>
                  </h3>
                  
                  <div style={{
                    background: '#f8fafc',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    minHeight: '100px'
                  }}>
                    {selectedAccommodation.tripProdContent ? (
                      <p style={{
                        margin: 0,
                        color: '#334155',
                        lineHeight: 1.8,
                        fontSize: '1rem',
                        whiteSpace: 'pre-wrap', // 줄바꿈 보존
                        wordBreak: 'break-all'
                      }}>
                        {selectedAccommodation.tripProdContent}
                      </p>
                    ) : (
                      <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>
                        <i className="bi bi-chat-dots me-2"></i>
                        등록된 상품 설명이 없습니다.
                      </div>
                    )}
                  </div>
                </div>

                {/* 객실 정보 */}
                {selectedAccommodation.roomTypeList && selectedAccommodation.roomTypeList.length > 0 ? (
                  <div className="detail-section full-width" style={{ marginTop: '32px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                      <i className="bi bi-door-closed" style={{ color: '#2563eb' }}></i>
                      <span>판매 객실 유형</span>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 400 }}>
                        (총 {selectedAccommodation.roomTypeList.length}개 유형)
                      </span>
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {selectedAccommodation.roomTypeList.map((room, idx) => (
                        <div key={room.roomTypeNo || idx} style={{ 
                          padding: '20px', 
                          background: '#fff', 
                          borderRadius: '16px', 
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                          transition: 'transform 0.2s'
                        }}>
                          {/* 상단: 객실 이름 및 가격 */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                              <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>
                                {room.roomName}
                              </h4>
                              <div style={{ marginTop: '4px', display: 'flex', gap: '8px' }}>
                                {room.breakfastYn === 'included' && (
                                  <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                                    🍳 조식포함
                                  </span>
                                )}
                                <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                                  🛌 잔여 {selectedAccommodation.totalRooms}실
                                </span>
                              </div>
                            </div>
                            
                            <div style={{ textAlign: 'right' }}>
                              {room.discount > 0 && (
                                <div style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2px' }}>
                                  {formatPrice(room.price)}
                                </div>
                              )}
                              <div style={{ color: '#2563eb', fontSize: '1.3rem', fontWeight: 800 }}>
                                {formatPrice(room.price * (1 - (room.discount || 0) / 100))}
                                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#64748b', marginLeft: '2px' }}> / 박</span>
                              </div>
                            </div>
                          </div>

                          <hr style={{ border: 0, borderTop: '1px solid #f1f5f9', margin: '16px 0' }} />

                          {/* 하단: 객실 상세 스펙 */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: '#64748b' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="bi bi-people" style={{ color: '#94a3b8' }}></i>
                                기준 {room.baseGuestCount}인 / 최대 {room.maxGuestCount}인
                              </span>
                              {room.size > 0 && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <i className="bi bi-aspect-ratio" style={{ color: '#94a3b8' }}></i>
                                  {room.size}㎡
                                </span>
                              )}
                            </div>
                            
                            {room.bedTypesCd?.length > 0 && (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                {room.bedTypesCd.map((bed, i) => (
                                  <span key={i} style={{ 
                                    fontSize: '0.75rem', 
                                    padding: '4px 10px', 
                                    background: '#eef2ff', 
                                    color: '#4f46e5', 
                                    borderRadius: '8px',
                                    fontWeight: 600
                                  }}>
                                    {bed}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="detail-section full-width" style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '16px', border: '2px dashed #e2e8f0', marginTop: '32px' }}>
                    <i className="bi bi-door-closed" style={{ fontSize: '2.5rem', color: '#cbd5e1' }}></i>
                    <p style={{ marginTop: '12px', color: '#64748b', fontSize: '1rem' }}>등록된 객실 정보가 없습니다.</p>
                  </div>
                )}
                
                {/* 숙소 편의시설 섹션 UI 개선 */}
                <div className="detail-section" style={{ marginTop: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <i className="bi bi-stars" style={{ color: '#059669' }}></i> {/* 아이콘 색상 포인트 */}
                    <span>숙소 공용 편의시설</span>
                  </h3>
                  
                  <div className="amenities-container" style={{
                    background: '#f0fdf4', // 숙소 시설은 약간 초록빛 베이스로 신선하게!
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid #dcfce7'
                  }}>
                    <div className="amenities-list" style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px' 
                    }}>
                      {selectedAccommodation.accFacility ? (
                        (() => {
                          const renderedFacilities = Object.entries(selectedAccommodation.accFacility)
                            .map(([key, value]) => {
                              if (value !== 'Y') return null;
                              
                              const amenityKey = key.replace('Yn', '').toLowerCase();
                              const amenity = facilityAmenities.find(f => f.value === amenityKey);

                              return amenity ? (
                                <span key={key} className="amenity-item" style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '8px 14px',
                                  background: '#fff',
                                  border: '1px solid #bbf7d0',
                                  borderRadius: '10px',
                                  fontSize: '0.9rem',
                                  fontWeight: 600,
                                  color: '#166534',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                                }}>
                                  <i className={`bi ${amenity.icon}`} style={{ color: '#059669', fontSize: '1.1rem' }}></i>
                                  {amenity.label}
                                </span>
                              ) : null;
                            }).filter(Boolean);

                          return renderedFacilities.length > 0 ? renderedFacilities : (
                            <div style={{ width: '100%', textAlign: 'center', color: '#86efac', padding: '10px 0' }}>
                              <i className="bi bi-info-circle me-2"></i>활성화된 공용 시설이 없습니다.
                            </div>
                          );
                        })()
                      ) : (
                        <div style={{
                          width: '100%',
                          padding: '32px',
                          textAlign: 'center',
                          border: '2px dashed #dcfce7',
                          borderRadius: '12px',
                          color: '#64748b',
                          background: '#fff'
                        }}>
                          <i className="bi bi-patch-question d-block mb-2" style={{ fontSize: '1.5rem', color: '#86efac' }}></i>
                          <span style={{ fontSize: '0.9rem' }}>등록된 편의 시설 정보가 없습니다.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 객실 내 시설 섹션 UI 개선 */}
                  <div className="detail-section" style={{ marginTop: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <i className="bi bi-house-door" style={{ color: '#4f46e5' }}></i>
                      <span>객실 내 주요 시설</span>
                    </h3>
                    
                    <div className="amenities-container" style={{
                      background: '#f8fafc',
                      padding: '20px',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div className="amenities-list" style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '10px' 
                      }}>
                        {selectedAccommodation.roomTypeList?.[0]?.facility ? (
                          (() => {
                            const renderedAmenities = Object.entries(selectedAccommodation.roomTypeList[0].facility)
                              .map(([key, value]) => {
                                if (value !== 'Y') return null;
                                const amenityKey = key.replace('Yn', '').toLowerCase();
                                const amenity = roomAmenities.find(f => f.value === amenityKey);

                                return amenity ? (
                                  <span key={key} className="amenity-item" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 14px',
                                    background: '#fff',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '10px',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: '#334155',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                  }}>
                                    <i className={`bi ${amenity.icon}`} style={{ color: '#4f46e5', fontSize: '1.1rem' }}></i>
                                    {amenity.label}
                                  </span>
                                ) : null;
                              }).filter(Boolean);

                            return renderedAmenities.length > 0 ? renderedAmenities : (
                              <div style={{ width: '100%', textAlign: 'center', color: '#94a3b8', padding: '10px 0' }}>
                                <i className="bi bi-exclamation-circle me-2"></i>활성화된 시설 정보가 없습니다.
                              </div>
                            );
                          })()
                        ) : (
                          <div style={{
                            width: '100%',
                            padding: '32px',
                            textAlign: 'center',
                            border: '2px dashed #e2e8f0',
                            borderRadius: '12px',
                            color: '#64748b',
                            background: '#fff'
                          }}>
                            <i className="bi bi-slash-circle d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                            <span style={{ fontSize: '0.9rem' }}>등록된 객실 시설 정보가 없습니다.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
               {/* 추가 옵션 */}
                  {selectedAccommodation.accOptionList?.length > 0 && (
                    <div className="detail-section full-width" style={{ marginTop: '24px' }}>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <i className="bi bi-plus-circle" style={{ color: '#4f46e5' }}></i> 
                        <span>추가 옵션 정보</span>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 400 }}>
                          (총 {selectedAccommodation.accOptionList.length}개)
                        </span>
                      </h3>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                        gap: '12px' 
                      }}>
                        {selectedAccommodation.accOptionList.map((addon, idx) => (
                          <div key={idx} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            transition: 'all 0.2s'
                          }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>
                                {addon.name}
                              </span>
                              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                <i className="bi bi-person me-1"></i> 기준 {addon.person}인
                              </span>
                            </div>
                            <div style={{ 
                              fontWeight: 800, 
                              color: '#4f46e5', 
                              fontSize: '1rem',
                              background: '#eef2ff',
                              padding: '4px 10px',
                              borderRadius: '8px'
                            }}>
                              {formatPrice(addon.price)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  </div>
                  </div>
                  {/* 3. 통합 푸터 */}
                    <div className="modal-footer" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '28px 36px',
                  background: '#f1f5f9', 
                  borderTop: '1px solid #e2e8f0',
                  borderBottomLeftRadius: '24px',
                  borderBottomRightRadius: '24px',
                  marginTop: '24px' // 옵션 섹션과의 간격
                }}>
                  {/* 왼쪽: 관리자 승인 및 판매 상태 제어 */}
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    
                {/* 1. 승인 상태 배지 (approveStatus 기준) */}
                  <span style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    // '판매중'이면 초록색, 그 외(대기/반려 등)는 노란색
                    background: selectedAccommodation?.approveStatus === '판매중' ? '#dcfce7' : '#fef3c7',
                    color: selectedAccommodation?.approveStatus === '판매중' ? '#166534' : '#92400e',
                    border: `1px solid ${selectedAccommodation?.approveStatus === '판매중' ? '#bbf7d0' : '#fde68a'}`
                  }}>
                    {(() => {
                      const status = selectedAccommodation?.approveStatus;

                      if (status === '판매중') {
                        return '✅ 승인 완료된 상품';
                      } else if (status === '승인대기' || !status) {
                        return '🕒 승인 대기중';
                      } else if (status === '반려') {
                        return '❌ 반려된 상품';
                      } else {
                        // 혹시 다른 상태값이 있을 경우를 대비
                        return `🕒 ${status}`;
                      }
                    })()}
                  </span>

                    {/* 2. 승인 버튼 (approveStatus가 '판매중'이 아닐 때만 노출) */}
                    {selectedAccommodation?.approveStatus !== '판매중' && (
                      <button 
                        className="btn" 
                        onClick={() => handleApprove(selectedAccommodation?.tripProdNo)}
                        style={{ 
                          background: '#10b981', 
                          color: '#fff', 
                          border: 'none', 
                          padding: '12px 24px', 
                          borderRadius: '12px', 
                          fontWeight: 800,
                          cursor: 'pointer', 
                          boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)',
                          transition: 'all 0.2s'
                        }}
                        // 마우스 올리면 더 진해지는 효과 살짝 추가!
                        onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
                      >
                        <i className="bi bi-check-all" style={{ marginRight: '6px' }}></i> 상품 승인하기
                      </button>
                    )}

                    {/* 3. 판매 제어 버튼 (delYn 및 판매 상태 기준) */}
                      <button 
                        className="btn"
                        onClick={() => handleToggleSale(selectedAccommodation)}
                        style={{ 
                          border: '2px solid',
                          // 삭제된 상태('Y')면 파란색(복구), 운영 중이면 빨간색(중지)
                          borderColor: selectedAccommodation?.delYn === 'Y' ? '#3b82f6' : '#ef4444', 
                          color: selectedAccommodation?.delYn === 'Y' ? '#3b82f6' : '#ef4444', 
                          background: 'transparent',
                          padding: '10px 20px', 
                          borderRadius: '12px', 
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        // 호버 시 살짝 색깔 채워주는 효과 (선택사항!)
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = selectedAccommodation?.delYn === 'Y' ? '#eff6ff' : '#fef2f2';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {(() => {
                          if (selectedAccommodation?.delYn === 'Y') {
                            return <><i className="bi bi-arrow-counterclockwise me-1"></i> 삭제 데이터 복구</>;
                          } else {
                            // 삭제 안 된 상태라면? 판매 중인지 아닌지에 따라 문구 조절 가능!
                            return <><i className="bi bi-stop-circle me-1"></i> 판매 중지(삭제)</>;
                          }
                        })()}
                      </button>
                  </div>

                  {/* 오른쪽: 일반 조작 (닫기, 수정) */}
                  <div style={{ display: 'flex', gap: '14px' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => setIsDetailModalOpen(false)}
                      style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 600 }}
                    >
                      닫기
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => { setIsDetailModalOpen(false); openEditModal(selectedAccommodation); }}
                      style={{ 
                        background: '#4f46e5', color: '#fff', border: 'none',
                        padding: '12px 28px', borderRadius: '12px', fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                      }}
                    >
                      <i className="bi bi-pencil-square" style={{ marginRight: '6px' }}></i> 정보 수정
                    </button>
                  </div>
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
                      {starRatings?.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>지역 *</label>
                    <select value={selectedAccommodation.region} onChange={(e) => handleInputChange('region', e.target.value)}>
                      {regions?.map(r => <option key={r} value={r}>{r}</option>)}
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
                    {selectedAccommodation.images?.map((image, idx) => (
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
                {selectedAccommodation.roomTypeList.map((room, idx) => (
                  <div key={room.id || idx} style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', marginBottom: '12px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <strong>객실 타입 {idx + 1}</strong>
                      {selectedAccommodation.roomTypeList.length > 1 && (
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
  )}


export default Accommodations;
