import { useEffect, useState } from 'react';
import '../products/Products.css';
import api from '../../api/api';

// 문의 카테고리
const categories = [
  { value: 'product', label: '상품 문의' },
  { value: 'booking', label: '예약/일정' },
  { value: 'price', label: '가격/결제' },
  { value: 'cancel', label: '취소/환불' },
  { value: 'other', label: '기타 문의' },
  { value: 'room', label: '객실 문의' },
  { value: 'facility', label: '시설/서비스' }
];

// 상태 (SECRET_YN: Y=비밀글, N=공개글, H=숨김)
const statuses = [
  { value: 'all', label: '전체 상태' },
  { value: 'WAIT', label: '답변대기' },
  { value: 'DONE', label: '답변완료' },
  { value: 'HIDDEN', label: '숨김' }
];

// 기간 프리셋
const periodPresets = [
  { value: 'today', label: '오늘' },
  { value: 'week', label: '이번 주' },
  { value: 'month', label: '이번 달' },
  { value: '3months', label: '최근 3개월' },
  { value: 'custom', label: '직접 선택' }
];

function ProductInquiries() {
  // 상태 관리
  const [inquiriesData, setInquiriesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // 통계 상태
  const [stats, setStats] = useState({
    total: 0,
    waiting: 0,
    answered: 0,
    today: 0,
    hidden: 0
  });

  // 기간 계산
  const calculateDateRange = (period) => {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    let start = '';

    switch (period) {
      case 'today':
        start = end;
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        start = weekAgo.toISOString().split('T')[0];
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        start = monthAgo.toISOString().split('T')[0];
        break;
      case '3months':
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        start = threeMonthsAgo.toISOString().split('T')[0];
        break;
      default:
        return null;
    }

    return { start, end };
  };

  // 기간 프리셋 변경
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (period !== 'custom') {
      const range = calculateDateRange(period);
      if (range) {
        setDateRange(range);
      }
    }
  };

  // 목록 조회
  const fetchInquiryList = (page = 1) => {
    api.get('/admin/inquiries', {
      params: {
        currentPage: page,
        searchWord: searchTerm,
        searchCategory: filterCategory,
        searchStatus: filterStatus,
        startDate: dateRange.start,
        endDate: dateRange.end
      }
    })
      .then(res => {
        console.log("문의 목록 API 응답:", res.data);
        setInquiriesData(res.data.dataList || []);
        setTotalCount(res.data.totalRecord || 0);
        setCurrentPage(page);
      })
      .catch(err => console.error("문의 목록 로딩 실패:", err));
  };

  // 통계 조회
  const fetchInquiryStats = () => {
    api.get('/admin/inquiries/stats', {
      params: {
        startDate: dateRange.start,
        endDate: dateRange.end
      }
    })
      .then(res => {
        setStats({
          total: res.data.TOTALCOUNT || 0,
          waiting: res.data.WAITINGCOUNT || 0,
          answered: res.data.ANSWEREDCOUNT || 0,
          today: res.data.TODAYCOUNT || 0,
          hidden: res.data.HIDDENCOUNT || 0
        });
      })
      .catch(err => console.error("통계 로딩 실패:", err));
  };

  // 초기 로드
  useEffect(() => {
    const range = calculateDateRange('month');
    if (range) {
      setDateRange(range);
    }
  }, []);

  // dateRange 변경 시 데이터 로드
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchInquiryList(1);
      fetchInquiryStats();
    }
  }, [dateRange]);

  // 필터 변경 시 데이터 로드
  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      fetchInquiryList(1);
    }
  }, [searchTerm, filterStatus, filterCategory]);

  // 숫자 포맷
  const formatNum = (num) => new Intl.NumberFormat('ko-KR').format(num || 0);

  // 카테고리 라벨
  const getCategoryLabel = (value) => {
    const found = categories.find(c => c.value === value);
    return found ? found.label : value || '기타';
  };

  // 날짜 포맷
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    if (dateStr.includes('T')) {
      return dateStr.split('T')[0];
    }
    return dateStr.split(' ')[0];
  };

  // 날짜+시간 포맷
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 상태 표시 (INQRY_STATUS: WAIT/DONE/HIDDEN)
  const getStatusDisplay = (inquiry) => {
    if (inquiry.inqryStatus === 'HIDDEN') return '숨김';
    if (inquiry.inqryStatus === 'DONE') return '답변완료';
    return '답변대기';
  };

  // 숨김 여부 확인
  const isHiddenInquiry = (inquiry) => inquiry.inqryStatus === 'HIDDEN';

  // 비밀글 여부 (Y/N만)
  const isSecretInquiry = (inquiry) => inquiry.secretYn === 'Y';

  // 상세 모달 열기
  const openDetailModal = async (inquiry) => {
    try {
      const res = await api.get(`/admin/inquiries/${inquiry.prodInqryNo}`);
      if (res.data) {
        setSelectedInquiry(res.data);
        setIsDetailModalOpen(true);
      }
    } catch (e) {
      console.error("상세 조회 에러:", e);
      alert('상세 조회 실패');
    }
  };

  // 숨김 처리
  const handleHide = async (prodInqryNo) => {
    if (!window.confirm("이 문의를 숨김 처리하시겠습니까?\n사용자 페이지에서 보이지 않게 됩니다.")) return;

    try {
      const response = await api.patch(`/admin/inquiries/${prodInqryNo}/hide`);
      if (response.status === 200) {
        alert("✅ 숨김 처리 완료!");
        setIsDetailModalOpen(false);
        fetchInquiryList(currentPage);
        fetchInquiryStats();
      }
    } catch (error) {
      console.error("숨김 처리 오류:", error);
      alert("숨김 처리 중 오류가 발생했습니다.");
    }
  };

  // 숨김 해제
  const handleUnhide = async (prodInqryNo) => {
    if (!window.confirm("이 문의의 숨김을 해제하시겠습니까?")) return;

    try {
      const response = await api.patch(`/admin/inquiries/${prodInqryNo}/unhide`);
      if (response.status === 200) {
        alert("✅ 숨김 해제 완료!");
        setIsDetailModalOpen(false);
        fetchInquiryList(currentPage);
        fetchInquiryStats();
      }
    } catch (error) {
      console.error("숨김 해제 오류:", error);
      alert("숨김 해제 중 오류가 발생했습니다.");
    }
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
      fetchInquiryList(page);
    }
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>상품 문의 관리</h1>
      </div>

      {/* 통계 카드 - Tours.jsx 스타일 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-chat-square-text-fill"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{formatNum(stats.total)}</span>
            <span className="stat-label">전체 문의</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <i className="bi bi-clock-fill"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{formatNum(stats.waiting)}</span>
            <span className="stat-label">답변 대기</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{formatNum(stats.answered)}</span>
            <span className="stat-label">답변 완료</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="bi bi-calendar-check-fill"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{formatNum(stats.today)}</span>
            <span className="stat-label">오늘 문의</span>
          </div>
        </div>
      </div>

      {/* 기간 선택 */}
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {periodPresets.map(preset => (
              <button
                key={preset.value}
                onClick={() => handlePeriodChange(preset.value)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: selectedPeriod === preset.value ? '#3b82f6' : '#f1f5f9',
                  color: selectedPeriod === preset.value ? '#fff' : '#64748b',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-calendar3" style={{ color: '#64748b' }}></i>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => {
                setSelectedPeriod('custom');
                setDateRange({ ...dateRange, start: e.target.value });
              }}
              style={{
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
            />
            <span style={{ color: '#94a3b8' }}>~</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => {
                setSelectedPeriod('custom');
                setDateRange({ ...dateRange, end: e.target.value });
              }}
              style={{
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
            />
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
              placeholder="상품명, 문의내용, 회원명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              {statuses.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">전체 카테고리</option>
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 문의 목록 테이블 */}
      <div className="data-table-container" style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ width: '100%', tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '110px' }}>카테고리</th>
              <th style={{ width: '200px' }}>상품명</th>
              <th style={{ width: '300px' }}>문의 내용</th>
              <th style={{ width: '110px' }}>문의자</th>
              <th style={{ width: '110px' }}>판매자</th>
              <th style={{ width: '100px' }}>상태</th>
              <th style={{ width: '100px' }}>등록일</th>
              <th style={{ width: '80px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {inquiriesData.map(inquiry => {
              const statusDisplay = getStatusDisplay(inquiry);
              const isHidden = isHiddenInquiry(inquiry);

              return (
                <tr
                  key={inquiry.prodInqryNo}
                  style={isHidden ? {
                    backgroundColor: '#f1f5f9',
                    opacity: 0.7
                  } : {}}
                >
                  <td>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: '#e0e7ff',
                      color: '#4f46e5',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {getCategoryLabel(inquiry.inquiryCtgry)}
                    </span>
                  </td>
                  <td>
                    <div className="product-name" onClick={() => openDetailModal(inquiry)} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inquiry.productName || '상품명 없음'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      상품번호: {inquiry.tripProdNo}
                    </div>
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <div style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {isSecretInquiry(inquiry) && (
                        <i className="bi bi-lock-fill" style={{ color: '#f59e0b', flexShrink: 0 }} title="비밀글"></i>
                      )}
                      {isHidden && (
                        <i className="bi bi-eye-slash-fill" style={{ color: '#94a3b8', flexShrink: 0 }} title="숨김"></i>
                      )}
                      <span style={{ color: isHidden ? '#94a3b8' : '#1e293b' }}>
                        {inquiry.prodInqryCn}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <i className="bi bi-person" style={{ color: '#94a3b8' }}></i>
                      <span>{inquiry.inquiryNickname || '-'}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <i className="bi bi-building" style={{ color: '#3b82f6' }}></i>
                      <span style={{ fontSize: '0.85rem' }}>{inquiry.sellerName || '-'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      statusDisplay === '답변완료' ? 'active' :
                      statusDisplay === '답변대기' ? 'pending' : 'inactive'
                    }`}>
                      {statusDisplay}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {formatDate(inquiry.regDt)}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="상세보기" onClick={() => openDetailModal(inquiry)}>
                        <i className="bi bi-eye"></i>
                      </button>
                      {isHidden ? (
                        <button
                          className="btn-icon"
                          title="숨김 해제"
                          onClick={() => handleUnhide(inquiry.prodInqryNo)}
                          style={{ color: '#10b981' }}
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                      ) : (
                        <button
                          className="btn-icon"
                          title="숨김 처리"
                          onClick={() => handleHide(inquiry.prodInqryNo)}
                          style={{ color: '#94a3b8' }}
                        >
                          <i className="bi bi-eye-slash"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {inquiriesData.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-chat-square-text"></i>
            <p>조건에 맞는 문의가 없습니다.</p>
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
      {isDetailModalOpen && selectedInquiry && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>문의 상세 정보</h2>
              <button className="modal-close" onClick={() => setIsDetailModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">

                {/* 상품 정보 섹션 */}
                <div className="detail-section" style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
                    <i className="bi bi-bag-fill" style={{ color: '#4f46e5' }}></i>
                    <span>상품 정보</span>
                    {/* 상태 배지 */}
                    <span style={{
                      marginLeft: 'auto',
                      padding: '6px 14px',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      background: getStatusDisplay(selectedInquiry) === '답변완료' ? '#dcfce7' :
                                  getStatusDisplay(selectedInquiry) === '답변대기' ? '#fef3c7' : '#f1f5f9',
                      color: getStatusDisplay(selectedInquiry) === '답변완료' ? '#166534' :
                             getStatusDisplay(selectedInquiry) === '답변대기' ? '#92400e' : '#64748b'
                    }}>
                      {getStatusDisplay(selectedInquiry)}
                    </span>
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>상품명</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>
                        {selectedInquiry.productName || '상품명 없음'}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>상품번호</span>
                        <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '4px' }}>
                          #{selectedInquiry.tripProdNo}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>문의 카테고리</span>
                        <div style={{ marginTop: '4px' }}>
                          <span style={{
                            background: '#e0e7ff',
                            color: '#4f46e5',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 600
                          }}>
                            {getCategoryLabel(selectedInquiry.inquiryCtgry)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 문의자/판매자 정보 */}
                <div className="detail-section" style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px' }}>
                    <i className="bi bi-people-fill" style={{ color: '#4f46e5' }}></i>
                    <span>문의자 / 판매자</span>
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>
                        <i className="bi bi-person me-1"></i>문의자
                      </div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>
                        {selectedInquiry.inquiryNickname || '-'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                        회원번호: {selectedInquiry.inquiryMemNo}
                      </div>
                    </div>
                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '8px' }}>
                        <i className="bi bi-building me-1"></i>판매자
                      </div>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>
                        {selectedInquiry.sellerName || '-'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                        회원번호: {selectedInquiry.sellerMemNo || '-'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 문의 내용 */}
                <div className="detail-section full-width" style={{ marginTop: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <i className="bi bi-chat-quote-fill" style={{ color: '#3b82f6' }}></i>
                    <span>문의 내용</span>
                    {isSecretInquiry(selectedInquiry) && (
                      <span style={{
                        marginLeft: '8px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: '#fef3c7',
                        color: '#92400e',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        <i className="bi bi-lock me-1"></i>비밀글
                      </span>
                    )}
                    {isHiddenInquiry(selectedInquiry) && (
                      <span style={{
                        marginLeft: '8px',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: '#f1f5f9',
                        color: '#64748b',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        <i className="bi bi-eye-slash me-1"></i>숨김 처리됨
                      </span>
                    )}
                    <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>
                      {formatDateTime(selectedInquiry.regDt)}
                    </span>
                  </h3>

                  <div style={{
                    padding: '20px',
                    background: '#eef2ff',
                    borderRadius: '12px',
                    borderLeft: '4px solid #4f46e5'
                  }}>
                    <div style={{ fontWeight: 600, color: '#4f46e5', marginBottom: '12px' }}>Q. 문의</div>
                    <p style={{
                      margin: 0,
                      color: '#1e293b',
                      lineHeight: 1.8,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {selectedInquiry.prodInqryCn}
                    </p>
                  </div>
                </div>

                {/* 답변 내용 */}
                <div className="detail-section full-width" style={{ marginTop: '24px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <i className="bi bi-reply-fill" style={{ color: '#10b981' }}></i>
                    <span>판매자 답변</span>
                    {selectedInquiry.replyDt && (
                      <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>
                        {formatDateTime(selectedInquiry.replyDt)}
                      </span>
                    )}
                  </h3>

                  {selectedInquiry.replyCn ? (
                    <div style={{
                      padding: '20px',
                      background: '#f0fdf4',
                      borderRadius: '12px',
                      borderLeft: '4px solid #10b981'
                    }}>
                      <div style={{ fontWeight: 600, color: '#059669', marginBottom: '12px' }}>A. 답변</div>
                      <p style={{
                        margin: 0,
                        color: '#1e293b',
                        lineHeight: 1.8,
                        whiteSpace: 'pre-wrap'
                      }}>
                        {selectedInquiry.replyCn}
                      </p>
                    </div>
                  ) : (
                    <div style={{
                      padding: '32px',
                      background: '#fef3c7',
                      borderRadius: '12px',
                      textAlign: 'center',
                      color: '#92400e'
                    }}>
                      <i className="bi bi-clock" style={{ fontSize: '2rem', marginBottom: '8px', display: 'block' }}></i>
                      <div style={{ fontWeight: 600 }}>아직 답변이 등록되지 않았습니다</div>
                      <div style={{ fontSize: '0.875rem', marginTop: '4px', color: '#b45309' }}>
                        판매자의 답변을 기다리고 있습니다
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="modal-footer" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '28px 36px',
              background: '#f1f5f9',
              borderTop: '1px solid #e2e8f0',
              borderBottomLeftRadius: '24px',
              borderBottomRightRadius: '24px',
              marginTop: '24px'
            }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                {/* 상태 배지 */}
                <span style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: isHiddenInquiry(selectedInquiry) ? '#f1f5f9' : '#dcfce7',
                  color: isHiddenInquiry(selectedInquiry) ? '#64748b' : '#166534',
                  border: `1px solid ${isHiddenInquiry(selectedInquiry) ? '#e2e8f0' : '#bbf7d0'}`
                }}>
                  {isHiddenInquiry(selectedInquiry) ? '🚫 숨김 처리됨' : '✅ 정상 문의'}
                </span>

                {/* 숨김/해제 버튼 */}
                {isHiddenInquiry(selectedInquiry) ? (
                  <button
                    className="btn"
                    onClick={() => handleUnhide(selectedInquiry.prodInqryNo)}
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <i className="bi bi-eye me-1"></i> 숨김 해제
                  </button>
                ) : (
                  <button
                    className="btn"
                    onClick={() => handleHide(selectedInquiry.prodInqryNo)}
                    style={{
                      border: '2px solid #ef4444',
                      color: '#ef4444',
                      background: 'transparent',
                      padding: '10px 20px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <i className="bi bi-eye-slash me-1"></i> 숨김 처리
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsDetailModalOpen(false)}
                  style={{ padding: '12px 24px', borderRadius: '12px', fontWeight: 600 }}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductInquiries;
