import { useState, useRef } from 'react';
import {
  RiAddLine,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiMapPinLine,
  RiGlobalLine,
  RiImageLine,
  RiCalendarLine,
  RiUploadLine,
  RiCloseLine,
  RiStarLine,
  RiSunLine,
  RiHashtag
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';
import '../products/Products.css';

// 여행 스타일 목록 (사용자 페이지 기준)
const travelStyleOptions = [
  { value: 'healing', label: '힐링 여행', icon: 'bi-tree', tags: ['온천', '스파', '휴양지'] },
  { value: 'activity', label: '액티비티', icon: 'bi-bicycle', tags: ['수상스포츠', '등산', '체험'] },
  { value: 'food', label: '맛집 탐방', icon: 'bi-cup-hot', tags: ['로컬맛집', '카페투어', '시장'] },
  { value: 'culture', label: '문화/역사', icon: 'bi-bank', tags: ['박물관', '유적지', '전통체험'] },
  { value: 'nature', label: '자연 감상', icon: 'bi-sunrise', tags: ['일출/일몰', '해안도로', '산/바다'] },
  { value: 'photo', label: '사진 명소', icon: 'bi-camera', tags: ['포토존', '인스타', '뷰맛집'] },
  { value: 'shopping', label: '쇼핑', icon: 'bi-bag', tags: ['특산품', '기념품', '아울렛'] },
  { value: 'romance', label: '로맨틱', icon: 'bi-heart', tags: ['데이트', '야경', '분위기'] }
];

// 최적 여행 시기 목록
const bestSeasonOptions = [
  { value: 'spring', label: '봄 (3~5월)' },
  { value: 'summer', label: '여름 (6~8월)' },
  { value: 'autumn', label: '가을 (9~11월)' },
  { value: 'winter', label: '겨울 (12~2월)' },
  { value: 'all', label: '연중' }
];

// 샘플 데이터 (국내 여행지만)
const initialDestinationsData = [
  {
    id: 1,
    name: '제주도',
    area: '제주',
    category: '자연',
    travelStyles: ['healing', 'nature', 'food', 'photo'],
    tags: ['올레길', '한라산', '해변', '흑돼지', '감귤', '카페'],
    highlights: ['성산일출봉', '우도', '협재해수욕장', '한라산', '섭지코지'],
    bestSeason: ['spring', 'autumn'],
    placesCount: 156,
    views: 45280,
    likes: 12350,
    scheduleCount: 8920,
    status: 'active',
    isPopular: true,
    ranking: 1,
    description: '대한민국 최남단의 아름다운 섬. 한라산, 올레길, 해변 등 다양한 자연경관과 맛있는 흑돼지, 해산물을 즐길 수 있는 국내 최고의 여행지입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1590650046871-92c887180603?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590650046871-92c887180603?w=800&q=80',
      'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80'
    ],
    createdAt: '2024-01-10',
    lastModified: '2024-03-15 10:30'
  },
  {
    id: 2,
    name: '부산',
    area: '부산',
    category: '도시',
    travelStyles: ['food', 'photo', 'culture', 'nature'],
    tags: ['해운대', '광안리', '감천문화마을', '밀면', '돼지국밥', '회'],
    highlights: ['해운대해수욕장', '광안대교', '감천문화마을', '해동용궁사', '자갈치시장'],
    bestSeason: ['summer', 'autumn'],
    placesCount: 98,
    views: 32150,
    likes: 8920,
    scheduleCount: 6540,
    status: 'active',
    isPopular: true,
    ranking: 2,
    description: '대한민국 제2의 도시. 해운대, 광안리, 감천문화마을 등 볼거리가 풍부하고 신선한 회와 돼지국밥 등 맛있는 음식이 가득합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80'
    ],
    createdAt: '2024-01-15',
    lastModified: '2024-03-10 14:20'
  },
  {
    id: 3,
    name: '강릉',
    area: '강원',
    category: '자연',
    travelStyles: ['healing', 'nature', 'food'],
    tags: ['경포대', '주문진', '커피거리', '회', '순두부', '바다'],
    highlights: ['경포해수욕장', '주문진항', '안목해변 커피거리', '오죽헌', '정동진'],
    bestSeason: ['summer', 'winter'],
    placesCount: 67,
    views: 18920,
    likes: 5430,
    scheduleCount: 3210,
    status: 'active',
    isPopular: true,
    ranking: 3,
    description: '동해안의 아름다운 해변 도시. 경포대, 주문진 등 바다와 자연을 만끽할 수 있으며, 커피거리와 순두부촌도 유명합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=80',
    images: [],
    createdAt: '2024-03-15',
    lastModified: '2024-03-18 09:00'
  },
  {
    id: 4,
    name: '경주',
    area: '경북',
    category: '역사',
    travelStyles: ['culture', 'photo', 'food'],
    tags: ['불국사', '석굴암', '첨성대', '황리단길', '한복', '경주빵'],
    highlights: ['불국사', '석굴암', '첨성대', '동궁과월지', '황리단길'],
    bestSeason: ['spring', 'autumn'],
    placesCount: 89,
    views: 24560,
    likes: 6780,
    scheduleCount: 4320,
    status: 'active',
    isPopular: true,
    ranking: 4,
    description: '천년 고도 신라의 수도. 불국사, 석굴암 등 유네스코 세계문화유산과 황리단길의 감성 카페, 한복 체험을 즐길 수 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80',
    images: [],
    createdAt: '2024-02-01',
    lastModified: '2024-03-12 16:45'
  },
  {
    id: 5,
    name: '여수',
    area: '전남',
    category: '자연',
    travelStyles: ['romance', 'food', 'nature', 'photo'],
    tags: ['여수밤바다', '낭만포차', '케이블카', '게장', '갓김치'],
    highlights: ['오동도', '여수해상케이블카', '향일암', '돌산공원', '낭만포차거리'],
    bestSeason: ['spring', 'summer'],
    placesCount: 54,
    views: 15670,
    likes: 4890,
    scheduleCount: 2780,
    status: 'active',
    isPopular: false,
    ranking: 5,
    description: '남해안의 낭만적인 항구 도시. 아름다운 밤바다와 해상케이블카, 맛있는 해산물 요리로 연인들에게 특히 인기 있는 여행지입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800&q=80',
    images: [],
    createdAt: '2024-02-20',
    lastModified: '2024-03-05 11:20'
  },
  {
    id: 6,
    name: '전주',
    area: '전북',
    category: '역사',
    travelStyles: ['culture', 'food', 'photo'],
    tags: ['한옥마을', '비빔밥', '한복', '전통', '막걸리', '초코파이'],
    highlights: ['전주한옥마을', '경기전', '전동성당', '남부시장', '오목대'],
    bestSeason: ['spring', 'autumn'],
    placesCount: 72,
    views: 19340,
    likes: 5210,
    scheduleCount: 3450,
    status: 'active',
    isPopular: false,
    ranking: 6,
    description: '한국 전통문화의 중심지. 한옥마을에서 한복을 입고 거닐며, 맛있는 비빔밥과 다양한 전통 음식을 즐길 수 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80',
    images: [],
    createdAt: '2024-01-25',
    lastModified: '2024-03-08 13:15'
  },
  {
    id: 7,
    name: '속초',
    area: '강원',
    category: '자연',
    travelStyles: ['nature', 'food', 'activity'],
    tags: ['설악산', '대포항', '아바이마을', '케이블카', '오징어순대', '회'],
    highlights: ['설악산', '대포항', '아바이마을', '속초해수욕장', '영금정'],
    bestSeason: ['autumn', 'winter'],
    placesCount: 45,
    views: 12340,
    likes: 3210,
    scheduleCount: 1980,
    status: 'active',
    isPopular: false,
    ranking: 7,
    description: '설악산과 동해바다를 함께 즐길 수 있는 도시. 대포항의 신선한 회와 아바이마을의 오징어순대가 유명합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    images: [],
    createdAt: '2024-03-10',
    lastModified: '2024-03-18 14:00'
  },
  {
    id: 8,
    name: '서울',
    area: '서울',
    category: '도시',
    travelStyles: ['culture', 'food', 'shopping', 'photo'],
    tags: ['경복궁', '명동', '홍대', '한강', '북촌', '남산타워'],
    highlights: ['경복궁', '북촌한옥마을', '남산서울타워', '명동', '홍대거리'],
    bestSeason: ['spring', 'autumn'],
    placesCount: 234,
    views: 52340,
    likes: 15670,
    scheduleCount: 12450,
    status: 'active',
    isPopular: true,
    ranking: 8,
    description: '대한민국의 수도. 전통과 현대가 어우러진 도시로, 고궁과 한옥마을부터 쇼핑과 맛집까지 다양한 매력을 갖추고 있습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800&q=80',
    images: [],
    createdAt: '2024-01-05',
    lastModified: '2024-03-20 09:00'
  },
  {
    id: 9,
    name: '대구',
    area: '대구',
    category: '도시',
    travelStyles: ['food', 'culture', 'shopping'],
    tags: ['동성로', '서문시장', '앞산', '막창', '납작만두', '치맥'],
    highlights: ['동성로', '서문시장', '앞산전망대', '김광석거리', '근대골목'],
    bestSeason: ['spring', 'autumn'],
    placesCount: 56,
    views: 9870,
    likes: 2340,
    scheduleCount: 1560,
    status: 'active',
    isPopular: false,
    ranking: 9,
    description: '대한민국 제3의 도시. 맛있는 막창과 납작만두, 활기찬 동성로 거리와 서문야시장이 유명합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=80',
    images: [],
    createdAt: '2024-02-15',
    lastModified: '2024-03-12 11:30'
  },
  {
    id: 10,
    name: '춘천',
    area: '강원',
    category: '자연',
    travelStyles: ['nature', 'food', 'activity'],
    tags: ['남이섬', '닭갈비', '막국수', '소양강', '레일바이크'],
    highlights: ['남이섬', '소양강스카이워크', '춘천명동', '강촌레일바이크', '삼악산'],
    bestSeason: ['spring', 'autumn'],
    placesCount: 42,
    views: 11230,
    likes: 2890,
    scheduleCount: 1870,
    status: 'active',
    isPopular: false,
    ranking: 10,
    description: '호반의 도시 춘천. 아름다운 남이섬과 맛있는 닭갈비, 막국수로 유명한 강원도의 대표 여행지입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800&q=80',
    images: [],
    createdAt: '2024-02-28',
    lastModified: '2024-03-15 14:20'
  }
];

// 지역 목록 (국내만)
const areaOptions = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
];

const categoryLabels = {
  '자연': 'badge-success',
  '도시': 'badge-primary',
  '역사': 'badge-warning',
  '휴양': 'badge-gray'
};

function Destinations() {
  const [destinationsData, setDestinationsData] = useState(initialDestinationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStyle, setFilterStyle] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('ranking');
  const fileInputRef = useRef(null);

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, destination: null });
  const [editModal, setEditModal] = useState({ isOpen: false, destination: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, destination: null });
  const [addModal, setAddModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  // 통계 계산
  const stats = {
    total: destinationsData.length,
    active: destinationsData.filter(d => d.status === 'active').length,
    popular: destinationsData.filter(d => d.isPopular).length,
    totalSchedules: destinationsData.reduce((sum, d) => sum + d.scheduleCount, 0),
    totalViews: destinationsData.reduce((sum, d) => sum + d.views, 0)
  };

  // 이미지 업로드 처리
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm(prev => ({ ...prev, imageUrl: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 삭제
  const handleRemoveImage = () => {
    setEditForm(prev => ({ ...prev, imageUrl: null }));
  };

  // 여행 스타일 토글
  const toggleTravelStyle = (styleValue) => {
    setEditForm(prev => {
      const currentStyles = prev.travelStyles || [];
      if (currentStyles.includes(styleValue)) {
        return { ...prev, travelStyles: currentStyles.filter(s => s !== styleValue) };
      } else {
        return { ...prev, travelStyles: [...currentStyles, styleValue] };
      }
    });
  };

  // 최적 시기 토글
  const toggleBestSeason = (seasonValue) => {
    setEditForm(prev => {
      const currentSeasons = prev.bestSeason || [];
      if (currentSeasons.includes(seasonValue)) {
        return { ...prev, bestSeason: currentSeasons.filter(s => s !== seasonValue) };
      } else {
        return { ...prev, bestSeason: [...currentSeasons, seasonValue] };
      }
    });
  };

  // 필터링 및 정렬
  const filteredData = destinationsData
    .filter(d => {
      const matchesSearch = d.name.includes(searchTerm) || d.area?.includes(searchTerm) || d.tags?.some(t => t.includes(searchTerm));
      const matchesArea = filterArea === 'all' || d.area === filterArea;
      const matchesCategory = filterCategory === 'all' || d.category === filterCategory;
      const matchesStyle = filterStyle === 'all' || d.travelStyles?.includes(filterStyle);
      const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
      return matchesSearch && matchesArea && matchesCategory && matchesStyle && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'ranking': return a.ranking - b.ranking;
        case 'views': return b.views - a.views;
        case 'likes': return b.likes - a.likes;
        case 'schedules': return b.scheduleCount - a.scheduleCount;
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        default: return 0;
      }
    });

  // 상세보기
  const handleViewDetail = (destination) => {
    setDetailModal({ isOpen: true, destination });
  };

  // 추가
  const handleAdd = () => {
    setEditForm({
      name: '',
      area: '서울',
      category: '자연',
      travelStyles: [],
      tags: [],
      highlights: [],
      bestSeason: [],
      description: '',
      status: 'active',
      isPopular: false
    });
    setAddModal(true);
  };

  const handleAddSubmit = () => {
    const newDestination = {
      ...editForm,
      id: Date.now(),
      placesCount: 0,
      views: 0,
      likes: 0,
      scheduleCount: 0,
      ranking: destinationsData.length + 1,
      images: editForm.imageUrl ? [editForm.imageUrl] : [],
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toLocaleString('ko-KR')
    };
    setDestinationsData(prev => [newDestination, ...prev]);
    setAddModal(false);
    alert('여행지가 등록되었습니다.');
  };

  // 수정
  const handleEdit = (destination) => {
    setEditForm({ ...destination });
    setEditModal({ isOpen: true, destination });
  };

  const handleEditSubmit = () => {
    const updatedData = {
      ...editForm,
      lastModified: new Date().toLocaleString('ko-KR')
    };
    setDestinationsData(prev => prev.map(d => d.id === editForm.id ? updatedData : d));
    setEditModal({ isOpen: false, destination: null });
    alert('여행지 정보가 수정되었습니다.');
  };

  // 삭제
  const handleDelete = (destination) => {
    setDeleteModal({ isOpen: true, destination });
  };

  const handleDeleteConfirm = () => {
    setDestinationsData(prev => prev.filter(d => d.id !== deleteModal.destination.id));
    setDeleteModal({ isOpen: false, destination: null });
    alert('여행지가 삭제되었습니다.');
  };

  // 인기 토글
  const togglePopular = (destination) => {
    setDestinationsData(prev => prev.map(d =>
      d.id === destination.id ? { ...d, isPopular: !d.isPopular } : d
    ));
  };

  // 여행 스타일 라벨 가져오기
  const getStyleLabel = (styleValue) => {
    const style = travelStyleOptions.find(s => s.value === styleValue);
    return style ? style.label : styleValue;
  };

  // 숫자 포맷
  const formatNumber = (num) => {
    if (num >= 10000) return (num / 10000).toFixed(1) + '만';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  // 폼 렌더링 (추가/수정 공통)
  const renderForm = () => (
    <div>
      {/* 대표 이미지 업로드 */}
      <div className="form-group">
        <label className="form-label"><RiImageLine /> 대표 이미지</label>
        <div
          style={{
            border: '2px dashed var(--border-color)',
            borderRadius: 12,
            padding: editForm.imageUrl ? 0 : 32,
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 150
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          {editForm.imageUrl ? (
            <div style={{ position: 'relative' }}>
              <img src={editForm.imageUrl} alt="대표 이미지" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
              <button
                type="button"
                className="btn btn-icon"
                style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white' }}
                onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
              >
                <RiCloseLine />
              </button>
            </div>
          ) : (
            <>
              <RiUploadLine size={32} style={{ color: 'var(--text-light)', marginBottom: 8 }} />
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>클릭하여 이미지를 업로드하세요</p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.75rem', marginTop: 4 }}>권장: 1200x600px</p>
            </>
          )}
        </div>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
      </div>

      {/* 기본 정보 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">여행지명 *</label>
          <input
            type="text"
            className="form-input"
            placeholder="여행지명을 입력하세요"
            value={editForm.name || ''}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">지역 *</label>
          <select
            className="form-input form-select"
            value={editForm.area || ''}
            onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
          >
            {areaOptions.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">카테고리</label>
          <select
            className="form-input form-select"
            value={editForm.category || ''}
            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
          >
            <option value="자연">자연</option>
            <option value="도시">도시</option>
            <option value="역사">역사</option>
            <option value="휴양">휴양</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">상태</label>
          <select
            className="form-input form-select"
            value={editForm.status || ''}
            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
          >
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>
        </div>
      </div>

      {/* 여행 스타일 선택 */}
      <div className="form-group">
        <label className="form-label">추천 여행 스타일 (복수 선택 가능)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {travelStyleOptions.map(style => (
            <button
              key={style.value}
              type="button"
              className={`btn ${editForm.travelStyles?.includes(style.value) ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
              onClick={() => toggleTravelStyle(style.value)}
            >
              <i className={`bi ${style.icon} me-1`}></i> {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* 최적 여행 시기 */}
      <div className="form-group">
        <label className="form-label">최적 여행 시기 (복수 선택 가능)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {bestSeasonOptions.map(season => (
            <button
              key={season.value}
              type="button"
              className={`btn ${editForm.bestSeason?.includes(season.value) ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
              onClick={() => toggleBestSeason(season.value)}
            >
              {season.label}
            </button>
          ))}
        </div>
      </div>

      {/* 태그 */}
      <div className="form-group">
        <label className="form-label"><RiHashtag /> 관련 태그 (쉼표로 구분)</label>
        <input
          type="text"
          className="form-input"
          placeholder="올레길, 한라산, 해변, 흑돼지"
          value={editForm.tags?.join(', ') || ''}
          onChange={(e) => setEditForm({ ...editForm, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
        />
      </div>

      {/* 주요 명소 */}
      <div className="form-group">
        <label className="form-label"><RiStarLine /> 주요 명소/하이라이트 (쉼표로 구분)</label>
        <input
          type="text"
          className="form-input"
          placeholder="성산일출봉, 우도, 협재해수욕장"
          value={editForm.highlights?.join(', ') || ''}
          onChange={(e) => setEditForm({ ...editForm, highlights: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
        />
      </div>

      {/* 소개 */}
      <div className="form-group">
        <label className="form-label">소개</label>
        <textarea
          className="form-input"
          rows={4}
          placeholder="여행지 소개를 입력하세요"
          value={editForm.description || ''}
          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* 인기 여행지 설정 */}
      <div className="form-group">
        <label className="checkbox-label" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={editForm.isPopular || false}
            onChange={(e) => setEditForm({ ...editForm, isPopular: e.target.checked })}
          />
          <span style={{ marginLeft: 8 }}>인기 여행지로 설정 (메인 페이지에 노출)</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>여행지 정보 관리</h1>
        <div className="header-actions">
          <button className="btn btn-outline">
            <i className="bi bi-download"></i> 엑셀 다운로드
          </button>
          <button className="btn btn-primary" onClick={handleAdd}>
            <RiAddLine /> 여행지 추가
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><i className="bi bi-geo-alt"></i></div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">전체 여행지</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><i className="bi bi-check-circle"></i></div>
          <div className="stat-content">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">활성</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow"><i className="bi bi-star"></i></div>
          <div className="stat-content">
            <span className="stat-value">{stats.popular}</span>
            <span className="stat-label">인기 여행지</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan"><i className="bi bi-calendar-check"></i></div>
          <div className="stat-content">
            <span className="stat-value">{formatNumber(stats.totalSchedules)}</span>
            <span className="stat-label">일정 포함</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><i className="bi bi-eye"></i></div>
          <div className="stat-content">
            <span className="stat-value">{formatNumber(stats.totalViews)}</span>
            <span className="stat-label">총 조회수</span>
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
              placeholder="여행지명, 국가, 태그 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}>
              <option value="all">전체 지역</option>
              {areaOptions.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">전체 카테고리</option>
              <option value="자연">자연</option>
              <option value="도시">도시</option>
              <option value="역사">역사</option>
              <option value="휴양">휴양</option>
            </select>
            <select value={filterStyle} onChange={(e) => setFilterStyle(e.target.value)}>
              <option value="all">전체 스타일</option>
              {travelStyleOptions.map(style => (
                <option key={style.value} value={style.value}>{style.label}</option>
              ))}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="ranking">인기순</option>
              <option value="views">조회순</option>
              <option value="likes">좋아요순</option>
              <option value="schedules">일정포함순</option>
              <option value="newest">최신순</option>
            </select>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 50 }}>순위</th>
              <th>여행지</th>
              <th>지역</th>
              <th>여행 스타일</th>
              <th>일정 포함</th>
              <th>조회/좋아요</th>
              <th>인기</th>
              <th>상태</th>
              <th style={{ width: 120 }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <tr key={item.id}>
                <td>
                  <span style={{ fontWeight: 600, color: item.ranking <= 3 ? 'var(--primary-color)' : 'inherit' }}>
                    {item.ranking <= 3 && <i className="bi bi-trophy-fill me-1" style={{ color: item.ranking === 1 ? '#FFD700' : item.ranking === 2 ? '#C0C0C0' : '#CD7F32' }}></i>}
                    {item.ranking}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        overflow: 'hidden',
                        background: item.imageUrl ? 'transparent' : '#E0F2FE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <RiMapPinLine style={{ color: '#0284C7' }} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, cursor: 'pointer' }} onClick={() => handleViewDetail(item)}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                        {item.category} · 장소 {item.placesCount}개
                      </div>
                    </div>
                  </div>
                </td>
                <td><span className="badge badge-primary">{item.area}</span></td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {item.travelStyles?.slice(0, 2).map(style => (
                      <span key={style} className="badge badge-secondary" style={{ fontSize: '0.6875rem' }}>
                        {getStyleLabel(style)}
                      </span>
                    ))}
                    {item.travelStyles?.length > 2 && (
                      <span className="badge badge-gray" style={{ fontSize: '0.6875rem' }}>+{item.travelStyles.length - 2}</span>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className="bi bi-calendar-check" style={{ color: 'var(--text-light)' }}></i>
                    <span>{formatNumber(item.scheduleCount)}</span>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.8125rem' }}>
                    <div><i className="bi bi-eye me-1"></i>{formatNumber(item.views)}</div>
                    <div style={{ color: '#DC2626' }}><i className="bi bi-heart-fill me-1"></i>{formatNumber(item.likes)}</div>
                  </div>
                </td>
                <td>
                  <button
                    className={`btn-icon ${item.isPopular ? 'warning' : ''}`}
                    title={item.isPopular ? '인기 여행지' : '일반'}
                    onClick={() => togglePopular(item)}
                    style={{ background: item.isPopular ? '#FEF3C7' : 'var(--bg-color)', color: item.isPopular ? '#D97706' : 'var(--text-light)' }}
                  >
                    <i className={`bi ${item.isPopular ? 'bi-star-fill' : 'bi-star'}`}></i>
                  </button>
                </td>
                <td>
                  <span className={`badge ${item.status === 'active' ? 'badge-success' : 'badge-gray'}`}>
                    {item.status === 'active' ? '활성' : '비활성'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="상세보기" onClick={() => handleViewDetail(item)}><RiEyeLine /></button>
                    <button className="btn-icon" title="수정" onClick={() => handleEdit(item)}><RiEditLine /></button>
                    <button className="btn-icon danger" title="삭제" onClick={() => handleDelete(item)}><RiDeleteBinLine /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-geo-alt"></i>
            <p>조건에 맞는 여행지가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, destination: null })}
        title="여행지 상세정보"
        size="large"
      >
        {detailModal.destination && (
          <div>
            {/* 대표 이미지 */}
            {detailModal.destination.imageUrl && (
              <div style={{ marginBottom: 24, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                <img src={detailModal.destination.imageUrl} alt={detailModal.destination.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                {detailModal.destination.isPopular && (
                  <span className="destination-badge" style={{ position: 'absolute', top: 12, left: 12, background: '#D97706', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
                    <i className="bi bi-star-fill me-1"></i>인기
                  </span>
                )}
                <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem' }}>
                  #{detailModal.destination.ranking} 인기
                </span>
              </div>
            )}

            {/* 기본 정보 */}
            <div className="detail-list">
              <div className="detail-item">
                <span className="detail-label"><RiMapPinLine /> 여행지명</span>
                <span className="detail-value">{detailModal.destination.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiGlobalLine /> 지역</span>
                <span className="detail-value">
                  <span className="badge badge-primary">{detailModal.destination.area}</span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">카테고리</span>
                <span className="detail-value">
                  <span className={`badge ${categoryLabels[detailModal.destination.category] || 'badge-gray'}`}>
                    {detailModal.destination.category}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiSunLine /> 최적 여행 시기</span>
                <span className="detail-value">
                  {detailModal.destination.bestSeason?.map(s => bestSeasonOptions.find(opt => opt.value === s)?.label).join(', ') || '-'}
                </span>
              </div>
            </div>

            {/* 여행 스타일 */}
            {detailModal.destination.travelStyles?.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 8 }}>추천 여행 스타일</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {detailModal.destination.travelStyles.map(style => {
                    const styleInfo = travelStyleOptions.find(s => s.value === style);
                    return (
                      <span key={style} className="badge badge-primary" style={{ padding: '6px 12px' }}>
                        <i className={`bi ${styleInfo?.icon} me-1`}></i>{styleInfo?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 관련 태그 */}
            {detailModal.destination.tags?.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 8 }}><RiHashtag /> 관련 태그</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {detailModal.destination.tags.map((tag, idx) => (
                    <span key={idx} style={{ padding: '4px 10px', background: 'var(--bg-color)', borderRadius: 20, fontSize: '0.8125rem' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 주요 명소 */}
            {detailModal.destination.highlights?.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <h5 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 8 }}><RiStarLine /> 주요 명소</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {detailModal.destination.highlights.map((place, idx) => (
                    <span key={idx} className="badge badge-info" style={{ padding: '6px 12px' }}>
                      <i className="bi bi-geo-alt me-1"></i>{place}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 통계 */}
            <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-color)', borderRadius: 8 }}>
              <h5 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 12 }}>통계</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)' }}>{formatNumber(detailModal.destination.scheduleCount)}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>일정 포함</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatNumber(detailModal.destination.views)}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>조회수</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#DC2626' }}>{formatNumber(detailModal.destination.likes)}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>좋아요</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{detailModal.destination.placesCount}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>등록 장소</div>
                </div>
              </div>
            </div>

            {/* 소개 */}
            <div style={{ marginTop: 16 }}>
              <h5 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 8 }}>소개</h5>
              <div style={{ padding: 12, background: 'var(--bg-color)', borderRadius: 8, lineHeight: 1.6 }}>
                {detailModal.destination.description}
              </div>
            </div>

            {/* 등록/수정 정보 */}
            <div className="detail-list" style={{ marginTop: 16 }}>
              <div className="detail-item">
                <span className="detail-label"><RiCalendarLine /> 등록일</span>
                <span className="detail-value">{detailModal.destination.createdAt}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">최근 수정일</span>
                <span className="detail-value">{detailModal.destination.lastModified || '-'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">상태</span>
                <span className="detail-value">
                  <span className={`badge ${detailModal.destination.status === 'active' ? 'badge-success' : 'badge-gray'}`}>
                    {detailModal.destination.status === 'active' ? '활성' : '비활성'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 추가 모달 */}
      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        title="여행지 추가"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setAddModal(false)}>취소</button>
            <button className="btn btn-primary" onClick={handleAddSubmit}>등록</button>
          </>
        }
      >
        {renderForm()}
      </Modal>

      {/* 수정 모달 */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, destination: null })}
        title="여행지 수정"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setEditModal({ isOpen: false, destination: null })}>취소</button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>저장</button>
          </>
        }
      >
        {editModal.destination && renderForm()}
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, destination: null })}
        onConfirm={handleDeleteConfirm}
        title="여행지 삭제"
        message={
          <>
            정말 "<strong>{deleteModal.destination?.name}</strong>" 여행지를 삭제하시겠습니까?<br/>
            <span style={{ color: '#DC2626' }}>
              이 여행지가 포함된 {formatNumber(deleteModal.destination?.scheduleCount || 0)}개의 일정에 영향을 줄 수 있습니다.
            </span>
          </>
        }
        confirmText="삭제"
        type="danger"
      />
    </div>
  );
}

export default Destinations;
