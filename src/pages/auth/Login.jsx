import ReCAPTCHA from "react-google-recaptcha";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import './Login.css';

function Login() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needCaptcha, setNeedCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const { login} = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    if (!loginId || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }


    setLoading(true);

    try {
    const result = await login(
      loginId,
      password,
      needCaptcha ? captchaToken : null);
    console.log("🔥 login result", result);

      if (result.success) {
            navigate('/');
            return;
          }

          setError(result.error || '로그인에 실패했습니다.');

          if (result.needCaptcha) {
            setNeedCaptcha(true);
            setCaptchaToken(null);
          }

  } catch (err) {
    setError('로그인 중 오류가 발생했습니다.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <img src="/mohaeng_CI.png" alt="모행" className="login-logo" />
          <h1>모행 관리자</h1>
          <p>관리자 계정으로 로그인해주세요</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">이메일</label>
            <div className="login-input-wrapper">
              <RiMailLine className="login-input-icon" />
              <input
                type="text"
                className="form-input login-input"
                placeholder="admin@mohaeng.com"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <div className="login-input-wrapper">
              <RiLockLine className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input login-input"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

            {needCaptcha && (
              <div className="captcha-wrapper">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={(token) => setCaptchaToken(token)}
                />
              </div>
            )}

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading || (needCaptcha && !captchaToken)}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-hint">
            테스트 계정:<br />
            admin@mohaeng.com / admin123<br />
            manager@mohaeng.com / manager123<br />
            support@mohaeng.com / support123
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
