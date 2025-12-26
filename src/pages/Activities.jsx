import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RiSearchLine,
  RiFilterLine,
  RiUserAddLine,
  RiWalletLine,
  RiQuestionLine,
  RiAlertLine,
  RiRefundLine,
  RiShoppingBagLine,
  RiCheckLine,
  RiCloseLine,
  RiUserLine,
  RiTimeLine,
  RiCalendarLine,
  RiEyeLine
} from 'react-icons/ri';
import { Modal } from '../components/common/Modal';

// 더미 활동 데이터
const initialActivitiesData = [
  { id: 1, type: 'member', action: '회원가입', title: '신규 회원 가입', content: '김여행님이 일반회원으로 가입했습니다.', user: '김여행', targetId: 'USR001', time: '2024-12-18 10:30:25', isRead: false },
  { id: 2, type: 'payment', action: '결제', title: '상품 결제 완료', content: '이모행님이 제주 스노클링 체험을 결제했습니다.', user: '이모행', amount: 85000, targetId: 'PAY001', time: '2024-12-18 10:18:42', isRead: false },
  { id: 3, type: 'inquiry', action: '문의', title: '1:1 문의 등록', content: '박관광님이 환불 관련 문의를 등록했습니다.', user: '박관광', targetId: 'INQ001', time: '2024-12-18 10:05:18', isRead: false },
  { id: 4, type: 'report', action: '신고', title: '게시글 신고 접수', content: '여행톡 게시글에 대한 신고가 접수되었습니다.', reporter: '최투어', targetId: 'RPT001', time: '2024-12-18 09:52:33', isRead: true },
  { id: 5, type: 'refund', action: '환불', title: '환불 요청', content: '최투어님이 오사카 항공권 환불을 요청했습니다.', user: '최투어', amount: 320000, targetId: 'REF001', time: '2024-12-18 09:30:15', isRead: true },
  { id: 6, type: 'product', action: '상품등록', title: '신규 상품 등록', content: '(주)투어코리아가 새 투어 상품을 등록했습니다.', company: '(주)투어코리아', targetId: 'PRD001', time: '2024-12-18 09:15:08', isRead: true },
  { id: 7, type: 'member', action: '기업가입', title: '기업회원 가입 요청', content: '스카이트래블이 기업회원 가입을 신청했습니다.', company: '스카이트래블', targetId: 'BIZ001', time: '2024-12-18 08:45:22', isRead: true },
  { id: 8, type: 'settlement', action: '정산', title: '정산 완료', content: '호텔파라다이스 11월 정산이 완료되었습니다.', company: '호텔파라다이스', amount: 13680000, targetId: 'SET001', time: '2024-12-17 18:30:00', isRead: true },
  { id: 9, type: 'payment', action: '결제', title: '상품 결제 완료', content: '정휴가님이 방콕 5성급 호텔을 결제했습니다.', user: '정휴가', amount: 220000, targetId: 'PAY002', time: '2024-12-17 16:22:18', isRead: true },
  { id: 10, type: 'inquiry', action: '문의답변', title: '문의 답변 완료', content: '김여행님의 예약 관련 문의에 답변이 등록되었습니다.', user: '김여행', targetId: 'INQ002', time: '2024-12-17 15:45:33', isRead: true },
  { id: 11, type: 'report', action: '신고처리', title: '신고 처리 완료', content: '여행기록 게시글 신고가 처리되었습니다.', targetId: 'RPT002', time: '2024-12-17 14:30:25', isRead: true },
  { id: 12, type: 'refund', action: '환불완료', title: '환불 처리 완료', content: '이모행님의 환불 요청이 처리되었습니다.', user: '이모행', amount: 288000, targetId: 'REF002', time: '2024-12-17 13:15:42', isRead: true }
];

const typeIcons = {
  member: RiUserAddLine,
  payment: RiWalletLine,
  inquiry: RiQuestionLine,
  report: RiAlertLine,
  refund: RiRefundLine,
  product: RiShoppingBagLine,
  settlement: RiWalletLine
};

const typeColors = {
  member: { bg: '#DBEAFE', color: '#2563EB' },
  payment: { bg: '#D1FAE5', color: '#059669' },
  inquiry: { bg: '#FEF3C7', color: '#D97706' },
  report: { bg: '#FEE2E2', color: '#DC2626' },
  refund: { bg: '#FCE7F3', color: '#DB2777' },
  product: { bg: '#E0E7FF', color: '#4F46E5' },
  settlement: { bg: '#D1FAE5', color: '#059669' }
};

const typeLabels = {
  member: '회원',
  payment: '결제',
  inquiry: '문의',
  report: '신고',
  refund: '환불',
  product: '상품',
  settlement: '정산'
};

function Activities() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState(initialActivitiesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, activity: null });

  const filteredData = activities.filter(a => {
    const matchesSearch = a.title.includes(searchTerm) || a.content.includes(searchTerm);
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    // 날짜 필터는 실제 구현 시 날짜 비교 로직 추가
    return matchesSearch && matchesType;
  });

  const unreadCount = activities.filter(a => !a.isRead).length;

  // 읽음 처리
  const markAsRead = (id) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  // 모두 읽음
  const markAllAsRead = () => {
    setActivities(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  // 상세보기
  const handleViewDetail = (activity) => {
    markAsRead(activity.id);
    setDetailModal({ isOpen: true, activity });
  };

  // 관련 페이지로 이동
  const navigateToTarget = (activity) => {
    const routes = {
      member: '/members/general',
      payment: '/transactions/payments',
      inquiry: '/support/inquiries',
      report: '/support/reports',
      refund: '/transactions/refunds',
      product: '/contents/products',
      settlement: '/transactions/settlements'
    };
    navigate(routes[activity.type] || '/');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">전체 활동</h1>
          <p className="page-subtitle">
            총 {filteredData.length}개의 활동 기록
            {unreadCount > 0 && <span className="text-primary"> (읽지 않음 {unreadCount}개)</span>}
          </p>
        </div>
        <div className="page-header-actions">
          {unreadCount > 0 && (
            <button className="btn btn-secondary" onClick={markAllAsRead}>
              <RiCheckLine /> 모두 읽음
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="활동 내용 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <RiFilterLine />
            <select
              className="form-input form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 유형</option>
              <option value="member">회원</option>
              <option value="payment">결제</option>
              <option value="inquiry">문의</option>
              <option value="report">신고</option>
              <option value="refund">환불</option>
              <option value="product">상품</option>
              <option value="settlement">정산</option>
            </select>
            <select
              className="form-input form-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 기간</option>
              <option value="today">오늘</option>
              <option value="week">이번 주</option>
              <option value="month">이번 달</option>
            </select>
          </div>
        </div>

        <div className="activity-list" style={{ padding: '16px 0' }}>
          {filteredData.map(activity => {
            const IconComponent = typeIcons[activity.type] || RiTimeLine;
            const colors = typeColors[activity.type] || { bg: '#F3F4F6', color: '#6B7280' };
            return (
              <div
                key={activity.id}
                className={`activity-item ${!activity.isRead ? 'unread' : ''}`}
                style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid var(--border-color)',
                  background: !activity.isRead ? 'var(--bg-color)' : 'transparent',
                  cursor: 'pointer'
                }}
                onClick={() => handleViewDetail(activity)}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: colors.bg,
                    color: colors.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <IconComponent size={20} />
                </div>
                <div style={{ flex: 1, marginLeft: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="badge" style={{ background: colors.bg, color: colors.color }}>
                      {typeLabels[activity.type]}
                    </span>
                    <span style={{ fontWeight: 600 }}>{activity.title}</span>
                    {!activity.isRead && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: 'var(--primary-color)'
                        }}
                      ></span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
                    {activity.content}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <RiTimeLine />
                    <span>{activity.time}</span>
                  </div>
                </div>
                <button
                  className="btn btn-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToTarget(activity);
                  }}
                  title="바로가기"
                >
                  <RiEyeLine />
                </button>
              </div>
            );
          })}
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
        onClose={() => setDetailModal({ isOpen: false, activity: null })}
        title="활동 상세"
        size="medium"
        footer={
          <button
            className="btn btn-primary"
            onClick={() => {
              if (detailModal.activity) {
                navigateToTarget(detailModal.activity);
              }
              setDetailModal({ isOpen: false, activity: null });
            }}
          >
            <RiEyeLine /> 관련 페이지로 이동
          </button>
        }
      >
        {detailModal.activity && (() => {
          const activity = detailModal.activity;
          const IconComponent = typeIcons[activity.type] || RiTimeLine;
          const colors = typeColors[activity.type] || { bg: '#F3F4F6', color: '#6B7280' };
          return (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: colors.bg,
                    color: colors.color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16
                  }}
                >
                  <IconComponent size={28} />
                </div>
                <h3 style={{ marginBottom: 8 }}>{activity.title}</h3>
                <span className="badge" style={{ background: colors.bg, color: colors.color }}>
                  {activity.action}
                </span>
              </div>

              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">활동 내용</span>
                  <span className="detail-value">{activity.content}</span>
                </div>
                {activity.user && (
                  <div className="detail-item">
                    <span className="detail-label"><RiUserLine /> 관련 회원</span>
                    <span className="detail-value">{activity.user}</span>
                  </div>
                )}
                {activity.company && (
                  <div className="detail-item">
                    <span className="detail-label">관련 기업</span>
                    <span className="detail-value">{activity.company}</span>
                  </div>
                )}
                {activity.amount && (
                  <div className="detail-item">
                    <span className="detail-label">금액</span>
                    <span className="detail-value font-medium" style={{ color: 'var(--primary-color)' }}>
                      ₩{activity.amount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label"><RiCalendarLine /> 발생 일시</span>
                  <span className="detail-value">{activity.time}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">참조 ID</span>
                  <span className="detail-value font-medium">{activity.targetId}</span>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

export default Activities;
