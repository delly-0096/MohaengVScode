import { useState } from 'react';
import '../products/Products.css';

// 샘플 포인트 내역 데이터
const initialPointsData = [
  {
    id: 1,
    memberId: 'M001',
    memberName: '김지민',
    memberEmail: 'jimin@email.com',
    type: '적립',
    category: '예약완료',
    amount: 5000,
    balance: 15000,
    description: '제주 스쿠버다이빙 체험 예약 완료',
    relatedId: 'R2024031501',
    createdAt: '2024-03-15 14:35:00',
    expiryDate: '2025-03-15'
  },
  {
    id: 2,
    memberId: 'M002',
    memberName: '이수현',
    memberEmail: 'suhyun@email.com',
    type: '사용',
    category: '예약결제',
    amount: -10000,
    balance: 25000,
    description: '부산 해운대 리조트 예약 결제 시 사용',
    relatedId: 'R2024031502',
    createdAt: '2024-03-14 09:20:00',
    expiryDate: null
  },
  {
    id: 3,
    memberId: 'M003',
    memberName: '박민준',
    memberEmail: 'minjun@email.com',
    type: '적립',
    category: '리뷰작성',
    amount: 500,
    balance: 8500,
    description: '서울-제주 항공편 리뷰 작성',
    relatedId: 'RV20240314001',
    createdAt: '2024-03-14 16:50:00',
    expiryDate: '2025-03-14'
  },
  {
    id: 4,
    memberId: 'M001',
    memberName: '김지민',
    memberEmail: 'jimin@email.com',
    type: '적립',
    category: '회원가입',
    amount: 3000,
    balance: 10000,
    description: '신규 회원가입 축하 포인트',
    relatedId: null,
    createdAt: '2024-03-10 10:00:00',
    expiryDate: '2025-03-10'
  },
  {
    id: 5,
    memberId: 'M004',
    memberName: '최유진',
    memberEmail: 'yujin@email.com',
    type: '만료',
    category: '기간만료',
    amount: -2000,
    balance: 5000,
    description: '유효기간 만료 포인트 소멸',
    relatedId: null,
    createdAt: '2024-03-01 00:00:00',
    expiryDate: null
  },
  {
    id: 6,
    memberId: 'M005',
    memberName: '정다은',
    memberEmail: 'daeun@email.com',
    type: '적립',
    category: '이벤트',
    amount: 10000,
    balance: 22000,
    description: '봄맞이 더블포인트 이벤트 적립',
    relatedId: 'EV20240301',
    createdAt: '2024-03-05 12:00:00',
    expiryDate: '2024-06-05'
  },
  {
    id: 7,
    memberId: 'M006',
    memberName: '한서준',
    memberEmail: 'seojun@email.com',
    type: '조정',
    category: '관리자조정',
    amount: 5000,
    balance: 18000,
    description: '고객 불편 보상 포인트 지급',
    relatedId: 'INQ20240310',
    createdAt: '2024-03-12 15:30:00',
    expiryDate: '2025-03-12'
  },
  {
    id: 8,
    memberId: 'M002',
    memberName: '이수현',
    memberEmail: 'suhyun@email.com',
    type: '적립',
    category: '추천인',
    amount: 2000,
    balance: 35000,
    description: '친구 추천 적립 (추천인: 박민준)',
    relatedId: 'REF20240308',
    createdAt: '2024-03-08 11:20:00',
    expiryDate: '2025-03-08'
  }
];

// 회원별 포인트 요약 데이터
const memberPointsSummary = [
  { memberId: 'M001', memberName: '김지민', memberEmail: 'jimin@email.com', totalPoints: 15000, usedPoints: 5000, expiringSoon: 3000 },
  { memberId: 'M002', memberName: '이수현', memberEmail: 'suhyun@email.com', totalPoints: 35000, usedPoints: 15000, expiringSoon: 2000 },
  { memberId: 'M003', memberName: '박민준', memberEmail: 'minjun@email.com', totalPoints: 8500, usedPoints: 1500, expiringSoon: 500 },
  { memberId: 'M004', memberName: '최유진', memberEmail: 'yujin@email.com', totalPoints: 5000, usedPoints: 8000, expiringSoon: 0 },
  { memberId: 'M005', memberName: '정다은', memberEmail: 'daeun@email.com', totalPoints: 22000, usedPoints: 3000, expiringSoon: 10000 },
  { memberId: 'M006', memberName: '한서준', memberEmail: 'seojun@email.com', totalPoints: 18000, usedPoints: 2000, expiringSoon: 5000 }
];

function Points() {
  const [pointsData, setPointsData] = useState(initialPointsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'summary'
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [adjustmentData, setAdjustmentData] = useState({
    type: '적립',
    amount: 0,
    description: '',
    expiryMonths: 12
  });

  // 통계 계산
  const stats = {
    totalIssued: pointsData.filter(p => p.type === '적립' || p.type === '조정').reduce((sum, p) => sum + Math.abs(p.amount), 0),
    totalUsed: pointsData.filter(p => p.type === '사용').reduce((sum, p) => sum + Math.abs(p.amount), 0),
    totalExpired: pointsData.filter(p => p.type === '만료').reduce((sum, p) => sum + Math.abs(p.amount), 0),
    totalBalance: memberPointsSummary.reduce((sum, m) => sum + m.totalPoints, 0)
  };

  // 포인트 유형 목록
  const pointTypes = ['적립', '사용', '만료', '조정'];

  // 카테고리 목록
  const categories = ['예약완료', '예약결제', '리뷰작성', '회원가입', '기간만료', '이벤트', '관리자조정', '추천인'];

  // 필터링된 포인트 내역
  const filteredHistory = pointsData.filter(point => {
    const matchesSearch = point.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         point.memberEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         point.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || point.type === filterType;
    const matchesCategory = filterCategory === 'all' || point.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  // 필터링된 회원 요약
  const filteredSummary = memberPointsSummary.filter(member =>
    member.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.memberEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 포인트 조정 모달 열기
  const openAdjustModal = (member) => {
    setSelectedMember(member);
    setAdjustmentData({
      type: '적립',
      amount: 0,
      description: '',
      expiryMonths: 12
    });
    setIsAdjustModalOpen(true);
  };

  // 포인트 조정 처리
  const processAdjustment = () => {
    const newPoint = {
      id: Math.max(...pointsData.map(p => p.id)) + 1,
      memberId: selectedMember.memberId,
      memberName: selectedMember.memberName,
      memberEmail: selectedMember.memberEmail,
      type: adjustmentData.type === '차감' ? '사용' : '조정',
      category: '관리자조정',
      amount: adjustmentData.type === '차감' ? -adjustmentData.amount : adjustmentData.amount,
      balance: selectedMember.totalPoints + (adjustmentData.type === '차감' ? -adjustmentData.amount : adjustmentData.amount),
      description: adjustmentData.description || '관리자 포인트 조정',
      relatedId: null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      expiryDate: adjustmentData.type === '적립' ? getExpiryDate(adjustmentData.expiryMonths) : null
    };

    setPointsData(prev => [newPoint, ...prev]);
    setIsAdjustModalOpen(false);
  };

  // 만료일 계산
  const getExpiryDate = (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  // 금액 포맷
  const formatPoints = (points) => {
    const formatted = new Intl.NumberFormat('ko-KR').format(Math.abs(points));
    if (points >= 0) return `+${formatted}P`;
    return `-${formatted}P`;
  };

  // 포인트 유형 색상
  const getTypeClass = (type) => {
    switch (type) {
      case '적립': return 'earn';
      case '사용': return 'use';
      case '만료': return 'expired';
      case '조정': return 'adjust';
      default: return '';
    }
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>포인트 관리</h1>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="bi bi-plus-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{new Intl.NumberFormat('ko-KR').format(stats.totalIssued)}P</span>
            <span className="stat-label">총 발급 포인트</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-bag-check"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{new Intl.NumberFormat('ko-KR').format(stats.totalUsed)}P</span>
            <span className="stat-label">총 사용 포인트</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <i className="bi bi-x-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{new Intl.NumberFormat('ko-KR').format(stats.totalExpired)}P</span>
            <span className="stat-label">만료 포인트</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="bi bi-wallet2"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{new Intl.NumberFormat('ko-KR').format(stats.totalBalance)}P</span>
            <span className="stat-label">현재 총 잔액</span>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="tab-section">
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <i className="bi bi-clock-history"></i> 포인트 내역
        </button>
        <button
          className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          <i className="bi bi-people"></i> 회원별 현황
        </button>
      </div>

      {/* 필터 및 검색 */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder={activeTab === 'history' ? '회원명, 이메일, 설명 검색...' : '회원명, 이메일 검색...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {activeTab === 'history' && (
            <div className="filter-group">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">전체 유형</option>
                {pointTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all">전체 카테고리</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 포인트 내역 탭 */}
      {activeTab === 'history' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>일시</th>
                <th>회원</th>
                <th>유형</th>
                <th>카테고리</th>
                <th>내용</th>
                <th>포인트</th>
                <th>잔액</th>
                <th>만료일</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(point => (
                <tr key={point.id}>
                  <td>
                    <div>{point.createdAt.split(' ')[0]}</div>
                    <small className="text-muted">{point.createdAt.split(' ')[1]}</small>
                  </td>
                  <td>
                    <div>{point.memberName}</div>
                    <small className="text-muted">{point.memberEmail}</small>
                  </td>
                  <td>
                    <span className={`point-type-badge ${getTypeClass(point.type)}`}>
                      {point.type}
                    </span>
                  </td>
                  <td>{point.category}</td>
                  <td>
                    <div className="description-cell">
                      {point.description}
                      {point.relatedId && <small className="text-muted d-block">{point.relatedId}</small>}
                    </div>
                  </td>
                  <td>
                    <span className={`point-amount ${point.amount >= 0 ? 'positive' : 'negative'}`}>
                      {formatPoints(point.amount)}
                    </span>
                  </td>
                  <td>{new Intl.NumberFormat('ko-KR').format(point.balance)}P</td>
                  <td>{point.expiryDate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredHistory.length === 0 && (
            <div className="empty-state">
              <i className="bi bi-coin"></i>
              <p>조건에 맞는 포인트 내역이 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* 회원별 현황 탭 */}
      {activeTab === 'summary' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>회원 ID</th>
                <th>회원명</th>
                <th>이메일</th>
                <th>보유 포인트</th>
                <th>사용 포인트</th>
                <th>만료 예정</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredSummary.map(member => (
                <tr key={member.memberId}>
                  <td>{member.memberId}</td>
                  <td>{member.memberName}</td>
                  <td>{member.memberEmail}</td>
                  <td>
                    <span className="point-amount positive">
                      {new Intl.NumberFormat('ko-KR').format(member.totalPoints)}P
                    </span>
                  </td>
                  <td>{new Intl.NumberFormat('ko-KR').format(member.usedPoints)}P</td>
                  <td>
                    {member.expiringSoon > 0 ? (
                      <span className="text-warning">
                        {new Intl.NumberFormat('ko-KR').format(member.expiringSoon)}P
                      </span>
                    ) : '-'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="포인트 조정" onClick={() => openAdjustModal(member)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn-icon" title="내역 조회">
                        <i className="bi bi-list-ul"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSummary.length === 0 && (
            <div className="empty-state">
              <i className="bi bi-people"></i>
              <p>조건에 맞는 회원이 없습니다.</p>
            </div>
          )}
        </div>
      )}

      {/* 포인트 조정 모달 */}
      {isAdjustModalOpen && selectedMember && (
        <div className="modal-overlay" onClick={() => setIsAdjustModalOpen(false)}>
          <div className="modal-content small" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>포인트 조정</h2>
              <button className="modal-close" onClick={() => setIsAdjustModalOpen(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="member-info-box">
                <p><strong>회원:</strong> {selectedMember.memberName} ({selectedMember.memberEmail})</p>
                <p><strong>현재 잔액:</strong> {new Intl.NumberFormat('ko-KR').format(selectedMember.totalPoints)}P</p>
              </div>

              <div className="form-group">
                <label>조정 유형 *</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="adjustType"
                      value="적립"
                      checked={adjustmentData.type === '적립'}
                      onChange={(e) => setAdjustmentData(prev => ({ ...prev, type: e.target.value }))}
                    />
                    적립 (지급)
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="adjustType"
                      value="차감"
                      checked={adjustmentData.type === '차감'}
                      onChange={(e) => setAdjustmentData(prev => ({ ...prev, type: e.target.value }))}
                    />
                    차감 (회수)
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>포인트 *</label>
                <input
                  type="number"
                  value={adjustmentData.amount}
                  onChange={(e) => setAdjustmentData(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                  min="0"
                  placeholder="조정할 포인트를 입력하세요"
                />
              </div>

              {adjustmentData.type === '적립' && (
                <div className="form-group">
                  <label>유효기간</label>
                  <select
                    value={adjustmentData.expiryMonths}
                    onChange={(e) => setAdjustmentData(prev => ({ ...prev, expiryMonths: parseInt(e.target.value) }))}
                  >
                    <option value="3">3개월</option>
                    <option value="6">6개월</option>
                    <option value="12">12개월</option>
                    <option value="24">24개월</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>사유 *</label>
                <textarea
                  value={adjustmentData.description}
                  onChange={(e) => setAdjustmentData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="조정 사유를 입력하세요"
                  rows="3"
                />
              </div>

              <div className="result-preview">
                <p>조정 후 예상 잔액: <strong>
                  {new Intl.NumberFormat('ko-KR').format(
                    selectedMember.totalPoints + (adjustmentData.type === '차감' ? -adjustmentData.amount : adjustmentData.amount)
                  )}P
                </strong></p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsAdjustModalOpen(false)}>취소</button>
              <button
                className="btn btn-primary"
                onClick={processAdjustment}
                disabled={adjustmentData.amount <= 0 || !adjustmentData.description.trim()}
              >
                조정 적용
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Points;
