import { useState, useRef, useEffect } from 'react';
import {
  RiSearchLine,
  RiAddLine,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiPushpinLine,
  RiCalendarLine,
  RiFileListLine,
  RiMegaphoneLine,
  RiGiftLine,
  RiRefreshLine,
  RiCheckboxCircleLine,
  RiFilterLine,
  RiImageAddLine,
  RiCloseLine,
  RiImageLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';
import api from '../../api/api';
import axios from 'axios';

// 카테고리 정의 (사용자 페이지와 동일)
const categories = [
  { id: 'all', label: '전체', icon: RiFileListLine },
  { id: '공지', label: '공지', icon: RiMegaphoneLine },
  { id: '이벤트', label: '이벤트', icon: RiGiftLine },
  { id: '업데이트', label: '업데이트', icon: RiRefreshLine }
];

const categoryColors = {
  '공지': { className: 'badge-primary', color: '#4A90D9' },
  '이벤트': { className: 'badge-success', color: '#10b981' },
  '업데이트': { className: 'badge-warning', color: '#f59e0b' }
};


// 더미 데이터 (사용자 페이지와 동일한 구조)
const initialNoticesData = [
  {
    id: 1,
    title: '[공지] 개인정보 처리방침 개정 안내',
    category: '공지',
    views: 1234,
    isPinned: true,
    createdAt: '2024-03-15',
    status: 'PUBLISHED',
    content: '안녕하세요, 모행입니다.\n\n2024년 4월 1일부터 적용되는 개인정보 처리방침 개정 내용을 안내드립니다.\n\n주요 변경사항:\n1. 개인정보 수집 항목 변경\n2. 개인정보 보유 기간 조정\n3. 제3자 제공 동의 절차 개선\n\n자세한 내용은 개인정보 처리방침 페이지에서 확인하실 수 있습니다.\n\n감사합니다.',
    images: []
  },


];

function Notices() {
  const [noticesData, setNoticesData] = useState(initialNoticesData);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    api.get('/admin/notices')
      .then(res => {
        const mapped = (res.data ?? []).map(n => ({
          id: n.ntcNo ?? n.id,
          title: n.ntcTitle ?? n.title ?? '',
          category: n.ntcType ?? n.ntcCategory ?? n.category ?? '공지',
          views: n.views ?? n.viewCnt ?? 0,
          isPinned: (n.isPinned ?? n.pinYn) === true || (n.pinYn === 'Y'),
          createdAt: (n.createdAt ?? n.regDt ?? n.regDate ?? '').toString().slice(0, 10),
          status: n.status ?? (n.useYn === 'Y' ? 'PUBLISHED' : 'DRAFT') ?? 'PUBLISHED',
          content: n.content ?? n.ntcContent ?? '',
          images: n.images ?? []
        }));
        setNoticesData(mapped);
      })
      .catch(error => {
        console.log("API FAIL:", error.config?.method, error.config?.url, error.response?.status);
        console.error(error);
      });
  }, []);

  const handleAddSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("ntcTitle", editForm.title);
      formData.append("ntcContent", editForm.content);
      formData.append("pinYn", editForm.isPinned ? "Y" : "N");
      formData.append("useYn", editForm.status === "PUBLISHED" ? "Y" : "N");
      formData.append("ntcType", editForm.category);

      console.log("체로롱:", selectedFiles);
      selectedFiles.forEach(file => {
        formData.append("ntcFile", file);
      });

      // 목록 새로고침
      await api.post("/admin/notices", formData);

      const res = await api.get("/admin/notices");
      console.log("res", res);
      const mapped = (res.data ?? []).map(n => ({
        id: n.ntcNo,
        title: n.ntcTitle ?? "",
        category: n.ntcType ?? n.ntcCategory ?? "공지",
        views: n.viewCnt ?? 0,
        isPinned: n.pinYn === "Y",
        createdAt: (n.regDt ?? "").toString().slice(0, 10),
        status: (n.useYn === "Y" ? "PUBLISHED" : "DRAFT"),
        content: n.ntcContent ?? "",
        images: n.images ?? []
      }));
      setNoticesData(mapped);

      setAddModal(false);
      alert("공지사항이 등록되었습니다.");
    } catch (e) {
      console.error(e);
      alert("등록 실패");
    }
  };

  const handleEditSubmit = async () => {
    try {
      const payload = {
        ntcTitle: editForm.title,
        ntcContent: editForm.content,
        ntcType: editForm.category,
        pinYn: editForm.isPinned ? "Y" : "N",
        status: editForm.status === "PUBLISHED" ? "Y" : "N"

      };
      await api.put(`/admin/notices/${editForm.id}`, payload);

      // 로컬 상태 업데이트(빠르고 깔끔)
      setNoticesData(prev => prev.map(n => n.id === editForm.id ? { ...n, ...editForm } : n));

      setEditModal({ isOpen: false, notice: null });
      alert("공지사항이 수정되었습니다.");
    } catch (e) {
      console.error(e);
      alert("수정 실패");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/notices/${deleteModal.notice.id}`);

      setNoticesData(prev => prev.filter(n => n.id !== deleteModal.notice.id));
      setDeleteModal({ isOpen: false, notice: null });

      alert("공지사항이 삭제되었습니다.");
    } catch (e) {
      console.error(e);
      alert("삭제 실패");
    }
  };



  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, notice: null });
  const [editModal, setEditModal] = useState({ isOpen: false, notice: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, notice: null });
  const [addModal, setAddModal] = useState(false);
  const [editForm, setEditForm] = useState({});

  // 이미지 관련
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const filteredNotices = noticesData.filter(notice => {
    const matchesSearch = (notice.title ?? '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || notice.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || notice.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // 통계 계산
  const totalCount = noticesData.length;
  const publishedCount = noticesData.filter(n => n.status === 'PUBLISHED').length;
  const pinnedCount = noticesData.filter(n => n.isPinned).length;
  const totalViews = noticesData.reduce((sum, n) => sum + (n.views ?? 0), 0);


  // 이미지 업로드 핸들러
  const handleImageUpload = (e, isEdit = false) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);

    if (files.length === 0) return;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({
          ...prev,
          images: [...(prev.images || []), reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });

    // 파일 입력 초기화
    e.target.value = '';
  };

  // 이미지 삭제 핸들러
  const handleImageRemove = (index) => {
    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // 상세보기
  const handleViewDetail = async (notice) => {
    // 비동기 axios 요청 (detail) > 공지사항 + 파일 detail 가져오는 정보
    let n = null;
    try {
      //1)리스트에서 번호는 notice.id 로 통일돼 있음
      const ntcNo = notice?.id;
      if (!ntcNo) {
        alert('공지 번호가 없습니다.');
        return;
      }

      //2)공지 상세 조회(공지+attachNo)
      const res = await api.get(`/admin/notices/${ntcNo}`);
      const n = res.data;

      console.log("상세정보 보기 출력함!");
      console.log(n);
      const detail = {
        ...notice,
        content: n.ntcContent ?? notice.content,
        images: n.noticeFileList ?? []
      };
      //3)attachNo로 파일 detail 조회
      let fileList = [];
      const attachNo = n.attachNo ?? 0;

      //if (attachNo > 0) {
      //우리 url 파일조회 api
      //  const fileRes = await api.get(`/files/${attachNo}`);
      //  fileList = fileRes.data ?? [];
      //}

      notice.images = n.noticeFileList;
      setDetailModal({ isOpen: true, notice: detail });
    } catch (e) {

    }
  };

  // 추가
  const handleAdd = () => {
    setEditForm({ title: '', category: '공지', content: '', isPinned: false, status: 'DRAFT', images: [] });
    setAddModal(true);
  };



  // 수정
  const handleEdit = (notice) => {
    setEditForm({ ...notice, images: notice.images || [] });
    setEditModal({ isOpen: true, notice });
  };


  // 삭제
  const handleDelete = (notice) => {
    setDeleteModal({ isOpen: true, notice });
  };



  // 고정 토글
  const handleTogglePin = (notice) => {
    setNoticesData(prev => prev.map(n => n.id === notice.id ? { ...n, isPinned: !n.isPinned } : n));
  };

  // 이미지 업로드 영역 컴포넌트
  const ImageUploadSection = ({ isEdit = false }) => (
    <div className="form-group">
      <label className="form-label">
        <RiImageLine style={{ marginRight: 4 }} /> 이미지 첨부
      </label>

      {/* 이미지 미리보기 */}
      {editForm.images && editForm.images.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 12,
          marginBottom: 12
        }}>
          {editForm.images.map((img, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                borderRadius: 8,
                overflow: 'hidden',
                aspectRatio: '16/9'
              }}
            >
              <img
                src={img}
                alt={`첨부 이미지 ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <button
                type="button"
                onClick={() => handleImageRemove(index)}
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem'
                }}
              >
                <RiCloseLine />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 이미지 업로드 버튼 */}
      <div
        onClick={() => isEdit ? editFileInputRef.current?.click() : fileInputRef.current?.click()}
        style={{
          border: '2px dashed #e2e8f0',
          borderRadius: 8,
          padding: 24,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          background: '#f8fafc'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = '#4A90D9';
          e.currentTarget.style.background = '#f0f7ff';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.background = '#f8fafc';
        }}
      >
        <RiImageAddLine style={{ fontSize: '2rem', color: '#94a3b8', marginBottom: 8 }} />
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
          클릭하여 이미지를 추가하세요
        </p>
        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.75rem' }}>
          JPG, PNG, GIF (최대 5MB)
        </p>
      </div>

      <input
        ref={isEdit ? editFileInputRef : fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleImageUpload(e, isEdit)}
        style={{ display: 'none' }}
      />
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">공지사항 관리</h1>
          <p className="page-subtitle">
            공지사항을 작성하고 관리합니다
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleAdd}>
            <RiAddLine /> 공지사항 작성
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #4A90D9, #357ABD)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiFileListLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>{totalCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>전체 공지</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiCheckboxCircleLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{publishedCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>게시중</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiPushpinLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{pinnedCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>상단 고정</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiEyeLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>{totalViews.toLocaleString()}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>총 조회수</div>
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 탭 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none',
              background: categoryFilter === cat.id ? 'var(--primary-color)' : '#f1f5f9',
              color: categoryFilter === cat.id ? 'white' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
          >
            <cat.icon />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="공지사항 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group" style={{ display: 'flex', gap: 8 }}>
            <RiFilterLine />
            <select
              className="form-input form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 상태</option>
              <option value="PUBLISHED">게시중</option>
              <option value="DRAFT">임시저장</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th style={{ width: 80 }}>카테고리</th>
                <th>제목</th>
                <th style={{ width: 50 }}></th>
                <th style={{ width: 80 }}>조회수</th>
                <th style={{ width: 100 }}>작성일</th>
                <th style={{ width: 80 }}>상태</th>
                <th style={{ width: 110 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotices
                .sort((a, b) => {
                  if (a.isPinned && !b.isPinned) return -1;
                  if (!a.isPinned && b.isPinned) return 1;
                  return new Date(b.createdAt) - new Date(a.createdAt);
                })
                .map(notice => (
                  <tr key={notice.id} style={{ background: notice.isPinned ? '#fefce8' : 'transparent' }}>
                    <td>
                      <button
                        className="table-action-btn"
                        onClick={() => handleTogglePin(notice)}
                        title={notice.isPinned ? '고정 해제' : '상단 고정'}
                      >
                        <RiPushpinLine style={{ color: notice.isPinned ? '#f59e0b' : '#cbd5e1' }} />
                      </button>
                    </td>
                    <td>
                      <span
                        className={`badge ${categoryColors[notice.category]?.className || 'badge-gray'}`}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {notice.category}
                      </span>
                    </td>
                    <td>
                      <div
                        className="font-medium"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleViewDetail(notice)}
                      >
                        {notice.title}
                      </div>
                    </td>
                    <td>
                      {notice.images && notice.images.length > 0 && (
                        <span style={{ color: '#64748b', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 2 }}>
                          <RiImageLine /> {notice.images.length}
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: '0.875rem' }}>
                        <RiEyeLine /> {(notice.views ?? 0).toLocaleString()}

                      </span>
                    </td>
                    <td style={{ fontSize: '0.875rem', color: '#64748b' }}>{notice.createdAt}</td>
                    <td>
                      <span className={`badge ${notice.status === 'PUBLISHED' ? 'badge-success' : 'badge-gray'}`} style={{ whiteSpace: 'nowrap' }}>
                        {notice.status === 'DRAFT' ? '임시저장' : '게시중'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="table-action-btn" title="보기" onClick={() => handleViewDetail(notice)}>
                          <RiEyeLine />
                        </button>
                        <button className="table-action-btn edit" title="수정" onClick={() => handleEdit(notice)}>
                          <RiEditLine />
                        </button>
                        <button className="table-action-btn delete" title="삭제" onClick={() => handleDelete(notice)}>
                          <RiDeleteBinLine />
                        </button>
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
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">&gt;</button>
        </div>
      </div>

      {/* 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, notice: null })}
        title="공지사항 상세"
        size="large"
      >
        {
          detailModal.notice && (
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {/* 카테고리 뱃지 & 메타 정보 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span
                  className={`badge ${categoryColors[detailModal.notice.category]?.className || 'badge-gray'}`}
                  style={{ padding: '6px 12px', fontSize: '0.875rem' }}
                >
                  {detailModal.notice.category}
                </span>
                {detailModal.notice.isPinned && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontSize: '0.875rem' }}>
                    <RiPushpinLine /> 상단 고정
                  </span>
                )}
                <span className={`badge ${detailModal.notice.status === 'PUBLISHED' ? 'badge-success' : 'badge-gray'}`}>
                  {detailModal.notice.status === 'published' ? '게시중' : '임시저장'}
                </span>
              </div>

              {/* 제목 */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 16, lineHeight: 1.4 }}>
                {detailModal.notice.title}
              </h3>

              {/* 메타 정보 */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 20, padding: '12px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: '0.875rem' }}>
                  <RiCalendarLine /> {detailModal.notice.createdAt}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: '0.875rem' }}>
                  <RiEyeLine /> {(detailModal.notice?.views ?? 0).toLocaleString()}


                </span>
                {detailModal.notice.images && detailModal.notice.images.length > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: '0.875rem' }}>
                    <RiImageLine /> 이미지 {detailModal.notice.images.length}개
                  </span>
                )}
              </div>

              {/* 첨부 이미지 */}
              {detailModal.notice.images && detailModal.notice.images.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RiImageLine /> 첨부 이미지
                  </h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                    {detailModal.notice.images.map((img, index) => (
                      <div key={index} style={{ borderRadius: 8, overflow: 'hidden', aspectRatio: '16/9' }}>
                        <img
                          src={"http://localhost:8272/api/admin/notices/thumbnail/" + img.fileNo}
                          onError={(e) => {
                            console.log("thumbnail load fail", img.fileNo, e);
                          }}
                          alt={`첨부 이미지 ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => window.open(`http://localhost:8272/api/admin/notices/thumbnail/${img.fileNo}`, '_blank')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 본문 */}
              <div style={{
                padding: 20,
                background: '#f8fafc',
                borderRadius: 8,
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
                fontSize: '0.95rem'
              }}>
                {detailModal.notice.content}
              </div>
            </div>
          )}
      </Modal>

      {/* 추가 모달 */}
      <Modal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        title="공지사항 작성"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setAddModal(false)}>취소</button>
            <button
              className="btn btn-primary"
              onClick={handleAddSubmit}
              disabled={!editForm.title || !editForm.content}
            >
              등록
            </button>
          </>
        }
      >
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <div className="form-group">
            <label className="form-label">제목 <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="공지사항 제목을 입력하세요"
              value={editForm.title || ''}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">카테고리</label>
              <select
                className="form-input form-select"
                value={editForm.category || ''}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              >
                <option value="공지">공지</option>
                <option value="이벤트">이벤트</option>
                <option value="업데이트">업데이트</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">상태</label>
              <select
                className="form-input form-select"
                value={editForm.status || ''}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                <option value="DRAFT">임시저장</option>
                <option value="PUBLISHED">게시</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">내용 <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea
              className="form-input"
              rows={8}
              placeholder="공지사항 내용을 입력하세요"
              value={editForm.content || ''}
              onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* 이미지 업로드 섹션 */}
          <ImageUploadSection isEdit={false} />

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={editForm.isPinned || false}
                onChange={(e) => setEditForm({ ...editForm, isPinned: e.target.checked })}
              />
              상단 고정
            </label>
          </div>
        </div>
      </Modal>

      {/* 수정 모달 */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, notice: null })}
        title="공지사항 수정"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setEditModal({ isOpen: false, notice: null })}>취소</button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>저장</button>
          </>
        }
      >
        {editModal.notice && (
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            <div className="form-group">
              <label className="form-label">제목</label>
              <input
                type="text"
                className="form-input"
                value={editForm.title || ''}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">카테고리</label>
                <select
                  className="form-input form-select"
                  value={editForm.category || ''}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                >
                  <option value="공지">공지</option>
                  <option value="이벤트">이벤트</option>
                  <option value="업데이트">업데이트</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">상태</label>
                <select
                  className="form-input form-select"
                  value={editForm.status || ''}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="DRAFT">임시저장</option>
                  <option value="PUBLISHED">게시</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">내용</label>
              <textarea
                className="form-input"
                rows={8}
                value={editForm.content || ''}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* 이미지 업로드 섹션 */}
            <ImageUploadSection isEdit={true} />

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editForm.isPinned || false}
                  onChange={(e) => setEditForm({ ...editForm, isPinned: e.target.checked })}
                />
                상단 고정
              </label>
            </div>
          </div>
        )}
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, notice: null })}
        onConfirm={handleDeleteConfirm}
        title="공지사항 삭제"
        message={`"${deleteModal.notice?.title}" 공지사항을 삭제하시겠습니까?\n\n삭제된 공지사항은 복구할 수 없습니다.`}
        confirmText="삭제"
        type="danger"
      />
    </div>
  );
}

export default Notices;
