import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  RiUserLine,
  RiMailLine,
  RiPhoneLine,
  RiLockPasswordLine,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
  RiCameraLine,
  RiShieldUserLine,
  RiCalendarLine
} from 'react-icons/ri';
import { Modal } from '../components/common/Modal';

function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  // 프로필 정보 상태
  const [profileData, setProfileData] = useState({
    name: user?.name || '관리자',
    email: user?.email || 'admin@mohaeng.com',
    phone: '010-1234-5678',
    role: user?.roleName || '최고관리자',
    department: '운영팀',
    joinedAt: '2024-01-15',
    avatar: user?.avatar || null
  });

  // 수정 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...profileData });

  // 비밀번호 변경 모달
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // 프로필 이미지 변경
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData(prev => ({ ...prev, avatar: e.target.result }));
        if (!isEditing) {
          setProfileData(prev => ({ ...prev, avatar: e.target.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 수정 저장
  const handleSave = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
    alert('프로필이 수정되었습니다.');
  };

  // 수정 취소
  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  // 비밀번호 변경
  const handlePasswordChange = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (passwordData.new.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    // API 호출 대신 더미 처리
    alert('비밀번호가 변경되었습니다.');
    setPasswordModal(false);
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const getInitials = (name) => {
    return name ? name.charAt(0) : 'A';
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">내 정보</h1>
          <p className="page-subtitle">관리자 프로필 정보를 확인하고 수정할 수 있습니다.</p>
        </div>
        <div className="page-header-actions">
          {!isEditing ? (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <RiEditLine /> 수정
            </button>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={handleCancel}>
                <RiCloseLine /> 취소
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <RiCheckLine /> 저장
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: 24 }}>
        {/* 프로필 카드 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">프로필 정보</h3>
          </div>
          <div style={{ padding: '24px', textAlign: 'center' }}>
            {/* 프로필 이미지 */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
              <div
                className="header-user-avatar"
                style={{
                  width: 120,
                  height: 120,
                  fontSize: '2.5rem',
                  margin: '0 auto',
                  cursor: isEditing ? 'pointer' : 'default'
                }}
                onClick={() => isEditing && fileInputRef.current?.click()}
              >
                {(isEditing ? editData.avatar : profileData.avatar) ? (
                  <img
                    src={isEditing ? editData.avatar : profileData.avatar}
                    alt={profileData.name}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  getInitials(profileData.name)
                )}
              </div>
              {isEditing && (
                <button
                  className="btn btn-icon"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--primary-color)',
                    color: 'white',
                    border: 'none'
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <RiCameraLine />
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <h2 style={{ marginBottom: 8 }}>{profileData.name}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              <span className="badge badge-primary">{profileData.role}</span>
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {profileData.department}
            </p>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">상세 정보</h3>
          </div>
          <div style={{ padding: '24px' }}>
            <div className="detail-list">
              <div className="detail-item">
                <span className="detail-label"><RiUserLine /> 이름</span>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-input"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    style={{ maxWidth: 240 }}
                  />
                ) : (
                  <span className="detail-value">{profileData.name}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiMailLine /> 이메일</span>
                {isEditing ? (
                  <input
                    type="email"
                    className="form-input"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    style={{ maxWidth: 240 }}
                  />
                ) : (
                  <span className="detail-value">{profileData.email}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiPhoneLine /> 연락처</span>
                {isEditing ? (
                  <input
                    type="tel"
                    className="form-input"
                    value={editData.phone}
                    onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ maxWidth: 240 }}
                  />
                ) : (
                  <span className="detail-value">{profileData.phone}</span>
                )}
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiShieldUserLine /> 권한</span>
                <span className="detail-value">
                  <span className="badge badge-primary">{profileData.role}</span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><RiCalendarLine /> 가입일</span>
                <span className="detail-value">{profileData.joinedAt}</span>
              </div>
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-color)' }}>
              <h4 style={{ marginBottom: 16 }}>보안 설정</h4>
              <button
                className="btn btn-secondary"
                onClick={() => setPasswordModal(true)}
              >
                <RiLockPasswordLine /> 비밀번호 변경
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 활동 기록 */}
      <div className="card mt-3">
        <div className="card-header">
          <h3 className="card-title">최근 활동 기록</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>활동</th>
                <th>상세</th>
                <th>일시</th>
                <th>IP 주소</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="badge badge-primary">로그인</span></td>
                <td>관리자 페이지 로그인</td>
                <td>2024-12-18 09:30:25</td>
                <td>192.168.1.100</td>
              </tr>
              <tr>
                <td><span className="badge badge-success">회원승인</span></td>
                <td>스카이트래블 기업회원 승인</td>
                <td>2024-12-17 16:45:12</td>
                <td>192.168.1.100</td>
              </tr>
              <tr>
                <td><span className="badge badge-warning">설정변경</span></td>
                <td>알림 설정 변경</td>
                <td>2024-12-17 14:22:08</td>
                <td>192.168.1.100</td>
              </tr>
              <tr>
                <td><span className="badge badge-danger">신고처리</span></td>
                <td>여행톡 게시글 신고 처리</td>
                <td>2024-12-17 11:15:33</td>
                <td>192.168.1.100</td>
              </tr>
              <tr>
                <td><span className="badge badge-primary">로그인</span></td>
                <td>관리자 페이지 로그인</td>
                <td>2024-12-17 09:05:18</td>
                <td>192.168.1.100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 비밀번호 변경 모달 */}
      <Modal
        isOpen={passwordModal}
        onClose={() => {
          setPasswordModal(false);
          setPasswordData({ current: '', new: '', confirm: '' });
        }}
        title="비밀번호 변경"
        size="medium"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setPasswordModal(false);
                setPasswordData({ current: '', new: '', confirm: '' });
              }}
            >
              취소
            </button>
            <button className="btn btn-primary" onClick={handlePasswordChange}>
              변경
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">현재 비밀번호</label>
          <input
            type="password"
            className="form-input"
            value={passwordData.current}
            onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
            placeholder="현재 비밀번호 입력"
          />
        </div>
        <div className="form-group">
          <label className="form-label">새 비밀번호</label>
          <input
            type="password"
            className="form-input"
            value={passwordData.new}
            onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
            placeholder="새 비밀번호 입력 (8자 이상)"
          />
        </div>
        <div className="form-group">
          <label className="form-label">새 비밀번호 확인</label>
          <input
            type="password"
            className="form-input"
            value={passwordData.confirm}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
            placeholder="새 비밀번호 다시 입력"
          />
        </div>
      </Modal>
    </div>
  );
}

export default Profile;
