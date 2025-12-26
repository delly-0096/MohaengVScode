import { useState } from 'react';
import '../products/Products.css';

// 샘플 배너 데이터
const initialBannersData = [
  {
    id: 1,
    type: '메인배너',
    title: '봄맞이 여행 특가',
    description: '제주도 항공+숙박 패키지 최대 30% 할인',
    imageUrl: '/banners/spring-travel.jpg',
    linkUrl: '/events/spring-sale',
    position: 1,
    status: '노출중',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    views: 12543,
    clicks: 892,
    createdAt: '2024-02-25'
  },
  {
    id: 2,
    type: '메인배너',
    title: '신규회원 5,000P 지급',
    description: '지금 가입하고 여행 포인트 받아가세요',
    imageUrl: '/banners/new-member.jpg',
    linkUrl: '/member/register',
    position: 2,
    status: '노출중',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    views: 45678,
    clicks: 3421,
    createdAt: '2024-01-01'
  },
  {
    id: 3,
    type: '이벤트',
    title: '벚꽃 여행 사진 콘테스트',
    description: '최고의 벚꽃 사진을 공유하고 상품 받자!',
    imageUrl: '/banners/cherry-blossom.jpg',
    linkUrl: '/events/photo-contest',
    position: 1,
    status: '노출중',
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    views: 3254,
    clicks: 456,
    createdAt: '2024-03-10'
  },
  {
    id: 4,
    type: '프로모션',
    title: '제주 숙박 더블포인트',
    description: '제주도 숙박 예약 시 포인트 2배 적립',
    imageUrl: '/banners/jeju-promo.jpg',
    linkUrl: '/accommodations?region=jeju',
    position: 1,
    status: '노출중',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    views: 8765,
    clicks: 654,
    createdAt: '2024-02-28'
  },
  {
    id: 5,
    type: '메인배너',
    title: '여름 휴가 사전예약',
    description: '지금 예약하면 최대 40% 할인!',
    imageUrl: '/banners/summer-vacation.jpg',
    linkUrl: '/events/summer-sale',
    position: 3,
    status: '대기',
    startDate: '2024-05-01',
    endDate: '2024-08-31',
    views: 0,
    clicks: 0,
    createdAt: '2024-03-15'
  },
  {
    id: 6,
    type: '팝업',
    title: '앱 다운로드 안내',
    description: '모행 앱에서 더 편리하게!',
    imageUrl: '/banners/app-download.jpg',
    linkUrl: '/app/download',
    position: 1,
    status: '노출중',
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    views: 23456,
    clicks: 1234,
    createdAt: '2024-02-28'
  },
  {
    id: 7,
    type: '이벤트',
    title: '친구 추천 이벤트',
    description: '친구 추천하고 함께 포인트 받자!',
    imageUrl: '/banners/referral.jpg',
    linkUrl: '/events/referral',
    position: 2,
    status: '종료',
    startDate: '2024-01-01',
    endDate: '2024-02-29',
    views: 15678,
    clicks: 2345,
    createdAt: '2023-12-20'
  }
];

function Banners() {
  const [bannersData, setBannersData] = useState(initialBannersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 통계 계산
  const stats = {
    total: bannersData.length,
    active: bannersData.filter(b => b.status === '노출중').length,
    pending: bannersData.filter(b => b.status === '대기').length,
    totalViews: bannersData.reduce((sum, b) => sum + b.views, 0),
    totalClicks: bannersData.reduce((sum, b) => sum + b.clicks, 0)
  };

  // 배너 유형 목록
  const bannerTypes = ['메인배너', '이벤트', '프로모션', '팝업'];

  // 상태 목록
  const statusList = ['노출중', '대기', '종료'];

  // 필터링된 데이터
  const filteredData = bannersData.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         banner.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || banner.type === filterType;
    const matchesStatus = filterStatus === 'all' || banner.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // 상세 모달 열기
  const openDetailModal = (banner) => {
    setSelectedBanner(banner);
    setIsDetailModalOpen(true);
  };

  // 수정 모달 열기
  const openEditModal = (banner) => {
    setSelectedBanner({ ...banner });
    setIsEditModalOpen(true);
  };

  // 추가 모달 열기
  const openAddModal = () => {
    setSelectedBanner({
      id: null,
      type: '메인배너',
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      position: 1,
      status: '대기',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      views: 0,
      clicks: 0,
      createdAt: new Date().toISOString().split('T')[0]
    });
    setIsAddModalOpen(true);
  };

  // 삭제 모달 열기
  const openDeleteModal = (banner) => {
    setSelectedBanner(banner);
    setIsDeleteModalOpen(true);
  };

  // 배너 저장 (추가/수정)
  const saveBanner = () => {
    if (selectedBanner.id) {
      setBannersData(prev => prev.map(b =>
        b.id === selectedBanner.id ? selectedBanner : b
      ));
    } else {
      const newId = Math.max(...bannersData.map(b => b.id)) + 1;
      setBannersData(prev => [...prev, { ...selectedBanner, id: newId }]);
    }
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
  };

  // 배너 삭제
  const deleteBanner = () => {
    setBannersData(prev => prev.filter(b => b.id !== selectedBanner.id));
    setIsDeleteModalOpen(false);
  };

  // 상태 변경
  const updateStatus = (banner, newStatus) => {
    setBannersData(prev => prev.map(b =>
      b.id === banner.id ? { ...b, status: newStatus } : b
    ));
  };

  // 순서 변경
  const updatePosition = (banner, direction) => {
    const samTypeBanners = bannersData.filter(b => b.type === banner.type);
    const currentIndex = samTypeBanners.findIndex(b => b.id === banner.id);
    const newPosition = direction === 'up' ? banner.position - 1 : banner.position + 1;

    if (newPosition < 1 || newPosition > samTypeBanners.length) return;

    setBannersData(prev => prev.map(b => {
      if (b.id === banner.id) {
        return { ...b, position: newPosition };
      }
      if (b.type === banner.type && b.position === newPosition) {
        return { ...b, position: banner.position };
      }
      return b;
    }));
  };

  // 클릭률 계산
  const getClickRate = (views, clicks) => {
    if (views === 0) return '0%';
    return ((clicks / views) * 100).toFixed(2) + '%';
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (field, value) => {
    setSelectedBanner(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 상태 뱃지 색상
  const getStatusClass = (status) => {
    switch (status) {
      case '노출중': return 'active';
      case '대기': return 'pending';
      case '종료': return 'ended';
      default: return '';
    }
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>배너/이벤트 관리</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <i className="bi bi-plus-lg"></i> 배너 등록
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-image"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">전체 배너</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="bi bi-eye"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">노출중</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <i className="bi bi-hourglass-split"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">대기중</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="bi bi-graph-up"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{new Intl.NumberFormat('ko-KR').format(stats.totalViews)}</span>
            <span className="stat-label">총 노출수</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan">
            <i className="bi bi-cursor"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{new Intl.NumberFormat('ko-KR').format(stats.totalClicks)}</span>
            <span className="stat-label">총 클릭수</span>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="제목, 설명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">전체 유형</option>
              {bannerTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">전체 상태</option>
              {statusList.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 배너 목록 테이블 */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>순서</th>
              <th>유형</th>
              <th>제목</th>
              <th>기간</th>
              <th>노출수</th>
              <th>클릭수</th>
              <th>클릭률</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(banner => (
              <tr key={banner.id}>
                <td>
                  <div className="position-controls">
                    <button className="btn-icon sm" onClick={() => updatePosition(banner, 'up')} title="위로">
                      <i className="bi bi-chevron-up"></i>
                    </button>
                    <span className="position-number">{banner.position}</span>
                    <button className="btn-icon sm" onClick={() => updatePosition(banner, 'down')} title="아래로">
                      <i className="bi bi-chevron-down"></i>
                    </button>
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${banner.type === '메인배너' ? 'primary' : banner.type === '이벤트' ? 'success' : banner.type === '프로모션' ? 'warning' : 'info'}`}>
                    {banner.type}
                  </span>
                </td>
                <td>
                  <div className="banner-title" onClick={() => openDetailModal(banner)}>
                    {banner.title}
                  </div>
                  <small className="text-muted">{banner.description}</small>
                </td>
                <td>
                  <div>{banner.startDate}</div>
                  <small className="text-muted">~ {banner.endDate}</small>
                </td>
                <td>{new Intl.NumberFormat('ko-KR').format(banner.views)}</td>
                <td>{new Intl.NumberFormat('ko-KR').format(banner.clicks)}</td>
                <td>{getClickRate(banner.views, banner.clicks)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(banner.status)}`}>
                    {banner.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-icon" title="상세보기" onClick={() => openDetailModal(banner)}>
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn-icon" title="수정" onClick={() => openEditModal(banner)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    {banner.status !== '노출중' && (
                      <button className="btn-icon success" title="노출" onClick={() => updateStatus(banner, '노출중')}>
                        <i className="bi bi-toggle-on"></i>
                      </button>
                    )}
                    {banner.status === '노출중' && (
                      <button className="btn-icon warning" title="중지" onClick={() => updateStatus(banner, '대기')}>
                        <i className="bi bi-toggle-off"></i>
                      </button>
                    )}
                    <button className="btn-icon danger" title="삭제" onClick={() => openDeleteModal(banner)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-image"></i>
            <p>조건에 맞는 배너가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {isDetailModalOpen && selectedBanner && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>배너 상세 정보</h2>
              <button className="modal-close" onClick={() => setIsDetailModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="banner-preview">
                <div className="preview-placeholder">
                  <i className="bi bi-image"></i>
                  <span>배너 이미지 미리보기</span>
                  <small>{selectedBanner.imageUrl}</small>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-section">
                  <h3>기본 정보</h3>
                  <div className="detail-row">
                    <span className="label">유형</span>
                    <span className="value">{selectedBanner.type}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">제목</span>
                    <span className="value">{selectedBanner.title}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">설명</span>
                    <span className="value">{selectedBanner.description}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">연결 URL</span>
                    <span className="value">{selectedBanner.linkUrl}</span>
                  </div>
                </div>
                <div className="detail-section">
                  <h3>노출 정보</h3>
                  <div className="detail-row">
                    <span className="label">순서</span>
                    <span className="value">{selectedBanner.position}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">상태</span>
                    <span className={`status-badge ${getStatusClass(selectedBanner.status)}`}>
                      {selectedBanner.status}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">노출 기간</span>
                    <span className="value">{selectedBanner.startDate} ~ {selectedBanner.endDate}</span>
                  </div>
                </div>
                <div className="detail-section full-width">
                  <h3>통계</h3>
                  <div className="stats-inline">
                    <div className="stat-item">
                      <span className="stat-label">노출수</span>
                      <span className="stat-value">{new Intl.NumberFormat('ko-KR').format(selectedBanner.views)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">클릭수</span>
                      <span className="stat-value">{new Intl.NumberFormat('ko-KR').format(selectedBanner.clicks)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">클릭률</span>
                      <span className="stat-value">{getClickRate(selectedBanner.views, selectedBanner.clicks)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>닫기</button>
              <button className="btn btn-primary" onClick={() => { setIsDetailModalOpen(false); openEditModal(selectedBanner); }}>수정</button>
            </div>
          </div>
        </div>
      )}

      {/* 수정/추가 모달 */}
      {(isEditModalOpen || isAddModalOpen) && selectedBanner && (
        <div className="modal-overlay" onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isAddModalOpen ? '배너 등록' : '배너 수정'}</h2>
              <button className="modal-close" onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>유형 *</label>
                  <select
                    value={selectedBanner.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    {bannerTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>순서</label>
                  <input
                    type="number"
                    value={selectedBanner.position}
                    onChange={(e) => handleInputChange('position', parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
                <div className="form-group full-width">
                  <label>제목 *</label>
                  <input
                    type="text"
                    value={selectedBanner.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="배너 제목을 입력하세요"
                  />
                </div>
                <div className="form-group full-width">
                  <label>설명</label>
                  <textarea
                    value={selectedBanner.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="배너 설명을 입력하세요"
                    rows="2"
                  />
                </div>
                <div className="form-group full-width">
                  <label>이미지 URL *</label>
                  <input
                    type="text"
                    value={selectedBanner.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="/banners/banner-image.jpg"
                  />
                </div>
                <div className="form-group full-width">
                  <label>연결 URL</label>
                  <input
                    type="text"
                    value={selectedBanner.linkUrl}
                    onChange={(e) => handleInputChange('linkUrl', e.target.value)}
                    placeholder="/events/event-page"
                  />
                </div>
                <div className="form-group">
                  <label>시작일 *</label>
                  <input
                    type="date"
                    value={selectedBanner.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>종료일 *</label>
                  <input
                    type="date"
                    value={selectedBanner.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>상태</label>
                  <select
                    value={selectedBanner.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    {statusList.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { setIsEditModalOpen(false); setIsAddModalOpen(false); }}>취소</button>
              <button className="btn btn-primary" onClick={saveBanner}>
                {isAddModalOpen ? '등록' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && selectedBanner && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>배너 삭제</h2>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="confirm-message">
                <i className="bi bi-exclamation-triangle text-warning"></i>
                <p>정말로 <strong>{selectedBanner.title}</strong> 배너를 삭제하시겠습니까?</p>
                <p className="text-muted">이 작업은 되돌릴 수 없습니다.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>취소</button>
              <button className="btn btn-danger" onClick={deleteBanner}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Banners;
