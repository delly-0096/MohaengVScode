import { useState, useRef } from 'react';
import {
  RiSearchLine,
  RiFilterLine,
  RiDownloadLine,
  RiEyeLine,
  RiEditLine,
  RiDeleteBinLine,
  RiMailLine,
  RiLockLine,
  RiUserLine,
  RiPhoneLine,
  RiCalendarLine,
  RiMapPinLine,
  RiCameraLine,
  RiImageLine,
  RiNotification3Line,
  RiMegaphoneLine,
  RiUserAddLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

// 더미 데이터 - mohaeng 프로젝트 필드에 맞춤
const initialMembersData = [
  {
    id: 1,
    userId: 'user001',
    userName: '김여행',
    nickname: '여행러버',
    email: 'travel@gmail.com',
    phone: '01012345678',
    birthDate: '1990-05-15',
    gender: 'F',
    postcode: '06234',
    address: '서울시 강남구 테헤란로 123',
    addressDetail: '456호',
    profileImage: null,
    joinDate: '2024-01-15',
    lastLogin: '2024-12-18 14:30',
    visits: 24,
    status: 'active',
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: true,
    agreeMarketing: true,
    // 알림 설정
    notifyReservation: true,
    notifySchedule: true,
    notifyCommunity: true,
    notifyPoint: false,
    notifyInquiry: true,
    // 마케팅 수신 동의
    agreeEmailMarketing: true,
    agreeSmsMarketing: false,
    agreePushMarketing: true
  },
  {
    id: 2,
    userId: 'mohaeng22',
    userName: '이모행',
    nickname: '모행이',
    email: 'mohaeng@naver.com',
    phone: '01023456789',
    birthDate: '1988-08-22',
    gender: 'M',
    postcode: '06545',
    address: '서울시 서초구 서초대로 456',
    addressDetail: '101동 202호',
    profileImage: null,
    joinDate: '2024-02-20',
    lastLogin: '2024-12-17 09:15',
    visits: 18,
    status: 'active',
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: true,
    agreeMarketing: true,
    notifyReservation: true,
    notifySchedule: true,
    notifyCommunity: true,
    notifyPoint: true,
    notifyInquiry: true,
    agreeEmailMarketing: true,
    agreeSmsMarketing: true,
    agreePushMarketing: false
  },
  {
    id: 3,
    userId: 'tour2024',
    userName: '박관광',
    nickname: '관광가이드',
    email: 'tour@daum.net',
    phone: '01034567890',
    birthDate: '1995-02-10',
    gender: 'M',
    postcode: '48099',
    address: '부산시 해운대구 해운대로 789',
    addressDetail: '해운대아파트 301호',
    profileImage: null,
    joinDate: '2024-03-10',
    lastLogin: '2024-10-05 16:20',
    visits: 5,
    status: 'inactive',
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: false,
    agreeMarketing: false,
    notifyReservation: true,
    notifySchedule: false,
    notifyCommunity: false,
    notifyPoint: false,
    notifyInquiry: true,
    agreeEmailMarketing: false,
    agreeSmsMarketing: false,
    agreePushMarketing: false
  },
  {
    id: 4,
    userId: 'choitrip',
    userName: '최투어',
    nickname: '투어마스터',
    email: 'choi@gmail.com',
    phone: '01045678901',
    birthDate: '1992-11-30',
    gender: 'M',
    postcode: '42180',
    address: '대구시 수성구 동대구로 321',
    addressDetail: '수성빌라 201호',
    profileImage: null,
    joinDate: '2024-04-05',
    lastLogin: '2024-12-18 11:45',
    visits: 32,
    status: 'active',
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: true,
    agreeMarketing: false,
    notifyReservation: true,
    notifySchedule: true,
    notifyCommunity: true,
    notifyPoint: false,
    notifyInquiry: true,
    agreeEmailMarketing: false,
    agreeSmsMarketing: false,
    agreePushMarketing: true
  },
  {
    id: 5,
    userId: 'vacation99',
    userName: '정휴가',
    nickname: '휴가매니아',
    email: 'vacation@naver.com',
    phone: '01056789012',
    birthDate: '1985-07-08',
    gender: 'F',
    postcode: '21999',
    address: '인천시 연수구 컨벤시아대로 654',
    addressDetail: '송도타워 1502호',
    profileImage: null,
    joinDate: '2024-05-12',
    lastLogin: '2024-08-20 10:00',
    visits: 0,
    status: 'suspended',
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: false,
    agreeMarketing: false,
    notifyReservation: false,
    notifySchedule: false,
    notifyCommunity: false,
    notifyPoint: false,
    notifyInquiry: false,
    agreeEmailMarketing: false,
    agreeSmsMarketing: false,
    agreePushMarketing: false
  },
  {
    id: 6,
    userId: 'relax2024',
    userName: '강여유',
    nickname: '힐링여행',
    email: 'relax@gmail.com',
    phone: '01067890123',
    birthDate: '1993-04-25',
    gender: 'F',
    postcode: '61945',
    address: '광주시 서구 상무대로 987',
    addressDetail: '상무아파트 801호',
    profileImage: null,
    joinDate: '2024-06-18',
    lastLogin: '2024-12-16 18:30',
    visits: 15,
    status: 'active',
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: true,
    agreeMarketing: true,
    notifyReservation: true,
    notifySchedule: true,
    notifyCommunity: true,
    notifyPoint: true,
    notifyInquiry: true,
    agreeEmailMarketing: true,
    agreeSmsMarketing: true,
    agreePushMarketing: true
  },
  {
    id: 7,
    userId: 'outing777',
    userName: '윤나들이',
    nickname: '나들이왕',
    email: 'outing@daum.net',
    phone: '01078901234',
    birthDate: '1991-09-12',
    gender: 'M',
    postcode: '34126',
    address: '대전시 유성구 대학로 147',
    addressDetail: '유성타운 502호',
    profileImage: null,
    joinDate: '2024-07-22',
    lastLogin: '2024-12-18 08:00',
    visits: 28,
    status: 'active',
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: true,
    agreeMarketing: true,
    notifyReservation: true,
    notifySchedule: true,
    notifyCommunity: true,
    notifyPoint: false,
    notifyInquiry: true,
    agreeEmailMarketing: true,
    agreeSmsMarketing: false,
    agreePushMarketing: true
  },
  {
    id: 8,
    userId: 'vacance88',
    userName: '한바캉스',
    nickname: '바캉스러버',
    email: 'vacance@naver.com',
    phone: '01089012345',
    birthDate: '1987-12-05',
    gender: 'M',
    postcode: '44699',
    address: '울산시 남구 삼산로 258',
    addressDetail: '삼산빌딩 1201호',
    profileImage: null,
    joinDate: '2024-08-30',
    lastLogin: '2024-09-15 14:20',
    visits: 3,
    status: 'inactive',
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: false,
    agreeMarketing: false,
    notifyReservation: true,
    notifySchedule: false,
    notifyCommunity: false,
    notifyPoint: false,
    notifyInquiry: true,
    agreeEmailMarketing: false,
    agreeSmsMarketing: false,
    agreePushMarketing: false
  },
  {
    id: 9,
    userId: 'tripgo',
    userName: '오트립',
    nickname: '트립고고',
    email: 'trip@gmail.com',
    phone: '01090123456',
    birthDate: '1994-06-18',
    gender: 'F',
    postcode: '13494',
    address: '경기도 성남시 분당구 판교로 369',
    addressDetail: '판교타워 701호',
    profileImage: null,
    joinDate: '2024-09-14',
    lastLogin: '2024-12-17 20:45',
    visits: 12,
    status: 'active',
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: true,
    agreeMarketing: false,
    notifyReservation: true,
    notifySchedule: true,
    notifyCommunity: true,
    notifyPoint: false,
    notifyInquiry: true,
    agreeEmailMarketing: false,
    agreeSmsMarketing: false,
    agreePushMarketing: false
  },
  {
    id: 10,
    userId: 'healing2024',
    userName: '서힐링',
    nickname: '제주힐링',
    email: 'healing@naver.com',
    phone: '01001234567',
    birthDate: '1996-03-22',
    gender: 'F',
    postcode: '63002',
    address: '제주시 애월읍 애월로 741',
    addressDetail: '애월빌라 101호',
    profileImage: null,
    joinDate: '2024-10-08',
    lastLogin: '2024-12-15 12:10',
    visits: 9,
    status: 'active',
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: true,
    agreeMarketing: true,
    notifyReservation: true,
    notifySchedule: true,
    notifyCommunity: true,
    notifyPoint: true,
    notifyInquiry: true,
    agreeEmailMarketing: true,
    agreeSmsMarketing: false,
    agreePushMarketing: true
  }
];

const statusLabels = {
  active: { label: '활성', className: 'badge-success' },
  inactive: { label: '휴면', className: 'badge-gray' },
  suspended: { label: '정지', className: 'badge-danger' }
};

const genderLabels = {
  M: '남성',
  F: '여성',
  '': '미선택'
};

function GeneralMembers() {
  const [membersData, setMembersData] = useState(initialMembersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const fileInputRef = useRef(null);

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, member: null });
  const [editModal, setEditModal] = useState({ isOpen: false, member: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, member: null });
  const [passwordModal, setPasswordModal] = useState({ isOpen: false, member: null });
  const [registerModal, setRegisterModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [registerForm, setRegisterForm] = useState({
    userId: '',
    password: '',
    passwordConfirm: '',
    userName: '',
    nickname: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    postcode: '',
    address: '',
    addressDetail: '',
    profileImage: null,
    status: 'active',
    agreeTerms: true,
    agreePrivacy: true,
    agreeLocation: false,
    agreeMarketing: false,
    notifyReservation: true,
    notifySchedule: true,
    notifyCommunity: true,
    notifyPoint: false,
    notifyInquiry: true,
    agreeEmailMarketing: false,
    agreeSmsMarketing: false,
    agreePushMarketing: false
  });
  const registerFileInputRef = useRef(null);

  // 프로필 이미지 변경 처리
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm(prev => ({ ...prev, profileImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 프로필 이미지 삭제
  const handleRemoveImage = () => {
    setEditForm(prev => ({ ...prev, profileImage: null }));
  };

  const filteredMembers = membersData.filter(member => {
    const matchesSearch = member.userName.includes(searchTerm) ||
                          member.userId.includes(searchTerm) ||
                          member.nickname.includes(searchTerm) ||
                          member.email.includes(searchTerm) ||
                          member.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMembers(filteredMembers.map(m => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  // 상세보기
  const handleViewDetail = (member) => {
    setDetailModal({ isOpen: true, member });
  };

  // 수정
  const handleEdit = (member) => {
    setEditForm({ ...member });
    setEditModal({ isOpen: true, member });
  };

  const handleEditSubmit = () => {
    setMembersData(prev => prev.map(m => m.id === editForm.id ? editForm : m));
    setEditModal({ isOpen: false, member: null });
    alert('회원 정보가 수정되었습니다.');
  };

  // 삭제
  const handleDelete = (member) => {
    setDeleteModal({ isOpen: true, member });
  };

  const handleDeleteConfirm = () => {
    setMembersData(prev => prev.filter(m => m.id !== deleteModal.member.id));
    setDeleteModal({ isOpen: false, member: null });
    alert('회원이 삭제되었습니다.');
  };

  // 비밀번호 변경
  const handlePasswordChange = (member) => {
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    setPasswordModal({ isOpen: true, member });
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
    setPasswordModal({ isOpen: false, member: null });
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    alert('비밀번호가 변경되었습니다.');
  };

  // 회원 등록
  const handleRegister = () => {
    setRegisterForm({
      userId: '',
      password: '',
      passwordConfirm: '',
      userName: '',
      nickname: '',
      email: '',
      phone: '',
      birthDate: '',
      gender: '',
      postcode: '',
      address: '',
      addressDetail: '',
      profileImage: null,
      status: 'active',
      agreeTerms: true,
      agreePrivacy: true,
      agreeLocation: false,
      agreeMarketing: false,
      notifyReservation: true,
      notifySchedule: true,
      notifyCommunity: true,
      notifyPoint: false,
      notifyInquiry: true,
      agreeEmailMarketing: false,
      agreeSmsMarketing: false,
      agreePushMarketing: false
    });
    setRegisterModal(true);
  };

  const handleRegisterImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRegisterForm(prev => ({ ...prev, profileImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterSubmit = () => {
    // 필수 필드 검증
    if (!registerForm.userId || !registerForm.password || !registerForm.userName ||
        !registerForm.nickname || !registerForm.email || !registerForm.phone) {
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
    if (!registerForm.agreeTerms || !registerForm.agreePrivacy) {
      alert('필수 약관에 동의해주세요.');
      return;
    }

    // 새 회원 추가
    const newMember = {
      id: membersData.length + 1,
      userId: registerForm.userId,
      userName: registerForm.userName,
      nickname: registerForm.nickname,
      email: registerForm.email,
      phone: registerForm.phone,
      birthDate: registerForm.birthDate,
      gender: registerForm.gender,
      postcode: registerForm.postcode,
      address: registerForm.address,
      addressDetail: registerForm.addressDetail,
      profileImage: registerForm.profileImage,
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: '-',
      visits: 0,
      status: registerForm.status,
      agreeTerms: registerForm.agreeTerms,
      agreePrivacy: registerForm.agreePrivacy,
      agreeLocation: registerForm.agreeLocation,
      agreeMarketing: registerForm.agreeMarketing,
      notifyReservation: registerForm.notifyReservation,
      notifySchedule: registerForm.notifySchedule,
      notifyCommunity: registerForm.notifyCommunity,
      notifyPoint: registerForm.notifyPoint,
      notifyInquiry: registerForm.notifyInquiry,
      agreeEmailMarketing: registerForm.agreeEmailMarketing,
      agreeSmsMarketing: registerForm.agreeSmsMarketing,
      agreePushMarketing: registerForm.agreePushMarketing
    };

    setMembersData(prev => [newMember, ...prev]);
    setRegisterModal(false);
    alert('회원이 등록되었습니다.');
  };

  return (
    <div className="members-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">일반회원 관리</h1>
          <p className="page-subtitle">총 {filteredMembers.length}명의 일반회원이 있습니다.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline">
            <RiDownloadLine /> 엑셀 다운로드
          </button>
          <button className="btn btn-primary" onClick={handleRegister}>
            <RiUserAddLine /> 회원 등록
          </button>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="아이디, 이름, 닉네임, 이메일, 전화번호 검색"
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
              <option value="active">활성</option>
              <option value="inactive">휴면</option>
              <option value="suspended">정지</option>
            </select>
          </div>

          {selectedMembers.length > 0 && (
            <div className="bulk-actions">
              <span className="selected-count">{selectedMembers.length}명 선택</span>
              <button className="btn btn-sm btn-outline">
                <RiMailLine /> 메일 발송
              </button>
              <button className="btn btn-sm btn-outline">
                <RiLockLine /> 상태 변경
              </button>
            </div>
          )}
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                  />
                </th>
                <th>회원정보</th>
                <th>아이디</th>
                <th>닉네임</th>
                <th>연락처</th>
                <th>가입일</th>
                <th>상태</th>
                <th style={{ width: 120 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleSelectMember(member.id)}
                    />
                  </td>
                  <td>
                    <div className="member-info">
                      <div className="avatar">
                        {member.profileImage ? (
                          <img src={member.profileImage} alt={member.userName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          member.userName.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="member-name">{member.userName}</div>
                        <div className="member-email">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{member.userId}</td>
                  <td>{member.nickname}</td>
                  <td>{member.phone}</td>
                  <td>{member.joinDate}</td>
                  <td>
                    <span className={`badge ${statusLabels[member.status].className}`}>
                      {statusLabels[member.status].label}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" title="상세보기" onClick={() => handleViewDetail(member)}>
                        <RiEyeLine />
                      </button>
                      <button className="table-action-btn edit" title="수정" onClick={() => handleEdit(member)}>
                        <RiEditLine />
                      </button>
                      <button className="table-action-btn delete" title="삭제" onClick={() => handleDelete(member)}>
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
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <button className="pagination-btn">&gt;</button>
        </div>
      </div>

      {/* 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, member: null })}
        title="회원 상세정보"
        size="large"
      >
        {detailModal.member && (
          <div>
            {/* 프로필 이미지 */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div
                className="avatar"
                style={{
                  width: 80,
                  height: 80,
                  fontSize: '2rem',
                  margin: '0 auto 12px'
                }}
              >
                {detailModal.member.profileImage ? (
                  <img
                    src={detailModal.member.profileImage}
                    alt={detailModal.member.userName}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  detailModal.member.userName.charAt(0)
                )}
              </div>
              <h3 style={{ marginBottom: 4 }}>{detailModal.member.userName}</h3>
              <span className={`badge ${statusLabels[detailModal.member.status].className}`}>
                {statusLabels[detailModal.member.status].label}
              </span>
            </div>

            {/* 기본 정보 */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>기본 정보</h4>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">아이디</span>
                  <span className="detail-value">{detailModal.member.userId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">이름</span>
                  <span className="detail-value">{detailModal.member.userName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">닉네임</span>
                  <span className="detail-value">{detailModal.member.nickname}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">이메일</span>
                  <span className="detail-value">{detailModal.member.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">연락처</span>
                  <span className="detail-value">{detailModal.member.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">생년월일</span>
                  <span className="detail-value">{detailModal.member.birthDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">성별</span>
                  <span className="detail-value">{genderLabels[detailModal.member.gender] || '미선택'}</span>
                </div>
              </div>
            </div>

            {/* 주소 정보 */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>주소 정보</h4>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">우편번호</span>
                  <span className="detail-value">{detailModal.member.postcode}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">기본주소</span>
                  <span className="detail-value">{detailModal.member.address}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">상세주소</span>
                  <span className="detail-value">{detailModal.member.addressDetail}</span>
                </div>
              </div>
            </div>

            {/* 활동 정보 */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>활동 정보</h4>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">가입일</span>
                  <span className="detail-value">{detailModal.member.joinDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">최근 로그인</span>
                  <span className="detail-value">{detailModal.member.lastLogin}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">방문 횟수</span>
                  <span className="detail-value">{detailModal.member.visits}회</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">계정 상태</span>
                  <span className="detail-value">
                    <span className={`badge ${statusLabels[detailModal.member.status].className}`}>
                      {statusLabels[detailModal.member.status].label}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* 알림 설정 */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
                <RiNotification3Line style={{ marginRight: 6, verticalAlign: 'middle' }} />
                알림 설정
              </h4>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">예약 확정/취소 알림</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.notifyReservation ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.notifyReservation ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">여행 일정 리마인드 알림</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.notifySchedule ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.notifySchedule ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">커뮤니티 댓글/답글 알림</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.notifyCommunity ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.notifyCommunity ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">포인트 적립/사용 알림</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.notifyPoint ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.notifyPoint ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">문의 답변 알림</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.notifyInquiry ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.notifyInquiry ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* 마케팅 수신 동의 */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
                <RiMegaphoneLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
                마케팅 수신 동의
              </h4>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">이메일 수신</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.agreeEmailMarketing ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.agreeEmailMarketing ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">SMS 수신</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.agreeSmsMarketing ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.agreeSmsMarketing ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">푸시 알림 수신</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.agreePushMarketing ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.agreePushMarketing ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* 약관 동의 */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>약관 동의</h4>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">이용약관 동의</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.agreeTerms ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.agreeTerms ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">개인정보처리방침 동의</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.agreePrivacy ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.agreePrivacy ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">위치기반서비스 동의</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.agreeLocation ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.agreeLocation ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* 관리 기능 */}
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
              <button
                className="btn btn-outline"
                style={{ width: '100%' }}
                onClick={() => {
                  setDetailModal({ isOpen: false, member: null });
                  handlePasswordChange(detailModal.member);
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
        onClose={() => setEditModal({ isOpen: false, member: null })}
        title="회원 정보 수정"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setEditModal({ isOpen: false, member: null })}>취소</button>
            <button className="btn btn-primary" onClick={handleEditSubmit}>저장</button>
          </>
        }
      >
        {editModal.member && (
          <div>
            {/* 프로필 이미지 수정 */}
            <div className="form-group" style={{ textAlign: 'center', marginBottom: 24 }}>
              <label className="form-label" style={{ textAlign: 'left' }}>프로필 이미지</label>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div
                  className="avatar"
                  style={{
                    width: 100,
                    height: 100,
                    fontSize: '2.5rem',
                    margin: '0 auto',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {editForm.profileImage ? (
                    <img
                      src={editForm.profileImage}
                      alt={editForm.userName}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    editForm.userName?.charAt(0)
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s'
                    }}
                    className="avatar-overlay"
                  >
                    <RiCameraLine size={24} color="white" />
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
              <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <RiImageLine /> 이미지 변경
                </button>
                {editForm.profileImage && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={handleRemoveImage}
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>

            {/* 기본 정보 섹션 */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>기본 정보</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">아이디 (변경불가)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.userId || ''}
                    disabled
                    style={{ backgroundColor: '#f3f4f6' }}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">이름 *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.userName || ''}
                    onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">닉네임 *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.nickname || ''}
                    onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">이메일 *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">연락처 *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value.replace(/[^0-9]/g, '') })}
                    placeholder="01012345678"
                    maxLength={11}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">생년월일 *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editForm.birthDate || ''}
                    onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">성별</label>
                  <select
                    className="form-input form-select"
                    value={editForm.gender || ''}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  >
                    <option value="">미선택</option>
                    <option value="M">남성</option>
                    <option value="F">여성</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">계정 상태</label>
                  <select
                    className="form-input form-select"
                    value={editForm.status || ''}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="active">활성</option>
                    <option value="inactive">휴면</option>
                    <option value="suspended">정지</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 주소 정보 섹션 */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>주소 정보</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">우편번호</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.postcode || ''}
                    onChange={(e) => setEditForm({ ...editForm, postcode: e.target.value })}
                    placeholder="우편번호"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">기본주소</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.address || ''}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="기본주소"
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label">상세주소</label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.addressDetail || ''}
                  onChange={(e) => setEditForm({ ...editForm, addressDetail: e.target.value })}
                  placeholder="상세주소"
                />
              </div>
            </div>

            {/* 알림 설정 섹션 */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
                <RiNotification3Line style={{ marginRight: 6, verticalAlign: 'middle' }} />
                알림 설정
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editForm.notifyReservation || false}
                    onChange={(e) => setEditForm({ ...editForm, notifyReservation: e.target.checked })}
                  />
                  예약 확정/취소 알림 (이메일)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editForm.notifySchedule || false}
                    onChange={(e) => setEditForm({ ...editForm, notifySchedule: e.target.checked })}
                  />
                  여행 일정 리마인드 알림 (이메일)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editForm.notifyCommunity || false}
                    onChange={(e) => setEditForm({ ...editForm, notifyCommunity: e.target.checked })}
                  />
                  커뮤니티 댓글/답글 알림 (이메일)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editForm.notifyPoint || false}
                    onChange={(e) => setEditForm({ ...editForm, notifyPoint: e.target.checked })}
                  />
                  포인트 적립/사용 알림 (이메일)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editForm.notifyInquiry || false}
                    onChange={(e) => setEditForm({ ...editForm, notifyInquiry: e.target.checked })}
                  />
                  문의 답변 알림 (이메일)
                </label>
              </div>
            </div>

            {/* 마케팅 수신 동의 섹션 */}
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
                <RiMegaphoneLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
                마케팅 수신 동의
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editForm.agreeEmailMarketing || false}
                    onChange={(e) => setEditForm({ ...editForm, agreeEmailMarketing: e.target.checked })}
                  />
                  이메일 수신 동의
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editForm.agreeSmsMarketing || false}
                    onChange={(e) => setEditForm({ ...editForm, agreeSmsMarketing: e.target.checked })}
                  />
                  SMS 수신 동의
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editForm.agreePushMarketing || false}
                    onChange={(e) => setEditForm({ ...editForm, agreePushMarketing: e.target.checked })}
                  />
                  푸시 알림 수신 동의
                </label>
              </div>
            </div>

            {/* 약관 동의 섹션 */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>약관 동의</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editForm.agreeTerms || false}
                    onChange={(e) => setEditForm({ ...editForm, agreeTerms: e.target.checked })}
                  />
                  이용약관 동의 (필수)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editForm.agreePrivacy || false}
                    onChange={(e) => setEditForm({ ...editForm, agreePrivacy: e.target.checked })}
                  />
                  개인정보처리방침 동의 (필수)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={editForm.agreeLocation || false}
                    onChange={(e) => setEditForm({ ...editForm, agreeLocation: e.target.checked })}
                  />
                  위치기반서비스 동의 (선택)
                </label>
              </div>
            </div>

            {/* 비밀번호 변경 */}
            <div style={{ marginTop: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>비밀번호 관리</h4>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditModal({ isOpen: false, member: null });
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

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, member: null })}
        onConfirm={handleDeleteConfirm}
        title="회원 삭제"
        message={`정말 "${deleteModal.member?.userName}" 회원을 삭제하시겠습니까?`}
        confirmText="삭제"
        type="danger"
      />

      {/* 비밀번호 변경 모달 */}
      <Modal
        isOpen={passwordModal.isOpen}
        onClose={() => {
          setPasswordModal({ isOpen: false, member: null });
          setPasswordForm({ newPassword: '', confirmPassword: '' });
        }}
        title="비밀번호 변경"
        size="small"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => {
              setPasswordModal({ isOpen: false, member: null });
              setPasswordForm({ newPassword: '', confirmPassword: '' });
            }}>취소</button>
            <button className="btn btn-primary" onClick={handlePasswordSubmit}>변경</button>
          </>
        }
      >
        {passwordModal.member && (
          <div>
            <div style={{ marginBottom: 16, padding: '12px', background: '#f3f4f6', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>대상 회원</div>
              <div style={{ fontWeight: 600 }}>{passwordModal.member.userName} ({passwordModal.member.userId})</div>
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

      {/* 회원 등록 모달 */}
      <Modal
        isOpen={registerModal}
        onClose={() => setRegisterModal(false)}
        title="일반회원 등록"
        size="large"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setRegisterModal(false)}>취소</button>
            <button className="btn btn-primary" onClick={handleRegisterSubmit}>등록</button>
          </>
        }
      >
        <div>
          {/* 프로필 이미지 */}
          <div className="form-group" style={{ textAlign: 'center', marginBottom: 24 }}>
            <label className="form-label" style={{ textAlign: 'left' }}>프로필 이미지</label>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div
                className="avatar"
                style={{
                  width: 100,
                  height: 100,
                  fontSize: '2.5rem',
                  margin: '0 auto',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onClick={() => registerFileInputRef.current?.click()}
              >
                {registerForm.profileImage ? (
                  <img
                    src={registerForm.profileImage}
                    alt="프로필"
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <RiUserLine size={40} />
                )}
              </div>
              <input
                type="file"
                ref={registerFileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleRegisterImageChange}
              />
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => registerFileInputRef.current?.click()}
              >
                <RiImageLine /> 이미지 선택
              </button>
              {registerForm.profileImage && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => setRegisterForm(prev => ({ ...prev, profileImage: null }))}
                >
                  삭제
                </button>
              )}
            </div>
          </div>

          {/* 계정 정보 섹션 */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
              <RiLockLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
              계정 정보
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">아이디 *</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.userId}
                  onChange={(e) => setRegisterForm({ ...registerForm, userId: e.target.value })}
                  placeholder="영문, 숫자 조합"
                />
              </div>
              <div className="form-group">
                <label className="form-label">계정 상태</label>
                <select
                  className="form-input form-select"
                  value={registerForm.status}
                  onChange={(e) => setRegisterForm({ ...registerForm, status: e.target.value })}
                >
                  <option value="active">활성</option>
                  <option value="inactive">휴면</option>
                  <option value="suspended">정지</option>
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

          {/* 기본 정보 섹션 */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
              <RiUserLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
              기본 정보
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">이름 *</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.userName}
                  onChange={(e) => setRegisterForm({ ...registerForm, userName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">닉네임 *</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.nickname}
                  onChange={(e) => setRegisterForm({ ...registerForm, nickname: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">이메일 *</label>
                <input
                  type="email"
                  className="form-input"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">연락처 *</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value.replace(/[^0-9]/g, '') })}
                  placeholder="01012345678"
                  maxLength={11}
                />
              </div>
              <div className="form-group">
                <label className="form-label">생년월일</label>
                <input
                  type="date"
                  className="form-input"
                  value={registerForm.birthDate}
                  onChange={(e) => setRegisterForm({ ...registerForm, birthDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">성별</label>
                <select
                  className="form-input form-select"
                  value={registerForm.gender}
                  onChange={(e) => setRegisterForm({ ...registerForm, gender: e.target.value })}
                >
                  <option value="">미선택</option>
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              </div>
            </div>
          </div>

          {/* 주소 정보 섹션 */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
              <RiMapPinLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
              주소 정보
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">우편번호</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.postcode}
                  onChange={(e) => setRegisterForm({ ...registerForm, postcode: e.target.value })}
                  placeholder="우편번호"
                />
              </div>
              <div className="form-group">
                <label className="form-label">기본주소</label>
                <input
                  type="text"
                  className="form-input"
                  value={registerForm.address}
                  onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                  placeholder="기본주소"
                />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="form-label">상세주소</label>
              <input
                type="text"
                className="form-input"
                value={registerForm.addressDetail}
                onChange={(e) => setRegisterForm({ ...registerForm, addressDetail: e.target.value })}
                placeholder="상세주소"
              />
            </div>
          </div>

          {/* 알림 설정 섹션 */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
              <RiNotification3Line style={{ marginRight: 6, verticalAlign: 'middle' }} />
              알림 설정
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={registerForm.notifyReservation}
                  onChange={(e) => setRegisterForm({ ...registerForm, notifyReservation: e.target.checked })}
                />
                예약 확정/취소 알림
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={registerForm.notifySchedule}
                  onChange={(e) => setRegisterForm({ ...registerForm, notifySchedule: e.target.checked })}
                />
                여행 일정 리마인드 알림
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={registerForm.notifyCommunity}
                  onChange={(e) => setRegisterForm({ ...registerForm, notifyCommunity: e.target.checked })}
                />
                커뮤니티 댓글/답글 알림
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={registerForm.notifyPoint}
                  onChange={(e) => setRegisterForm({ ...registerForm, notifyPoint: e.target.checked })}
                />
                포인트 적립/사용 알림
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={registerForm.notifyInquiry}
                  onChange={(e) => setRegisterForm({ ...registerForm, notifyInquiry: e.target.checked })}
                />
                문의 답변 알림
              </label>
            </div>
          </div>

          {/* 마케팅 수신 동의 섹션 */}
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
              <RiMegaphoneLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
              마케팅 수신 동의
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={registerForm.agreeEmailMarketing}
                  onChange={(e) => setRegisterForm({ ...registerForm, agreeEmailMarketing: e.target.checked })}
                />
                이메일 수신 동의
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={registerForm.agreeSmsMarketing}
                  onChange={(e) => setRegisterForm({ ...registerForm, agreeSmsMarketing: e.target.checked })}
                />
                SMS 수신 동의
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={registerForm.agreePushMarketing}
                  onChange={(e) => setRegisterForm({ ...registerForm, agreePushMarketing: e.target.checked })}
                />
                푸시 알림 수신 동의
              </label>
            </div>
          </div>

          {/* 약관 동의 섹션 */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>약관 동의</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={registerForm.agreeTerms}
                  onChange={(e) => setRegisterForm({ ...registerForm, agreeTerms: e.target.checked })}
                />
                이용약관 동의 (필수)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={registerForm.agreePrivacy}
                  onChange={(e) => setRegisterForm({ ...registerForm, agreePrivacy: e.target.checked })}
                />
                개인정보처리방침 동의 (필수)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={registerForm.agreeLocation}
                  onChange={(e) => setRegisterForm({ ...registerForm, agreeLocation: e.target.checked })}
                />
                위치기반서비스 동의 (선택)
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default GeneralMembers;
