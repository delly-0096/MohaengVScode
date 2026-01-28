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
  RiCalendarLine,
  RiShoppingBagLine
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
    totalRevenue: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('1month');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const pageSize = 10;
  const [detailModal, setDetailModal] = useState({ isOpen: false, payment: null, details: [] });

  // 통계 데이터 로딩
  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:8272/api/admin/transactions/payments/stats');
      setStats({
        totalCount: res.data.TOTAL_COUNT || 0,
        completedCount: res.data.COMPLETED_COUNT || 0,
        pendingCount: res.data.PENDING_COUNT || 0,
        totalRevenue: res.data.TOTAL_REVENUE || 0
      });
    } catch (err) {
      console.error("통계 로딩 실패:", err);
    }
  };

  // 결제 목록 데이터 로딩
  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    
    console.log('🔍 검색 파라미터:', {
      page: currentPage,
      searchWord: searchTerm.trim(),
      searchType: statusFilter === 'all' ? '' : statusFilter
    });
    
    try {
      const res = await axios.get('http://localhost:8272/api/admin/transactions/payments/list', {
        params: { 
          page: currentPage,
          searchWord: searchTerm.trim(),
          searchType: statusFilter === 'all' ? '' : statusFilter
        }
      });
      
      console.log('✅ 응답 데이터:', res.data);
      
      // PaginationInfoVO 구조에 맞게 처리
      if (res.data) {
        setPaymentsData(res.data.dataList || []);
        setTotalRecord(res.data.totalRecord || 0);
        setTotalPages(res.data.totalPage || 1);
      } else {
        setPaymentsData([]);
        setTotalRecord(0);
        setTotalPages(1);
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
  }, [currentPage, statusFilter]); // statusFilter 변경시 자동으로 fetchPayments 호출

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
  const handleSearch = () => {
    setCurrentPage(1);
    fetchPayments();
  };

  // 엑셀 다운로드
  const handleExcelDownload = async () => {
    try {
      const response = await axios.get('http://localhost:8272/api/admin/transactions/payments/excel', {
        params: { 
          searchWord: searchTerm,
          searchType: statusFilter === 'all' ? '' : statusFilter
        },
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
      // 회원용과 동일한 API 구조 사용
      const res = await axios.get(`http://localhost:8272/api/admin/transactions/payments/${payment.payNo}`);
      
      if (res.data && res.data.master) {
        // master와 details를 포함한 전체 데이터 전달
        setDetailModal({ 
          isOpen: true, 
          payment: res.data.master,
          details: res.data.details || []
        });
      } else {
        // API 실패시 기본 데이터로 모달 열기
        setDetailModal({ isOpen: true, payment, details: [] });
      }
    } catch (err) {
      console.error("상세 정보 로딩 실패:", err);
      setDetailModal({ isOpen: true, payment, details: [] });
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
          value={`₩${(stats.totalRevenue || 0).toLocaleString()}`} 
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
              placeholder="주문번호, 회원명, 상품명 검색" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="filter-group" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <RiFilterLine />
            <select 
              className="form-input form-select" 
              value={statusFilter} 
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // 페이지를 1로 리셋 (useEffect가 자동으로 fetchPayments 호출)
              }}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 상태</option>
              <option value="WAIT">이용 예정</option>
              <option value="DONE">이용 완료</option>
              {/* <option value="CANCEL">취소/환불</option> */}
            </select>
            <button 
              className="btn btn-primary" 
              onClick={handleSearch}
              style={{ marginLeft: '8px' }}
            >
              <RiSearchLine /> 검색
            </button>
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
        {!loading && paymentsData.length > 0 && totalPages > 1 && (
          <div className="pagination-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            marginTop: '20px',
            paddingBottom: '20px'
          }}>
            {/* 맨 처음 */}
            <button
              className="btn-page"
              onClick={() => setCurrentPage(1)}
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
            
            {/* 이전 */}
            <button
              className="btn-page"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
            
            {/* 페이지 번호들 */}
            {(() => {
              const blockSize = 5;
              const startPage = Math.floor((currentPage - 1) / blockSize) * blockSize + 1;
              const endPage = Math.min(startPage + blockSize - 1, totalPages);
              const pages = [];
              
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    style={{
                      padding: '8px 14px',
                      border: '1px solid',
                      borderColor: currentPage === i ? '#3b82f6' : '#e5e7eb',
                      borderRadius: '6px',
                      background: currentPage === i ? '#3b82f6' : '#fff',
                      color: currentPage === i ? '#fff' : '#374151',
                      cursor: 'pointer',
                      fontWeight: currentPage === i ? 600 : 400
                    }}
                  >
                    {i}
                  </button>
                );
              }
              return pages;
            })()}
            
            {/* 다음 */}
            <button
              className="btn-page"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
            
            {/* 맨 끝 */}
            <button
              className="btn-page"
              onClick={() => setCurrentPage(totalPages)}
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
            
            {/* 페이지 정보 */}
            <span style={{ marginLeft: '16px', color: '#6b7280', fontSize: '0.875rem' }}>
              총 {totalRecord}개 중 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalRecord)}
            </span>
          </div>
        )}
      </div>

      {/* 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, payment: null, details: [] })}
        title="결제 상세정보"
        size="large"
      >
        {detailModal.payment && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* 상태 뱃지 */}


            {/* 상품 정보 */}


            {/* 상세 상품 목록 (회원용처럼 추가) */}
            {detailModal.details && detailModal.details.length > 0 && (
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiShoppingBagLine /> 구매 상품 목록
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {detailModal.details.map((item, index) => {
                    // 이미지 경로 처리


                    return (
                      <div key={index} style={{ 
                        display: 'flex', 
                        gap: 15, 
                        padding: 12, 
                        background: '#f8fafc', 
                        borderRadius: 8,
                        alignItems: 'center'
                      }}>
                        
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: 600 }}>
                            {item.PROD_NAME}
                          </h4>
                          <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}>
                            {item.USE_INFO}
                          </p>
                          <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}>
                            {item.QUANTITY}개 | ₩{Number(item.ITEM_TOTAL_PRICE || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 결제 정보 */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiBankCardLine /> 결제 정보
              </h5>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">주문번호</span>
                  <span className="detail-value font-medium">{detailModal.payment.orderNo || detailModal.payment.ORDER_NO}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">결제일시</span>
                  <span className="detail-value">{detailModal.payment.payDt || detailModal.payment.PAY_DT}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">결제수단</span>
                  <span className="detail-value">
                    {detailModal.payment.payMethodCd || detailModal.payment.PAY_METHOD_CD}
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
                      (detailModal.payment.TOTAL_DISCOUNT || detailModal.payment.discount || 0) +
                      (detailModal.payment.USE_POINT || detailModal.payment.usePoint || 0) +
                      (detailModal.payment.PAY_TOTAL_AMT || detailModal.payment.payTotalAmt || 0)
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiPercentLine style={{ marginRight: 4 }} />할인</span>
                  <span className="detail-value" style={{ color: '#ef4444' }}>
                    {(detailModal.payment.TOTAL_DISCOUNT || detailModal.payment.discount || 0) > 0 
                      ? `-₩${(detailModal.payment.TOTAL_DISCOUNT || detailModal.payment.discount || 0).toLocaleString()}` 
                      : '₩0'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiCoinLine style={{ marginRight: 4 }} />포인트 사용</span>
                  <span className="detail-value" style={{ color: '#ef4444' }}>
                    {(detailModal.payment.USE_POINT || detailModal.payment.usePoint || 0) > 0 
                      ? `-₩${(detailModal.payment.USE_POINT || detailModal.payment.usePoint || 0).toLocaleString()}` 
                      : '₩0'}
                  </span>
                </div>
                <div className="detail-item" style={{ borderTop: '1px solid #e2e8f0', marginTop: 8, paddingTop: 12 }}>
                  <span className="detail-label font-medium">총 결제금액</span>
                  <span className="detail-value font-medium" style={{ fontSize: '1.125rem', color: 'var(--primary-color)' }}>
                    ₩{(detailModal.payment.PAY_TOTAL_AMT || detailModal.payment.payTotalAmt || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 적립 정보 */}
            {(detailModal.payment.PAY_STATUS || detailModal.payment.payStatus) !== 'CANCEL' && (
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiCoinLine /> 적립 정보
                </h5>
                <div className="detail-list">
                  <div className="detail-item">
                    <span className="detail-label">적립 포인트</span>
                    <span className="detail-value" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                      +{Math.floor((detailModal.payment.PAY_TOTAL_AMT || detailModal.payment.payTotalAmt || 0) * 0.1).toLocaleString()}P
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
                  <span className="detail-value">{detailModal.payment.MEM_NAME || detailModal.payment.memName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiPhoneLine style={{ marginRight: 4 }} />연락처</span>
                  <span className="detail-value">{formatTel(detailModal.payment.MEM_TEL || detailModal.payment.memTel)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiMailLine style={{ marginRight: 4 }} />이메일</span>
                  <span className="detail-value">{detailModal.payment.MEM_EMAIL || detailModal.payment.memEmail}</span>
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
                  <span className="detail-value">{detailModal.payment.BZMN_NM || detailModal.payment.bzmnNm || '정보 없음'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">사업자번호</span>
                  <span className="detail-value">{formatBrno(detailModal.payment.BRNO || detailModal.payment.brno)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">연락처</span>
                  <span className="detail-value">{formatTel(detailModal.payment.COMP_TEL || detailModal.payment.compTel)}</span>
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