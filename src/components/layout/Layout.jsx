import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

// 페이지별 타이틀 매핑
const PAGE_TITLES = {
  '/': '대시보드',
  '/members/general': '일반회원 관리',
  '/members/business': '기업회원 관리',
  '/members/reports': '신고 관리',
  '/contents/destinations': '여행지 정보 관리',
  '/contents/community': '커뮤니티 관리',
  '/contents/products': '기업상품 관리',
  '/contents/talk': '여행톡 관리',
  '/contents/logs': '여행기록 관리',
  '/reservations': '예약 관리',
  '/reservations/inquiries': '상품 문의 관리',
  '/reservations/reviews': '상품 리뷰 관리',
  '/contents/schedules': '일정 관리',
  '/contents/files': '자료실',
  '/transactions/payments': '결제내역 관리',
  '/transactions/refunds': '취소/환불 관리',
  '/transactions/settlements': '기업정산 관리',
  '/support/notices': '공지사항 관리',
  '/support/inquiries': '1:1 문의 관리',
  '/support/chatbot': '챗봇 관리',
  '/support/notifications': '알림 관리',
  '/statistics/members': '회원 통계',
  '/statistics/services': '서비스 통계',
  '/statistics/algorithm': '알고리즘 관리',
  '/statistics/logs': '로그 관리',
  '/profile': '내 정보',
  '/settings': '설정'
};

function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const pageTitle = PAGE_TITLES[location.pathname] || '모행 관리자';

  return (
    <div className="admin-layout">
      <Sidebar collapsed={sidebarCollapsed} onExpand={() => setSidebarCollapsed(false)} />

      <div className={`admin-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header
          collapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          title={pageTitle}
        />

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
