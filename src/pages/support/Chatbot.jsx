import { useState } from 'react';
import {
  RiSearchLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiRobot2Line,
  RiToggleLine,
  RiToggleFill,
  RiQuestionLine,
  RiEyeLine,
  RiMapPinLine,
  RiCalendarCheckLine,
  RiWallet3Line,
  RiCustomerService2Line,
  RiFileListLine,
  RiCheckboxCircleLine,
  RiChatSmile2Line,
  RiArrowRightLine,
  RiExternalLinkLine,
  RiFilterLine,
  RiMessage2Line
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

// 카테고리 정의 (사용자 페이지와 동일한 대화 흐름 구조)
const categories = [
  { id: 'all', label: '전체', icon: RiFileListLine },
  { id: '여행지 추천', label: '여행지 추천', icon: RiMapPinLine },
  { id: '여행 일정', label: '여행 일정', icon: RiCalendarCheckLine },
  { id: '예약/결제', label: '예약/결제', icon: RiWallet3Line },
  { id: '서비스 안내', label: '서비스 안내', icon: RiCustomerService2Line }
];

const categoryColors = {
  '여행지 추천': { className: 'badge-success', color: '#10b981' },
  '여행 일정': { className: 'badge-primary', color: '#4A90D9' },
  '예약/결제': { className: 'badge-warning', color: '#f59e0b' },
  '서비스 안내': { className: 'badge-info', color: '#0dcaf0' }
};

// 더미 데이터 (사용자 페이지의 chatData 구조 기반)
const initialChatbotData = [
  // 여행지 추천
  {
    id: 'dest_jeju',
    category: '여행지 추천',
    title: '제주도 여행 정보',
    trigger: '제주도',
    message: '제주도 추천 여행 정보',
    content: '• 성산일출봉 - 유네스코 세계자연유산\n• 우도 - 에메랄드빛 바다와 땅콩 아이스크림\n• 한라산 - 등반 및 둘레길 트레킹\n• 협재해수욕장 - 투명한 바다와 하얀 모래',
    link: '/product/tour?region=jeju',
    linkText: '제주도 상품 보러가기',
    hits: 2450,
    active: true,
    updatedAt: '2024-03-15'
  },
  {
    id: 'dest_busan',
    category: '여행지 추천',
    title: '부산 여행 정보',
    trigger: '부산',
    message: '부산 추천 여행 정보',
    content: '• 해운대해수욕장 - 대한민국 대표 해변\n• 광안리 - 광안대교 야경\n• 감천문화마을 - 알록달록 계단 마을\n• 자갈치시장 - 싱싱한 해산물',
    link: '/product/tour?region=busan',
    linkText: '부산 상품 보러가기',
    hits: 1890,
    active: true,
    updatedAt: '2024-03-14'
  },
  {
    id: 'dest_gangwon',
    category: '여행지 추천',
    title: '강원도 여행 정보',
    trigger: '강원도',
    message: '강원도 추천 여행 정보',
    content: '• 강릉 경포대 - 해돋이 명소\n• 속초 설악산 - 단풍 및 등산\n• 양양 서피비치 - 서핑 성지\n• 평창 대관령 - 양떼목장, 스키장',
    link: '/product/tour?region=gangwon',
    linkText: '강원도 상품 보러가기',
    hits: 1245,
    active: true,
    updatedAt: '2024-03-14'
  },
  {
    id: 'season_spring',
    category: '여행지 추천',
    title: '봄 추천 여행지',
    trigger: '봄',
    message: '봄 추천 여행지',
    content: '벚꽃 명소:\n• 진해 - 군항제, 여좌천 벚꽃\n• 경주 - 보문단지 벚꽃길\n• 서울 여의도 - 윤중로 벚꽃축제\n\n꽃 축제:\n• 태안 - 튤립 축제\n• 고창 - 청보리밭 축제\n• 제주 - 유채꽃 축제',
    link: '',
    linkText: '',
    hits: 890,
    active: true,
    updatedAt: '2024-03-10'
  },
  {
    id: 'theme_healing',
    category: '여행지 추천',
    title: '힐링/휴식 추천',
    trigger: '힐링',
    message: '힐링/휴식 추천',
    content: '온천/스파:\n• 아산 - 온양온천\n• 부산 - 해운대 스파\n• 제주 - 중문 리조트\n\n자연 힐링:\n• 담양 - 죽녹원, 메타세쿼이아길\n• 순천 - 순천만 습지\n• 울릉도 - 청정 자연',
    link: '',
    linkText: '',
    hits: 756,
    active: true,
    updatedAt: '2024-03-08'
  },

  // 여행 일정
  {
    id: 'schedule_jeju',
    category: '여행 일정',
    title: '제주도 3박 4일 추천 일정',
    trigger: '제주 일정',
    message: '제주도 3박 4일 추천 일정',
    content: 'Day 1: 제주공항 → 용두암 → 제주시 동문시장 → 숙소\nDay 2: 성산일출봉 → 섭지코지 → 우도 → 월정리해변\nDay 3: 한라산 둘레길 → 중문관광단지 → 천지연폭포\nDay 4: 협재해수욕장 → 오설록 티뮤지엄 → 제주공항',
    link: '/schedule/search',
    linkText: 'AI 맞춤 일정 만들기',
    hits: 3210,
    active: true,
    updatedAt: '2024-03-15'
  },
  {
    id: 'schedule_busan',
    category: '여행 일정',
    title: '부산 2박 3일 추천 일정',
    trigger: '부산 일정',
    message: '부산 2박 3일 추천 일정',
    content: 'Day 1: 부산역 → 자갈치시장 → 남포동 BIFF거리 → 광안리 야경\nDay 2: 해운대 → 동백섬 → 해동용궁사 → 기장 카페거리\nDay 3: 감천문화마을 → 송도 스카이워크 → 부산역',
    link: '/schedule/search',
    linkText: 'AI 맞춤 일정 만들기',
    hits: 2580,
    active: true,
    updatedAt: '2024-03-14'
  },
  {
    id: 'schedule_ai',
    category: '여행 일정',
    title: 'AI 맞춤 일정 서비스',
    trigger: 'AI 일정',
    message: 'AI 맞춤 일정 서비스',
    content: '모행의 AI가 당신만을 위한 맞춤 여행 일정을 만들어드립니다!\n\n이용 방법:\n1. 여행지, 기간, 인원 선택\n2. 여행 스타일 선택 (힐링/액티비티/맛집 등)\n3. AI가 맞춤 일정 자동 생성\n4. 일정 수정 및 저장 가능',
    link: '/schedule/search',
    linkText: 'AI 일정 만들러 가기',
    hits: 4520,
    active: true,
    updatedAt: '2024-03-15'
  },

  // 예약/결제
  {
    id: 'booking_how',
    category: '예약/결제',
    title: '예약 방법 안내',
    trigger: '예약 방법',
    message: '예약 방법 안내',
    content: '예약 절차:\n1. 원하는 상품 선택\n2. 날짜/인원/옵션 선택\n3. 결제자 정보 입력\n4. 결제 수단 선택 및 결제\n5. 예약 완료!',
    link: '/product/tour',
    linkText: '상품 보러가기',
    hits: 1890,
    active: true,
    updatedAt: '2024-03-12'
  },
  {
    id: 'booking_cancel',
    category: '예약/결제',
    title: '취소/환불 안내',
    trigger: '취소, 환불',
    message: '취소/환불 안내',
    content: '취소 방법:\n마이페이지 → 결제 내역 → 결제 취소\n\n환불 정책:\n• 이용일 7일 전: 100% 환불\n• 이용일 3~6일 전: 70% 환불\n• 이용일 1~2일 전: 50% 환불\n• 이용일 당일: 환불 불가\n\n* 상품에 따라 환불 정책이 다를 수 있습니다.',
    link: '',
    linkText: '',
    hits: 2340,
    active: true,
    updatedAt: '2024-03-15'
  },
  {
    id: 'booking_payment',
    category: '예약/결제',
    title: '결제 수단 안내',
    trigger: '결제 수단, 결제 방법',
    message: '결제 수단 안내',
    content: '이용 가능한 결제 수단:\n• 신용/체크카드 - 모든 카드 이용 가능\n• 카카오페이 - 간편 결제\n• 네이버페이 - 간편 결제\n• 계좌이체 - 실시간 계좌이체',
    link: '',
    linkText: '',
    hits: 1560,
    active: true,
    updatedAt: '2024-03-10'
  },
  {
    id: 'booking_point',
    category: '예약/결제',
    title: '포인트 사용 안내',
    trigger: '포인트',
    message: '포인트 사용 안내',
    content: '포인트 적립:\n• 결제 금액의 1% 자동 적립\n• 후기 작성 시 추가 적립\n• 이벤트 참여 시 보너스 적립\n\n포인트 사용:\n• 최소 1,000P 이상 사용 가능\n• 결제 시 포인트 차감 적용\n• 포인트 유효기간: 적립일로부터 1년',
    link: '/mypage/points',
    linkText: '내 포인트 확인하기',
    hits: 980,
    active: true,
    updatedAt: '2024-03-08'
  },

  // 서비스 안내
  {
    id: 'service_member',
    category: '서비스 안내',
    title: '회원가입/로그인 안내',
    trigger: '회원가입, 로그인',
    message: '회원가입/로그인 안내',
    content: '회원 유형:\n• 일반회원: 여행 상품 구매, 포인트 적립\n• 기업회원: 여행 상품 등록 및 판매\n\n간편 로그인:\n• 카카오 로그인\n• 네이버 로그인\n• 구글 로그인',
    link: '/member/join',
    linkText: '회원가입 하러가기',
    hits: 1230,
    active: true,
    updatedAt: '2024-03-14'
  },
  {
    id: 'service_mypage',
    category: '서비스 안내',
    title: '마이페이지 이용 안내',
    trigger: '마이페이지',
    message: '마이페이지 이용 안내',
    content: '마이페이지 메뉴:\n• 내 일정: 저장한 여행 일정 관리\n• 결제 내역: 결제/환불 내역 확인\n• 포인트: 포인트 적립/사용 내역\n• 찜 목록: 찜한 상품 목록\n• 1:1 문의: 문의 내역 확인',
    link: '/mypage',
    linkText: '마이페이지 가기',
    hits: 870,
    active: true,
    updatedAt: '2024-03-12'
  },
  {
    id: 'service_inquiry',
    category: '서비스 안내',
    title: '1:1 문의 안내',
    trigger: '문의',
    message: '1:1 문의 안내',
    content: '챗봇으로 해결되지 않는 문의사항은 1:1 문의를 통해 상담받으실 수 있습니다.\n\n문의 유형:\n• 예약/결제 문의\n• 취소/환불 문의\n• 상품 관련 문의\n• 기타 문의\n\n평균 답변 시간: 24시간 이내',
    link: '/support/inquiry',
    linkText: '1:1 문의하기',
    hits: 650,
    active: true,
    updatedAt: '2024-03-10'
  }
];

function Chatbot() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [data, setData] = useState(initialChatbotData);

  // 모달 상태
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, item: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [previewModal, setPreviewModal] = useState({ isOpen: false, item: null });
  const [editForm, setEditForm] = useState({});

  const filteredData = data.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.trigger.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // 통계 계산
  const totalCount = data.length;
  const activeCount = data.filter(d => d.active).length;
  const totalHits = data.reduce((sum, d) => sum + d.hits, 0);
  const categoryCount = [...new Set(data.map(d => d.category))].length;

  const toggleActive = (id) => {
    setData(data.map(item => item.id === id ? { ...item, active: !item.active } : item));
  };

  // 미리보기
  const handlePreview = (item) => {
    setPreviewModal({ isOpen: true, item });
  };

  // 추가
  const handleAdd = () => {
    setEditForm({
      id: '',
      category: '여행지 추천',
      title: '',
      trigger: '',
      message: '',
      content: '',
      link: '',
      linkText: '',
      active: true
    });
    setAddModal(true);
  };

  const handleAddSubmit = () => {
    if (!editForm.title || !editForm.content) {
      alert('제목과 응답 내용을 입력해주세요.');
      return;
    }
    const newItem = {
      ...editForm,
      id: `item_${Date.now()}`,
      hits: 0,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setData(prev => [newItem, ...prev]);
    setAddModal(false);
    alert('챗봇 응답이 추가되었습니다.');
  };

  // 수정
  const handleEdit = (item) => {
    setEditForm({ ...item });
    setEditModal({ isOpen: true, item });
  };

  const handleEditSubmit = () => {
    setData(prev => prev.map(d => d.id === editForm.id ? {
      ...editForm,
      updatedAt: new Date().toISOString().split('T')[0]
    } : d));
    setEditModal({ isOpen: false, item: null });
    alert('챗봇 응답이 수정되었습니다.');
  };

  // 삭제
  const handleDelete = (item) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = () => {
    setData(prev => prev.filter(d => d.id !== deleteModal.item.id));
    setDeleteModal({ isOpen: false, item: null });
    alert('챗봇 응답이 삭제되었습니다.');
  };

  // 폼 컴포넌트
  const FormFields = () => (
    <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">카테고리 <span style={{ color: '#ef4444' }}>*</span></label>
          <select
            className="form-input form-select"
            value={editForm.category || ''}
            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
          >
            {categories.filter(c => c.id !== 'all').map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">트리거 키워드</label>
          <input
            type="text"
            className="form-input"
            placeholder="예: 제주도, 환불, 포인트"
            value={editForm.trigger || ''}
            onChange={(e) => setEditForm({ ...editForm, trigger: e.target.value })}
          />
          <small style={{ color: '#64748b', fontSize: '0.75rem' }}>쉼표로 구분하여 여러 키워드 입력 가능</small>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">제목 <span style={{ color: '#ef4444' }}>*</span></label>
        <input
          type="text"
          className="form-input"
          placeholder="응답 제목을 입력하세요"
          value={editForm.title || ''}
          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">챗봇 메시지 헤더</label>
        <input
          type="text"
          className="form-input"
          placeholder="챗봇이 표시할 제목 (예: 제주도 추천 여행 정보)"
          value={editForm.message || ''}
          onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">응답 내용 <span style={{ color: '#ef4444' }}>*</span></label>
        <textarea
          className="form-input"
          rows={8}
          placeholder="챗봇 응답 내용을 입력하세요&#10;&#10;• 항목1&#10;• 항목2"
          value={editForm.content || ''}
          onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
          style={{ resize: 'vertical', lineHeight: 1.6 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="form-group">
          <label className="form-label">연결 링크 (선택)</label>
          <input
            type="text"
            className="form-input"
            placeholder="/product/tour"
            value={editForm.link || ''}
            onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">링크 텍스트</label>
          <input
            type="text"
            className="form-input"
            placeholder="상품 보러가기"
            value={editForm.linkText || ''}
            onChange={(e) => setEditForm({ ...editForm, linkText: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={editForm.active || false}
            onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
          />
          활성화 (체크하면 챗봇에서 응답이 사용됩니다)
        </label>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">챗봇 관리</h1>
          <p className="page-subtitle">AI 챗봇 응답을 관리합니다</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            <RiAddLine /> 응답 추가
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #4A90D9, #357ABD)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiRobot2Line />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>{totalCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>전체 응답</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiCheckboxCircleLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{activeCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>활성 응답</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiFileListLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{categoryCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>카테고리</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiChatSmile2Line />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>{totalHits.toLocaleString()}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>총 응답 횟수</div>
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 탭 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none',
              background: categoryFilter === cat.id ? 'var(--primary-color)' : '#f1f5f9',
              color: categoryFilter === cat.id ? 'white' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            <cat.icon />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="제목, 키워드, 내용 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 100 }}>카테고리</th>
                <th>제목</th>
                <th style={{ width: 150 }}>트리거 키워드</th>
                <th style={{ width: 90 }}>응답횟수</th>
                <th style={{ width: 100 }}>수정일</th>
                <th style={{ width: 70 }}>상태</th>
                <th style={{ width: 130 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id} style={{ opacity: item.active ? 1 : 0.5 }}>
                  <td>
                    <span
                      className={`badge ${categoryColors[item.category]?.className || 'badge-gray'}`}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td>
                    <div
                      className="font-medium"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handlePreview(item)}
                    >
                      {item.title}
                      {item.link && (
                        <RiExternalLinkLine style={{ marginLeft: 6, color: '#64748b', fontSize: '0.85rem' }} />
                      )}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {item.trigger.split(',').slice(0, 2).map((t, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '2px 8px',
                            background: '#e2e8f0',
                            borderRadius: 4,
                            fontSize: '0.75rem',
                            color: '#475569'
                          }}
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: '0.875rem' }}>
                      <RiMessage2Line /> {item.hits.toLocaleString()}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: '#64748b' }}>{item.updatedAt}</td>
                  <td>
                    <button
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}
                      onClick={() => toggleActive(item.id)}
                    >
                      {item.active ? (
                        <RiToggleFill style={{ fontSize: '1.5rem', color: '#10b981' }} />
                      ) : (
                        <RiToggleLine style={{ fontSize: '1.5rem', color: '#94a3b8' }} />
                      )}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" title="미리보기" onClick={() => handlePreview(item)}>
                        <RiEyeLine />
                      </button>
                      <button className="table-action-btn edit" title="수정" onClick={() => handleEdit(item)}>
                        <RiEditLine />
                      </button>
                      <button className="table-action-btn delete" title="삭제" onClick={() => handleDelete(item)}>
                        <RiDeleteBinLine />
                      </button>
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

      {/* 미리보기 모달 */}
      <Modal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, item: null })}
        title="챗봇 응답 미리보기"
        size="medium"
      >
        {previewModal.item && (
          <div>
            {/* 챗봇 스타일 미리보기 */}
            <div style={{
              background: '#f8fafc',
              borderRadius: 16,
              padding: 20,
              marginBottom: 20
            }}>
              {/* 봇 메시지 */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4A90D9, #357ABD)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  flexShrink: 0
                }}>
                  <RiRobot2Line />
                </div>
                <div style={{
                  background: 'white',
                  borderRadius: '4px 16px 16px 16px',
                  padding: 16,
                  maxWidth: '85%',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 12, color: '#1e293b' }}>
                    {previewModal.item.message || previewModal.item.title}
                  </div>
                  <div style={{
                    background: '#f0f9ff',
                    borderLeft: '4px solid #4A90D9',
                    padding: 12,
                    borderRadius: '0 8px 8px 0',
                    marginBottom: 12
                  }}>
                    <div style={{ whiteSpace: 'pre-line', fontSize: '0.9rem', lineHeight: 1.6, color: '#475569' }}>
                      {previewModal.item.content}
                    </div>
                  </div>
                  {previewModal.item.link && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: '#4A90D9',
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}>
                      {previewModal.item.linkText || previewModal.item.link}
                      <RiArrowRightLine />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 메타 정보 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              padding: 16,
              background: '#f8fafc',
              borderRadius: 8
            }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>카테고리: </span>
                <span className={`badge ${categoryColors[previewModal.item.category]?.className || 'badge-gray'}`}>
                  {previewModal.item.category}
                </span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>상태: </span>
                <span className={`badge ${previewModal.item.active ? 'badge-success' : 'badge-gray'}`}>
                  {previewModal.item.active ? '활성' : '비활성'}
                </span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>트리거: </span>
                <span style={{ fontWeight: 500 }}>{previewModal.item.trigger}</span>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>응답 횟수: </span>
                <span style={{ fontWeight: 500 }}>{previewModal.item.hits.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 추가 모달 */}
      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        title="챗봇 응답 추가"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setAddModal(false)}>취소</button>
            <button
              className="btn btn-primary"
              onClick={handleAddSubmit}
              disabled={!editForm.title || !editForm.content}
            >
              등록
            </button>
          </>
        }
      >
        <FormFields />
      </Modal>

      {/* 수정 모달 */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, item: null })}
        title="챗봇 응답 수정"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setEditModal({ isOpen: false, item: null })}>취소</button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>저장</button>
          </>
        }
      >
        {editModal.item && <FormFields />}
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDeleteConfirm}
        title="챗봇 응답 삭제"
        message={`"${deleteModal.item?.title}" 응답을 삭제하시겠습니까?\n\n삭제된 응답은 복구할 수 없습니다.`}
        confirmText="삭제"
        type="danger"
      />
    </div>
  );
}

export default Chatbot;
