import { useState } from 'react';
import {
  RiSearchLine,
  RiUploadCloud2Line,
  RiDeleteBinLine,
  RiDownloadLine,
  RiEyeLine,
  RiImageLine,
  RiFileTextLine,
  RiFilePdfLine,
  RiFileExcelLine,
  RiFileWordLine,
  RiVideoLine,
  RiFolderLine,
  RiGridLine,
  RiListCheck,
  RiFileCopyLine,
  RiUserLine,
  RiBuilding2Line,
  RiCameraLine,
  RiChat3Line,
  RiShoppingBagLine,
  RiQuestionLine,
  RiSettings4Line,
  RiAlertLine,
  RiCheckboxCircleLine,
  RiCloseLine,
  RiInformationLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

// 카테고리별 설정
const categoryConfig = {
  '프로필': { icon: RiUserLine, color: '#667eea', maxSize: '5MB', maxSizeBytes: 5242880, types: ['image'] },
  '기업로고': { icon: RiBuilding2Line, color: '#f093fb', maxSize: '2MB', maxSizeBytes: 2097152, types: ['image'], recommended: '200x200px' },
  '여행기록': { icon: RiCameraLine, color: '#4facfe', maxSize: '10MB', maxSizeBytes: 10485760, types: ['image'] },
  '커뮤니티': { icon: RiChat3Line, color: '#43e97b', maxSize: '10MB', maxSizeBytes: 10485760, types: ['image'], maxFiles: 5 },
  '상품': { icon: RiShoppingBagLine, color: '#fa709a', maxSize: '10MB', maxSizeBytes: 10485760, types: ['image'] },
  '문의첨부': { icon: RiQuestionLine, color: '#f5576c', maxSize: '10MB', maxSizeBytes: 10485760, types: ['image', 'pdf', 'word'], maxFiles: 5 },
  '시스템': { icon: RiSettings4Line, color: '#764ba2', maxSize: '5MB', maxSizeBytes: 5242880, types: ['image'] }
};

// 더미 데이터 - 실제 사용 패턴 반영
const dummyFiles = [
  // 프로필 이미지
  {
    id: 1,
    name: 'profile_user_1001.jpg',
    type: 'image',
    size: '245 KB',
    sizeBytes: 250880,
    uploadedAt: '2024-01-15 14:30',
    uploadedBy: '김모행',
    category: '프로필',
    url: '/uploads/profiles/profile_user_1001.jpg',
    dimensions: '400x400',
    usedIn: ['회원 프로필'],
    memberInfo: { id: 1001, name: '김모행', type: '일반회원' }
  },
  {
    id: 2,
    name: 'profile_user_1002.jpg',
    type: 'image',
    size: '312 KB',
    sizeBytes: 319488,
    uploadedAt: '2024-01-14 11:20',
    uploadedBy: '이여행',
    category: '프로필',
    url: '/uploads/profiles/profile_user_1002.jpg',
    dimensions: '400x400',
    usedIn: ['회원 프로필'],
    memberInfo: { id: 1002, name: '이여행', type: '일반회원' }
  },
  // 기업 로고
  {
    id: 3,
    name: 'logo_biz_2001.png',
    type: 'image',
    size: '125 KB',
    sizeBytes: 128000,
    uploadedAt: '2024-01-13 16:45',
    uploadedBy: '(주)제주투어',
    category: '기업로고',
    url: '/uploads/logos/logo_biz_2001.png',
    dimensions: '200x200',
    usedIn: ['기업 프로필', '상품 목록'],
    memberInfo: { id: 2001, name: '(주)제주투어', type: '기업회원' }
  },
  {
    id: 4,
    name: 'logo_biz_2002.png',
    type: 'image',
    size: '98 KB',
    sizeBytes: 100352,
    uploadedAt: '2024-01-12 09:00',
    uploadedBy: '서울호텔',
    category: '기업로고',
    url: '/uploads/logos/logo_biz_2002.png',
    dimensions: '200x200',
    usedIn: ['기업 프로필', '상품 목록'],
    memberInfo: { id: 2002, name: '서울호텔', type: '기업회원' }
  },
  // 여행기록 이미지
  {
    id: 5,
    name: 'travellog_cover_3001.jpg',
    type: 'image',
    size: '2.4 MB',
    sizeBytes: 2516582,
    uploadedAt: '2024-01-11 10:30',
    uploadedBy: '김모행',
    category: '여행기록',
    url: '/uploads/travellogs/travellog_cover_3001.jpg',
    dimensions: '1920x1080',
    usedIn: ['여행기록 #3001 커버'],
    contentInfo: { id: 3001, title: '제주도 3박4일 여행기', type: '여행기록' }
  },
  {
    id: 6,
    name: 'travellog_img_3001_1.jpg',
    type: 'image',
    size: '1.8 MB',
    sizeBytes: 1887436,
    uploadedAt: '2024-01-11 10:32',
    uploadedBy: '김모행',
    category: '여행기록',
    url: '/uploads/travellogs/travellog_img_3001_1.jpg',
    dimensions: '1600x1200',
    usedIn: ['여행기록 #3001 본문'],
    contentInfo: { id: 3001, title: '제주도 3박4일 여행기', type: '여행기록' }
  },
  {
    id: 7,
    name: 'travellog_img_3001_2.jpg',
    type: 'image',
    size: '2.1 MB',
    sizeBytes: 2202009,
    uploadedAt: '2024-01-11 10:33',
    uploadedBy: '김모행',
    category: '여행기록',
    url: '/uploads/travellogs/travellog_img_3001_2.jpg',
    dimensions: '1600x1200',
    usedIn: ['여행기록 #3001 본문'],
    contentInfo: { id: 3001, title: '제주도 3박4일 여행기', type: '여행기록' }
  },
  // 커뮤니티 이미지
  {
    id: 8,
    name: 'talk_img_4001_1.jpg',
    type: 'image',
    size: '1.5 MB',
    sizeBytes: 1572864,
    uploadedAt: '2024-01-10 15:20',
    uploadedBy: '이여행',
    category: '커뮤니티',
    url: '/uploads/community/talk_img_4001_1.jpg',
    dimensions: '1200x800',
    usedIn: ['여행톡 #4001'],
    contentInfo: { id: 4001, title: '부산 맛집 추천해주세요!', type: '여행톡' }
  },
  {
    id: 9,
    name: 'talk_img_4002_1.jpg',
    type: 'image',
    size: '980 KB',
    sizeBytes: 1003520,
    uploadedAt: '2024-01-09 11:00',
    uploadedBy: '박나들이',
    category: '커뮤니티',
    url: '/uploads/community/talk_img_4002_1.jpg',
    dimensions: '1200x800',
    usedIn: ['여행톡 #4002'],
    contentInfo: { id: 4002, title: '경주 벚꽃 명소 공유', type: '여행톡' }
  },
  // 상품 이미지
  {
    id: 10,
    name: 'product_5001_main.jpg',
    type: 'image',
    size: '3.2 MB',
    sizeBytes: 3355443,
    uploadedAt: '2024-01-08 14:00',
    uploadedBy: '(주)제주투어',
    category: '상품',
    url: '/uploads/products/product_5001_main.jpg',
    dimensions: '1920x1080',
    usedIn: ['상품 #5001 메인'],
    contentInfo: { id: 5001, title: '제주 성산일출봉 투어', type: '투어상품' }
  },
  {
    id: 11,
    name: 'product_5001_gallery_1.jpg',
    type: 'image',
    size: '2.8 MB',
    sizeBytes: 2936012,
    uploadedAt: '2024-01-08 14:02',
    uploadedBy: '(주)제주투어',
    category: '상품',
    url: '/uploads/products/product_5001_gallery_1.jpg',
    dimensions: '1600x1200',
    usedIn: ['상품 #5001 갤러리'],
    contentInfo: { id: 5001, title: '제주 성산일출봉 투어', type: '투어상품' }
  },
  {
    id: 12,
    name: 'product_5002_main.jpg',
    type: 'image',
    size: '2.5 MB',
    sizeBytes: 2621440,
    uploadedAt: '2024-01-07 16:30',
    uploadedBy: '서울호텔',
    category: '상품',
    url: '/uploads/products/product_5002_main.jpg',
    dimensions: '1920x1080',
    usedIn: ['상품 #5002 메인'],
    contentInfo: { id: 5002, title: '서울 시티뷰 디럭스룸', type: '숙박상품' }
  },
  // 문의 첨부파일
  {
    id: 13,
    name: 'inquiry_6001_attach.jpg',
    type: 'image',
    size: '856 KB',
    sizeBytes: 876544,
    uploadedAt: '2024-01-06 09:45',
    uploadedBy: '김모행',
    category: '문의첨부',
    url: '/uploads/inquiries/inquiry_6001_attach.jpg',
    dimensions: '800x600',
    usedIn: ['1:1문의 #6001'],
    contentInfo: { id: 6001, title: '결제 오류 문의', type: '1:1문의' }
  },
  {
    id: 14,
    name: 'inquiry_6002_receipt.pdf',
    type: 'pdf',
    size: '245 KB',
    sizeBytes: 250880,
    uploadedAt: '2024-01-05 13:20',
    uploadedBy: '이여행',
    category: '문의첨부',
    url: '/uploads/inquiries/inquiry_6002_receipt.pdf',
    usedIn: ['1:1문의 #6002'],
    contentInfo: { id: 6002, title: '환불 요청 건', type: '1:1문의' }
  },
  // 시스템 이미지
  {
    id: 15,
    name: 'mohaeng_CI.png',
    type: 'image',
    size: '125 KB',
    sizeBytes: 128000,
    uploadedAt: '2024-01-01 00:00',
    uploadedBy: '시스템',
    category: '시스템',
    url: '/resources/images/mohaeng_CI.png',
    dimensions: '500x200',
    usedIn: ['헤더 로고', '이메일 템플릿']
  },
  {
    id: 16,
    name: 'mohaeng_CI_con.png',
    type: 'image',
    size: '45 KB',
    sizeBytes: 46080,
    uploadedAt: '2024-01-01 00:00',
    uploadedBy: '시스템',
    category: '시스템',
    url: '/resources/images/mohaeng_CI_con.png',
    dimensions: '200x200',
    usedIn: ['파비콘', '앱 아이콘']
  },
  // 미사용 파일들
  {
    id: 17,
    name: 'old_profile_deleted_user.jpg',
    type: 'image',
    size: '280 KB',
    sizeBytes: 286720,
    uploadedAt: '2023-12-15 10:00',
    uploadedBy: '탈퇴회원',
    category: '프로필',
    url: '/uploads/profiles/old_profile_deleted_user.jpg',
    dimensions: '400x400',
    usedIn: []
  },
  {
    id: 18,
    name: 'unused_product_image.jpg',
    type: 'image',
    size: '1.9 MB',
    sizeBytes: 1992294,
    uploadedAt: '2023-12-10 14:30',
    uploadedBy: '(주)제주투어',
    category: '상품',
    url: '/uploads/products/unused_product_image.jpg',
    dimensions: '1600x1200',
    usedIn: []
  }
];

const categories = ['전체', '프로필', '기업로고', '여행기록', '커뮤니티', '상품', '문의첨부', '시스템'];
const fileTypes = ['전체', '이미지', '문서(PDF/DOC)'];
const usageFilters = ['전체', '사용중', '미사용'];

function FileManager() {
  const [files, setFiles] = useState(dummyFiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedType, setSelectedType] = useState('전체');
  const [selectedUsage, setSelectedUsage] = useState('전체');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCleanupConfirm, setShowCleanupConfirm] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [uploadCategory, setUploadCategory] = useState('상품');

  // 파일 타입별 아이콘
  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <RiImageLine />;
      case 'pdf': return <RiFilePdfLine />;
      case 'word': return <RiFileWordLine />;
      default: return <RiFileTextLine />;
    }
  };

  // 카테고리별 아이콘
  const getCategoryIcon = (category) => {
    const config = categoryConfig[category];
    if (config) {
      const IconComponent = config.icon;
      return <IconComponent />;
    }
    return <RiFolderLine />;
  };

  // 파일 타입 필터링
  const getTypeFilter = (type) => {
    switch (type) {
      case '이미지': return ['image'];
      case '문서(PDF/DOC)': return ['pdf', 'word'];
      default: return null;
    }
  };

  // 필터링된 파일 목록
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (file.contentInfo?.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (file.memberInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === '전체' || file.category === selectedCategory;
    const typeFilter = getTypeFilter(selectedType);
    const matchesType = !typeFilter || typeFilter.includes(file.type);
    const matchesUsage = selectedUsage === '전체' ||
                        (selectedUsage === '사용중' && file.usedIn.length > 0) ||
                        (selectedUsage === '미사용' && file.usedIn.length === 0);
    return matchesSearch && matchesCategory && matchesType && matchesUsage;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (sortBy === 'size') {
      return sortOrder === 'asc' ? a.sizeBytes - b.sizeBytes : b.sizeBytes - a.sizeBytes;
    } else {
      return sortOrder === 'asc'
        ? new Date(a.uploadedAt) - new Date(b.uploadedAt)
        : new Date(b.uploadedAt) - new Date(a.uploadedAt);
    }
  });

  // 파일 선택 토글
  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(f => f.id));
    }
  };

  // 파일 미리보기
  const handlePreview = (file) => {
    setCurrentFile(file);
    setShowPreviewModal(true);
  };

  // 파일 삭제
  const handleDelete = () => {
    if (currentFile) {
      setFiles(prev => prev.filter(f => f.id !== currentFile.id));
      setSelectedFiles(prev => prev.filter(id => id !== currentFile.id));
    } else if (selectedFiles.length > 0) {
      setFiles(prev => prev.filter(f => !selectedFiles.includes(f.id)));
      setSelectedFiles([]);
    }
    setShowDeleteConfirm(false);
    setCurrentFile(null);
  };

  // 미사용 파일 정리
  const handleCleanup = () => {
    setFiles(prev => prev.filter(f => f.usedIn.length > 0));
    setSelectedFiles([]);
    setShowCleanupConfirm(false);
  };

  // 통계 계산
  const stats = {
    totalFiles: files.length,
    totalSize: files.reduce((acc, f) => acc + f.sizeBytes, 0),
    usedFiles: files.filter(f => f.usedIn.length > 0).length,
    unusedFiles: files.filter(f => f.usedIn.length === 0).length,
    categoryStats: categories.filter(c => c !== '전체').map(cat => ({
      name: cat,
      count: files.filter(f => f.category === cat).length,
      size: files.filter(f => f.category === cat).reduce((acc, f) => acc + f.sizeBytes, 0)
    }))
  };

  const formatSize = (bytes) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return bytes + ' B';
  };

  return (
    <div className="file-manager-page">
      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <RiFolderLine />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalFiles}</span>
            <span className="stat-label">전체 파일</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <RiFileTextLine />
          </div>
          <div className="stat-info">
            <span className="stat-value">{formatSize(stats.totalSize)}</span>
            <span className="stat-label">총 용량</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <RiCheckboxCircleLine />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.usedFiles}</span>
            <span className="stat-label">사용중</span>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
            <RiAlertLine />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.unusedFiles}</span>
            <span className="stat-label">미사용</span>
          </div>
          {stats.unusedFiles > 0 && (
            <button
              className="cleanup-btn"
              onClick={() => setShowCleanupConfirm(true)}
              title="미사용 파일 정리"
            >
              정리
            </button>
          )}
        </div>
      </div>

      {/* 카테고리별 현황 */}
      <div className="category-overview">
        <h3>카테고리별 현황</h3>
        <div className="category-chips">
          {stats.categoryStats.map(cat => (
            <div
              key={cat.name}
              className={`category-chip ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.name === selectedCategory ? '전체' : cat.name)}
              style={{ '--chip-color': categoryConfig[cat.name]?.color }}
            >
              <span className="chip-icon">{getCategoryIcon(cat.name)}</span>
              <span className="chip-name">{cat.name}</span>
              <span className="chip-count">{cat.count}</span>
              <span className="chip-size">{formatSize(cat.size)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 필터 및 액션 바 */}
      <div className="content-card">
        <div className="file-toolbar">
          <div className="toolbar-left">
            <div className="search-box">
              <RiSearchLine className="search-icon" />
              <input
                type="text"
                placeholder="파일명, 회원명, 콘텐츠 제목 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="filter-select"
              >
                {fileTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <select
                value={selectedUsage}
                onChange={(e) => setSelectedUsage(e.target.value)}
                className="filter-select"
              >
                {usageFilters.map(usage => (
                  <option key={usage} value={usage}>{usage}</option>
                ))}
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [by, order] = e.target.value.split('-');
                  setSortBy(by);
                  setSortOrder(order);
                }}
                className="filter-select"
              >
                <option value="uploadedAt-desc">최신순</option>
                <option value="uploadedAt-asc">오래된순</option>
                <option value="name-asc">이름순</option>
                <option value="size-desc">용량 큰순</option>
                <option value="size-asc">용량 작은순</option>
              </select>
            </div>
          </div>

          <div className="toolbar-right">
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <RiGridLine />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <RiListCheck />
              </button>
            </div>

            {selectedFiles.length > 0 && (
              <button
                className="btn btn-danger"
                onClick={() => {
                  setCurrentFile(null);
                  setShowDeleteConfirm(true);
                }}
              >
                <RiDeleteBinLine />
                선택 삭제 ({selectedFiles.length})
              </button>
            )}

            <button
              className="btn btn-primary"
              onClick={() => setShowUploadModal(true)}
            >
              <RiUploadCloud2Line />
              파일 업로드
            </button>
          </div>
        </div>

        {/* 전체 선택 */}
        <div className="select-all-bar">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
              onChange={toggleSelectAll}
            />
            전체 선택 ({filteredFiles.length}개)
          </label>
        </div>

        {/* 파일 목록 - 그리드 뷰 */}
        {viewMode === 'grid' ? (
          <div className="file-grid">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className={`file-card ${selectedFiles.includes(file.id) ? 'selected' : ''} ${file.usedIn.length === 0 ? 'unused' : ''}`}
              >
                <div className="file-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                  />
                </div>

                {file.usedIn.length === 0 && (
                  <div className="unused-badge">미사용</div>
                )}

                <div className="file-preview" onClick={() => handlePreview(file)}>
                  {file.type === 'image' ? (
                    <div className="image-thumb">
                      <RiImageLine />
                      {file.dimensions && <span className="dimensions">{file.dimensions}</span>}
                    </div>
                  ) : (
                    <div className={`file-icon ${file.type}`}>
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>

                <div className="file-info">
                  <h4 className="file-name" title={file.name}>{file.name}</h4>
                  <div className="file-meta">
                    <span className="file-size">{file.size}</span>
                    <span className="file-date">{file.uploadedAt.split(' ')[0]}</span>
                  </div>
                  <div className="file-tags">
                    <span
                      className="file-category"
                      style={{ background: `${categoryConfig[file.category]?.color}20`, color: categoryConfig[file.category]?.color }}
                    >
                      {getCategoryIcon(file.category)}
                      {file.category}
                    </span>
                  </div>
                </div>

                <div className="file-actions">
                  <button className="action-btn" title="미리보기" onClick={() => handlePreview(file)}>
                    <RiEyeLine />
                  </button>
                  <button className="action-btn" title="다운로드">
                    <RiDownloadLine />
                  </button>
                  <button
                    className="action-btn danger"
                    title="삭제"
                    onClick={() => {
                      setCurrentFile(file);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    <RiDeleteBinLine />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 파일 목록 - 리스트 뷰 */
          <div className="file-list">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>파일명</th>
                  <th>카테고리</th>
                  <th>용량</th>
                  <th>업로드 일시</th>
                  <th>업로더</th>
                  <th>사용 위치</th>
                  <th style={{ width: '120px' }}>작업</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map(file => (
                  <tr key={file.id} className={`${selectedFiles.includes(file.id) ? 'selected' : ''} ${file.usedIn.length === 0 ? 'unused-row' : ''}`}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                      />
                    </td>
                    <td>
                      <div className="file-name-cell">
                        <span className={`file-type-icon ${file.type}`}>
                          {getFileIcon(file.type)}
                        </span>
                        <div className="file-name-wrap">
                          <span className="file-name-text">{file.name}</span>
                          {file.dimensions && <span className="file-dimensions">{file.dimensions}</span>}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className="category-badge"
                        style={{ background: `${categoryConfig[file.category]?.color}20`, color: categoryConfig[file.category]?.color }}
                      >
                        {file.category}
                      </span>
                    </td>
                    <td>{file.size}</td>
                    <td>{file.uploadedAt}</td>
                    <td>{file.uploadedBy}</td>
                    <td>
                      {file.usedIn.length > 0 ? (
                        <span className="usage-badge used">{file.usedIn.length}곳에서 사용</span>
                      ) : (
                        <span className="usage-badge unused">미사용</span>
                      )}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="action-btn" title="미리보기" onClick={() => handlePreview(file)}>
                          <RiEyeLine />
                        </button>
                        <button className="action-btn" title="다운로드">
                          <RiDownloadLine />
                        </button>
                        <button
                          className="action-btn danger"
                          title="삭제"
                          onClick={() => {
                            setCurrentFile(file);
                            setShowDeleteConfirm(true);
                          }}
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
        )}

        {filteredFiles.length === 0 && (
          <div className="empty-state">
            <RiFolderLine />
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 파일 미리보기 모달 */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setCurrentFile(null);
        }}
        title="파일 상세 정보"
        size="large"
      >
        {currentFile && (
          <div className="file-preview-modal">
            <div className="preview-section">
              {currentFile.type === 'image' ? (
                <div className="image-preview">
                  <RiImageLine />
                  {currentFile.dimensions && <p>{currentFile.dimensions}</p>}
                </div>
              ) : (
                <div className={`doc-preview ${currentFile.type}`}>
                  {getFileIcon(currentFile.type)}
                </div>
              )}
            </div>

            <div className="file-details">
              <h3>{currentFile.name}</h3>

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">파일 유형</span>
                  <span className="detail-value">{currentFile.type.toUpperCase()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">파일 크기</span>
                  <span className="detail-value">{currentFile.size}</span>
                </div>
                {currentFile.dimensions && (
                  <div className="detail-item">
                    <span className="detail-label">해상도</span>
                    <span className="detail-value">{currentFile.dimensions}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">카테고리</span>
                  <span
                    className="detail-value category-val"
                    style={{ color: categoryConfig[currentFile.category]?.color }}
                  >
                    {getCategoryIcon(currentFile.category)} {currentFile.category}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">업로드 일시</span>
                  <span className="detail-value">{currentFile.uploadedAt}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">업로더</span>
                  <span className="detail-value">{currentFile.uploadedBy}</span>
                </div>

                {/* 회원 정보 */}
                {currentFile.memberInfo && (
                  <div className="detail-item full-width">
                    <span className="detail-label">연결된 회원</span>
                    <div className="linked-info">
                      <span className="info-badge member">
                        {currentFile.memberInfo.type === '기업회원' ? <RiBuilding2Line /> : <RiUserLine />}
                        {currentFile.memberInfo.name}
                      </span>
                      <span className="info-id">ID: {currentFile.memberInfo.id}</span>
                    </div>
                  </div>
                )}

                {/* 콘텐츠 정보 */}
                {currentFile.contentInfo && (
                  <div className="detail-item full-width">
                    <span className="detail-label">연결된 콘텐츠</span>
                    <div className="linked-info">
                      <span className="info-badge content">
                        {currentFile.contentInfo.type}
                      </span>
                      <span className="info-title">{currentFile.contentInfo.title}</span>
                      <span className="info-id">ID: {currentFile.contentInfo.id}</span>
                    </div>
                  </div>
                )}

                <div className="detail-item full-width">
                  <span className="detail-label">파일 경로</span>
                  <span className="detail-value path">
                    {currentFile.url}
                    <button className="copy-btn" title="복사">
                      <RiFileCopyLine />
                    </button>
                  </span>
                </div>
                <div className="detail-item full-width">
                  <span className="detail-label">사용 위치</span>
                  <div className="usage-list">
                    {currentFile.usedIn.length > 0 ? (
                      currentFile.usedIn.map((location, idx) => (
                        <span key={idx} className="usage-tag">{location}</span>
                      ))
                    ) : (
                      <span className="no-usage">
                        <RiAlertLine /> 사용되지 않음 - 삭제를 권장합니다
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 카테고리별 제한 안내 */}
              <div className="category-info">
                <RiInformationLine />
                <span>
                  {currentFile.category} 카테고리: 최대 {categoryConfig[currentFile.category]?.maxSize}
                  {categoryConfig[currentFile.category]?.recommended && ` (권장 크기: ${categoryConfig[currentFile.category].recommended})`}
                  {categoryConfig[currentFile.category]?.maxFiles && ` / 최대 ${categoryConfig[currentFile.category].maxFiles}개`}
                </span>
              </div>

              <div className="modal-actions">
                <button className="btn btn-secondary">
                  <RiDownloadLine /> 다운로드
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setShowPreviewModal(false);
                    setShowDeleteConfirm(true);
                  }}
                >
                  <RiDeleteBinLine /> 삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 업로드 모달 */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="파일 업로드"
        size="medium"
      >
        <div className="upload-modal">
          <div className="upload-dropzone">
            <RiUploadCloud2Line />
            <p>파일을 드래그하거나 클릭하여 업로드</p>
            <span>
              {categoryConfig[uploadCategory]?.types.includes('image') && '이미지'}
              {categoryConfig[uploadCategory]?.types.includes('pdf') && ', PDF'}
              {categoryConfig[uploadCategory]?.types.includes('word') && ', DOC/DOCX'}
              {' '}(최대 {categoryConfig[uploadCategory]?.maxSize})
            </span>
          </div>

          <div className="upload-form">
            <div className="form-group">
              <label>카테고리 *</label>
              <select
                className="form-control"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
              >
                {categories.filter(c => c !== '전체' && c !== '시스템').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="form-hint">
                <RiInformationLine />
                {categoryConfig[uploadCategory]?.recommended && `권장 크기: ${categoryConfig[uploadCategory].recommended}`}
                {categoryConfig[uploadCategory]?.maxFiles && ` / 최대 ${categoryConfig[uploadCategory].maxFiles}개 업로드 가능`}
              </div>
            </div>

            <div className="form-group">
              <label>연결 대상 (선택)</label>
              <input
                type="text"
                className="form-control"
                placeholder="회원 ID 또는 콘텐츠 ID 입력..."
              />
            </div>

            <div className="form-group">
              <label>설명 (선택)</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="파일에 대한 설명을 입력하세요..."
              />
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
              취소
            </button>
            <button className="btn btn-primary">
              <RiUploadCloud2Line /> 업로드
            </button>
          </div>
        </div>
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setCurrentFile(null);
        }}
        onConfirm={handleDelete}
        title="파일 삭제"
        message={
          currentFile
            ? `"${currentFile.name}" 파일을 삭제하시겠습니까?${currentFile.usedIn.length > 0 ? ` 이 파일은 ${currentFile.usedIn.length}곳에서 사용 중입니다. 삭제 시 해당 위치에서 이미지가 표시되지 않습니다.` : ''}`
            : `선택한 ${selectedFiles.length}개 파일을 삭제하시겠습니까?`
        }
        confirmText="삭제"
        type="danger"
      />

      {/* 미사용 파일 정리 확인 모달 */}
      <ConfirmModal
        isOpen={showCleanupConfirm}
        onClose={() => setShowCleanupConfirm(false)}
        onConfirm={handleCleanup}
        title="미사용 파일 정리"
        message={`사용되지 않는 ${stats.unusedFiles}개의 파일을 모두 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="모두 삭제"
        type="danger"
      />

      <style jsx>{`
        .file-manager-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          position: relative;
        }

        .stat-card.warning {
          border: 1px solid #fcd34d;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
        }

        .stat-card.warning .stat-icon {
          color: #d97706;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a2e;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
        }

        .cleanup-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          background: #fef3c7;
          color: #d97706;
          border: 1px solid #fcd34d;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cleanup-btn:hover {
          background: #fde68a;
        }

        /* 카테고리 현황 */
        .category-overview {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .category-overview h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          color: #374151;
        }

        .category-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .category-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-chip:hover {
          border-color: var(--chip-color);
          background: white;
        }

        .category-chip.active {
          border-color: var(--chip-color);
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .chip-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--chip-color);
          color: white;
          font-size: 16px;
        }

        .chip-name {
          font-weight: 500;
          color: #374151;
        }

        .chip-count {
          font-weight: 600;
          color: var(--chip-color);
        }

        .chip-size {
          font-size: 12px;
          color: #9ca3af;
        }

        .content-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .file-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .search-box {
          position: relative;
          width: 300px;
        }

        .search-box input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .filter-group {
          display: flex;
          gap: 8px;
        }

        .filter-select {
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .view-toggle {
          display: flex;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .view-btn {
          padding: 8px 12px;
          border: none;
          background: white;
          cursor: pointer;
          font-size: 18px;
          color: #6b7280;
          transition: all 0.2s;
        }

        .view-btn.active {
          background: #4f46e5;
          color: white;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #4f46e5;
          color: white;
        }

        .btn-primary:hover {
          background: #4338ca;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .select-all-bar {
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 16px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
          cursor: pointer;
        }

        .file-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        .file-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s;
          position: relative;
        }

        .file-card:hover {
          border-color: #4f46e5;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
        }

        .file-card.selected {
          border-color: #4f46e5;
          background: #f5f3ff;
        }

        .file-card.unused {
          border-color: #fcd34d;
          background: #fffbeb;
        }

        .file-checkbox {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 1;
        }

        .unused-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 2px 8px;
          background: #fef3c7;
          color: #d97706;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          z-index: 1;
        }

        .file-preview {
          height: 140px;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .image-thumb {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #6b7280;
        }

        .image-thumb svg {
          font-size: 48px;
          color: #4f46e5;
        }

        .dimensions {
          font-size: 12px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .file-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: white;
        }

        .file-icon.image { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .file-icon.pdf { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
        .file-icon.word { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

        .file-info {
          padding: 12px;
        }

        .file-name {
          font-size: 13px;
          font-weight: 500;
          color: #1a1a2e;
          margin: 0 0 8px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .file-tags {
          display: flex;
          gap: 6px;
        }

        .file-category {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }

        .file-actions {
          display: flex;
          justify-content: center;
          gap: 4px;
          padding: 8px 12px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }

        .action-btn {
          padding: 8px;
          border: none;
          background: transparent;
          color: #6b7280;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #e5e7eb;
          color: #4f46e5;
        }

        .action-btn.danger:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        /* 리스트 뷰 */
        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .data-table th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
          font-size: 13px;
        }

        .data-table tr:hover {
          background: #f9fafb;
        }

        .data-table tr.selected {
          background: #f5f3ff;
        }

        .data-table tr.unused-row {
          background: #fffbeb;
        }

        .file-name-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .file-type-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
        }

        .file-type-icon.image { background: #667eea; }
        .file-type-icon.pdf { background: #f5576c; }
        .file-type-icon.word { background: #4facfe; }

        .file-name-wrap {
          display: flex;
          flex-direction: column;
        }

        .file-name-text {
          font-size: 13px;
          color: #1a1a2e;
        }

        .file-dimensions {
          font-size: 11px;
          color: #9ca3af;
        }

        .category-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .usage-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .usage-badge.used {
          background: #d1fae5;
          color: #059669;
        }

        .usage-badge.unused {
          background: #fef3c7;
          color: #d97706;
        }

        .table-actions {
          display: flex;
          gap: 4px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .empty-state svg {
          font-size: 48px;
          margin-bottom: 12px;
        }

        /* 미리보기 모달 */
        .file-preview-modal {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .preview-section {
          background: #f9fafb;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 300px;
        }

        .image-preview,
        .doc-preview {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #6b7280;
        }

        .image-preview svg,
        .doc-preview svg {
          font-size: 80px;
          color: #4f46e5;
        }

        .doc-preview.pdf svg { color: #f5576c; }
        .doc-preview.word svg { color: #4facfe; }

        .file-details h3 {
          margin: 0 0 20px 0;
          font-size: 16px;
          color: #1a1a2e;
          word-break: break-all;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-label {
          font-size: 12px;
          color: #6b7280;
        }

        .detail-value {
          font-size: 14px;
          color: #1a1a2e;
        }

        .detail-value.category-val {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .detail-value.path {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f3f4f6;
          padding: 8px 12px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 12px;
        }

        .copy-btn {
          padding: 4px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #6b7280;
        }

        .linked-info {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .info-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
        }

        .info-badge.member {
          background: #e0e7ff;
          color: #4338ca;
        }

        .info-badge.content {
          background: #d1fae5;
          color: #059669;
        }

        .info-title {
          font-size: 13px;
          color: #374151;
        }

        .info-id {
          font-size: 12px;
          color: #9ca3af;
        }

        .usage-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .usage-tag {
          padding: 4px 10px;
          background: #e0e7ff;
          color: #4338ca;
          border-radius: 4px;
          font-size: 12px;
        }

        .no-usage {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #d97706;
          font-size: 13px;
        }

        .category-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          padding: 12px;
          background: #f0f9ff;
          border-radius: 8px;
          font-size: 13px;
          color: #0369a1;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        /* 업로드 모달 */
        .upload-modal {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .upload-dropzone {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-dropzone:hover {
          border-color: #4f46e5;
          background: #f5f3ff;
        }

        .upload-dropzone svg {
          font-size: 48px;
          color: #4f46e5;
          margin-bottom: 12px;
        }

        .upload-dropzone p {
          margin: 0 0 8px 0;
          font-weight: 500;
          color: #374151;
        }

        .upload-dropzone span {
          font-size: 12px;
          color: #9ca3af;
        }

        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .form-control {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
        }

        textarea.form-control {
          resize: vertical;
        }

        .form-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
          font-size: 12px;
          color: #6b7280;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .file-preview-modal {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .file-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .toolbar-left,
          .toolbar-right {
            flex-wrap: wrap;
          }

          .search-box {
            width: 100%;
          }

          .category-chips {
            flex-direction: column;
          }

          .category-chip {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}

export default FileManager;
