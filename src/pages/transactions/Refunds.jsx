import { useState } from 'react';
import {
  RiSearchLine,
  RiFilterLine,
  RiEyeLine,
  RiCheckLine,
  RiCloseLine,
  RiRefund2Line,
  RiUserLine,
  RiCalendarLine,
  RiShoppingBagLine,
  RiFileDownloadLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiMoneyDollarCircleLine,
  RiBankCardLine,
  RiStore2Line,
  RiPhoneLine,
  RiMailLine,
  RiCoinLine,
  RiPercentLine,
  RiInformationLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

// 환불 데이터 (사용자 페이지와 동일한 구조)
const initialRefundsData = [
  {
    id: 'REF-20240115-001',
    orderId: 'ORD-20240108-005678',
    user: '정휴가',
    email: 'vacation@naver.com',
    phone: '010-5678-9012',
    product: '설악산 짚라인 체험',
    productImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop&q=80',
    useDate: '2024.01.15 (월) 11:00',
    option: '1명',
    seller: {
      name: '설악짚라인',
      bizNo: '567-89-01234',
      phone: '033-567-8901'
    },
    originalPrice: 35000,
    cancelFee: 3500,
    refundAmount: 31500,
    pointRefund: 350,
    refundMethod: '신용카드 취소',
    reason: '일정 변경',
    reasonDetail: '급한 일정이 생겨서 취소하고 싶습니다.',
    status: 'completed',
    requestedAt: '2024-01-09 10:15:00',
    completedAt: '2024-01-10 14:30:00'
  },
  {
    id: 'REF-20240320-002',
    orderId: 'ORD-20240315-001234',
    user: '김여행',
    email: 'travel@gmail.com',
    phone: '010-1234-5678',
    product: '제주 스쿠버다이빙 체험',
    productImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&h=120&fit=crop&q=80',
    useDate: '2024.04.20 (토) 14:00',
    option: '2명',
    seller: {
      name: '제주다이빙센터',
      bizNo: '123-45-67890',
      phone: '064-123-4567'
    },
    originalPrice: 136000,
    cancelFee: 0,
    refundAmount: 136000,
    pointRefund: 0,
    refundMethod: '신용카드 취소',
    reason: '일정 변경',
    reasonDetail: '개인 사정으로 여행 일정을 변경해야 해서 취소 요청합니다.',
    status: 'pending',
    requestedAt: '2024-03-20 14:30:00'
  },
  {
    id: 'REF-20240318-003',
    orderId: 'ORD-20240314-001122',
    user: '이모행',
    email: 'mohaeng@naver.com',
    phone: '010-2345-6789',
    product: '제주 신라 호텔',
    productImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=120&h=120&fit=crop&q=80',
    useDate: '2024.04.20 - 2024.04.22 (2박)',
    option: '디럭스룸',
    seller: {
      name: '제주 신라 호텔',
      bizNo: '234-56-78901',
      phone: '064-234-5678'
    },
    originalPrice: 320000,
    cancelFee: 32000,
    refundAmount: 288000,
    pointRefund: 0,
    refundMethod: '신용카드 취소',
    reason: '단순 변심',
    reasonDetail: '다른 여행지로 변경하고 싶습니다.',
    status: 'approved',
    requestedAt: '2024-03-18 11:20:00'
  },
  {
    id: 'REF-20240316-004',
    orderId: 'ORD-20240310-002233',
    user: '박관광',
    email: 'tour@daum.net',
    phone: '010-3456-7890',
    product: '롯데호텔 제주',
    productImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=120&h=120&fit=crop&q=80',
    useDate: '2024.03.25 - 2024.03.26 (1박)',
    option: '스탠다드룸',
    seller: {
      name: '호텔파라다이스',
      bizNo: '345-67-89012',
      phone: '064-345-6789'
    },
    originalPrice: 180000,
    cancelFee: 0,
    refundAmount: 180000,
    pointRefund: 0,
    refundMethod: '신용카드 취소',
    reason: '상품 오류',
    reasonDetail: '예약한 날짜에 객실이 없다는 연락을 받았습니다.',
    status: 'completed',
    requestedAt: '2024-03-16 09:45:00',
    completedAt: '2024-03-16 15:30:00'
  },
  {
    id: 'REF-20240315-005',
    orderId: 'ORD-20240301-003344',
    user: '최투어',
    email: 'choi@gmail.com',
    phone: '010-4567-8901',
    product: '한라산 트레킹 투어',
    productImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=120&h=120&fit=crop&q=80',
    useDate: '2024.03.16 (토) 06:00',
    option: '1명',
    seller: {
      name: '체험여행사',
      bizNo: '456-78-90123',
      phone: '064-456-7890'
    },
    originalPrice: 75000,
    cancelFee: 75000,
    refundAmount: 0,
    pointRefund: 0,
    refundMethod: '-',
    reason: '일정 변경',
    reasonDetail: '급한 일정이 생겨서 취소하고 싶습니다.',
    status: 'rejected',
    requestedAt: '2024-03-15 16:15:00',
    rejectReason: '투어 시작 24시간 이내 취소 불가 상품입니다.'
  }
];

const statusLabels = {
  pending: { label: '검토중', className: 'badge-warning', icon: RiTimeLine },
  approved: { label: '승인됨', className: 'badge-primary', icon: RiCheckboxCircleLine },
  completed: { label: '환불완료', className: 'badge-success', icon: RiCheckboxCircleLine },
  rejected: { label: '거절됨', className: 'badge-danger', icon: RiCloseCircleLine }
};

// 취소 정책 안내
const cancelPolicies = [
  { days: '이용일 7일 전', fee: '무료 취소' },
  { days: '이용일 3~6일 전', fee: '30% 수수료' },
  { days: '이용일 1~2일 전', fee: '50% 수수료' },
  { days: '이용일 당일', fee: '환불 불가' }
];

function Refunds() {
  const [refundsData, setRefundsData] = useState(initialRefundsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('3months');

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, refund: null });
  const [approveModal, setApproveModal] = useState({ isOpen: false, refund: null });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, refund: null });
  const [rejectReason, setRejectReason] = useState('');

  const filteredData = refundsData.filter(r => {
    const matchesSearch = r.user.includes(searchTerm) || r.product.includes(searchTerm) || r.id.includes(searchTerm) || r.seller.name.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 통계 계산
  const totalCount = refundsData.length;
  const pendingCount = refundsData.filter(r => r.status === 'pending').length;
  const completedCount = refundsData.filter(r => r.status === 'completed' || r.status === 'approved').length;
  const rejectedCount = refundsData.filter(r => r.status === 'rejected').length;
  const totalRefundAmount = refundsData.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.refundAmount, 0);

  // 상세보기
  const handleViewDetail = (refund) => {
    setDetailModal({ isOpen: true, refund });
  };

  // 승인
  const handleApprove = (refund) => {
    setApproveModal({ isOpen: true, refund });
  };

  const handleApproveConfirm = () => {
    setRefundsData(prev => prev.map(r => r.id === approveModal.refund.id ? { ...r, status: 'approved' } : r));
    setApproveModal({ isOpen: false, refund: null });
    alert('환불 요청이 승인되었습니다.');
  };

  // 거절
  const handleReject = (refund) => {
    setRejectReason('');
    setRejectModal({ isOpen: true, refund });
  };

  const handleRejectConfirm = () => {
    setRefundsData(prev => prev.map(r => r.id === rejectModal.refund.id ? { ...r, status: 'rejected', rejectReason: rejectReason } : r));
    setRejectModal({ isOpen: false, refund: null });
    setRejectReason('');
    alert('환불 요청이 거절되었습니다.');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">취소/환불 관리</h1>
          <p className="page-subtitle">
            환불 요청을 검토하고 처리합니다
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><RiFileDownloadLine /> 엑셀 다운로드</button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #4A90D9, #357ABD)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiRefund2Line />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>{totalCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>전체 요청</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiTimeLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{pendingCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>검토 대기</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiCheckboxCircleLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{completedCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>처리 완료</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiMoneyDollarCircleLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>₩{totalRefundAmount.toLocaleString()}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>환불 금액</div>
            </div>
          </div>
        </div>
      </div>

      {pendingCount > 0 && (
        <div className="alert alert-warning mb-3" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#fef3c7', borderRadius: 8, marginBottom: 16 }}>
          <RiTimeLine style={{ color: '#f59e0b' }} />
          <span style={{ color: '#92400e' }}>처리 대기 중인 환불 요청이 <strong>{pendingCount}건</strong> 있습니다.</span>
        </div>
      )}

      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input type="text" className="form-input" placeholder="환불번호, 회원명, 상품명, 판매자 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="filter-group" style={{ display: 'flex', gap: 8 }}>
            <RiFilterLine />
            <select className="form-input form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
              <option value="all">전체 상태</option>
              <option value="pending">검토중</option>
              <option value="approved">승인됨</option>
              <option value="completed">환불완료</option>
              <option value="rejected">거절됨</option>
            </select>
            <select className="form-input form-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={{ width: 'auto' }}>
              <option value="3months">최근 3개월</option>
              <option value="6months">최근 6개월</option>
              <option value="1year">최근 1년</option>
              <option value="all">전체</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 55 }}>상품</th>
                <th>상품정보</th>
                <th style={{ width: 80 }}>요청자</th>
                <th style={{ width: 90 }}>이용일</th>
                <th style={{ width: 75 }}>결제금액</th>
                <th style={{ width: 75 }}>환불금액</th>
                <th style={{ width: 85 }}>사유</th>
                <th style={{ width: 70 }}>상태</th>
                <th style={{ width: 120 }}>요청일시</th>
                <th style={{ width: 80 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id} style={{ opacity: item.status === 'rejected' ? 0.7 : 1 }}>
                  <td>
                    <img
                      src={item.productImage}
                      alt={item.product}
                      style={{ width: 45, height: 45, borderRadius: 6, objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => handleViewDetail(item)}
                    />
                  </td>
                  <td>
                    <div>
                      <div className="font-medium" style={{ cursor: 'pointer' }} onClick={() => handleViewDetail(item)}>{item.product}</div>
                      <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{item.seller.name}</div>
                      <div className="text-secondary" style={{ fontSize: '0.7rem', color: '#6b7280' }}>{item.id}</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>{item.user}</div>
                      <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{item.email}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    <div>{item.useDate.split(' ')[0]}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{item.option}</div>
                  </td>
                  <td>₩{item.originalPrice.toLocaleString()}</td>
                  <td className="font-medium" style={{ color: item.status === 'rejected' ? '#9ca3af' : '#10b981' }}>
                    {item.status === 'rejected' ? (
                      <span style={{ color: '#ef4444' }}>₩0</span>
                    ) : (
                      `₩${item.refundAmount.toLocaleString()}`
                    )}
                  </td>
                  <td><span className="badge badge-gray" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{item.reason}</span></td>
                  <td>
                    <span className={`badge ${statusLabels[item.status].className}`} style={{ whiteSpace: 'nowrap' }}>
                      {statusLabels[item.status].label}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{item.requestedAt}</td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" title="상세보기" onClick={() => handleViewDetail(item)}><RiEyeLine /></button>
                      {item.status === 'pending' && (
                        <>
                          <button className="table-action-btn" style={{ color: 'var(--success-color)' }} title="승인" onClick={() => handleApprove(item)}><RiCheckLine /></button>
                          <button className="table-action-btn" style={{ color: 'var(--danger-color)' }} title="거절" onClick={() => handleReject(item)}><RiCloseLine /></button>
                        </>
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
        onClose={() => setDetailModal({ isOpen: false, refund: null })}
        title="환불 상세정보"
        size="large"
      >
        {detailModal.refund && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* 환불 상태 박스 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: 20,
              background: detailModal.refund.status === 'completed' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : detailModal.refund.status === 'rejected' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : detailModal.refund.status === 'approved' ? 'linear-gradient(135deg, #4A90D9 0%, #357ABD 100%)'
                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: 12,
              color: 'white',
              marginBottom: 20
            }}>
              {detailModal.refund.status === 'completed' && <RiCheckboxCircleLine style={{ fontSize: 40 }} />}
              {detailModal.refund.status === 'rejected' && <RiCloseCircleLine style={{ fontSize: 40 }} />}
              {detailModal.refund.status === 'approved' && <RiCheckboxCircleLine style={{ fontSize: 40 }} />}
              {detailModal.refund.status === 'pending' && <RiTimeLine style={{ fontSize: 40 }} />}
              <div>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 4 }}>
                  {statusLabels[detailModal.refund.status].label}
                </h4>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>
                  {detailModal.refund.status === 'completed' && '환불이 정상적으로 처리되었습니다.'}
                  {detailModal.refund.status === 'rejected' && '환불 요청이 거절되었습니다.'}
                  {detailModal.refund.status === 'approved' && '환불이 승인되었습니다. 처리 중입니다.'}
                  {detailModal.refund.status === 'pending' && '환불 요청을 검토 중입니다.'}
                </p>
              </div>
            </div>

            {/* 상품 정보 */}
            <div style={{ display: 'flex', gap: 16, padding: 16, background: '#f8fafc', borderRadius: 8, marginBottom: 20 }}>
              <img
                src={detailModal.refund.productImage}
                alt={detailModal.refund.product}
                style={{ width: 100, height: 100, borderRadius: 8, objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{detailModal.refund.product}</h4>
                <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#64748b' }}>{detailModal.refund.useDate}</p>
                <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#64748b' }}>{detailModal.refund.option}</p>
              </div>
            </div>

            {/* 환불 정보 */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiRefund2Line /> 환불 정보
              </h5>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">환불번호</span>
                  <span className="detail-value font-medium">{detailModal.refund.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">결제번호</span>
                  <span className="detail-value">{detailModal.refund.orderId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">취소 요청일</span>
                  <span className="detail-value">{detailModal.refund.requestedAt}</span>
                </div>
                {detailModal.refund.completedAt && (
                  <div className="detail-item">
                    <span className="detail-label">환불 완료일</span>
                    <span className="detail-value">{detailModal.refund.completedAt}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">취소 사유</span>
                  <span className="detail-value">{detailModal.refund.reason}</span>
                </div>
              </div>
            </div>

            {/* 취소 사유 상세 */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12 }}>취소 사유 상세</h5>
              <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8, lineHeight: 1.6, fontSize: '0.9rem' }}>
                {detailModal.refund.reasonDetail}
              </div>
            </div>

            {/* 거절 사유 (거절된 경우만) */}
            {detailModal.refund.status === 'rejected' && detailModal.refund.rejectReason && (
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ef4444', marginBottom: 12 }}>거절 사유</h5>
                <div style={{ padding: 16, background: '#FEE2E2', borderRadius: 8, lineHeight: 1.6, borderLeft: '4px solid #ef4444', fontSize: '0.9rem' }}>
                  {detailModal.refund.rejectReason}
                </div>
              </div>
            )}

            {/* 환불 금액 */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiMoneyDollarCircleLine /> 환불 금액
              </h5>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">결제 금액</span>
                  <span className="detail-value">₩{detailModal.refund.originalPrice.toLocaleString()}</span>
                </div>
                {detailModal.refund.cancelFee > 0 && (
                  <div className="detail-item">
                    <span className="detail-label"><RiPercentLine style={{ marginRight: 4 }} />취소 수수료</span>
                    <span className="detail-value" style={{ color: '#f59e0b' }}>-₩{detailModal.refund.cancelFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="detail-item" style={{ borderTop: '1px solid #e2e8f0', marginTop: 8, paddingTop: 12 }}>
                  <span className="detail-label font-medium">환불 금액</span>
                  <span className="detail-value font-medium" style={{ fontSize: '1.125rem', color: detailModal.refund.status === 'rejected' ? '#ef4444' : '#10b981' }}>
                    ₩{detailModal.refund.refundAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 환불 수단 (완료/승인된 경우만) */}
            {(detailModal.refund.status === 'completed' || detailModal.refund.status === 'approved') && (
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiBankCardLine /> 환불 수단
                </h5>
                <div className="detail-list">
                  <div className="detail-item">
                    <span className="detail-label">환불 방법</span>
                    <span className="detail-value">{detailModal.refund.refundMethod}</span>
                  </div>
                  {detailModal.refund.pointRefund > 0 && (
                    <div className="detail-item">
                      <span className="detail-label"><RiCoinLine style={{ marginRight: 4 }} />포인트 환급</span>
                      <span className="detail-value" style={{ color: 'var(--primary-color)' }}>+{detailModal.refund.pointRefund.toLocaleString()}P</span>
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
                  <span className="detail-value">{detailModal.refund.user}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiPhoneLine style={{ marginRight: 4 }} />연락처</span>
                  <span className="detail-value">{detailModal.refund.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiMailLine style={{ marginRight: 4 }} />이메일</span>
                  <span className="detail-value">{detailModal.refund.email}</span>
                </div>
              </div>
            </div>

            {/* 판매자 정보 */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiStore2Line /> 판매자 정보
              </h5>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">상호명</span>
                  <span className="detail-value">{detailModal.refund.seller.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">사업자번호</span>
                  <span className="detail-value">{detailModal.refund.seller.bizNo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">연락처</span>
                  <span className="detail-value">{detailModal.refund.seller.phone}</span>
                </div>
              </div>
            </div>

            {/* 취소 정책 안내 */}
            <div style={{ padding: 16, background: '#fef3c7', borderRadius: 8 }}>
              <h5 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#92400e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiInformationLine /> 취소 수수료 정책
              </h5>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.8rem', color: '#92400e' }}>
                {cancelPolicies.map((policy, index) => (
                  <li key={index} style={{ marginBottom: 4 }}>{policy.days}: {policy.fee}</li>
                ))}
              </ul>
              <p style={{ margin: '12px 0 0 0', fontSize: '0.8rem', color: '#92400e' }}>
                * 카드 환불은 카드사 정책에 따라 3~5영업일 소요될 수 있습니다.
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* 승인 확인 모달 */}
      <ConfirmModal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal({ isOpen: false, refund: null })}
        onConfirm={handleApproveConfirm}
        title="환불 승인"
        message={`"${approveModal.refund?.user}"님의 환불 요청을 승인하시겠습니까?\n\n환불금액: ₩${approveModal.refund?.refundAmount.toLocaleString()}`}
        confirmText="승인"
        type="primary"
      />

      {/* 거절 모달 */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, refund: null })}
        title="환불 거절"
        size="medium"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setRejectModal({ isOpen: false, refund: null })}>취소</button>
            <button className="btn btn-danger" onClick={handleRejectConfirm} disabled={!rejectReason.trim()}>거절</button>
          </>
        }
      >
        {rejectModal.refund && (
          <div>
            <div style={{ display: 'flex', gap: 12, padding: 12, background: '#f8fafc', borderRadius: 8, marginBottom: 16 }}>
              <img
                src={rejectModal.refund.productImage}
                alt={rejectModal.refund.product}
                style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{rejectModal.refund.product}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{rejectModal.refund.user} | ₩{rejectModal.refund.originalPrice.toLocaleString()}</div>
              </div>
            </div>
            <p style={{ marginBottom: 16 }}>
              <strong>"{rejectModal.refund.user}"</strong>님의 환불 요청을 거절하시겠습니까?
            </p>
            <div className="form-group">
              <label className="form-label">거절 사유 <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="거절 사유를 입력하세요..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{ resize: 'none' }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Refunds;
