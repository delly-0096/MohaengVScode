import { useState } from 'react';
import {
  RiSearchLine,
  RiFilterLine,
  RiAlertLine,
  RiEyeLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiUserLine,
  RiCalendarLine,
  RiFileTextLine,
  RiFlag2Line
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

// 더미 데이터
const initialReportsData = [
  { id: 1, type: '여행톡', targetId: 'TK-1234', reporter: '김신고', reporterId: 'user001', reported: '이악성', reportedId: 'user010', reason: '욕설/비방', content: '게시글에서 욕설을 사용함', reportDate: '2024-12-15', status: 'pending' },
  { id: 2, type: '여행기록', targetId: 'TL-5678', reporter: '박정의', reporterId: 'user002', reported: '최도배', reportedId: 'user011', reason: '도배/스팸', content: '동일 내용 반복 게시', reportDate: '2024-12-14', status: 'pending' },
  { id: 3, type: '여행톡', targetId: 'TK-9012', reporter: '김신고', reporterId: 'user001', reported: '강사기', reportedId: 'user012', reason: '사기/허위정보', content: '허위 여행 정보 게시', reportDate: '2024-12-13', status: 'processed', processedDate: '2024-12-14', processResult: '해당 게시글을 삭제하고 작성자에게 경고 조치했습니다.' },
  { id: 4, type: '여행톡', targetId: 'TK-7890', reporter: '김신고', reporterId: 'user001', reported: '서광고', reportedId: 'user013', reason: '광고/홍보', content: '상업적 광고 게시', reportDate: '2024-12-11', status: 'processed', processedDate: '2024-12-12', processResult: '광고성 게시글로 확인되어 삭제 처리했습니다.' },
  { id: 5, type: '여행기록', targetId: 'TL-1357', reporter: '이신고자', reporterId: 'user004', reported: '이악성', reportedId: 'user010', reason: '저작권 침해', content: '타인의 사진 무단 사용', reportDate: '2024-12-10', status: 'pending' },
  { id: 6, type: '여행톡', targetId: 'TK-2468', reporter: '박정의', reporterId: 'user002', reported: '이악성', reportedId: 'user010', reason: '욕설/비방', content: '댓글에서 인신공격', reportDate: '2024-12-09', status: 'processed', processedDate: '2024-12-10', processResult: '해당 댓글 삭제 및 3일 활동 제한 조치' },
  { id: 7, type: '여행기록', targetId: 'TL-3579', reporter: '김신고', reporterId: 'user001', reported: '최도배', reportedId: 'user011', reason: '도배/스팸', content: '같은 내용 여러 번 게시', reportDate: '2024-12-08', status: 'pending' },
  { id: 8, type: '여행톡', targetId: 'TK-1234', reporter: '오정직', reporterId: 'user005', reported: '이악성', reportedId: 'user010', reason: '욕설/비방', content: '반복적인 비속어 사용', reportDate: '2024-12-07', status: 'pending' }
];

const statusLabels = {
  pending: { label: '처리대기', className: 'badge-warning' },
  processed: { label: '처리완료', className: 'badge-success' },
  dismissed: { label: '기각', className: 'badge-gray' }
};

const typeLabels = {
  '여행톡': 'badge-primary',
  '여행기록': 'badge-success'
};

const reasonLabels = {
  '욕설/비방': 'badge-danger',
  '도배/스팸': 'badge-warning',
  '사기/허위정보': 'badge-danger',
  '광고/홍보': 'badge-gray',
  '저작권 침해': 'badge-danger'
};

function Reports() {
  const [reportsData, setReportsData] = useState(initialReportsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, report: null });
  const [processModal, setProcessModal] = useState({ isOpen: false, report: null });
  const [dismissModal, setDismissModal] = useState({ isOpen: false, report: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, report: null });
  const [processContent, setProcessContent] = useState('');

  const filteredReports = reportsData.filter(report => {
    const matchesSearch = report.reporter.includes(searchTerm) ||
                          report.reported.includes(searchTerm) ||
                          report.content.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const pendingCount = reportsData.filter(r => r.status === 'pending').length;

  // 신고 횟수 계산 (해당 사용자가 신고한 횟수)
  const getReportCount = (reporterId) => {
    return reportsData.filter(r => r.reporterId === reporterId).length;
  };

  // 피신고 횟수 계산 (해당 사용자가 신고당한 횟수)
  const getReportedCount = (reportedId) => {
    return reportsData.filter(r => r.reportedId === reportedId).length;
  };

  // 대상(채팅방/여행기록) 신고 횟수 계산
  const getTargetReportCount = (targetId) => {
    return reportsData.filter(r => r.targetId === targetId).length;
  };

  // 대기 신고 보기
  const handleShowPending = () => {
    setStatusFilter('pending');
  };

  // 상세보기
  const handleViewDetail = (report) => {
    setDetailModal({ isOpen: true, report });
  };

  // 제재 처리
  const handleProcess = (report) => {
    setProcessContent('');
    setProcessModal({ isOpen: true, report });
  };

  const handleProcessSubmit = () => {
    const now = new Date().toISOString().split('T')[0];
    setReportsData(prev => prev.map(r =>
      r.id === processModal.report.id
        ? { ...r, status: 'processed', processedDate: now, processResult: processContent || '제재 조치가 완료되었습니다.' }
        : r
    ));
    setProcessModal({ isOpen: false, report: null });
    setProcessContent('');
    alert('신고가 처리되었습니다. 피신고자에게 제재 조치가 적용됩니다.');
  };

  // 기각
  const handleDismiss = (report) => {
    setProcessContent('');
    setDismissModal({ isOpen: true, report });
  };

  const handleDismissSubmit = () => {
    const now = new Date().toISOString().split('T')[0];
    setReportsData(prev => prev.map(r =>
      r.id === dismissModal.report.id
        ? { ...r, status: 'dismissed', processedDate: now, processResult: processContent || '신고 사유에 해당하지 않아 기각 처리되었습니다.' }
        : r
    ));
    setDismissModal({ isOpen: false, report: null });
    setProcessContent('');
    alert('신고가 기각되었습니다.');
  };

  // 삭제
  const handleDelete = (report) => {
    setDeleteModal({ isOpen: true, report });
  };

  const handleDeleteConfirm = () => {
    setReportsData(prev => prev.filter(r => r.id !== deleteModal.report.id));
    setDeleteModal({ isOpen: false, report: null });
    alert('신고 기록이 삭제되었습니다.');
  };

  // 상세보기에서 처리하기
  const handleProcessFromDetail = () => {
    const report = detailModal.report;
    setDetailModal({ isOpen: false, report: null });
    handleProcess(report);
  };

  // 상세보기에서 기각하기
  const handleDismissFromDetail = () => {
    const report = detailModal.report;
    setDetailModal({ isOpen: false, report: null });
    handleDismiss(report);
  };

  return (
    <div className="members-page">
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

      {/* 처리 대기 알림 */}
      {pendingCount > 0 && (
        <div className="alert alert-danger mb-3">
          <RiAlertLine />
          <span>처리 대기 중인 신고가 {pendingCount}건 있습니다. 빠른 처리가 필요합니다.</span>
          <button className="btn btn-sm btn-danger" onClick={handleShowPending}>대기 신고 보기</button>
        </div>
      )}

      <div className="card">
        {/* 필터 바 */}
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="신고자, 피신고자, 내용 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              <option value="pending">처리대기</option>
              <option value="processed">처리완료</option>
              <option value="dismissed">기각</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              className="form-input form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 유형</option>
              <option value="여행톡">여행톡</option>
              <option value="여행기록">여행기록</option>
            </select>
          </div>
        </div>

        {/* 테이블 */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>유형</th>
                <th>신고사유</th>
                <th>신고자</th>
                <th>피신고자</th>
                <th>내용</th>
                <th>신고일</th>
                <th>상태</th>
                <th style={{ width: 150 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(report => (
                <tr key={report.id}>
                  <td>
                    <div>
                      <span className={`badge ${typeLabels[report.type]}`}>
                        {report.type}
                      </span>
                    </div>
                    {(report.type === '여행톡' || report.type === '여행기록') && (
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 4 }}>
                        {report.targetId}
                        <span style={{
                          marginLeft: 6,
                          padding: '1px 6px',
                          background: getTargetReportCount(report.targetId) >= 3 ? '#fee2e2' : '#f3f4f6',
                          borderRadius: 4,
                          color: getTargetReportCount(report.targetId) >= 3 ? '#dc2626' : '#6b7280',
                          fontWeight: getTargetReportCount(report.targetId) >= 3 ? 600 : 400
                        }}>
                          신고 {getTargetReportCount(report.targetId)}회
                        </span>
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${reasonLabels[report.reason] || 'badge-gray'}`}>
                      {report.reason}
                    </span>
                  </td>
                  <td>
                    <div>{report.reporter}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      신고 {getReportCount(report.reporterId)}회
                    </div>
                  </td>
                  <td>
                    <div className="text-danger font-medium">{report.reported}</div>
                    <div style={{ fontSize: '0.75rem', color: '#ef4444' }}>
                      피신고 {getReportedCount(report.reportedId)}회
                    </div>
                  </td>
                  <td className="truncate" style={{ maxWidth: 200 }}>{report.content}</td>
                  <td>{report.reportDate}</td>
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
                          <button className="table-action-btn" title="제재" style={{ color: 'var(--danger-color)' }} onClick={() => handleProcess(report)}>
                            <RiCheckLine />
                          </button>
                          <button className="table-action-btn" title="기각" style={{ color: 'var(--warning-color)' }} onClick={() => handleDismiss(report)}>
                            <RiCloseLine />
                          </button>
                        </>
                      )}
                      <button className="table-action-btn delete" title="삭제" onClick={() => handleDelete(report)}>
                        <RiDeleteBinLine />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
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
            <button className="btn btn-danger" onClick={handleProcessFromDetail}>제재하기</button>
          </>
        ) : null}
      >
        {detailModal.report && (
          <div>
            <div className="detail-list" style={{ marginBottom: 20 }}>
              <div className="detail-item">
                <span className="detail-label"><RiFlag2Line /> 유형</span>
                <span className="detail-value">
                  <span className={`badge ${typeLabels[detailModal.report.type]}`}>
                    {detailModal.report.type}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiFileTextLine /> 대상 ID</span>
                <span className="detail-value">
                  {detailModal.report.targetId}
                  {(detailModal.report.type === '여행톡' || detailModal.report.type === '여행기록') && (
                    <span style={{
                      marginLeft: 8,
                      padding: '2px 8px',
                      background: getTargetReportCount(detailModal.report.targetId) >= 3 ? '#fee2e2' : '#f3f4f6',
                      borderRadius: 4,
                      fontSize: '0.75rem',
                      color: getTargetReportCount(detailModal.report.targetId) >= 3 ? '#dc2626' : '#6b7280',
                      fontWeight: getTargetReportCount(detailModal.report.targetId) >= 3 ? 600 : 500
                    }}>
                      이 {detailModal.report.type === '여행톡' ? '채팅방' : '기록글'} 총 {getTargetReportCount(detailModal.report.targetId)}회 신고됨
                    </span>
                  )}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiAlertLine /> 신고 사유</span>
                <span className="detail-value">
                  <span className={`badge ${reasonLabels[detailModal.report.reason] || 'badge-gray'}`}>
                    {detailModal.report.reason}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiUserLine /> 신고자</span>
                <span className="detail-value">
                  {detailModal.report.reporter}
                  <span style={{ marginLeft: 8, padding: '2px 8px', background: '#f3f4f6', borderRadius: 4, fontSize: '0.75rem', color: '#6b7280' }}>
                    총 {getReportCount(detailModal.report.reporterId)}회 신고
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiUserLine /> 피신고자</span>
                <span className="detail-value">
                  <span style={{ color: 'var(--danger-color)', fontWeight: 500 }}>{detailModal.report.reported}</span>
                  <span style={{ marginLeft: 8, padding: '2px 8px', background: '#fee2e2', borderRadius: 4, fontSize: '0.75rem', color: '#ef4444' }}>
                    총 {getReportedCount(detailModal.report.reportedId)}회 피신고
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiCalendarLine /> 신고일</span>
                <span className="detail-value">{detailModal.report.reportDate}</span>
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

            {detailModal.report.status !== 'pending' && detailModal.report.processResult && (
              <div>
                <h4 style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiCheckLine /> 처리 결과
                </h4>
                <div style={{
                  padding: 16,
                  background: detailModal.report.status === 'processed' ? '#FEE2E2' : '#F3F4F6',
                  borderRadius: 8,
                  lineHeight: 1.6,
                  borderLeft: `4px solid ${detailModal.report.status === 'processed' ? 'var(--danger-color)' : 'var(--text-secondary)'}`
                }}>
                  <div style={{ marginBottom: 8, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    처리일: {detailModal.report.processedDate}
                  </div>
                  {detailModal.report.processResult}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 제재 처리 모달 */}
      <Modal
        isOpen={processModal.isOpen}
        onClose={() => setProcessModal({ isOpen: false, report: null })}
        title="신고 처리 - 제재"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setProcessModal({ isOpen: false, report: null })}>취소</button>
            <button className="btn btn-danger" onClick={handleProcessSubmit}>제재 적용</button>
          </>
        }
      >
        {processModal.report && (
          <div>
            <div style={{ marginBottom: 20, padding: 16, background: '#FEE2E2', borderRadius: 8, borderLeft: '4px solid var(--danger-color)' }}>
              <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
                <span className={`badge ${typeLabels[processModal.report.type]}`}>
                  {processModal.report.type}
                </span>
                <span className={`badge ${reasonLabels[processModal.report.reason] || 'badge-gray'}`}>
                  {processModal.report.reason}
                </span>
              </div>
              <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <strong>피신고자: </strong>
                <span style={{ color: 'var(--danger-color)', fontWeight: 600 }}>{processModal.report.reported}</span>
                <span style={{ padding: '2px 8px', background: '#fca5a5', borderRadius: 4, fontSize: '0.75rem', color: '#991b1b', fontWeight: 600 }}>
                  총 {getReportedCount(processModal.report.reportedId)}회 피신고
                </span>
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                <strong>신고 내용: </strong>{processModal.report.content}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">처리 내용 (피신고자에게 적용될 제재)</label>
              <textarea
                className="form-input"
                rows={5}
                placeholder="예: 해당 게시글을 삭제하고 7일간 글쓰기 제한 조치를 적용했습니다."
                value={processContent}
                onChange={(e) => setProcessContent(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ padding: 12, background: '#FEF3C7', borderRadius: 8, fontSize: '0.875rem' }}>
              <strong>안내:</strong> 제재 적용 시 피신고자에게 알림이 발송되며, 신고자에게 처리 결과가 통보됩니다.
            </div>
          </div>
        )}
      </Modal>

      {/* 기각 모달 */}
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
            <div style={{ marginBottom: 20, padding: 16, background: 'var(--bg-color)', borderRadius: 8 }}>
              <div style={{ marginBottom: 8 }}>
                <span className={`badge ${typeLabels[dismissModal.report.type]}`}>
                  {dismissModal.report.type}
                </span>
                {' '}
                <span className={`badge ${reasonLabels[dismissModal.report.reason] || 'badge-gray'}`}>
                  {dismissModal.report.reason}
                </span>
              </div>
              <div><strong>피신고자:</strong> {dismissModal.report.reported}</div>
              <div style={{ marginTop: 8, color: 'var(--text-secondary)' }}>{dismissModal.report.content}</div>
            </div>

            <p style={{ marginBottom: 16 }}>
              이 신고를 <strong>기각</strong>하시겠습니까?<br />
              기각된 신고는 처리되지 않으며, 신고자에게 결과가 통보됩니다.
            </p>

            <div className="form-group">
              <label className="form-label">기각 사유 (선택)</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="예: 신고 사유에 해당하지 않습니다."
                value={processContent}
                onChange={(e) => setProcessContent(e.target.value)}
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
        message={`이 신고 기록을 삭제하시겠습니까? 삭제된 기록은 복구할 수 없습니다.`}
        confirmText="삭제"
        type="danger"
      />
    </div>
  );
}

export default Reports;
