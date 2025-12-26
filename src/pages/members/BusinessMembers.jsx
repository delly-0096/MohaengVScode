import { useState, useRef } from 'react';
import {
  RiSearchLine,
  RiFilterLine,
  RiDownloadLine,
  RiEyeLine,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
  RiBuilding2Line,
  RiUserLine,
  RiPhoneLine,
  RiMailLine,
  RiCalendarLine,
  RiFileTextLine,
  RiShoppingBagLine,
  RiImageLine,
  RiUploadLine,
  RiGlobalLine,
  RiBankLine,
  RiNotification3Line,
  RiMapPinLine,
  RiLockLine,
  RiAddLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

// 더미 데이터 - mohaeng 프로젝트 필드 기반
const initialBusinessData = [
  {
    id: 1,
    visibleId: 'BIZ001',
    visibleUserId: 'tourkorea01',
    companyName: '(주)투어코리아',
    businessNo: '1234567890',
    businessLicense: 'license_tourkorea.pdf',
    ceoName: '김대표',
    ecommerceNo: '제2024-서울강남-0001호',
    companyWebsite: 'https://tourkorea.com',
    companyDescription: '국내외 패키지 여행 전문 여행사입니다. 20년 이상의 경험과 노하우로 고객님께 최고의 여행을 선사합니다.',
    companyPostcode: '06134',
    companyAddress: '서울시 강남구 테헤란로 123',
    companyAddressDetail: '5층 501호',
    managerName: '박담당',
    managerPhone: '01012345678',
    managerEmail: 'manager@tourkorea.com',
    bankName: 'KB국민은행',
    accountNumber: '123456789012',
    accountHolder: '(주)투어코리아',
    joinDate: '2024-01-10',
    status: 'approved',
    products: 15,
    logo: null,
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: true,
    agreeMarketing: false,
    // 알림 설정
    notifyOrder: true,
    notifyReview: true,
    notifyInquiry: true,
    notifySettlement: true,
    notifyMarketing: false
  },
  {
    id: 2,
    visibleId: 'BIZ002',
    visibleUserId: 'skytravel22',
    companyName: '스카이트래블',
    businessNo: '2345678901',
    businessLicense: 'license_skytravel.pdf',
    ceoName: '이사장',
    ecommerceNo: '제2024-서울중구-0015호',
    companyWebsite: 'https://skytravel.com',
    companyDescription: '항공권 전문 판매 업체입니다. 국내외 모든 항공사 최저가 보장!',
    companyPostcode: '04539',
    companyAddress: '서울시 중구 을지로 456',
    companyAddressDetail: '3층',
    managerName: '최담당',
    managerPhone: '01023456789',
    managerEmail: 'manager@skytravel.com',
    bankName: '신한은행',
    accountNumber: '234567890123',
    accountHolder: '스카이트래블',
    joinDate: '2024-02-15',
    status: 'approved',
    products: 8,
    logo: null,
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: true,
    agreeMarketing: true,
    notifyOrder: true,
    notifyReview: true,
    notifyInquiry: true,
    notifySettlement: true,
    notifyMarketing: true
  },
  {
    id: 3,
    visibleId: 'BIZ003',
    visibleUserId: 'paradise33',
    companyName: '호텔파라다이스',
    businessNo: '3456789012',
    businessLicense: 'license_paradise.pdf',
    ceoName: '박호텔',
    ecommerceNo: '제2024-부산해운대-0023호',
    companyWebsite: 'https://hotelparadise.com',
    companyDescription: '해운대 최고급 리조트 호텔입니다. 오션뷰 객실과 프리미엄 서비스를 제공합니다.',
    companyPostcode: '48094',
    companyAddress: '부산시 해운대구 해변로 789',
    companyAddressDetail: '',
    managerName: '김매니저',
    managerPhone: '01034567890',
    managerEmail: 'manager@hotelparadise.com',
    bankName: '하나은행',
    accountNumber: '345678901234',
    accountHolder: '호텔파라다이스',
    joinDate: '2024-03-20',
    status: 'pending',
    products: 0,
    logo: null,
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: true,
    agreeMarketing: true,
    notifyOrder: true,
    notifyReview: true,
    notifyInquiry: true,
    notifySettlement: true,
    notifyMarketing: true
  },
  {
    id: 4,
    visibleId: 'BIZ004',
    visibleUserId: 'experience44',
    companyName: '체험여행사',
    businessNo: '4567890123',
    businessLicense: 'license_experience.pdf',
    ceoName: '최체험',
    ecommerceNo: '제2024-제주시-0005호',
    companyWebsite: 'https://experience.com',
    companyDescription: '제주도 체험 프로그램 전문 여행사입니다. 감귤따기, 승마, 스쿠버다이빙 등 다양한 체험을 제공합니다.',
    companyPostcode: '63084',
    companyAddress: '제주시 애월읍 체험로 101',
    companyAddressDetail: '1층',
    managerName: '정담당',
    managerPhone: '01045678901',
    managerEmail: 'manager@experience.com',
    bankName: 'NH농협은행',
    accountNumber: '456789012345',
    accountHolder: '체험여행사',
    joinDate: '2024-04-25',
    status: 'approved',
    products: 22,
    logo: null,
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: false,
    agreeMarketing: false,
    notifyOrder: true,
    notifyReview: true,
    notifyInquiry: true,
    notifySettlement: true,
    notifyMarketing: false
  },
  {
    id: 5,
    visibleId: 'BIZ005',
    visibleUserId: 'globaltour55',
    companyName: '글로벌투어',
    businessNo: '5678901234',
    businessLicense: 'license_global.pdf',
    ceoName: '정글로벌',
    ecommerceNo: '제2024-서울서초-0042호',
    companyWebsite: 'https://globaltour.com',
    companyDescription: '해외여행 전문 여행사입니다. 유럽, 미주, 동남아 등 전세계 여행 상품을 취급합니다.',
    companyPostcode: '06615',
    companyAddress: '서울시 서초구 서초대로 202',
    companyAddressDetail: '10층 1001호',
    managerName: '강담당',
    managerPhone: '01056789012',
    managerEmail: 'manager@globaltour.com',
    bankName: '우리은행',
    accountNumber: '567890123456',
    accountHolder: '글로벌투어',
    joinDate: '2024-05-30',
    status: 'rejected',
    products: 0,
    logo: null,
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: true,
    agreeMarketing: false,
    notifyOrder: true,
    notifyReview: false,
    notifyInquiry: true,
    notifySettlement: true,
    notifyMarketing: false
  },
  {
    id: 6,
    visibleId: 'BIZ006',
    visibleUserId: 'healingstay66',
    companyName: '힐링스테이',
    businessNo: '6789012345',
    businessLicense: 'license_healing.pdf',
    ceoName: '강힐링',
    ecommerceNo: '제2024-강원평창-0008호',
    companyWebsite: 'https://healingstay.com',
    companyDescription: '평창의 자연 속에서 힐링할 수 있는 펜션입니다. 스파, 바베큐 시설 완비.',
    companyPostcode: '25377',
    companyAddress: '강원도 평창군 힐링로 303',
    companyAddressDetail: '',
    managerName: '윤담당',
    managerPhone: '01067890123',
    managerEmail: 'manager@healingstay.com',
    bankName: 'IBK기업은행',
    accountNumber: '678901234567',
    accountHolder: '힐링스테이',
    joinDate: '2024-06-05',
    status: 'approved',
    products: 5,
    logo: null,
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: true,
    agreeMarketing: true,
    notifyOrder: true,
    notifyReview: true,
    notifyInquiry: true,
    notifySettlement: true,
    notifyMarketing: true
  }
];

const statusLabels = {
  approved: { label: '승인', className: 'badge-success' },
  pending: { label: '대기', className: 'badge-warning' },
  rejected: { label: '반려', className: 'badge-danger' }
};

const bankOptions = [
  '국민은행', '신한은행', '하나은행', '우리은행', '농협', 'IBK기업은행',
  'SC제일은행', '씨티은행', '카카오뱅크', '케이뱅크', '토스뱅크'
];

function BusinessMembers() {
  const [businessData, setBusinessData] = useState(initialBusinessData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const fileInputRef = useRef(null);
  const licenseInputRef = useRef(null);

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, business: null });
  const [editModal, setEditModal] = useState({ isOpen: false, business: null });
  const [approveModal, setApproveModal] = useState({ isOpen: false, business: null });
  const [rejectModal, setRejectModal] = useState({ isOpen: false, business: null });
  const [passwordModal, setPasswordModal] = useState({ isOpen: false, business: null });
  const [registerModal, setRegisterModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [rejectReason, setRejectReason] = useState('');
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [registerForm, setRegisterForm] = useState({
    visibleUserId: '',
    password: '',
    passwordConfirm: '',
    companyName: '',
    ceoName: '',
    businessNo: '',
    businessLicense: '',
    ecommerceNo: '',
    companyWebsite: '',
    companyDescription: '',
    companyPostcode: '',
    companyAddress: '',
    companyAddressDetail: '',
    managerName: '',
    managerPhone: '',
    managerEmail: '',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    logo: null,
    status: 'pending',
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: false,
    agreeMarketing: false,
    notifyOrder: true,
    notifyReview: true,
    notifyInquiry: true,
    notifySettlement: true,
    notifyMarketing: false
  });
  const registerFileInputRef = useRef(null);
  const registerLicenseInputRef = useRef(null);

  // 이미지 업로드 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm(prev => ({ ...prev, logo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 삭제
  const handleRemoveImage = () => {
    setEditForm(prev => ({ ...prev, logo: null }));
  };

  // 사업자등록증 업로드 처리
  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({ ...prev, businessLicense: file.name }));
    }
  };

  const filteredBusinesses = businessData.filter(biz => {
    const matchesSearch = biz.companyName.includes(searchTerm) ||
                          biz.ceoName.includes(searchTerm) ||
                          biz.businessNo.includes(searchTerm) ||
                          biz.managerName.includes(searchTerm) ||
                          biz.visibleUserId.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || biz.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = businessData.filter(b => b.status === 'pending').length;

  // 상세보기
  const handleViewDetail = (business) => {
    setDetailModal({ isOpen: true, business });
  };

  // 수정
  const handleEdit = (business) => {
    setEditForm({ ...business });
    setEditModal({ isOpen: true, business });
  };

  const handleEditSubmit = () => {
    setBusinessData(prev => prev.map(b => b.id === editForm.id ? editForm : b));
    setEditModal({ isOpen: false, business: null });
    alert('기업 정보가 수정되었습니다.');
  };

  // 승인
  const handleApprove = (business) => {
    setApproveModal({ isOpen: true, business });
  };

  const handleApproveConfirm = () => {
    setBusinessData(prev => prev.map(b => b.id === approveModal.business.id ? { ...b, status: 'approved' } : b));
    setApproveModal({ isOpen: false, business: null });
    alert('기업회원이 승인되었습니다.');
  };

  // 반려
  const handleReject = (business) => {
    setRejectReason('');
    setRejectModal({ isOpen: true, business });
  };

  const handleRejectConfirm = () => {
    setBusinessData(prev => prev.map(b => b.id === rejectModal.business.id ? { ...b, status: 'rejected' } : b));
    setRejectModal({ isOpen: false, business: null });
    setRejectReason('');
    alert('기업회원이 반려되었습니다.');
  };

  // 승인대기만 보기
  const handleShowPending = () => {
    setStatusFilter('pending');
  };

  // 비밀번호 변경
  const handlePasswordChange = (business) => {
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    setPasswordModal({ isOpen: true, business });
  };

  const handlePasswordSubmit = () => {
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    // 실제 구현 시 API 호출
    setPasswordModal({ isOpen: false, business: null });
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    alert('비밀번호가 변경되었습니다.');
  };

  // 기업회원 등록
  const handleRegister = () => {
    setRegisterForm({
      visibleUserId: '',
      password: '',
      passwordConfirm: '',
      companyName: '',
      ceoName: '',
      businessNo: '',
      businessLicense: '',
      ecommerceNo: '',
      companyWebsite: '',
      companyDescription: '',
      companyPostcode: '',
      companyAddress: '',
      companyAddressDetail: '',
      managerName: '',
      managerPhone: '',
      managerEmail: '',
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      logo: null,
      status: 'pending',
      agreeTerms: true,
      agreePrivacy: true,
      agreeLocation: false,
      agreeMarketing: false,
      notifyOrder: true,
      notifyReview: true,
      notifyInquiry: true,
      notifySettlement: true,
      notifyMarketing: false
    });
    setRegisterModal(true);
  };

  const handleRegisterImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRegisterForm(prev => ({ ...prev, logo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterLicenseChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRegisterForm(prev => ({ ...prev, businessLicense: file.name }));
    }
  };

  const handleRegisterSubmit = () => {
    // 필수 필드 검증
    if (!registerForm.visibleUserId || !registerForm.password || !registerForm.companyName ||
        !registerForm.ceoName || !registerForm.businessNo || !registerForm.managerName ||
        !registerForm.managerPhone || !registerForm.managerEmail) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    if (registerForm.password.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (registerForm.password !== registerForm.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (registerForm.businessNo.length !== 10) {
      alert('사업자등록번호는 10자리여야 합니다.');
      return;
    }
    if (!registerForm.agreeTerms || !registerForm.agreePrivacy) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    // 새 기업회원 추가
    const newBusiness = {
      id: businessData.length + 1,
      visibleId: `BIZ${String(businessData.length + 1).padStart(3, '0')}`,
      visibleUserId: registerForm.visibleUserId,
      companyName: registerForm.companyName,
      businessNo: registerForm.businessNo,
      businessLicense: registerForm.businessLicense,
      ceoName: registerForm.ceoName,
      ecommerceNo: registerForm.ecommerceNo,
      companyWebsite: registerForm.companyWebsite,
      companyDescription: registerForm.companyDescription,
      companyPostcode: registerForm.companyPostcode,
      companyAddress: registerForm.companyAddress,
      companyAddressDetail: registerForm.companyAddressDetail,
      managerName: registerForm.managerName,
      managerPhone: registerForm.managerPhone,
      managerEmail: registerForm.managerEmail,
      bankName: registerForm.bankName,
      accountNumber: registerForm.accountNumber,
      accountHolder: registerForm.accountHolder,
      joinDate: new Date().toISOString().split('T')[0],
      status: registerForm.status,
      products: 0,
      logo: registerForm.logo,
      agreeTerms: registerForm.agreeTerms,
      agreePrivacy: registerForm.agreePrivacy,
      agreeLocation: registerForm.agreeLocation,
      agreeMarketing: registerForm.agreeMarketing,
      notifyOrder: registerForm.notifyOrder,
      notifyReview: registerForm.notifyReview,
      notifyInquiry: registerForm.notifyInquiry,
      notifySettlement: registerForm.notifySettlement,
      notifyMarketing: registerForm.notifyMarketing
    };

    setBusinessData(prev => [newBusiness, ...prev]);
    setRegisterModal(false);
    alert('기업회원이 등록되었습니다.');
  };

  return (
    <div className="members-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">기업회원 관리</h1>
          <p className="page-subtitle">
            총 {filteredBusinesses.length}개의 기업회원이 있습니다.
            {pendingCount > 0 && (
              <span className="text-warning"> (승인대기 {pendingCount}건)</span>
            )}
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline">
            <RiDownloadLine /> 엑셀 다운로드
          </button>
          <button className="btn btn-primary" onClick={handleRegister}>
            <RiAddLine /> 기업회원 등록
          </button>
        </div>
      </div>

      {/* 승인 대기 알림 */}
      {pendingCount > 0 && (
        <div className="alert alert-warning mb-3">
          <RiBuilding2Line />
          <span>승인 대기 중인 기업회원이 {pendingCount}건 있습니다.</span>
          <button className="btn btn-sm btn-warning" onClick={handleShowPending}>승인 대기 보기</button>
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
              placeholder="회사명, 사업주, 사업자번호, 담당자명, 아이디 검색"
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
              <option value="approved">승인</option>
              <option value="pending">대기</option>
              <option value="rejected">반려</option>
            </select>
          </div>
        </div>

        {/* 테이블 */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>회사정보</th>
                <th>아이디</th>
                <th>사업자번호</th>
                <th>담당자</th>
                <th>가입일</th>
                <th>등록상품</th>
                <th>상태</th>
                <th style={{ width: 150 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map(biz => (
                <tr key={biz.id}>
                  <td>
                    <div className="member-info">
                      <div
                        className="avatar"
                        style={{
                          background: biz.logo ? 'transparent' : '#E0E7FF',
                          color: '#4F46E5',
                          overflow: 'hidden'
                        }}
                      >
                        {biz.logo ? (
                          <img src={biz.logo} alt={biz.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <RiBuilding2Line />
                        )}
                      </div>
                      <div>
                        <div className="member-name">{biz.companyName}</div>
                        <div className="member-email">사업주: {biz.ceoName}</div>
                      </div>
                    </div>
                  </td>
                  <td>{biz.visibleUserId}</td>
                  <td>{biz.businessNo}</td>
                  <td>
                    <div>{biz.managerName}</div>
                    <div className="member-email">{biz.managerPhone}</div>
                  </td>
                  <td>{biz.joinDate}</td>
                  <td>{biz.products}개</td>
                  <td>
                    <span className={`badge ${statusLabels[biz.status].className}`}>
                      {statusLabels[biz.status].label}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" title="상세보기" onClick={() => handleViewDetail(biz)}>
                        <RiEyeLine />
                      </button>
                      {biz.status === 'pending' ? (
                        <>
                          <button className="table-action-btn" title="승인" style={{ color: 'var(--success-color)' }} onClick={() => handleApprove(biz)}>
                            <RiCheckLine />
                          </button>
                          <button className="table-action-btn" title="반려" style={{ color: 'var(--danger-color)' }} onClick={() => handleReject(biz)}>
                            <RiCloseLine />
                          </button>
                        </>
                      ) : (
                        <button className="table-action-btn edit" title="수정" onClick={() => handleEdit(biz)}>
                          <RiEditLine />
                        </button>
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
          <button className="pagination-btn" disabled>&lt;</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">&gt;</button>
        </div>
      </div>

      {/* 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, business: null })}
        title="기업회원 상세정보"
        size="large"
      >
        {detailModal.business && (
          <div className="detail-list">
            {/* 기업 로고 */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 12,
                  background: detailModal.business.logo ? 'transparent' : '#E0E7FF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '2px solid var(--border-color)'
                }}
              >
                {detailModal.business.logo ? (
                  <img src={detailModal.business.logo} alt={detailModal.business.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <RiBuilding2Line size={40} style={{ color: '#4F46E5' }} />
                )}
              </div>
              <div style={{ marginTop: 8 }}>
                <span className={`badge ${statusLabels[detailModal.business.status].className}`}>
                  {statusLabels[detailModal.business.status].label}
                </span>
              </div>
            </div>

            {/* 회사 정보 섹션 */}
            <div className="detail-section">
              <h4 className="detail-section-title"><RiBuilding2Line /> 회사 정보</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">회원번호</span>
                  <span className="detail-value">{detailModal.business.visibleId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">아이디</span>
                  <span className="detail-value">{detailModal.business.visibleUserId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">회사명</span>
                  <span className="detail-value">{detailModal.business.companyName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">사업주명</span>
                  <span className="detail-value">{detailModal.business.ceoName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">사업자등록번호</span>
                  <span className="detail-value">{detailModal.business.businessNo}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">사업자등록증</span>
                  <span className="detail-value">
                    {detailModal.business.businessLicense ? (
                      <a href="#" style={{ color: 'var(--primary-color)' }}>{detailModal.business.businessLicense}</a>
                    ) : '-'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">통신판매업신고번호</span>
                  <span className="detail-value">{detailModal.business.ecommerceNo || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">회사 홈페이지</span>
                  <span className="detail-value">
                    {detailModal.business.companyWebsite ? (
                      <a href={detailModal.business.companyWebsite} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>
                        {detailModal.business.companyWebsite}
                      </a>
                    ) : '-'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">가입일</span>
                  <span className="detail-value">{detailModal.business.joinDate}</span>
                </div>
              </div>
              {detailModal.business.companyDescription && (
                <div style={{ marginTop: 12 }}>
                  <span className="detail-label">기업 소개</span>
                  <p style={{ marginTop: 4, padding: '12px', background: '#f9fafb', borderRadius: '8px', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {detailModal.business.companyDescription}
                  </p>
                </div>
              )}
            </div>

            {/* 주소 정보 섹션 */}
            <div className="detail-section">
              <h4 className="detail-section-title"><RiMapPinLine /> 회사 주소</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">우편번호</span>
                  <span className="detail-value">{detailModal.business.companyPostcode || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">주소</span>
                  <span className="detail-value">{detailModal.business.companyAddress || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">상세주소</span>
                  <span className="detail-value">{detailModal.business.companyAddressDetail || '-'}</span>
                </div>
              </div>
            </div>

            {/* 담당자 정보 섹션 */}
            <div className="detail-section">
              <h4 className="detail-section-title"><RiUserLine /> 담당자 정보</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">담당자명</span>
                  <span className="detail-value">{detailModal.business.managerName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">담당자 연락처</span>
                  <span className="detail-value">{detailModal.business.managerPhone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">담당자 이메일</span>
                  <span className="detail-value">{detailModal.business.managerEmail}</span>
                </div>
              </div>
            </div>

            {/* 정산 계좌 섹션 */}
            <div className="detail-section">
              <h4 className="detail-section-title"><RiBankLine /> 정산 계좌</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">은행</span>
                  <span className="detail-value">{detailModal.business.bankName || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">계좌번호</span>
                  <span className="detail-value">{detailModal.business.accountNumber || '-'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">예금주</span>
                  <span className="detail-value">{detailModal.business.accountHolder || '-'}</span>
                </div>
              </div>
            </div>

            {/* 알림 설정 섹션 */}
            <div className="detail-section">
              <h4 className="detail-section-title"><RiNotification3Line /> 알림 설정</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">새 예약 알림</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.business.notifyOrder ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.business.notifyOrder ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">새 후기 알림</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.business.notifyReview ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.business.notifyReview ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">문의 알림</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.business.notifyInquiry ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.business.notifyInquiry ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">정산 완료 알림</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.business.notifySettlement ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.business.notifySettlement ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">마케팅 정보 수신</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.business.notifyMarketing ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.business.notifyMarketing ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* 약관 동의 섹션 */}
            <div className="detail-section">
              <h4 className="detail-section-title"><RiFileTextLine /> 약관 동의</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">이용약관 동의</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.business.agreeTerms ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.business.agreeTerms ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">개인정보처리방침 동의</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.business.agreePrivacy ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.business.agreePrivacy ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">위치기반서비스 동의</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.business.agreeLocation ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.business.agreeLocation ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* 활동 정보 */}
            <div className="detail-section">
              <h4 className="detail-section-title"><RiShoppingBagLine /> 활동 정보</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">등록 상품 수</span>
                  <span className="detail-value">{detailModal.business.products}개</span>
                </div>
              </div>
            </div>

            {/* 관리 기능 */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
              <button
                className="btn btn-outline"
                style={{ width: '100%' }}
                onClick={() => {
                  setDetailModal({ isOpen: false, business: null });
                  handlePasswordChange(detailModal.business);
                }}
              >
                <RiLockLine style={{ marginRight: 8 }} />
                비밀번호 변경
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 수정 모달 */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, business: null })}
        title="기업회원 정보 수정"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setEditModal({ isOpen: false, business: null })}>취소</button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>저장</button>
          </>
        }
      >
        {editModal.business && (
          <div>
            {/* 기업 로고 */}
            <div className="form-group">
              <label className="form-label"><RiImageLine /> 기업 로고</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    background: editForm.logo ? 'transparent' : '#E0E7FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '2px dashed var(--border-color)'
                  }}
                >
                  {editForm.logo ? (
                    <img src={editForm.logo} alt="로고" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <RiBuilding2Line size={32} style={{ color: '#4F46E5' }} />
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <RiUploadLine /> 이미지 업로드
                  </button>
                  {editForm.logo && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={handleRemoveImage}
                      style={{ color: 'var(--danger-color)' }}
                    >
                      이미지 삭제
                    </button>
                  )}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {/* 회사 정보 섹션 */}
            <div className="form-section">
              <h4 className="form-section-title"><RiBuilding2Line /> 회사 정보</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">아이디 (변경불가)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.visibleUserId || ''}
                    disabled
                    style={{ backgroundColor: '#f3f4f6' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">회사명</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.companyName || ''}
                    onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">사업주명</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.ceoName || ''}
                    onChange={(e) => setEditForm({ ...editForm, ceoName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">사업자등록번호</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.businessNo || ''}
                    onChange={(e) => setEditForm({ ...editForm, businessNo: e.target.value.replace(/[^0-9]/g, '') })}
                    maxLength={10}
                    placeholder="'-' 없이 숫자만 입력"
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">사업자등록증</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      className="form-input"
                      value={editForm.businessLicense || ''}
                      readOnly
                      placeholder="파일을 업로드해주세요"
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => licenseInputRef.current?.click()}
                    >
                      <RiUploadLine />
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={licenseInputRef}
                    style={{ display: 'none' }}
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleLicenseChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">통신판매업신고번호</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.ecommerceNo || ''}
                    onChange={(e) => setEditForm({ ...editForm, ecommerceNo: e.target.value })}
                    placeholder="예: 제2024-서울강남-00000호"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">회사 홈페이지</label>
                <input
                  type="url"
                  className="form-input"
                  value={editForm.companyWebsite || ''}
                  onChange={(e) => setEditForm({ ...editForm, companyWebsite: e.target.value })}
                  placeholder="https://"
                />
              </div>
              <div className="form-group">
                <label className="form-label">기업 소개</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={editForm.companyDescription || ''}
                  onChange={(e) => setEditForm({ ...editForm, companyDescription: e.target.value })}
                  placeholder="기업에 대한 간단한 소개를 입력해주세요."
                  maxLength={1000}
                />
              </div>
            </div>

            {/* 주소 정보 섹션 */}
            <div className="form-section">
              <h4 className="form-section-title"><RiMapPinLine /> 회사 주소</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">우편번호</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.companyPostcode || ''}
                    onChange={(e) => setEditForm({ ...editForm, companyPostcode: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">주소</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.companyAddress || ''}
                    onChange={(e) => setEditForm({ ...editForm, companyAddress: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">상세주소</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.companyAddressDetail || ''}
                  onChange={(e) => setEditForm({ ...editForm, companyAddressDetail: e.target.value })}
                />
              </div>
            </div>

            {/* 담당자 정보 섹션 */}
            <div className="form-section">
              <h4 className="form-section-title"><RiUserLine /> 담당자 정보</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">담당자명</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.managerName || ''}
                    onChange={(e) => setEditForm({ ...editForm, managerName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">담당자 연락처</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.managerPhone || ''}
                    onChange={(e) => setEditForm({ ...editForm, managerPhone: e.target.value.replace(/[^0-9]/g, '') })}
                    maxLength={11}
                    placeholder="01012345678"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">담당자 이메일</label>
                <input
                  type="email"
                  className="form-input"
                  value={editForm.managerEmail || ''}
                  onChange={(e) => setEditForm({ ...editForm, managerEmail: e.target.value })}
                />
              </div>
            </div>

            {/* 정산 계좌 섹션 */}
            <div className="form-section">
              <h4 className="form-section-title"><RiBankLine /> 정산 계좌</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">은행</label>
                  <select
                    className="form-input form-select"
                    value={editForm.bankName || ''}
                    onChange={(e) => setEditForm({ ...editForm, bankName: e.target.value })}
                  >
                    <option value="">선택</option>
                    {bankOptions.map(bank => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">계좌번호</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.accountNumber || ''}
                    onChange={(e) => setEditForm({ ...editForm, accountNumber: e.target.value.replace(/[^0-9]/g, '') })}
                    maxLength={20}
                    placeholder="'-' 없이 숫자만 입력"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">예금주</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.accountHolder || ''}
                    onChange={(e) => setEditForm({ ...editForm, accountHolder: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* 알림 설정 섹션 */}
            <div className="form-section">
              <h4 className="form-section-title"><RiNotification3Line /> 알림 설정</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editForm.notifyOrder || false}
                    onChange={(e) => setEditForm({ ...editForm, notifyOrder: e.target.checked })}
                  />
                  <span>새 예약 알림 (이메일)</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editForm.notifyReview || false}
                    onChange={(e) => setEditForm({ ...editForm, notifyReview: e.target.checked })}
                  />
                  <span>새 후기 알림 (이메일)</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editForm.notifyInquiry || false}
                    onChange={(e) => setEditForm({ ...editForm, notifyInquiry: e.target.checked })}
                  />
                  <span>문의 알림 (이메일)</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editForm.notifySettlement || false}
                    onChange={(e) => setEditForm({ ...editForm, notifySettlement: e.target.checked })}
                  />
                  <span>정산 완료 알림 (이메일)</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editForm.notifyMarketing || false}
                    onChange={(e) => setEditForm({ ...editForm, notifyMarketing: e.target.checked })}
                  />
                  <span>마케팅 정보 수신 (이메일)</span>
                </label>
              </div>
            </div>

            {/* 약관 동의 섹션 */}
            <div className="form-section">
              <h4 className="form-section-title"><RiFileTextLine /> 약관 동의</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editForm.agreeTerms || false}
                    onChange={(e) => setEditForm({ ...editForm, agreeTerms: e.target.checked })}
                  />
                  <span>이용약관 동의 (필수)</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editForm.agreePrivacy || false}
                    onChange={(e) => setEditForm({ ...editForm, agreePrivacy: e.target.checked })}
                  />
                  <span>개인정보처리방침 동의 (필수)</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editForm.agreeLocation || false}
                    onChange={(e) => setEditForm({ ...editForm, agreeLocation: e.target.checked })}
                  />
                  <span>위치기반서비스 동의 (선택)</span>
                </label>
              </div>
            </div>

            {/* 상태 */}
            <div className="form-section">
              <h4 className="form-section-title">회원 상태</h4>
              <div className="form-group">
                <select
                  className="form-input form-select"
                  value={editForm.status || ''}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="approved">승인</option>
                  <option value="pending">대기</option>
                  <option value="rejected">반려</option>
                </select>
              </div>
            </div>

            {/* 비밀번호 변경 */}
            <div className="form-section">
              <h4 className="form-section-title"><RiLockLine /> 비밀번호 관리</h4>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditModal({ isOpen: false, business: null });
                  handlePasswordChange(editForm);
                }}
              >
                <RiLockLine style={{ marginRight: 8 }} />
                비밀번호 변경
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 승인 확인 모달 */}
      <ConfirmModal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal({ isOpen: false, business: null })}
        onConfirm={handleApproveConfirm}
        title="기업회원 승인"
        message={`"${approveModal.business?.companyName}" 기업회원을 승인하시겠습니까?`}
        confirmText="승인"
        type="primary"
      />

      {/* 반려 모달 */}
      <Modal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, business: null })}
        title="기업회원 반려"
        size="medium"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setRejectModal({ isOpen: false, business: null })}>취소</button>
            <button className="btn btn-danger" onClick={handleRejectConfirm}>반려</button>
          </>
        }
      >
        {rejectModal.business && (
          <div>
            <p style={{ marginBottom: 16 }}>
              <strong>"{rejectModal.business.companyName}"</strong> 기업회원 가입을 반려하시겠습니까?
            </p>
            <div className="form-group">
              <label className="form-label">반려 사유</label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="반려 사유를 입력하세요..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* 비밀번호 변경 모달 */}
      <Modal
        isOpen={passwordModal.isOpen}
        onClose={() => {
          setPasswordModal({ isOpen: false, business: null });
          setPasswordForm({ newPassword: '', confirmPassword: '' });
        }}
        title="비밀번호 변경"
        size="small"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => {
              setPasswordModal({ isOpen: false, business: null });
              setPasswordForm({ newPassword: '', confirmPassword: '' });
            }}>취소</button>
            <button className="btn btn-primary" onClick={handlePasswordSubmit}>변경</button>
          </>
        }
      >
        {passwordModal.business && (
          <div>
            <div style={{ marginBottom: 16, padding: '12px', background: '#f3f4f6', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>대상 기업회원</div>
              <div style={{ fontWeight: 600 }}>{passwordModal.business.companyName} ({passwordModal.business.visibleUserId})</div>
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">새 비밀번호 *</label>
              <input
                type="password"
                className="form-input"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="8자 이상 입력"
              />
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 4 }}>
                영문, 숫자, 특수문자 포함 8자 이상
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">비밀번호 확인 *</label>
              <input
                type="password"
                className="form-input"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="비밀번호 다시 입력"
              />
              {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>
                  비밀번호가 일치하지 않습니다.
                </div>
              )}
              {passwordForm.confirmPassword && passwordForm.newPassword === passwordForm.confirmPassword && (
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: 4 }}>
                  비밀번호가 일치합니다.
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* 기업회원 등록 모달 */}
      <Modal
        isOpen={registerModal}
        onClose={() => setRegisterModal(false)}
        title="기업회원 등록"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setRegisterModal(false)}>취소</button>
            <button className="btn btn-primary" onClick={handleRegisterSubmit}>등록</button>
          </>
        }
      >
        <div>
          {/* 기업 로고 */}
          <div className="form-group">
            <label className="form-label"><RiImageLine /> 기업 로고</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  background: registerForm.logo ? 'transparent' : '#E0E7FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '2px dashed var(--border-color)'
                }}
              >
                {registerForm.logo ? (
                  <img src={registerForm.logo} alt="로고" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <RiBuilding2Line size={32} style={{ color: '#4F46E5' }} />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => registerFileInputRef.current?.click()}
                >
                  <RiUploadLine /> 이미지 업로드
                </button>
                {registerForm.logo && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setRegisterForm(prev => ({ ...prev, logo: null }))}
                    style={{ color: 'var(--danger-color)' }}
                  >
                    이미지 삭제
                  </button>
                )}
              </div>
            </div>
            <input
              type="file"
              ref={registerFileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleRegisterImageChange}
            />
          </div>

          {/* 계정 정보 섹션 */}
          <div className="form-section">
            <h4 className="form-section-title"><RiLockLine /> 계정 정보</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">아이디 *</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.visibleUserId}
                  onChange={(e) => setRegisterForm({ ...registerForm, visibleUserId: e.target.value })}
                  placeholder="영문, 숫자 조합"
                />
              </div>
              <div className="form-group">
                <label className="form-label">승인 상태</label>
                <select
                  className="form-input form-select"
                  value={registerForm.status}
                  onChange={(e) => setRegisterForm({ ...registerForm, status: e.target.value })}
                >
                  <option value="pending">대기</option>
                  <option value="approved">승인</option>
                  <option value="rejected">반려</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">비밀번호 *</label>
                <input
                  type="password"
                  className="form-input"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  placeholder="8자 이상"
                />
              </div>
              <div className="form-group">
                <label className="form-label">비밀번호 확인 *</label>
                <input
                  type="password"
                  className="form-input"
                  value={registerForm.passwordConfirm}
                  onChange={(e) => setRegisterForm({ ...registerForm, passwordConfirm: e.target.value })}
                  placeholder="비밀번호 다시 입력"
                />
                {registerForm.passwordConfirm && registerForm.password !== registerForm.passwordConfirm && (
                  <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>
                    비밀번호가 일치하지 않습니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 회사 정보 섹션 */}
          <div className="form-section">
            <h4 className="form-section-title"><RiBuilding2Line /> 회사 정보</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">회사명 *</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.companyName}
                  onChange={(e) => setRegisterForm({ ...registerForm, companyName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">사업주명 *</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.ceoName}
                  onChange={(e) => setRegisterForm({ ...registerForm, ceoName: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">사업자등록번호 *</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.businessNo}
                  onChange={(e) => setRegisterForm({ ...registerForm, businessNo: e.target.value.replace(/[^0-9]/g, '') })}
                  maxLength={10}
                  placeholder="'-' 없이 숫자만 입력"
                />
              </div>
              <div className="form-group">
                <label className="form-label">사업자등록증</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    className="form-input"
                    value={registerForm.businessLicense}
                    readOnly
                    placeholder="파일을 업로드해주세요"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => registerLicenseInputRef.current?.click()}
                  >
                    <RiUploadLine />
                  </button>
                </div>
                <input
                  type="file"
                  ref={registerLicenseInputRef}
                  style={{ display: 'none' }}
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleRegisterLicenseChange}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">통신판매업신고번호</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.ecommerceNo}
                  onChange={(e) => setRegisterForm({ ...registerForm, ecommerceNo: e.target.value })}
                  placeholder="예: 제2024-서울강남-00000호"
                />
              </div>
              <div className="form-group">
                <label className="form-label">회사 홈페이지</label>
                <input
                  type="url"
                  className="form-input"
                  value={registerForm.companyWebsite}
                  onChange={(e) => setRegisterForm({ ...registerForm, companyWebsite: e.target.value })}
                  placeholder="https://"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">기업 소개</label>
              <textarea
                className="form-input"
                rows={3}
                value={registerForm.companyDescription}
                onChange={(e) => setRegisterForm({ ...registerForm, companyDescription: e.target.value })}
                placeholder="기업에 대한 간단한 소개를 입력해주세요."
                maxLength={1000}
              />
            </div>
          </div>

          {/* 주소 정보 섹션 */}
          <div className="form-section">
            <h4 className="form-section-title"><RiMapPinLine /> 회사 주소</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">우편번호</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.companyPostcode}
                  onChange={(e) => setRegisterForm({ ...registerForm, companyPostcode: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">주소</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.companyAddress}
                  onChange={(e) => setRegisterForm({ ...registerForm, companyAddress: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">상세주소</label>
              <input
                type="text"
                className="form-input"
                value={registerForm.companyAddressDetail}
                onChange={(e) => setRegisterForm({ ...registerForm, companyAddressDetail: e.target.value })}
              />
            </div>
          </div>

          {/* 담당자 정보 섹션 */}
          <div className="form-section">
            <h4 className="form-section-title"><RiUserLine /> 담당자 정보</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">담당자명 *</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.managerName}
                  onChange={(e) => setRegisterForm({ ...registerForm, managerName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">담당자 연락처 *</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.managerPhone}
                  onChange={(e) => setRegisterForm({ ...registerForm, managerPhone: e.target.value.replace(/[^0-9]/g, '') })}
                  maxLength={11}
                  placeholder="01012345678"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">담당자 이메일 *</label>
              <input
                type="email"
                className="form-input"
                value={registerForm.managerEmail}
                onChange={(e) => setRegisterForm({ ...registerForm, managerEmail: e.target.value })}
              />
            </div>
          </div>

          {/* 정산 계좌 섹션 */}
          <div className="form-section">
            <h4 className="form-section-title"><RiBankLine /> 정산 계좌</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">은행</label>
                <select
                  className="form-input form-select"
                  value={registerForm.bankName}
                  onChange={(e) => setRegisterForm({ ...registerForm, bankName: e.target.value })}
                >
                  <option value="">선택</option>
                  {bankOptions.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">계좌번호</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.accountNumber}
                  onChange={(e) => setRegisterForm({ ...registerForm, accountNumber: e.target.value.replace(/[^0-9]/g, '') })}
                  maxLength={20}
                  placeholder="'-' 없이 숫자만 입력"
                />
              </div>
              <div className="form-group">
                <label className="form-label">예금주</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.accountHolder}
                  onChange={(e) => setRegisterForm({ ...registerForm, accountHolder: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 알림 설정 섹션 */}
          <div className="form-section">
            <h4 className="form-section-title"><RiNotification3Line /> 알림 설정</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={registerForm.notifyOrder}
                  onChange={(e) => setRegisterForm({ ...registerForm, notifyOrder: e.target.checked })}
                />
                <span>새 예약 알림 (이메일)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={registerForm.notifyReview}
                  onChange={(e) => setRegisterForm({ ...registerForm, notifyReview: e.target.checked })}
                />
                <span>새 후기 알림 (이메일)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={registerForm.notifyInquiry}
                  onChange={(e) => setRegisterForm({ ...registerForm, notifyInquiry: e.target.checked })}
                />
                <span>문의 알림 (이메일)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={registerForm.notifySettlement}
                  onChange={(e) => setRegisterForm({ ...registerForm, notifySettlement: e.target.checked })}
                />
                <span>정산 완료 알림 (이메일)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={registerForm.notifyMarketing}
                  onChange={(e) => setRegisterForm({ ...registerForm, notifyMarketing: e.target.checked })}
                />
                <span>마케팅 정보 수신 (이메일)</span>
              </label>
            </div>
          </div>

          {/* 약관 동의 섹션 */}
          <div className="form-section">
            <h4 className="form-section-title"><RiFileTextLine /> 약관 동의</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={registerForm.agreeTerms}
                  onChange={(e) => setRegisterForm({ ...registerForm, agreeTerms: e.target.checked })}
                />
                <span>이용약관 동의 (필수)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={registerForm.agreePrivacy}
                  onChange={(e) => setRegisterForm({ ...registerForm, agreePrivacy: e.target.checked })}
                />
                <span>개인정보처리방침 동의 (필수)</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={registerForm.agreeLocation}
                  onChange={(e) => setRegisterForm({ ...registerForm, agreeLocation: e.target.checked })}
                />
                <span>위치기반서비스 동의 (선택)</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default BusinessMembers;
