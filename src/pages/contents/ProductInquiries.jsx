import { useState } from 'react';
import {
  RiSearchLine,
  RiFilterLine,
  RiQuestionLine,
  RiMessage2Line,
  RiTimeLine,
  RiUserLine,
  RiBuilding2Line,
  RiShoppingBagLine,
  RiEyeLine,
  RiDeleteBinLine,
  RiCheckLine,
  RiCloseLine,
  RiAlertLine,
  RiCalendarLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

// 카테고리
const categories = [
  { id: 'all', label: '전체' },
  { id: 'product', label: '상품문의' },
  { id: 'reservation', label: '예약문의' },
  { id: 'schedule', label: '일정문의' },
  { id: 'price', label: '가격문의' },
  { id: 'other', label: '기타' }
];

// 상태
const statuses = [
  { id: 'all', label: '전체 상태' },
  { id: 'pending', label: '답변대기' },
  { id: 'answered', label: '답변완료' }
];

// 더미 데이터
const inquiriesData = [
  {
    id: 1,
    category: 'product',
    productName: '제주 스노클링 체험',
    productType: 'tour',
    question: '초보자도 참여 가능한가요? 수영을 못해도 괜찮을까요?',
    memberId: 'travel_lover',
    memberName: '김여행',
    businessId: 'jeju_diving',
    businessName: '제주다이빙센터',
    status: 'answered',
    answer: '네, 초보자도 충분히 참여 가능합니다! 구명조끼를 착용하고 전문 강사가 1:1로 가이드해 드립니다. 수영을 못하셔도 안전하게 즐기실 수 있어요.',
    createdAt: '2024-12-18 10:30:00',
    answeredAt: '2024-12-18 11:45:00',
    isSecret: false
  },
  {
    id: 2,
    category: 'reservation',
    productName: '부산 해운대 호텔',
    productType: 'accommodation',
    question: '체크인 시간 전에 도착하면 짐을 맡길 수 있나요?',
    memberId: 'happy_traveler',
    memberName: '이모행',
    businessId: 'haeundae_hotel',
    businessName: '해운대그랜드호텔',
    status: 'answered',
    answer: '물론입니다. 체크인 전 도착 시 프론트에서 짐을 보관해 드립니다. 로비에서 편하게 대기하셔도 됩니다.',
    createdAt: '2024-12-18 09:15:00',
    answeredAt: '2024-12-18 10:00:00',
    isSecret: false
  },
  {
    id: 3,
    category: 'schedule',
    productName: '경주 역사 투어',
    productType: 'tour',
    question: '투어 시간이 어느 정도 소요되나요? 점심 포함인가요?',
    memberId: 'user123',
    memberName: '박관광',
    businessId: 'gyeongju_tour',
    businessName: '경주문화투어',
    status: 'pending',
    answer: null,
    createdAt: '2024-12-18 14:20:00',
    answeredAt: null,
    isSecret: false
  },
  {
    id: 4,
    category: 'price',
    productName: '강릉 서핑 체험',
    productType: 'tour',
    question: '2인 예약 시 할인이 있나요?',
    memberId: 'surf_fan',
    memberName: '최서퍼',
    businessId: 'gangneung_surf',
    businessName: '강릉서핑스쿨',
    status: 'pending',
    answer: null,
    createdAt: '2024-12-18 13:45:00',
    answeredAt: null,
    isSecret: true
  },
  {
    id: 5,
    category: 'product',
    productName: '여수 요트 투어',
    productType: 'tour',
    question: '멀미약은 따로 준비해야 하나요?',
    memberId: 'sea_lover',
    memberName: '정바다',
    businessId: 'yeosu_yacht',
    businessName: '여수요트클럽',
    status: 'answered',
    answer: '멀미가 심하신 분들은 미리 멀미약을 복용하시는 것을 권장드립니다. 저희가 따로 제공하지는 않습니다.',
    createdAt: '2024-12-17 16:30:00',
    answeredAt: '2024-12-17 17:20:00',
    isSecret: false
  },
  {
    id: 6,
    category: 'other',
    productName: '제주 신라 호텔',
    productType: 'accommodation',
    question: '반려동물 동반 가능한 객실이 있나요?',
    memberId: 'pet_parent',
    memberName: '한반려',
    businessId: 'shilla_jeju',
    businessName: '제주신라호텔',
    status: 'answered',
    answer: '죄송합니다. 저희 호텔은 반려동물 동반이 불가합니다. 인근 펫호텔 이용을 안내해 드릴 수 있습니다.',
    createdAt: '2024-12-17 14:00:00',
    answeredAt: '2024-12-17 15:30:00',
    isSecret: false
  }
];

const categoryLabels = {
  product: '상품문의',
  reservation: '예약문의',
  schedule: '일정문의',
  price: '가격문의',
  other: '기타'
};

const productTypeLabels = {
  tour: '투어/체험',
  accommodation: '숙박',
  flight: '항공'
};

function ProductInquiries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [dateRange, setDateRange] = useState({ start: '2024-12-12', end: '2024-12-18' });

  const [detailModal, setDetailModal] = useState({ isOpen: false, inquiry: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, inquiry: null });

  const periods = [
    { id: 'today', label: '오늘' },
    { id: 'week', label: '이번 주' },
    { id: 'month', label: '이번 달' },
    { id: '3months', label: '최근 3개월' }
  ];

  const filteredData = inquiriesData.filter(item => {
    const matchesSearch = item.productName.includes(searchTerm) ||
                          item.question.includes(searchTerm) ||
                          item.memberName.includes(searchTerm) ||
                          item.businessName.includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalCount = inquiriesData.length;
  const pendingCount = inquiriesData.filter(i => i.status === 'pending').length;
  const answeredCount = inquiriesData.filter(i => i.status === 'answered').length;
  const todayCount = inquiriesData.filter(i => i.createdAt.startsWith('2024-12-18')).length;

  const handleViewDetail = (inquiry) => {
    setDetailModal({ isOpen: true, inquiry });
  };

  const handleDelete = (inquiry) => {
    setDeleteModal({ isOpen: true, inquiry });
  };

  const confirmDelete = () => {
    alert(`문의가 삭제되었습니다. (ID: ${deleteModal.inquiry.id})`);
    setDeleteModal({ isOpen: false, inquiry: null });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">상품 문의 관리</h1>
          <p className="page-subtitle">일반회원이 기업회원(상품)에게 남긴 문의와 답변을 관리합니다</p>
        </div>
      </div>

      {/* 기간 선택 */}
      <div className="card mb-3">
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {periods.map(period => (
                <button
                  key={period.id}
                  className={`btn ${selectedPeriod === period.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedPeriod(period.id)}
                  style={{ padding: '8px 16px' }}
                >
                  {period.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiCalendarLine />
              <input
                type="date"
                className="form-input"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                style={{ padding: '8px 12px' }}
              />
              <span>~</span>
              <input
                type="date"
                className="form-input"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                style={{ padding: '8px 12px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid mb-3">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)', color: 'white' }}>
            <RiQuestionLine />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalCount}</div>
            <div className="stat-label">전체 문의</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)', color: 'white' }}>
            <RiTimeLine />
          </div>
          <div className="stat-content">
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-label">답변 대기</div>
            {pendingCount > 0 && <div className="stat-change negative">처리 필요</div>}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)', color: 'white' }}>
            <RiCheckLine />
          </div>
          <div className="stat-content">
            <div className="stat-value">{answeredCount}</div>
            <div className="stat-label">답변 완료</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)', color: 'white' }}>
            <RiMessage2Line />
          </div>
          <div className="stat-content">
            <div className="stat-value">{todayCount}</div>
            <div className="stat-label">오늘 문의</div>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 탭 */}
      <div className="card mb-3">
        <div className="card-body" style={{ padding: '12px 20px' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => {
              const count = cat.id === 'all' ? totalCount : inquiriesData.filter(i => i.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: 20,
                    background: categoryFilter === cat.id ? 'var(--primary-color)' : '#F3F4F6',
                    color: categoryFilter === cat.id ? 'white' : '#6B7280',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.label}
                  <span style={{
                    marginLeft: 6,
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: categoryFilter === cat.id ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
                    fontSize: 12
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 문의 목록 */}
      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="상품명, 문의내용, 회원명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <RiFilterLine />
            <select
              className="form-input form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              {statuses.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 100 }}>카테고리</th>
                <th>상품</th>
                <th>문의내용</th>
                <th style={{ width: 100 }}>회원</th>
                <th style={{ width: 120 }}>기업</th>
                <th style={{ width: 90 }}>상태</th>
                <th style={{ width: 140 }}>등록일</th>
                <th style={{ width: 80 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(inquiry => (
                <tr key={inquiry.id}>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      background: '#E0E7FF',
                      color: '#4F46E5',
                      fontSize: 12,
                      fontWeight: 500
                    }}>
                      {categoryLabels[inquiry.category]}
                    </span>
                  </td>
                  <td>
                    <div>
                      <div className="font-medium">{inquiry.productName}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {productTypeLabels[inquiry.productType]}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      {inquiry.isSecret && <RiAlertLine style={{ color: '#D97706', flexShrink: 0 }} title="비밀글" />}
                      {inquiry.question}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <RiUserLine style={{ color: 'var(--text-muted)' }} />
                      <span>{inquiry.memberName}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <RiBuilding2Line style={{ color: 'var(--primary-color)' }} />
                      <span style={{ fontSize: 13 }}>{inquiry.businessName}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${inquiry.status === 'answered' ? 'badge-success' : 'badge-warning'}`}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {inquiry.status === 'answered' ? '답변완료' : '답변대기'}
                    </span>
                  </td>
                  <td className="text-secondary" style={{ fontSize: 13 }}>
                    {inquiry.createdAt.split(' ')[0]}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="table-action-btn"
                        onClick={() => handleViewDetail(inquiry)}
                        title="상세보기"
                      >
                        <RiEyeLine />
                      </button>
                      <button
                        className="table-action-btn"
                        onClick={() => handleDelete(inquiry)}
                        title="삭제"
                      >
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
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <button className="pagination-btn">&gt;</button>
        </div>
      </div>

      {/* 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, inquiry: null })}
        title="문의 상세"
        size="large"
      >
        {detailModal.inquiry && (() => {
          const inquiry = detailModal.inquiry;
          return (
            <div>
              {/* 상품 정보 */}
              <div style={{
                padding: 16,
                background: '#F8FAFC',
                borderRadius: 8,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <RiShoppingBagLine size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{inquiry.productName}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {productTypeLabels[inquiry.productType]} | {inquiry.businessName}
                  </div>
                </div>
                <span style={{
                  marginLeft: 'auto',
                  padding: '4px 12px',
                  borderRadius: 4,
                  background: inquiry.status === 'answered' ? '#D1FAE5' : '#FEF3C7',
                  color: inquiry.status === 'answered' ? '#059669' : '#D97706',
                  fontSize: 13,
                  fontWeight: 500
                }}>
                  {inquiry.status === 'answered' ? '답변완료' : '답변대기'}
                </span>
              </div>

              {/* 문의 정보 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                    <RiUserLine style={{ marginRight: 4 }} />문의자
                  </div>
                  <div style={{ fontWeight: 500 }}>{inquiry.memberName}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>@{inquiry.memberId}</div>
                </div>
                <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                    <RiBuilding2Line style={{ marginRight: 4 }} />판매자
                  </div>
                  <div style={{ fontWeight: 500 }}>{inquiry.businessName}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>@{inquiry.businessId}</div>
                </div>
              </div>

              {/* 문의 내용 */}
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12
                }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    background: '#E0E7FF',
                    color: '#4F46E5',
                    fontSize: 12,
                    fontWeight: 500
                  }}>
                    {categoryLabels[inquiry.category]}
                  </span>
                  {inquiry.isSecret && (
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      background: '#FEF3C7',
                      color: '#D97706',
                      fontSize: 12,
                      fontWeight: 500
                    }}>
                      <RiAlertLine style={{ marginRight: 4 }} />비밀글
                    </span>
                  )}
                  <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>
                    {inquiry.createdAt}
                  </span>
                </div>
                <div style={{
                  padding: 16,
                  background: '#EEF2FF',
                  borderRadius: 8,
                  borderLeft: '4px solid #6366F1'
                }}>
                  <div style={{ fontWeight: 500, marginBottom: 8, color: '#4F46E5' }}>Q. 문의</div>
                  <p style={{ margin: 0, lineHeight: 1.6 }}>{inquiry.question}</p>
                </div>
              </div>

              {/* 답변 */}
              {inquiry.answer ? (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>답변</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      {inquiry.answeredAt}
                    </span>
                  </div>
                  <div style={{
                    padding: 16,
                    background: '#F0FDF4',
                    borderRadius: 8,
                    borderLeft: '4px solid #10B981'
                  }}>
                    <div style={{ fontWeight: 500, marginBottom: 8, color: '#059669' }}>A. 답변</div>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{inquiry.answer}</p>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: 24,
                  background: '#FEF3C7',
                  borderRadius: 8,
                  textAlign: 'center',
                  color: '#92400E'
                }}>
                  <RiTimeLine size={32} style={{ marginBottom: 8 }} />
                  <div style={{ fontWeight: 500 }}>아직 답변이 등록되지 않았습니다</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>기업회원의 답변을 기다리고 있습니다</div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, inquiry: null })}
        onConfirm={confirmDelete}
        title="문의 삭제"
        message="이 문의를 삭제하시겠습니까? 답변도 함께 삭제됩니다."
        confirmText="삭제"
        type="danger"
      />
    </div>
  );
}

export default ProductInquiries;
