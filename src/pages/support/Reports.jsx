import { useState } from 'react';
import {
  RiSearchLine,
  RiFilterLine,
  RiEyeLine,
  RiCheckLine,
  RiCloseLine,
  RiAlertLine,
  RiUserLine,
  RiCalendarLine,
  RiFileTextLine,
  RiFlag2Line,
  RiDeleteBinLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

// 더미 데이터
const initialReportsData = [
  { id: 1, type: '게시글', target: '제주도 맛집 추천 게시글', reporter: '김여행', reportedUser: '스팸왕', reason: '광고/스팸', createdAt: '2024-12-15 16:30', status: 'pending', content: '해당 게시글에 광고성 링크가 포함되어 있습니다. 여러 차례 동일한 내용의 홍보 글을 올리고 있어 신고합니다.' },
  { id: 2, type: '댓글', target: '"한라산 등반 후기" 게시글의 댓글', reporter: '이모행', reportedUser: '악플러', reason: '욕설/비방', createdAt: '2024-12-15 14:20', status: 'pending', content: '댓글에서 다른 사용자에게 욕설과 인신공격을 하고 있습니다.' },
  { id: 3, type: '리뷰', target: '제주 도자기 체험 리뷰', reporter: '박관광', reportedUser: '허위작성자', reason: '허위정보', createdAt: '2024-12-14 11:45', status: 'resolved', content: '체험을 하지 않고 허위로 리뷰를 작성한 것으로 보입니다.', resolvedAt: '2024-12-15 09:00', resolution: '확인 결과 실제 체험 이력이 없어 리뷰를 삭제 처리했습니다.' },
  { id: 4, type: '사용자', target: '사용자: 사기꾼123', reporter: '최투어', reportedUser: '사기꾼123', reason: '사기/불법', createdAt: '2024-12-13 09:30', status: 'pending', content: '개인 거래를 유도하며 사기를 치려는 것 같습니다.' },
  { id: 5, type: '게시글', target: '부산 야경 사진 게시글', reporter: '정휴가', reportedUser: '도용자', reason: '저작권침해', createdAt: '2024-12-12 18:00', status: 'resolved', content: '제가 촬영한 사진을 무단으로 도용했습니다.', resolvedAt: '2024-12-13 10:30', resolution: '저작권 침해가 확인되어 해당 게시글을 삭제하고 작성자에게 경고 조치했습니다.' },
  { id: 6, type: '댓글', target: '"오사카 여행 일정" 게시글의 댓글', reporter: '강여유', reportedUser: '음란물러', reason: '음란물/부적절', createdAt: '2024-12-11 22:15', status: 'dismissed', content: '부적절한 내용의 댓글입니다.', resolvedAt: '2024-12-12 08:00', resolution: '확인 결과 신고 사유에 해당하지 않아 기각 처리했습니다.' }
];

const statusLabels = {
  pending: { label: '처리대기', className: 'badge-danger' },
  resolved: { label: '처리완료', className: 'badge-success' },
  dismissed: { label: '기각', className: 'badge-gray' }
};

const typeColors = {
  '게시글': 'badge-primary',
  '댓글': 'badge-success',
  '리뷰': 'badge-warning',
  '사용자': 'badge-danger'
};

const reasonColors = {
  '광고/스팸': 'badge-warning',
  '욕설/비방': 'badge-danger',
  '허위정보': 'badge-gray',
  '사기/불법': 'badge-danger',
  '저작권침해': 'badge-primary',
  '음란물/부적절': 'badge-danger'
};

function Reports() {
  const [reportsData, setReportsData] = useState(initialReportsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, report: null });
  const [resolveModal, setResolveModal] = useState({ isOpen: false, report: null });
  const [dismissModal, setDismissModal] = useState({ isOpen: false, report: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, report: null });
  const [resolution, setResolution] = useState('');

  const filteredReports = reportsData.filter(report => {
    const matchesSearch = report.target.includes(searchTerm) ||
                          report.reporter.includes(searchTerm) ||
                          report.reportedUser.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingCount = reportsData.filter(r => r.status === 'pending').length;

  // 상세보기
  const handleViewDetail = (report) => {
    setDetailModal({ isOpen: true, report });
  };

  // 처리하기
  const handleResolve = (report) => {
    setResolution('');
    setResolveModal({ isOpen: true, report });
  };

  const handleResolveSubmit = () => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setReportsData(prev => prev.map(r =>
      r.id === resolveModal.report.id
        ? { ...r, status: 'resolved', resolvedAt: now, resolution: resolution }
        : r
    ));
    setResolveModal({ isOpen: false, report: null });
    setResolution('');
    alert('신고가 처리되었습니다.');
  };

  // 기각하기
  const handleDismiss = (report) => {
    setResolution('');
    setDismissModal({ isOpen: true, report });
  };

  const handleDismissSubmit = () => {
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
    setReportsData(prev => prev.map(r =>
      r.id === dismissModal.report.id
        ? { ...r, status: 'dismissed', resolvedAt: now, resolution: resolution || '신고 사유에 해당하지 않아 기각 처리되었습니다.' }
        : r
    ));
    setDismissModal({ isOpen: false, report: null });
    setResolution('');
    alert('신고가 기각되었습니다.');
  };

  // 삭제하기
  const handleDelete = (report) => {
    setDeleteModal({ isOpen: true, report });
  };

  const handleDeleteConfirm = () => {
    setReportsData(prev => prev.filter(r => r.id !== deleteModal.report.id));
    setDeleteModal({ isOpen: false, report: null });
    alert('신고 기록이 삭제되었습니다.');
  };

  // 처리대기만 보기
  const handleShowPending = () => {
    setStatusFilter('pending');
  };

  // 상세보기에서 처리하기
  const handleResolveFromDetail = () => {
    const report = detailModal.report;
    setDetailModal({ isOpen: false, report: null });
    handleResolve(report);
  };

  // 상세보기에서 기각하기
  const handleDismissFromDetail = () => {
    const report = detailModal.report;
    setDetailModal({ isOpen: false, report: null });
    handleDismiss(report);
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">신고 관리</h1>
          <p className="page-subtitle">
            총 {filteredReports.length}건의 신고가 있습니다.
            {pendingCount > 0 && (
              <span className="text-danger"> (처리대기 {pendingCount}건)</span>
            )}
          </p>
        </div>
      </div>

      {pendingCount > 0 && (
        <div className="alert alert-danger mb-3">
          <RiAlertLine />
          <span>처리 대기 중인 신고가 {pendingCount}건 있습니다.</span>
          <button className="btn btn-sm btn-danger" onClick={handleShowPending}>
            대기 신고 보기
          </button>
        </div>
      )}

      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="신고 대상, 신고자, 피신고자 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <RiFilterLine />
            <select
              className="form-input form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 유형</option>
              <option value="게시글">게시글</option>
              <option value="댓글">댓글</option>
              <option value="리뷰">리뷰</option>
              <option value="사용자">사용자</option>
            </select>
            <select
              className="form-input form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 상태</option>
              <option value="pending">처리대기</option>
              <option value="resolved">처리완료</option>
              <option value="dismissed">기각</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>유형</th>
                <th>신고 대상</th>
                <th>신고 사유</th>
                <th>신고자</th>
                <th>피신고자</th>
                <th>신고일시</th>
                <th>상태</th>
                <th style={{ width: 150 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(report => (
                <tr key={report.id}>
                  <td>
                    <span className={`badge ${typeColors[report.type] || 'badge-gray'}`}>
                      {report.type}
                    </span>
                  </td>
                  <td className="font-medium" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {report.target}
                  </td>
                  <td>
                    <span className={`badge ${reasonColors[report.reason] || 'badge-gray'}`}>
                      {report.reason}
                    </span>
                  </td>
                  <td>{report.reporter}</td>
                  <td>{report.reportedUser}</td>
                  <td>{report.createdAt}</td>
                  <td>
                    <span className={`badge ${statusLabels[report.status].className}`}>
                      {statusLabels[report.status].label}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" title="상세보기" onClick={() => handleViewDetail(report)}>
                        <RiEyeLine />
                      </button>
                      {report.status === 'pending' && (
                        <>
                          <button
                            className="table-action-btn"
                            title="처리하기"
                            style={{ color: 'var(--success-color)' }}
                            onClick={() => handleResolve(report)}
                          >
                            <RiCheckLine />
                          </button>
                          <button
                            className="table-action-btn"
                            title="기각"
                            style={{ color: 'var(--warning-color)' }}
                            onClick={() => handleDismiss(report)}
                          >
                            <RiCloseLine />
                          </button>
                        </>
                      )}
                      <button
                        className="table-action-btn delete"
                        title="삭제"
                        onClick={() => handleDelete(report)}
                      >
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
          <button className="pagination-btn">&gt;</button>
        </div>
      </div>

      {/* 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, report: null })}
        title="신고 상세"
        size="large"
        footer={detailModal.report?.status === 'pending' ? (
          <>
            <button className="btn btn-secondary" onClick={() => setDetailModal({ isOpen: false, report: null })}>닫기</button>
            <button className="btn btn-warning" onClick={handleDismissFromDetail}>기각</button>
            <button className="btn btn-success" onClick={handleResolveFromDetail}>처리하기</button>
          </>
        ) : null}
      >
        {detailModal.report && (
          <div>
            <div className="detail-list" style={{ marginBottom: 20 }}>
              <div className="detail-item">
                <span className="detail-label"><RiFlag2Line /> 유형</span>
                <span className="detail-value">
                  <span className={`badge ${typeColors[detailModal.report.type] || 'badge-gray'}`}>
                    {detailModal.report.type}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiFileTextLine /> 신고 대상</span>
                <span className="detail-value">{detailModal.report.target}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiAlertLine /> 신고 사유</span>
                <span className="detail-value">
                  <span className={`badge ${reasonColors[detailModal.report.reason] || 'badge-gray'}`}>
                    {detailModal.report.reason}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiUserLine /> 신고자</span>
                <span className="detail-value">{detailModal.report.reporter}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiUserLine /> 피신고자</span>
                <span className="detail-value">{detailModal.report.reportedUser}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiCalendarLine /> 신고일시</span>
                <span className="detail-value">{detailModal.report.createdAt}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">상태</span>
                <span className="detail-value">
                  <span className={`badge ${statusLabels[detailModal.report.status].className}`}>
                    {statusLabels[detailModal.report.status].label}
                  </span>
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RiFileTextLine /> 신고 내용
              </h4>
              <div style={{ padding: 16, background: 'var(--bg-color)', borderRadius: 8, lineHeight: 1.6 }}>
                {detailModal.report.content}
              </div>
            </div>

            {detailModal.report.status !== 'pending' && detailModal.report.resolution && (
              <div>
                <h4 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiCheckLine /> 처리 결과
                </h4>
                <div style={{
                  padding: 16,
                  background: detailModal.report.status === 'resolved' ? '#D1FAE5' : '#F3F4F6',
                  borderRadius: 8,
                  lineHeight: 1.6,
                  borderLeft: `4px solid ${detailModal.report.status === 'resolved' ? 'var(--success-color)' : 'var(--text-secondary)'}`
                }}>
                  <div style={{ marginBottom: 8, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    처리일시: {detailModal.report.resolvedAt}
                  </div>
                  {detailModal.report.resolution}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 처리 모달 */}
      <Modal
        isOpen={resolveModal.isOpen}
        onClose={() => setResolveModal({ isOpen: false, report: null })}
        title="신고 처리"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setResolveModal({ isOpen: false, report: null })}>취소</button>
            <button className="btn btn-danger" onClick={() => handleDismiss(resolveModal.report)}>기각</button>
            <button className="btn btn-success" onClick={handleResolveSubmit}>처리완료</button>
          </>
        }
      >
        {resolveModal.report && (
          <div>
            <div style={{ marginBottom: 20, padding: 16, background: 'var(--bg-color)', borderRadius: 8 }}>
              <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
                <span className={`badge ${typeColors[resolveModal.report.type] || 'badge-gray'}`}>
                  {resolveModal.report.type}
                </span>
                <span className={`badge ${reasonColors[resolveModal.report.reason] || 'badge-gray'}`}>
                  {resolveModal.report.reason}
                </span>
              </div>
              <strong>{resolveModal.report.target}</strong>
              <p style={{ marginTop: 8, color: 'var(--text-secondary)' }}>
                신고자: {resolveModal.report.reporter} | 피신고자: {resolveModal.report.reportedUser}
              </p>
              <p style={{ marginTop: 8 }}>{resolveModal.report.content}</p>
            </div>

            <div className="form-group">
              <label className="form-label">처리 내용</label>
              <textarea
                className="form-input"
                rows={6}
                placeholder="처리 내용을 입력하세요... (예: 해당 게시글을 삭제하고 작성자에게 경고 조치했습니다.)"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 기각 확인 모달 */}
      <Modal
        isOpen={dismissModal.isOpen}
        onClose={() => setDismissModal({ isOpen: false, report: null })}
        title="신고 기각"
        size="medium"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDismissModal({ isOpen: false, report: null })}>취소</button>
            <button className="btn btn-warning" onClick={handleDismissSubmit}>기각</button>
          </>
        }
      >
        {dismissModal.report && (
          <div>
            <p style={{ marginBottom: 16 }}>
              <strong>"{dismissModal.report.target}"</strong>에 대한 신고를 기각하시겠습니까?
            </p>
            <div className="form-group">
              <label className="form-label">기각 사유 (선택)</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="기각 사유를 입력하세요..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, report: null })}
        onConfirm={handleDeleteConfirm}
        title="신고 기록 삭제"
        message={`"${deleteModal.report?.target}"에 대한 신고 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="삭제"
        type="danger"
      />
    </div>
  );
}

export default Reports;
