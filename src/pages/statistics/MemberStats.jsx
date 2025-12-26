import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  RiUserLine,
  RiUserAddLine,
  RiUserHeartLine,
  RiCalendarLine,
  RiBuilding2Line,
  RiTeamLine,
  RiPercentLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiStarLine,
  RiEyeLine,
  RiMapPinLine
} from 'react-icons/ri';

// 월별 회원 추이 데이터
const monthlyData = [
  { month: '7월', newUsers: 1200, activeUsers: 8500, general: 1100, business: 100 },
  { month: '8월', newUsers: 1350, activeUsers: 9200, general: 1250, business: 100 },
  { month: '9월', newUsers: 1480, activeUsers: 9800, general: 1350, business: 130 },
  { month: '10월', newUsers: 1620, activeUsers: 10500, general: 1480, business: 140 },
  { month: '11월', newUsers: 1850, activeUsers: 11200, general: 1700, business: 150 },
  { month: '12월', newUsers: 2100, activeUsers: 12458, general: 1920, business: 180 }
];

// 연령대 분포
const ageData = [
  { name: '10대', value: 8, count: 996, color: '#818CF8' },
  { name: '20대', value: 35, count: 4360, color: '#34D399' },
  { name: '30대', value: 28, count: 3488, color: '#FBBF24' },
  { name: '40대', value: 18, count: 2242, color: '#F87171' },
  { name: '50대 이상', value: 11, count: 1372, color: '#60A5FA' }
];

// 성별 분포
const genderData = [
  { name: '남성', value: 45, count: 5606, color: '#60A5FA' },
  { name: '여성', value: 55, count: 6852, color: '#F472B6' }
];

// 지역별 분포
const regionData = [
  { region: '서울', users: 4500, percent: 36.1 },
  { region: '경기', users: 3200, percent: 25.7 },
  { region: '부산', users: 1200, percent: 9.6 },
  { region: '인천', users: 980, percent: 7.9 },
  { region: '대구', users: 750, percent: 6.0 },
  { region: '기타', users: 1828, percent: 14.7 }
];

// 최근 가입 회원
const recentMembers = [
  { id: 1, name: '김지민', email: 'jimin@gmail.com', type: 'general', joinDate: '2024-03-15 14:32', status: 'active' },
  { id: 2, name: '(주)제주투어', email: 'jejutour@company.com', type: 'business', joinDate: '2024-03-15 11:20', status: 'pending' },
  { id: 3, name: '이수현', email: 'soohyun@naver.com', type: 'general', joinDate: '2024-03-15 10:15', status: 'active' },
  { id: 4, name: '박민준', email: 'minjun@daum.net', type: 'general', joinDate: '2024-03-14 18:45', status: 'active' },
  { id: 5, name: '(주)부산해양', email: 'busansea@company.com', type: 'business', joinDate: '2024-03-14 15:30', status: 'active' }
];

function MemberStats() {
  const [period, setPeriod] = useState('month');

  const periods = [
    { id: 'today', label: '오늘' },
    { id: 'week', label: '이번 주' },
    { id: 'month', label: '이번 달' },
    { id: '3months', label: '최근 3개월' }
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">회원 통계</h1>
          <p className="page-subtitle">회원 현황 및 분석 데이터입니다</p>
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
              <RiTeamLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>12,458</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>전체 회원</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
                <RiArrowUpLine /> +12.5%
              </div>
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiUserAddLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>2,100</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>신규 가입</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
                <RiArrowUpLine /> +13.5%
              </div>
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiUserHeartLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>8,945</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>활성 회원</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
                <RiArrowUpLine /> +8.2%
              </div>
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiPercentLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>71.8%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>회원 유지율</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
                <RiArrowUpLine /> +2.3%
              </div>
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #06b6d4, #0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiBuilding2Line />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#06b6d4' }}>458</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>기업 회원</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
                <RiArrowUpLine /> +15.2%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 차트 영역 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* 월별 회원 추이 */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>월별 회원 추이</h3>
          </div>
          <div style={{ padding: 20, height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8 }}
                />
                <Legend />
                <Line type="monotone" dataKey="newUsers" name="신규가입" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                <Line type="monotone" dataKey="activeUsers" name="활성회원" stroke="#4A90D9" strokeWidth={2} dot={{ fill: '#4A90D9' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 회원 유형 분포 */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>회원 유형 분포</h3>
          </div>
          <div style={{ padding: 20 }}>
            {/* 일반회원 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiUserLine style={{ color: '#4A90D9' }} />
                  <span style={{ fontWeight: 500 }}>일반회원</span>
                </div>
                <span style={{ fontWeight: 600, color: '#4A90D9' }}>12,000명 (96.3%)</span>
              </div>
              <div style={{ height: 12, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ width: '96.3%', height: '100%', background: 'linear-gradient(90deg, #4A90D9, #60a5fa)', borderRadius: 6 }} />
              </div>
            </div>

            {/* 기업회원 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiBuilding2Line style={{ color: '#8b5cf6' }} />
                  <span style={{ fontWeight: 500 }}>기업회원</span>
                </div>
                <span style={{ fontWeight: 600, color: '#8b5cf6' }}>458명 (3.7%)</span>
              </div>
              <div style={{ height: 12, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ width: '3.7%', height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)', borderRadius: 6, minWidth: 20 }} />
              </div>
            </div>

            {/* 월별 가입자 (일반/기업) */}
            <div style={{ marginTop: 32 }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 16, color: '#64748b' }}>이번 달 가입자</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 16, background: '#eff6ff', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4A90D9' }}>1,920</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>일반회원</div>
                </div>
                <div style={{ padding: 16, background: '#f5f3ff', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8b5cf6' }}>180</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>기업회원</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 지역별 분포 & 인구통계 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* 지역별 분포 */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiMapPinLine style={{ color: 'var(--primary-color)' }} />
              지역별 분포
            </h3>
          </div>
          <div style={{ padding: 20, height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                <YAxis dataKey="region" type="category" width={50} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8 }}
                  formatter={(value) => [`${value.toLocaleString()}명`, '회원수']}
                />
                <Bar dataKey="users" fill="#818CF8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 연령대별 분포 */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>연령대별 분포</h3>
          </div>
          <div style={{ padding: 20 }}>
            {ageData.map((item, index) => (
              <div key={index} style={{ marginBottom: index < ageData.length - 1 ? 16 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.875rem' }}>{item.name}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.value}%</span>
                </div>
                <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${item.value}%`, height: '100%', background: item.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 성별 분포 */}
        <div className="card">
          <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>성별 분포</h3>
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 8 }}>
              {genderData.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }} />
                  <span style={{ fontSize: '0.875rem' }}>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 최근 가입 회원 */}
      <div className="card">
        <div className="card-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>최근 가입 회원</h3>
          <button className="btn btn-sm btn-outline">전체 보기</button>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>이름/기업명</th>
                <th>이메일</th>
                <th style={{ width: 100 }}>유형</th>
                <th style={{ width: 150 }}>가입일</th>
                <th style={{ width: 80 }}>상태</th>
              </tr>
            </thead>
            <tbody>
              {recentMembers.map(member => (
                <tr key={member.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: member.type === 'general' ? '#dbeafe' : '#f5f3ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: member.type === 'general' ? '#4A90D9' : '#8b5cf6'
                      }}>
                        {member.type === 'general' ? <RiUserLine /> : <RiBuilding2Line />}
                      </div>
                      <span style={{ fontWeight: 500 }}>{member.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '0.875rem' }}>{member.email}</td>
                  <td>
                    <span
                      className={`badge ${member.type === 'general' ? 'badge-primary' : 'badge-secondary'}`}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {member.type === 'general' ? '일반회원' : '기업회원'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: '#64748b' }}>{member.joinDate}</td>
                  <td>
                    <span
                      className={`badge ${member.status === 'active' ? 'badge-success' : 'badge-warning'}`}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {member.status === 'active' ? '활성' : '승인대기'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MemberStats;
