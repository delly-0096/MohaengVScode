import { useState, useEffect } from 'react';
import {
  RiSearchLine,
  RiFilterLine,
  RiAlertLine,
  RiEyeLine,
  RiCheckLine,
  RiCloseLine,
  RiUserLine,
  RiCalendarLine,
  RiFileTextLine,
  RiFlag2Line,
  RiShieldLine
} from 'react-icons/ri';

import api from '../../api/api';

// 상태 라벨
const statusLabels = {
  WAIT: { label: '처리대기', className: 'badge-warning' },
  DONE: { label: '처리완료', className: 'badge-success' }
};

// 신고 출처 라벨
const targetTypeLabels = {
  PROD_REVIEW: { label: '상품 리뷰', className: 'badge-primary' },
  TRIP_RECORD: { label: '여행 기록', className: 'badge-success' },
  BOARD: { label: '여행톡', className: 'badge-info' },
  COMMENTS: { label: '댓글', className: 'badge-secondary' },
  CHAT: { label: '채팅', className: 'badge-gray' }
};

// 제재 수위 라벨
const procResultLabels = {
  WARNING: { label: '경고', className: 'badge-warning' },
  BAN_7: { label: '7일 정지', className: 'badge-danger' },
  BAN_30: { label: '30일 정지', className: 'badge-danger' },
  BLACKLIST: { label: '영구 정지', className: 'badge-danger' },
  REJECTED: { label: '기각', className: 'badge-gray' }
};

// 신고 사유 라벨  
const reasonLabels = {
  SPAM: { label: '스팸/도배', className: 'badge-warning' },
  ABUSE: { label: '욕설/비방', className: 'badge-danger' },
  FALSE: { label: '허위정보', className: 'badge-danger' },
  COPYRIGHT: { label: '저작권 침해', className: 'badge-danger' },
  PRIVACY: { label: '개인정보 노출', className: 'badge-danger' },
  ADVERTISE: { label: '광고/홍보', className: 'badge-gray' },
  ETC: { label: '기타', className: 'badge-secondary' }
};

// Modal 컴포넌트
function Modal({ isOpen, onClose, title, children, size = 'medium', footer }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass = { small: 'modal-small', medium: 'modal-medium', large: 'modal-large' }[size] || 'modal-medium';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-container ${sizeClass}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

function Reports() {
  // 상태 관리
  const [reportsData, setReportsData] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPage: 1, totalRecord: 0 });
  const [searchWord, setSearchWord] = useState('');
  const [procStatusFilter, setProcStatusFilter] = useState('all');
  const [targetTypeFilter, setTargetTypeFilter] = useState('all');
  const [procResultFilter, setProcResultFilter] = useState('all');

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, report: null });
  const [processModal, setProcessModal] = useState({ isOpen: false, report: null });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, report: null });
  const [blacklistReleaseModal, setBlacklistReleaseModal] = useState({ isOpen: false, blacklistNo: null });

  // 제재 처리 폼
  const [procResult, setProcResult] = useState('WARNING');
  const [adminMemo, setAdminMemo] = useState('');
  const [rejRsn, setRejRsn] = useState('');

  // 함수 선언
  const fetchReports = async (page) => {
    try {
      const response = await api.get('/admin/report', {
        params: {
          currentPage: page,
          searchWord: searchWord,
          procStatus: procStatusFilter,
          targetType: targetTypeFilter,
          procResult: procResultFilter
        }
      });
      setReportsData(response.data.dataList || []);
      setPagination({
        currentPage: response.data.currentPage,
        totalPage: response.data.totalPage,
        totalRecord: response.data.totalRecord
      });
    } catch (err) {
      console.error('신고 목록 조회 실패', err);
    }
  };

  useEffect(() => {
    fetchReports(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => fetchReports(1);

  // 신고 상세 조회
  const handleViewDetail = async (report) => {
    try {
      const response = await api.get(`/admin/report/${report.rptNo}`);
      setDetailModal({ isOpen: true, report: response.data });
    } catch (error) {
      alert('상세 정보 조회 실패');
      console.error(error);
    }
  };

  // 제재 처리 모달 열기
  const handleOpenProcessModal = (report) => {
    setProcResult('WARNING');
    setAdminMemo('');
    setProcessModal({ isOpen: true, report });
  };

  // 제재 처리 제출
  const handleProcessSubmit = async () => {
    if (!adminMemo.trim()) {
      alert('처리 사유를 입력해주세요.');
      return;
    }

    try {
      const response = await api.put(`/admin/report/${processModal.report.rptNo}/process`, {
        procResult,
        adminMemo
      });

      if (response.status === 200) {
        alert('신고가 처리되었습니다.');
        setProcessModal({ isOpen: false, report: null });
        setProcResult('WARNING');
        setAdminMemo('');
        fetchReports(pagination.currentPage);
      }
    } catch (error) {
      alert(error.response?.data?.message || '신고 처리에 실패했습니다.');
      console.error(error);
    }
  };

  // 기각 모달 열기
  const handleOpenRejectModal = (report) => {
    setRejRsn('');
    setRejectModal({ isOpen: true, report });
  };

  // 기각 제출
  const handleRejectSubmit = async () => {
    if (!rejRsn.trim()) {
      alert('기각 사유를 입력해주세요.');
      return;
    }

    try {
      const response = await api.put(`/admin/report/${rejectModal.report.rptNo}/reject`, {
        rejRsn
      });

      if (response.status === 200) {
        alert('신고가 기각되었습니다.');
        setRejectModal({ isOpen: false, report: null });
        setRejRsn('');
        fetchReports(pagination.currentPage);
      }
    } catch (error) {
      alert(error.response?.data?.message || '신고 기각에 실패했습니다.');
      console.error(error);
    }
  };

  // 블랙리스트 해제
  const handleBlacklistRelease = async () => {
    if (!blacklistReleaseModal.blacklistNo) return;

    try {
      const response = await api.put(`/admin/report/blacklist/${blacklistReleaseModal.blacklistNo}`);

      if (response.status === 200) {
        alert('블랙리스트가 해제되었습니다.');
        setBlacklistReleaseModal({ isOpen: false, blacklistNo: null });
        fetchReports(pagination.currentPage);
      }
    } catch (error) {
      alert(error.response?.data?.message || '블랙리스트 해제에 실패했습니다.');
      console.error(error);
    }
  };

  // 상세보기에서 처리하기
  const handleProcessFromDetail = () => {
    const report = detailModal.report;
    setDetailModal({ isOpen: false, report: null });
    handleOpenProcessModal(report);
  };

  // 상세보기에서 기각하기
  const handleRejectFromDetail = () => {
    const report = detailModal.report;
    setDetailModal({ isOpen: false, report: null });
    handleOpenRejectModal(report);
  };

  // 처리대기 건수
  const pendingCount = reportsData.filter(r => r.procStatus === 'WAIT').length;

  // 대기 신고 보기
  const handleShowPending = () => {
    setProcStatusFilter('WAIT');
    fetchReports(1);
  };

  return (
    <div className="members-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">신고 관리</h1>
          <p className="page-subtitle">
            총 {pagination.totalRecord}건의 신고가 있습니다.
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
            <span className="search-bar-icon">🔍</span>
            <input
              type="text"
              className="form-input"
              placeholder="신고자, 피신고자, 내용 검색"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <div className="filter-group">
            <select
              className="form-input form-select"
              value={procStatusFilter}
              onChange={(e) => setProcStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 처리상태</option>
              <option value="WAIT">처리대기</option>
              <option value="DONE">처리완료</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              className="form-input form-select"
              value={targetTypeFilter}
              onChange={(e) => setTargetTypeFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 신고출처</option>
              <option value="PROD_REVIEW">상품 리뷰</option>
              <option value="TRIP_RECORD">여행 기록</option>
              <option value="BOARD">여행톡</option>
              <option value="COMMENTS">댓글</option>
              <option value="CHAT">채팅</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              className="form-input form-select"
              value={procResultFilter}
              onChange={(e) => setProcResultFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 제재수위</option>
              <option value="WARNING">경고</option>
              <option value="BAN_7">7일 정지</option>
              <option value="BAN_30">30일 정지</option>
              <option value="BLACKLIST">영구 정지</option>
              <option value="REJECTED">기각</option>
            </select>
          </div>
        </div>

        {/* 테이블 */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>신고번호</th>
                <th>신고출처</th>
                <th>신고사유</th>
                <th>신고자</th>
                <th>피신고자</th>
                <th>신고일</th>
                <th>처리상태</th>
                <th>제재수위</th>
                <th style={{ width: 120 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {reportsData.map(report => (
                <tr key={report.rptNo}>
                  <td>{report.rptNo}</td>
                  <td>
                    <span className={`badge ${targetTypeLabels[report.targetType]?.className || 'badge-gray'}`}>
                      {targetTypeLabels[report.targetType]?.label || report.targetType}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${reasonLabels[report.ctgryCd]?.className || 'badge-gray'}`}>
                      {reasonLabels[report.ctgryCd]?.label || report.ctgryCd}
                    </span>
                  </td>
                  <td>
                    <div>{report.reqMemName || report.reqMemNo}</div>
                  </td>
                  <td>
                    <div className="text-danger font-medium">
                      {report.targetMemName || report.targetMemNo}
                    </div>
                  </td>
                  <td>{report.reqDt ? report.reqDt.split('T')[0] : '-'}</td>
                  <td>
                    <span className={`badge ${statusLabels[report.procStatus]?.className || 'badge-gray'}`}>
                      {statusLabels[report.procStatus]?.label || report.procStatus}
                    </span>
                  </td>
                  <td>
                    {report.procResult && (
                      <span className={`badge ${procResultLabels[report.procResult]?.className || 'badge-gray'}`}>
                        {procResultLabels[report.procResult]?.label || report.procResult}
                      </span>
                    )}
                    {report.procResult === 'BLACKLIST' && report.blacklistNo && (
                      <button
                        className="btn btn-sm btn-warning"
                        style={{ marginLeft: 8, fontSize: '0.75rem', padding: '2px 8px' }}
                        onClick={() => setBlacklistReleaseModal({ isOpen: true, blacklistNo: report.blacklistNo })}
                      >
                        해제
                      </button>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" title="상세보기" onClick={() => handleViewDetail(report)}>
                        <RiEyeLine />
                      </button>
                      {report.procStatus === 'WAIT' && (
                        <>
                          <button className="table-action-btn" title="제재" style={{ color: 'var(--danger-color)' }} onClick={() => handleOpenProcessModal(report)}>
                            <RiCheckLine />
                          </button>
                          <button className="table-action-btn" title="기각" style={{ color: 'var(--warning-color)' }} onClick={() => handleOpenRejectModal(report)}>
                            <RiCloseLine />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="pagination">
          <button className="pagination-btn" disabled={pagination.currentPage === 1} onClick={() => fetchReports(pagination.currentPage - 1)}>&lt;</button>
          {pagination.totalPage > 0 && [...Array(Math.min(pagination.totalPage, 5))].map((_, i) => (
            <button key={i} className={`pagination-btn ${pagination.currentPage === i + 1 ? 'active' : ''}`} onClick={() => fetchReports(i + 1)}>{i + 1}</button>
          ))}
          <button className="pagination-btn" disabled={pagination.currentPage === pagination.totalPage} onClick={() => fetchReports(pagination.currentPage + 1)}>&gt;</button>
        </div>
      </div>

      {/* 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, report: null })}
        title="신고 상세"
        size="large"
        footer={detailModal.report?.procStatus === 'WAIT' ? (
          <>
            <button className="btn btn-secondary" onClick={() => setDetailModal({ isOpen: false, report: null })}>닫기</button>
            <button className="btn btn-warning" onClick={handleRejectFromDetail}>기각</button>
            <button className="btn btn-danger" onClick={handleProcessFromDetail}>제재하기</button>
          </>
        ) : null}
      >
        {detailModal.report && (
          <div>
            <div className="detail-list" style={{ marginBottom: 20 }}>
              <div className="detail-item">
                <span className="detail-label">신고번호</span>
                <span className="detail-value">{detailModal.report.rptNo}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiFlag2Line /> 신고출처</span>
                <span className="detail-value">
                  <span className={`badge ${targetTypeLabels[detailModal.report.targetType]?.className || 'badge-gray'}`}>
                    {targetTypeLabels[detailModal.report.targetType]?.label || detailModal.report.targetType}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiAlertLine /> 신고 사유</span>
                <span className="detail-value">
                  <span className={`badge ${reasonLabels[detailModal.report.ctgryCd]?.className || 'badge-gray'}`}>
                    {reasonLabels[detailModal.report.ctgryCd]?.label || detailModal.report.ctgryCd}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiUserLine /> 신고자</span>
                <span className="detail-value">{detailModal.report.reqMemName || detailModal.report.reqMemNo}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiUserLine /> 피신고자</span>
                <span className="detail-value">
                  <span style={{ color: 'var(--danger-color)', fontWeight: 500 }}>
                    {detailModal.report.targetMemName || detailModal.report.targetMemNo}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiCalendarLine /> 신고일</span>
                <span className="detail-value">
                  {detailModal.report.reqDt ? detailModal.report.reqDt.split('T')[0] : '-'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">처리상태</span>
                <span className="detail-value">
                  <span className={`badge ${statusLabels[detailModal.report.procStatus]?.className || 'badge-gray'}`}>
                    {statusLabels[detailModal.report.procStatus]?.label || detailModal.report.procStatus}
                  </span>
                </span>
              </div>
              {detailModal.report.procResult && (
                <div className="detail-item">
                  <span className="detail-label">제재수위</span>
                  <span className="detail-value">
                    <span className={`badge ${procResultLabels[detailModal.report.procResult]?.className || 'badge-gray'}`}>
                      {procResultLabels[detailModal.report.procResult]?.label || detailModal.report.procResult}
                    </span>
                  </span>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
                <RiFileTextLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
                신고 내용
              </h4>
              <div style={{ padding: 16, background: 'var(--bg-color)', borderRadius: 8, lineHeight: 1.6 }}>
                {detailModal.report.content || '내용 없음'}
              </div>
            </div>

            {detailModal.report.procStatus === 'DONE' && (
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
                  <RiCheckLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  처리 결과
                </h4>
                <div style={{
                  padding: 16,
                  background: detailModal.report.procResult === 'REJECTED' ? '#F3F4F6' : '#FEE2E2',
                  borderRadius: 8,
                  lineHeight: 1.6,
                  borderLeft: `4px solid ${detailModal.report.procResult === 'REJECTED' ? 'var(--text-secondary)' : 'var(--danger-color)'}`
                }}>
                  {detailModal.report.prodDt && (
                    <div style={{ marginBottom: 8, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      처리일: {detailModal.report.prodDt.split('T')[0]}
                    </div>
                  )}
                  {detailModal.report.procResult === 'REJECTED' ? (
                    <div><strong>기각 사유:</strong> {detailModal.report.rejRsn || '사유 없음'}</div>
                  ) : (
                    <div><strong>처리 내용:</strong> {detailModal.report.adminMemo || '내용 없음'}</div>
                  )}
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
              <div style={{ marginBottom: 8 }}>
                <strong>피신고자: </strong>
                <span style={{ color: 'var(--danger-color)', fontWeight: 600 }}>
                  {processModal.report.targetMemName || processModal.report.targetMemNo}
                </span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>신고 사유: </strong>
                <span className={`badge ${reasonLabels[processModal.report.ctgryCd]?.className || 'badge-gray'}`}>
                  {reasonLabels[processModal.report.ctgryCd]?.label || processModal.report.ctgryCd}
                </span>
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                <strong>신고 내용: </strong>{processModal.report.content || '내용 없음'}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">제재 수위 *</label>
              <select
                className="form-input form-select"
                value={procResult}
                onChange={(e) => setProcResult(e.target.value)}
              >
                <option value="WARNING">경고 (콘텐츠 숨김)</option>
                <option value="BAN_7">7일 이용정지 (콘텐츠 숨김 + 계정 7일 차단)</option>
                <option value="BAN_30">30일 이용정지 (콘텐츠 숨김 + 계정 30일 차단)</option>
                <option value="BLACKLIST">영구 정지 (콘텐츠 숨김 + 계정 영구 차단)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">처리 사유 *</label>
              <textarea
                className="form-input"
                rows={5}
                placeholder="예: 반복적인 욕설 사용으로 7일 이용정지 처리했습니다."
                value={adminMemo}
                onChange={(e) => setAdminMemo(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ padding: 12, background: '#FEF3C7', borderRadius: 8, fontSize: '0.875rem' }}>
              <strong>안내:</strong> 기각을 제외한 모든 제재는 해당 콘텐츠를 자동으로 숨김 처리합니다.
            </div>
          </div>
        )}
      </Modal>

      {/* 기각 모달 */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, report: null })}
        title="신고 기각"
        size="medium"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setRejectModal({ isOpen: false, report: null })}>취소</button>
            <button className="btn btn-warning" onClick={handleRejectSubmit}>기각</button>
          </>
        }
      >
        {rejectModal.report && (
          <div>
            <div style={{ marginBottom: 20, padding: 16, background: 'var(--bg-color)', borderRadius: 8 }}>
              <div style={{ marginBottom: 8 }}>
                <strong>피신고자:</strong> {rejectModal.report.targetMemName || rejectModal.report.targetMemNo}
              </div>
              <div style={{ marginBottom: 8 }}>
                <strong>신고 사유: </strong>
                <span className={`badge ${reasonLabels[rejectModal.report.ctgryCd]?.className || 'badge-gray'}`}>
                  {reasonLabels[rejectModal.report.ctgryCd]?.label || rejectModal.report.ctgryCd}
                </span>
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                {rejectModal.report.content || '내용 없음'}
              </div>
            </div>

            <p style={{ marginBottom: 16 }}>
              이 신고를 <strong>기각</strong>하시겠습니까?<br />
              기각된 신고는 처리되지 않으며, 콘텐츠는 그대로 유지됩니다.
            </p>

            <div className="form-group">
              <label className="form-label">기각 사유 *</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="예: 신고 사유가 타당하지 않습니다."
                value={rejRsn}
                onChange={(e) => setRejRsn(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 블랙리스트 해제 확인 모달 */}
      <Modal
        isOpen={blacklistReleaseModal.isOpen}
        onClose={() => setBlacklistReleaseModal({ isOpen: false, blacklistNo: null })}
        title="블랙리스트 해제"
        size="small"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setBlacklistReleaseModal({ isOpen: false, blacklistNo: null })}>취소</button>
            <button className="btn btn-warning" onClick={handleBlacklistRelease}>해제</button>
          </>
        }
      >
        <div>
          <p style={{ marginBottom: 16 }}>
            <RiShieldLine size={48} style={{ color: 'var(--warning-color)', display: 'block', margin: '0 auto 16px' }} />
          </p>
          <p style={{ textAlign: 'center', marginBottom: 16 }}>
            이 회원의 블랙리스트를 <strong>해제</strong>하시겠습니까?
          </p>
          <div style={{ padding: 12, background: '#FEF3C7', borderRadius: 8, fontSize: '0.875rem' }}>
            <strong>안내:</strong> 해제 시 해당 회원은 다시 정상적으로 서비스를 이용할 수 있습니다.
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Reports;