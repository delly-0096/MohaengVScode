import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  RiRobotLine,
  RiLineChartLine,
  RiRefreshLine,
  RiPlayLine,
  RiPauseLine,
  RiSettings4Line,
  RiBookmarkLine,
  RiEmotionHappyLine,
  RiCalendarLine,
  RiMapPinLine,
  RiStarFill,
  RiThumbUpLine,
  RiThumbDownLine
} from 'react-icons/ri';
import { Modal } from '../../components/common/Modal';

// 기간별 알고리즘 성능 데이터
const algorithmMetrics = [
  { date: '12/12', generated: 324, saved: 267, satisfaction: 4.2, regenerate: 45 },
  { date: '12/13', generated: 356, saved: 298, satisfaction: 4.3, regenerate: 42 },
  { date: '12/14', generated: 412, saved: 351, satisfaction: 4.4, regenerate: 38 },
  { date: '12/15', generated: 389, saved: 332, satisfaction: 4.3, regenerate: 41 },
  { date: '12/16', generated: 445, saved: 389, satisfaction: 4.5, regenerate: 35 },
  { date: '12/17', generated: 478, saved: 421, satisfaction: 4.6, regenerate: 32 },
  { date: '12/18', generated: 502, saved: 458, satisfaction: 4.6, regenerate: 28 }
];

// 추천 유형별 성과
const recommendationTypes = [
  { type: '선호도 기반', count: 45280, success: 38920, rate: 86.0 },
  { type: '협업 필터링', count: 32150, success: 27890, rate: 86.8 },
  { type: '콘텐츠 기반', count: 28560, success: 22850, rate: 80.0 },
  { type: '시즌/트렌드', count: 18920, success: 16230, rate: 85.8 },
  { type: '인기 여행지', count: 15680, success: 12890, rate: 82.2 }
];

// 여행지별 추천 성과
const destinationPerformance = [
  { id: 1, destination: '제주도', recommendations: 12450, saves: 10823, saveRate: 86.9, avgSatisfaction: 4.7, regenerateRate: 8.2 },
  { id: 2, destination: '부산', recommendations: 8920, saves: 7582, saveRate: 85.0, avgSatisfaction: 4.5, regenerateRate: 9.5 },
  { id: 3, destination: '강릉', recommendations: 6540, saves: 5559, saveRate: 85.0, avgSatisfaction: 4.4, regenerateRate: 10.1 },
  { id: 4, destination: '경주', recommendations: 5230, saves: 4445, saveRate: 85.0, avgSatisfaction: 4.6, regenerateRate: 8.8 },
  { id: 5, destination: '여수', recommendations: 4120, saves: 3461, saveRate: 84.0, avgSatisfaction: 4.5, regenerateRate: 9.2 }
];

// 알고리즘 설정
const algorithmSettings = [
  { id: 1, name: '선호도 기반 추천', description: '사용자의 여행 스타일, 관심사, 이전 선택 기반 맞춤 추천', status: 'active', weight: 35 },
  { id: 2, name: '협업 필터링', description: '유사한 취향의 사용자 그룹이 선호하는 여행지 추천', status: 'active', weight: 25 },
  { id: 3, name: '콘텐츠 기반 필터링', description: '여행지/상품의 특성(카테고리, 테마) 기반 유사 상품 추천', status: 'active', weight: 20 },
  { id: 4, name: '시즌/트렌드 추천', description: '계절, 휴일, 실시간 트렌드 반영 추천', status: 'active', weight: 15 },
  { id: 5, name: '인기 여행지 추천', description: '신규 사용자를 위한 인기/평점 기반 콜드스타트 해결', status: 'paused', weight: 5 }
];

// 만족도 분포 데이터
const satisfactionDistribution = [
  { rating: 5, count: 1245, percent: 45 },
  { rating: 4, count: 892, percent: 32 },
  { rating: 3, count: 423, percent: 15 },
  { rating: 2, count: 156, percent: 6 },
  { rating: 1, count: 56, percent: 2 }
];

// 자주 사용되는 피드백 키워드
const feedbackKeywords = [
  { keyword: '일정이 알차요', count: 456, type: 'positive' },
  { keyword: '이동 경로 좋아요', count: 389, type: 'positive' },
  { keyword: '맛집 추천 최고', count: 312, type: 'positive' },
  { keyword: '시간 배분 적절', count: 278, type: 'positive' },
  { keyword: '더 다양한 추천 원해요', count: 145, type: 'negative' },
  { keyword: '이동 시간 길어요', count: 98, type: 'negative' }
];

function Algorithm() {
  const [settings, setSettings] = useState(algorithmSettings);
  const [settingsModal, setSettingsModal] = useState({ isOpen: false, algo: null });
  const [editForm, setEditForm] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [dateRange, setDateRange] = useState({ start: '2024-12-12', end: '2024-12-18' });

  const periods = [
    { id: 'today', label: '오늘' },
    { id: 'week', label: '이번 주' },
    { id: 'month', label: '이번 달' },
    { id: '3months', label: '최근 3개월' }
  ];

  const toggleStatus = (id) => {
    setSettings(settings.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s));
  };

  const handleSettings = (algo) => {
    setEditForm({ ...algo });
    setSettingsModal({ isOpen: true, algo });
  };

  const handleSettingsSave = () => {
    setSettings(prev => prev.map(s => s.id === editForm.id ? editForm : s));
    setSettingsModal({ isOpen: false, algo: null });
    alert('알고리즘 설정이 저장되었습니다.');
  };

  // 통계 계산
  const totalGenerated = algorithmMetrics.reduce((sum, d) => sum + d.generated, 0);
  const totalSaved = algorithmMetrics.reduce((sum, d) => sum + d.saved, 0);
  const avgSatisfaction = (algorithmMetrics.reduce((sum, d) => sum + d.satisfaction, 0) / algorithmMetrics.length).toFixed(1);
  const avgRegenerateRate = (algorithmMetrics.reduce((sum, d) => sum + d.regenerate, 0) / algorithmMetrics.length).toFixed(1);
  const saveRate = ((totalSaved / totalGenerated) * 100).toFixed(1);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">AI 추천 알고리즘</h1>
          <p className="page-subtitle">AI 여행 일정 추천 시스템 성능 모니터링 및 설정</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary"><RiRefreshLine /> 모델 재학습</button>
        </div>
      </div>

      {/* 기간 선택 */}
      <div className="card mb-3">
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {periods.map(period => (
                <button
                  key={period.id}
                  className={`btn ${selectedPeriod === period.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedPeriod(period.id)}
                  style={{ padding: '8px 16px' }}
                >
                  {period.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiCalendarLine />
              <input
                type="date"
                className="form-input"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                style={{ padding: '8px 12px' }}
              />
              <span>~</span>
              <input
                type="date"
                className="form-input"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                style={{ padding: '8px 12px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid mb-3">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)', color: 'white' }}>
            <RiRobotLine />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalGenerated.toLocaleString()}</div>
            <div className="stat-label">AI 추천 일정 생성</div>
            <div className="stat-change positive">+12.5%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)', color: 'white' }}>
            <RiBookmarkLine />
          </div>
          <div className="stat-content">
            <div className="stat-value">{saveRate}%</div>
            <div className="stat-label">일정 저장율</div>
            <div className="stat-change positive">+3.2%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)', color: 'white' }}>
            <RiEmotionHappyLine />
          </div>
          <div className="stat-content">
            <div className="stat-value">{avgSatisfaction}</div>
            <div className="stat-label">평균 만족도</div>
            <div className="stat-change positive">+0.3</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)', color: 'white' }}>
            <RiRefreshLine />
          </div>
          <div className="stat-content">
            <div className="stat-value">{avgRegenerateRate}건</div>
            <div className="stat-label">일 평균 재추천 요청</div>
            <div className="stat-change negative">-15.2%</div>
          </div>
        </div>
      </div>

      {/* 차트 섹션 */}
      <div className="grid-2 mb-3">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">일정 생성 및 저장 추이</h3>
          </div>
          <div className="card-body" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={algorithmMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="generated" name="생성" stroke="#818CF8" fill="#818CF8" fillOpacity={0.3} />
                <Area type="monotone" dataKey="saved" name="저장" stroke="#34D399" fill="#34D399" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">추천 유형별 성과</h3>
          </div>
          <div className="card-body" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recommendationTypes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={90} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="추천수" fill="#94A3B8" radius={[0, 4, 4, 0]} />
                <Bar dataKey="success" name="저장수" fill="#34D399" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 여행지별 추천 성과 */}
      <div className="card mb-3">
        <div className="card-header">
          <h3 className="card-title">여행지별 추천 성과</h3>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>순위</th>
                <th>여행지</th>
                <th>추천수</th>
                <th>저장수</th>
                <th>저장율</th>
                <th>평균 만족도</th>
                <th>재추천율</th>
              </tr>
            </thead>
            <tbody>
              {destinationPerformance.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: index < 3 ? (index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32') : '#E5E7EB',
                      color: index < 3 ? 'white' : '#6B7280',
                      fontWeight: 600,
                      fontSize: 14
                    }}>
                      {index + 1}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <RiMapPinLine style={{ color: 'var(--primary-color)' }} />
                      <span className="font-medium">{item.destination}</span>
                    </div>
                  </td>
                  <td>{item.recommendations.toLocaleString()}</td>
                  <td>{item.saves.toLocaleString()}</td>
                  <td>
                    <span style={{ color: 'var(--success-color)', fontWeight: 500 }}>
                      {item.saveRate}%
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <RiStarFill style={{ color: '#FBBF24' }} />
                      <span style={{ fontWeight: 500 }}>{item.avgSatisfaction}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: item.regenerateRate > 10 ? 'var(--danger-color)' : 'var(--text-secondary)' }}>
                      {item.regenerateRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 사용자 만족도 분석 */}
      <div className="card mb-3">
        <div className="card-header">
          <h3 className="card-title">사용자 만족도 분석</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 32 }}>
            {/* 평균 만족도 */}
            <div style={{ textAlign: 'center', padding: 24 }}>
              <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--primary-color)' }}>
                {avgSatisfaction}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 4, margin: '8px 0' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <RiStarFill
                    key={star}
                    style={{
                      color: star <= Math.round(parseFloat(avgSatisfaction)) ? '#FBBF24' : '#E5E7EB',
                      fontSize: 24
                    }}
                  />
                ))}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                총 {satisfactionDistribution.reduce((sum, d) => sum + d.count, 0).toLocaleString()}개 평가
              </div>
            </div>

            {/* 평점 분포 */}
            <div>
              <h4 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>평점 분포</h4>
              {satisfactionDistribution.map(item => (
                <div key={item.rating} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: 60 }}>
                    <RiStarFill style={{ color: '#FBBF24', fontSize: 14 }} />
                    <span style={{ fontSize: 14 }}>{item.rating}</span>
                  </div>
                  <div style={{ flex: 1, height: 20, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      width: `${item.percent}%`,
                      height: '100%',
                      background: item.rating >= 4 ? '#34D399' : item.rating === 3 ? '#FBBF24' : '#F87171',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <span style={{ width: 60, textAlign: 'right', fontSize: 14, color: 'var(--text-muted)' }}>
                    {item.percent}%
                  </span>
                </div>
              ))}
            </div>

            {/* 자주 사용되는 피드백 */}
            <div>
              <h4 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>자주 사용되는 피드백</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {feedbackKeywords.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    background: item.type === 'positive' ? '#D1FAE5' : '#FEE2E2',
                    borderRadius: 8,
                    fontSize: 13
                  }}>
                    {item.type === 'positive' ?
                      <RiThumbUpLine style={{ color: '#059669' }} /> :
                      <RiThumbDownLine style={{ color: '#DC2626' }} />
                    }
                    <span style={{ flex: 1, color: item.type === 'positive' ? '#059669' : '#DC2626' }}>
                      {item.keyword}
                    </span>
                    <span style={{
                      fontSize: 12,
                      color: item.type === 'positive' ? '#059669' : '#DC2626',
                      fontWeight: 500
                    }}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 알고리즘 설정 */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">추천 알고리즘 설정</h3>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>알고리즘</th>
                <th>설명</th>
                <th>가중치</th>
                <th>상태</th>
                <th style={{ width: 100 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {settings.map(algo => (
                <tr key={algo.id} style={{ opacity: algo.status === 'active' ? 1 : 0.6 }}>
                  <td className="font-medium">{algo.name}</td>
                  <td className="text-secondary" style={{ fontSize: 13 }}>{algo.description}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 100, height: 8, background: '#E5E7EB', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${algo.weight}%`, height: '100%', background: '#818CF8' }} />
                      </div>
                      <span style={{ minWidth: 36 }}>{algo.weight}%</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${algo.status === 'active' ? 'badge-success' : 'badge-warning'}`}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {algo.status === 'active' ? '활성' : '일시중지'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="table-action-btn"
                        onClick={() => toggleStatus(algo.id)}
                        title={algo.status === 'active' ? '일시중지' : '활성화'}
                      >
                        {algo.status === 'active' ?
                          <RiPauseLine style={{ color: 'var(--warning-color)' }} /> :
                          <RiPlayLine style={{ color: 'var(--success-color)' }} />
                        }
                      </button>
                      <button
                        className="table-action-btn"
                        onClick={() => handleSettings(algo)}
                        title="설정"
                      >
                        <RiSettings4Line />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 알고리즘 설정 모달 */}
      <Modal
        isOpen={settingsModal.isOpen}
        onClose={() => setSettingsModal({ isOpen: false, algo: null })}
        title="알고리즘 설정"
        size="medium"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setSettingsModal({ isOpen: false, algo: null })}>취소</button>
            <button className="btn btn-primary" onClick={handleSettingsSave}>저장</button>
          </>
        }
      >
        {settingsModal.algo && (
          <div>
            <div style={{ padding: '16px', background: 'var(--bg-color)', borderRadius: 8, marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{editForm.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{editForm.description}</div>
            </div>

            <div className="form-group">
              <label className="form-label">가중치 설정</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editForm.weight || 0}
                  onChange={(e) => setEditForm({ ...editForm, weight: parseInt(e.target.value) })}
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  className="form-input"
                  value={editForm.weight || 0}
                  onChange={(e) => setEditForm({ ...editForm, weight: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                  style={{ width: 80, textAlign: 'center' }}
                />
                <span>%</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                가중치는 전체 추천 시스템에서 해당 알고리즘이 차지하는 비율입니다.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">알고리즘 상태</label>
              <select
                className="form-input form-select"
                value={editForm.status || 'active'}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                <option value="active">활성</option>
                <option value="paused">일시중지</option>
              </select>
            </div>

            <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-color)', borderRadius: 8 }}>
              <h4 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>알고리즘 성능 지표</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>저장율</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--success-color)' }}>{saveRate}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>평균 만족도</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--primary-color)' }}>{avgSatisfaction}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>일 생성수</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--warning-color)' }}>
                    {Math.round(totalGenerated / 7)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>응답시간</div>
                  <div style={{ fontSize: 20, fontWeight: 600 }}>45ms</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Algorithm;
