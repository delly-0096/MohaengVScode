import { useEffect, useState } from 'react';
import {
  RiSearchLine,
  RiFilterLine,
  RiRefreshLine,
  RiAlertLine,
  RiCheckLine,
  RiInformationLine,
  RiErrorWarningLine,
  RiCalendarLine,
  RiTimeLine,
  RiUserLine,
  RiWalletLine,
  RiCalendarCheckLine,
  RiServerLine,
  RiCodeLine,
  RiShieldLine,
  RiEyeLine,
  RiDeleteBinLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';
import api from '../../api/api';
import './Logs.css';

// 로그 카테고리 - 아이콘 지정
const categories = [
  { id: 'all', label: '전체', icon: RiServerLine },
  { id: 'auth', label: '인증', icon: RiUserLine },
  { id: 'payment', label: '결제', icon: RiWalletLine },
  { id: 'booking', label: '예약', icon: RiCalendarCheckLine },
  { id: 'system', label: '시스템', icon: RiServerLine },
  { id: 'product', label: '상품', icon: RiCodeLine },
  { id: 'security', label: '보안', icon: RiShieldLine }
];

// 로그 데이터
const logsData = [
  { id: 1, timestamp: '2024-12-18 14:32:15', level: 'INFO', category: 'auth', source: 'AuthService', message: '사용자 로그인 성공', detail: 'user: admin@mohaeng.com, method: password', ip: '192.168.1.100', userId: 'admin' },
  { id: 2, timestamp: '2024-12-18 14:30:45', level: 'WARNING', category: 'payment', source: 'PaymentService', message: '결제 재시도 발생', detail: 'orderId: PAY20241218001, retry: 2/3, gateway: KakaoPay', ip: '203.254.12.55', userId: 'user123' },
  { id: 3, timestamp: '2024-12-18 14:28:22', level: 'ERROR', category: 'api', source: 'RecommendationAPI', message: 'API 응답 지연', detail: 'endpoint: /api/recommend, timeout: 5000ms, status: 504', ip: '10.0.0.1', userId: 'system' },
  { id: 4, timestamp: '2024-12-18 14:25:10', level: 'INFO', category: 'booking', source: 'BookingService', message: '예약 완료', detail: 'bookingId: BK20241218042, product: 제주 스노클링, amount: 85000', ip: '118.235.89.23', userId: 'travel_lover' },
  { id: 5, timestamp: '2024-12-18 14:22:33', level: 'INFO', category: 'auth', source: 'UserService', message: '회원가입 완료', detail: 'userId: 12459, type: general, email: new@email.com', ip: '211.178.45.67', userId: '12459' },
  { id: 6, timestamp: '2024-12-18 14:20:18', level: 'WARNING', category: 'security', source: 'SecurityService', message: '비정상 접근 시도 감지', detail: 'attempts: 5, blocked: true, reason: brute_force', ip: '45.89.12.33', userId: 'unknown' },
  { id: 7, timestamp: '2024-12-18 14:18:45', level: 'ERROR', category: 'system', source: 'DatabaseService', message: '쿼리 실행 실패', detail: 'table: reservations, error: connection timeout, duration: 30001ms', ip: '10.0.0.2', userId: 'system' },
  { id: 8, timestamp: '2024-12-18 14:15:22', level: 'INFO', category: 'system', source: 'EmailService', message: '예약 확인 메일 발송', detail: 'to: user@email.com, template: booking_confirm, bookingId: BK20241218041', ip: '10.0.0.3', userId: 'system' },
  { id: 9, timestamp: '2024-12-18 14:12:55', level: 'INFO', category: 'auth', source: 'AuthService', message: '사용자 로그아웃', detail: 'user: test@test.com, session: 2h 15m', ip: '192.168.1.105', userId: 'test' },
  { id: 10, timestamp: '2024-12-18 14:10:30', level: 'WARNING', category: 'system', source: 'CacheService', message: '캐시 만료 - 재생성 필요', detail: 'key: popular_destinations, ttl: expired, size: 2.4MB', ip: '10.0.0.1', userId: 'system' },
  { id: 11, timestamp: '2024-12-18 14:08:15', level: 'INFO', category: 'payment', source: 'PaymentService', message: '결제 완료', detail: 'orderId: PAY20241218002, amount: 320000, method: card', ip: '125.176.89.45', userId: 'happy_traveler' },
  { id: 12, timestamp: '2024-12-18 14:05:42', level: 'ERROR', category: 'api', source: 'WeatherAPI', message: '외부 API 호출 실패', detail: 'endpoint: weather.api.com, error: 503 Service Unavailable', ip: '10.0.0.1', userId: 'system' },
  { id: 13, timestamp: '2024-12-18 14:02:18', level: 'INFO', category: 'booking', source: 'BookingService', message: '예약 취소', detail: 'bookingId: BK20241218038, reason: 일정변경, refund: 95000', ip: '223.38.156.78', userId: 'user456' },
  { id: 14, timestamp: '2024-12-18 13:58:33', level: 'WARNING', category: 'security', source: 'SecurityService', message: 'IP 차단', detail: 'ip: 89.123.45.67, reason: malicious_request, duration: 24h', ip: '10.0.0.1', userId: 'system' },
  { id: 15, timestamp: '2024-12-18 13:55:10', level: 'INFO', category: 'auth', source: 'AuthService', message: '비밀번호 변경', detail: 'userId: user789, method: forgot_password', ip: '175.223.45.89', userId: 'user789' }
];

// 로그 레벨
const levelConfig = {
  INFO: { icon: RiInformationLine, className: 'badge-primary', color: '#2563EB', bg: '#DBEAFE' },
  WARN: { icon: RiAlertLine, className: 'badge-warning', color: '#D97706', bg: '#FEF3C7' },
  ERROR: { icon: RiErrorWarningLine, className: 'badge-danger', color: '#DC2626', bg: '#FEE2E2' },
  // SUCCESS: { icon: RiCheckLine, className: 'badge-success', color: '#059669', bg: '#D1FAE5' }
};

// 로그 카테고리별 ui
const categoryConfig = {
  auth: { label: '인증', color: '#2563EB', bg: '#DBEAFE' },
  payment: { label: '결제', color: '#059669', bg: '#D1FAE5' },
  booking: { label: '예약', color: '#7C3AED', bg: '#EDE9FE' },
  system: { label: '시스템', color: '#6B7280', bg: '#F3F4F6' },
  product: { label: '상품', color: '#0891B2', bg: '#CFFAFE' },
  security: { label: '보안', color: '#DC2626', bg: '#FEE2E2' }
};

// 카테고리 세팅
const getCategoryByMsg = (msg) => {
  if (!msg) return 'system'; // 메시지가 없으면 바로 system 반환

  const text = msg.toLowerCase();
  if (text.includes('login') || text.includes('인증') || text.includes('로그인')) return 'auth';
  if (text.includes('pay') || text.includes('결제')) return 'payment';
  if (text.includes('book') || text.includes('예약')) return 'booking';
  if (text.includes('product') || text.includes('accommodation') || text.includes('flight') || text.includes('tour')) return 'product';
  if (text.includes('security') || text.includes('보안') || text.includes('접근')) return 'security';
  return 'system'; // 매칭되는 게 없으면 기본값
};

// 시작일 얻기
const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function Logs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dataList, setDataList] = useState([]);
  const [levelFilter, setLevelFilter] = useState('all');

  // 페이징용
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [dateRange, setDateRange] = useState({
    start: getToday(),
    end: getToday()
  });
  const [detailModal, setDetailModal] = useState({ isOpen: false, log: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });

  const periods = [
    { id: 'today', label: '오늘' },
    { id: 'week', label: '이번 주' },
    { id: 'month', label: '이번 달' },
    { id: '3months', label: '최근 3개월' }
  ];

  // db에서 실제 로그목록 가져오기
  const fetchLogList = () => {
    api.get(`/admin/statistics/logs`, {
      params: {
        currentPage: currentPage,
        searchWord: searchTerm,
        searchType: categoryFilter,
        startDate: dateRange.start, // 날짜 추가
        endDate: dateRange.end      // 날짜 추가
      }
    }).then(res => {
      // console.log("res : ", res.data.dataList);
      setDataList(res.data.dataList || []);

      console.log("dataList : ", dataList);
    }).catch(err => console.error("목록 로딩 실패:", err));
  };

  // 안의 값들 변할때마다 호출
  useEffect(() => {
    console.log("초기화");
    fetchLogList();
  }, [dateRange]);

  //currentPage, searchTerm, categoryFilter, dateRange

  // 불러온 내역 가져오기
  const filteredLogs = dataList.filter(log => {
    // console.log("log : ", log);

    const matchesSearch = log.msg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase());

    const logCategory = getCategoryByMsg(log.msg);
    const matchesCategory = categoryFilter === 'all' || logCategory === categoryFilter;

    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;

    // const logDate = log.regDt.split('T')[0];
    // const matchesDate = logDate >= dateRange.start && logDate <= dateRange.end;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  // 기간 선택 핸들러
  const handlePeriodChange = (periodId) => {
    setSelectedPeriod(periodId);
    const end = getToday(); // 종료일은 무조건 오늘
    let start = new Date();

    if (periodId === 'today') {
      // 시작일 그대로 (오늘)
    } else if (periodId === 'week') {
      start.setDate(start.getDate() - 7);
    } else if (periodId === 'month') {
      start.setMonth(start.getMonth() - 1);
    } else if (periodId === '3months') {
      start.setMonth(start.getMonth() - 3);
    }

    const startYear = start.getFullYear();
    const startMonth = String(start.getMonth() + 1).padStart(2, '0');
    const startDate = String(start.getDate()).padStart(2, '0');

    setDateRange({
      start: `${startYear}-${startMonth}-${startDate}`,
      end: end
    });
  };

  const totalCount = dataList.length;
  const errorCount = dataList.filter(l => l.level === 'ERROR').length;
  const warningCount = dataList.filter(l => l.level === 'WARN').length;
  const infoCount = dataList.filter(l => l.level === 'INFO').length;
  console.log("errorCount : ", errorCount);
  console.log("warningCount : ", warningCount);
  console.log("infoCount : ", infoCount);

  const handleViewDetail = (log) => {
    setDetailModal({ isOpen: true, log });
  };

  const handleClearLogs = () => {
    setConfirmModal({ isOpen: true });
  };

  const confirmClearLogs = () => {
    alert('오래된 로그가 삭제되었습니다.');
    setConfirmModal({ isOpen: false });
  };

  /* 페이지 시작 */
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">시스템 로그</h1>
          <p className="page-subtitle">
            시스템 활동 및 오류 로그 모니터링
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>
            <RiRefreshLine /> 새로고침
          </button>
          {/* <button className="btn btn-secondary">
            <RiDownloadLine /> 로그 다운로드
          </button> */}
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
                  onClick={() => handlePeriodChange(period.id)}
                  style={{ padding: '8px 16px' }}
                >
                  {period.label}
                </button>
              ))}
            </div>
            {/* 날짜별 선택 */}
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
          <div className="stat-header">
            <div className="stat-label-group">
              <RiServerLine style={{ color: '#4b5563' }} />
              <span>전체 로그</span>
            </div>
            <div className="stat-value-group">
              <span>{totalCount}건</span>
              <span className="stat-percent">(100%)</span>
            </div>
          </div>
          <div className="progress-bg">
            <div className="progress-fill" style={{ width: '100%', backgroundColor: '#4b5563' }} />
          </div>
        </div>

        {/* 2. INFO */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-label-group">
              <RiInformationLine style={{ color: '#2563eb' }} />
              <span>INFO</span>
            </div>
            <div className="stat-value-group">
              <span>{infoCount}건</span>
              <span className="stat-percent">
                ({totalCount > 0 ? ((infoCount / totalCount) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>
          <div className="progress-bg">
            <div className="progress-fill" style={{
              width: `${totalCount > 0 ? (infoCount / totalCount) * 100 : 0}%`,
              backgroundColor: '#2563eb'
            }} />
          </div>
        </div>

        {/* 3. WARNING */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-label-group">
              <RiAlertLine style={{ color: '#d97706' }} />
              <span>WARN</span>
            </div>
            <div className="stat-value-group">
              <span>{warningCount}건</span>
              <span className="stat-percent">
                ({totalCount > 0 ? ((warningCount / totalCount) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>
          <div className="progress-bg">
            <div className="progress-fill" style={{
              width: `${totalCount > 0 ? (warningCount / totalCount) * 100 : 0}%`,
              backgroundColor: '#d97706'
            }} />
          </div>
          {warningCount > 0 && <div className="stat-alert" style={{ color: '#d97706' }}>⚠️ 주의 필요</div>}
        </div>

        {/* 4. ERROR */}
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-label-group">
              <RiErrorWarningLine style={{ color: '#dc2626' }} />
              <span>ERROR</span>
            </div>
            <div className="stat-value-group">
              <span>{errorCount}건</span>
              <span className="stat-percent">
                ({totalCount > 0 ? ((errorCount / totalCount) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>
          <div className="progress-bg">
            <div className="progress-fill" style={{
              width: `${totalCount > 0 ? (errorCount / totalCount) * 100 : 0}%`,
              backgroundColor: '#dc2626'
            }} />
          </div>
          {errorCount > 0 && <div className="stat-alert" style={{ color: '#dc2626' }}>🚨 확인 필요</div>}
        </div>
      </div>

      {/* 카테고리 필터 탭 */}
      <div className="card mb-3">
        <div className="card-body" style={{ padding: '12px 20px' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => {
              const IconComponent = cat.icon;
              // 필터링
              // const count = cat.id === 'all' ? totalCount : dataList.filter(l => getCategoryByMsg(l.msg) === cat.id).length;

              // 1. 카운트 계산
              const count = cat.id === 'all'
                ? totalCount
                : dataList.filter(l => getCategoryByMsg(l.msg) === cat.id).length;

              // 2. count가 0이면 아무것도 렌더링하지 않음 (null 반환)
              if (count === 0) return null;

              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
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
                  <IconComponent size={16} />
                  {cat.label}
                  <span style={{
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

      {/* 로그 테이블 */}
      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="로그 메시지, 소스 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <RiFilterLine />
            <select
              className="form-input form-select"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 레벨</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
            {/* <button className="btn btn-outline-danger btn-sm" onClick={handleClearLogs}>
              <RiDeleteBinLine /> 오래된 로그 삭제
            </button> */}
          </div>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          <p style={{ padding: '12px 20px', margin: 0, background: '#F9FAFB', borderBottom: '1px solid var(--border-color)', fontSize: 13, color: 'var(--text-muted)' }}>
            검색 결과: {filteredLogs.length}건
          </p>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 150 }}>시간</th>
                <th style={{ width: 90 }}>레벨</th>
                <th style={{ width: 90 }}>카테고리</th>
                <th style={{ width: 140 }}>소스</th>
                <th>메시지</th>
                <th style={{ width: 120 }}>IP</th>
                <th style={{ width: 60 }}>상세</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => {
                const LevelIcon = levelConfig[log.level].icon;

                // 타입 매칭
                const keyword = getCategoryByMsg(log.msg);
                const catConfig = categoryConfig[keyword];
                const summaryMsg = log.msg.includes('에러 발생')
                  ? log.msg.split('###')[0].split(':')[0] // '에러 발생' 근처까지만 깔끔하게 자름
                  : log.msg;
                return (
                  <tr key={log.systemLogNo} style={{ background: log.level === 'ERROR' ? '#FEF2F2' : log.level === 'WARNING' ? '#FFFBEB' : 'transparent' }}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <RiTimeLine size={12} />
                        {log.regDt.split('T')[0]} {log.regDt.split('T')[1]}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '4px 8px',
                          borderRadius: 4,
                          background: levelConfig[log.level].bg,
                          color: levelConfig[log.level].color,
                          fontSize: 12,
                          fontWeight: 600
                        }}
                      >
                        <LevelIcon size={14} /> {log.level}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        background: catConfig.bg,
                        color: catConfig.color,
                        fontSize: 12,
                        fontWeight: 500
                      }}>
                        {catConfig.label}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        background: '#F3F4F6',
                        borderRadius: 4,
                        fontFamily: 'monospace',
                        fontSize: '0.8rem'
                      }}>
                        {log.source}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                      {summaryMsg}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {log.ip}
                    </td>
                    <td>
                      <button
                        className="table-action-btn"
                        onClick={() => handleViewDetail(log)}
                        title="상세보기"
                      >
                        <RiEyeLine />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 페이지 네이션 */}
        <div className="pagination">
          <button className="pagination-btn" disabled>&lt;</button>
          {/* block수만큼 반복 */}
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <button className="pagination-btn">&gt;</button>
        </div>
      </div>

      {/* 로그 상세 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, log: null })}
        title="로그 상세"
        size="medium"
      >
        {/* 여기서는 다른걸로 바꿔야됨 */}
        {detailModal.log && (() => {
          const log = detailModal.log;
          const LevelIcon = levelConfig[log.level].icon;

          // 타입 매칭
          const keyword = getCategoryByMsg(log.msg);
          const catConfig = categoryConfig[keyword];

          const summaryTitle = log.msg.includes('에러 발생')
            ? log.msg.split('###')[1] // '에러 발생' 근처까지만 깔끔하게 자름
            : log.msg;

          console.log("catConfig : ", catConfig);
          return (
            <div>
              {/* 헤더 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 16,
                background: levelConfig[log.level].bg,
                borderRadius: 8,
                marginBottom: 20
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <LevelIcon size={24} style={{ color: levelConfig[log.level].color }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                    {log.msg.includes('에러 발생') ? '' : log.msg}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: levelConfig[log.level].color,
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 600
                    }}>
                      {log.level}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: catConfig.bg,
                      color: catConfig.color,
                      fontSize: 12,
                      fontWeight: 500
                    }}>
                      {catConfig.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* 상세 정보 */}
              <div className="detail-list">
                <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}><RiTimeLine style={{ marginRight: 8 }} />발생 시간</span>
                  <span style={{ fontFamily: 'monospace' }}>{log.regDt.split('T')[0]} {log.regDt.split('T')[1]}</span>
                </div>
                <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}><RiServerLine style={{ marginRight: 8 }} />소스</span>
                  <span style={{ fontFamily: 'monospace', padding: '2px 8px', background: '#F3F4F6', borderRadius: 4 }}>{log.source}</span>
                </div>
                <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}><RiUserLine style={{ marginRight: 8 }} />사용자 ID</span>
                  <span style={{ fontFamily: 'monospace' }}>{log.systemLogMem}</span>
                </div>
                <div className="detail-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}><RiShieldLine style={{ marginRight: 8 }} />IP 주소</span>
                  <span style={{ fontFamily: 'monospace' }}>{log.ip}</span>
                </div>
              </div>

              {/* 상세 내용 */}
              <div style={{ marginTop: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>상세 내용</h4>
                <div style={{
                  padding: 16,
                  background: '#1E293B',
                  borderRadius: 8,
                  fontFamily: 'monospace',
                  fontSize: 13,
                  color: '#E2E8F0',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}>
                  {summaryTitle}
                </div>
              </div>

              {/* 액션 버튼 (에러인 경우) */}
              {log.level === 'ERROR' && (
                <div style={{
                  marginTop: 20,
                  padding: 16,
                  background: '#FEF2F2',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ color: '#DC2626', fontSize: 14 }}>
                    <RiAlertLine style={{ marginRight: 8 }} />
                    이 에러에 대한 조치가 필요합니다.
                  </div>
                  <button className="btn btn-danger btn-sm">이슈 생성</button>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false })}
        onConfirm={confirmClearLogs}
        title="오래된 로그 삭제"
        message="30일 이전의 로그를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        type="danger"
      />
    </div>
  );
}

export default Logs;
