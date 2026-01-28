import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  RiSearchLine,
  RiFilterLine,
  RiEyeLine,
  RiFileDownloadLine,
  RiBankCardLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiCloseCircleLine,
  RiMoneyDollarCircleLine,
  RiUserLine,
  RiStore2Line,
  RiPhoneLine,
  RiMailLine,
  RiPercentLine,
  RiCoinLine,
  RiRefund2Line,
  RiCalendarLine
} from 'react-icons/ri';
import { Modal } from '../../components/common/Modal';

// 상태값 매핑
const statusLabels = {
  'DONE': { label: '이용 완료', className: 'badge-success', icon: RiCheckboxCircleLine },
  'WAIT': { label: '이용 예정', className: 'badge-warning', icon: RiTimeLine },
  'CANCEL': { label: '취소 완료', className: 'badge-danger', icon: RiCloseCircleLine }
};

function Payments() {
  const [paymentsData, setPaymentsData] = useState([]);
  const [stats, setStats] = useState({ 
    totalCount: 0, 
    completedCount: 0, 
    pendingCount: 0, 
    cancelledCount: 0,
    totalAmount: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('1month');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [detailModal, setDetailModal] = useState({ isOpen: false, payment: null });

  // 통계 데이터 로딩
  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:8272/api/admin/transactions/payments/stats');
      setStats(res.data);
    } catch (err) {
      console.error("통계 로딩 실패:", err);
      // 통계는 실패해도 목록은 보여줌
    }
  };

  // 결제 목록 데이터 로딩
  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:8272/api/admin/transactions/payments/list', {
        params: { 
          page: currentPage, 
          searchTerm: searchTerm.trim(), 
          statusFilter, 
          dateFilter 
        }
      });
      
      // 응답 구조에 따라 유연하게 처리
      if (res.data.dataList) {
        setPaymentsData(res.data.dataList);
        setTotalPages(res.data.totalPages || 1);
      } else if (Array.isArray(res.data)) {
        setPaymentsData(res.data);
      } else {
        setPaymentsData([]);
      }
    } catch (err) {
      console.error("결제 목록 로딩 실패:", err);
      setError("데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
      setPaymentsData([]);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로딩
  useEffect(() => {
    fetchStats();
  }, []);

  // 필터/페이지 변경시 재로딩
  useEffect(() => {
    fetchPayments();
  }, [currentPage, statusFilter, dateFilter]);

  // 포맷팅 함수들
  const formatBrno = (num) => {
    if (!num) return "-";
    const cleaned = num.toString().replace(/\D/g, '');
    return cleaned.length === 10 
      ? cleaned.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') 
      : num;
  };

  const formatTel = (num) => {
    if (!num) return "-";
    const cleaned = num.toString().replace(/\D/g, '');
    if (cleaned.startsWith('02')) {
      return cleaned.length === 9
        ? cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
        : cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return cleaned.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    // "YYYY-MM-DD HH:mm:ss" 형식을 "YYYY.MM.DD HH:mm"로 변환
    return dateStr.replace(/-/g, '.').substring(0, 16);
  };

  // 검색 처리
  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      setCurrentPage(1);
      fetchPayments();
    }
  };

  // 엑셀 다운로드
  const handleExcelDownload = async () => {
    try {
      const response = await axios.get('http://localhost:8272/api/admin/transactions/payments/excel', {
        params: { searchTerm, statusFilter, dateFilter },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `결제내역_${new Date().toISOString().slice(0,10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("엑셀 다운로드 실패:", err);
      alert("엑셀 다운로드에 실패했습니다.");
    }
  };

  // 상세보기
  const handleViewDetail = async (payment) => {
    try {
      // 상세 정보가 필요한 경우 추가 API 호출
      const res = await axios.get(`http://localhost:8272/api/admin/transactions/payments/${payment.payNo}`);
      setDetailModal({ isOpen: true, payment: res.data });
    } catch (err) {
      console.error("상세 정보 로딩 실패:", err);
      // API 실패시 기본 데이터로 모달 열기
      setDetailModal({ isOpen: true, payment });
    }
  };

  return (
    <div className="page">
      {/* 헤더 */}
      <div className="page-header">
        <div>
          <h1 className="page-title">결제내역 관리</h1>
          <p className="page-subtitle">예약 및 결제 내역을 관리합니다</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={handleExcelDownload}>
            <RiFileDownloadLine /> 엑셀 다운로드
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        <StatCard 
          bg="linear-gradient(135deg, #4A90D9, #357ABD)" 
          icon={<RiBankCardLine />} 
          value={stats.totalCount} 
          label="전체 결제" 
          color="var(--primary-color)"
        />
        <StatCard 
          bg="linear-gradient(135deg, #10b981, #059669)" 
          icon={<RiCheckboxCircleLine />} 
          value={stats.completedCount} 
          label="이용 완료" 
          color="#10b981"
        />
        <StatCard 
          bg="linear-gradient(135deg, #f59e0b, #d97706)" 
          icon={<RiTimeLine />} 
          value={stats.pendingCount} 
          label="이용 예정" 
          color="#f59e0b"
        />
        <StatCard 
          bg="linear-gradient(135deg, #8b5cf6, #7c3aed)" 
          icon={<RiMoneyDollarCircleLine />} 
          value={`₩${(stats.totalAmount || 0).toLocaleString()}`} 
          label="총 결제금액" 
          color="#8b5cf6"
        />
      </div>

      {/* 메인 카드 */}
      <div className="card">
        {/* 검색 및 필터 */}
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input 
              type="text" 
              className="form-input" 
              placeholder="주문번호, 회원명, 상품명, 판매자 검색" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
            />
          </div>
          <div className="filter-group" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <RiFilterLine />
            <select 
              className="form-input form-select" 
              value={statusFilter} 
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 상태</option>
              <option value="WAIT">이용 예정</option>
              <option value="DONE">이용 완료</option>
              <option value="CANCEL">취소/환불</option>
            </select>
            <select 
              className="form-input form-select" 
              value={dateFilter} 
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{ width: 'auto' }}
            >
              <option value="1month">최근 1개월</option>
              <option value="3months">최근 3개월</option>
              <option value="6months">최근 6개월</option>
              <option value="all">전체</option>
            </select>
          </div>
        </div>

        {/* 테이블 */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>상품정보</th>
                <th style={{ width: 140 }}>결제자</th>
                <th style={{ width: 120 }}>결제금액</th>
                <th style={{ width: 100 }}>결제수단</th>
                <th style={{ width: 100 }}>상태</th>
                <th style={{ width: 160 }}>결제일시</th>
                <th style={{ width: 60 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <div className="spinner"></div>
                      <span style={{ color: 'var(--text-secondary)' }}>데이터를 불러오는 중입니다...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ color: '#ef4444' }}>{error}</div>
                    <button 
                      className="btn btn-primary" 
                      onClick={fetchPayments}
                      style={{ marginTop: 12 }}
                    >
                      다시 시도
                    </button>
                  </td>
                </tr>
              ) : Array.isArray(paymentsData) && paymentsData.length > 0 ? (
                paymentsData.map(item => (
                  <tr 
                    key={item.payNo} 
                    style={{ opacity: item.payStatus === 'CANCEL' ? 0.7 : 1 }}
                  >
                    <td>
                      <div>
                        <div 
                          className="font-medium" 
                          style={{ cursor: 'pointer', marginBottom: 4 }} 
                          onClick={() => handleViewDetail(item)}
                        >
                          {item.prodName || item.itemTitle || '-'}
                        </div>
                        <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                          {item.bzmnNm || '-'}
                        </div>
                        <div className="text-secondary" style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                          {item.orderNo || '-'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{item.memName || '-'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {item.memEmail || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="font-medium" style={{ 
                      color: item.payStatus === 'CANCEL' ? '#9ca3af' : 'var(--primary-color)' 
                    }}>
                      {item.payStatus === 'CANCEL' ? (
                        <del>₩{(item.payTotalAmt || 0).toLocaleString()}</del>
                      ) : (
                        `₩${(item.payTotalAmt || 0).toLocaleString()}`
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <RiBankCardLine style={{ color: 'var(--primary-color)' }} />
                        <span style={{ fontSize: '0.85rem' }}>
                          {item.payMethodCd || '-'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span 
                        className={`badge ${statusLabels[item.payStatus]?.className || 'badge-secondary'}`} 
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {statusLabels[item.payStatus]?.label || item.payStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {formatDate(item.payDt)}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="table-action-btn" 
                          title="상세보기"
                          onClick={() => handleViewDetail(item)}
                        >
                          <RiEyeLine />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ color: 'var(--text-secondary)' }}>
                      검색 결과가 없습니다.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {!loading && paymentsData.length > 0 && (
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <button className="pagination-btn active">{currentPage}</button>
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= totalPages}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, payment: null })}
        title="결제 상세정보"
        size="large"
      >
        {detailModal.payment && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* 상태 뱃지 */}
            <div style={{ textAlign: 'center', padding: 16, background: '#f8fafc', borderRadius: 8, marginBottom: 20 }}>
              <span className={`badge ${statusLabels[detailModal.payment.payStatus]?.className}`} style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
                {statusLabels[detailModal.payment.payStatus]?.label}
              </span>
            </div>

            {/* 상품 정보 */}
            <div style={{ display: 'flex', gap: 16, padding: 16, background: '#f8fafc', borderRadius: 8, marginBottom: 20 }}>
              {detailModal.payment.productImage && (
                <img
                  src={detailModal.payment.productImage}
                  alt={detailModal.payment.prodName || detailModal.payment.itemTitle}
                  style={{ width: 100, height: 100, borderRadius: 8, objectFit: 'cover' }}
                />
              )}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>
                  {detailModal.payment.prodName || detailModal.payment.itemTitle}
                </h4>
                {detailModal.payment.useDate && (
                  <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#64748b' }}>
                    {detailModal.payment.useDate}
                  </p>
                )}
                {detailModal.payment.option && (
                  <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#64748b' }}>
                    {detailModal.payment.option}
                  </p>
                )}
              </div>
            </div>

            {/* 결제 정보 */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiBankCardLine /> 결제 정보
              </h5>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">주문번호</span>
                  <span className="detail-value font-medium">{detailModal.payment.orderNo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">결제일시</span>
                  <span className="detail-value">{formatDate(detailModal.payment.payDt)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">결제수단</span>
                  <span className="detail-value">
                    {detailModal.payment.payMethodCd}
                    {detailModal.payment.cardNo && detailModal.payment.cardNo !== '-' && ` (${detailModal.payment.cardNo})`}
                  </span>
                </div>
              </div>
            </div>

            {/* 결제 금액 */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiMoneyDollarCircleLine /> 결제 금액
              </h5>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">상품 금액</span>
                  <span className="detail-value">
                    ₩{(
                      (detailModal.payment.discount || 0) + 
                      (detailModal.payment.usePoint || 0) + 
                      (detailModal.payment.payTotalAmt || 0)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiPercentLine style={{ marginRight: 4 }} />할인</span>
                  <span className="detail-value" style={{ color: '#ef4444' }}>
                    {detailModal.payment.discount > 0 ? `-₩${detailModal.payment.discount.toLocaleString()}` : '₩0'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiCoinLine style={{ marginRight: 4 }} />포인트 사용</span>
                  <span className="detail-value" style={{ color: '#ef4444' }}>
                    {detailModal.payment.usePoint > 0 ? `-₩${detailModal.payment.usePoint.toLocaleString()}` : '₩0'}
                  </span>
                </div>
                <div className="detail-item" style={{ borderTop: '1px solid #e2e8f0', marginTop: 8, paddingTop: 12 }}>
                  <span className="detail-label font-medium">총 결제금액</span>
                  <span className="detail-value font-medium" style={{ fontSize: '1.125rem', color: 'var(--primary-color)' }}>
                    ₩{detailModal.payment.payTotalAmt.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 적립 정보 */}
            {detailModal.payment.payStatus !== 'CANCEL' && (
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiCoinLine /> 적립 정보
                </h5>
                <div className="detail-list">
                  <div className="detail-item">
                    <span className="detail-label">적립 포인트</span>
                    <span className="detail-value" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                      +{Math.floor(detailModal.payment.payTotalAmt * 0.1).toLocaleString()}P
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 취소/환불 정보 */}
            {detailModal.payment.payStatus === 'CANCEL' && (
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ef4444', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiRefund2Line /> 환불 정보
                </h5>
                <div className="detail-list">
                  {detailModal.payment.cancelReason && (
                    <div className="detail-item">
                      <span className="detail-label">취소 사유</span>
                      <span className="detail-value">{detailModal.payment.cancelReason}</span>
                    </div>
                  )}
                  {detailModal.payment.cancelledAt && (
                    <div className="detail-item">
                      <span className="detail-label">환불 완료일</span>
                      <span className="detail-value">{formatDate(detailModal.payment.cancelledAt)}</span>
                    </div>
                  )}
                  {detailModal.payment.cancelFee > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">취소 수수료</span>
                      <span className="detail-value" style={{ color: '#f59e0b' }}>-₩{detailModal.payment.cancelFee.toLocaleString()}</span>
                    </div>
                  )}
                  {detailModal.payment.refundAmount && (
                    <div className="detail-item" style={{ borderTop: '1px solid #e2e8f0', marginTop: 8, paddingTop: 12 }}>
                      <span className="detail-label font-medium">환불 금액</span>
                      <span className="detail-value font-medium" style={{ fontSize: '1.125rem', color: '#10b981' }}>
                        ₩{detailModal.payment.refundAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {detailModal.payment.refundPoints > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">포인트 환급</span>
                      <span className="detail-value" style={{ color: 'var(--primary-color)' }}>
                        +{detailModal.payment.refundPoints.toLocaleString()}P
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 결제자 정보 */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiUserLine /> 결제자 정보
              </h5>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">결제자명</span>
                  <span className="detail-value">{detailModal.payment.memName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiPhoneLine style={{ marginRight: 4 }} />연락처</span>
                  <span className="detail-value">{formatTel(detailModal.payment.memTel)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiMailLine style={{ marginRight: 4 }} />이메일</span>
                  <span className="detail-value">{detailModal.payment.memEmail}</span>
                </div>
              </div>
            </div>

            {/* 판매자 정보 */}
            <div>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiStore2Line /> 판매자 정보
              </h5>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">상호명</span>
                  <span className="detail-value">{detailModal.payment.bzmnNm}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">사업자번호</span>
                  <span className="detail-value">{formatBrno(detailModal.payment.brno)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">연락처</span>
                  <span className="detail-value">{formatTel(detailModal.payment.compTel)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// StatCard 컴포넌트
function StatCard({ bg, icon, value, label, color }) {
  return (
    <div className="card stat-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ 
          width: 48, 
          height: 48, 
          borderRadius: 12, 
          background: bg, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'white', 
          fontSize: '1.25rem' 
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: color }}>
            {value}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;