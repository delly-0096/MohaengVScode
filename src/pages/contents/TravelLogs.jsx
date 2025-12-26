import { useState } from 'react';
import {
  RiSearchLine,
  RiEyeLine,
  RiDeleteBinLine,
  RiBookOpenLine,
  RiUserLine,
  RiCalendarLine,
  RiHeartLine,
  RiMapPinLine,
  RiFilterLine,
  RiEyeOffLine,
  RiCheckLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

const initialLogsData = [
  { id: 1, title: '제주도 3박4일 힐링여행', author: '김여행', destination: '제주도', likes: 234, views: 1520, createdAt: '2024-12-15', status: 'active', content: '제주도에서 3박4일 동안 정말 힐링하고 왔어요! 첫째날은 성산일출봉, 둘째날은 한라산 트레킹, 셋째날은 서귀포 올레길, 마지막날은 애월 카페거리를 다녀왔습니다. 날씨도 좋고 음식도 맛있어서 최고의 여행이었어요!' },
  { id: 2, title: '오사카 먹방 투어 후기', author: '이모행', destination: '오사카', likes: 189, views: 980, createdAt: '2024-12-14', status: 'active', content: '오사카 3박4일 먹방 여행 다녀왔습니다! 타코야끼, 오코노미야끼, 라멘, 규카츠까지 정말 맛있는 음식들을 많이 먹었어요. 도톤보리 야경도 너무 예뻤습니다.' },
  { id: 3, title: '부산 야경 명소 탐방', author: '박관광', destination: '부산', likes: 156, views: 870, createdAt: '2024-12-13', status: 'active', content: '부산 야경 명소들을 돌아다녔어요. 광안대교, 해운대 마린시티, 감천문화마을 야경이 정말 아름다웠습니다. 특히 광안리에서 보는 광안대교 야경은 잊을 수 없어요!' },
  { id: 4, title: '방콕 3일 자유여행', author: '최투어', destination: '방콕', likes: 98, views: 650, createdAt: '2024-12-12', status: 'active', content: '방콕 3일 자유여행 일정 공유합니다. 왓포, 왓아룬, 카오산로드, 차투착 주말시장을 다녀왔어요. 물가도 저렴하고 음식도 맛있어서 좋았습니다.' }
];

function TravelLogs() {
  const [logsData, setLogsData] = useState(initialLogsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, log: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, log: null });
  const [hideModal, setHideModal] = useState({ isOpen: false, log: null });

  const destinations = [...new Set(initialLogsData.map(l => l.destination))];

  const filteredData = logsData.filter(l => {
    const matchesSearch = l.title.includes(searchTerm) || l.author.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesDestination = destinationFilter === 'all' || l.destination === destinationFilter;
    return matchesSearch && matchesStatus && matchesDestination;
  });

  // 상세보기
  const handleViewDetail = (log) => {
    setDetailModal({ isOpen: true, log });
  };

  // 삭제
  const handleDelete = (log) => {
    setDeleteModal({ isOpen: true, log });
  };

  const handleDeleteConfirm = () => {
    setLogsData(prev => prev.filter(l => l.id !== deleteModal.log.id));
    setDeleteModal({ isOpen: false, log: null });
    alert('여행기록이 삭제되었습니다.');
  };

  // 숨김 처리
  const handleHide = (log) => {
    setHideModal({ isOpen: true, log });
  };

  const handleHideConfirm = () => {
    setLogsData(prev => prev.map(l => l.id === hideModal.log.id ? { ...l, status: 'hidden' } : l));
    setHideModal({ isOpen: false, log: null });
    alert('여행기록이 숨김 처리되었습니다.');
  };

  // 숨김 해제
  const handleUnhide = (log) => {
    setLogsData(prev => prev.map(l => l.id === log.id ? { ...l, status: 'active' } : l));
    alert('여행기록이 공개되었습니다.');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">여행기록 관리</h1>
          <p className="page-subtitle">총 {filteredData.length}개의 여행기록이 있습니다.</p>
        </div>
      </div>

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
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 여행지</option>
              {destinations.map(dest => (
                <option key={dest} value={dest}>{dest}</option>
              ))}
            </select>
            <select
              className="form-input form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">전체 상태</option>
              <option value="active">공개</option>
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
                <th>여행지</th>
                <th>좋아요</th>
                <th>조회수</th>
                <th>작성일</th>
                <th>상태</th>
                <th style={{ width: 120 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id} style={{ opacity: item.status === 'hidden' ? 0.6 : 1 }}>
                  <td>
                    <div className="member-info">
                      <div className="avatar" style={{ background: '#D1FAE5', color: '#059669' }}><RiBookOpenLine /></div>
                      <div className="font-medium">{item.title}</div>
                    </div>
                  </td>
                  <td>{item.author}</td>
                  <td><span className="badge badge-primary">{item.destination}</span></td>
                  <td>{item.likes}</td>
                  <td>{item.views.toLocaleString()}</td>
                  <td>{item.createdAt}</td>
                  <td>
                    <span className={`badge ${item.status === 'active' ? 'badge-success' : 'badge-gray'}`}>
                      {item.status === 'active' ? '공개' : '숨김'}
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
        onClose={() => setDetailModal({ isOpen: false, log: null })}
        title="여행기록 상세"
        size="large"
      >
        {detailModal.log && (
          <div>
            <div className="detail-list" style={{ marginBottom: 20 }}>
              <div className="detail-item">
                <span className="detail-label"><RiUserLine /> 작성자</span>
                <span className="detail-value">{detailModal.log.author}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiMapPinLine /> 여행지</span>
                <span className="detail-value">
                  <span className="badge badge-primary">{detailModal.log.destination}</span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiCalendarLine /> 작성일</span>
                <span className="detail-value">{detailModal.log.createdAt}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiHeartLine /> 좋아요</span>
                <span className="detail-value">{detailModal.log.likes}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiEyeLine /> 조회수</span>
                <span className="detail-value">{detailModal.log.views.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: 8 }}>{detailModal.log.title}</h4>
              <div style={{ padding: 16, background: 'var(--bg-color)', borderRadius: 8, lineHeight: 1.8 }}>
                {detailModal.log.content}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, log: null })}
        onConfirm={handleDeleteConfirm}
        title="여행기록 삭제"
        message={`정말 "${deleteModal.log?.title}" 여행기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="삭제"
        type="danger"
      />

      {/* 숨김 확인 모달 */}
      <ConfirmModal
        isOpen={hideModal.isOpen}
        onClose={() => setHideModal({ isOpen: false, log: null })}
        onConfirm={handleHideConfirm}
        title="여행기록 숨김"
        message={`"${hideModal.log?.title}" 여행기록을 숨김 처리하시겠습니까? 숨겨진 여행기록은 사용자에게 노출되지 않습니다.`}
        confirmText="숨김"
        type="warning"
      />
    </div>
  );
}

export default TravelLogs;
