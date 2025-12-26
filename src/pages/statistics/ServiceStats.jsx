import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  RiShoppingBagLine,
  RiEyeLine,
  RiStarLine,
  RiMoneyDollarCircleLine,
  RiPercentLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiMapPinLine,
  RiCalendarCheckLine,
  RiChat3Line,
  RiStarFill
} from 'react-icons/ri';

// 일별 트래픽 데이터
const dailyTrafficData = [
  { date: '12/09', views: 42000, bookings: 780 },
  { date: '12/10', views: 45000, bookings: 850 },
  { date: '12/11', views: 48000, bookings: 920 },
  { date: '12/12', views: 52000, bookings: 1050 },
  { date: '12/13', views: 55000, bookings: 1180 },
  { date: '12/14', views: 62000, bookings: 1350 },
  { date: '12/15', views: 58000, bookings: 1200 }
];

// 카테고리별 예약 데이터
const categoryData = [
  { category: '투어/체험', bookings: 5200, revenue: 650000000, color: '#4A90D9' },
  { category: '숙박', bookings: 3800, revenue: 980000000, color: '#10b981' },
  { category: '항공', bookings: 2100, revenue: 1250000000, color: '#f59e0b' },
  { category: '렌터카', bookings: 1200, revenue: 180000000, color: '#8b5cf6' },
  { category: '패키지', bookings: 950, revenue: 320000000, color: '#ef4444' }
];

// 상품별 성과
const productPerformance = [
  { id: 1, name: '제주 스쿠버다이빙 체험', company: '제주다이빙센터', views: 12340, bookings: 320, rate: 2.59, revenue: 21760000, rating: 4.9 },
  { id: 2, name: '한라산 트레킹 투어', company: '제주투어', views: 8560, bookings: 150, rate: 1.75, revenue: 12750000, rating: 4.7 },
  { id: 3, name: '부산 요트 투어', company: '부산해양', views: 6780, bookings: 98, rate: 1.45, revenue: 9800000, rating: 4.8 },
  { id: 4, name: '제주 서핑 레슨', company: '서핑스쿨제주', views: 5670, bookings: 80, rate: 1.41, revenue: 5200000, rating: 4.8 },
  { id: 5, name: '우도 자전거 투어', company: '우도바이크', views: 4320, bookings: 55, rate: 1.27, revenue: 2475000, rating: 4.5 }
];

// 인기 여행지
const popularDestinations = [
  { rank: 1, name: '제주도', searches: 45280, bookings: 2350, change: 15 },
  { rank: 2, name: '부산', searches: 38920, bookings: 1890, change: 22 },
  { rank: 3, name: '강원도', searches: 35420, bookings: 1650, change: 8 },
  { rank: 4, name: '경주', searches: 32150, bookings: 1420, change: -5 },
  { rank: 5, name: '여수', searches: 28560, bookings: 1280, change: 18 }
];

// 평점 분포
const ratingDistribution = [
  { rating: 5, count: 2850, percent: 68 },
  { rating: 4, count: 920, percent: 22 },
  { rating: 3, count: 295, percent: 7 },
  { rating: 2, count: 85, percent: 2 },
  { rating: 1, count: 42, percent: 1 }
];

// 자주 사용되는 키워드
const keywords = [
  { text: '친절해요', count: 1245, size: 'large' },
  { text: '재미있어요', count: 980, size: 'large' },
  { text: '추천해요', count: 856, size: 'large' },
  { text: '안전해요', count: 645, size: 'medium' },
  { text: '가성비 좋아요', count: 523, size: 'medium' },
  { text: '경치가 좋아요', count: 412, size: 'medium' },
  { text: '초보자도 가능', count: 356, size: 'small' },
  { text: '설명이 자세해요', count: 289, size: 'small' }
];

function ServiceStats() {
  const [period, setPeriod] = useState('month');

  const periods = [
    { id: 'today', label: '오늘' },
    { id: 'week', label: '이번 주' },
    { id: 'month', label: '이번 달' },
    { id: '3months', label: '최근 3개월' }
  ];

  const getRatingColor = (rating) => {
    if (rating >= 4) return '#10b981';
    if (rating >= 3) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">서비스 통계</h1>
          <p className="page-subtitle">서비스 이용 현황 및 매출 분석 데이터입니다</p>
        </div>
      </div>

      {/* 기간 선택 */}
      <div className="card" style={{ padding: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {periods.map(p => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: period === p.id ? 'var(--primary-color)' : '#f1f5f9',
                  color: period === p.id ? 'white' : '#64748b',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="date" className="form-input" style={{ width: 150, padding: '6px 12px' }} />
            <span style={{ color: '#64748b' }}>~</span>
            <input type="date" className="form-input" style={{ width: 150, padding: '6px 12px' }} />
            <button className="btn btn-primary btn-sm">조회</button>
          </div>
        </div>
      </div>

      {/* 주요 지표 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #4A90D9, #357ABD)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiEyeLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>362,000</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>총 조회수</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
                <RiArrowUpLine /> +18.2%
              </div>
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiCalendarCheckLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>7,330</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>총 예약수</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
                <RiArrowUpLine /> +12.5%
              </div>
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiPercentLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>2.02%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>전환율</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
                <RiArrowUpLine /> +0.3%
              </div>
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiMoneyDollarCircleLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>4.8억</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>총 매출</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
                <RiArrowUpLine /> +17.1%
              </div>
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #06b6d4, #0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiStarLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#06b6d4' }}>4.7</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>평균 평점</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
                <RiArrowUpLine /> +0.2
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 차트 영역 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* 조회수 추이 */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiEyeLine style={{ color: 'var(--primary-color)' }} />
              조회수 추이
            </h3>
          </div>
          <div style={{ padding: 20, height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8 }}
                  formatter={(value) => [value.toLocaleString(), '조회수']}
                />
                <Area type="monotone" dataKey="views" stroke="#4A90D9" fill="#dbeafe" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 예약수 추이 */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiCalendarCheckLine style={{ color: '#10b981' }} />
              예약수 추이
            </h3>
          </div>
          <div style={{ padding: 20, height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTrafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8 }}
                  formatter={(value) => [value.toLocaleString() + '건', '예약수']}
                />
                <Bar dataKey="bookings" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 상품별 성과 & 인기 여행지 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* 상품별 성과 */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiShoppingBagLine style={{ color: 'var(--primary-color)' }} />
              상품별 성과
            </h3>
            <button className="btn btn-sm btn-outline">전체 보기</button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>상품명</th>
                  <th style={{ width: 80, textAlign: 'center' }}>조회수</th>
                  <th style={{ width: 70, textAlign: 'center' }}>예약수</th>
                  <th style={{ width: 70, textAlign: 'center' }}>전환율</th>
                  <th style={{ width: 100, textAlign: 'right' }}>매출</th>
                  <th style={{ width: 60, textAlign: 'center' }}>평점</th>
                </tr>
              </thead>
              <tbody>
                {productPerformance.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.company}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{item.views.toLocaleString()}</td>
                    <td style={{ textAlign: 'center' }}>{item.bookings}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ color: item.rate >= 2 ? '#10b981' : item.rate >= 1.5 ? '#f59e0b' : '#64748b' }}>
                        {item.rate}%
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{(item.revenue / 10000).toLocaleString()}만원</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <RiStarFill style={{ color: '#f59e0b' }} />
                        {item.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 인기 여행지 */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiMapPinLine style={{ color: '#ef4444' }} />
              인기 여행지 TOP 5
            </h3>
          </div>
          <div style={{ padding: 0 }}>
            {popularDestinations.map((dest, index) => (
              <div
                key={dest.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderBottom: index < popularDestinations.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: dest.rank <= 3 ? 'var(--primary-color)' : '#e2e8f0',
                    color: dest.rank <= 3 ? 'white' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}>
                    {dest.rank}
                  </span>
                  <div>
                    <div style={{ fontWeight: 500 }}>{dest.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{dest.bookings.toLocaleString()}건 예약</div>
                  </div>
                </div>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: dest.change >= 0 ? '#10b981' : '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  {dest.change >= 0 ? <RiArrowUpLine /> : <RiArrowDownLine />}
                  {Math.abs(dest.change)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 후기 분석 */}
      <div className="card">
        <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <RiChat3Line style={{ color: 'var(--primary-color)' }} />
            후기 분석
          </h3>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: 32 }}>
            {/* 평균 평점 */}
            <div style={{ textAlign: 'center', padding: 20, background: '#f8fafc', borderRadius: 12 }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary-color)' }}>4.7</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8, marginBottom: 8 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <RiStarFill
                    key={star}
                    style={{ color: star <= 4 ? '#f59e0b' : '#e2e8f0', fontSize: '1.25rem' }}
                  />
                ))}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>총 4,192개 후기</div>
            </div>

            {/* 평점 분포 */}
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 16, color: '#64748b' }}>평점 분포</h4>
              {ratingDistribution.map(item => (
                <div key={item.rating} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ width: 35, fontSize: '0.875rem', color: '#64748b' }}>{item.rating}점</span>
                  <div style={{ flex: 1, height: 12, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{
                      width: `${item.percent}%`,
                      height: '100%',
                      background: getRatingColor(item.rating),
                      borderRadius: 6
                    }} />
                  </div>
                  <span style={{ width: 50, fontSize: '0.8rem', color: '#64748b', textAlign: 'right' }}>{item.count}개</span>
                </div>
              ))}
            </div>

            {/* 자주 사용되는 키워드 */}
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 16, color: '#64748b' }}>자주 사용되는 키워드</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    style={{
                      padding: keyword.size === 'large' ? '8px 16px' : keyword.size === 'medium' ? '6px 12px' : '5px 10px',
                      background: keyword.size === 'large' ? 'var(--primary-color)' : keyword.size === 'medium' ? '#64748b' : '#e2e8f0',
                      color: keyword.size === 'small' ? '#475569' : 'white',
                      borderRadius: 20,
                      fontSize: keyword.size === 'large' ? '0.875rem' : keyword.size === 'medium' ? '0.8rem' : '0.75rem',
                      fontWeight: 500
                    }}
                  >
                    {keyword.text} ({keyword.count})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceStats;
