import { useState } from 'react';
import {
  RiBellLine,
  RiPaletteLine,
  RiShieldLine,
  RiGlobalLine,
  RiMailLine,
  RiSmartphoneLine,
  RiSunLine,
  RiMoonLine,
  RiCheckLine,
  RiInformationLine,
  RiLockLine,
  RiTimeLine,
  RiDatabaseLine
} from 'react-icons/ri';

function Settings() {
  // 알림 설정
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    newMember: true,
    newInquiry: true,
    newReport: true,
    refundRequest: true,
    settlement: false
  });

  // 테마 설정
  const [theme, setTheme] = useState('light');

  // 보안 설정
  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlert: true,
    sessionTimeout: '30'
  });

  // 시스템 설정
  const [system, setSystem] = useState({
    language: 'ko',
    timezone: 'Asia/Seoul',
    dateFormat: 'YYYY-MM-DD'
  });

  // 저장 처리
  const handleSave = () => {
    alert('설정이 저장되었습니다.');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">설정</h1>
          <p className="page-subtitle">시스템 환경을 설정합니다.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            <RiCheckLine /> 저장
          </button>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: 24 }}>
        {/* 알림 설정 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><RiBellLine /> 알림 설정</h3>
          </div>
          <div style={{ padding: '24px' }}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight: 500 }}><RiMailLine /> 이메일 알림</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>중요 알림을 이메일로 받습니다</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight: 500 }}><RiSmartphoneLine /> 푸시 알림</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>브라우저 푸시 알림을 받습니다</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <h4 style={{ marginTop: 24, marginBottom: 16 }}>알림 유형</h4>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>신규 회원 가입</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.newMember}
                    onChange={(e) => setNotifications(prev => ({ ...prev, newMember: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>새 문의 등록</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.newInquiry}
                    onChange={(e) => setNotifications(prev => ({ ...prev, newInquiry: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>신고 접수</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.newReport}
                    onChange={(e) => setNotifications(prev => ({ ...prev, newReport: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>환불 요청</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.refundRequest}
                    onChange={(e) => setNotifications(prev => ({ ...prev, refundRequest: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                <span>정산 완료</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={notifications.settlement}
                    onChange={(e) => setNotifications(prev => ({ ...prev, settlement: e.target.checked }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 테마 및 보안 설정 */}
        <div>
          {/* 테마 설정 */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <h3 className="card-title"><RiPaletteLine /> 테마 설정</h3>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <button
                  className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
                  onClick={() => setTheme('light')}
                >
                  <RiSunLine size={24} />
                  <span>라이트 모드</span>
                </button>
                <button
                  className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
                  onClick={() => setTheme('dark')}
                >
                  <RiMoonLine size={24} />
                  <span>다크 모드</span>
                </button>
              </div>
              <div className="alert alert-info mt-2" style={{ marginTop: 16 }}>
                <RiInformationLine />
                <span>다크 모드는 준비 중입니다.</span>
              </div>
            </div>
          </div>

          {/* 보안 설정 */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><RiShieldLine /> 보안 설정</h3>
            </div>
            <div style={{ padding: '24px' }}>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}><RiLockLine /> 2단계 인증</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>로그인 시 추가 인증을 요구합니다</div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={security.twoFactor}
                      onChange={(e) => setSecurity(prev => ({ ...prev, twoFactor: e.target.checked }))}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>로그인 알림</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>새로운 기기에서 로그인 시 알림을 받습니다</div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={security.loginAlert}
                      onChange={(e) => setSecurity(prev => ({ ...prev, loginAlert: e.target.checked }))}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label"><RiTimeLine /> 세션 타임아웃</label>
                <select
                  className="form-input form-select"
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                >
                  <option value="15">15분</option>
                  <option value="30">30분</option>
                  <option value="60">1시간</option>
                  <option value="120">2시간</option>
                  <option value="never">자동 로그아웃 안함</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 시스템 설정 */}
      <div className="card mt-3">
        <div className="card-header">
          <h3 className="card-title"><RiGlobalLine /> 시스템 설정</h3>
        </div>
        <div style={{ padding: '24px' }}>
          <div className="grid grid-3" style={{ gap: 24 }}>
            <div className="form-group">
              <label className="form-label">언어</label>
              <select
                className="form-input form-select"
                value={system.language}
                onChange={(e) => setSystem(prev => ({ ...prev, language: e.target.value }))}
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="zh">中文</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">시간대</label>
              <select
                className="form-input form-select"
                value={system.timezone}
                onChange={(e) => setSystem(prev => ({ ...prev, timezone: e.target.value }))}
              >
                <option value="Asia/Seoul">서울 (UTC+9)</option>
                <option value="Asia/Tokyo">도쿄 (UTC+9)</option>
                <option value="America/New_York">뉴욕 (UTC-5)</option>
                <option value="Europe/London">런던 (UTC+0)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">날짜 형식</label>
              <select
                className="form-input form-select"
                value={system.dateFormat}
                onChange={(e) => setSystem(prev => ({ ...prev, dateFormat: e.target.value }))}
              >
                <option value="YYYY-MM-DD">2024-12-18</option>
                <option value="DD/MM/YYYY">18/12/2024</option>
                <option value="MM/DD/YYYY">12/18/2024</option>
                <option value="YYYY.MM.DD">2024.12.18</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 데이터 관리 */}
      <div className="card mt-3">
        <div className="card-header">
          <h3 className="card-title"><RiDatabaseLine /> 데이터 관리</h3>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary">
              캐시 초기화
            </button>
            <button className="btn btn-secondary">
              로그 데이터 내보내기
            </button>
            <button className="btn btn-secondary">
              시스템 상태 확인
            </button>
          </div>
          <div className="alert alert-warning mt-2" style={{ marginTop: 16 }}>
            <RiInformationLine />
            <span>데이터 관리 기능은 시스템에 영향을 줄 수 있습니다. 신중하게 사용해주세요.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
