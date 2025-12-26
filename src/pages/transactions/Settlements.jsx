import { useState } from 'react';
import {
  RiSearchLine,
  RiFilterLine,
  RiEyeLine,
  RiCheckLine,
  RiFileDownloadLine,
  RiBuildingLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiBankCardLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiPercentLine,
  RiUserLine,
  RiPhoneLine,
  RiMailLine,
  RiFileListLine,
  RiArrowUpLine,
  RiArrowDownLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

// 정산 데이터 (사용자 페이지와 동일한 구조)
const initialSettlementsData = [
  {
    id: 'SET-202412-001',
    company: '제주다이빙센터',
    businessNo: '123-45-67890',
    representative: '김대표',
    phone: '064-123-4567',
    email: 'diving@jejudiving.com',
    bank: '신한은행',
    accountNo: '110-123-456789',
    accountHolder: '제주다이빙센터',
    period: '2024년 12월',
    periodStart: '2024-12-01',
    periodEnd: '2024-12-31',
    sales: 3250000,
    fee: 325000,
    feeRate: 10,
    settlement: 2925000,
    prevMonthSales: 2850000,
    changeRate: 14.0,
    status: 'pending',
    scheduledDate: '2025-01-05',
    orders: [
      { id: 'MH2412015', date: '2024.12.15 14:32', product: '제주 스쿠버다이빙 체험', customer: '김OO', useDate: '2024.12.28', amount: 136000, fee: 13600, settlement: 122400, status: 'confirmed' },
      { id: 'MH2412014', date: '2024.12.14 11:20', product: '제주 스쿠버다이빙 체험', customer: '이OO', useDate: '2024.12.25', amount: 204000, fee: 20400, settlement: 183600, status: 'confirmed' },
      { id: 'MH2412013', date: '2024.12.13 16:45', product: '제주 스쿠버다이빙 체험', customer: '박OO', useDate: '2024.12.20', amount: 136000, fee: 13600, settlement: 122400, status: 'confirmed' },
      { id: 'MH2412010', date: '2024.12.10 10:22', product: '제주 스쿠버다이빙 체험', customer: '최OO', useDate: '2024.12.18', amount: 68000, fee: 6800, settlement: 61200, status: 'confirmed' }
    ]
  },
  {
    id: 'SET-202412-002',
    company: '한라산트레킹',
    businessNo: '234-56-78901',
    representative: '박산악',
    phone: '064-234-5678',
    email: 'trekking@hallasan.com',
    bank: '국민은행',
    accountNo: '940-12-345678',
    accountHolder: '한라산트레킹',
    period: '2024년 12월',
    periodStart: '2024-12-01',
    periodEnd: '2024-12-31',
    sales: 1870000,
    fee: 187000,
    feeRate: 10,
    settlement: 1683000,
    prevMonthSales: 2100000,
    changeRate: -11.0,
    status: 'pending',
    scheduledDate: '2025-01-05',
    orders: [
      { id: 'MH2412020', date: '2024.12.18 09:15', product: '한라산 트레킹 투어', customer: '정OO', useDate: '2024.12.28', amount: 85000, fee: 8500, settlement: 76500, status: 'confirmed' },
      { id: 'MH2412019', date: '2024.12.16 14:30', product: '한라산 트레킹 투어', customer: '강OO', useDate: '2024.12.26', amount: 170000, fee: 17000, settlement: 153000, status: 'confirmed' }
    ]
  },
  {
    id: 'SET-202411-001',
    company: '제주다이빙센터',
    businessNo: '123-45-67890',
    representative: '김대표',
    phone: '064-123-4567',
    email: 'diving@jejudiving.com',
    bank: '신한은행',
    accountNo: '110-123-456789',
    accountHolder: '제주다이빙센터',
    period: '2024년 11월',
    periodStart: '2024-11-01',
    periodEnd: '2024-11-30',
    sales: 2850000,
    fee: 285000,
    feeRate: 10,
    settlement: 2565000,
    prevMonthSales: 2400000,
    changeRate: 18.8,
    status: 'completed',
    scheduledDate: '2024-12-05',
    completedAt: '2024-12-05 10:30:00',
    orders: [
      { id: 'MH2411025', date: '2024.11.25 14:32', product: '제주 스쿠버다이빙 체험', customer: '홍OO', useDate: '2024.11.30', amount: 136000, fee: 13600, settlement: 122400, status: 'confirmed' },
      { id: 'MH2411020', date: '2024.11.20 11:20', product: '제주 스쿠버다이빙 체험', customer: '김OO', useDate: '2024.11.28', amount: 204000, fee: 20400, settlement: 183600, status: 'confirmed' }
    ]
  },
  {
    id: 'SET-202411-002',
    company: '제주신라호텔',
    businessNo: '345-67-89012',
    representative: '이호텔',
    phone: '064-345-6789',
    email: 'hotel@shilla-jeju.com',
    bank: '하나은행',
    accountNo: '178-910-123456',
    accountHolder: '제주신라호텔',
    period: '2024년 11월',
    periodStart: '2024-11-01',
    periodEnd: '2024-11-30',
    sales: 15200000,
    fee: 1520000,
    feeRate: 10,
    settlement: 13680000,
    prevMonthSales: 14500000,
    changeRate: 4.8,
    status: 'completed',
    scheduledDate: '2024-12-05',
    completedAt: '2024-12-05 10:35:00',
    orders: [
      { id: 'MH2411030', date: '2024.11.28 16:00', product: '디럭스룸 2박', customer: '박OO', useDate: '2024.12.01', amount: 640000, fee: 64000, settlement: 576000, status: 'confirmed' },
      { id: 'MH2411028', date: '2024.11.25 10:00', product: '스위트룸 1박', customer: '최OO', useDate: '2024.11.28', amount: 450000, fee: 45000, settlement: 405000, status: 'confirmed' }
    ]
  },
  {
    id: 'SET-202410-001',
    company: '해운대카약센터',
    businessNo: '456-78-90123',
    representative: '정카약',
    phone: '051-456-7890',
    email: 'kayak@haeundae.com',
    bank: '우리은행',
    accountNo: '1002-123-456789',
    accountHolder: '해운대카약센터',
    period: '2024년 10월',
    periodStart: '2024-10-01',
    periodEnd: '2024-10-31',
    sales: 980000,
    fee: 98000,
    feeRate: 10,
    settlement: 882000,
    prevMonthSales: 850000,
    changeRate: 15.3,
    status: 'completed',
    scheduledDate: '2024-11-05',
    completedAt: '2024-11-05 09:20:00',
    orders: [
      { id: 'MH2410015', date: '2024.10.15 14:00', product: '해운대 카약 체험', customer: '윤OO', useDate: '2024.10.20', amount: 45000, fee: 4500, settlement: 40500, status: 'confirmed' }
    ]
  }
];

const statusLabels = {
  pending: { label: '정산대기', className: 'badge-warning', icon: RiTimeLine },
  processing: { label: '정산중', className: 'badge-primary', icon: RiTimeLine },
  completed: { label: '정산완료', className: 'badge-success', icon: RiCheckboxCircleLine }
};

function Settlements() {
  const [settlementsData, setSettlementsData] = useState(initialSettlementsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, settlement: null });
  const [processModal, setProcessModal] = useState({ isOpen: false, settlement: null });

  const filteredData = settlementsData.filter(s => {
    const matchesSearch = s.company.includes(searchTerm) || s.businessNo.includes(searchTerm) || s.id.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 통계 계산
  const totalSales = settlementsData.reduce((sum, s) => sum + s.sales, 0);
  const totalFee = settlementsData.reduce((sum, s) => sum + s.fee, 0);
  const completedSettlement = settlementsData.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.settlement, 0);
  const pendingSettlement = settlementsData.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.settlement, 0);
  const pendingCount = settlementsData.filter(s => s.status === 'pending').length;

  // 상세보기
  const handleViewDetail = (settlement) => {
    setDetailModal({ isOpen: true, settlement });
  };

  // 정산 처리
  const handleProcess = (settlement) => {
    setProcessModal({ isOpen: true, settlement });
  };

  const handleProcessConfirm = () => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setSettlementsData(prev => prev.map(s => s.id === processModal.settlement.id ? { ...s, status: 'completed', completedAt: now } : s));
    setProcessModal({ isOpen: false, settlement: null });
    alert('정산이 완료되었습니다.');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">기업정산 관리</h1>
          <p className="page-subtitle">
            기업별 매출 및 정산 내역을 관리합니다
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><RiFileDownloadLine /> 정산서 다운로드</button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #4A90D9, #357ABD)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiMoneyDollarCircleLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>₩{totalSales.toLocaleString()}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>총 매출액</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiPercentLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>₩{totalFee.toLocaleString()}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>총 수수료</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiCheckboxCircleLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>₩{completedSettlement.toLocaleString()}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>정산 완료</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiTimeLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>₩{pendingSettlement.toLocaleString()}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>정산 대기</div>
            </div>
          </div>
        </div>
      </div>

      {pendingCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#fef3c7', borderRadius: 8, marginBottom: 16 }}>
          <RiTimeLine style={{ color: '#f59e0b' }} />
          <span style={{ color: '#92400e' }}>정산 대기 중인 건이 <strong>{pendingCount}건</strong> 있습니다. (정산 예정 금액: ₩{pendingSettlement.toLocaleString()})</span>
        </div>
      )}

      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input type="text" className="form-input" placeholder="정산번호, 기업명, 사업자번호 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="filter-group" style={{ display: 'flex', gap: 8 }}>
            <RiFilterLine />
            <select className="form-input form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
              <option value="all">전체 상태</option>
              <option value="pending">정산대기</option>
              <option value="processing">정산중</option>
              <option value="completed">정산완료</option>
            </select>
            <select className="form-input form-select" value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} style={{ width: 'auto' }}>
              <option value="all">전체 기간</option>
              <option value="2024-12">2024년 12월</option>
              <option value="2024-11">2024년 11월</option>
              <option value="2024-10">2024년 10월</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 130 }}>정산번호</th>
                <th>기업정보</th>
                <th style={{ width: 100 }}>정산기간</th>
                <th style={{ width: 100 }}>매출액</th>
                <th style={{ width: 90 }}>수수료</th>
                <th style={{ width: 100 }}>정산금액</th>
                <th style={{ width: 70 }}>증감</th>
                <th style={{ width: 75 }}>상태</th>
                <th style={{ width: 90 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id}>
                  <td>
                    <div>
                      <div className="font-medium" style={{ cursor: 'pointer' }} onClick={() => handleViewDetail(item)}>{item.id}</div>
                      <div className="text-secondary" style={{ fontSize: '0.7rem' }}>{item.orders.length}건</div>
                    </div>
                  </td>
                  <td>
                    <div className="member-info">
                      <div className="avatar" style={{ background: '#E0E7FF', color: '#4F46E5' }}><RiBuildingLine /></div>
                      <div>
                        <div className="font-medium">{item.company}</div>
                        <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{item.businessNo}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{item.period}</td>
                  <td>₩{item.sales.toLocaleString()}</td>
                  <td style={{ color: '#f59e0b' }}>-₩{item.fee.toLocaleString()}</td>
                  <td className="font-medium" style={{ color: '#10b981' }}>₩{item.settlement.toLocaleString()}</td>
                  <td>
                    {item.changeRate > 0 ? (
                      <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.85rem' }}>
                        <RiArrowUpLine /> +{item.changeRate}%
                      </span>
                    ) : item.changeRate < 0 ? (
                      <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.85rem' }}>
                        <RiArrowDownLine /> {item.changeRate}%
                      </span>
                    ) : (
                      <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>0%</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${statusLabels[item.status].className}`} style={{ whiteSpace: 'nowrap' }}>
                      {statusLabels[item.status].label}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" title="상세보기" onClick={() => handleViewDetail(item)}><RiEyeLine /></button>
                      {item.status === 'pending' && (
                        <button className="table-action-btn" style={{ color: 'var(--success-color)' }} title="정산 처리" onClick={() => handleProcess(item)}><RiCheckLine /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="pagination-btn" disabled>&lt;</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">&gt;</button>
        </div>
      </div>

      {/* 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, settlement: null })}
        title="정산 상세정보"
        size="large"
      >
        {detailModal.settlement && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* 상태 뱃지 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: 20,
              background: detailModal.settlement.status === 'completed' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : detailModal.settlement.status === 'processing' ? 'linear-gradient(135deg, #4A90D9 0%, #357ABD 100%)'
                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: 12,
              color: 'white',
              marginBottom: 20
            }}>
              {detailModal.settlement.status === 'completed' ? <RiCheckboxCircleLine style={{ fontSize: 40 }} /> : <RiTimeLine style={{ fontSize: 40 }} />}
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 4 }}>
                  {statusLabels[detailModal.settlement.status].label}
                </h4>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>
                  {detailModal.settlement.status === 'completed'
                    ? `정산 완료일: ${detailModal.settlement.completedAt}`
                    : `정산 예정일: ${detailModal.settlement.scheduledDate}`}
                </p>
              </div>
            </div>

            {/* 기업 정보 */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiBuildingLine /> 기업 정보
              </h5>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">기업명</span>
                  <span className="detail-value font-medium">{detailModal.settlement.company}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">사업자번호</span>
                  <span className="detail-value">{detailModal.settlement.businessNo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiUserLine style={{ marginRight: 4 }} />대표자명</span>
                  <span className="detail-value">{detailModal.settlement.representative}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiPhoneLine style={{ marginRight: 4 }} />연락처</span>
                  <span className="detail-value">{detailModal.settlement.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiMailLine style={{ marginRight: 4 }} />이메일</span>
                  <span className="detail-value">{detailModal.settlement.email}</span>
                </div>
              </div>
            </div>

            {/* 정산 정보 */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiCalendarLine /> 정산 정보
              </h5>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">정산번호</span>
                  <span className="detail-value font-medium">{detailModal.settlement.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">정산기간</span>
                  <span className="detail-value">{detailModal.settlement.period}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">주문건수</span>
                  <span className="detail-value">{detailModal.settlement.orders.length}건</span>
                </div>
              </div>
            </div>

            {/* 정산 금액 */}
            <div style={{ marginBottom: 20, padding: 20, background: '#f8fafc', borderRadius: 12 }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiMoneyDollarCircleLine /> 정산 금액
              </h5>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#64748b' }}>총 매출액</span>
                <span className="font-medium">₩{detailModal.settlement.sales.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: '#64748b' }}>수수료 ({detailModal.settlement.feeRate}%)</span>
                <span style={{ color: '#f59e0b' }}>-₩{detailModal.settlement.fee.toLocaleString()}</span>
              </div>
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 600 }}>
                <span>정산금액</span>
                <span style={{ color: '#10b981' }}>₩{detailModal.settlement.settlement.toLocaleString()}</span>
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>전월 대비</span>
                {detailModal.settlement.changeRate > 0 ? (
                  <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <RiArrowUpLine /> +{detailModal.settlement.changeRate}%
                  </span>
                ) : detailModal.settlement.changeRate < 0 ? (
                  <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <RiArrowDownLine /> {detailModal.settlement.changeRate}%
                  </span>
                ) : (
                  <span style={{ color: '#6b7280' }}>0%</span>
                )}
              </div>
            </div>

            {/* 입금 계좌 */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiBankCardLine /> 입금 계좌
              </h5>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">은행</span>
                  <span className="detail-value">{detailModal.settlement.bank}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">계좌번호</span>
                  <span className="detail-value font-medium">{detailModal.settlement.accountNo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">예금주</span>
                  <span className="detail-value">{detailModal.settlement.accountHolder}</span>
                </div>
              </div>
            </div>

            {/* 주문 상세 내역 */}
            <div>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiFileListLine /> 주문 상세 내역
              </h5>
              <div style={{ overflowX: 'auto' }}>
                <table className="table" style={{ fontSize: '0.8rem' }}>
                  <thead>
                    <tr>
                      <th>예약번호</th>
                      <th>예약일시</th>
                      <th>상품명</th>
                      <th>예약자</th>
                      <th>이용일</th>
                      <th>금액</th>
                      <th>수수료</th>
                      <th>정산액</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailModal.settlement.orders.map((order, idx) => (
                      <tr key={idx}>
                        <td className="font-medium">{order.id}</td>
                        <td>{order.date}</td>
                        <td>{order.product}</td>
                        <td>{order.customer}</td>
                        <td>{order.useDate}</td>
                        <td>₩{order.amount.toLocaleString()}</td>
                        <td style={{ color: '#f59e0b' }}>-₩{order.fee.toLocaleString()}</td>
                        <td className="font-medium">₩{order.settlement.toLocaleString()}</td>
                        <td>
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>확정</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#f8fafc' }}>
                      <td colSpan={5} style={{ textAlign: 'right', fontWeight: 600 }}>합계</td>
                      <td className="font-medium">₩{detailModal.settlement.sales.toLocaleString()}</td>
                      <td style={{ color: '#f59e0b', fontWeight: 600 }}>-₩{detailModal.settlement.fee.toLocaleString()}</td>
                      <td className="font-medium" style={{ color: '#10b981' }}>₩{detailModal.settlement.settlement.toLocaleString()}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 정산 확정 확인 모달 */}
      <ConfirmModal
        isOpen={processModal.isOpen}
        onClose={() => setProcessModal({ isOpen: false, settlement: null })}
        onConfirm={handleProcessConfirm}
        title="정산 확정"
        message={`${processModal.settlement?.company}의 ${processModal.settlement?.period} 정산을 확정하시겠습니까?\n\n정산 금액 : ${processModal.settlement?.settlement.toLocaleString()}원`}
        confirmText="확정"
        type="primary"
      />
    </div>
  );
}

export default Settlements;
