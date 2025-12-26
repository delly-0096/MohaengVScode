import { useState } from 'react';
import {
  RiSearchLine,
  RiSendPlaneLine,
  RiBellLine,
  RiBellFill,
  RiCheckDoubleLine,
  RiDeleteBinLine,
  RiFilterLine,
  RiFileListLine,
  RiWallet3Line,
  RiCoinLine,
  RiQuestionLine,
  RiCalendarCheckLine,
  RiStarLine,
  RiExchangeDollarLine,
  RiSettings4Line,
  RiNotification2Line,
  RiMailLine,
  RiUserLine,
  RiBuilding2Line,
  RiAdminLine,
  RiCheckLine,
  RiCloseLine,
  RiTimeLine,
  RiMegaphoneLine,
  RiGiftLine,
  RiAlertLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

// 카테고리 정의 (사용자 페이지와 동일한 구조)
const categories = [
  { id: 'all', label: '전체', icon: RiFileListLine },
  { id: '결제', label: '결제', icon: RiWallet3Line, target: 'member' },
  { id: '포인트', label: '포인트', icon: RiCoinLine, target: 'member' },
  { id: '예약', label: '예약', icon: RiCalendarCheckLine, target: 'business' },
  { id: '후기', label: '후기', icon: RiStarLine, target: 'business' },
  { id: '정산', label: '정산', icon: RiExchangeDollarLine, target: 'business' },
  { id: '문의', label: '문의', icon: RiQuestionLine, target: 'all' },
  { id: '시스템', label: '시스템', icon: RiSettings4Line, target: 'all' }
];

const categoryColors = {
  '결제': { className: 'badge-success', color: '#10b981', bg: '#d1fae5' },
  '포인트': { className: 'badge-warning', color: '#f59e0b', bg: '#fef3c7' },
  '예약': { className: 'badge-primary', color: '#4A90D9', bg: '#dbeafe' },
  '후기': { className: 'badge-info', color: '#06b6d4', bg: '#cffafe' },
  '정산': { className: 'badge-secondary', color: '#8b5cf6', bg: '#ede9fe' },
  '문의': { className: 'badge-danger', color: '#ef4444', bg: '#fee2e2' },
  '시스템': { className: 'badge-gray', color: '#64748b', bg: '#f1f5f9' }
};

const targetTypes = [
  { value: 'all', label: '전체', icon: RiNotification2Line },
  { value: 'member', label: '일반회원', icon: RiUserLine },
  { value: 'business', label: '기업회원', icon: RiBuilding2Line },
  { value: 'admin', label: '관리자', icon: RiAdminLine }
];

// 더미 데이터 (사용자 페이지와 동일한 구조)
const initialNotificationsData = [
  // 일반회원 대상 알림
  {
    id: 1,
    type: '결제',
    title: '결제가 완료되었습니다',
    message: '제주 스쿠버다이빙 체험 - 136,000원',
    targetType: 'member',
    targetName: '김지민',
    relatedId: 'PAY-2024031501',
    isRead: false,
    createdAt: '2024-03-15 14:32'
  },
  {
    id: 2,
    type: '포인트',
    title: '포인트가 적립되었습니다',
    message: '결제 적립 +1,360P (제주 스쿠버다이빙 체험)',
    targetType: 'member',
    targetName: '김지민',
    relatedId: 'PT-2024031501',
    isRead: false,
    createdAt: '2024-03-15 14:32'
  },
  {
    id: 3,
    type: '결제',
    title: '이용일이 3일 남았습니다',
    message: '부산 요트 투어 - 2024.03.18 14:00',
    targetType: 'member',
    targetName: '이수현',
    relatedId: 'RSV-2024031502',
    isRead: false,
    createdAt: '2024-03-15 09:00'
  },
  {
    id: 4,
    type: '문의',
    title: '문의에 답변이 등록되었습니다',
    message: '환불 요청 관련 문의 - 답변을 확인해주세요',
    targetType: 'member',
    targetName: '박민준',
    relatedId: 'INQ-2024031401',
    isRead: true,
    createdAt: '2024-03-14 16:50'
  },
  {
    id: 5,
    type: '결제',
    title: '결제가 취소되었습니다',
    message: '우도 자전거 투어 - 45,000원 환불 완료',
    targetType: 'member',
    targetName: '최유진',
    relatedId: 'REF-2024031401',
    isRead: true,
    createdAt: '2024-03-14 11:20'
  },
  {
    id: 6,
    type: '포인트',
    title: '포인트가 사용되었습니다',
    message: '결제 시 사용 -5,000P (한라산 트레킹 투어)',
    targetType: 'member',
    targetName: '정다은',
    relatedId: 'PT-2024031301',
    isRead: true,
    createdAt: '2024-03-13 10:05'
  },

  // 기업회원 대상 알림
  {
    id: 7,
    type: '예약',
    title: '새 예약이 들어왔습니다',
    message: '제주 스쿠버다이빙 체험 - 김OO님 (2명) / 2024.04.20 14:00',
    targetType: 'business',
    targetName: '제주다이빙센터',
    relatedId: 'RSV-2024031503',
    isRead: false,
    createdAt: '2024-03-15 13:20'
  },
  {
    id: 8,
    type: '후기',
    title: '새 후기가 등록되었습니다',
    message: '한라산 트레킹 투어 - 이OO님이 5점을 주셨습니다',
    targetType: 'business',
    targetName: '제주투어',
    relatedId: 'RV-2024031501',
    isRead: false,
    createdAt: '2024-03-15 11:45'
  },
  {
    id: 9,
    type: '문의',
    title: '문의가 접수되었습니다',
    message: '제주 서핑 레슨 - 박OO님: "당일 예약도 가능한가요?"',
    targetType: 'business',
    targetName: '서핑스쿨제주',
    relatedId: 'INQ-2024031501',
    isRead: false,
    createdAt: '2024-03-15 10:30'
  },
  {
    id: 10,
    type: '예약',
    title: '예약이 취소되었습니다',
    message: '우도 자전거 투어 - 정OO님 / 취소 사유: 일정 변경',
    targetType: 'business',
    targetName: '우도바이크',
    relatedId: 'RSV-2024031401',
    isRead: true,
    createdAt: '2024-03-14 15:20'
  },
  {
    id: 11,
    type: '정산',
    title: '2월 정산이 완료되었습니다',
    message: '정산 금액 2,850,000원이 등록된 계좌로 입금되었습니다',
    targetType: 'business',
    targetName: '제주다이빙센터',
    relatedId: 'SET-2024030501',
    isRead: true,
    createdAt: '2024-03-05 10:00'
  },

  // 시스템 알림
  {
    id: 12,
    type: '시스템',
    title: '[공지] 겨울 특가 프로모션 안내',
    message: '12월 한정 최대 30% 할인 이벤트가 시작되었습니다',
    targetType: 'all',
    targetName: '전체',
    relatedId: 'NTC-2024030101',
    isRead: true,
    createdAt: '2024-03-01 09:00'
  },
  {
    id: 13,
    type: '시스템',
    title: '서비스 점검 안내',
    message: '2024년 3월 20일 02:00~06:00 서비스 점검이 예정되어 있습니다',
    targetType: 'all',
    targetName: '전체',
    relatedId: 'SYS-2024022801',
    isRead: true,
    createdAt: '2024-02-28 12:00'
  }
];

// 알림 발송 템플릿
const notificationTemplates = [
  { id: 1, type: '시스템', title: '시스템 점검 안내', message: '시스템 점검이 예정되어 있습니다. 점검 시간: ' },
  { id: 2, type: '시스템', title: '이벤트 안내', message: '새로운 이벤트가 시작되었습니다. ' },
  { id: 3, type: '시스템', title: '공지사항', message: '새로운 공지사항이 등록되었습니다. ' },
  { id: 4, type: '시스템', title: '프로모션 안내', message: '특별 할인 프로모션이 진행 중입니다. ' }
];

function Notifications() {
  const [notificationsData, setNotificationsData] = useState(initialNotificationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [targetFilter, setTargetFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // 모달 상태
  const [sendModal, setSendModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '' });
  const [sendData, setSendData] = useState({
    type: '시스템',
    targetType: 'all',
    title: '',
    message: ''
  });

  // 필터링
  const filteredData = notificationsData.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.targetName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || notification.type === categoryFilter;
    const matchesTarget = targetFilter === 'all' || notification.targetType === targetFilter;
    const matchesRead = readFilter === 'all' ||
                       (readFilter === 'unread' && !notification.isRead) ||
                       (readFilter === 'read' && notification.isRead);
    return matchesSearch && matchesCategory && matchesTarget && matchesRead;
  });

  // 통계 계산
  const totalCount = notificationsData.length;
  const unreadCount = notificationsData.filter(n => !n.isRead).length;
  const todayCount = notificationsData.filter(n => n.createdAt.startsWith('2024-03-15')).length;
  const memberCount = notificationsData.filter(n => n.targetType === 'member' && !n.isRead).length;
  const businessCount = notificationsData.filter(n => n.targetType === 'business' && !n.isRead).length;

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedNotifications.length === filteredData.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredData.map(n => n.id));
    }
  };

  // 개별 선택/해제
  const toggleSelect = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  // 선택 항목 읽음 처리
  const markSelectedAsRead = () => {
    setNotificationsData(prev => prev.map(n =>
      selectedNotifications.includes(n.id) ? { ...n, isRead: true } : n
    ));
    setSelectedNotifications([]);
    alert('선택된 알림을 읽음으로 표시했습니다.');
  };

  // 선택 항목 삭제
  const handleDeleteSelected = () => {
    setDeleteModal({ isOpen: true, type: 'selected' });
  };

  const confirmDelete = () => {
    if (deleteModal.type === 'selected') {
      setNotificationsData(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
      setSelectedNotifications([]);
    }
    setDeleteModal({ isOpen: false, type: '' });
    alert('삭제되었습니다.');
  };

  // 알림 발송
  const handleSendNotification = () => {
    if (!sendData.title.trim() || !sendData.message.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    const newNotification = {
      id: Math.max(...notificationsData.map(n => n.id)) + 1,
      type: sendData.type,
      title: sendData.title,
      message: sendData.message,
      targetType: sendData.targetType,
      targetName: targetTypes.find(t => t.value === sendData.targetType)?.label || '전체',
      relatedId: `NTC-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      }).replace(/\. /g, '-').replace('.', '').replace(' ', ' ')
    };
    setNotificationsData(prev => [newNotification, ...prev]);
    setSendModal(false);
    setSendData({ type: '시스템', targetType: 'all', title: '', message: '' });
    alert('알림이 발송되었습니다.');
  };

  // 템플릿 적용
  const applyTemplate = (template) => {
    setSendData(prev => ({
      ...prev,
      type: template.type,
      title: template.title,
      message: template.message
    }));
  };

  // 카테고리 아이콘
  const getCategoryIcon = (type) => {
    const cat = categories.find(c => c.id === type);
    return cat ? cat.icon : RiBellLine;
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">알림 관리</h1>
          <p className="page-subtitle">회원에게 발송된 알림을 관리합니다</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setSendModal(true)}>
            <RiSendPlaneLine /> 알림 발송
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card stat-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #4A90D9, #357ABD)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem' }}>
              <RiBellLine />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--primary-color)' }}>{totalCount}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>전체 알림</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem' }}>
              <RiBellFill />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ef4444' }}>{unreadCount}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>읽지 않음</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem' }}>
              <RiTimeLine />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#10b981' }}>{todayCount}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>오늘 발송</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem' }}>
              <RiUserLine />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f59e0b' }}>{memberCount}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>일반회원</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem' }}>
              <RiBuilding2Line />
            </div>
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#8b5cf6' }}>{businessCount}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>기업회원</div>
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 탭 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
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
              placeholder="제목, 내용, 대상 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group" style={{ display: 'flex', gap: 8 }}>
            <select
              className="form-input form-select"
              value={targetFilter}
              onChange={(e) => setTargetFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 대상</option>
              <option value="member">일반회원</option>
              <option value="business">기업회원</option>
            </select>
            <select
              className="form-input form-select"
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 상태</option>
              <option value="unread">읽지 않음</option>
              <option value="read">읽음</option>
            </select>
          </div>
        </div>

        {/* 일괄 작업 바 */}
        {selectedNotifications.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: '#eff6ff',
            borderBottom: '1px solid #dbeafe',
            margin: '0 -16px'
          }}>
            <span style={{ fontWeight: 500, color: '#1e40af' }}>
              {selectedNotifications.length}개 선택됨
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-outline" onClick={markSelectedAsRead}>
                <RiCheckDoubleLine /> 읽음 처리
              </button>
              <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626', border: 'none' }} onClick={handleDeleteSelected}>
                <RiDeleteBinLine /> 삭제
              </button>
            </div>
          </div>
        )}

        {/* 알림 목록 */}
        <div style={{ marginTop: 16 }}>
          {/* 전체 선택 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 0',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <input
              type="checkbox"
              checked={selectedNotifications.length === filteredData.length && filteredData.length > 0}
              onChange={toggleSelectAll}
              style={{ width: 18, height: 18 }}
            />
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              전체 선택 ({filteredData.length}개)
            </span>
          </div>

          {/* 알림 아이템 목록 */}
          {filteredData.map(notification => {
            const IconComponent = getCategoryIcon(notification.type);
            const colorInfo = categoryColors[notification.type] || { color: '#64748b', bg: '#f1f5f9' };

            return (
              <div
                key={notification.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '16px 0',
                  borderBottom: '1px solid #f1f5f9',
                  background: notification.isRead ? 'transparent' : '#fefce8',
                  margin: notification.isRead ? 0 : '0 -16px',
                  padding: notification.isRead ? '16px 0' : '16px',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={() => toggleSelect(notification.id)}
                  style={{ width: 18, height: 18, marginTop: 4 }}
                />
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: colorInfo.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colorInfo.color,
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}>
                  <IconComponent />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span
                      className={`badge ${categoryColors[notification.type]?.className || 'badge-gray'}`}
                      style={{ whiteSpace: 'nowrap', fontSize: '0.7rem' }}
                    >
                      {notification.type}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      background: notification.targetType === 'member' ? '#fef3c7' : notification.targetType === 'business' ? '#ede9fe' : '#f1f5f9',
                      color: notification.targetType === 'member' ? '#b45309' : notification.targetType === 'business' ? '#6d28d9' : '#475569',
                      borderRadius: 4
                    }}>
                      {notification.targetName}
                    </span>
                    {!notification.isRead && (
                      <span style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#ef4444'
                      }} />
                    )}
                  </div>
                  <h4 style={{
                    fontSize: '0.95rem',
                    fontWeight: notification.isRead ? 500 : 600,
                    color: '#1e293b',
                    marginBottom: 4
                  }}>
                    {notification.title}
                  </h4>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    margin: 0,
                    lineHeight: 1.5
                  }}>
                    {notification.message}
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {notification.createdAt.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                    {notification.createdAt.split(' ')[1]}
                  </div>
                  {notification.relatedId && (
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4 }}>
                      {notification.relatedId}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredData.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#94a3b8'
            }}>
              <RiBellLine style={{ fontSize: '3rem', marginBottom: 12 }} />
              <p>조건에 맞는 알림이 없습니다.</p>
            </div>
          )}
        </div>

        <div className="pagination" style={{ marginTop: 20 }}>
          <button className="pagination-btn" disabled>&lt;</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">&gt;</button>
        </div>
      </div>

      {/* 알림 발송 모달 */}
      <Modal
        isOpen={sendModal}
        onClose={() => setSendModal(false)}
        title="알림 발송"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setSendModal(false)}>취소</button>
            <button
              className="btn btn-primary"
              onClick={handleSendNotification}
              disabled={!sendData.title.trim() || !sendData.message.trim()}
            >
              <RiSendPlaneLine style={{ marginRight: 4 }} /> 발송
            </button>
          </>
        }
      >
        <div>
          {/* 템플릿 선택 */}
          <div className="form-group">
            <label className="form-label">템플릿 선택</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {notificationTemplates.map(template => (
                <button
                  key={template.id}
                  className="btn btn-sm btn-outline"
                  onClick={() => applyTemplate(template)}
                  style={{ fontSize: '0.8rem' }}
                >
                  {template.title}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">알림 유형 <span style={{ color: '#ef4444' }}>*</span></label>
              <select
                className="form-input form-select"
                value={sendData.type}
                onChange={(e) => setSendData(prev => ({ ...prev, type: e.target.value }))}
              >
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">발송 대상 <span style={{ color: '#ef4444' }}>*</span></label>
              <select
                className="form-input form-select"
                value={sendData.targetType}
                onChange={(e) => setSendData(prev => ({ ...prev, targetType: e.target.value }))}
              >
                {targetTypes.map(target => (
                  <option key={target.value} value={target.value}>{target.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">제목 <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="알림 제목을 입력하세요"
              value={sendData.title}
              onChange={(e) => setSendData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">내용 <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea
              className="form-input"
              rows={5}
              placeholder="알림 내용을 입력하세요"
              value={sendData.message}
              onChange={(e) => setSendData(prev => ({ ...prev, message: e.target.value }))}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* 미리보기 */}
          {sendData.title && (
            <div style={{
              padding: 16,
              background: '#fefce8',
              borderRadius: 8,
              marginTop: 16
            }}>
              <div style={{ fontSize: '0.8rem', color: '#92400e', marginBottom: 8 }}>미리보기</div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: categoryColors[sendData.type]?.bg || '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: categoryColors[sendData.type]?.color || '#64748b'
                }}>
                  {(() => {
                    const IconComp = getCategoryIcon(sendData.type);
                    return <IconComp />;
                  })()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{sendData.title}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{sendData.message}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: '' })}
        onConfirm={confirmDelete}
        title="알림 삭제"
        message={`선택된 ${selectedNotifications.length}개의 알림을 삭제하시겠습니까?\n\n삭제된 알림은 복구할 수 없습니다.`}
        confirmText="삭제"
        type="danger"
      />
    </div>
  );
}

export default Notifications;
