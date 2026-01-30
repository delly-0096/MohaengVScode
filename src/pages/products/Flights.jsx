import { useEffect, useState } from 'react';
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
    economySeats: 45,
    businessSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
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
    economySeats: 23,
    businessSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
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
    economySeats: 0,
    businessSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
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
    economySeats: 120,
    businessSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
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
    economySeats: 89,
    businessSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
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
    economySeats: 65,
    businessSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
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
    economySeats: 34,
    businessSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
    saleStartDate: '2024-12-05',
    saleEndDate: '2024-12-25',
    flightDate: '2024-12-28',
    status: '매진',
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
    economySeats: 42,
    businessSeats: 0,
    checkedBaggage: '15kg x 1개',
    cabinBaggage: '10kg x 1개',
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


function fetchFlightList() {
  console.log("asdfasdf");
};

// main
function Flights() {
  const [flightsData, setFlightsData] = useState(initialFlightsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAirline, setFilterAirline] = useState('all');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchFlightList();
  }, []);


  // 통계 계산 - 판매종료
  const stats = {
    total: flightsData.length,
    active: flightsData.filter(f => f.status === '판매중').length,
    soldout: flightsData.filter(f => f.status === '매진').length,
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

  // 입력 필드 변경 핸들러
  const handleInputChange = (field, value) => {
    setSelectedFlight(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>항공권 관리</h1>
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
      </div>

      {/* 필터 및 검색 */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="편명, 항공사, 출발지, 도착지 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">전체 상태</option>
              <option value="판매중">판매중</option>
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
                <div className="detail-section full-width">
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
                {/* <div className="detail-section">
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
                </div> */}

                {/* 좌석 등급별 가격 */}
                <div className="detail-section full-width">
                  <h3><i className="bi bi-cash-stack"></i> 좌석 등급별 가격 / 잔여석</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '12px' }}>
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
                  </div>
                </div>

                {/* 수하물 정보 */}
                <div className="detail-section full-width">
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
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Flights;
