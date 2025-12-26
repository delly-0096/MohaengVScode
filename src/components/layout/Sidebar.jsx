import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  RiDashboardLine,
  RiUserLine,
  RiBuilding2Line,
  RiAlertLine,
  RiMapPinLine,
  RiShoppingBagLine,
  RiChat3Line,
  RiBookOpenLine,
  RiWalletLine,
  RiRefund2Line,
  RiExchangeDollarLine,
  RiNotification2Line,
  RiQuestionLine,
  RiRobotLine,
  RiPieChartLine,
  RiLineChartLine,
  RiSettings4Line,
  RiFileListLine,
  RiArrowDownSLine,
  RiPlaneLine,
  RiHotelBedLine,
  RiCalendarCheckLine,
  RiCoinLine,
  RiCalendar2Line,
  RiBellLine
} from 'react-icons/ri';

const menuItems = [
  {
    id: 'dashboard',
    title: '대시보드',
    icon: RiDashboardLine,
    path: '/'
  },
  {
    id: 'members',
    title: '회원관리',
    icon: RiUserLine,
    submenu: [
      { id: 'general', title: '일반회원', path: '/members/general' },
      { id: 'business', title: '기업회원', path: '/members/business' },
      { id: 'points', title: '포인트관리', path: '/members/points' },
      { id: 'reports', title: '신고관리', path: '/members/reports' }
    ]
  },
  {
    id: 'products',
    title: '상품관리',
    icon: RiShoppingBagLine,
    submenu: [
      { id: 'flights', title: '항공권', path: '/products/flights' },
      { id: 'accommodations', title: '숙박', path: '/products/accommodations' },
      { id: 'tours', title: '투어/체험/티켓', path: '/products/tours' }
    ]
  },
  {
    id: 'reservations',
    title: '예약관리',
    icon: RiCalendarCheckLine,
    submenu: [
      { id: 'reservations', title: '예약관리', path: '/reservations' },
      { id: 'inquiries', title: '상품문의', path: '/reservations/inquiries' },
      { id: 'reviews', title: '상품리뷰', path: '/reservations/reviews' }
    ]
  },
  {
    id: 'contents',
    title: '컨텐츠관리',
    icon: RiMapPinLine,
    submenu: [
      { id: 'destinations', title: '여행지정보', path: '/contents/destinations' },
      { id: 'community', title: '커뮤니티', path: '/contents/community' },
      { id: 'schedules', title: '일정관리', path: '/contents/schedules' },
      { id: 'files', title: '자료실', path: '/contents/files' }
    ]
  },
  {
    id: 'transactions',
    title: '거래관리',
    icon: RiWalletLine,
    submenu: [
      { id: 'payments', title: '결제내역', path: '/transactions/payments' },
      { id: 'refunds', title: '취소/환불내역', path: '/transactions/refunds' },
      { id: 'settlements', title: '기업정산', path: '/transactions/settlements' }
    ]
  },
  {
    id: 'support',
    title: '고객지원',
    icon: RiQuestionLine,
    submenu: [
      { id: 'notices', title: '공지사항', path: '/support/notices' },
      { id: 'faq', title: '자주 묻는 질문', path: '/support/faq' },
      { id: 'inquiries', title: '1:1문의', path: '/support/inquiries' },
      { id: 'chatbot', title: '챗봇관리', path: '/support/chatbot' },
      { id: 'notifications', title: '알림관리', path: '/support/notifications' }
    ]
  },
  {
    id: 'statistics',
    title: '통계/시스템',
    icon: RiPieChartLine,
    submenu: [
      { id: 'member-stats', title: '회원통계', path: '/statistics/members' },
      { id: 'service-stats', title: '서비스통계', path: '/statistics/services' },
      { id: 'algorithm', title: '알고리즘', path: '/statistics/algorithm' },
      { id: 'logs', title: '로그관리', path: '/statistics/logs' }
    ]
  }
];

function Sidebar({ collapsed, onExpand }) {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState(['members']); // 기본 열린 메뉴

  // 사이드바가 접힐 때 하위메뉴 닫기
  useEffect(() => {
    if (collapsed) {
      setOpenMenus([]);
    }
  }, [collapsed]);

  const toggleMenu = (menuId) => {
    // 접힌 상태에서 클릭하면 펼치면서 해당 메뉴 열기
    if (collapsed && onExpand) {
      onExpand();
      setOpenMenus([menuId]);
      return;
    }

    setOpenMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (path) => location.pathname === path;
  const isMenuActive = (submenu) => submenu?.some(item => location.pathname === item.path);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <img src={collapsed ? "/mohaeng_CI_con.png" : "/mohaeng_CI.png"} alt="모행" />
        {!collapsed && <h1>모행 관리자</h1>}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <div key={item.id} className="sidebar-section">
            {item.submenu ? (
              <>
                <button
                  className={`sidebar-item ${openMenus.includes(item.id) ? 'open' : ''} ${isMenuActive(item.submenu) ? 'active' : ''}`}
                  onClick={() => toggleMenu(item.id)}
                >
                  <span className="sidebar-item-icon">
                    <item.icon />
                  </span>
                  <span className="sidebar-item-text">{item.title}</span>
                  <RiArrowDownSLine className="sidebar-item-arrow" />
                </button>
                <div className={`sidebar-submenu ${openMenus.includes(item.id) ? 'open' : ''}`}>
                  {item.submenu.map(subItem => (
                    <NavLink
                      key={subItem.id}
                      to={subItem.path}
                      end
                      className={({ isActive }) =>
                        `sidebar-submenu-item ${isActive ? 'active' : ''}`
                      }
                    >
                      {subItem.title}
                    </NavLink>
                  ))}
                </div>
              </>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-item-icon">
                  <item.icon />
                </span>
                <span className="sidebar-item-text">{item.title}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
