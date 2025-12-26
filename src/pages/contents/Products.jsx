import { useState } from 'react';
import {
  RiSearchLine,
  RiEyeLine,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
  RiShoppingBagLine,
  RiBuilding2Line,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiPauseCircleLine,
  RiPlayCircleLine,
  RiDeleteBinLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

const initialProductsData = [
  { id: 1, name: '제주 3박4일 패키지', company: '(주)투어코리아', category: '투어', price: 450000, sales: 128, status: 'active', createdAt: '2024-12-01', description: '제주도의 아름다운 자연을 만끽할 수 있는 3박4일 패키지 여행입니다.' },
  { id: 2, name: '한라산 트레킹 투어', company: '체험여행사', category: '액티비티', price: 75000, sales: 67, status: 'active', createdAt: '2024-11-28', description: '전문 가이드와 함께하는 한라산 등반 투어입니다.' },
  { id: 3, name: '롯데월드 자유이용권', company: '롯데관광', category: '입장권/티켓', price: 59000, sales: 256, status: 'pending', createdAt: '2024-12-15', description: '롯데월드 어드벤처 자유이용권입니다.' },
  { id: 4, name: '제주 도자기 체험', company: '제주공방', category: '클래스/체험', price: 35000, sales: 45, status: 'active', createdAt: '2024-11-20', description: '제주 흙으로 나만의 도자기를 만들어보세요.' },
  { id: 5, name: '공항 리무진 버스', company: '공항버스', category: '교통/이동', price: 15000, sales: 890, status: 'active', createdAt: '2024-10-15', description: '인천공항-서울 시내 리무진 버스 이용권입니다.' },
  { id: 6, name: '부산 야경 투어', company: '부산투어', category: '투어', price: 45000, sales: 0, status: 'pending', createdAt: '2024-12-16', description: '부산의 아름다운 야경을 감상하는 투어입니다.' }
];

const statusLabels = {
  active: { label: '판매중', className: 'badge-success' },
  inactive: { label: '판매중지', className: 'badge-gray' },
  pending: { label: '심사중', className: 'badge-warning' },
  rejected: { label: '반려', className: 'badge-danger' }
};

const categoryColors = {
  '투어': 'badge-primary',
  '액티비티': 'badge-success',
  '입장권/티켓': 'badge-warning',
  '클래스/체험': 'badge-gray',
  '교통/이동': 'badge-danger'
};

function Products() {
  const [productsData, setProductsData] = useState(initialProductsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, product: null });
  const [editModal, setEditModal] = useState({ isOpen: false, product: null });
  const [approveModal, setApproveModal] = useState({ isOpen: false, product: null });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, product: null });
  const [rejectReason, setRejectReason] = useState('');
  const [editForm, setEditForm] = useState({});
  const [bulkActionModal, setBulkActionModal] = useState({ isOpen: false, action: null });

  const filteredData = productsData.filter(p => p.name.includes(searchTerm) || p.company.includes(searchTerm));
  const pendingCount = productsData.filter(p => p.status === 'pending').length;

  // 전체 선택/해제
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(filteredData.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  // 개별 선택
  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  // 일괄 중지
  const handleBulkPause = () => {
    setBulkActionModal({ isOpen: true, action: 'pause' });
  };

  const handleBulkPauseConfirm = () => {
    setProductsData(prev => prev.map(p =>
      selectedIds.includes(p.id) && p.status === 'active'
        ? { ...p, status: 'inactive' }
        : p
    ));
    setSelectedIds([]);
    setBulkActionModal({ isOpen: false, action: null });
    alert(`${selectedIds.length}개의 상품이 중지되었습니다.`);
  };

  // 일괄 재개
  const handleBulkResume = () => {
    setBulkActionModal({ isOpen: true, action: 'resume' });
  };

  const handleBulkResumeConfirm = () => {
    setProductsData(prev => prev.map(p =>
      selectedIds.includes(p.id) && p.status === 'inactive'
        ? { ...p, status: 'active' }
        : p
    ));
    setSelectedIds([]);
    setBulkActionModal({ isOpen: false, action: null });
    alert(`${selectedIds.length}개의 상품이 재개되었습니다.`);
  };

  // 일괄 삭제
  const handleBulkDelete = () => {
    setBulkActionModal({ isOpen: true, action: 'delete' });
  };

  const handleBulkDeleteConfirm = () => {
    setProductsData(prev => prev.filter(p => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setBulkActionModal({ isOpen: false, action: null });
    alert(`${selectedIds.length}개의 상품이 삭제되었습니다.`);
  };

  const isAllSelected = filteredData.length > 0 && selectedIds.length === filteredData.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < filteredData.length;

  // 상세보기
  const handleViewDetail = (product) => {
    setDetailModal({ isOpen: true, product });
  };

  // 수정
  const handleEdit = (product) => {
    setEditForm({ ...product });
    setEditModal({ isOpen: true, product });
  };

  const handleEditSubmit = () => {
    setProductsData(prev => prev.map(p => p.id === editForm.id ? editForm : p));
    setEditModal({ isOpen: false, product: null });
    alert('상품 정보가 수정되었습니다.');
  };

  // 승인
  const handleApprove = (product) => {
    setApproveModal({ isOpen: true, product });
  };

  const handleApproveConfirm = () => {
    setProductsData(prev => prev.map(p => p.id === approveModal.product.id ? { ...p, status: 'active' } : p));
    setApproveModal({ isOpen: false, product: null });
    alert('상품이 승인되었습니다.');
  };

  // 반려
  const handleReject = (product) => {
    setRejectReason('');
    setRejectModal({ isOpen: true, product });
  };

  const handleRejectConfirm = () => {
    setProductsData(prev => prev.map(p => p.id === rejectModal.product.id ? { ...p, status: 'rejected' } : p));
    setRejectModal({ isOpen: false, product: null });
    alert('상품이 반려되었습니다.');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">기업상품 관리</h1>
          <p className="page-subtitle">
            총 {filteredData.length}개의 상품이 등록되어 있습니다.
            {pendingCount > 0 && <span className="text-warning"> (심사대기 {pendingCount}건)</span>}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input type="text" className="form-input" placeholder="상품명, 기업명 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* 선택 액션 바 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: selectedIds.length > 0 ? 'var(--primary-light)' : 'var(--bg-color)',
          borderRadius: 8,
          marginBottom: 16,
          transition: 'background 0.2s'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                style={{ width: 18, height: 18, cursor: 'pointer' }}
              />
              <span style={{ fontWeight: 500 }}>전체 선택</span>
            </label>
            <span style={{ color: 'var(--text-secondary)' }}>
              {selectedIds.length}개 선택됨
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary"
              onClick={handleBulkPause}
              disabled={selectedIds.length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RiPauseCircleLine /> 선택중지
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleBulkResume}
              disabled={selectedIds.length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RiPlayCircleLine /> 선택재개
            </button>
            <button
              className="btn btn-danger"
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RiDeleteBinLine /> 선택삭제
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 50 }}></th>
                <th>상품정보</th>
                <th>판매기업</th>
                <th>카테고리</th>
                <th>가격</th>
                <th>판매수</th>
                <th>상태</th>
                <th style={{ width: 150 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id} style={{ background: selectedIds.includes(item.id) ? 'var(--primary-light)' : undefined }}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                      style={{ width: 18, height: 18, cursor: 'pointer' }}
                    />
                  </td>
                  <td>
                    <div className="member-info">
                      <div className="avatar" style={{ background: '#FEF3C7', color: '#D97706' }}><RiShoppingBagLine /></div>
                      <div className="font-medium">{item.name}</div>
                    </div>
                  </td>
                  <td>{item.company}</td>
                  <td><span className={`badge ${categoryColors[item.category] || 'badge-gray'}`}>{item.category}</span></td>
                  <td>₩{item.price.toLocaleString()}</td>
                  <td>{item.sales}건</td>
                  <td><span className={`badge ${statusLabels[item.status]?.className || 'badge-gray'}`}>{statusLabels[item.status]?.label || item.status}</span></td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => handleViewDetail(item)} title="상세보기"><RiEyeLine /></button>
                      {item.status === 'pending' ? (
                        <>
                          <button className="table-action-btn" style={{ color: 'var(--success-color)' }} onClick={() => handleApprove(item)} title="승인"><RiCheckLine /></button>
                          <button className="table-action-btn" style={{ color: 'var(--danger-color)' }} onClick={() => handleReject(item)} title="반려"><RiCloseLine /></button>
                        </>
                      ) : (
                        <button className="table-action-btn edit" title="수정" onClick={() => handleEdit(item)}><RiEditLine /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, product: null })}
        title="상품 상세정보"
        size="medium"
      >
        {detailModal.product && (
          <div className="detail-list">
            <div className="detail-item">
              <span className="detail-label"><RiShoppingBagLine /> 상품명</span>
              <span className="detail-value">{detailModal.product.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label"><RiBuilding2Line /> 판매기업</span>
              <span className="detail-value">{detailModal.product.company}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">카테고리</span>
              <span className="detail-value">
                <span className={`badge ${categoryColors[detailModal.product.category] || 'badge-gray'}`}>
                  {detailModal.product.category}
                </span>
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label"><RiMoneyDollarCircleLine /> 가격</span>
              <span className="detail-value">₩{detailModal.product.price.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">판매수</span>
              <span className="detail-value">{detailModal.product.sales}건</span>
            </div>
            <div className="detail-item">
              <span className="detail-label"><RiCalendarLine /> 등록일</span>
              <span className="detail-value">{detailModal.product.createdAt}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">상태</span>
              <span className="detail-value">
                <span className={`badge ${statusLabels[detailModal.product.status].className}`}>
                  {statusLabels[detailModal.product.status].label}
                </span>
              </span>
            </div>
            <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="detail-label" style={{ marginBottom: 8 }}>상품설명</span>
              <div style={{ padding: 12, background: 'var(--bg-color)', borderRadius: 8, width: '100%' }}>
                {detailModal.product.description}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 승인 확인 모달 */}
      <ConfirmModal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal({ isOpen: false, product: null })}
        onConfirm={handleApproveConfirm}
        title="상품 승인"
        message={`"${approveModal.product?.name}" 상품을 승인하시겠습니까?`}
        confirmText="승인"
        type="primary"
      />

      {/* 반려 모달 */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, product: null })}
        title="상품 반려"
        size="medium"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setRejectModal({ isOpen: false, product: null })}>취소</button>
            <button className="btn btn-danger" onClick={handleRejectConfirm}>반려</button>
          </>
        }
      >
        {rejectModal.product && (
          <div>
            <p style={{ marginBottom: 16 }}>
              <strong>"{rejectModal.product.name}"</strong> 상품을 반려하시겠습니까?
            </p>
            <div className="form-group">
              <label className="form-label">반려 사유</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="반려 사유를 입력하세요..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 수정 모달 */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, product: null })}
        title="상품 정보 수정"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setEditModal({ isOpen: false, product: null })}>취소</button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>저장</button>
          </>
        }
      >
        {editModal.product && (
          <div>
            <div className="form-group">
              <label className="form-label">상품명</label>
              <input
                type="text"
                className="form-input"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">판매기업</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.company || ''}
                  disabled
                  style={{ background: 'var(--bg-color)' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">카테고리</label>
                <select
                  className="form-input form-select"
                  value={editForm.category || ''}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                >
                  <option value="투어">투어</option>
                  <option value="액티비티">액티비티</option>
                  <option value="입장권/티켓">입장권/티켓</option>
                  <option value="클래스/체험">클래스/체험</option>
                  <option value="교통/이동">교통/이동</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">가격</label>
                <input
                  type="number"
                  className="form-input"
                  value={editForm.price || ''}
                  onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">상태</label>
                <select
                  className="form-input form-select"
                  value={editForm.status || ''}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="active">판매중</option>
                  <option value="inactive">판매중지</option>
                  <option value="pending">심사중</option>
                  <option value="rejected">반려</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">상품설명</label>
              <textarea
                className="form-input"
                rows={4}
                value={editForm.description || ''}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 일괄 작업 확인 모달 */}
      <ConfirmModal
        isOpen={bulkActionModal.isOpen && bulkActionModal.action === 'pause'}
        onClose={() => setBulkActionModal({ isOpen: false, action: null })}
        onConfirm={handleBulkPauseConfirm}
        title="선택 상품 중지"
        message={`선택한 ${selectedIds.length}개의 상품을 판매 중지하시겠습니까?`}
        confirmText="중지"
        type="primary"
      />

      <ConfirmModal
        isOpen={bulkActionModal.isOpen && bulkActionModal.action === 'resume'}
        onClose={() => setBulkActionModal({ isOpen: false, action: null })}
        onConfirm={handleBulkResumeConfirm}
        title="선택 상품 재개"
        message={`선택한 ${selectedIds.length}개의 상품을 판매 재개하시겠습니까?`}
        confirmText="재개"
        type="primary"
      />

      <ConfirmModal
        isOpen={bulkActionModal.isOpen && bulkActionModal.action === 'delete'}
        onClose={() => setBulkActionModal({ isOpen: false, action: null })}
        onConfirm={handleBulkDeleteConfirm}
        title="선택 상품 삭제"
        message={`선택한 ${selectedIds.length}개의 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="삭제"
        type="danger"
      />
    </div>
  );
}

export default Products;
