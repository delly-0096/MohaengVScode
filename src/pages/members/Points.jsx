import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../products/Products.css';
import api from '../../api/api';

function Points() {
  const [activeTab, setActiveTab] = useState('history');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterTarget, setFilterTarget] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [stats, setStats] = useState({
    TOTAL_EARNED: 0,
  TOTAL_USED: 0,
  TOTAL_EXPIRED: 0,
  TOTAL_BALANCE: 0
  });
  
  const [historyData, setHistoryData] = useState({
    dataList: [],
    totalRecord: 0,
    totalPage: 0,
    currentPage: 1,
    pagingHTML: ''
  });
  
  const [summaryData, setSummaryData] = useState({
    dataList: [],
    totalRecord: 0,
    totalPage: 0,
    currentPage: 1,
    pagingHTML: ''
  });

  // 포인트 유형/대상 목록
  const pointTypes = [
    { value: 'all', label: '전체 유형' },
    { value: 'P', label: '적립' },
    { value: 'M', label: '사용' }
  ];
  
  const pointTargets = [
    { value: 'all', label: '전체 대상' },
    { value: 'MEMBER', label: '회원가입' },
    { value: 'TRIP_RECORD', label: '여행기록' },
    { value: 'PAYMENT', label: '결제' },
    { value: 'PROD_REVIEW', label: '상품리뷰' },
    { value: 'REFUND_LOG', label: '환불' },
    { value: 'EVENT', label: '이벤트' }
  ];

// --- 수정 및 통합된 함수부 ---  (함수가 매번 새로 생성되는 것을 방지하기 위해 useCallback 추가)

// 1. 통계 로드 
const loadStats = useCallback(async () => {
  try {
    const response = await api.get('/admin/points/stats');
    console.log("통계 데이터 원본:", response.data);
    if (response.data.success) {
      setStats(response.data.data);
    }
  } catch (error) {
    console.error('통계 조회 실패:', error);
  }
}, []);

//2. 포인트 내역 로드 함수
const loadHistory = useCallback(async () => {
  try {
    const params = {
      searchKeyword: searchTerm || null,
      pointType: filterType === 'all' ? null : filterType,
      pointTarget: filterTarget === 'all' ? null : filterTarget,
      startDate: startDate || null,
      endDate: endDate || null,
      currentPage: currentPage // 서버 변수명(currentPage)에 맞춤
    };
    const response = await api.get('/admin/points/history', { params });
    if (response.data.success) {
      setHistoryData(response.data.paginationVO);
    }
  } catch (error) {
    console.error('포인트 내역 조회 실패:', error);
  }
}, [searchTerm, filterType, filterTarget, startDate, endDate, currentPage]); // 이 변수들이 바뀔 때만 함수 재생성

//3. 회원별 현황 로드 함수
const loadSummary = useCallback(async () => {
  try {
    const params = {
      searchKeyword: searchTerm || null,
      currentPage: currentPage
    };
    const response = await api.get('/admin/points/members', { params });
    if (response.data.success) {
      setSummaryData(response.data.paginationVO);
    }
  } catch (error) {
    console.error('회원 현황 조회 실패:', error);
  }
}, [searchTerm, currentPage]);
  
// --- useEffect (모든 함수가 선언(정의)된 이후 호출) ---

useEffect(() => {
  loadStats();
}, [loadStats]); 

useEffect(() => {
  if (activeTab === 'history') {
    loadHistory();
  } else {
    loadSummary();
  }
}, [activeTab, loadHistory, loadSummary]);
  
//--- 이벤트 핸들러 ---

  // 검색
  const handleSearch = () => {
    setCurrentPage(1);
    if (activeTab === 'history') {
      loadHistory();
    } else {
      loadSummary();
    }
  };

  // 페이지 변경
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // 날짜 포맷
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR');
  };

  // 포인트 포맷
  const formatPoints = (points) => {
    const formatted = new Intl.NumberFormat('ko-KR').format(Math.abs(points));
    if (points >= 0) return `+${formatted}P`;
    return `-${formatted}P`;
  };

  // 포인트 유형 뱃지
  const getTypeBadge = (type) => {
    return type === 'P' ? (
      <span className="point-type-badge earn">적립</span>
    ) : (
      <span className="point-type-badge use">사용</span>
    );
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
            <span className="stat-value">{new Intl.NumberFormat('ko-KR').format(stats.TOTAL_EARNED)}P</span>
            <span className="stat-label">총 발급 포인트</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-bag-check"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{new Intl.NumberFormat('ko-KR').format(stats.TOTAL_USED)}P</span>
            <span className="stat-label">총 사용 포인트</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <i className="bi bi-x-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{new Intl.NumberFormat('ko-KR').format(stats.TOTAL_EXPIRED)}P</span>
            <span className="stat-label">만료 포인트</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="bi bi-wallet2"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{new Intl.NumberFormat('ko-KR').format(stats.TOTAL_BALANCE)}P</span>
            <span className="stat-label">현재 총 잔액</span>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="tab-section">
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => { setActiveTab('history'); setCurrentPage(1); }}
        >
          <i className="bi bi-clock-history"></i> 포인트 내역
        </button>
        <button
          className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => { setActiveTab('summary'); setCurrentPage(1); }}
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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleSearch}>검색</button>
          
          {activeTab === 'history' && (
            <>
              <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}>
                {pointTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <select value={filterTarget} onChange={(e) => { setFilterTarget(e.target.value); setCurrentPage(1); }}>
                {pointTargets.map(target => (
                  <option key={target.value} value={target.value}>{target.label}</option>
                ))}
              </select>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
              />
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
              />
            </>
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
                <th>대상</th>
                <th>내용</th>
                <th>포인트</th>
                <th>잔액</th>
                <th>만료일</th>
              </tr>
            </thead>
            <tbody>
              {historyData.dataList && historyData.dataList.length > 0 ? (
                historyData.dataList.map((point, index) => (
                  <tr key={index}>
                    <td>
                      <div>{formatDate(point.regDt)}</div>
                      <small className="text-muted">{new Date(point.regDt).toLocaleTimeString('ko-KR')}</small>
                    </td>
                    <td>
                      <div>{point.memName}</div>
                      <small className="text-muted">{point.memEmail}</small>
                    </td>
                    <td>{getTypeBadge(point.pointType)}</td>
                    <td>{point.pointTarget || '-'}</td>
                    <td>
                      <div className="description-cell">
                        {point.pointDesc}
                        {point.pointTargetId && <small className="text-muted d-block">ID: {point.pointTargetId}</small>}
                      </div>
                    </td>
                    <td>
                      <span className={`point-amount ${point.pointAmt >= 0 ? 'positive' : 'negative'}`}>
                        {formatPoints(point.pointAmt)}
                      </span>
                    </td>
                    <td>{new Intl.NumberFormat('ko-KR').format(point.currentBalance)}P</td>
                    <td>{formatDate(point.pntExpireDt)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="empty-state">
                      <i className="bi bi-coin"></i>
                      <p>조건에 맞는 포인트 내역이 없습니다.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          {historyData.dataList && historyData.dataList.length > 0 && (
            <div 
              className="pagination-container" 
              dangerouslySetInnerHTML={{ __html: historyData.pagingHTML }}
              onClick={(e) => {
                if (e.target.tagName === 'A') {
                  e.preventDefault();
                  const page = e.target.getAttribute('data-page');
                  if (page) handlePageClick(parseInt(page));
                }
              }}
            />
          )}
        </div>
      )}

      {/* 회원별 현황 탭 */}
      {activeTab === 'summary' && (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>회원번호</th>
                <th>회원명</th>
                <th>이메일</th>
                <th>보유 포인트</th>
                <th>이달 적립</th>
                <th>이달 사용</th>
                <th>만료 예정</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.dataList && summaryData.dataList.length > 0 ? (
                summaryData.dataList.map((member, index) => (
                  <tr key={index}>
                    <td>{member.memNo}</td>
                    <td>{member.memName}</td>
                    <td>{member.memEmail}</td>
                    <td>
                      <span className="point-amount positive">
                        {new Intl.NumberFormat('ko-KR').format(member.totalPoints)}P
                      </span>
                    </td>
                    <td>+{new Intl.NumberFormat('ko-KR').format(member.earnedThisMonth)}P</td>
                    <td>-{new Intl.NumberFormat('ko-KR').format(member.usedThisMonth)}P</td>
                    <td>
                      {member.expireSoonPoint > 0 ? (
                        <span className="text-warning">
                          {new Intl.NumberFormat('ko-KR').format(member.expireSoonPoint)}P
                        </span>
                      ) : '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="empty-state">
                      <i className="bi bi-people"></i>
                      <p>조건에 맞는 회원이 없습니다.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          {summaryData.dataList && summaryData.dataList.length > 0 && (
            <div 
              className="pagination-container" 
              dangerouslySetInnerHTML={{ __html: summaryData.pagingHTML }}
              onClick={(e) => {
                if (e.target.tagName === 'A') {
                  e.preventDefault();
                  const page = e.target.getAttribute('data-page');
                  if (page) handlePageClick(parseInt(page));
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Points;