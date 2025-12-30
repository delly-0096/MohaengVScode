import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const res = await fetch("http://localhost:8272/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId, password, captchaToken }),
    });

    const data = await res.json();
    console.log("🔥 login response", data);

    if (!res.ok) {
      return {
        success: false,
        error: data.message,
        needCaptcha: data.needCaptcha,
      };
    }

    localStorage.setItem("access_token", data.access_token);

    const userData = {
      department: data.department,
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("adminUser", JSON.stringify(userData));
    setUser(userData);

    return { success: true };

  } catch (err) {
    console.error(err);
    return { success: false, error: "서버 오류" };
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