import { useState } from 'react';
import './Products.css';

// 샘플 예약 데이터
const initialReservationsData = [
  {
    id: 'R2024031501',
    orderNo: 'ORD-20240315-001234',
    productType: '체험',
    productName: '제주 스쿠버다이빙 체험',
    optionName: '초보자 코스 (2시간)',
    // 예약자 정보
    memberId: 'M001',
    memberName: '김지민',
    memberEmail: 'jimin@email.com',
    memberPhone: '010-1234-5678',
    // 사업자 정보
    businessName: '제주다이빙센터',
    businessNo: '123-45-67890',
    businessPhone: '064-123-4567',
    // 일정 정보
    reservationDate: '2024-03-15',
    useDate: '2024-03-20',
    useTime: '10:00',
    persons: 2,
    // 결제 정보
    originalPrice: 200000,
    discountAmount: 20000,
    pointUsed: 0,
    totalPrice: 180000,
    earnedPoints: 1800,
    paymentMethod: '카드',
    // 기타
    requests: '초보자입니다. 친절히 가르쳐주세요.',
    status: '확정',
    reviewWritten: false,
    createdAt: '2024-03-15 14:32:00'
  },
  {
    id: 'R2024031502',
    orderNo: 'ORD-20240314-001122',
    productType: '숙박',
    productName: '부산 해운대 리조트',
    optionName: '디럭스 오션뷰',
    memberId: 'M002',
    memberName: '이수현',
    memberEmail: 'suhyun@email.com',
    memberPhone: '010-2345-6789',
    businessName: '해운대리조트(주)',
    businessNo: '234-56-78901',
    businessPhone: '051-234-5678',
    reservationDate: '2024-03-14',
    useDate: '2024-03-25',
    checkOutDate: '2024-03-27',
    useTime: '15:00',
    persons: 4,
    nights: 2,
    originalPrice: 600000,
    discountAmount: 40000,
    pointUsed: 0,
    totalPrice: 560000,
    earnedPoints: 5600,
    paymentMethod: '카드',
    requests: '늦은 체크인 예정입니다 (21시경)',
    status: '확정',
    reviewWritten: false,
    createdAt: '2024-03-14 09:15:00'
  },
  {
    id: 'R2024031503',
    orderNo: 'ORD-20240313-003344',
    productType: '항공',
    productName: '서울-제주 왕복',
    optionName: '일반석',
    memberId: 'M003',
    memberName: '박민준',
    memberEmail: 'minjun@email.com',
    memberPhone: '010-3456-7890',
    businessName: '대한항공',
    businessNo: '110-81-12345',
    businessPhone: '1588-2001',
    reservationDate: '2024-03-13',
    useDate: '2024-03-22',
    useTime: '08:00',
    returnDate: '2024-03-24',
    returnTime: '18:30',
    flightNo: 'KE1201 / KE1214',
    persons: 1,
    originalPrice: 165000,
    discountAmount: 9000,
    pointUsed: 0,
    totalPrice: 156000,
    earnedPoints: 1560,
    paymentMethod: '계좌이체',
    requests: '',
    status: '완료',
    reviewWritten: true,
    createdAt: '2024-03-13 16:45:00'
  },
  {
    id: 'R2024031504',
    orderNo: 'ORD-20240312-005566',
    productType: '체험',
    productName: '강원도 래프팅 어드벤처',
    optionName: '기본 코스',
    memberId: 'M004',
    memberName: '최유진',
    memberEmail: 'yujin@email.com',
    memberPhone: '010-4567-8901',
    businessName: '강원래프팅',
    businessNo: '345-67-89012',
    businessPhone: '033-345-6789',
    reservationDate: '2024-03-12',
    useDate: '2024-03-18',
    useTime: '13:00',
    persons: 6,
    originalPrice: 270000,
    discountAmount: 30000,
    pointUsed: 0,
    totalPrice: 240000,
    earnedPoints: 0,
    paymentMethod: '카드',
    requests: '그룹 예약입니다.',
    status: '취소',
    cancelReason: '개인 사정',
    cancelDate: '2024-03-14',
    cancelFee: 24000,
    reviewWritten: false,
    createdAt: '2024-03-12 11:20:00'
  },
  {
    id: 'R2024031505',
    orderNo: 'ORD-20240311-007788',
    productType: '체험',
    productName: '경주 한복체험',
    optionName: '고급 한복 2시간',
    memberId: 'M005',
    memberName: '정다은',
    memberEmail: 'daeun@email.com',
    memberPhone: '010-5678-9012',
    businessName: '경주한복',
    businessNo: '456-78-90123',
    businessPhone: '054-456-7890',
    reservationDate: '2024-03-11',
    useDate: '2024-03-16',
    useTime: '11:00',
    persons: 2,
    originalPrice: 80000,
    discountAmount: 0,
    pointUsed: 20000,
    totalPrice: 60000,
    earnedPoints: 600,
    paymentMethod: '카드+포인트',
    requests: '',
    status: '완료',
    reviewWritten: true,
    createdAt: '2024-03-11 10:05:00'
  },
  {
    id: 'R2024031506',
    orderNo: 'ORD-20240310-009900',
    productType: '숙박',
    productName: '제주 오션뷰 호텔',
    optionName: '프리미엄 스위트',
    memberId: 'M006',
    memberName: '한서준',
    memberEmail: 'seojun@email.com',
    memberPhone: '010-6789-0123',
    businessName: '제주관광호텔(주)',
    businessNo: '567-89-01234',
    businessPhone: '064-567-8901',
    reservationDate: '2024-03-10',
    useDate: '2024-03-28',
    checkOutDate: '2024-03-31',
    useTime: '15:00',
    persons: 2,
    nights: 3,
    originalPrice: 510000,
    discountAmount: 60000,
    pointUsed: 0,
    totalPrice: 450000,
    earnedPoints: 4500,
    paymentMethod: '카드',
    requests: '조용한 객실 부탁드립니다.',
    status: '확정',
    reviewWritten: false,
    createdAt: '2024-03-10 20:30:00'
  },
  {
    id: 'R2024031507',
    orderNo: 'ORD-20240309-011122',
    productType: '항공',
    productName: '부산-제주 왕복',
    optionName: '일반석',
    memberId: 'M007',
    memberName: '강하은',
    memberEmail: 'haeun@email.com',
    memberPhone: '010-7890-1234',
    businessName: '아시아나항공',
    businessNo: '110-81-54321',
    businessPhone: '1588-8000',
    reservationDate: '2024-03-09',
    useDate: '2024-03-21',
    useTime: '09:30',
    returnDate: '2024-03-23',
    returnTime: '20:00',
    flightNo: 'OZ8921 / OZ8932',
    persons: 2,
    originalPrice: 280000,
    discountAmount: 32000,
    pointUsed: 0,
    totalPrice: 248000,
    earnedPoints: 2480,
    paymentMethod: '카드',
    requests: '',
    status: '확정',
    reviewWritten: false,
    createdAt: '2024-03-09 15:00:00'
  },
  {
    id: 'R2024031508',
    orderNo: 'ORD-20240308-013344',
    productType: '체험',
    productName: '부산 요트투어',
    optionName: '선셋 투어 (2시간)',
    memberId: 'M008',
    memberName: '임지호',
    memberEmail: 'jiho@email.com',
    memberPhone: '010-8901-2345',
    businessName: '부산요트클럽',
    businessNo: '678-90-12345',
    businessPhone: '051-678-9012',
    reservationDate: '2024-03-08',
    useDate: '2024-03-19',
    useTime: '14:00',
    persons: 4,
    originalPrice: 360000,
    discountAmount: 40000,
    pointUsed: 0,
    totalPrice: 320000,
    earnedPoints: 0,
    paymentMethod: '카드',
    requests: '멀미약 준비해주세요.',
    status: '환불',
    refundAmount: 288000,
    refundDate: '2024-03-12',
    refundReason: '기상악화',
    cancelFee: 32000,
    reviewWritten: false,
    createdAt: '2024-03-08 12:15:00'
  },
  {
    id: 'R2024031509',
    orderNo: 'ORD-20240307-015566',
    productType: '체험',
    productName: '서울 쿠킹클래스',
    optionName: '한식 코스',
    memberId: 'M009',
    memberName: '윤채원',
    memberEmail: 'chaewon@email.com',
    memberPhone: '010-9012-3456',
    businessName: '서울요리학원',
    businessNo: '789-01-23456',
    businessPhone: '02-789-0123',
    reservationDate: '2024-03-07',
    useDate: '2024-03-15',
    useTime: '10:00',
    persons: 1,
    originalPrice: 55000,
    discountAmount: 5500,
    pointUsed: 5000,
    totalPrice: 44500,
    earnedPoints: 445,
    paymentMethod: '카카오페이',
    requests: '채식 가능한 메뉴로 부탁드려요.',
    status: '완료',
    reviewWritten: false,
    createdAt: '2024-03-07 09:30:00'
  },
  {
    id: 'R2024031510',
    orderNo: 'ORD-20240306-017788',
    productType: '숙박',
    productName: '강릉 펜션 힐링하우스',
    optionName: '독채 (6인실)',
    memberId: 'M010',
    memberName: '송민재',
    memberEmail: 'minjae@email.com',
    memberPhone: '010-0123-4567',
    businessName: '힐링하우스펜션',
    businessNo: '890-12-34567',
    businessPhone: '033-890-1234',
    reservationDate: '2024-03-06',
    useDate: '2024-03-09',
    checkOutDate: '2024-03-10',
    useTime: '15:00',
    persons: 5,
    nights: 1,
    originalPrice: 200000,
    discountAmount: 0,
    pointUsed: 10000,
    totalPrice: 190000,
    earnedPoints: 1900,
    paymentMethod: '네이버페이',
    requests: '바베큐 그릴 사용 예정입니다.',
    status: '완료',
    reviewWritten: true,
    createdAt: '2024-03-06 18:45:00'
  }
];

function Reservations() {
  const [reservationsData, setReservationsData] = useState(initialReservationsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState('');

  // 통계 계산
  const stats = {
    total: reservationsData.length,
    confirmed: reservationsData.filter(r => r.status === '확정').length,
    completed: reservationsData.filter(r => r.status === '완료').length,
    cancelled: reservationsData.filter(r => r.status === '취소' || r.status === '환불').length,
    totalAmount: reservationsData.filter(r => r.status !== '취소' && r.status !== '환불').reduce((sum, r) => sum + r.totalPrice, 0)
  };

  // 상품 유형 목록
  const productTypes = ['체험', '숙박', '항공'];

  // 상태 목록
  const statusList = ['확정', '완료', '취소', '환불'];

  // 필터링된 데이터
  const filteredData = reservationsData.filter(reservation => {
    const matchesSearch = reservation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.memberPhone.includes(searchTerm) ||
                         reservation.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    const matchesType = filterType === 'all' || reservation.productType === filterType;

    // 날짜 필터
    let matchesDate = true;
    if (filterDateRange !== 'all') {
      const today = new Date();
      const reservationDate = new Date(reservation.reservationDate);
      const diffDays = Math.floor((today - reservationDate) / (1000 * 60 * 60 * 24));

      if (filterDateRange === 'week') matchesDate = diffDays <= 7;
      else if (filterDateRange === 'month') matchesDate = diffDays <= 30;
      else if (filterDateRange === '3months') matchesDate = diffDays <= 90;
    }

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // 상세 모달 열기
  const openDetailModal = (reservation) => {
    setSelectedReservation(reservation);
    setIsDetailModalOpen(true);
  };

  // 취소 모달 열기
  const openCancelModal = (reservation) => {
    setSelectedReservation(reservation);
    setCancelReason('');
    setIsCancelModalOpen(true);
  };

  // 환불 모달 열기
  const openRefundModal = (reservation) => {
    setSelectedReservation(reservation);
    setRefundAmount(reservation.totalPrice);
    setRefundReason('');
    setIsRefundModalOpen(true);
  };

  // 예약 취소 처리
  const cancelReservation = () => {
    setReservationsData(prev => prev.map(r =>
      r.id === selectedReservation.id
        ? { ...r, status: '취소', cancelReason, cancelDate: new Date().toISOString().split('T')[0] }
        : r
    ));
    setIsCancelModalOpen(false);
  };

  // 환불 처리
  const processRefund = () => {
    setReservationsData(prev => prev.map(r =>
      r.id === selectedReservation.id
        ? { ...r, status: '환불', refundAmount, refundReason, refundDate: new Date().toISOString().split('T')[0] }
        : r
    ));
    setIsRefundModalOpen(false);
  };

  // 상태 변경
  const updateStatus = (reservation, newStatus) => {
    setReservationsData(prev => prev.map(r =>
      r.id === reservation.id ? { ...r, status: newStatus } : r
    ));
  };

  // 금액 포맷
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // 상태 뱃지 색상
  const getStatusClass = (status) => {
    switch (status) {
      case '확정': return 'confirmed';
      case '완료': return 'completed';
      case '취소': return 'cancelled';
      case '환불': return 'refunded';
      default: return '';
    }
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>예약 관리</h1>
        <div className="header-actions">
          <button className="btn btn-outline">
            <i className="bi bi-download"></i> 엑셀 다운로드
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-calendar-check"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">전체 예약</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="bi bi-check-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.confirmed}</span>
            <span className="stat-label">확정</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="bi bi-check2-all"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">완료</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <i className="bi bi-x-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.cancelled}</span>
            <span className="stat-label">취소/환불</span>
          </div>
        </div>
        <div className="stat-card wide">
          <div className="stat-icon yellow">
            <i className="bi bi-currency-won"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{formatPrice(stats.totalAmount)}</span>
            <span className="stat-label">총 결제금액</span>
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
              placeholder="예약번호, 주문번호, 상품명, 예약자명, 연락처, 사업자명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">전체 상태</option>
              {statusList.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">전체 유형</option>
              {productTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select value={filterDateRange} onChange={(e) => setFilterDateRange(e.target.value)}>
              <option value="all">전체 기간</option>
              <option value="week">최근 1주일</option>
              <option value="month">최근 1개월</option>
              <option value="3months">최근 3개월</option>
            </select>
          </div>
        </div>
      </div>

      {/* 예약 목록 테이블 */}
      <div className="data-table-container" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ minWidth: '130px' }}>예약번호</th>
              <th style={{ minWidth: '60px' }}>유형</th>
              <th style={{ minWidth: '180px' }}>상품정보</th>
              <th style={{ minWidth: '120px' }}>예약자</th>
              <th style={{ minWidth: '140px' }}>이용일시</th>
              <th style={{ minWidth: '80px' }}>인원</th>
              <th style={{ minWidth: '120px' }}>결제정보</th>
              <th style={{ minWidth: '80px' }}>상태</th>
              <th style={{ minWidth: '60px' }}>후기</th>
              <th style={{ minWidth: '130px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(reservation => (
              <tr key={reservation.id}>
                <td>
                  <div className="reservation-id" onClick={() => openDetailModal(reservation)} style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 600 }}>
                    {reservation.id}
                  </div>
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>{reservation.orderNo}</small>
                </td>
                <td>
                  <span className={`badge badge-${reservation.productType === '체험' ? 'primary' : reservation.productType === '숙박' ? 'success' : 'info'}`}>
                    {reservation.productType}
                  </span>
                </td>
                <td>
                  <div className="product-name" style={{ fontWeight: 500 }}>{reservation.productName}</div>
                  <small className="text-muted">{reservation.optionName}</small>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{reservation.memberName}</div>
                  <small className="text-muted">{reservation.memberPhone}</small>
                </td>
                <td>
                  <div>{reservation.useDate} {reservation.useTime}</div>
                  {reservation.nights && <small className="text-muted">{reservation.nights}박 (체크아웃: {reservation.checkOutDate})</small>}
                  {reservation.flightNo && <small className="text-muted">{reservation.flightNo}</small>}
                </td>
                <td>{reservation.persons}명</td>
                <td>
                  <div style={{ fontWeight: 600, color: '#2563eb' }}>{formatPrice(reservation.totalPrice)}</div>
                  <small className="text-muted">{reservation.paymentMethod}</small>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </td>
                <td>
                  {reservation.status === '완료' && (
                    reservation.reviewWritten ? (
                      <span style={{ color: '#10b981', fontSize: '0.75rem' }}><i className="bi bi-check-circle-fill"></i> 작성</span>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}><i className="bi bi-dash-circle"></i> 미작성</span>
                    )
                  )}
                  {reservation.status !== '완료' && <span style={{ color: '#d1d5db' }}>-</span>}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="상세보기" onClick={() => openDetailModal(reservation)}>
                      <i className="bi bi-eye"></i>
                    </button>
                    {reservation.status === '확정' && (
                      <>
                        <button className="btn-icon success" title="완료처리" onClick={() => updateStatus(reservation, '완료')}>
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button className="btn-icon warning" title="취소" onClick={() => openCancelModal(reservation)}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </>
                    )}
                    {(reservation.status === '확정' || reservation.status === '완료') && (
                      <button className="btn-icon danger" title="환불" onClick={() => openRefundModal(reservation)}>
                        <i className="bi bi-arrow-counterclockwise"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-calendar-x"></i>
            <p>조건에 맞는 예약 정보가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {isDetailModalOpen && selectedReservation && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>예약 상세 정보</h2>
              <button className="modal-close" onClick={() => setIsDetailModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="reservation-detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <div>
                  <div className="reservation-id-large" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937' }}>{selectedReservation.id}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px' }}>주문번호: {selectedReservation.orderNo}</div>
                </div>
                <span className={`status-badge large ${getStatusClass(selectedReservation.status)}`}>
                  {selectedReservation.status}
                </span>
              </div>

              <div className="detail-grid">
                {/* 상품 정보 */}
                <div className="detail-section">
                  <h3><i className="bi bi-bag" style={{ marginRight: '8px' }}></i>상품 정보</h3>
                  <div className="detail-row">
                    <span className="label">상품유형</span>
                    <span className="value">
                      <span className={`badge badge-${selectedReservation.productType === '체험' ? 'primary' : selectedReservation.productType === '숙박' ? 'success' : 'info'}`}>
                        {selectedReservation.productType}
                      </span>
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">상품명</span>
                    <span className="value">{selectedReservation.productName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">옵션</span>
                    <span className="value">{selectedReservation.optionName}</span>
                  </div>
                </div>

                {/* 판매자 정보 */}
                <div className="detail-section">
                  <h3><i className="bi bi-building" style={{ marginRight: '8px' }}></i>판매자 정보</h3>
                  <div className="detail-row">
                    <span className="label">사업자명</span>
                    <span className="value">{selectedReservation.businessName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">사업자번호</span>
                    <span className="value">{selectedReservation.businessNo}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">연락처</span>
                    <span className="value">{selectedReservation.businessPhone}</span>
                  </div>
                </div>

                {/* 예약자 정보 */}
                <div className="detail-section">
                  <h3><i className="bi bi-person" style={{ marginRight: '8px' }}></i>예약자 정보</h3>
                  <div className="detail-row">
                    <span className="label">회원ID</span>
                    <span className="value" style={{ color: '#2563eb', cursor: 'pointer' }}>{selectedReservation.memberId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">예약자명</span>
                    <span className="value">{selectedReservation.memberName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">연락처</span>
                    <span className="value">{selectedReservation.memberPhone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">이메일</span>
                    <span className="value">{selectedReservation.memberEmail}</span>
                  </div>
                </div>

                {/* 이용 정보 */}
                <div className="detail-section">
                  <h3><i className="bi bi-calendar-event" style={{ marginRight: '8px' }}></i>이용 정보</h3>
                  <div className="detail-row">
                    <span className="label">이용일시</span>
                    <span className="value">{selectedReservation.useDate} {selectedReservation.useTime}</span>
                  </div>
                  {selectedReservation.nights && (
                    <>
                      <div className="detail-row">
                        <span className="label">체크아웃</span>
                        <span className="value">{selectedReservation.checkOutDate}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">숙박일수</span>
                        <span className="value">{selectedReservation.nights}박</span>
                      </div>
                    </>
                  )}
                  {selectedReservation.flightNo && (
                    <>
                      <div className="detail-row">
                        <span className="label">편명</span>
                        <span className="value">{selectedReservation.flightNo}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">귀국편</span>
                        <span className="value">{selectedReservation.returnDate} {selectedReservation.returnTime}</span>
                      </div>
                    </>
                  )}
                  <div className="detail-row">
                    <span className="label">인원</span>
                    <span className="value">{selectedReservation.persons}명</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">예약일시</span>
                    <span className="value">{selectedReservation.createdAt}</span>
                  </div>
                </div>

                {/* 결제 정보 */}
                <div className="detail-section">
                  <h3><i className="bi bi-credit-card" style={{ marginRight: '8px' }}></i>결제 정보</h3>
                  <div className="detail-row">
                    <span className="label">상품금액</span>
                    <span className="value">{formatPrice(selectedReservation.originalPrice)}</span>
                  </div>
                  {selectedReservation.discountAmount > 0 && (
                    <div className="detail-row">
                      <span className="label">할인금액</span>
                      <span className="value" style={{ color: '#ef4444' }}>-{formatPrice(selectedReservation.discountAmount)}</span>
                    </div>
                  )}
                  {selectedReservation.pointUsed > 0 && (
                    <div className="detail-row">
                      <span className="label">포인트 사용</span>
                      <span className="value" style={{ color: '#ef4444' }}>-{formatPrice(selectedReservation.pointUsed)}</span>
                    </div>
                  )}
                  <div className="detail-row" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px', marginTop: '8px' }}>
                    <span className="label" style={{ fontWeight: 600 }}>최종 결제금액</span>
                    <span className="value price" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2563eb' }}>{formatPrice(selectedReservation.totalPrice)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">결제방법</span>
                    <span className="value">{selectedReservation.paymentMethod}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">적립 포인트</span>
                    <span className="value" style={{ color: '#10b981' }}>+{selectedReservation.earnedPoints}P</span>
                  </div>
                </div>

                {/* 요청사항 */}
                {selectedReservation.requests && (
                  <div className="detail-section full-width">
                    <h3><i className="bi bi-chat-text" style={{ marginRight: '8px' }}></i>요청사항</h3>
                    <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', color: '#374151', lineHeight: 1.6 }}>
                      {selectedReservation.requests}
                    </div>
                  </div>
                )}

                {/* 후기 정보 */}
                {selectedReservation.status === '완료' && (
                  <div className="detail-section full-width">
                    <h3><i className="bi bi-star" style={{ marginRight: '8px' }}></i>후기 정보</h3>
                    <div className="detail-row">
                      <span className="label">후기 작성</span>
                      <span className="value">
                        {selectedReservation.reviewWritten ? (
                          <span style={{ color: '#10b981' }}><i className="bi bi-check-circle-fill"></i> 작성 완료</span>
                        ) : (
                          <span style={{ color: '#9ca3af' }}><i className="bi bi-dash-circle"></i> 미작성</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* 취소/환불 정보 */}
                {(selectedReservation.status === '취소' || selectedReservation.status === '환불') && (
                  <div className="detail-section full-width" style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px' }}>
                    <h3 style={{ color: '#dc2626' }}><i className="bi bi-exclamation-triangle" style={{ marginRight: '8px' }}></i>{selectedReservation.status === '취소' ? '취소 정보' : '환불 정보'}</h3>
                    {selectedReservation.cancelReason && (
                      <div className="detail-row">
                        <span className="label">취소사유</span>
                        <span className="value">{selectedReservation.cancelReason}</span>
                      </div>
                    )}
                    {selectedReservation.refundReason && (
                      <div className="detail-row">
                        <span className="label">환불사유</span>
                        <span className="value">{selectedReservation.refundReason}</span>
                      </div>
                    )}
                    {selectedReservation.cancelDate && (
                      <div className="detail-row">
                        <span className="label">취소일</span>
                        <span className="value">{selectedReservation.cancelDate}</span>
                      </div>
                    )}
                    {selectedReservation.refundDate && (
                      <div className="detail-row">
                        <span className="label">환불일</span>
                        <span className="value">{selectedReservation.refundDate}</span>
                      </div>
                    )}
                    {selectedReservation.cancelFee > 0 && (
                      <div className="detail-row">
                        <span className="label">취소 수수료</span>
                        <span className="value" style={{ color: '#ef4444' }}>{formatPrice(selectedReservation.cancelFee)}</span>
                      </div>
                    )}
                    {selectedReservation.refundAmount > 0 && (
                      <div className="detail-row" style={{ borderTop: '1px solid #fecaca', paddingTop: '8px', marginTop: '8px' }}>
                        <span className="label" style={{ fontWeight: 600 }}>환불금액</span>
                        <span className="value" style={{ fontWeight: 700, color: '#dc2626' }}>{formatPrice(selectedReservation.refundAmount)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>닫기</button>
              {selectedReservation.status === '확정' && (
                <>
                  <button className="btn btn-success" onClick={() => { setIsDetailModalOpen(false); updateStatus(selectedReservation, '완료'); }}>완료 처리</button>
                  <button className="btn btn-warning" onClick={() => { setIsDetailModalOpen(false); openCancelModal(selectedReservation); }}>예약 취소</button>
                </>
              )}
              {(selectedReservation.status === '확정' || selectedReservation.status === '완료') && (
                <button className="btn btn-danger" onClick={() => { setIsDetailModalOpen(false); openRefundModal(selectedReservation); }}>환불 처리</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 취소 모달 */}
      {isCancelModalOpen && selectedReservation && (
        <div className="modal-overlay" onClick={() => setIsCancelModalOpen(false)}>
          <div className="modal-content small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>예약 취소</h2>
              <button className="modal-close" onClick={() => setIsCancelModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="cancel-info">
                <p><strong>예약번호:</strong> {selectedReservation.id}</p>
                <p><strong>상품명:</strong> {selectedReservation.productName}</p>
                <p><strong>예약자:</strong> {selectedReservation.memberName}</p>
              </div>
              <div className="form-group">
                <label>취소 사유 *</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="취소 사유를 입력하세요"
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsCancelModalOpen(false)}>닫기</button>
              <button className="btn btn-warning" onClick={cancelReservation} disabled={!cancelReason.trim()}>취소 처리</button>
            </div>
          </div>
        </div>
      )}

      {/* 환불 모달 */}
      {isRefundModalOpen && selectedReservation && (
        <div className="modal-overlay" onClick={() => setIsRefundModalOpen(false)}>
          <div className="modal-content small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>환불 처리</h2>
              <button className="modal-close" onClick={() => setIsRefundModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="cancel-info">
                <p><strong>예약번호:</strong> {selectedReservation.id}</p>
                <p><strong>상품명:</strong> {selectedReservation.productName}</p>
                <p><strong>예약자:</strong> {selectedReservation.memberName}</p>
                <p><strong>결제금액:</strong> {formatPrice(selectedReservation.totalPrice)}</p>
              </div>
              <div className="form-group">
                <label>환불 금액 *</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(parseInt(e.target.value) || 0)}
                  max={selectedReservation.totalPrice}
                />
                <small className="text-muted">최대 환불 가능 금액: {formatPrice(selectedReservation.totalPrice)}</small>
              </div>
              <div className="form-group">
                <label>환불 사유 *</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="환불 사유를 입력하세요"
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsRefundModalOpen(false)}>닫기</button>
              <button className="btn btn-danger" onClick={processRefund} disabled={!refundReason.trim() || refundAmount <= 0}>환불 처리</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reservations;
