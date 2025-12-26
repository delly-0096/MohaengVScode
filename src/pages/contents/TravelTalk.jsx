import { useState } from 'react';
import {
  RiSearchLine,
  RiEyeLine,
  RiDeleteBinLine,
  RiAlertLine,
  RiChat3Line,
  RiUserLine,
  RiCalendarLine,
  RiHeartLine,
  RiMessage2Line,
  RiFilterLine,
  RiEyeOffLine,
  RiCheckLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

const initialTalkData = [
  { id: 1, title: '제주도 맛집 추천해주세요!', author: '김여행', comments: 24, likes: 156, reports: 0, createdAt: '2024-12-15', status: 'active', content: '이번에 제주도 여행 계획 중인데요, 맛집 추천 부탁드려요! 특히 흑돼지랑 해산물 맛집 추천해주시면 감사하겠습니다.' },
  { id: 2, title: '오사카 여행 후기', author: '이모행', comments: 18, likes: 89, reports: 0, createdAt: '2024-12-14', status: 'active', content: '지난주 오사카 다녀왔어요! 도톤보리, 신사이바시 쇼핑, 유니버셜 스튜디오 다녀왔는데 너무 좋았습니다. 꼭 가보세요!' },
  { id: 3, title: '혼자 여행하기 좋은 곳', author: '박관광', comments: 32, likes: 234, reports: 2, createdAt: '2024-12-13', status: 'reported', content: '혼자 여행하기 좋은 국내 여행지 추천드려요. 강릉, 경주, 전주 등 혼자서도 즐기기 좋은 곳들입니다.' },
  { id: 4, title: '겨울 여행 준비물 체크리스트', author: '최투어', comments: 15, likes: 178, reports: 0, createdAt: '2024-12-12', status: 'active', content: '겨울 여행 준비물 정리해봤어요! 핫팩, 목도리, 귀마개, 핸드크림 필수입니다. 다들 따뜻하게 여행하세요!' },
  { id: 5, title: '부산 1박2일 일정 공유', author: '정휴가', comments: 8, likes: 67, reports: 0, createdAt: '2024-12-11', status: 'active', content: '부산 1박2일 일정 공유합니다. 첫째날: 해운대 - 광안리 - 부평야시장, 둘째날: 감천문화마을 - 남포동 쇼핑' }
];

function TravelTalk() {
  const [talkData, setTalkData] = useState(initialTalkData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, talk: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, talk: null });
  const [hideModal, setHideModal] = useState({ isOpen: false, talk: null });

  const filteredData = talkData.filter(t => {
    const matchesSearch = t.title.includes(searchTerm) || t.author.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const reportedCount = talkData.filter(t => t.status === 'reported').length;
  const hiddenCount = talkData.filter(t => t.status === 'hidden').length;

  // 상세보기
  const handleViewDetail = (talk) => {
    setDetailModal({ isOpen: true, talk });
  };

  // 삭제
  const handleDelete = (talk) => {
    setDeleteModal({ isOpen: true, talk });
  };

  const handleDeleteConfirm = () => {
    setTalkData(prev => prev.filter(t => t.id !== deleteModal.talk.id));
    setDeleteModal({ isOpen: false, talk: null });
    alert('게시글이 삭제되었습니다.');
  };

  // 신고 해제
  const handleClearReport = (talk) => {
    setTalkData(prev => prev.map(t => t.id === talk.id ? { ...t, status: 'active', reports: 0 } : t));
    alert('신고가 해제되었습니다.');
  };

  // 숨김 처리
  const handleHide = (talk) => {
    setHideModal({ isOpen: true, talk });
  };

  const handleHideConfirm = () => {
    setTalkData(prev => prev.map(t => t.id === hideModal.talk.id ? { ...t, status: 'hidden' } : t));
    setHideModal({ isOpen: false, talk: null });
    alert('게시글이 숨김 처리되었습니다.');
  };

  // 숨김 해제
  const handleUnhide = (talk) => {
    setTalkData(prev => prev.map(t => t.id === talk.id ? { ...t, status: 'active' } : t));
    alert('게시글이 공개되었습니다.');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">여행톡 관리</h1>
          <p className="page-subtitle">
            총 {filteredData.length}개의 게시글이 있습니다.
            {reportedCount > 0 && <span className="text-danger"> (신고된 게시글 {reportedCount}건)</span>}
          </p>
        </div>
      </div>

      {reportedCount > 0 && (
        <div className="alert alert-danger mb-3">
          <RiAlertLine />
          <span>신고된 게시글이 {reportedCount}건 있습니다. 확인이 필요합니다.</span>
        </div>
      )}

      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input type="text" className="form-input" placeholder="제목, 작성자 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="filter-group">
            <RiFilterLine />
            <select
              className="form-input form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 상태</option>
              <option value="active">정상</option>
              <option value="reported">신고됨</option>
              <option value="hidden">숨김</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>제목</th>
                <th>작성자</th>
                <th>댓글</th>
                <th>좋아요</th>
                <th>신고</th>
                <th>작성일</th>
                <th>상태</th>
                <th style={{ width: 100 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="member-info">
                      <div className="avatar" style={{ background: '#E0E7FF', color: '#4F46E5' }}><RiChat3Line /></div>
                      <div className="font-medium">{item.title}</div>
                    </div>
                  </td>
                  <td>{item.author}</td>
                  <td>{item.comments}</td>
                  <td>{item.likes}</td>
                  <td>{item.reports > 0 ? <span className="text-danger font-medium">{item.reports}</span> : '-'}</td>
                  <td>{item.createdAt}</td>
                  <td>
                    <span className={`badge ${
                      item.status === 'active' ? 'badge-success' :
                      item.status === 'reported' ? 'badge-danger' :
                      'badge-gray'
                    }`}>
                      {item.status === 'active' ? '정상' : item.status === 'reported' ? '신고됨' : '숨김'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" title="상세보기" onClick={() => handleViewDetail(item)}><RiEyeLine /></button>
                      {item.status === 'hidden' ? (
                        <button className="table-action-btn" title="공개하기" style={{ color: 'var(--success-color)' }} onClick={() => handleUnhide(item)}><RiCheckLine /></button>
                      ) : (
                        <button className="table-action-btn" title="숨김" style={{ color: 'var(--warning-color)' }} onClick={() => handleHide(item)}><RiEyeOffLine /></button>
                      )}
                      <button className="table-action-btn delete" title="삭제" onClick={() => handleDelete(item)}><RiDeleteBinLine /></button>
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
        onClose={() => setDetailModal({ isOpen: false, talk: null })}
        title="게시글 상세"
        size="large"
        footer={detailModal.talk?.status === 'reported' && (
          <>
            <button className="btn btn-secondary" onClick={() => setDetailModal({ isOpen: false, talk: null })}>닫기</button>
            <button className="btn btn-success" onClick={() => { handleClearReport(detailModal.talk); setDetailModal({ isOpen: false, talk: null }); }}>신고 해제</button>
            <button className="btn btn-danger" onClick={() => { setDetailModal({ isOpen: false, talk: null }); handleDelete(detailModal.talk); }}>게시글 삭제</button>
          </>
        )}
      >
        {detailModal.talk && (
          <div>
            <div className="detail-list" style={{ marginBottom: 20 }}>
              <div className="detail-item">
                <span className="detail-label"><RiUserLine /> 작성자</span>
                <span className="detail-value">{detailModal.talk.author}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiCalendarLine /> 작성일</span>
                <span className="detail-value">{detailModal.talk.createdAt}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiHeartLine /> 좋아요</span>
                <span className="detail-value">{detailModal.talk.likes}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiMessage2Line /> 댓글</span>
                <span className="detail-value">{detailModal.talk.comments}개</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiAlertLine /> 신고</span>
                <span className="detail-value">
                  {detailModal.talk.reports > 0 ? (
                    <span className="text-danger font-medium">{detailModal.talk.reports}건</span>
                  ) : '없음'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">상태</span>
                <span className="detail-value">
                  <span className={`badge ${detailModal.talk.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                    {detailModal.talk.status === 'active' ? '정상' : '신고됨'}
                  </span>
                </span>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: 8 }}>{detailModal.talk.title}</h4>
              <div style={{ padding: 16, background: 'var(--bg-color)', borderRadius: 8, lineHeight: 1.6 }}>
                {detailModal.talk.content}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, talk: null })}
        onConfirm={handleDeleteConfirm}
        title="게시글 삭제"
        message={`정말 "${deleteModal.talk?.title}" 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="삭제"
        type="danger"
      />

      {/* 숨김 확인 모달 */}
      <ConfirmModal
        isOpen={hideModal.isOpen}
        onClose={() => setHideModal({ isOpen: false, talk: null })}
        onConfirm={handleHideConfirm}
        title="게시글 숨김"
        message={`"${hideModal.talk?.title}" 게시글을 숨김 처리하시겠습니까? 숨겨진 게시글은 사용자에게 노출되지 않습니다.`}
        confirmText="숨김"
        type="warning"
      />
    </div>
  );
}

export default TravelTalk;
