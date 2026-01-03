import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 페이지 이동을 위해 추가

  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // 통합된 login 함수
  const login = async (loginId, password, captchaToken) => {
  try {
    const res = await api.post("/admin/login", {
      loginId,
      password,
      captchaToken,
    });

    const data = await res.data;
    console.log("🔥 login response", data);

    localStorage.setItem("access_token", data.access_token);

    const userData = {
      department: data.department,
      loginTime: new Date().toISOString(),
      token: data.access_token,
    };

    localStorage.setItem("adminUser", JSON.stringify(userData));
    setUser(userData);

    return { success: true };

  } catch (err) {
    console.error("로그인 에러:", err);
    
    // 서버에서 보낸 에러 메시지 확인
    const errorMessage = err.response?.data?.message || "서버 오류";
    const needCaptcha = err.response?.data?.needCaptcha;

    return { 
      success: false, 
      error: errorMessage,
      needCaptcha: needCaptcha
    };
  }
};

  const signup = () => {
    console.log("회원가입 페이지 이동");
    navigate("/sign-up");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('access_token');
    navigate("/login");
  };

  const hasPermission = (requiredRole) => {
    if (!user) return false;
    const roleHierarchy = { SUPER_ADMIN: 3, ADMIN: 2, SUPPORT: 1 };
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    hasPermission,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;