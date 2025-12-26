import { useState } from 'react';
import './Products.css';

// 국내 공항 목록
const domesticAirports = [
  { code: 'GMP', name: '김포' },
  { code: 'ICN', name: '인천' },
  { code: 'CJU', name: '제주' },
  { code: 'PUS', name: '김해(부산)' },
  { code: 'TAE', name: '대구' },
  { code: 'CJJ', name: '청주' },
  { code: 'KWJ', name: '광주' },
  { code: 'RSU', name: '여수' },
  { code: 'USN', name: '울산' },
  { code: 'MWX', name: '무안' },
  { code: 'KUV', name: '군산' },
  { code: 'WJU', name: '원주' },
  { code: 'YNY', name: '양양' },
  { code: 'HIN', name: '사천' },
  { code: 'POF', name: '포항' }
];

// 샘플 항공권 데이터 (국내선만)
const initialFlightsData = [
  {
    id: 1,
    flightNo: 'KE1201',
    airline: '대한항공',
    departure: '김포(GMP)',
    arrival: '제주(CJU)',
    departureTime: '07:00',
    arrivalTime: '08:10',
    aircraftType: 'Boeing 737-900',
    economyPrice: 89000,
    businessPrice: 0,
    firstPrice: 0,
    economySeats: 45,
    businessSeats: 0,
    firstSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
    hasMeal: false,
    hasEntertainment: false,
    hasWifi: false,
    hasUsb: true,
    saleStartDate: '2024-12-01',
    saleEndDate: '2024-12-20',
    flightDate: '2024-12-25',
    status: '판매중',
    businessName: '대한항공(주)',
    createdAt: '2024-12-01',
    lastModified: '2024-12-15'
  },
  {
    id: 2,
    flightNo: 'OZ8123',
    airline: '아시아나항공',
    departure: '김포(GMP)',
    arrival: '제주(CJU)',
    departureTime: '08:30',
    arrivalTime: '09:40',
    aircraftType: 'Airbus A321',
    economyPrice: 85000,
    businessPrice: 0,
    firstPrice: 0,
    economySeats: 23,
    businessSeats: 0,
    firstSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
    hasMeal: false,
    hasEntertainment: false,
    hasWifi: false,
    hasUsb: true,
    saleStartDate: '2024-12-02',
    saleEndDate: '2024-12-22',
    flightDate: '2024-12-26',
    status: '판매중',
    businessName: '아시아나항공(주)',
    createdAt: '2024-12-02',
    lastModified: '2024-12-10'
  },
  {
    id: 3,
    flightNo: 'TW701',
    airline: '티웨이항공',
    departure: '김포(GMP)',
    arrival: '제주(CJU)',
    departureTime: '09:00',
    arrivalTime: '10:10',
    aircraftType: 'Boeing 737-800',
    economyPrice: 65000,
    businessPrice: 0,
    firstPrice: 0,
    economySeats: 0,
    businessSeats: 0,
    firstSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
    hasMeal: false,
    hasEntertainment: false,
    hasWifi: false,
    hasUsb: true,
    saleStartDate: '2024-12-03',
    saleEndDate: '2024-12-23',
    flightDate: '2024-12-27',
    status: '매진',
    businessName: '티웨이항공(주)',
    createdAt: '2024-12-03',
    lastModified: '2024-12-12'
  },
  {
    id: 4,
    flightNo: 'LJ501',
    airline: '진에어',
    departure: '김포(GMP)',
    arrival: '부산(PUS)',
    departureTime: '10:30',
    arrivalTime: '11:30',
    aircraftType: 'Boeing 737-800',
    economyPrice: 72000,
    businessPrice: 0,
    firstPrice: 0,
    economySeats: 120,
    businessSeats: 0,
    firstSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
    hasMeal: false,
    hasEntertainment: false,
    hasWifi: false,
    hasUsb: true,
    saleStartDate: '2024-12-05',
    saleEndDate: '2024-12-25',
    flightDate: '2024-12-28',
    status: '판매중',
    businessName: '진에어(주)',
    createdAt: '2024-12-05',
    lastModified: '2024-12-08'
  },
  {
    id: 5,
    flightNo: '7C111',
    airline: '제주항공',
    departure: '김포(GMP)',
    arrival: '제주(CJU)',
    departureTime: '11:00',
    arrivalTime: '12:10',
    aircraftType: 'Boeing 737-800',
    economyPrice: 59000,
    businessPrice: 0,
    firstPrice: 0,
    economySeats: 89,
    businessSeats: 0,
    firstSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
    hasMeal: false,
    hasEntertainment: false,
    hasWifi: false,
    hasUsb: true,
    saleStartDate: '2024-12-10',
    saleEndDate: '2024-12-28',
    flightDate: '2024-12-30',
    status: '판매중',
    businessName: '제주항공(주)',
    createdAt: '2024-12-10',
    lastModified: '2024-12-18'
  },
  {
    id: 6,
    flightNo: 'BX8801',
    airline: '에어부산',
    departure: '부산(PUS)',
    arrival: '제주(CJU)',
    departureTime: '08:00',
    arrivalTime: '09:00',
    aircraftType: 'Airbus A321',
    economyPrice: 55000,
    businessPrice: 0,
    firstPrice: 0,
    economySeats: 65,
    businessSeats: 0,
    firstSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
    hasMeal: false,
    hasEntertainment: false,
    hasWifi: false,
    hasUsb: true,
    saleStartDate: '2024-12-08',
    saleEndDate: '2024-12-26',
    flightDate: '2024-12-29',
    status: '판매중',
    businessName: '에어부산(주)',
    createdAt: '2024-12-08',
    lastModified: '2024-12-14'
  },
  {
    id: 7,
    flightNo: 'KE1401',
    airline: '대한항공',
    departure: '김포(GMP)',
    arrival: '광주(KWJ)',
    departureTime: '14:00',
    arrivalTime: '14:55',
    aircraftType: 'Boeing 737-800',
    economyPrice: 78000,
    businessPrice: 0,
    firstPrice: 0,
    economySeats: 34,
    businessSeats: 0,
    firstSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
    hasMeal: false,
    hasEntertainment: false,
    hasWifi: false,
    hasUsb: true,
    saleStartDate: '2024-12-05',
    saleEndDate: '2024-12-25',
    flightDate: '2024-12-28',
    status: '판매중지',
    businessName: '대한항공(주)',
    createdAt: '2024-12-05',
    lastModified: '2024-12-20'
  },
  {
    id: 8,
    flightNo: 'OZ8501',
    airline: '아시아나항공',
    departure: '김포(GMP)',
    arrival: '여수(RSU)',
    departureTime: '16:30',
    arrivalTime: '17:30',
    aircraftType: 'Airbus A320',
    economyPrice: 82000,
    businessPrice: 0,
    firstPrice: 0,
    economySeats: 42,
    businessSeats: 0,
    firstSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
    hasMeal: false,
    hasEntertainment: false,
    hasWifi: false,
    hasUsb: true,
    saleStartDate: '2024-12-06',
    saleEndDate: '2024-12-24',
    flightDate: '2024-12-27',
    status: '판매중',
    businessName: '아시아나항공(주)',
    createdAt: '2024-12-06',
    lastModified: '2024-12-15'
  }
];

// 항공사 목록
const airlines = ['대한항공', '아시아나항공', '티웨이항공', '진에어', '제주항공', '에어부산', '이스타항공'];

function Flights() {
  const [flightsData, setFlightsData] = useState(initialFlightsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAirline, setFilterAirline] = useState('all');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 통계 계산
  const stats = {
    total: flightsData.length,
    active: flightsData.filter(f => f.status === '판매중').length,
    soldout: flightsData.filter(f => f.status === '매진').length,
    inactive: flightsData.filter(f => f.status === '판매중지').length
  };

  // 필터링된 데이터
  const filteredData = flightsData.filter(flight => {
    const matchesSearch = flight.flightNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flight.airline.includes(searchTerm) ||
                         flight.departure.includes(searchTerm) ||
                         flight.arrival.includes(searchTerm) ||
                         flight.businessName.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || flight.status === filterStatus;
    const matchesAirline = filterAirline === 'all' || flight.airline === filterAirline;
    return matchesSearch && matchesStatus && matchesAirline;
  });

  // 총 잔여석 계산
  const getTotalSeats = (flight) => {
    return (flight.economySeats || 0) + (flight.businessSeats || 0) + (flight.firstSeats || 0);
  };

  // 최저가 계산
  const getLowestPrice = (flight) => {
    const prices = [flight.economyPrice, flight.businessPrice, flight.firstPrice].filter(p => p > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  // 금액 포맷
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // 상세 모달 열기
  const openDetailModal = (flight) => {
    setSelectedFlight(flight);
    setIsDetailModalOpen(true);
  };

  // 수정 모달 열기
  const openEditModal = (flight) => {
    setSelectedFlight({ ...flight });
    setIsEditModalOpen(true);
  };

  // 추가 모달 열기
  const openAddModal = () => {
    setSelectedFlight({
      id: null,
      flightNo: '',
      airline: '대한항공',
      departure: '',
      arrival: '',
      departureTime: '',
      arrivalTime: '',
      aircraftType: '',
      economyPrice: 0,
      businessPrice: 0,
      firstPrice: 0,
      economySeats: 0,
      businessSeats: 0,
      firstSeats: 0,
      checkedBaggage: '',
      cabinBaggage: '',
      hasMeal: false,
      hasEntertainment: false,
      hasWifi: false,
      hasUsb: false,
      saleStartDate: '',
      saleEndDate: '',
      flightDate: '',
      status: '판매중',
      businessName: '',
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    });
    setIsAddModalOpen(true);
  };

  // 삭제 모달 열기
  const openDeleteModal = (flight) => {
    setSelectedFlight(flight);
    setIsDeleteModalOpen(true);
  };

  // 항공권 저장 (추가/수정)
  const saveFlight = () => {
    if (selectedFlight.id) {
      // 수정
      setFlightsData(prev => prev.map(f =>
        f.id === selectedFlight.id
          ? { ...selectedFlight, lastModified: new Date().toISOString().split('T')[0] }
          : f
      ));
    } else {
      // 추가
      const newId = Math.max(...flightsData.map(f => f.id)) + 1;
      setFlightsData(prev => [...prev, { ...selectedFlight, id: newId }]);
    }
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
  };

  // 항공권 삭제
  const deleteFlight = () => {
    setFlightsData(prev => prev.filter(f => f.id !== selectedFlight.id));
    setIsDeleteModalOpen(false);
  };

  // 상태 변경
  const toggleStatus = (flight) => {
    const statusOrder = ['판매중', '판매중지', '매진'];
    const currentIndex = statusOrder.indexOf(flight.status);
    const newStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    setFlightsData(prev => prev.map(f =>
      f.id === flight.id
        ? { ...f, status: newStatus, lastModified: new Date().toISOString().split('T')[0] }
        : f
    ));
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (field, value) => {
    setSelectedFlight(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 기내 서비스 목록
  const services = [
    { key: 'hasMeal', label: '기내식' },
    { key: 'hasEntertainment', label: '엔터테인먼트' },
    { key: 'hasWifi', label: 'WiFi' },
    { key: 'hasUsb', label: 'USB 충전' }
  ];

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>항공권 관리</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="bi bi-plus-lg"></i> 항공권 등록
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-airplane"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">전체 항공권</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="bi bi-check-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">판매중</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <i className="bi bi-x-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.soldout}</span>
            <span className="stat-label">매진</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <i className="bi bi-pause-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.inactive}</span>
            <span className="stat-label">판매중지</span>
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
              placeholder="편명, 항공사, 출발지, 도착지, 사업자명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">전체 상태</option>
              <option value="판매중">판매중</option>
              <option value="판매중지">판매중지</option>
              <option value="매진">매진</option>
            </select>
            <select value={filterAirline} onChange={(e) => setFilterAirline(e.target.value)}>
              <option value="all">전체 항공사</option>
              {airlines.map(airline => (
                <option key={airline} value={airline}>{airline}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 항공권 목록 테이블 */}
      <div className="data-table-container" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>편명</th>
              <th>항공사</th>
              <th>노선</th>
              <th>운항일</th>
              <th>최저가</th>
              <th>잔여석</th>
              <th>상태</th>
              <th style={{ width: '140px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(flight => (
              <tr key={flight.id}>
                <td>
                  <div className="product-name" onClick={() => openDetailModal(flight)}>
                    {flight.flightNo}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {flight.departureTime} ~ {flight.arrivalTime}
                  </div>
                </td>
                <td>
                  <span className="badge badge-info">{flight.airline}</span>
                </td>
                <td>
                  <div style={{ whiteSpace: 'nowrap' }}>
                    {flight.departure} → {flight.arrival}
                  </div>
                </td>
                <td>{flight.flightDate}</td>
                <td style={{ fontWeight: 500, color: '#2563eb' }}>{formatPrice(getLowestPrice(flight))}</td>
                <td>
                  <span className={getTotalSeats(flight) === 0 ? 'text-danger' : ''}>
                    {getTotalSeats(flight)}석
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${flight.status === '판매중' ? 'active' : flight.status === '매진' ? 'soldout' : 'inactive'}`}>
                    {flight.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="상세보기" onClick={() => openDetailModal(flight)}>
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn-icon" title="수정" onClick={() => openEditModal(flight)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn-icon" title="상태변경" onClick={() => toggleStatus(flight)}>
                      <i className={`bi ${flight.status === '판매중' ? 'bi-pause' : 'bi-play'}`}></i>
                    </button>
                    <button className="btn-icon danger" title="삭제" onClick={() => openDeleteModal(flight)}>
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
            <i className="bi bi-airplane"></i>
            <p>조건에 맞는 항공권 정보가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {isDetailModalOpen && selectedFlight && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>항공권 상세 정보</h2>
              <button className="modal-close" onClick={() => setIsDetailModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                {/* 항공편 정보 */}
                <div className="detail-section">
                  <h3><i className="bi bi-airplane"></i> 항공편 정보</h3>
                  <div className="detail-row">
                    <span className="label">항공사</span>
                    <span className="value">{selectedFlight.airline}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">항공편명</span>
                    <span className="value">{selectedFlight.flightNo}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">노선</span>
                    <span className="value">{selectedFlight.departure} → {selectedFlight.arrival}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">운항시간</span>
                    <span className="value">{selectedFlight.departureTime} ~ {selectedFlight.arrivalTime}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">기종</span>
                    <span className="value">{selectedFlight.aircraftType || '-'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">운항일</span>
                    <span className="value">{selectedFlight.flightDate}</span>
                  </div>
                </div>

                {/* 판매 정보 */}
                <div className="detail-section">
                  <h3><i className="bi bi-calendar-check"></i> 판매 정보</h3>
                  <div className="detail-row">
                    <span className="label">사업자</span>
                    <span className="value">{selectedFlight.businessName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">판매 기간</span>
                    <span className="value">{selectedFlight.saleStartDate} ~ {selectedFlight.saleEndDate}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">등록일</span>
                    <span className="value">{selectedFlight.createdAt}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">최종 수정일</span>
                    <span className="value">{selectedFlight.lastModified}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">상태</span>
                    <span className={`status-badge ${selectedFlight.status === '판매중' ? 'active' : selectedFlight.status === '매진' ? 'soldout' : 'inactive'}`}>
                      {selectedFlight.status}
                    </span>
                  </div>
                </div>

                {/* 좌석 등급별 가격 */}
                <div className="detail-section full-width">
                  <h3><i className="bi bi-cash-stack"></i> 좌석 등급별 가격 / 잔여석</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '12px' }}>
                    <div style={{ padding: '16px', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>이코노미</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2563eb' }}>{formatPrice(selectedFlight.economyPrice || 0)}</div>
                      <div style={{ fontSize: '0.8rem', color: '#059669', marginTop: '4px' }}>잔여 {selectedFlight.economySeats || 0}석</div>
                    </div>
                    <div style={{ padding: '16px', background: '#dbeafe', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>비즈니스</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2563eb' }}>{formatPrice(selectedFlight.businessPrice || 0)}</div>
                      <div style={{ fontSize: '0.8rem', color: '#059669', marginTop: '4px' }}>잔여 {selectedFlight.businessSeats || 0}석</div>
                    </div>
                    <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>퍼스트</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2563eb' }}>{formatPrice(selectedFlight.firstPrice || 0)}</div>
                      <div style={{ fontSize: '0.8rem', color: '#059669', marginTop: '4px' }}>잔여 {selectedFlight.firstSeats || 0}석</div>
                    </div>
                  </div>
                </div>

                {/* 수하물 정보 */}
                <div className="detail-section">
                  <h3><i className="bi bi-luggage"></i> 수하물 정보</h3>
                  <div className="detail-row">
                    <span className="label">무료 위탁 수하물</span>
                    <span className="value">{selectedFlight.checkedBaggage || '-'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">기내 수하물</span>
                    <span className="value">{selectedFlight.cabinBaggage || '-'}</span>
                  </div>
                </div>

                {/* 기내 서비스 */}
                <div className="detail-section">
                  <h3><i className="bi bi-cup-hot"></i> 기내 서비스</h3>
                  <div className="amenities-list" style={{ marginTop: '8px' }}>
                    {selectedFlight.hasMeal && <span className="amenity-tag">기내식</span>}
                    {selectedFlight.hasEntertainment && <span className="amenity-tag">엔터테인먼트</span>}
                    {selectedFlight.hasWifi && <span className="amenity-tag">WiFi</span>}
                    {selectedFlight.hasUsb && <span className="amenity-tag">USB 충전</span>}
                    {!selectedFlight.hasMeal && !selectedFlight.hasEntertainment && !selectedFlight.hasWifi && !selectedFlight.hasUsb && (
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>제공되는 서비스 없음</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>닫기</button>
              <button className="btn btn-primary" onClick={() => { setIsDetailModalOpen(false); openEditModal(selectedFlight); }}>수정</button>
            </div>
          </div>
        </div>
      )}

      {/* 수정/추가 모달 */}
      {(isEditModalOpen || isAddModalOpen) && selectedFlight && (
        <div className="modal-overlay" onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isAddModalOpen ? '항공권 등록' : '항공권 수정'}</h2>
              <button className="modal-close" onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              {/* 항공편 정보 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                  <i className="bi bi-airplane" style={{ marginRight: '8px' }}></i>항공편 정보
                </h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>항공사 *</label>
                    <select
                      value={selectedFlight.airline}
                      onChange={(e) => handleInputChange('airline', e.target.value)}
                    >
                      {airlines.map(airline => (
                        <option key={airline} value={airline}>{airline}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>항공편명 *</label>
                    <input
                      type="text"
                      value={selectedFlight.flightNo}
                      onChange={(e) => handleInputChange('flightNo', e.target.value)}
                      placeholder="예: KE123"
                    />
                  </div>
                  <div className="form-group">
                    <label>출발지 *</label>
                    <select
                      value={selectedFlight.departure}
                      onChange={(e) => handleInputChange('departure', e.target.value)}
                    >
                      <option value="">선택하세요</option>
                      {domesticAirports.map(airport => (
                        <option key={airport.code} value={`${airport.name}(${airport.code})`}>
                          {airport.name}({airport.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>도착지 *</label>
                    <select
                      value={selectedFlight.arrival}
                      onChange={(e) => handleInputChange('arrival', e.target.value)}
                    >
                      <option value="">선택하세요</option>
                      {domesticAirports.map(airport => (
                        <option key={airport.code} value={`${airport.name}(${airport.code})`}>
                          {airport.name}({airport.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>출발 시간 *</label>
                    <input
                      type="time"
                      value={selectedFlight.departureTime}
                      onChange={(e) => handleInputChange('departureTime', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>도착 시간 *</label>
                    <input
                      type="time"
                      value={selectedFlight.arrivalTime}
                      onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>기종</label>
                    <input
                      type="text"
                      value={selectedFlight.aircraftType}
                      onChange={(e) => handleInputChange('aircraftType', e.target.value)}
                      placeholder="예: Boeing 737-800"
                    />
                  </div>
                  <div className="form-group">
                    <label>사업자명 *</label>
                    <input
                      type="text"
                      value={selectedFlight.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="사업자명을 입력하세요"
                    />
                  </div>
                </div>
              </div>

              {/* 좌석 등급별 가격 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                  <i className="bi bi-cash-stack" style={{ marginRight: '8px' }}></i>좌석 등급별 가격
                </h4>
                <div className="form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <div className="form-group">
                    <label>이코노미 가격 (원)</label>
                    <input
                      type="number"
                      value={selectedFlight.economyPrice}
                      onChange={(e) => handleInputChange('economyPrice', parseInt(e.target.value) || 0)}
                      min="0"
                      step="1000"
                    />
                  </div>
                  <div className="form-group">
                    <label>비즈니스 가격 (원)</label>
                    <input
                      type="number"
                      value={selectedFlight.businessPrice}
                      onChange={(e) => handleInputChange('businessPrice', parseInt(e.target.value) || 0)}
                      min="0"
                      step="1000"
                    />
                  </div>
                  <div className="form-group">
                    <label>퍼스트 가격 (원)</label>
                    <input
                      type="number"
                      value={selectedFlight.firstPrice}
                      onChange={(e) => handleInputChange('firstPrice', parseInt(e.target.value) || 0)}
                      min="0"
                      step="1000"
                    />
                  </div>
                </div>
              </div>

              {/* 좌석 등급별 잔여석 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                  <i className="bi bi-person-workspace" style={{ marginRight: '8px' }}></i>좌석 등급별 잔여석
                </h4>
                <div className="form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <div className="form-group">
                    <label>이코노미 잔여석</label>
                    <input
                      type="number"
                      value={selectedFlight.economySeats}
                      onChange={(e) => handleInputChange('economySeats', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>비즈니스 잔여석</label>
                    <input
                      type="number"
                      value={selectedFlight.businessSeats}
                      onChange={(e) => handleInputChange('businessSeats', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>퍼스트 잔여석</label>
                    <input
                      type="number"
                      value={selectedFlight.firstSeats}
                      onChange={(e) => handleInputChange('firstSeats', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* 수하물 정보 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                  <i className="bi bi-luggage" style={{ marginRight: '8px' }}></i>수하물 정보
                </h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>무료 위탁 수하물</label>
                    <input
                      type="text"
                      value={selectedFlight.checkedBaggage}
                      onChange={(e) => handleInputChange('checkedBaggage', e.target.value)}
                      placeholder="예: 23kg x 1개"
                    />
                  </div>
                  <div className="form-group">
                    <label>기내 수하물</label>
                    <input
                      type="text"
                      value={selectedFlight.cabinBaggage}
                      onChange={(e) => handleInputChange('cabinBaggage', e.target.value)}
                      placeholder="예: 10kg x 1개"
                    />
                  </div>
                </div>
              </div>

              {/* 기내 서비스 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                  <i className="bi bi-cup-hot" style={{ marginRight: '8px' }}></i>기내 서비스
                </h4>
                <div className="checkbox-group">
                  {services.map(service => (
                    <label key={service.key} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedFlight[service.key]}
                        onChange={(e) => handleInputChange(service.key, e.target.checked)}
                      />
                      {service.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* 판매 기간 */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                  <i className="bi bi-calendar-range" style={{ marginRight: '8px' }}></i>판매 기간
                </h4>
                <div className="form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <div className="form-group">
                    <label>운항일 *</label>
                    <input
                      type="date"
                      value={selectedFlight.flightDate}
                      onChange={(e) => handleInputChange('flightDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>판매 시작일</label>
                    <input
                      type="date"
                      value={selectedFlight.saleStartDate}
                      onChange={(e) => handleInputChange('saleStartDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>판매 종료일</label>
                    <input
                      type="date"
                      value={selectedFlight.saleEndDate}
                      onChange={(e) => handleInputChange('saleEndDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 상태 (수정 시에만) */}
              {isEditModalOpen && (
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px', color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                    <i className="bi bi-toggle-on" style={{ marginRight: '8px' }}></i>판매 상태
                  </h4>
                  <div className="form-group" style={{ maxWidth: '200px' }}>
                    <select
                      value={selectedFlight.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <option value="판매중">판매중</option>
                      <option value="판매중지">판매중지</option>
                      <option value="매진">매진</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}>취소</button>
              <button className="btn btn-primary" onClick={saveFlight}>
                {isAddModalOpen ? '등록' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && selectedFlight && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>항공권 삭제</h2>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="confirm-message">
                <i className="bi bi-exclamation-triangle text-warning"></i>
                <p>정말로 <strong>{selectedFlight.flightNo}</strong> 항공권을 삭제하시겠습니까?</p>
                <p className="text-muted">이 작업은 되돌릴 수 없습니다.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>취소</button>
              <button className="btn btn-danger" onClick={deleteFlight}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Flights;
