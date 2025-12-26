import { useState } from 'react';
import {
  RiSearchLine,
  RiAddLine,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiCalendarLine,
  RiUserLine,
  RiQuestionLine,
  RiFileListLine,
  RiCheckboxCircleLine,
  RiFilterLine,
  RiCalendar2Line,
  RiWallet3Line,
  RiCoinLine,
  RiCustomerService2Line
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

// 카테고리 정의 (사용자 페이지와 동일)
const categories = [
  { id: 'all', label: '전체', icon: RiFileListLine },
  { id: '회원/계정', label: '회원/계정', icon: RiUserLine },
  { id: '일정/예약', label: '일정/예약', icon: RiCalendar2Line },
  { id: '결제/환불', label: '결제/환불', icon: RiWallet3Line },
  { id: '포인트', label: '포인트', icon: RiCoinLine },
  { id: '서비스 이용', label: '서비스 이용', icon: RiCustomerService2Line }
];

const categoryColors = {
  '회원/계정': { className: 'badge-info', color: '#0dcaf0' },
  '일정/예약': { className: 'badge-success', color: '#10b981' },
  '결제/환불': { className: 'badge-warning', color: '#f59e0b' },
  '포인트': { className: 'badge-primary', color: '#4A90D9' },
  '서비스 이용': { className: 'badge-secondary', color: '#6c757d' }
};

// 더미 데이터 (사용자 페이지와 동일한 구조)
const initialFaqData = [
  {
    id: 1,
    question: '회원가입은 어떻게 하나요?',
    answer: '모행 회원가입은 아래 방법으로 진행할 수 있습니다.\n\n1. 홈페이지 우측 상단 \'회원가입\' 버튼을 클릭합니다.\n2. 이메일 또는 소셜 계정(구글, 네이버, 카카오)으로 가입할 수 있습니다.\n3. 필수 정보를 입력하고 이용약관에 동의하면 가입이 완료됩니다.\n\n기업회원의 경우 사업자등록번호 인증이 필요합니다.',
    category: '회원/계정',
    views: 1520,
    order: 1,
    isActive: true,
    createdAt: '2024-12-10'
  },
  {
    id: 2,
    question: '비밀번호를 잊어버렸어요.',
    answer: '비밀번호 분실 시 아래 방법으로 재설정할 수 있습니다.\n\n1. 로그인 페이지에서 \'비밀번호 찾기\'를 클릭합니다.\n2. 가입 시 사용한 이메일 주소를 입력합니다.\n3. 이메일로 전송된 링크를 통해 새 비밀번호를 설정합니다.\n\n소셜 계정으로 가입한 경우, 해당 소셜 서비스에서 비밀번호를 관리해주세요.',
    category: '회원/계정',
    views: 980,
    order: 2,
    isActive: true,
    createdAt: '2024-12-10'
  },
  {
    id: 3,
    question: 'AI 일정 추천은 어떻게 이용하나요?',
    answer: 'AI 일정 추천 서비스 이용 방법입니다.\n\n1. 메인 페이지 또는 \'일정 계획\' 메뉴에서 여행 정보를 입력합니다.\n2. 여행 스타일, 선호도 등 몇 가지 질문에 답변합니다.\n3. AI가 맞춤형 여행 일정을 추천해드립니다.\n4. 추천된 일정을 바로 사용하거나, 원하는 대로 수정할 수 있습니다.\n\n추천 일정은 내 일정에 저장하여 언제든 확인할 수 있습니다.',
    category: '일정/예약',
    views: 2150,
    order: 3,
    isActive: true,
    createdAt: '2024-12-08'
  },
  {
    id: 4,
    question: '저장한 일정을 수정하거나 삭제할 수 있나요?',
    answer: '네, 저장한 일정은 언제든 수정 및 삭제가 가능합니다.\n\n1. 마이페이지 > \'내 일정\' 메뉴로 이동합니다.\n2. 수정하려는 일정의 \'편집\' 버튼을 클릭합니다.\n3. 장소 추가/삭제, 일자 변경 등 원하는 대로 수정합니다.\n4. 수정 완료 후 \'저장\' 버튼을 클릭하면 변경사항이 적용됩니다.\n\n삭제된 일정은 복구할 수 없으니 신중하게 결정해주세요.',
    category: '일정/예약',
    views: 1890,
    order: 4,
    isActive: true,
    createdAt: '2024-12-08'
  },
  {
    id: 5,
    question: '결제 방법은 어떤 것이 있나요?',
    answer: '모행에서 지원하는 결제 방법입니다.\n\n• 신용/체크카드: 국내 발행 카드 모두 사용 가능\n• 계좌이체: 실시간 계좌이체 지원\n• 간편결제: 카카오페이, 네이버페이, 토스페이 등\n• 포인트: 보유 포인트로 결제 가능 (1,000P 이상)\n\n결제 수단은 상품에 따라 일부 제한될 수 있습니다.',
    category: '결제/환불',
    views: 1456,
    order: 5,
    isActive: true,
    createdAt: '2024-12-05'
  },
  {
    id: 6,
    question: '예약을 취소하고 환불받고 싶어요.',
    answer: '예약 취소 및 환불 정책입니다.\n\n일반 취소/환불 규정:\n• 이용일 7일 전: 100% 환불\n• 이용일 3~6일 전: 70% 환불\n• 이용일 1~2일 전: 50% 환불\n• 이용일 당일: 환불 불가\n\n취소는 마이페이지 > \'결제 내역\'에서 가능하며, 환불은 결제 수단에 따라 3~7 영업일 내 처리됩니다.\n상품별로 환불 정책이 다를 수 있으니, 예약 전 확인해주세요.',
    category: '결제/환불',
    views: 2340,
    order: 6,
    isActive: true,
    createdAt: '2024-12-05'
  },
  {
    id: 7,
    question: '포인트는 어떻게 적립되나요?',
    answer: '포인트 적립 방법입니다.\n\n• 상품 결제: 결제 금액의 1~3% 적립\n• 후기 작성: 500P 적립 (사진 포함 시 추가 적립)\n• 회원가입: 5,000P 적립\n• 첫 예약: 2,000P 추가 적립\n• 이벤트 참여: 이벤트별 상이\n\n적립된 포인트는 이용 완료 후 자동으로 적립됩니다.',
    category: '포인트',
    views: 756,
    order: 7,
    isActive: true,
    createdAt: '2024-12-01'
  },
  {
    id: 8,
    question: '포인트 유효기간이 있나요?',
    answer: '네, 포인트는 적립일로부터 1년간 유효합니다.\n\n• 유효기간이 지난 포인트는 자동 소멸됩니다.\n• 마이페이지 > \'포인트 내역\'에서 소멸 예정 포인트를 확인할 수 있습니다.\n• 소멸 30일 전에 알림을 보내드립니다.\n\n포인트는 1,000P 이상 보유 시 결제에 사용할 수 있습니다.',
    category: '포인트',
    views: 534,
    order: 8,
    isActive: true,
    createdAt: '2024-12-01'
  },
  {
    id: 9,
    question: '앱으로도 이용할 수 있나요?',
    answer: '현재 모행은 모바일 웹으로 서비스되고 있으며, 모바일 앱은 준비 중입니다.\n\n모바일 브라우저에서 mohaeng.com에 접속하시면 모바일에 최적화된 화면으로 이용하실 수 있습니다.\n\n앱 출시 시 공지사항과 이메일을 통해 안내드리겠습니다.',
    category: '서비스 이용',
    views: 678,
    order: 9,
    isActive: true,
    createdAt: '2024-11-28'
  },
  {
    id: 10,
    question: '챗봇은 24시간 이용 가능한가요?',
    answer: '네, AI 챗봇은 24시간 365일 이용 가능합니다.\n\n• 여행지 추천, 일정 관련 질문에 답변해드립니다.\n• 예약, 결제, 환불 등 복잡한 문의는 1:1 문의를 이용해주세요.\n• 1:1 문의는 평일 09:00~18:00에 답변드립니다.\n\n화면 우측 하단의 챗봇 아이콘을 클릭하여 이용해보세요.',
    category: '서비스 이용',
    views: 423,
    order: 10,
    isActive: true,
    createdAt: '2024-11-28'
  }
];

function Faq() {
  const [faqData, setFaqData] = useState(initialFaqData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, faq: null });
  const [editModal, setEditModal] = useState({ isOpen: false, faq: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, faq: null });
  const [addModal, setAddModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  const filteredFaq = faqData
    .filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'active' && faq.isActive) ||
                           (statusFilter === 'inactive' && !faq.isActive);
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => a.order - b.order);

  // 통계 계산
  const totalCount = faqData.length;
  const activeCount = faqData.filter(f => f.isActive).length;
  const totalViews = faqData.reduce((sum, f) => sum + f.views, 0);
  const categoryCount = [...new Set(faqData.map(f => f.category))].length;

  // 상세보기
  const handleViewDetail = (faq) => {
    setDetailModal({ isOpen: true, faq });
  };

  // 추가
  const handleAdd = () => {
    const maxOrder = Math.max(...faqData.map(f => f.order), 0);
    setEditForm({ question: '', answer: '', category: '회원/계정', isActive: true, order: maxOrder + 1 });
    setAddModal(true);
  };

  const handleAddSubmit = () => {
    if (!editForm.question || !editForm.answer) {
      alert('질문과 답변을 모두 입력해주세요.');
      return;
    }
    const newFaq = {
      ...editForm,
      id: Date.now(),
      views: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFaqData(prev => [...prev, newFaq]);
    setAddModal(false);
    alert('FAQ가 등록되었습니다.');
  };

  // 수정
  const handleEdit = (faq) => {
    setEditForm({ ...faq });
    setEditModal({ isOpen: true, faq });
  };

  const handleEditSubmit = () => {
    setFaqData(prev => prev.map(f => f.id === editForm.id ? editForm : f));
    setEditModal({ isOpen: false, faq: null });
    alert('FAQ가 수정되었습니다.');
  };

  // 삭제
  const handleDelete = (faq) => {
    setDeleteModal({ isOpen: true, faq });
  };

  const handleDeleteConfirm = () => {
    setFaqData(prev => prev.filter(f => f.id !== deleteModal.faq.id));
    setDeleteModal({ isOpen: false, faq: null });
    alert('FAQ가 삭제되었습니다.');
  };

  // 순서 변경
  const handleMoveUp = (faq) => {
    const currentIndex = filteredFaq.findIndex(f => f.id === faq.id);
    if (currentIndex > 0) {
      const prevFaq = filteredFaq[currentIndex - 1];
      setFaqData(prev => prev.map(f => {
        if (f.id === faq.id) return { ...f, order: prevFaq.order };
        if (f.id === prevFaq.id) return { ...f, order: faq.order };
        return f;
      }));
    }
  };

  const handleMoveDown = (faq) => {
    const currentIndex = filteredFaq.findIndex(f => f.id === faq.id);
    if (currentIndex < filteredFaq.length - 1) {
      const nextFaq = filteredFaq[currentIndex + 1];
      setFaqData(prev => prev.map(f => {
        if (f.id === faq.id) return { ...f, order: nextFaq.order };
        if (f.id === nextFaq.id) return { ...f, order: faq.order };
        return f;
      }));
    }
  };

  // 활성화 토글
  const handleToggleActive = (faq) => {
    setFaqData(prev => prev.map(f => f.id === faq.id ? { ...f, isActive: !f.isActive } : f));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">자주 묻는 질문 관리</h1>
          <p className="page-subtitle">
            FAQ를 작성하고 관리합니다
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            <RiAddLine /> FAQ 작성
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #4A90D9, #357ABD)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiQuestionLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>{totalCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>전체 FAQ</div>
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
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>활성 FAQ</div>
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
              <RiEyeLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>{totalViews.toLocaleString()}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>총 조회수</div>
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 탭 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none',
              background: selectedCategory === cat.id ? 'var(--primary-color)' : '#f1f5f9',
              color: selectedCategory === cat.id ? 'white' : '#64748b',
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
              placeholder="질문, 답변 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group" style={{ display: 'flex', gap: 8 }}>
            <RiFilterLine />
            <select
              className="form-input form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>순서</th>
                <th style={{ width: 100 }}>카테고리</th>
                <th>질문</th>
                <th style={{ width: 80 }}>조회수</th>
                <th style={{ width: 100 }}>작성일</th>
                <th style={{ width: 70 }}>상태</th>
                <th style={{ width: 110 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaq.map((faq, index) => (
                <tr key={faq.id} style={{ opacity: faq.isActive ? 1 : 0.5 }}>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className="table-action-btn"
                        onClick={() => handleMoveUp(faq)}
                        disabled={index === 0}
                        title="위로"
                      >
                        <RiArrowUpLine />
                      </button>
                      <button
                        className="table-action-btn"
                        onClick={() => handleMoveDown(faq)}
                        disabled={index === filteredFaq.length - 1}
                        title="아래로"
                      >
                        <RiArrowDownLine />
                      </button>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${categoryColors[faq.category]?.className || 'badge-gray'}`}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {faq.category}
                    </span>
                  </td>
                  <td>
                    <div
                      className="font-medium"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleViewDetail(faq)}
                    >
                      {faq.question}
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: '0.875rem' }}>
                      <RiEyeLine /> {faq.views.toLocaleString()}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: '#64748b' }}>{faq.createdAt}</td>
                  <td>
                    <button
                      className={`badge ${faq.isActive ? 'badge-success' : 'badge-gray'}`}
                      onClick={() => handleToggleActive(faq)}
                      style={{ cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
                    >
                      {faq.isActive ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" title="보기" onClick={() => handleViewDetail(faq)}>
                        <RiEyeLine />
                      </button>
                      <button className="table-action-btn edit" title="수정" onClick={() => handleEdit(faq)}>
                        <RiEditLine />
                      </button>
                      <button className="table-action-btn delete" title="삭제" onClick={() => handleDelete(faq)}>
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

      {/* 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, faq: null })}
        title="FAQ 상세"
        size="large"
      >
        {detailModal.faq && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* 카테고리 뱃지 & 메타 정보 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span
                className={`badge ${categoryColors[detailModal.faq.category]?.className || 'badge-gray'}`}
                style={{ padding: '6px 12px', fontSize: '0.875rem' }}
              >
                {detailModal.faq.category}
              </span>
              <span className={`badge ${detailModal.faq.isActive ? 'badge-success' : 'badge-gray'}`}>
                {detailModal.faq.isActive ? '활성' : '비활성'}
              </span>
            </div>

            {/* 메타 정보 */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, padding: '12px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: '0.875rem' }}>
                <RiCalendarLine /> {detailModal.faq.createdAt}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: '0.875rem' }}>
                <RiEyeLine /> {detailModal.faq.views.toLocaleString()}
              </span>
            </div>

            {/* 질문 */}
            <div style={{ marginBottom: 16 }}>
              <h4 style={{
                marginBottom: 8,
                color: 'var(--primary-color)',
                fontSize: '1.1rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8
              }}>
                <span style={{
                  background: 'var(--primary-color)',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: '0.875rem',
                  fontWeight: 700
                }}>Q</span>
                {detailModal.faq.question}
              </h4>
            </div>

            {/* 답변 */}
            <div style={{
              padding: 20,
              background: '#f8fafc',
              borderRadius: 8,
              lineHeight: 1.8,
              whiteSpace: 'pre-line'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  flexShrink: 0
                }}>A</span>
                <div style={{ fontSize: '0.95rem' }}>{detailModal.faq.answer}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 추가 모달 */}
      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        title="FAQ 작성"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setAddModal(false)}>취소</button>
            <button
              className="btn btn-primary"
              onClick={handleAddSubmit}
              disabled={!editForm.question || !editForm.answer}
            >
              등록
            </button>
          </>
        }
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <div className="form-group">
            <label className="form-label">카테고리</label>
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
            <label className="form-label">질문 <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="자주 묻는 질문을 입력하세요"
              value={editForm.question || ''}
              onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">답변 <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea
              className="form-input"
              rows={8}
              placeholder="답변 내용을 입력하세요"
              value={editForm.answer || ''}
              onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={editForm.isActive || false}
                onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
              />
              활성화 (체크하면 사용자에게 표시됩니다)
            </label>
          </div>
        </div>
      </Modal>

      {/* 수정 모달 */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, faq: null })}
        title="FAQ 수정"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setEditModal({ isOpen: false, faq: null })}>취소</button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>저장</button>
          </>
        }
      >
        {editModal.faq && (
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <div className="form-group">
              <label className="form-label">카테고리</label>
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
              <label className="form-label">질문 <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                className="form-input"
                value={editForm.question || ''}
                onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">답변 <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea
                className="form-input"
                rows={8}
                value={editForm.answer || ''}
                onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editForm.isActive || false}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                />
                활성화 (체크하면 사용자에게 표시됩니다)
              </label>
            </div>
          </div>
        )}
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, faq: null })}
        onConfirm={handleDeleteConfirm}
        title="FAQ 삭제"
        message={`"${deleteModal.faq?.question}" FAQ를 삭제하시겠습니까?\n\n삭제된 FAQ는 복구할 수 없습니다.`}
        confirmText="삭제"
        type="danger"
      />
    </div>
  );
}

export default Faq;
