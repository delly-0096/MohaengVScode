import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// 더미 관리자 데이터 (실제 구현 시 API 연동)
const ADMIN_USERS = [
  {
    id: 1,
    email: 'admin@mohaeng.com',
    password: 'admin123',
    name: '최고관리자',
    role: 'SUPER_ADMIN',
    department: '시스템관리팀',
    avatar: null
  },
  {
    id: 2,
    email: 'manager@mohaeng.com',
    password: 'manager123',
    name: '김관리',
    role: 'ADMIN',
    department: '운영팀',
    avatar: null
  },
  {
    id: 3,
    email: 'support@mohaeng.com',
    password: 'support123',
    name: '이지원',
    role: 'SUPPORT',
    department: '고객지원팀',
    avatar: null
  }
];

const ROLE_NAMES = {
  SUPER_ADMIN: '최고관리자',
  ADMIN: '관리자',
  SUPPORT: '고객지원'
};

export function AuthProvider({ children }) {
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

  const login = async (email, password) => {
    // 더미 로그인 (실제 구현 시 API 호출)
    const foundUser = ADMIN_USERS.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        roleName: ROLE_NAMES[foundUser.role],
        department: foundUser.department,
        avatar: foundUser.avatar,
        loginTime: new Date().toISOString()
      };

      setUser(userData);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
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
