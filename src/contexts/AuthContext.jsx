import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
console.log("🔥 AuthProvider 렌더링됨");
export function AuthProvider({ children }) {
  console.log("🔥 AuthProvider instance", Math.random());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 저장된 로그인 정보 확인
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (loginId, password, captchaToken) => {
    console.log("🔥 login 호출됨", loginId, password);
    try {
    const res = await fetch("http://localhost:8272/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        loginId,
        password,
        captchaToken,
      }),
    });

    console.log("🔥 response status:", res.status);

    const text = await res.text();
    console.log("🔥 raw response:", text);

    const data = JSON.parse(text);
    console.log("🔥 parsed response data:", data);

    if (!res.ok) {
      return {
        success: false,
        error: data.message,
        needCaptcha: data.needCaptcha,
      };
    }

    // 로그인 성공 시 서버에서 내려준 관리자 정보
    const userData = {
      loginId: data.loginId,
      name: data.name,
      role: data.role,
      department: data.department,
      loginTime: new Date().toISOString(),
    };

    setUser(userData);
    localStorage.setItem("adminUser", JSON.stringify(userData));

    return { success: true };
  } catch (err) {
     console.error("🔥 fetch error", err);
    return {
      success: false,
      error: "서버와 통신 중 오류가 발생했습니다.",
    };
  }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  const hasPermission = (requiredRole) => {
    if (!user) return false;

    const roleHierarchy = {
      SUPER_ADMIN: 3,
      ADMIN: 2,
      SUPPORT: 1
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
