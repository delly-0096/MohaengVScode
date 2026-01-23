import { useState,useEffect, useRef } from 'react';
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

import api from '../../api/api';

//const API_BASE = 'http://localhost:8272/api/admin/members/general';

const statusLabels = {
  ACTIVE: { label: '정상', className: 'badge-success' },
  DORMANT: { label: '휴면', className: 'badge-gray' },
  PAUSED: { label: '정지', className: 'badge-gray' },
};

const genderLabels = {
  M: '남성',
  F: '여성',
  '': '미선택'
};

// 간단한 Modal 컴포넌트 (내장)
function Modal({ isOpen, onClose, title, children, size = 'medium', footer }) {
     useEffect(() => {
        const handleEsc = (e) => {if(e.key ==='Escape') onClose(); };
        if(isOpen){
            document.addEventListener('keydown',handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return()=>{
           document.removeEventListener('keydown',handleEsc);
           document.body.style.overflow='unset';
        }
     },[ isOpen, onClose]);

     if(!isOpen) return null;

     const sizeClass = { small: 'modal-small', medium: 'modal-medium', large: 'modal-large' }[size] || 'modal-medium';

     return(
       <div className="modal-overlay" onClick={onClose}> 
          <div className={`modal-container ${sizeClass}`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
             <h2 className="modal-title">{title}</h2>
             <button className="modal-close" onClick={onClose}>×</button>           
            </div>
            <div className="modal-body">{children}</div>
            {footer &&<div className="modal-footer">{footer}</div>}
          </div>
       </div>
     );
}

function GeneralMembers() {
  const [membersData, setMembersData] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPage: 1, totalRecord: 0 });
  const [searchWord, setSearchWord] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [statusCodes, setStatusCodes] = useState([]); //혹시 탈퇴 등 서버로부터 추가로 받을 수 있으니 넣은 것임.
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isIdChecked, setIsIdChecked] = useState(false);

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, member: null });
  const [editModal, setEditModal] = useState({ isOpen: false, member: null });
  const [passwordModal, setPasswordModal] = useState({ isOpen: false, member: null });
  const [registerModal, setRegisterModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [registerForm, setRegisterForm] = useState({
        memId: ''
      , memPassword: ''
      , passwordConfirm: ''
      , memName: ''
      , memEmail: ''
      , memStatus: 'ACTIVE'
      , memUser: { nickname: '', tel: '', birthDate: '', gender: '', zip: '', addr1: '', addr2: '' }
      , alarmConfig: { rsvtAlarmYn: 'Y', schdAlarmYn: 'Y', commAlarmYn: 'Y', pntAlarmYn: 'N', qnaAlarmYn: 'Y' }
      , termsAgree: { useTermYn: 'Y', privacyPolicyYn: 'Y', locationTermYn: 'N', marketingYn: 'N' }
      , marketingConsent: { emailConsentYn: 'N', smsConsentYn: 'N', pushConsentYn: 'N' }
  });
  const fileInputRef = useRef(null);
  const registerFileInputRef = useRef(null);

  //함수 선언먼저 해야 해!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const fetchSetupData = async () => {
    try {
      const response = await api.get('/admin/members/general/setup');
      setStatusCodes(response.data.statusCodes || []);
    } catch (err) {
      console.error('설정 데이터 로드 실패', err);
    }
  };
  
  const fetchMembers = async (page) => {
     try {
      const response = await api.get('/admin/members/general', {
        params: {
          currentPage: page,
          searchWord: searchWord,
          searchType: searchType
        }
      });
      setMembersData(response.data.dataList || []);
      setPagination({ 
        currentPage: response.data.currentPage, 
        totalPage: response.data.totalPage, 
        totalRecord: response.data.totalRecord 
      });  
      } catch (err) {
      console.error('회원 목록 조회 실패', err);
    }
  }; 

  useEffect(() => {
    fetchSetupData();
    fetchMembers(1);
  }, []);

  const handleSearch = () => fetchMembers(1);

  //엑셀 다운로드(토큰 자동 포함)
  const handleExcelDownload = async () => {
    try {
      const response = await api.get('/admin/members/general/excel', {
          params: {
          searchWord: searchWord,
          searchType: searchType
        },
        responseType: 'blob'  // ← 파일 다운로드용(덩어리 형태의 데이터)
      });

      // 다운로드 처리
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download',`회원목록_${new Date().toISOString().split('T')[0]}.xlsx`)
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("엑셀 다운로드 실패")
      console.error(error);
    }
  };

  const handleViewDetail = async (member) => {
    try {
        const response = await api.get(`/admin/members/general/${member.memNo}`);
        setDetailModal({ isOpen: true, member: response.data });
    } catch (error) {
         alert('상세 정보 조회 실패');
         console.error(error);
    }
  };

  const handleEdit = async (member) => {
    try {
        const response = await api.get(`/admin/members/general/${member.memNo}`);
        setEditForm(response.data);
        setEditModal({ isOpen: true, member: response.data });
    } catch (error) {
        alert('회원 정보 조회 실패');
        console.error(error);
    }
  };

  const handleEditSubmit = async () => {
    try {
        if (fileInputRef.current?.files?.[0]) {
            const file = fileInputRef.current.files[0];
            const attachNo = await uploadProfileImage(file);
            editForm.memProfile = attachNo;
        }
        const response = await api.put(`/admin/members/general/${editForm.memNo}`, editForm);
        if (response.status === 200) {
           alert('회원 정보가 수정되었습니다.');
           setEditModal({ isOpen: false, member: null });
           fetchMembers(pagination.currentPage);
        } else {
           alert(response.data.message || '수정 실패'); 
        }
    } catch (error) {
        alert('수정 실패');
        console.error(error);
    }
  };
    
  const handlePasswordChange = (member) => {
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      setPasswordModal({ isOpen: true, member });
  };

  const handlePasswordSubmit = async () => {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
          alert('비밀번호가 일치하지 않습니다.');
          return;
      }
      try {
          const response = await api.put(`/admin/members/general/${passwordModal.member.memNo}/password`, {
              newPassword: passwordForm.newPassword
          });
          if (response.status === 200) {
              alert('비밀번호가 변경되었습니다.');
              setPasswordModal({ isOpen: false, member: null });
          } else {
              alert(response.data.message || '비밀번호 변경 실패');
          }
      } catch (error) {
        alert('비밀번호 변경 실패');
        console.error(error);
      }
  };

  // 아이디 중복 확인
const handleIdCheck = async () => {
  if (!registerForm.memId) {
    alert('아이디를 입력해주세요.');
    return;
  }
  
  // 아이디 형식 검증
  const idPattern = /^[a-zA-Z0-9]{4,20}$/;
  if (!idPattern.test(registerForm.memId)) {
    setValidationErrors(prev => ({...prev, memId: '아이디는 영문, 숫자 조합 4~20자여야 합니다.'}));
    return;
  }
  
  try {
    const response = await api.get('/admin/members/general/check-id', {
      params: { memId: registerForm.memId }
    });
    console.log("서버의 대답:", response.data);
    if (response.data.isDuplicate === false) {
      alert('사용 가능한 아이디입니다.');
      setIsIdChecked(true);
      setValidationErrors(prev => ({...prev, memId: ''}));
    } else {
      setValidationErrors(prev => ({...prev, memId: '이미 사용 중인 아이디입니다.'}));
      setIsIdChecked(false);
    }
  } catch (error) {
    alert('아이디 중복 확인 실패');
    console.error(error);
  }
};
// 입력값 변경 시 검증
const handleRegisterFormChange = (field, value) => {
  const newForm = { ...registerForm, [field]: value };
  setRegisterForm(newForm);
  
  // 아이디 변경 시 중복확인 초기화
  if (field === 'memId') {
    setIsIdChecked(false);
  }
  
  // 실시간 검증
  validateField(field, value);
};

// 필드별 유효성 검증
const validateField = (field, value) => {
  const errors = { ...validationErrors };
  
  switch(field) {
    case 'memId':
      const idPattern = /^[a-zA-Z0-9]{4,20}$/;
      if (!value) {
        errors.memId = '아이디를 입력해주세요.';
      } else if (!idPattern.test(value)) {
        errors.memId = '영문, 숫자 조합 4~20자여야 합니다.';
      } else {
        errors.memId = '';
      }
      break;
      
    case 'memPassword':
     // 💡 수정된 정규식: 대문자 필수(?=.*[A-Z])를 빼고 영문(대/소문자 상관없음), 숫자, 특수문자 조합
    const pwPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!value) {
        errors.memPassword = '비밀번호를 입력해주세요.';
      } else if (!pwPattern.test(value)) {
        errors.memPassword = '영문(대문자 포함), 숫자, 특수문자 포함 8자 이상이어야 합니다.';
      } else {
        // 'success:' 꼬리표가 붙어야 화면에서 초록색으로 변합니다!
        errors.memPassword = 'success:사용 가능한 비밀번호입니다.';
      }
      break;
      
    case 'passwordConfirm':
      if (value !== registerForm.memPassword) {
        errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
      } else {
        errors.passwordConfirm = '';
      }
      break;
      
    case 'memName':
      if (!value) {
        errors.memName = '이름을 입력해주세요.';
      } else {
        errors.memName = '';
      }
      break;
      
    case 'memEmail':
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errors.memEmail = '이메일을 입력해주세요.';
      } else if (!emailPattern.test(value)) {
        errors.memEmail = '올바른 이메일 형식이 아닙니다.';
      } else {
        errors.memEmail = '';
      }
      break;
  }
  
  setValidationErrors(errors);
};

// 중첩 객체 필드 검증
const handleNestedFormChange = (parent, field, value) => {
  const newForm = {
    ...registerForm,
    [parent]: { ...registerForm[parent], [field]: value }
  };
  setRegisterForm(newForm);
  
  // 닉네임 검증
  if (parent === 'memUser' && field === 'nickname') {
    const errors = { ...validationErrors };
    if (!value) {
      errors.nickname = '닉네임을 입력해주세요.';
    } else if (value.length < 2 || value.length > 10) {
      errors.nickname = '닉네임은 2~10자 이내여야 합니다.';
    } else {
      errors.nickname = '';
    }
    setValidationErrors(errors);
  }
  
  // 전화번호 검증
  if (parent === 'memUser' && field === 'tel') {
    const errors = { ...validationErrors };
    const cleanTel = value.replace(/[^0-9]/g, '');
    if (!cleanTel) {
      errors.tel = '연락처를 입력해주세요.';
    } else if (cleanTel.length !== 11) {
      errors.tel = '11자리 숫자를 입력해주세요.';
    } else {
      errors.tel = '';
    }
    setValidationErrors(errors);
  }
};

  const handleRegisterSubmit = async () => {
  // 필수 필드 검증
  const errors = {};
  
  //1. 아이디 검증
  if (!registerForm.memId) {
    errors.memId = '아이디를 입력해주세요.';
  } else if (!/^[a-zA-Z0-9]{4,20}$/.test(registerForm.memId)) {
    errors.memId = '영문, 숫자 조합 4~20자여야 합니다.';
  } else if (!isIdChecked) {
    errors.memId = '아이디 중복 확인을 해주세요.';
  }
  
  //2.비밀번호 검증
  const pwPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!registerForm.memPassword) {
    errors.memPassword = '비밀번호를 입력해주세요.';
  } else if (!pwPattern.test(registerForm.memPassword)) {
    errors.memPassword = '영문(대문자 포함), 숫자, 특수문자 포함 8자 이상이어야 합니다.';
  }
  
  if (registerForm.memPassword !== registerForm.passwordConfirm) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
  }
  
  if (!registerForm.memName) {
    errors.memName = '이름을 입력해주세요.';
  }
  
  if (!registerForm.memUser.nickname) {
    errors.nickname = '닉네임을 입력해주세요.';
  } else if (registerForm.memUser.nickname.length < 2 || registerForm.memUser.nickname.length > 10) {
    errors.nickname = '닉네임은 2~10자 이내여야 합니다.';
  }
  
  if (!registerForm.memEmail) {
    errors.memEmail = '이메일을 입력해주세요.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.memEmail)) {
    errors.memEmail = '올바른 이메일 형식이 아닙니다.';
  }
  
  if (!registerForm.memUser.tel) {
    errors.tel = '연락처를 입력해주세요.';
  } else if (registerForm.memUser.tel.length !== 11) {
    errors.tel = '11자리 숫자를 입력해주세요.';
  }
  
  // 에러가 있으면 첫 번째 에러로 포커스 이동
  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    
    // 첫 번째 에러 필드로 스크롤
    const firstErrorField = Object.keys(errors)[0];
    const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      errorElement.focus();
    }
    return;
  }

  // ⭐ 여기서부터 실제 등록 로직 (통합!)

  try {

    // 서버로 보낼 데이터 준비 (불필요한 필드 제거!)
    const submitData = {
      memId: registerForm.memId,
      memPassword: registerForm.memPassword,
      memName: registerForm.memName,
      memEmail: registerForm.memEmail,
      memStatus: registerForm.memStatus,
      memUser: registerForm.memUser,
      alarmConfig: registerForm.alarmConfig,
      termsAgree: registerForm.termsAgree,
      marketingConsent: registerForm.marketingConsent
    };

    // 프로필 이미지가 있으면 추가
    if (registerFileInputRef.current?.files?.[0]) {
      const file = registerFileInputRef.current.files[0];
      const attachNo = await uploadProfileImage(file);
      submitData.memProfile = attachNo;
    }

    console.log('전송할 데이터:', submitData); // 디버깅용

    const response = await api.post('/admin/members/general', registerForm);

    if (response.status === 200 || response.status ===201) {
      alert('회원이 등록되었습니다.');
      setRegisterModal(false);

      //폼 초기화
      setRegisterForm({
        memId: '', memPassword: '', passwordConfirm: '', memName: '', memEmail: '', memStatus: 'ACTIVE',
        memUser: { nickname: '', tel: '', birthDate: '', gender: '', zip: '', addr1: '', addr2: '' },
        alarmConfig: { rsvtAlarmYn: 'Y', schdAlarmYn: 'Y', commAlarmYn: 'Y', pntAlarmYn: 'N', qnaAlarmYn: 'Y' },
        termsAgree: { useTermYn: 'Y', privacyPolicyYn: 'Y', locationTermYn: 'N', marketingYn: 'N' },
        marketingConsent: { emailConsentYn: 'N', smsConsentYn: 'N', pushConsentYn: 'N' }
      });
      setValidationErrors({});
      setIsIdChecked(false);
      //목록 새로고침
      fetchMembers(1); 
    }
  } catch (error) {
    console.error('등록 실패:', error);
    console.error('에러 상세:', error.response?.data); // 서버 에러 메시지 확인
    const msg = error.response?.data?.message || '등록 중 오류가 발생했습니다.';
    alert(msg);
  }
};

  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/admin/members/general/profile/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data.attachNo;
  }


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
    
  const handleRemoveImage = () => {
      setEditForm(prev => ({ ...prev, profileImage: null }));
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

// -----------------------------------------------------------------------------
return (
    <div className="members-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">일반회원 관리</h1>
          <p className="page-subtitle">총 {pagination.totalRecord}명의 일반회원이 있습니다.</p>
        </div>
       <div className="page-header-actions">
          <button className="btn btn-outline" onClick={handleExcelDownload}>엑셀 다운로드</button>
          <button className="btn btn-primary" onClick={() => setRegisterModal(true)}>회원 등록</button>
        </div>
      </div>

      <div className="card">
        <div className="filter-bar">
          <div className="search-bar">
            <span className="search-bar-icon">🔍</span>
            <input type="text" className="form-input" placeholder="검색" value={searchWord} 
                   onChange={(e) => setSearchWord(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
          </div>

          <div className="filter-group">
            <select className="form-input form-select" value={searchType} onChange={(e) => setSearchType(e.target.value)} style={{ width: 'auto' }}>
              <option value="all">전체 상태</option>
              <option value="ACTIVE">정상</option>
              <option value="DORMANT">휴면</option>
              <option value="PAUSED">일시정지</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
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
              {membersData.map((m) => (
                <tr key={m.memNo}>
                  <td>
                    <div className="member-info">
                    <div className="avatar">
                        {m.memProfile ? (
                        <img 
                            src={`/file/searchthumbnail?path=${m.memProfilePath}`} 
                            alt={m.memName} 
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                        ) : (
                        m.memName?.charAt(0)
                        )}
                    </div>
                    <div>
                        <div className="member-name">{m.memName}</div>
                        <div className="member-email">{m.memEmail}</div>
                    </div>
                    </div>
                  </td>
                  <td>{m.memId}</td>
                  <td>{m.memUser?.nickname || '닉네임 없음'}</td>
                  <td>{m.memUser?.tel || '전화번호 없음'}</td>
                  <td>{m.regDt?.split('T')[0]}</td>
                  <td>
                    <span className={`badge ${statusLabels[m.memStatus]?.className || 'badge-gray'}`}>
                      {statusLabels[m.memStatus]?.label || m.memStatusName}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="table-action-btn" title="상세보기" onClick={() => handleViewDetail(m)}>
                        <RiEyeLine />
                      </button>
                      <button className="table-action-btn edit" title="수정" onClick={() => handleEdit(m)}>
                        <RiEditLine />
                      </button>                    
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <div className="pagination">
            <button className="pagination-btn" disabled={pagination.currentPage === 1} onClick={() => fetchMembers(pagination.currentPage - 1)}>&lt;</button>
            {pagination.totalPage > 0 && [...Array(Math.min(pagination.totalPage, 5))].map((_, i) => (
                <button key={i} className={`pagination-btn ${pagination.currentPage === i + 1 ? 'active' : ''}`} onClick={() => fetchMembers(i + 1)}>{i + 1}</button>
            ))}
            <button className="pagination-btn" disabled={pagination.currentPage === pagination.totalPage} onClick={() => fetchMembers(pagination.currentPage + 1)}>&gt;</button>
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
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div className="avatar" style={{ width: 80, height: 80, fontSize: '2rem', margin: '0 auto 12px' }}>
                {detailModal.member.memProfile ? (
                  <img src={`/file/searchthumbnail?path=${detailModal.member.memProfilePath}`} alt={detailModal.member.memName}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  detailModal.member.memName?.charAt(0)
                )}
              </div>
              <h3 style={{ marginBottom: 4 }}>{detailModal.member.memName}</h3>
              <span className={`badge ${statusLabels[detailModal.member.memStatus]?.className}`}>
                {statusLabels[detailModal.member.memStatus]?.label}
              </span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>기본 정보</h4>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">아이디</span>
                  <span className="detail-value">{detailModal.member.memId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">이름</span>
                  <span className="detail-value">{detailModal.member.memName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">닉네임</span>
                  <span className="detail-value">{detailModal.member.memUser?.nickname}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">이메일</span>
                  <span className="detail-value">{detailModal.member.memEmail}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">연락처</span>
                  <span className="detail-value">{detailModal.member.memUser?.tel}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">생년월일</span>
                  <span className="detail-value">{detailModal.member.memUser?.birthDate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">성별</span>
                  <span className="detail-value">{genderLabels[detailModal.member.memUser?.gender] || '미선택'}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>주소 정보</h4>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">우편번호</span>
                  <span className="detail-value">{detailModal.member.memUser?.zip}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">기본주소</span>
                  <span className="detail-value">{detailModal.member.memUser?.addr1}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">상세주소</span>
                  <span className="detail-value">{detailModal.member.memUser?.addr2}</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>활동 정보</h4>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">가입일</span>
                  <span className="detail-value">{detailModal.member.regDt?.split('T')[0]}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">계정 상태</span>
                  <span className="detail-value">
                    <span className={`badge ${statusLabels[detailModal.member.memStatus]?.className}`}>
                      {statusLabels[detailModal.member.memStatus]?.label}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
                <RiNotification3Line style={{ marginRight: 6, verticalAlign: 'middle' }} />
                알림 설정
              </h4>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">예약 확정/취소 알림</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.alarmConfig?.rsvtAlarmYn === 'Y' ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.alarmConfig?.rsvtAlarmYn === 'Y' ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">여행 일정 리마인드 알림</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.alarmConfig?.schdAlarmYn === 'Y' ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.alarmConfig?.schdAlarmYn === 'Y' ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">커뮤니티 댓글/답글 알림</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.alarmConfig?.commAlarmYn === 'Y' ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.alarmConfig?.commAlarmYn === 'Y' ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">포인트 적립/사용 알림</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.alarmConfig?.pntAlarmYn === 'Y' ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.alarmConfig?.pntAlarmYn === 'Y' ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">문의 답변 알림</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.alarmConfig?.qnaAlarmYn === 'Y' ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.alarmConfig?.qnaAlarmYn === 'Y' ? '수신' : '거부'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
                <RiMegaphoneLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
                마케팅 수신 동의
              </h4>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">이메일 수신</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.marketingConsent?.emailConsentYn === 'Y' ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.marketingConsent?.emailConsentYn === 'Y' ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">SMS 수신</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.marketingConsent?.smsConsentYn === 'Y' ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.marketingConsent?.smsConsentYn === 'Y' ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">푸시 알림 수신</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.marketingConsent?.pushConsentYn === 'Y' ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.marketingConsent?.pushConsentYn === 'Y' ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>약관 동의</h4>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label">이용약관 동의</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.termsAgree?.useTermYn === 'Y' ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.termsAgree?.useTermYn === 'Y' ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">개인정보처리방침 동의</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.termsAgree?.privacyPolicyYn === 'Y' ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.termsAgree?.privacyPolicyYn === 'Y' ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">위치기반서비스 동의</span>
                  <span className="detail-value">
                    <span className={`badge ${detailModal.member.termsAgree?.locationTermYn === 'Y' ? 'badge-success' : 'badge-gray'}`}>
                      {detailModal.member.termsAgree?.locationTermYn === 'Y' ? '동의' : '거부'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
              <button className="btn btn-outline" style={{ width: '100%' }}
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
            <div className="form-group" style={{ textAlign: 'center', marginBottom: 24 }}>
              <label className="form-label" style={{ textAlign: 'left' }}>프로필 이미지</label>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div className="avatar" style={{ width: 100, height: 100, fontSize: '2.5rem', margin: '0 auto', cursor: 'pointer', position: 'relative' }}
                  onClick={() => fileInputRef.current?.click()}>
                  {editForm.profileImage ? (
                    <img src={editForm.profileImage} alt={editForm.memName}
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    editForm.memName?.charAt(0)
                  )}
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }} className="avatar-overlay">
                    <RiCameraLine size={24} color="white" />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageChange} />
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => fileInputRef.current?.click()}>
                  <RiImageLine /> 이미지 변경
                </button>
                {editForm.profileImage && (
                  <button type="button" className="btn btn-sm btn-outline" onClick={handleRemoveImage}>삭제</button>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>기본 정보</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">아이디 (변경불가)</label>
                  <input type="text" className="form-input" value={editForm.memId || ''} disabled style={{ backgroundColor: '#f3f4f6' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">이름 *</label>
                  <input type="text" className="form-input" value={editForm.memName || ''}
                    onChange={(e) => setEditForm({ ...editForm, memName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">닉네임 *</label>
                  <input type="text" className="form-input" value={editForm.memUser?.nickname || ''}
                    onChange={(e) => setEditForm({ ...editForm, memUser: { ...editForm.memUser, nickname: e.target.value } })} />
                </div>
                <div className="form-group">
                  <label className="form-label">이메일 *</label>
                  <input type="email" className="form-input" value={editForm.memEmail || ''}
                    onChange={(e) => setEditForm({ ...editForm, memEmail: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">연락처 *</label>
                  <input type="text" className="form-input" value={editForm.memUser?.tel || ''}
                    onChange={(e) => setEditForm({ ...editForm, memUser: { ...editForm.memUser, tel: e.target.value.replace(/[^0-9]/g, '') } })}
                    placeholder="01012345678" maxLength={11} />
                </div>
                <div className="form-group">
                  <label className="form-label">생년월일 *</label>
                  <input type="date" className="form-input" value={editForm.memUser?.birthDate || ''}
                    onChange={(e) => setEditForm({ ...editForm, memUser: { ...editForm.memUser, birthDate: e.target.value } })} />
                </div>
                <div className="form-group">
                  <label className="form-label">성별</label>
                  <select className="form-input form-select" value={editForm.memUser?.gender || ''}
                    onChange={(e) => setEditForm({ ...editForm, memUser: { ...editForm.memUser, gender: e.target.value } })}>
                    <option value="">미선택</option>
                    <option value="M">남성</option>
                    <option value="F">여성</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">계정 상태</label>
                  <select className="form-input form-select" value={editForm.memStatus || ''}
                    onChange={(e) => setEditForm({ ...editForm, memStatus: e.target.value })}>
                    <option value="ACTIVE">정상</option>
                    <option value="DORMANT">휴면</option>
                    <option value="PAUSED">정지</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>주소 정보</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">우편번호</label>
                  <input type="text" className="form-input" value={editForm.memUser?.zip || ''}
                    onChange={(e) => setEditForm({ ...editForm, memUser: { ...editForm.memUser, zip: e.target.value } })}
                    placeholder="우편번호" />
                </div>
                <div className="form-group">
                  <label className="form-label">기본주소</label>
                  <input type="text" className="form-input" value={editForm.memUser?.addr1 || ''}
                    onChange={(e) => setEditForm({ ...editForm, memUser: { ...editForm.memUser, addr1: e.target.value } })}
                    placeholder="기본주소" />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 12 }}>
                <label className="form-label">상세주소</label>
                <input type="text" className="form-input" value={editForm.memUser?.addr2 || ''}
                  onChange={(e) => setEditForm({ ...editForm, memUser: { ...editForm.memUser, addr2: e.target.value } })}
                  placeholder="상세주소" />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
                <RiNotification3Line style={{ marginRight: 6, verticalAlign: 'middle' }} />
                알림 설정
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editForm.alarmConfig?.rsvtAlarmYn === 'Y'}
                    onChange={(e) => setEditForm({ ...editForm, alarmConfig: { ...editForm.alarmConfig, rsvtAlarmYn: e.target.checked ? 'Y' : 'N' } })} />
                  예약 확정/취소 알림
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editForm.alarmConfig?.schdAlarmYn === 'Y'}
                    onChange={(e) => setEditForm({ ...editForm, alarmConfig: { ...editForm.alarmConfig, schdAlarmYn: e.target.checked ? 'Y' : 'N' } })} />
                  여행 일정 리마인드 알림
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editForm.alarmConfig?.commAlarmYn === 'Y'}
                    onChange={(e) => setEditForm({ ...editForm, alarmConfig: { ...editForm.alarmConfig, commAlarmYn: e.target.checked ? 'Y' : 'N' } })} />
                  커뮤니티 댓글/답글 알림
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editForm.alarmConfig?.pntAlarmYn === 'Y'}
                    onChange={(e) => setEditForm({ ...editForm, alarmConfig: { ...editForm.alarmConfig, pntAlarmYn: e.target.checked ? 'Y' : 'N' } })} />
                  포인트 적립/사용 알림
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editForm.alarmConfig?.qnaAlarmYn === 'Y'}
                    onChange={(e) => setEditForm({ ...editForm, alarmConfig: { ...editForm.alarmConfig, qnaAlarmYn: e.target.checked ? 'Y' : 'N' } })} />
                  문의 답변 알림
                </label>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
                <RiMegaphoneLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
                마케팅 수신 동의
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editForm.marketingConsent?.emailConsentYn === 'Y'}
                    onChange={(e) => setEditForm({ ...editForm, marketingConsent: { ...editForm.marketingConsent, emailConsentYn: e.target.checked ? 'Y' : 'N' } })} />
                  이메일 수신 동의
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editForm.marketingConsent?.smsConsentYn === 'Y'}
                    onChange={(e) => setEditForm({ ...editForm, marketingConsent: { ...editForm.marketingConsent, smsConsentYn: e.target.checked ? 'Y' : 'N' } })} />
                  SMS 수신 동의
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editForm.marketingConsent?.pushConsentYn === 'Y'}
                    onChange={(e) => setEditForm({ ...editForm, marketingConsent: { ...editForm.marketingConsent, pushConsentYn: e.target.checked ? 'Y' : 'N' } })} />
                  푸시 알림 수신 동의
                </label>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>약관 동의</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editForm.termsAgree?.useTermYn === 'Y'}
                    onChange={(e) => setEditForm({ ...editForm, termsAgree: { ...editForm.termsAgree, useTermYn: e.target.checked ? 'Y' : 'N' } })} />
                  이용약관 동의 (필수)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editForm.termsAgree?.privacyPolicyYn === 'Y'}
                    onChange={(e) => setEditForm({ ...editForm, termsAgree: { ...editForm.termsAgree, privacyPolicyYn: e.target.checked ? 'Y' : 'N' } })} />
                  개인정보처리방침 동의 (필수)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={editForm.termsAgree?.locationTermYn === 'Y'}
                    onChange={(e) => setEditForm({ ...editForm, termsAgree: { ...editForm.termsAgree, locationTermYn: e.target.checked ? 'Y' : 'N' } })} />
                  위치기반서비스 동의 (선택)
                </label>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>비밀번호 관리</h4>
              <button type="button" className="btn btn-outline"
                onClick={() => {
                  setEditModal({ isOpen: false, member: null });
                  handlePasswordChange(editForm);
                }}>
                <RiLockLine style={{ marginRight: 8 }} />
                비밀번호 변경
              </button>
            </div>
          </div>
        )}
      </Modal>

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
              <div style={{ fontWeight: 600 }}>{passwordModal.member.memName} ({passwordModal.member.memId})</div>
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">새 비밀번호 *</label>
              <input type="password" className="form-input" value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="8자 이상 입력" />
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 4 }}>
                영문(대문자 포함), 숫자, 특수문자 포함 8자 이상
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">비밀번호 확인 *</label>
              <input type="password" className="form-input" value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="비밀번호 다시 입력" />
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
          <div className="form-group" style={{ textAlign: 'center', marginBottom: 24 }}>
            <label className="form-label" style={{ textAlign: 'left' }}>프로필 이미지</label>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div className="avatar" style={{ width: 100, height: 100, fontSize: '2.5rem', margin: '0 auto', cursor: 'pointer', position: 'relative' }}
                onClick={() => registerFileInputRef.current?.click()}>
                {registerForm.profileImage ? (
                  <img src={registerForm.profileImage} alt="프로필"
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <RiUserLine size={40} />
                )}
              </div>
              <input type="file" ref={registerFileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleRegisterImageChange} />
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button type="button" className="btn btn-sm btn-secondary" onClick={() => registerFileInputRef.current?.click()}>
                <RiImageLine /> 이미지 선택
              </button>
              {registerForm.profileImage && (
                <button type="button" className="btn btn-sm btn-outline" onClick={() => setRegisterForm(prev => ({ ...prev, profileImage: null }))}>
                  삭제
                </button>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
              <RiLockLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
              계정 정보
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">
                  아이디 <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    name="memId"
                    value={registerForm.memId}
                    onChange={(e) => handleRegisterFormChange('memId', e.target.value)}
                    placeholder="영문, 숫자 4~20자"
                  />
                  <button 
                    type="button" 
                    className="btn btn-sm btn-secondary"
                    onClick={handleIdCheck}
                    style={{ minWidth: '100px' }}
                  >
                    중복확인
                  </button>
                </div>
                {validationErrors.memId && (
                  <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>
                    {validationErrors.memId}
                  </div>
                )}
                {isIdChecked && !validationErrors.memId && (
                  <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>
                    ✓ 사용 가능한 아이디입니다
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">계정 상태</label>
                <select className="form-input form-select" value={registerForm.memStatus}
                  onChange={(e) => setRegisterForm({ ...registerForm, memStatus: e.target.value })}>
                  <option value="ACTIVE">정상</option>
                  <option value="DORMANT">휴면</option>
                  <option value="PAUSED">정지</option>
                </select>
              </div>
              {/* 비밀번호 등록 */}
              <div className="form-group">
                <label className="form-label">
                  비밀번호 <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="password" 
                  className="form-input" 
                  name="memPassword"
                  value={registerForm.memPassword}
                  onChange={(e) => handleRegisterFormChange('memPassword', e.target.value)}
                  placeholder="영문(대문자 포함), 숫자, 특수문자 포함 8자 이상"
                />
                {validationErrors.memPassword && (
                  <div style={{ 
                    fontSize: '0.75rem', 
                    // success: 가 포함되어 있으면 초록색(#10b981), 아니면 빨간색(#ef4444)
                    color: validationErrors.memPassword.includes('success') ? '#10b981' : '#ef4444', 
                    marginTop: '4px' 
                  }}>
                    {/* 화면에는 'success:' 글자를 떼고 예쁘게 보여줘요 */}
                    {validationErrors.memPassword.includes('success') 
                      ? '✓ ' + validationErrors.memPassword.replace('success:', '') 
                      : '⚠️ ' + validationErrors.memPassword}
                  </div>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div className="form-group">
                <label className="form-label">
                  비밀번호 확인 <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="password" 
                  className="form-input" 
                  name="passwordConfirm"
                  value={registerForm.passwordConfirm}
                  onChange={(e) => handleRegisterFormChange('passwordConfirm', e.target.value)}
                  placeholder="비밀번호 다시 입력"
                />
                {validationErrors.passwordConfirm && (
                  <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>
                    {validationErrors.passwordConfirm}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
              <RiUserLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
              기본 정보
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* 이름 */}
              <div className="form-group">
                <label className="form-label">
                  이름 <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="memName"
                  value={registerForm.memName}
                  onChange={(e) => handleRegisterFormChange('memName', e.target.value)}
                />
                {validationErrors.memName && (
                  <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>
                    {validationErrors.memName}
                  </div>
                )}
              </div>

              {/* 닉네임 */}
              <div className="form-group">
                <label className="form-label">
                  닉네임 <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="nickname"
                  value={registerForm.memUser.nickname}
                  onChange={(e) => handleNestedFormChange('memUser', 'nickname', e.target.value)}
                  placeholder="2~10자 이내"
                />
                {validationErrors.nickname && (
                  <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>
                    {validationErrors.nickname}
                  </div>
                )}
              </div>

              {/* 이메일 */}
              <div className="form-group">
                <label className="form-label">
                  이메일 <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="email" 
                  className="form-input" 
                  name="memEmail"
                  value={registerForm.memEmail}
                  onChange={(e) => handleRegisterFormChange('memEmail', e.target.value)}
                />
                {validationErrors.memEmail && (
                  <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>
                    {validationErrors.memEmail}
                  </div>
                )}
              </div>

              {/* 연락처 */}
              <div className="form-group">
                <label className="form-label">
                  연락처 <span style={{ color: 'red' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  name="tel"
                  value={registerForm.memUser.tel}
                  onChange={(e) => handleNestedFormChange('memUser', 'tel', e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="01012345678"
                  maxLength={11}
                />
                {validationErrors.tel && (
                  <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>
                    {validationErrors.tel}
                  </div>
                )}
              </div>  
              <div className="form-group">
                <label className="form-label">생년월일</label>
                <input type="date" className="form-input" value={registerForm.memUser.birthDate}
                  onChange={(e) => setRegisterForm({ ...registerForm, memUser: { ...registerForm.memUser, birthDate: e.target.value } })} />
              </div>
              <div className="form-group">
                <label className="form-label">성별</label>
                <select className="form-input form-select" value={registerForm.memUser.gender}
                  onChange={(e) => setRegisterForm({ ...registerForm, memUser: { ...registerForm.memUser, gender: e.target.value } })}>
                  <option value="">미선택</option>
                  <option value="M">남성</option>
                  <option value="F">여성</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
              <RiMapPinLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
              주소 정보
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">우편번호</label>
                <input type="text" className="form-input" value={registerForm.memUser.zip}
                  onChange={(e) => setRegisterForm({ ...registerForm, memUser: { ...registerForm.memUser, zip: e.target.value } })}
                  placeholder="우편번호" />
              </div>
              <div className="form-group">
                <label className="form-label">기본주소</label>
                <input type="text" className="form-input" value={registerForm.memUser.addr1}
                  onChange={(e) => setRegisterForm({ ...registerForm, memUser: { ...registerForm.memUser, addr1: e.target.value } })}
                  placeholder="기본주소" />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label className="form-label">상세주소</label>
              <input type="text" className="form-input" value={registerForm.memUser.addr2}
                onChange={(e) => setRegisterForm({ ...registerForm, memUser: { ...registerForm.memUser, addr2: e.target.value } })}
                placeholder="상세주소" />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
              <RiNotification3Line style={{ marginRight: 6, verticalAlign: 'middle' }} />
              알림 설정
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={registerForm.alarmConfig.rsvtAlarmYn === 'Y'}
                  onChange={(e) => setRegisterForm({ ...registerForm, alarmConfig: { ...registerForm.alarmConfig, rsvtAlarmYn: e.target.checked ? 'Y' : 'N' } })} />
                예약 확정/취소 알림
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={registerForm.alarmConfig.schdAlarmYn === 'Y'}
                  onChange={(e) => setRegisterForm({ ...registerForm, alarmConfig: { ...registerForm.alarmConfig, schdAlarmYn: e.target.checked ? 'Y' : 'N' } })} />
                여행 일정 리마인드 알림
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={registerForm.alarmConfig.commAlarmYn === 'Y'}
                  onChange={(e) => setRegisterForm({ ...registerForm, alarmConfig: { ...registerForm.alarmConfig, commAlarmYn: e.target.checked ? 'Y' : 'N' } })} />
                커뮤니티 댓글/답글 알림
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={registerForm.alarmConfig.pntAlarmYn === 'Y'}
                  onChange={(e) => setRegisterForm({ ...registerForm, alarmConfig: { ...registerForm.alarmConfig, pntAlarmYn: e.target.checked ? 'Y' : 'N' } })} />
                포인트 적립/사용 알림
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={registerForm.alarmConfig.qnaAlarmYn === 'Y'}
                  onChange={(e) => setRegisterForm({ ...registerForm, alarmConfig: { ...registerForm.alarmConfig, qnaAlarmYn: e.target.checked ? 'Y' : 'N' } })} />
                문의 답변 알림
              </label>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>
              <RiMegaphoneLine style={{ marginRight: 6, verticalAlign: 'middle' }} />
              마케팅 수신 동의
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={registerForm.marketingConsent.emailConsentYn === 'Y'}
                  onChange={(e) => setRegisterForm({ ...registerForm, marketingConsent: { ...registerForm.marketingConsent, emailConsentYn: e.target.checked ? 'Y' : 'N' } })} />
                이메일 수신 동의
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={registerForm.marketingConsent.smsConsentYn === 'Y'}
                  onChange={(e) => setRegisterForm({ ...registerForm, marketingConsent: { ...registerForm.marketingConsent, smsConsentYn: e.target.checked ? 'Y' : 'N' } })} />
                SMS 수신 동의
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={registerForm.marketingConsent.pushConsentYn === 'Y'}
                  onChange={(e) => setRegisterForm({ ...registerForm, marketingConsent: { ...registerForm.marketingConsent, pushConsentYn: e.target.checked ? 'Y' : 'N' } })} />
                푸시 알림 수신 동의
              </label>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12, color: '#374151', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 }}>약관 동의</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={registerForm.termsAgree.useTermYn === 'Y'}
                  onChange={(e) => setRegisterForm({ ...registerForm, termsAgree: { ...registerForm.termsAgree, useTermYn: e.target.checked ? 'Y' : 'N' } })} />
                이용약관 동의 (필수)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={registerForm.termsAgree.privacyPolicyYn === 'Y'}
                  onChange={(e) => setRegisterForm({ ...registerForm, termsAgree: { ...registerForm.termsAgree, privacyPolicyYn: e.target.checked ? 'Y' : 'N' } })} />
                개인정보처리방침 동의 (필수)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={registerForm.termsAgree.locationTermYn === 'Y'}
                  onChange={(e) => setRegisterForm({ ...registerForm, termsAgree: { ...registerForm.termsAgree, locationTermYn: e.target.checked ? 'Y' : 'N' } })} />
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