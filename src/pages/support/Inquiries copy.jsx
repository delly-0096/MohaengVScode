import { useState } from 'react';
import {
  RiSearchLine,
  RiFilterLine,
  RiEyeLine,
  RiReplyLine,
  RiMailLine,
  RiUserLine,
  RiCalendarLine,
  RiQuestionLine,
  RiFileListLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiAttachmentLine,
  RiTicket2Line,
  RiWallet3Line,
  RiCoinLine,
  RiCustomerService2Line,
  RiMore2Line
} from 'react-icons/ri';
import { Modal } from '../../components/common/Modal';

// 카테고리 정의 (사용자 페이지와 동일)
const categories = [
  { id: 'all', label: '전체', icon: RiFileListLine },
  { id: '회원/계정', label: '회원/계정', icon: RiUserLine },
  { id: '일정/예약', label: '일정/예약', icon: RiCalendarLine },
  { id: '결제/환불', label: '결제/환불', icon: RiWallet3Line },
  { id: '포인트', label: '포인트', icon: RiCoinLine },
  { id: '서비스 이용', label: '서비스 이용', icon: RiCustomerService2Line },
  { id: '기타', label: '기타', icon: RiMore2Line }
];

const categoryColors = {
  '회원/계정': { className: 'badge-info', color: '#0dcaf0' },
  '일정/예약': { className: 'badge-success', color: '#10b981' },
  '결제/환불': { className: 'badge-warning', color: '#f59e0b' },
  '포인트': { className: 'badge-primary', color: '#4A90D9' },
  '서비스 이용': { className: 'badge-secondary', color: '#6c757d' },
  '기타': { className: 'badge-gray', color: '#94a3b8' }
};

const statusLabels = {
  pending: { label: '답변대기', className: 'badge-danger' },
  answered: { label: '답변완료', className: 'badge-success' },
  closed: { label: '종료', className: 'badge-gray' }
};

// 더미 데이터 (사용자 페이지와 동일한 구조)
const initialInquiriesData = [
  {
    id: 1,
    category: '결제/환불',
    title: '환불 요청 관련 문의드립니다.',
    user: '김여행',
    email: 'travel@gmail.com',
    phone: '010-1234-5678',
    reservationNo: 'RSV-2024031001',
    content: '지난 주 예약한 제주 스쿠버다이빙 체험을 취소하고 싶습니다. 환불 가능한지 확인 부탁드립니다.',
    attachments: [],
    createdAt: '2024-03-10 14:32',
    status: 'answered',
    answer: '안녕하세요, 모행입니다.\n\n문의주신 예약건 확인했습니다. 이용일 기준 7일 이상 남아있어 전액 환불 가능합니다.\n마이페이지 > 결제 내역에서 직접 취소하시거나, 자동 취소 처리해드릴까요?\n\n추가 문의사항이 있으시면 말씀해주세요.\n감사합니다.',
    answeredAt: '2024-03-11 10:15',
    answeredBy: '관리자'
  },
  {
    id: 2,
    category: '포인트',
    title: '포인트 적립이 안됐어요',
    user: '이모행',
    email: 'mohaeng@naver.com',
    phone: '010-2345-6789',
    reservationNo: 'RSV-2024031302',
    content: '어제 이용 완료한 한라산 트레킹 투어 포인트가 아직 적립되지 않았습니다. 확인 부탁드립니다.',
    attachments: ['screenshot.png'],
    createdAt: '2024-03-14 16:45',
    status: 'pending',
    answer: '',
    answeredAt: '',
    answeredBy: ''
  },
  {
    id: 3,
    category: '일정/예약',
    title: '예약 일정 변경 가능한가요?',
    user: '박관광',
    email: 'tour@daum.net',
    phone: '010-3456-7890',
    reservationNo: 'RSV-2024022501',
    content: '3월 5일로 예약한 서핑 레슨을 3월 12일로 변경하고 싶습니다. 가능할까요?',
    attachments: [],
    createdAt: '2024-02-28 09:20',
    status: 'answered',
    answer: '안녕하세요, 모행입니다.\n\n예약 일정 변경 확인했습니다. 3월 12일 동일 시간대로 변경 처리 완료되었습니다.\n변경된 예약 내역은 마이페이지 > 결제 내역에서 확인하실 수 있습니다.\n\n즐거운 여행 되세요!',
    answeredAt: '2024-02-28 14:30',
    answeredBy: '관리자'
  },
  {
    id: 4,
    category: '회원/계정',
    title: '회원정보 변경이 안됩니다',
    user: '최투어',
    email: 'choi@gmail.com',
    phone: '010-4567-8901',
    reservationNo: '',
    content: '휴대폰 번호를 변경하려고 하는데 본인인증이 계속 실패합니다. 도움 부탁드립니다.',
    attachments: ['error_screenshot.png'],
    createdAt: '2024-03-15 11:20',
    status: 'pending',
    answer: '',
    answeredAt: '',
    answeredBy: ''
  },
  {
    id: 5,
    category: '서비스 이용',
    title: 'AI 일정 추천 기능 문의',
    user: '정휴가',
    email: 'vacation@naver.com',
    phone: '010-5678-9012',
    reservationNo: '',
    content: 'AI 일정 추천을 받았는데 일정을 수정하고 싶습니다. 어떻게 해야 하나요?',
    attachments: [],
    createdAt: '2024-03-12 15:00',
    status: 'answered',
    answer: '안녕하세요, 모행입니다.\n\nAI가 추천해드린 일정은 마이페이지 > 내 일정에서 자유롭게 수정하실 수 있습니다.\n일정 편집 버튼을 클릭하시면 장소 추가/삭제, 순서 변경, 날짜 변경 등이 가능합니다.\n\n추가 문의사항이 있으시면 말씀해주세요!',
    answeredAt: '2024-03-12 17:30',
    answeredBy: '관리자'
  },
  {
    id: 6,
    category: '기타',
    title: '협업 제안 드립니다',
    user: '강여유',
    email: 'partner@company.com',
    phone: '02-1234-5678',
    reservationNo: '',
    content: '저희 여행사와 협업을 제안드리고 싶습니다. 담당자 연락처를 알 수 있을까요?',
    attachments: ['proposal.pdf'],
    createdAt: '2024-03-10 09:00',
    status: 'closed',
    answer: '안녕하세요.\n\n제안 검토 후 담당자가 연락드리겠습니다.\n감사합니다.',
    answeredAt: '2024-03-10 11:00',
    answeredBy: '관리자'
  }
];

function Inquiries() {
  const [inquiriesData, setInquiriesData] = useState(initialInquiriesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, inquiry: null });
  const [answerModal, setAnswerModal] = useState({ isOpen: false, inquiry: null });
  const [answerText, setAnswerText] = useState('');

  const filteredInquiries = inquiriesData.filter(inquiry => {
    const matchesSearch = inquiry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || inquiry.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // 통계 계산
  const totalCount = inquiriesData.length;
  const pendingCount = inquiriesData.filter(i => i.status === 'pending').length;
  const answeredCount = inquiriesData.filter(i => i.status === 'answered').length;
  const todayCount = inquiriesData.filter(i => i.createdAt.startsWith('2024-03-15')).length;

  // 상세보기
  const handleViewDetail = (inquiry) => {
    setDetailModal({ isOpen: true, inquiry });
  };

  // 답변하기
  const handleAnswer = (inquiry) => {
    setAnswerText(inquiry.answer || '');
    setAnswerModal({ isOpen: true, inquiry });
  };

  const handleAnswerSubmit = () => {
    if (!answerText.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }
    setInquiriesData(prev => prev.map(i =>
      i.id === answerModal.inquiry.id
        ? {
            ...i,
            answer: answerText,
            status: 'answered',
            answeredAt: new Date().toLocaleString('ko-KR', {
              year: 'numeric', month: '2-digit', day: '2-digit',
              hour: '2-digit', minute: '2-digit'
            }).replace(/\. /g, '-').replace('.', ''),
            answeredBy: '관리자'
          }
        : i
    ));
    setAnswerModal({ isOpen: false, inquiry: null });
    setAnswerText('');
    alert('답변이 등록되었습니다.');
  };

  // 종료 처리
  const handleClose = (inquiry) => {
    if (window.confirm('이 문의를 종료 처리하시겠습니까?')) {
      setInquiriesData(prev => prev.map(i =>
        i.id === inquiry.id ? { ...i, status: 'closed' } : i
      ));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">1:1 문의 관리</h1>
          <p className="page-subtitle">
            고객 문의를 확인하고 답변합니다
          </p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #4A90D9, #357ABD)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiQuestionLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>{totalCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>전체 문의</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiTimeLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>{pendingCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>답변 대기</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiCheckboxCircleLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{answeredCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>답변 완료</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiMailLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{todayCount}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>오늘 접수</div>
            </div>
          </div>
        </div>
      </div>

      {/* 답변 대기 알림 */}
      {pendingCount > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 8,
          marginBottom: 16,
          color: '#dc2626'
        }}>
          <RiMailLine style={{ fontSize: '1.25rem' }} />
          <span style={{ fontWeight: 500 }}>답변 대기 중인 문의가 {pendingCount}건 있습니다. 빠른 답변 부탁드립니다.</span>
        </div>
      )}

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
              placeholder="제목, 문의자, 이메일 검색"
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
              <option value="pending">답변대기</option>
              <option value="answered">답변완료</option>
              <option value="closed">종료</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 100 }}>카테고리</th>
                <th>제목</th>
                <th style={{ width: 140 }}>문의자</th>
                <th style={{ width: 140 }}>문의일시</th>
                <th style={{ width: 90 }}>상태</th>
                <th style={{ width: 110 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredInquiries.map(inquiry => (
                <tr key={inquiry.id} style={{ background: inquiry.status === 'pending' ? '#fefce8' : 'transparent' }}>
                  <td>
                    <span
                      className={`badge ${categoryColors[inquiry.category]?.className || 'badge-gray'}`}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {inquiry.category}
                    </span>
                  </td>
                  <td>
                    <div
                      className="font-medium"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleViewDetail(inquiry)}
                    >
                      {inquiry.title}
                      {inquiry.attachments && inquiry.attachments.length > 0 && (
                        <RiAttachmentLine style={{ marginLeft: 6, color: '#64748b', fontSize: '0.9rem' }} />
                      )}
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500 }}>{inquiry.user}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{inquiry.email}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: '#64748b' }}>{inquiry.createdAt}</td>
                  <td>
                    <span
                      className={`badge ${statusLabels[inquiry.status].className}`}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {statusLabels[inquiry.status].label}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" title="상세보기" onClick={() => handleViewDetail(inquiry)}>
                        <RiEyeLine />
                      </button>
                      {inquiry.status === 'pending' && (
                        <button
                          className="table-action-btn"
                          title="답변하기"
                          style={{ color: 'var(--primary-color)' }}
                          onClick={() => handleAnswer(inquiry)}
                        >
                          <RiReplyLine />
                        </button>
                      )}
                      {inquiry.status === 'answered' && (
                        <button
                          className="table-action-btn"
                          title="종료처리"
                          style={{ color: '#64748b' }}
                          onClick={() => handleClose(inquiry)}
                        >
                          <RiCheckboxCircleLine />
                        </button>
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
        onClose={() => setDetailModal({ isOpen: false, inquiry: null })}
        title="문의 상세"
        size="large"
        footer={
          detailModal.inquiry?.status === 'pending' && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setDetailModal({ isOpen: false, inquiry: null });
                handleAnswer(detailModal.inquiry);
              }}
            >
              <RiReplyLine style={{ marginRight: 4 }} /> 답변하기
            </button>
          )
        }
      >
        {detailModal.inquiry && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* 상태 및 카테고리 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span
                className={`badge ${categoryColors[detailModal.inquiry.category]?.className || 'badge-gray'}`}
                style={{ padding: '6px 12px', fontSize: '0.875rem' }}
              >
                {detailModal.inquiry.category}
              </span>
              <span className={`badge ${statusLabels[detailModal.inquiry.status].className}`}>
                {statusLabels[detailModal.inquiry.status].label}
              </span>
            </div>

            {/* 문의자 정보 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              padding: 16,
              background: '#f8fafc',
              borderRadius: 8,
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiUserLine style={{ color: '#64748b' }} />
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>문의자</span>
                <span style={{ fontWeight: 500 }}>{detailModal.inquiry.user}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiMailLine style={{ color: '#64748b' }} />
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>이메일</span>
                <span style={{ fontWeight: 500 }}>{detailModal.inquiry.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiCalendarLine style={{ color: '#64748b' }} />
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>문의일시</span>
                <span style={{ fontWeight: 500 }}>{detailModal.inquiry.createdAt}</span>
              </div>
              {detailModal.inquiry.reservationNo && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiTicket2Line style={{ color: '#64748b' }} />
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>예약번호</span>
                  <span style={{ fontWeight: 500, color: 'var(--primary-color)' }}>{detailModal.inquiry.reservationNo}</span>
                </div>
              )}
            </div>

            {/* 문의 내용 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: '2px solid var(--primary-color)'
              }}>
                <RiQuestionLine style={{ color: 'var(--primary-color)', fontSize: '1.1rem' }} />
                <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>문의 내용</span>
              </div>
              <h4 style={{ marginBottom: 12, fontSize: '1.05rem', fontWeight: 600 }}>
                {detailModal.inquiry.title}
              </h4>
              <div style={{
                padding: 16,
                background: '#f8fafc',
                borderRadius: 8,
                lineHeight: 1.8,
                whiteSpace: 'pre-line'
              }}>
                {detailModal.inquiry.content}
              </div>

              {/* 첨부파일 */}
              {detailModal.inquiry.attachments && detailModal.inquiry.attachments.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <RiAttachmentLine style={{ color: '#64748b' }} />
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>첨부파일 ({detailModal.inquiry.attachments.length})</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {detailModal.inquiry.attachments.map((file, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '6px 12px',
                          background: '#e2e8f0',
                          borderRadius: 4,
                          fontSize: '0.875rem',
                          color: '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {file}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 답변 내용 */}
            {detailModal.inquiry.answer && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: '2px solid #10b981'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RiReplyLine style={{ color: '#10b981', fontSize: '1.1rem' }} />
                    <span style={{ fontWeight: 600, color: '#10b981' }}>답변</span>
                  </div>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {detailModal.inquiry.answeredAt} ({detailModal.inquiry.answeredBy})
                  </span>
                </div>
                <div style={{
                  padding: 16,
                  background: '#f0fdf4',
                  borderRadius: 8,
                  borderLeft: '4px solid #10b981',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-line'
                }}>
                  {detailModal.inquiry.answer}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 답변 모달 */}
      <Modal
        isOpen={answerModal.isOpen}
        onClose={() => setAnswerModal({ isOpen: false, inquiry: null })}
        title="문의 답변"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setAnswerModal({ isOpen: false, inquiry: null })}>취소</button>
            <button
              className="btn btn-primary"
              onClick={handleAnswerSubmit}
              disabled={!answerText.trim()}
            >
              답변 등록
            </button>
          </>
        }
      >
        {answerModal.inquiry && (
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {/* 문의 정보 요약 */}
            <div style={{
              padding: 16,
              background: '#f8fafc',
              borderRadius: 8,
              marginBottom: 20
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span className={`badge ${categoryColors[answerModal.inquiry.category]?.className || 'badge-gray'}`}>
                  {answerModal.inquiry.category}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  {answerModal.inquiry.user} | {answerModal.inquiry.createdAt}
                </span>
              </div>
              <h4 style={{ marginBottom: 8, fontSize: '1rem', fontWeight: 600 }}>
                {answerModal.inquiry.title}
              </h4>
              <p style={{ color: '#64748b', lineHeight: 1.6, whiteSpace: 'pre-line', margin: 0 }}>
                {answerModal.inquiry.content}
              </p>
            </div>

            {/* 답변 입력 */}
            <div className="form-group">
              <label className="form-label">
                답변 내용 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                className="form-input"
                rows={10}
                placeholder="답변 내용을 입력하세요...\n\n안녕하세요, 모행입니다.\n\n[답변 내용]\n\n추가 문의사항이 있으시면 말씀해주세요.\n감사합니다."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                style={{ resize: 'vertical', lineHeight: 1.6 }}
              />
              <div style={{ marginTop: 8, fontSize: '0.875rem', color: '#64748b' }}>
                답변은 고객의 이메일({answerModal.inquiry.email})로 발송됩니다.
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Inquiries;
