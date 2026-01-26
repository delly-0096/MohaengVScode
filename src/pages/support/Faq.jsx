import { useEffect, useState, useCallback } from 'react';
import {
  RiSearchLine, RiAddLine, RiEyeLine, RiEditLine, RiDeleteBinLine,
  RiArrowUpLine, RiArrowDownLine, RiFileListLine, RiFilterLine,
  RiUserLine, RiCalendar2Line, RiWallet3Line, RiCoinLine, RiCustomerService2Line
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';
import api from '../../api/api';

/* ============================================================
   1. 카테고리 및 데이터 매핑 설정 (VO 필드 기준)
   ============================================================ */
const categories = [
  { id: 'all', label: '전체', icon: RiFileListLine },
  { id: 'account', label: '회원/계정', icon: RiUserLine },
  { id: 'schedule', label: '일정/예약', icon: RiCalendar2Line },
  { id: 'payment', label: '결제/환불', icon: RiWallet3Line },
  { id: 'point', label: '포인트', icon: RiCoinLine },
  { id: 'service', label: '서비스 이용', icon: RiCustomerService2Line }
];

const categoryColors = {
  account: { className: 'badge-info', label: '회원/계정' },
  schedule: { className: 'badge-success', label: '일정/예약' },
  payment: { className: 'badge-warning', label: '결제/환불' },
  point: { className: 'badge-primary', label: '포인트' },
  service: { className: 'badge-secondary', label: '서비스 이용' }
};

function Faq() {
  const [faqList, setFaqList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, faq: null });
  const [editModal, setEditModal] = useState({ isOpen: false, faq: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, faq: null });
  const [addModal, setAddModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  /* ============================================================
  2. 데이터 변환 함수 (VO ↔ UI 모델) -로직안으로 배치했음.
  ============================================================ */
  
  // 서버에서 온 FaqVO를 리액트 상태로 변환
  const mapVoToUi = (vo) => ({
    id: vo.faqNo,
    category: vo.faqCategoryCd,
    question: vo.faqTitle,
    answer: vo.faqContent,
    order: vo.faqOrder,
    views: vo.views,
    isActive: vo.useYn === 'Y',
    createdAt: vo.regDt ? vo.regDt.substring(0, 10) : '-',
    regId: vo.regId // 작성자/최종수정자 확인용
  });

  // 리액트 상태를 서버용 FaqVO로 변환
  const mapUiToVo = (ui) => {
    // 세션이나 로컬스토리지에서 실제 관리자 ID를 가져옴 (없으면 'admin01')
    //const currentAdminId = localStorage.getItem('adminId') || 'admin01';+

    // 수정 시에도 현재 로그인한 관리자 ID를 덮어씌워 '최종 수정자' 기록
    const adminUser = JSON.parse(localStorage.getItem('adminUser'));
    const currentAdminId = String(adminUser.no); // memNo를 String으로

      if (!currentAdminId) {
        alert("로그인 정보가 사라졌습니다. 다시 로그인해주세요.");
        return; // 여기서 함수 중단!
      }
      console.log("currentAdminId : " + currentAdminId)
    return {
      faqNo: ui.id,
      faqCategoryCd: ui.category,
      faqTitle: ui.question,
      faqContent: ui.answer,
      faqOrder: ui.order,
      useYn: ui.isActive ? 'Y' : 'N',
      regId: currentAdminId // 하드코딩 탈피
    };
  };

  /* ============================================================
  3. 서버 통신 로직 (VO 명칭 사용)
  ============================================================ */
  const fetchFaqList = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        keyword: searchTerm || null,
        faqCategoryCd: selectedCategory !== 'all' ? selectedCategory : null,
        useYn: statusFilter === 'active' ? 'Y' : statusFilter === 'inactive' ? 'N' : null
      };
      const res = await api.get('/admin/support/faq', { params });
      // VO 데이터를 UI 모델로 변환하여 저장
      setFaqList(res.data.map(mapVoToUi));
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, statusFilter]);

  useEffect(() => { fetchFaqList(); }, [fetchFaqList]);

  // 활성/비활성 토글 (서버 URL: /use-yn 통일)
  const handleToggleActive = async (faq) => {
    try {
      const targetStatus = faq.isActive ? 'N' : 'Y';
      await api.patch(`/admin/support/faq/${faq.id}/use-yn`, null, {
        params: { useYn: targetStatus }
      });
      fetchFaqList();
    } catch (err) { alert(err.response?.data?.message ||'상태 변경 실패'); }
  };

  // 순서 변경 (서버 URL: /order 통일)
  const handleMoveOrder = async (currentFaq, targetFaq) => {
    if (!targetFaq) return;

    console.log("보내는 데이터:", currentFaq.id, targetFaq.id);
    try {
      await api.patch('/admin/support/faq/order', null, {
        params: { currentFaqNo: currentFaq.id, targetFaqNo: targetFaq.id }
      });
      fetchFaqList(); 
    } catch (err) { alert(err.response?.data?.message ||'순서 변경 실패'); }
  };

  /* ============================================================
  4. 등록 / 수정 / 삭제 제출 로직
  ============================================================ */
  const handleAddSubmit = async () => {
    if (!editForm.question || !editForm.answer) return alert('필수 항목을 입력하세요.');
    try {
      await api.post('/admin/support/faq', mapUiToVo(editForm));
      setAddModal(false);
      setEditForm({}); // 제출 후 폼 초기화
      fetchFaqList();
    } catch (err) { alert(err.response?.data?.message ||'등록 실패'); }
  };

  const handleEditSubmit = async () => {
    try {
      await api.put(`/admin/support/faq/${editForm.id}`, mapUiToVo(editForm));
      setEditModal({ isOpen: false, faq: null });
      fetchFaqList();
    } catch (err) { alert(err.response?.data?.message ||'수정 실패'); }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/support/faq/${deleteModal.faq.id}`);
      setDeleteModal({ isOpen: false, faq: null });
      fetchFaqList();
    } catch (err) { alert(err.response?.data?.message ||'삭제 실패'); }
  };

  /* ============================================================
  5. 조회수 증가 / 통계 계산 로직
  ============================================================ */
  const handleViewDetail = async (faq) => {
    try {
      await api.patch(`/admin/support/faq/${faq.id}/views`); //여기 views 어떻게 할꺼임?????????????
      setDetailModal({ isOpen: true, faq });
      await fetchFaqList(); // 갱신
    } catch(err) { alert(err.response?.data?.message ||'조회수 증가 실패');}
  };

  const stats = {
    total : faqList.length,
    active : faqList.filter(f => f.isActive).length,
    categories : new Set(faqList.map(f => f.category)).size,
    views : faqList.reduce((sum,f) => sum + f.views,0)
  };
  
  /* ============================================================
  6. 최종 렌더링 (Return 하나로 통합)
  ============================================================ */
  return (

    <div className="page-container">
       {/* 헤더 */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2>자주 묻는 질문 관리</h2>
        <button className="btn btn-primary" onClick={() => {
          setEditForm({ category: 'account', isActive: true, question: '', answer: '' });
          setAddModal(true);
        }}>
          <RiAddLine /> FAQ 작성
        </button>
      </div>
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>{stats.total}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>전체 FAQ</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{stats.active}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>활성 FAQ</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{stats.categories}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>카테고리</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>{stats.views.toLocaleString()}</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>총 조회수</div>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            style={{
              padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: selectedCategory === cat.id ? 'var(--primary-color)' : '#f1f5f9',
              color: selectedCategory === cat.id ? 'white' : '#64748b',
              display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', fontWeight: 500
            }}
          >
            <cat.icon /> {cat.label}
          </button>
        ))}
      </div>

      {/* 리스트 카드 */}  
      <div className="card">
        <div className="filter-bar" style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
          <div className="search-bar" style={{ position: 'relative', width: 300 }}>
            <RiSearchLine style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              className="form-input" style={{ paddingLeft: 36 }}
              placeholder="질문, 답변 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="form-input" style={{ width: 'auto' }}
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">전체 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 80 }}>순서</th>
                <th style={{ width: 120 }}>카테고리</th>
                <th>질문</th>
                <th style={{ width: 100 }}>조회수</th>
                <th style={{ width: 100 }}>작성일</th>
                <th style={{ width: 80 }}>상태</th>
                <th style={{ width: 120 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {faqList.map((faq, index) => (
                <tr key={faq.id} style={{ opacity: faq.isActive ? 1 : 0.5 }}>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="table-action-btn" disabled={index === 0} onClick={() => handleMoveOrder(faq, faqList[index-1])}><RiArrowUpLine /></button>
                      <button className="table-action-btn" disabled={index === faqList.length - 1} onClick={() => handleMoveOrder(faq, faqList[index+1])}><RiArrowDownLine /></button>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${categoryColors[faq.category]?.className}`}>
                      {categoryColors[faq.category]?.label}
                    </span>
                  </td>
                  <td className="font-medium" style={{ cursor: 'pointer' }} onClick={() => handleViewDetail(faq)}>
                    {faq.question}
                  </td>
                  <td>{faq.views.toLocaleString()}</td>
                  <td style={{ fontSize: '0.875rem', color: '#64748b' }}>{faq.createdAt}</td> 
                  <td>
                    <button className={`badge ${faq.isActive ? 'badge-success' : 'badge-gray'}`} onClick={() => handleToggleActive(faq)} style={{ border: 'none', cursor: 'pointer' }}>
                      {faq.isActive ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" onClick={() => handleViewDetail(faq)}><RiEyeLine /></button>
                      <button className="table-action-btn edit" onClick={() => { setEditForm({...faq}); setEditModal({ isOpen: true, faq }); }}><RiEditLine /></button>
                      <button className="table-action-btn delete" onClick={() => setDeleteModal({ isOpen: true, faq })}><RiDeleteBinLine /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  
     {/* 5. 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, faq: null })}
        title="FAQ 상세"
        size="large"
      >
        {detailModal.faq && (
          <div className="detail-view">
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <span className={`badge ${categoryColors[detailModal.faq.category]?.className}`}>
                {categoryColors[detailModal.faq.category]?.label}
              </span>
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                조회수 {detailModal.faq.views.toLocaleString()} | 등록일 {detailModal.faq.createdAt}
              </span>
            </div>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: 15 }}>Q. {detailModal.faq.question}</h3>
            <div style={{ padding: 20, background: '#f8fafc', borderRadius: 8, whiteSpace: 'pre-line', lineHeight: 1.7 }}>
              {detailModal.faq.answer}
            </div>
          </div>
        )}
      </Modal>

      {/* 6. 작성/수정 모달 (통합) */}
      <Modal
        isOpen={addModal || editModal.isOpen}
        onClose={() => { setAddModal(false); setEditModal({ isOpen: false, faq: null }); }}
        title={addModal ? "FAQ 작성" : "FAQ 수정"}
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => { setAddModal(false); setEditModal({ isOpen: false, faq: null }); }}>취소</button>
            <button className="btn btn-primary" onClick={addModal ? handleAddSubmit : handleEditSubmit}>
              {addModal ? '등록' : '저장'}
            </button>
          </>
        }
      >
        <div className="form-container">
          <div className="form-group">
            <label className="form-label">카테고리</label>
            <select 
              className="form-input" 
              value={editForm.category} 
              onChange={(e) => setEditForm({...editForm, category: e.target.value})}
            >
              {categories.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">질문 <span className="text-danger">*</span></label>
            <input 
              className="form-input" 
              value={editForm.question} 
              onChange={(e) => setEditForm({...editForm, question: e.target.value})}
              placeholder="질문을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label className="form-label">답변 <span className="text-danger">*</span></label>
            <textarea 
              className="form-input" rows={8}
              value={editForm.answer} 
              onChange={(e) => setEditForm({...editForm, answer: e.target.value})}
              placeholder="상세 답변을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={editForm.isActive} 
                onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})} 
              />
              사용자에게 노출 (활성화)
            </label>
          </div>
        </div>
      </Modal>

      {/* 7. 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, faq: null })}
        onConfirm={handleDeleteConfirm}
        title="FAQ 삭제"
        message={`"${deleteModal.faq?.question}" FAQ를 삭제하시겠습니까?\n\n삭제된 FAQ는 복구할 수 없습니다.`}
        type="danger"
      />
    </div>
  );
}

export default Faq;