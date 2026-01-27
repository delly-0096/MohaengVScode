import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import './Products.css';
import api from '../../api/api';

// 카테고리 목록
const categories = [
  { value: 'tour', label: '투어' },
  { value: 'activity', label: '액티비티' },
  { value: 'ticket', label: '입장권/티켓' },
  { value: 'class', label: '클래스/체험' },
  { value: 'transfer', label: '교통/이동' }
];

// 지역 코드 맵
const AREA_CODE_MAP = {
  '1': '서울', '2': '인천', '3': '대전', '4': '대구', '5': '광주',
  '6': '부산', '7': '울산', '8': '세종', '31': '경기', '32': '강원',
  '33': '충북', '34': '충남', '35': '경북', '36': '경남',
  '37': '전북', '38': '전남', '39': '제주'
};

// 소요시간 목록
const durations = [
  { value: 1, label: '1시간 이내' },
  { value: 3, label: '1~3시간' },
  { value: 6, label: '3~6시간' },
  { value: 24, label: '하루 이상' }
];

function Tours() {
  // 상태 관리
  const [toursData, setToursData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [selectedTour, setSelectedTour] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // 목록 조회
  const fetchTourList = (page = 1) => {
    api.get('/admin/products/tours', {
      params: { 
        currentPage: page,
        pageSize: pageSize
      }
    })
      .then(res => {
        console.log("API 응답 데이터:", res.data);
        setToursData(res.data.dataList || []);
        setTotalCount(res.data.totalRecord || 0);
        setCurrentPage(page);
      })
      .catch(err => console.error("목록 로딩 실패:", err));
  };

  // 상태 추가
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0
  });

  // 통계 조회 함수 추가
  const fetchTourStats = () => {
    api.get('/admin/products/tours/stats')
      .then(res => {
        setStats({
          total: res.data.TOTALCOUNT || 0,
          active: res.data.ACTIVECOUNT || 0,
          inactive: res.data.INACTIVECOUNT || 0,
          pending: res.data.PENDINGCOUNT || 0
        });
      })
      .catch(err => console.error("통계 로딩 실패:", err));
  };

  // 페이지 로드 시 목록 조회
  useEffect(() => {
    fetchTourList(1);
    fetchTourStats();
  }, []);

  // 필터링된 데이터
  const filteredData = toursData.filter(tour => {
    const search = searchTerm.toLowerCase();
    const title = tour.tripProdTitle || "";
    const content = tour.tripProdContent || "";

    const matchesSearch =
      title.toLowerCase().includes(search) ||
      content.toLowerCase().includes(search);

    const matchesStatus =
      filterStatus === 'all' || tour.approveStatus === filterStatus;

    const matchesCategory =
      filterCategory === 'all' || tour.prodCtgryType === filterCategory;

    const matchesRegion =
      filterRegion === 'all' || tour.ctyNm === filterRegion;

    return matchesSearch && matchesStatus && matchesCategory && matchesRegion;
  });

  // 금액 포맷
  const formatPrice = (price) => {
    if (!price) return '0원';
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // 카테고리 라벨
  const getCategoryLabel = (value) => {
    const found = categories.find(c => c.value === value);
    return found ? found.label : value || '기타';
  };

  // 지역 라벨
  const getRegionLabel = (code) => {
    return AREA_CODE_MAP[code] || code || '미지정';
  };

  // 소요시간 라벨
  const getDurationLabel = (value) => {
    if (!value) return '-';
    if (value <= 1) return '1시간 이내';
    if (value <= 3) return '1~3시간';
    if (value <= 6) return '3~6시간';
    return '하루 이상';
  };

  // 상세 모달 열기
  const openDetailModal = async (tour) => {
    try {
      const res = await api.get(`/admin/products/tours/${tour.tripProdNo}`);
      console.log('✅ 상세 응답:', res.data);

      if (res.data) {
        setSelectedTour(res.data);
        setIsDetailModalOpen(true);
      }
    } catch (e) {
      console.error("상세 조회 에러:", e);
      alert('상세 조회 실패');
    }
  };

  // 삭제 모달 열기
  const openDeleteModal = (tour) => {
    setSelectedTour(tour);
    setIsDeleteModalOpen(true);
  };

  // 상품 승인
  const handleApprove = async (tripProdNo) => {
    if (!window.confirm("이 상품을 승인하시겠습니까?")) return;

    try {
      const response = await api.patch(`/admin/products/tours/approve/${tripProdNo}`);
      if (response.status === 200) {
        alert("✅ 승인 완료!");
        setIsDetailModalOpen(false);
        fetchTourList(currentPage);
        fetchTourStats();
      }
    } catch (error) {
      console.error("승인 오류:", error);
      alert("승인 처리 중 오류가 발생했습니다.");
    }
  };

  // 판매 상태 토글
  const handleToggleSale = async (item) => {
    const isCurrentlySelling = item?.delYn === 'N' || !item?.delYn;
    const newDelYn = isCurrentlySelling ? 'Y' : 'N';
    const actionText = isCurrentlySelling ? "판매 중지" : "판매 재개";

    if (!window.confirm(`이 상품을 ${actionText} 하시겠습니까?`)) return;

    try {
      const response = await api.patch('/admin/products/tours/toggle-sale', {
        tripProdNo: item.tripProdNo,
        delYn: newDelYn
      });

      if (response.status === 200) {
        alert(`✅ ${actionText} 완료!`);
        setIsDetailModalOpen(false);
        fetchTourList();
      }
    } catch (error) {
      console.error("상태 변경 오류:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  // 목록에서 상태 토글
  const toggleStatus = async (tour) => {
    const nextDelYn = tour.approveStatus === '판매중' ? 'Y' : 'N';

    try {
      const res = await api.patch('/admin/products/tours/toggle-sale', {
        tripProdNo: tour.tripProdNo,
        delYn: nextDelYn
      });

      if (res.data > 0) {
        fetchTourList();
      }
    } catch (error) {
      console.error("토글 실패:", error);
    }
  };

  // 삭제
  const deleteTour = async () => {
    try {
      const response = await api.delete(`/admin/products/tours/delete/${selectedTour.tripProdNo}`);
      if (response.status === 200) {
        alert("✅ 삭제 완료!");
        setIsDeleteModalOpen(false);
        fetchTourList();
      }
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("❌ 삭제 실패!");
    }
  };

  // 엑셀 다운로드
  const downloadExcel = () => {
    const excelData = toursData.map((tour, index) => ({
      "번호": index + 1,
      "상품명": tour.tripProdTitle,
      "카테고리": getCategoryLabel(tour.prodCtgryType),
      "지역": getRegionLabel(tour.ctyNm),
      "판매상태": tour.approveStatus,
      "판매가": tour.price ? `${tour.price.toLocaleString()}원` : '-',
      "재고": tour.curStock || 0,
      "등록일": tour.regDt || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "투어상품리스트");

    const fileName = `모행_투어상품관리_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalCount / pageSize);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchTourList(page);
    }
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>투어/체험/티켓 관리</h1>
        <button className="btn-acc-excel" onClick={downloadExcel}>
          <i className="bi bi-file-earmark-excel-fill me-2"></i>
          엑셀 다운로드
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-ticket-perforated"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">전체 상품</span>
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
            <i className="bi bi-pause-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.inactive}</span>
            <span className="stat-label">판매중지</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <i className="bi bi-clock"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">승인대기</span>
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
              placeholder="상품명, 설명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">전체 상태</option>
              <option value="판매중">판매중</option>
              <option value="판매중지">판매중지</option>
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">전체 카테고리</option>
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
              <option value="all">전체 지역</option>
              {Object.entries(AREA_CODE_MAP).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 상품 목록 테이블 */}
      <div className="data-table-container" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>상품명</th>
              <th>카테고리</th>
              <th>지역</th>
              <th>판매가</th>
              <th>재고</th>
              <th>상태</th>
              <th style={{ width: '140px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(tour => (
              <tr key={tour.tripProdNo}>
                <td>
                  <div className="product-name" onClick={() => openDetailModal(tour)}>
                    {tour.tripProdTitle}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {getDurationLabel(tour.leadTime)}
                  </div>
                </td>
                <td>
                  <span className="badge badge-info">{getCategoryLabel(tour.prodCtgryType)}</span>
                </td>
                <td>{getRegionLabel(tour.ctyNm)}</td>
                <td>
                  <div style={{ fontWeight: 500, color: '#2563eb' }}>{formatPrice(tour.price)}</div>
                  {tour.discount > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#dc2626' }}>{tour.discount}% 할인</div>
                  )}
                </td>
                <td>
                  <span className={tour.curStock === 0 ? 'text-danger' : ''}>
                    {tour.curStock || 0}개
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${tour.approveStatus === '판매중' ? 'active' : 'inactive'}`}>
                    {tour.approveStatus || '승인대기'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="상세보기" onClick={() => openDetailModal(tour)}>
                      <i className="bi bi-eye"></i>
                    </button>
                    <button 
                      className={`btn-icon ${tour.approveStatus === '판매중' ? 'status-active' : 'status-inactive'}`}
                      title={tour.approveStatus === '판매중' ? '판매 중지' : '판매 시작'} 
                      onClick={() => toggleStatus(tour)}
                    >
                      <i className={`bi ${tour.approveStatus === '판매중' ? 'bi-pause-circle-fill' : 'bi-play-circle-fill'}`}></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-ticket-perforated"></i>
            <p>조건에 맞는 상품 정보가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4px',
          marginTop: '20px',
          marginBottom: '20px'
        }}>
          <button
            className="btn-page"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              background: currentPage === 1 ? '#f3f4f6' : '#fff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              color: currentPage === 1 ? '#9ca3af' : '#374151'
            }}
          >
            <i className="bi bi-chevron-double-left"></i>
          </button>
          <button
            className="btn-page"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              background: currentPage === 1 ? '#f3f4f6' : '#fff',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              color: currentPage === 1 ? '#9ca3af' : '#374151'
            }}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                padding: '8px 14px',
                border: '1px solid',
                borderColor: currentPage === page ? '#3b82f6' : '#e5e7eb',
                borderRadius: '6px',
                background: currentPage === page ? '#3b82f6' : '#fff',
                color: currentPage === page ? '#fff' : '#374151',
                cursor: 'pointer',
                fontWeight: currentPage === page ? 600 : 400
              }}
            >
              {page}
            </button>
          ))}
          
          <button
            className="btn-page"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              background: currentPage === totalPages ? '#f3f4f6' : '#fff',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              color: currentPage === totalPages ? '#9ca3af' : '#374151'
            }}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
          <button
            className="btn-page"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              background: currentPage === totalPages ? '#f3f4f6' : '#fff',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              color: currentPage === totalPages ? '#9ca3af' : '#374151'
            }}
          >
            <i className="bi bi-chevron-double-right"></i>
          </button>
          
          <span style={{ marginLeft: '16px', color: '#6b7280', fontSize: '0.875rem' }}>
            총 {totalCount}개 중 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)}
          </span>
        </div>
      )}

      {/* 상세 모달 */}
      {isDetailModalOpen && selectedTour && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>상품 상세 정보</h2>
              <button className="modal-close" onClick={() => setIsDetailModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="detail-grid">
                {/* 기본 정보 */}
                <div className="detail-section">
                  <h3><i className="bi bi-info-circle"></i> 기본 정보</h3>
                  <div className="detail-row">
                    <span className="label">상품명</span>
                    <span className="value">{selectedTour.tripProdTitle}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">카테고리</span>
                    <span className="value">{getCategoryLabel(selectedTour.prodCtgryType)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">지역</span>
                    <span className="value">{getRegionLabel(selectedTour.ctyNm)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">소요시간</span>
                    <span className="value">{getDurationLabel(selectedTour.leadTime)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">위치</span>
                    <span className="value">{selectedTour.addr1} {selectedTour.addr2}</span>
                  </div>
                </div>

                {/* 가격 정보 */}
                <div className="detail-section">
                  <h3><i className="bi bi-currency-dollar"></i> 가격/재고 정보</h3>
                  <div className="detail-row">
                    <span className="label">정가</span>
                    <span className="value">{formatPrice(selectedTour.netprc)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">판매가</span>
                    <span className="value" style={{ color: '#2563eb', fontWeight: 600 }}>{formatPrice(selectedTour.price)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">할인율</span>
                    <span className="value">{selectedTour.discount || 0}%</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">재고</span>
                    <span className="value">{selectedTour.curStock || 0}개</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">판매 기간</span>
                    <span className="value">
                      {selectedTour.saleStartDt} ~ {selectedTour.saleEndDt}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">상태</span>
                    <span className={`status-badge ${selectedTour.approveStatus === '판매중' ? 'active' : 'inactive'}`}>
                      {selectedTour.approveStatus || '승인대기'}
                    </span>
                  </div>
                </div>

                {/* 이미지 */}
                {selectedTour.imageList && selectedTour.imageList.length > 0 && (
                  <div className="detail-section full-width">
                    <h3><i className="bi bi-images"></i> 상품 이미지</h3>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                      {selectedTour.imageList.map((image, idx) => (
                        <img
                          key={image.fileNo || idx}
                          src={`http://localhost:8272/upload${image.filePath}`}
                          alt={`상품 이미지 ${idx + 1}`}
                          style={{
                            width: '150px',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 상품 설명 */}
                <div className="detail-section full-width">
                  <h3><i className="bi bi-card-text"></i> 상품 설명</h3>
                  <p style={{ margin: '8px 0 0 0', color: '#374151', lineHeight: 1.6 }}>
                    {selectedTour.tripProdContent || '-'}
                  </p>
                </div>

                {/* 이용 안내 */}
                <div className="detail-section full-width">
                  <h3><i className="bi bi-clock"></i> 이용 안내</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>운영 시간</div>
                      <div>{selectedTour.prodRuntime || '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>소요 시간</div>
                      <div>{selectedTour.prodDuration || '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>연령 제한</div>
                      <div>{selectedTour.prodLimAge || '-'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>최소/최대 인원</div>
                      <div>{selectedTour.prodMinPeople || 1}명 ~ {selectedTour.prodMaxPeople || 99}명</div>
                    </div>
                  </div>
                </div>

                {/* 예약 가능 시간 */}
                <div className="detail-section full-width">
                  <h3><i className="bi bi-calendar-check"></i> 예약 가능 시간</h3>
                  <div className="amenities-list" style={{ marginTop: '8px' }}>
                    {selectedTour.prodTimeList && selectedTour.prodTimeList.length > 0 ? (
                      selectedTour.prodTimeList.map((time, idx) => (
                        <span key={idx} className="amenity-tag">{time.rsvtAvailableTime}</span>
                      ))
                    ) : (
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>등록된 시간 없음</span>
                    )}
                  </div>
                </div>

                {/* 포함/불포함 사항 */}
                <div className="detail-section">
                  <h3><i className="bi bi-check-circle"></i> 포함 사항</h3>
                  <pre style={{ margin: '8px 0 0 0', fontFamily: 'inherit', whiteSpace: 'pre-wrap', color: '#374151' }}>
                    {selectedTour.prodInclude || '-'}
                  </pre>
                </div>
                <div className="detail-section">
                  <h3><i className="bi bi-x-circle"></i> 불포함 사항</h3>
                  <pre style={{ margin: '8px 0 0 0', fontFamily: 'inherit', whiteSpace: 'pre-wrap', color: '#374151' }}>
                    {selectedTour.prodExclude || '-'}
                  </pre>
                </div>

                {/* 유의 사항 */}
                {selectedTour.prodNotice && (
                  <div className="detail-section full-width">
                    <h3><i className="bi bi-exclamation-triangle"></i> 유의 사항</h3>
                    <p style={{ margin: '8px 0 0 0', color: '#374151', lineHeight: 1.6 }}>
                      {selectedTour.prodNotice}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                {selectedTour.aprvYn !== 'Y' && (
                  <button 
                    className="btn" 
                    style={{ background: '#10b981', color: '#fff', border: 'none' }}
                    onClick={() => handleApprove(selectedTour.tripProdNo)}
                  >
                    <i className="bi bi-check-all me-1"></i> 승인
                  </button>
                )}
                <button 
                  className="btn btn-outline"
                  onClick={() => handleToggleSale(selectedTour)}
                >
                  {selectedTour.delYn === 'Y' ? '판매 재개' : '판매 중지'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>닫기</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && selectedTour && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>상품 삭제</h2>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="confirm-message">
                <i className="bi bi-exclamation-triangle text-warning"></i>
                <p>정말로 <strong>{selectedTour.tripProdTitle}</strong>을(를) 삭제하시겠습니까?</p>
                <p className="text-muted">이 작업은 되돌릴 수 없습니다.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>취소</button>
              <button className="btn btn-danger" onClick={deleteTour}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tours;