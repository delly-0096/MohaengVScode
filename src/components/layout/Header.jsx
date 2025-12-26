import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  RiMenuLine,
  RiNotification3Line,
  RiSearchLine,
  RiUserLine,
  RiSettings4Line,
  RiLogoutBoxRLine,
  RiCloseLine,
  RiCheckLine,
  RiTimeLine,
  RiAlertLine,
  RiShoppingBagLine,
  RiQuestionLine,
  RiWalletLine
} from 'react-icons/ri';
import { Modal } from '../common/Modal';

// 알림 더미 데이터
const notificationsData = [
  { id: 1, type: 'inquiry', title: '새로운 1:1 문의', message: '김여행님이 환불 관련 문의를 등록했습니다.', time: '5분 전', isRead: false },
  { id: 2, type: 'report', title: '신고 접수', message: '여행톡 게시글에 대한 신고가 접수되었습니다.', time: '12분 전', isRead: false },
  { id: 3, type: 'product', title: '상품 승인 요청', message: '(주)투어코리아가 새 상품 등록을 요청했습니다.', time: '30분 전', isRead: false },
  { id: 4, type: 'refund', title: '환불 요청', message: '이모행님이 환불을 요청했습니다.', time: '1시간 전', isRead: true },
  { id: 5, type: 'member', title: '기업회원 가입 요청', message: '스카이트래블이 기업회원 가입을 요청했습니다.', time: '2시간 전', isRead: true }
];

const notificationIcons = {
  inquiry: RiQuestionLine,
  report: RiAlertLine,
  product: RiShoppingBagLine,
  refund: RiWalletLine,
  member: RiUserLine
};

function Header({ collapsed, onToggleSidebar, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState(notificationsData);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const searchInputRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name ? name.charAt(0) : 'A';
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  const searchMenuItems = [
    { label: '회원 검색', path: '/members/general', icon: RiUserLine },
    { label: '기업 검색', path: '/members/business', icon: RiUserLine },
    { label: '상품 검색', path: '/contents/products', icon: RiShoppingBagLine },
    { label: '문의 검색', path: '/support/inquiries', icon: RiQuestionLine }
  ];

  return (
    <header className={`header ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-left">
        <button className="header-toggle" onClick={onToggleSidebar}>
          <RiMenuLine size={24} />
        </button>
        <h2 className="header-title">{title || '대시보드'}</h2>
      </div>

      <div className="header-right">
        {/* 검색 버튼 */}
        <button className="header-icon-btn" onClick={() => setSearchOpen(true)}>
          <RiSearchLine size={20} />
        </button>

        {/* 알림 버튼 */}
        <div className="header-notification-wrapper" ref={notificationRef}>
          <button
            className="header-icon-btn"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            <RiNotification3Line size={20} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {/* 알림 드롭다운 */}
          <div className={`notification-dropdown ${notificationOpen ? 'open' : ''}`}>
            <div className="notification-header">
              <h4>알림</h4>
              {unreadCount > 0 && (
                <button className="btn-text" onClick={markAllAsRead}>
                  모두 읽음
                </button>
              )}
            </div>
            <div className="notification-list">
              {notifications.length === 0 ? (
                <div className="notification-empty">새로운 알림이 없습니다.</div>
              ) : (
                notifications.map(notification => {
                  const IconComponent = notificationIcons[notification.type] || RiNotification3Line;
                  return (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className={`notification-icon ${notification.type}`}>
                        <IconComponent />
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">{notification.title}</div>
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">
                          <RiTimeLine /> {notification.time}
                        </div>
                      </div>
                      {!notification.isRead && <div className="notification-dot"></div>}
                    </div>
                  );
                })
              )}
            </div>
            <div className="notification-footer">
              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
                onClick={() => {
                  setNotificationOpen(false);
                  navigate('/activities');
                }}
              >
                전체 알림 보기
              </button>
            </div>
          </div>
        </div>

        {/* 사용자 드롭다운 */}
        <div className="header-user-wrapper" ref={dropdownRef}>
          <div
            className="header-user"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="header-user-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className="header-user-info">
              <div className="header-user-name">{user?.name || '관리자'}</div>
              <div className="header-user-role">{user?.roleName || '관리자'}</div>
            </div>
          </div>

          <div className={`user-dropdown ${dropdownOpen ? 'open' : ''}`}>
            <div className="user-dropdown-header">
              <div className="header-user-avatar" style={{ width: 48, height: 48, fontSize: '1.25rem' }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{user?.name}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {user?.email}
                </div>
              </div>
            </div>
            <div className="user-dropdown-divider"></div>
            <button
              className="user-dropdown-item"
              onClick={() => {
                setDropdownOpen(false);
                navigate('/profile');
              }}
            >
              <RiUserLine size={18} />
              내 정보
            </button>
            <button
              className="user-dropdown-item"
              onClick={() => {
                setDropdownOpen(false);
                navigate('/settings');
              }}
            >
              <RiSettings4Line size={18} />
              설정
            </button>
            <div className="user-dropdown-divider"></div>
            <button
              className="user-dropdown-item danger"
              onClick={handleLogout}
            >
              <RiLogoutBoxRLine size={18} />
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* 검색 모달 */}
      <Modal
        isOpen={searchOpen}
        onClose={() => { setSearchOpen(false); setSearchTerm(''); }}
        title="검색"
        size="medium"
      >
        <form onSubmit={handleSearch}>
          <div className="search-modal-input">
            <RiSearchLine className="search-modal-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="form-input"
              placeholder="회원, 상품, 문의 등을 검색하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 44 }}
            />
          </div>
        </form>
        <div className="search-shortcuts">
          <div className="search-shortcuts-title">바로가기</div>
          {searchMenuItems.map((item, index) => (
            <button
              key={index}
              className="search-shortcut-item"
              onClick={() => {
                setSearchOpen(false);
                navigate(item.path);
              }}
            >
              <item.icon />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </Modal>
    </header>
  );
}

export default Header;
