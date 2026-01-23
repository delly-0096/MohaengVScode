import { useState, useEffect } from 'react';
import {
  Search, Filter, Eye, Reply, Mail, User, Calendar, HelpCircle,
  FileText, CheckCircle, Clock, Paperclip, Ticket, Wallet, Coins,
  Headphones, MoreHorizontal, Trash2, Download
} from 'lucide-react';

const categories = [
  { id: 'all', label: '전체', icon: FileText },
  { id: 'INQRY_001', label: '회원/계정', icon: User },
  { id: 'INQRY_002', label: '일정/예약', icon: Calendar },
  { id: 'INQRY_003', label: '결제/환불', icon: Wallet },
  { id: 'INQRY_004', label: '포인트', icon: Coins },
  { id: 'INQRY_005', label: '서비스 이용 안내', icon: Headphones },
  { id: 'INQRY_006', label: '기타', icon: MoreHorizontal }
];

const categoryColors = {
  'INQRY_001': '#0dcaf0', 'INQRY_002': '#10b981', 'INQRY_003': '#f59e0b',
  'INQRY_004': '#4A90D9', 'INQRY_005': '#6c757d', 'INQRY_006': '#94a3b8'
};

const statusLabels = {
  waiting: { label: '답변대기', color: '#dc2626' },
  answered: { label: '답변완료', color: '#16a34a' }
};

function Modal({ isOpen, onClose, title, size = 'medium', footer, children }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', borderRadius: 12, width: size === 'large' ? '800px' : '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
        </div>
        <div style={{ padding: 24, flex: 1, overflowY: 'auto' }}>{children}</div>
        {footer && <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>{footer}</div>}
      </div>
    </div>
  );
}

export default function Inquiries() {
  const [inquiriesData, setInquiriesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({ total: 0, waiting: 0, answered: 0, today: 0 });
  const [detailModal, setDetailModal] = useState({ isOpen: false, inquiry: null });
  const [answerModal, setAnswerModal] = useState({ isOpen: false, inquiry: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, inquiry: null });
  const [answerText, setAnswerText] = useState('');
  const [deleteReason, setDeleteReason] = useState('');

  const fetchInquiries = async () => {
    console.log("검색 필터 확인:", {
      inqryStatus: statusFilter === 'all' ? '' : statusFilter,
      inqryCtgryCd: categoryFilter === 'all' ? '' : categoryFilter
    });
    setLoading(true);
    try {
      // 1. 저장된 토큰 가져오기 (관리자 로그인 시 저장했던 이름 확인 필요)
      const token = localStorage.getItem('access_token');
      console.log("1. 보내는 토큰:", token); // 토큰이 잘 읽히는지 확인

      // 1. 기본 파라미터 설정 (항상 필요한 것들)
    const queryParams = {
      currentPage: currentPage,
      screenSize: 10,
      searchWord: searchWord || ""
    };

    // 2. 'all'이 아닐 때만 파라미터에 "추가"한다! (이게 핵심 포인트)
    if (statusFilter !== 'all') {
      queryParams.inqryStatus = statusFilter;
    }
    if (categoryFilter !== 'all') {
      queryParams.inqryCtgryCd = categoryFilter;
    }

      // 3. 이제 이 객체를 URL 파라미터 형태로 바꿉니다.
    const params = new URLSearchParams(queryParams);
    
    console.log("🔥 최종 요청 URL 확인:", params.toString());

    // 4. 서버 호출
    const response = await fetch(`http://localhost:8272/api/admin/inquiry?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('서버 응답 오류'); 

    const data = await response.json();
    console.log("✅ 서버에서 받은 데이터:", data);

    // 데이터 세팅 (이하 동일)
    setInquiriesData(data.dataList || []);
    setTotalCount(data.totalRecord || 0);
    setTotalPages(data.totalPage || 1);
    
    const today = new Date().toISOString().split('T')[0];
    setStats({
      total: data.totalRecord || 0,
      waiting: data.dataList?.filter(i => i.inqryStatus === 'waiting').length || 0,
      answered: data.dataList?.filter(i => i.inqryStatus === 'answered').length || 0,
      today: data.dataList?.filter(i => i.regDt?.startsWith(today)).length || 0
    });
  } catch (error) {
    console.error('문의 목록 조회 실패:', error);
    alert('문의 목록을 불러오는데 실패했습니다.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchInquiries();
  }, [currentPage, categoryFilter, statusFilter]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchInquiries();
  };

  const handleViewDetail = async (inquiry) => {
    try {
      const response = await fetch(`http://localhost:8272/api/admin/inquiry/${inquiry.inqryNo}`);
      const detailData = await response.json();

      console.log("🔥 서버에서 넘겨준 상세 데이터 전체:", detailData);
      console.log("📎 첨부파일 목록 확인:", detailData.attachFiles);

      setDetailModal({ isOpen: true, inquiry: detailData });
    } catch (error) {
      console.error('상세 조회 실패:', error);
      alert('문의 상세를 불러오는데 실패했습니다.');
    }
  };

  const handleAnswer = (inquiry) => {
    setAnswerText(inquiry.replyCn || '');
    setAnswerModal({ isOpen: true, inquiry });
  };

  const handleAnswerSubmit = async () => {
    if (!answerText.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8272/api/admin/inquiry/reply`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inqryNo: answerModal.inquiry.inqryNo,
          memNo: answerModal.inquiry.memNo,
          inqryTitle: answerModal.inquiry.inqryTitle,
          replyCn: answerText,
          replyMemNo: 1
        })
      });
      if (response.ok) {
        alert('답변이 등록되었으며, 고객에게 이메일이 발송되었습니다.');
        setAnswerModal({ isOpen: false, inquiry: null });
        setAnswerText('');
        fetchInquiries();
      } else {
        throw new Error('답변 등록 실패');
      }
    } catch (error) {
      console.error('답변 등록 실패:', error);
      alert('답변 등록에 실패했습니다.');
    }
  };

  const handleDelete = (inquiry) => {
    setDeleteReason('');
    setDeleteModal({ isOpen: true, inquiry });
  };

  const handleDeleteSubmit = async () => {
    if (!deleteReason.trim()) {
      alert('삭제 사유를 입력해주세요.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8272/api/admin/inquiry/${deleteModal.inquiry.inqryNo}?alarmCont=${encodeURIComponent(deleteReason)}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('문의가 삭제되었으며, 작성자에게 알림이 전송되었습니다.');
        setDeleteModal({ isOpen: false, inquiry: null });
        setDeleteReason('');
        setDetailModal({ isOpen: false, inquiry: null });
        fetchInquiries();
      } else {
        throw new Error('삭제 실패');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('문의 삭제에 실패했습니다.');
    }
  };

// Inquiries.jsx 내부의 handleFileDownload 함수
const handleFileDownload = async (fileNo, fileName) => {
  console.log("📥 다운로드 시작:", fileName);
  
  try {
    const token = localStorage.getItem('access_token');
    
    // 💡 주소 형식을 서버와 맞춰서 쿼리 스트링(?fileNo=)으로 변경!
    const response = await fetch(`http://localhost:8272/api/admin/inquiry/download?fileNo=${fileNo}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` // 관리자 인증 필수
      }
    });

    if (!response.ok) throw new Error('파일 다운로드에 실패했습니다.');

    // 파일 데이터를 Blob으로 변환하여 실제 파일로 내려받기 처리
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName; // 원본 파일명으로 저장
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
  } catch (error) {
    console.error('다운로드 오류:', error);
    alert('파일을 내려받을 수 없습니다.');
  }
};

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: 8 }}>1:1 문의 관리</h1>
        <p style={{ color: '#64748b' }}>고객 문의를 확인하고 답변합니다</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        {[
          { icon: HelpCircle, value: stats.total, label: '전체 문의', color: '#4A90D9' },
          { icon: Clock, value: stats.waiting, label: '답변 대기', color: '#ef4444' },
          { icon: CheckCircle, value: stats.answered, label: '답변 완료', color: '#10b981' },
          { icon: Mail, value: stats.today, label: '오늘 접수', color: '#f59e0b' }
        ].map((stat, idx) => (
          <div key={idx} style={{ padding: 20, background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <stat.icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.waiting > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 16, color: '#dc2626' }}>
          <Mail size={20} />
          <span style={{ fontWeight: 500 }}>답변 대기 중인 문의가 {stats.waiting}건 있습니다. 빠른 답변 부탁드립니다.</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {categories.map(cat => {
          const IconComponent = cat.icon;
          return (
            <button key={cat.id} onClick={() => setCategoryFilter(cat.id)} style={{ padding: '8px 16px', borderRadius: 20, border: 'none', background: categoryFilter === cat.id ? '#4A90D9' : '#f1f5f9', color: categoryFilter === cat.id ? 'white' : '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s' }}>
              <IconComponent size={16} />
              {cat.label}
            </button>
          );
        })}
      </div>

      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input type="text" placeholder="제목, 문의자, 이메일 검색" value={searchWord} onChange={(e) => setSearchWord(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Filter size={18} style={{ color: '#64748b' }} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', background: 'white', cursor: 'pointer' }}>
              <option value="all">전체 상태</option>
              <option value="waiting">답변대기</option>
              <option value="answered">답변완료</option>
            </select>
          </div>
          <button onClick={handleSearch} style={{ padding: '10px 20px', background: '#4A90D9', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>검색</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569', width: 100 }}>카테고리</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569' }}>제목</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569', width: 140 }}>문의자</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#475569', width: 140 }}>문의일시</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', color: '#475569', width: 120 }}>상태</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', color: '#475569', width: 160 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>로딩 중...</td></tr>
              ) : inquiriesData.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>문의 내역이 없습니다.</td></tr>
              ) : (
                inquiriesData.map(inquiry => (
                  <tr key={inquiry.inqryNo} style={{ borderBottom: '1px solid #f1f5f9', background: inquiry.inqryStatus === 'waiting' ? '#fefce8' : 'white' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 500, background: categoryColors[inquiry.inqryCtgryCd] + '20', color: categoryColors[inquiry.inqryCtgryCd], whiteSpace: 'nowrap' }}>{inquiry.categoryName}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div onClick={() => handleViewDetail(inquiry)} style={{ cursor: 'pointer', fontWeight: 500, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {inquiry.inqryTitle}
                        {inquiry.attachFiles && inquiry.attachFiles.length > 0 && <Paperclip size={14} style={{ color: '#64748b' }} />}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{inquiry.memberName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{inquiry.inqryEmail}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: '#64748b' }}>{inquiry.regDt ? new Date(inquiry.regDt).toLocaleString('ko-KR') : '-'}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 500, background: statusLabels[inquiry.inqryStatus]?.color + '20', color: statusLabels[inquiry.inqryStatus]?.color }}>{statusLabels[inquiry.inqryStatus]?.label || inquiry.inqryStatus}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button onClick={() => handleViewDetail(inquiry)} style={{ padding: '6px 10px', background: '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="상세보기"><Eye size={16} /></button>
                        {inquiry.inqryStatus === 'waiting' && (
                          <button onClick={() => handleAnswer(inquiry)} style={{ padding: '6px 10px', background: '#dbeafe', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="답변하기"><Reply size={16} style={{ color: '#1e40af' }} /></button>
                        )}
                        <button onClick={() => handleDelete(inquiry)} style={{ padding: '6px 10px', background: '#fee2e2', border: 'none', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="삭제"><Trash2 size={16} style={{ color: '#dc2626' }} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', gap: 4 }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', background: 'white', borderRadius: 6, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>&lt;</button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', background: currentPage === page ? '#4A90D9' : 'white', color: currentPage === page ? 'white' : '#475569', borderRadius: 6, cursor: 'pointer', fontWeight: currentPage === page ? 600 : 400 }}>{page}</button>;
          })}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', background: 'white', borderRadius: 6, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}>&gt;</button>
        </div>
      </div>

      <Modal isOpen={detailModal.isOpen} onClose={() => setDetailModal({ isOpen: false, inquiry: null })} title="문의 상세" size="large" footer={detailModal.inquiry && (
        <div style={{ display: 'flex', gap: 8 }}>
          {detailModal.inquiry.inqryStatus === 'waiting' && (
            <button onClick={() => { setDetailModal({ isOpen: false, inquiry: null }); handleAnswer(detailModal.inquiry); }} style={{ padding: '10px 20px', background: '#4A90D9', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}><Reply size={16} /> 답변하기</button>
          )}
          <button onClick={() => { setDetailModal({ isOpen: false, inquiry: null }); handleDelete(detailModal.inquiry); }} style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}><Trash2 size={16} /> 삭제하기</button>
        </div>
      )}>
        {detailModal.inquiry && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ padding: '6px 12px', borderRadius: 12, fontSize: '0.875rem', fontWeight: 500, background: categoryColors[detailModal.inquiry.inqryCtgryCd] + '20', color: categoryColors[detailModal.inquiry.inqryCtgryCd] }}>{detailModal.inquiry.categoryName}</span>
              <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 500, background: statusLabels[detailModal.inquiry.inqryStatus]?.color + '20', color: statusLabels[detailModal.inquiry.inqryStatus]?.color }}>{statusLabels[detailModal.inquiry.inqryStatus]?.label}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, padding: 16, background: '#f8fafc', borderRadius: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><User size={16} style={{ color: '#64748b' }} /><span style={{ color: '#64748b', fontSize: '0.875rem' }}>문의자</span><span style={{ fontWeight: 500 }}>{detailModal.inquiry.memberName}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={16} style={{ color: '#64748b' }} /><span style={{ color: '#64748b', fontSize: '0.875rem' }}>이메일</span><span style={{ fontWeight: 500 }}>{detailModal.inquiry.inqryEmail}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Calendar size={16} style={{ color: '#64748b' }} /><span style={{ color: '#64748b', fontSize: '0.875rem' }}>문의일시</span><span style={{ fontWeight: 500 }}>{detailModal.inquiry.regDt ? new Date(detailModal.inquiry.regDt).toLocaleString('ko-KR') : '-'}</span></div>
              {detailModal.inquiry.inquiryTargetNo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Ticket size={16} style={{ color: '#64748b' }} /><span style={{ color: '#64748b', fontSize: '0.875rem' }}>예약번호</span><span style={{ fontWeight: 500, color: '#4A90D9' }}>{detailModal.inquiry.inquiryTargetNo}</span></div>
              )}
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #4A90D9' }}><HelpCircle size={18} style={{ color: '#4A90D9' }} /><span style={{ fontWeight: 600, color: '#4A90D9' }}>문의 내용</span></div>
              <h4 style={{ marginBottom: 12, fontSize: '1.05rem', fontWeight: 600 }}>{detailModal.inquiry.inqryTitle}</h4>
              <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{detailModal.inquiry.inqryCn}</div>
              {detailModal.inquiry.attachFiles && detailModal.inquiry.attachFiles.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Paperclip size={16} style={{ color: '#64748b' }} /><span style={{ fontSize: '0.875rem', color: '#64748b' }}>첨부파일 ({detailModal.inquiry.attachFiles.length})</span></div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {detailModal.inquiry.attachFiles.map((file) => (
                      <button key={file.FILE_NO} onClick={() => handleFileDownload(file.FILE_NO, file.FILE_ORIGINAL_NAME)} style={{ padding: '8px 12px', background: '#e2e8f0', border: 'none', borderRadius: 6, fontSize: '0.875rem', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Download size={14} />{file.FILE_ORIGINAL_NAME}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {detailModal.inquiry.replyCn && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid #10b981' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Reply size={18} style={{ color: '#10b981' }} /><span style={{ fontWeight: 600, color: '#10b981' }}>답변</span></div>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{detailModal.inquiry.replyDt ? new Date(detailModal.inquiry.replyDt).toLocaleString('ko-KR') : ''}</span>
                </div>
                <div style={{ padding: 16, background: '#f0fdf4', borderRadius: 8, borderLeft: '4px solid #10b981', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{detailModal.inquiry.replyCn}</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={answerModal.isOpen} onClose={() => setAnswerModal({ isOpen: false, inquiry: null })} title="문의 답변" size="large" footer={<><button onClick={() => setAnswerModal({ isOpen: false, inquiry: null })} style={{ padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>취소</button><button onClick={handleAnswerSubmit} disabled={!answerText.trim()} style={{ padding: '10px 20px', background: !answerText.trim() ? '#cbd5e1' : '#4A90D9', color: 'white', border: 'none', borderRadius: 8, cursor: !answerText.trim() ? 'not-allowed' : 'pointer', fontWeight: 500 }}>답변 등록</button></>}>
        {answerModal.inquiry && (
          <div>
            <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 500, background: categoryColors[answerModal.inquiry.inqryCtgryCd] + '20', color: categoryColors[answerModal.inquiry.inqryCtgryCd] }}>{answerModal.inquiry.categoryName}</span>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{answerModal.inquiry.memberName} | {answerModal.inquiry.regDt ? new Date(answerModal.inquiry.regDt).toLocaleString('ko-KR') : ''}</span>
              </div>
              <h4 style={{ marginBottom: 8, fontSize: '1rem', fontWeight: 600 }}>{answerModal.inquiry.inqryTitle}</h4>
              <p style={{ color: '#64748b', lineHeight: 1.6, whiteSpace: 'pre-line', margin: 0 }}>{answerModal.inquiry.inqryCn}</p>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>답변 내용 <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} placeholder={'답변 내용을 입력하세요...\n\n안녕하세요, 모행입니다.\n\n[답변 내용]\n\n추가 문의사항이 있으시면 말씀해주세요.\n감사합니다.'} style={{ width: '100%', minHeight: 200, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit' }} />
              <div style={{ marginTop: 8, fontSize: '0.875rem', color: '#64748b' }}>답변은 고객의 이메일({answerModal.inquiry.inqryEmail})로 자동 발송됩니다.</div>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, inquiry: null })} title="문의 삭제" size="medium" footer={<><button onClick={() => setDeleteModal({ isOpen: false, inquiry: null })} style={{ padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>취소</button><button onClick={handleDeleteSubmit} disabled={!deleteReason.trim()} style={{ padding: '10px 20px', background: !deleteReason.trim() ? '#fca5a5' : '#ef4444', color: 'white', border: 'none', borderRadius: 8, cursor: !deleteReason.trim() ? 'not-allowed' : 'pointer', fontWeight: 500 }}>삭제하기</button></>}>
        {deleteModal.inquiry && (
          <div>
            <div style={{ padding: 16, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Trash2 size={20} style={{ color: '#dc2626' }} /><span style={{ fontWeight: 600, color: '#dc2626' }}>문의를 삭제하시겠습니까?</span></div>
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>삭제된 문의는 복구할 수 없으며, 작성자에게 삭제 사유가 포함된 알림이 전송됩니다.</p>
            </div>
            <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8, marginBottom: 20 }}>
              <h4 style={{ marginBottom: 8, fontSize: '1rem', fontWeight: 600 }}>{deleteModal.inquiry.inqryTitle}</h4>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{deleteModal.inquiry.memberName} | {deleteModal.inquiry.regDt ? new Date(deleteModal.inquiry.regDt).toLocaleString('ko-KR') : ''}</div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>삭제 사유 <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} placeholder="삭제 사유를 입력하세요. 이 내용은 작성자에게 알림으로 전송됩니다." style={{ width: '100%', minHeight: 120, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}