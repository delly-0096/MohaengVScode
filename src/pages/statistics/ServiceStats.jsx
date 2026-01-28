import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  RiShoppingBagLine,
  RiEyeLine,
  RiStarLine,
  RiMoneyDollarCircleLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiMapPinLine,
  RiCalendarCheckLine,
  RiChat3Line,
  RiStarFill,
  RiLoader4Line,
  RiWallet3Line
} from 'react-icons/ri';

// 카테고리 한글 변환
const categoryLabels = {
  'tour': '투어',
  'activity': '액티비티',
  'ticket': '입장권/티켓',
  'class': '클래스/체험',
  'transfer': '교통/이동',
  'accommodation': '숙박'
};

// 카테고리 색상
const categoryColors = {
  'tour': '#4A90D9',
  'activity': '#10b981',
  'ticket': '#f59e0b',
  'class': '#8b5cf6',
  'transfer': '#ef4444',
  'accommodation': '#06b6d4'
};

function ServiceStats() {
  const [period, setPeriod] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 통계 데이터 상태
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    totalViews: 0,
    avgRating: 0,
    totalReviews: 0
  });
  const [dailyTrend, setDailyTrend] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [productPerformance, setProductPerformance] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    avgRating: 0,
    totalReviews: 0,
    ratingDistribution: []
  });

  const periods = [
    { id: 'today', label: '오늘' },
    { id: 'week', label: '이번 주' },
    { id: 'month', label: '이번 달' },
    { id: '3months', label: '최근 3개월' },
    { id: '6months', label: '최근 6개월' }
  ];

  // 데이터 로드
  const fetchData = async (selectedPeriod, startDate, endDate) => {
    setLoading(true);
    setError(null);

    try {
      let url = `http://localhost:8272/api/admin/stats/service?period=${selectedPeriod}`;
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.');

      const data = await response.json();

      // 상태 업데이트
      setSummary(data.summary || {});
      setDailyTrend(data.dailyTrend?.data || []);
      setCategoryStats(data.categoryStats?.data || []);
      setProductPerformance(data.productPerformance?.data || []);
      setPopularDestinations(data.popularDestinations?.data || []);
      setReviewStats(data.reviewStats || {});

    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 및 기간 변경 시
  useEffect(() => {
    fetchData(period, null, null);
  }, [period]);

  // 커스텀 기간 조회
  const handleCustomSearch = () => {
    if (customStartDate && customEndDate) {
      fetchData('custom', customStartDate, customEndDate);
    }
  };

  // 숫자 포맷 함수
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString();
  };

  // 금액 포맷 (억/만원 단위)
  const formatCurrency = (num) => {
    if (num === null || num === undefined) return '0원';
    if (num >= 100000000) {
      return (num / 100000000).toFixed(1) + '억';
    } else if (num >= 10000) {
      return (num / 10000).toLocaleString() + '만원';
    }
    return num.toLocaleString() + '원';
  };

  // 평점 색상
  const getRatingColor = (rating) => {
    if (rating >= 4) return '#10b981';
    if (rating >= 3) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <RiLoader4Line style={{ fontSize: '3rem', color: 'var(--primary-color)', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: 16, color: '#64748b' }}>통계 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: 16 }}>{error}</p>
          <button className="btn btn-primary" onClick={() => fetchData(period, null, null)}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

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
            <input
              type="date"
              className="form-input"
              style={{ width: 150, padding: '6px 12px' }}
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
            />
            <span style={{ color: '#64748b' }}>~</span>
            <input
              type="date"
              className="form-input"
              style={{ width: 150, padding: '6px 12px' }}
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={handleCustomSearch}>조회</button>
          </div>
        </div>
      </div>

      {/* 주요 지표 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiMoneyDollarCircleLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>
                {formatCurrency(summary.totalRevenue)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>총 매출</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiCalendarCheckLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>
                {formatNumber(summary.totalOrders)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>총 결제 건수</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiWallet3Line />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>
                {formatCurrency(summary.avgOrderValue)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>평균 객단가</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #4A90D9, #357ABD)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiEyeLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                {formatNumber(summary.totalViews)}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>총 조회수</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #06b6d4, #0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiStarLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#06b6d4' }}>
                {summary.avgRating || 0}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>평균 평점</div>
            </div>
          </div>
        </div>
      </div>

      {/* 차트 영역 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* 매출 추이 */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiMoneyDollarCircleLine style={{ color: '#8b5cf6' }} />
              일별 매출 추이
            </h3>
          </div>
          <div style={{ padding: 20, height: 280 }}>
            {dailyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="PAYDATE" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => formatCurrency(v)} />
                  <Tooltip
                    contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8 }}
                    formatter={(value) => [formatCurrency(value), '매출']}
                  />
                  <Area type="monotone" dataKey="REVENUE" stroke="#8b5cf6" fill="#ede9fe" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' }}>
                데이터가 없습니다
              </div>
            )}
          </div>
        </div>

        {/* 결제 건수 추이 */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiCalendarCheckLine style={{ color: '#10b981' }} />
              일별 결제 건수 추이
            </h3>
          </div>
          <div style={{ padding: 20, height: 280 }}>
            {dailyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="PAYDATE" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8 }}
                    formatter={(value) => [value + '건', '결제 건수']}
                  />
                  <Bar dataKey="ORDERS" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' }}>
                데이터가 없습니다
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 카테고리별 & 상품별 성과 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24 }}>
        {/* 카테고리별 통계 */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiShoppingBagLine style={{ color: 'var(--primary-color)' }} />
              카테고리별 매출
            </h3>
          </div>
          <div style={{ padding: 0 }}>
            {categoryStats.length > 0 ? (
              categoryStats.map((cat, index) => (
                <div
                  key={cat.CATEGORY || index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderBottom: index < categoryStats.length - 1 ? '1px solid #f1f5f9' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      width: 12,
                      height: 12,
                      borderRadius: 4,
                      background: categoryColors[cat.CATEGORY] || '#94a3b8'
                    }} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{categoryLabels[cat.CATEGORY] || cat.CATEGORY}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{formatNumber(cat.ORDERS)}건</div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>
                    {formatCurrency(cat.REVENUE)}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                데이터가 없습니다
              </div>
            )}
          </div>
        </div>

        {/* 상품별 성과 TOP 10 */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiShoppingBagLine style={{ color: 'var(--primary-color)' }} />
              상품별 성과 TOP 10
            </h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>상품명</th>
                  <th style={{ width: 80, textAlign: 'center' }}>조회수</th>
                  <th style={{ width: 70, textAlign: 'center' }}>결제수</th>
                  <th style={{ width: 70, textAlign: 'center' }}>전환율</th>
                  <th style={{ width: 100, textAlign: 'right' }}>매출</th>
                  <th style={{ width: 60, textAlign: 'center' }}>평점</th>
                </tr>
              </thead>
              <tbody>
                {productPerformance.length > 0 ? (
                  productPerformance.map((item, index) => (
                    <tr key={item.PRODNO || index}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{item.PRODNAME}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.COMPANYNAME}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{formatNumber(item.VIEWS)}</td>
                      <td style={{ textAlign: 'center' }}>{formatNumber(item.ORDERS)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ color: item.CONVERSIONRATE >= 2 ? '#10b981' : item.CONVERSIONRATE >= 1 ? '#f59e0b' : '#64748b' }}>
                          {item.CONVERSIONRATE}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.REVENUE)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                          <RiStarFill style={{ color: '#f59e0b' }} />
                          {item.RATING || '-'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                      데이터가 없습니다
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 인기 여행지 & 리뷰 분석 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24 }}>
        {/* 인기 여행지 TOP 5 */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiMapPinLine style={{ color: '#ef4444' }} />
              인기 여행지 TOP 5
            </h3>
          </div>
          <div style={{ padding: 0 }}>
            {popularDestinations.length > 0 ? (
              popularDestinations.map((dest, index) => (
                <div
                  key={dest.DESTINATION || index}
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
                      background: index < 3 ? 'var(--primary-color)' : '#e2e8f0',
                      color: index < 3 ? 'white' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}>
                      {index + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 500 }}>{dest.DESTINATION}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{formatNumber(dest.ORDERS)}건 예약</div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>
                    {formatCurrency(dest.REVENUE)}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                데이터가 없습니다
              </div>
            )}
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
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32 }}>
              {/* 평균 평점 */}
              <div style={{ textAlign: 'center', padding: 20, background: '#f8fafc', borderRadius: 12 }}>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                  {reviewStats.avgRating || 0}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 8, marginBottom: 8 }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <RiStarFill
                      key={star}
                      style={{ color: star <= Math.round(reviewStats.avgRating || 0) ? '#f59e0b' : '#e2e8f0', fontSize: '1.25rem' }}
                    />
                  ))}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  총 {formatNumber(reviewStats.totalReviews)}개 후기
                </div>
              </div>

              {/* 평점 분포 */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 16, color: '#64748b' }}>평점 분포</h4>
                {reviewStats.ratingDistribution && reviewStats.ratingDistribution.length > 0 ? (
                  [5, 4, 3, 2, 1].map(rating => {
                    const item = reviewStats.ratingDistribution.find(r => r.RATING === rating) || { COUNT: 0, PERCENT: 0 };
                    return (
                      <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <span style={{ width: 35, fontSize: '0.875rem', color: '#64748b' }}>{rating}점</span>
                        <div style={{ flex: 1, height: 12, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                          <div style={{
                            width: `${item.PERCENT || 0}%`,
                            height: '100%',
                            background: getRatingColor(rating),
                            borderRadius: 6
                          }} />
                        </div>
                        <span style={{ width: 50, fontSize: '0.8rem', color: '#64748b', textAlign: 'right' }}>
                          {formatNumber(item.COUNT)}개
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ color: '#94a3b8', textAlign: 'center', padding: 20 }}>
                    데이터가 없습니다
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 스피너 애니메이션 CSS */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ServiceStats;