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
  RiMailLine
} from 'react-icons/ri';
import { Modal } from '../../components/common/Modal';

// 상태값 매핑 (서버의 DONE, WAIT 등 영문 상태를 한글로 변환)
const statusLabels = {
  'DONE': { label: '이용 완료', className: 'badge-success', icon: RiCheckboxCircleLine },
  'WAIT': { label: '이용 예정', className: 'badge-warning', icon: RiTimeLine },
  'CANCEL': { label: '취소 완료', className: 'badge-danger', icon: RiCloseCircleLine }
};

function Payments() {
  const [paymentsData, setPaymentsData] = useState([]);
  const [stats, setStats] = useState({ totalCount: 0, completedCount: 0, pendingCount: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('1month');
  const [currentPage, setCurrentPage] = useState(1);
  const [detailModal, setDetailModal] = useState({ isOpen: false, payment: null });

  // 데이터 로딩
  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:8272/api/admin/transactions/payments/stats');
      setStats(res.data);
    } catch (err) { console.error("통계 로딩 실패", err); }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8272/api/admin/transactions/payments/list', {
        params: { page: currentPage, searchTerm, statusFilter, dateFilter }
      });
      setPaymentsData(res.data.dataList || res.data);
    } catch (err) { console.error("데이터 연결 실패:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPayments(); }, [currentPage, statusFilter, dateFilter]);
  useEffect(() => { fetchStats(); }, []);

  // 포맷팅 함수
  const formatBrno = (num) => {
    if (!num) return "-";
    const cleaned = num.toString().replace(/\D/g, '');
    return cleaned.length === 10 ? cleaned.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') : num;
  };

  const formatTel = (num) => {
    if (!num) return "-";
    const cleaned = num.toString().replace(/\D/g, '');
    return cleaned.startsWith('02') 
      ? cleaned.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3')
      : cleaned.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      setCurrentPage(1);
      fetchPayments();
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">결제내역 관리</h1>
          <p className="page-subtitle">예약 및 결제 내역을 관리합니다</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><RiFileDownloadLine /> 엑셀 다운로드</button>
        </div>
      </div>

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

      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input 
              type="text" 
              className="form-input" 
              placeholder="주문번호, 회원명, 상품명 검색" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
            />
          </div>
          <div className="filter-group" style={{ display: 'flex', gap: 8 }}>
            <RiFilterLine />
            <select className="form-input form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">전체 상태</option>
              <option value="WAIT">이용 예정</option>
              <option value="DONE">이용 완료</option>
              <option value="CANCEL">취소/환불</option>
            </select>
            <select className="form-input form-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="1month">최근 1개월</option>
              <option value="3months">최근 3개월</option>
              <option value="all">전체</option>
            </select>
          </div>
        </div>

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
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '40px'}}>데이터를 불러오는 중입니다...</td></tr>
              ) : (Array.isArray(paymentsData) && paymentsData.length > 0) ? (
                paymentsData.map(item => (
                  <tr key={item.payNo} style={{ opacity: item.payStatus === 'CANCEL' ? 0.7 : 1 }}>
                    <td>
                      <div className="font-medium" style={{ cursor: 'pointer' }} onClick={() => setDetailModal({ isOpen: true, payment: item })}>
                        {item.itemTitle}
                      </div>
                      <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{item.bzmnNm}</div>
                      <div className="text-secondary" style={{ fontSize: '0.7rem', color: '#6b7280' }}>: {item.tid}</div>
                    </td>
                    <td>
                      <div>{item.memName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.memEmail}</div>
                    </td>
                    <td className="font-medium" style={{ color: item.payStatus === 'CANCEL' ? '#9ca3af' : 'var(--primary-color)' }}>
                      ₩{item.payTotalAmt.toLocaleString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <RiBankCardLine style={{ color: 'var(--primary-color)' }} />
                        <span style={{ fontSize: '0.85rem' }}>{item.payMethodCd}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${statusLabels[item.payStatus]?.className || ''}`} style={{ whiteSpace: 'nowrap' }}>
                        {statusLabels[item.payStatus]?.label || item.payStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{item.payDt}</td>
                    <td>
                      <button className="table-action-btn" onClick={() => setDetailModal({ isOpen: true, payment: item })}><RiEyeLine /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" style={{textAlign: 'center', padding: '40px'}}>검색 결과가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="pagination-btn" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt;</button>
          <button className="pagination-btn active">{currentPage}</button>
          <button className="pagination-btn" onClick={() => setCurrentPage(prev => prev + 1)}>&gt;</button>
        </div>
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

            {/* 상품 정보 요약 */}
            <div style={{ display: 'flex', gap: 16, padding: 16, background: '#f8fafc', borderRadius: 8, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{detailModal.payment.itemTitle}</h4>
                <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#64748b' }}>판매자: {detailModal.payment.bzmnNm}</p>
              </div>
            </div>

            {/* 2단 상세 정보 그리드 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <h5 className="detail-section-title"><RiBankCardLine /> 결제 상세</h5>
                <div className="detail-list">
                  <div className="detail-item"><span className="detail-label">TID</span><span className="detail-value">{detailModal.payment.tid}</span></div>
                  <div className="detail-item"><span className="detail-label">결제일시</span><span className="detail-value">{detailModal.payment.payDt}</span></div>
                  <div className="detail-item"><span className="detail-label">결제수단</span><span className="detail-value">{detailModal.payment.payMethodCd}</span></div>
                  <div className="detail-item"><span className="detail-label">포인트 사용</span><span className="detail-value">{detailModal.payment.usePoint} P</span></div>
                  <div className="detail-item" style={{ borderTop: '1px solid #e2e8f0', marginTop: 8, paddingTop: 12 }}>
                    <span className="detail-label font-medium">총 결제금액</span>
                    <span className="detail-value font-medium" style={{ fontSize: '1.125rem', color: 'var(--primary-color)' }}>
                      ₩{detailModal.payment.payTotalAmt.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="detail-section-title"><RiUserLine /> 거래 주체 정보</h5>
                <div className="detail-list">
                  <div className="detail-item"><span className="detail-label">결제자명</span><span className="detail-value">{detailModal.payment.memName}</span></div>
                  <div className="detail-item"><span className="detail-label"><RiMailLine /> 이메일</span><span className="detail-value">{detailModal.payment.memEmail}</span></div>
                  <div className="detail-item"><span className="detail-label"><RiPhoneLine /> 연락처</span><span className="detail-value">{formatTel(detailModal.payment.tel)}</span></div>
                  <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px dashed #e2e8f0' }} />
                  <div className="detail-item"><span className="detail-label"><RiStore2Line /> 상호명</span><span className="detail-value">{detailModal.payment.bzmnNm}</span></div>
                  <div className="detail-item"><span className="detail-label">사업자번호</span><span className="detail-value">{formatBrno(detailModal.payment.brno)}</span></div>
                  <div className="detail-item"><span className="detail-label">판매처 연락처</span><span className="detail-value">{formatTel(detailModal.payment.compTel)}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// 초기 스타일을 가진 StatCard 컴포넌트
function StatCard({ bg, icon, value, label, color }) {
  return (
    <div className="card stat-card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ 
          width: 48, height: 48, borderRadius: 12, background: bg, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          color: 'white', fontSize: '1.25rem' 
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: color }}>{value}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</div>
        </div>
      </div>
    </div>
  );
}

export default Payments;