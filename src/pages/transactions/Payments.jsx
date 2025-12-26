import { useState } from 'react';
import {
  RiSearchLine,
  RiFilterLine,
  RiEyeLine,
  RiFileDownloadLine,
  RiBankCardLine,
  RiUserLine,
  RiShoppingBagLine,
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiCloseCircleLine,
  RiMoneyDollarCircleLine,
  RiPercentLine,
  RiCoinLine,
  RiStore2Line,
  RiPhoneLine,
  RiMailLine,
  RiRefund2Line
} from 'react-icons/ri';
import { Modal } from '../../components/common/Modal';

// 결제 데이터 (사용자 페이지와 동일한 구조)
const paymentsData = [
  {
    id: 'ORD-20240315-001234',
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
    originalPrice: 150000,
    discount: 10000,
    pointUsed: 4000,
    amount: 136000,
    earnedPoints: 1360,
    method: '신용카드',
    cardNo: '**** **** **** 1234',
    status: 'pending',
    paidAt: '2024-03-15 14:32:15'
  },
  {
    id: 'ORD-20240314-001122',
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
    originalPrice: 340000,
    discount: 20000,
    pointUsed: 0,
    amount: 320000,
    earnedPoints: 3200,
    method: '신용카드',
    cardNo: '**** **** **** 5678',
    status: 'pending',
    paidAt: '2024-03-14 10:20:30'
  },
  {
    id: 'ORD-20240215-003344',
    user: '박관광',
    email: 'tour@daum.net',
    phone: '010-3456-7890',
    product: '부산 해운대 카약 체험',
    productImage: 'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=120&h=120&fit=crop&q=80',
    useDate: '2024.02.21 (수) 10:00',
    option: '3명',
    seller: {
      name: '해운대카약센터',
      bizNo: '345-67-89012',
      phone: '051-345-6789'
    },
    originalPrice: 50000,
    discount: 5000,
    pointUsed: 0,
    amount: 45000,
    earnedPoints: 450,
    method: '카카오페이',
    cardNo: '-',
    status: 'completed',
    paidAt: '2024-02-15 16:45:00'
  },
  {
    id: 'ORD-20240120-005566',
    user: '최투어',
    email: 'choi@gmail.com',
    phone: '010-4567-8901',
    product: '경주 전통 한과 만들기 체험',
    productImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=120&h=120&fit=crop&q=80',
    useDate: '2024.01.28 (일) 13:00',
    option: '2명',
    seller: {
      name: '경주한과체험관',
      bizNo: '456-78-90123',
      phone: '054-456-7890'
    },
    originalPrice: 50000,
    discount: 0,
    pointUsed: 2000,
    amount: 48000,
    earnedPoints: 480,
    method: '신용카드',
    cardNo: '**** **** **** 9012',
    status: 'completed',
    paidAt: '2024-01-20 09:30:00'
  },
  {
    id: 'ORD-20240108-005678',
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
    discount: 0,
    pointUsed: 0,
    amount: 35000,
    earnedPoints: 0,
    method: '신용카드',
    cardNo: '**** **** **** 3456',
    status: 'cancelled',
    paidAt: '2024-01-08 11:20:00',
    cancelledAt: '2024-01-10 14:30:00',
    cancelReason: '일정 변경',
    cancelFee: 3500,
    refundAmount: 31500,
    refundPoints: 350
  }
];

const statusLabels = {
  completed: { label: '이용 완료', className: 'badge-success', icon: RiCheckboxCircleLine },
  pending: { label: '이용 예정', className: 'badge-warning', icon: RiTimeLine },
  cancelled: { label: '취소/환불', className: 'badge-danger', icon: RiCloseCircleLine }
};

function Payments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('3months');

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, payment: null });

  const filteredData = paymentsData.filter(p => {
    const matchesSearch = p.user.includes(searchTerm) || p.product.includes(searchTerm) || p.id.includes(searchTerm) || p.seller.name.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 통계 계산
  const totalCount = paymentsData.length;
  const completedCount = paymentsData.filter(p => p.status === 'completed').length;
  const pendingCount = paymentsData.filter(p => p.status === 'pending').length;
  const cancelledCount = paymentsData.filter(p => p.status === 'cancelled').length;
  const totalAmount = paymentsData.filter(p => p.status !== 'cancelled').reduce((sum, p) => sum + p.amount, 0);

  // 상세보기
  const handleViewDetail = (payment) => {
    setDetailModal({ isOpen: true, payment });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">결제내역 관리</h1>
          <p className="page-subtitle">
            예약 및 결제 내역을 관리합니다
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
              <RiBankCardLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>{totalCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>전체 결제</div>
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
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>이용 완료</div>
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
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>이용 예정</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiMoneyDollarCircleLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>₩{totalAmount.toLocaleString()}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>총 결제금액</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input type="text" className="form-input" placeholder="주문번호, 회원명, 상품명, 판매자 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="filter-group" style={{ display: 'flex', gap: 8 }}>
            <RiFilterLine />
            <select className="form-input form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
              <option value="all">전체 상태</option>
              <option value="pending">이용 예정</option>
              <option value="completed">이용 완료</option>
              <option value="cancelled">취소/환불</option>
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
                <th style={{ width: 70 }}>상품</th>
                <th>상품정보</th>
                <th style={{ width: 100 }}>결제자</th>
                <th style={{ width: 120 }}>이용일</th>
                <th style={{ width: 100 }}>결제금액</th>
                <th style={{ width: 90 }}>결제수단</th>
                <th style={{ width: 80 }}>상태</th>
                <th style={{ width: 140 }}>결제일시</th>
                <th style={{ width: 60 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id} style={{ opacity: item.status === 'cancelled' ? 0.7 : 1 }}>
                  <td>
                    <img
                      src={item.productImage}
                      alt={item.product}
                      style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover', cursor: 'pointer' }}
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
                  <td className="font-medium" style={{ color: item.status === 'cancelled' ? '#9ca3af' : 'var(--primary-color)' }}>
                    {item.status === 'cancelled' ? (
                      <del>₩{item.amount.toLocaleString()}</del>
                    ) : (
                      `₩${item.amount.toLocaleString()}`
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <RiBankCardLine style={{ color: 'var(--primary-color)' }} />
                      <span style={{ fontSize: '0.85rem' }}>{item.method}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${statusLabels[item.status].className}`} style={{ whiteSpace: 'nowrap' }}>
                      {statusLabels[item.status].label}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{item.paidAt}</td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" title="상세보기" onClick={() => handleViewDetail(item)}><RiEyeLine /></button>
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
        onClose={() => setDetailModal({ isOpen: false, payment: null })}
        title="결제 상세정보"
        size="large"
      >
        {detailModal.payment && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* 상태 뱃지 */}
            <div style={{ textAlign: 'center', padding: 16, background: '#f8fafc', borderRadius: 8, marginBottom: 20 }}>
              <span className={`badge ${statusLabels[detailModal.payment.status].className}`} style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
                {statusLabels[detailModal.payment.status].label}
              </span>
            </div>

            {/* 상품 정보 */}
            <div style={{ display: 'flex', gap: 16, padding: 16, background: '#f8fafc', borderRadius: 8, marginBottom: 20 }}>
              <img
                src={detailModal.payment.productImage}
                alt={detailModal.payment.product}
                style={{ width: 100, height: 100, borderRadius: 8, objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{detailModal.payment.product}</h4>
                <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#64748b' }}>{detailModal.payment.useDate}</p>
                <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#64748b' }}>{detailModal.payment.option}</p>
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
                  <span className="detail-value font-medium">{detailModal.payment.id}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">결제일시</span>
                  <span className="detail-value">{detailModal.payment.paidAt}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">결제수단</span>
                  <span className="detail-value">{detailModal.payment.method} {detailModal.payment.cardNo !== '-' && `(${detailModal.payment.cardNo})`}</span>
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
                  <span className="detail-value">₩{detailModal.payment.originalPrice.toLocaleString()}</span>
                </div>
                {detailModal.payment.discount > 0 && (
                  <div className="detail-item">
                    <span className="detail-label"><RiPercentLine style={{ marginRight: 4 }} />할인</span>
                    <span className="detail-value" style={{ color: '#ef4444' }}>-₩{detailModal.payment.discount.toLocaleString()}</span>
                  </div>
                )}
                {detailModal.payment.pointUsed > 0 && (
                  <div className="detail-item">
                    <span className="detail-label"><RiCoinLine style={{ marginRight: 4 }} />포인트 사용</span>
                    <span className="detail-value" style={{ color: '#ef4444' }}>-₩{detailModal.payment.pointUsed.toLocaleString()}</span>
                  </div>
                )}
                <div className="detail-item" style={{ borderTop: '1px solid #e2e8f0', marginTop: 8, paddingTop: 12 }}>
                  <span className="detail-label font-medium">총 결제금액</span>
                  <span className="detail-value font-medium" style={{ fontSize: '1.125rem', color: 'var(--primary-color)' }}>
                    ₩{detailModal.payment.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 적립 정보 */}
            {detailModal.payment.status !== 'cancelled' && (
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiCoinLine /> 적립 정보
                </h5>
                <div className="detail-list">
                  <div className="detail-item">
                    <span className="detail-label">적립 포인트</span>
                    <span className="detail-value" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>+{detailModal.payment.earnedPoints.toLocaleString()}P</span>
                  </div>
                </div>
              </div>
            )}

            {/* 취소/환불 정보 */}
            {detailModal.payment.status === 'cancelled' && (
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ef4444', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiRefund2Line /> 환불 정보
                </h5>
                <div className="detail-list">
                  <div className="detail-item">
                    <span className="detail-label">취소 사유</span>
                    <span className="detail-value">{detailModal.payment.cancelReason}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">환불 완료일</span>
                    <span className="detail-value">{detailModal.payment.cancelledAt}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">취소 수수료</span>
                    <span className="detail-value" style={{ color: '#f59e0b' }}>-₩{detailModal.payment.cancelFee.toLocaleString()}</span>
                  </div>
                  <div className="detail-item" style={{ borderTop: '1px solid #e2e8f0', marginTop: 8, paddingTop: 12 }}>
                    <span className="detail-label font-medium">환불 금액</span>
                    <span className="detail-value font-medium" style={{ fontSize: '1.125rem', color: '#10b981' }}>
                      ₩{detailModal.payment.refundAmount.toLocaleString()}
                    </span>
                  </div>
                  {detailModal.payment.refundPoints > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">포인트 환급</span>
                      <span className="detail-value" style={{ color: 'var(--primary-color)' }}>+{detailModal.payment.refundPoints.toLocaleString()}P</span>
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
                  <span className="detail-value">{detailModal.payment.user}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiPhoneLine style={{ marginRight: 4 }} />연락처</span>
                  <span className="detail-value">{detailModal.payment.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><RiMailLine style={{ marginRight: 4 }} />이메일</span>
                  <span className="detail-value">{detailModal.payment.email}</span>
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
                  <span className="detail-value">{detailModal.payment.seller.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">사업자번호</span>
                  <span className="detail-value">{detailModal.payment.seller.bizNo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">연락처</span>
                  <span className="detail-value">{detailModal.payment.seller.phone}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Payments;
