import { useNavigate } from 'react-router-dom';
import {
  RiUserLine,
  RiBuilding2Line,
  RiWalletLine,
  RiFileListLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiMoreLine,
  RiEyeLine
} from 'react-icons/ri';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import './Dashboard.css';

// 더미 데이터
const statsData = [
  {
    id: 1,
    title: '전체 회원',
    value: '15,482',
    change: '+12.5%',
    isUp: true,
    icon: RiUserLine,
    color: 'primary'
  },
  {
    id: 2,
    title: '기업 회원',
    value: '328',
    change: '+8.2%',
    isUp: true,
    icon: RiBuilding2Line,
    color: 'success'
  },
  {
    id: 3,
    title: '오늘 매출',
    value: '₩2,450,000',
    change: '-3.1%',
    isUp: false,
    icon: RiWalletLine,
    color: 'warning'
  },
  {
    id: 4,
    title: '처리대기 문의',
    value: '24',
    change: '+5건',
    isUp: true,
    icon: RiFileListLine,
    color: 'danger'
  }
];

const monthlyUserData = [
  { month: '1월', 신규가입: 420, 탈퇴: 32 },
  { month: '2월', 신규가입: 380, 탈퇴: 28 },
  { month: '3월', 신규가입: 520, 탈퇴: 35 },
  { month: '4월', 신규가입: 610, 탈퇴: 42 },
  { month: '5월', 신규가입: 580, 탈퇴: 38 },
  { month: '6월', 신규가입: 720, 탈퇴: 45 },
  { month: '7월', 신규가입: 850, 탈퇴: 52 },
  { month: '8월', 신규가입: 920, 탈퇴: 58 },
  { month: '9월', 신규가입: 780, 탈퇴: 48 },
  { month: '10월', 신규가입: 650, 탈퇴: 40 },
  { month: '11월', 신규가입: 700, 탈퇴: 44 },
  { month: '12월', 신규가입: 880, 탈퇴: 55 }
];

const salesData = [
  { month: '1월', 매출: 4500000 },
  { month: '2월', 매출: 3800000 },
  { month: '3월', 매출: 5200000 },
  { month: '4월', 매출: 6100000 },
  { month: '5월', 매출: 5800000 },
  { month: '6월', 매출: 7200000 },
  { month: '7월', 매출: 8500000 },
  { month: '8월', 매출: 9200000 },
  { month: '9월', 매출: 7800000 },
  { month: '10월', 매출: 6500000 },
  { month: '11월', 매출: 7000000 },
  { month: '12월', 매출: 8800000 }
];

const categoryData = [
  { name: '투어', value: 28, color: '#4A90D9' },
  { name: '액티비티', value: 25, color: '#10B981' },
  { name: '입장권/티켓', value: 22, color: '#F59E0B' },
  { name: '클래스/체험', value: 15, color: '#8B5CF6' },
  { name: '교통/이동', value: 10, color: '#EC4899' }
];

const recentActivities = [
  { id: 1, type: '회원가입', content: '김여행님이 회원가입했습니다.', time: '5분 전' },
  { id: 2, type: '결제', content: '이모행님이 제주 스노클링 체험을 결제했습니다. (₩85,000)', time: '12분 전' },
  { id: 3, type: '문의', content: '박관광님이 1:1 문의를 등록했습니다.', time: '25분 전' },
  { id: 4, type: '신고', content: '여행톡 게시글에 대한 신고가 접수되었습니다.', time: '32분 전' },
  { id: 5, type: '환불', content: '최투어님의 환불 요청이 처리되었습니다.', time: '1시간 전' },
  { id: 6, type: '상품등록', content: '(주)투어코리아가 새 투어 상품을 등록했습니다.', time: '2시간 전' }
];

const topDestinations = [
  { id: 1, name: '제주도', visits: 12540, change: '+15%' },
  { id: 2, name: '부산', visits: 8920, change: '+8%' },
  { id: 3, name: '오사카', visits: 7650, change: '+22%' },
  { id: 4, name: '도쿄', visits: 6840, change: '+12%' },
  { id: 5, name: '방콕', visits: 5230, change: '+18%' }
];

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      {/* 통계 카드 */}
      <div className="grid grid-4">
        {statsData.map(stat => (
          <div key={stat.id} className="stat-card">
            <div className={`stat-card-icon ${stat.color}`}>
              <stat.icon />
            </div>
            <div className="stat-card-value">{stat.value}</div>
            <div className="stat-card-label">{stat.title}</div>
            <div className={`stat-card-change ${stat.isUp ? 'up' : 'down'}`}>
              {stat.isUp ? <RiArrowUpLine /> : <RiArrowDownLine />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-2 mt-3">
        {/* 회원 현황 차트 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">월별 회원 현황</h3>
            <button className="btn btn-icon">
              <RiMoreLine />
            </button>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyUserData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="신규가입"
                  stackId="1"
                  stroke="#4A90D9"
                  fill="#4A90D9"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="탈퇴"
                  stackId="2"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 매출 차트 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">월별 매출 현황</h3>
            <button className="btn btn-icon">
              <RiMoreLine />
            </button>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(v) => `${v / 10000}만`} />
                <Tooltip formatter={(value) => `₩${value.toLocaleString()}`} />
                <Bar dataKey="매출" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-3 mt-3">
        {/* 카테고리별 비중 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">상품 카테고리 비중</h3>
          </div>
          <div className="chart-container" style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">최근 활동</h3>
            <button className="btn btn-sm btn-secondary" onClick={() => navigate('/activities')}>전체보기</button>
          </div>
          <div className="activity-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-type ${activity.type}`}>
                  {activity.type}
                </div>
                <div className="activity-content">
                  <p>{activity.content}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 인기 여행지 */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">인기 여행지 TOP 5</h3>
          </div>
          <div className="destination-list">
            {topDestinations.map((dest, index) => (
              <div key={dest.id} className="destination-item">
                <div className="destination-rank">{index + 1}</div>
                <div className="destination-info">
                  <div className="destination-name">{dest.name}</div>
                  <div className="destination-visits">
                    <RiEyeLine /> {dest.visits.toLocaleString()}회
                  </div>
                </div>
                <div className="destination-change text-success">{dest.change}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
