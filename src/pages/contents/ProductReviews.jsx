/* 
useState (상태 관리자)  "바뀌는 데이터를 저장할 때 사용하는 바구니" ex)게임 점수판
useEffect (행동 대장)   "특정한 타이밍에 실행되는 작업을 담은 코드"  React 컴포넌트가 화면에 그려진 후(렌더링 이후) 처리할 일을 명령 내리는 공간
useCallback (기억력 대장) "함수를 재사용하기 위한 메모리" ex)예전에 적은 레시피 카드
*/ 

import { useState, useEffect, useCallback } from 'react';

import {
  RiSearchLine,
  RiFilterLine,
  RiStarLine,
  RiStarFill,
  RiUserLine,
  RiBuilding2Line,
  RiShoppingBagLine,
  RiEyeLine,
  RiDeleteBinLine,
  RiAlertLine,
  RiCalendarLine,
  RiImageLine,
  RiThumbUpLine,
  RiThumbDownLine,
  RiCheckLine,
  RiFlagLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';
import api from '../../api/api'; //우리 서버와 대화하기 위한 전용 통로. api.js 파일 참조

// 평점 필터
const ratingFilters = [
  { id: 'all', label: '전체' },
  { id: '5', label: '5점' },
  { id: '4', label: '4점' },
  { id: '3', label: '3점' },
  { id: '2', label: '2점' },
  { id: '1', label: '1점' }
];

// 상태 필터
const statuses = [
  { id: 'all', label: '전체 상태' },
  { id: 'active', label: '게시중' },
  { id: 'hidden', label: '숨김' },
  { id: 'reported', label: '신고됨' }
];

const productTypeLabels = {
  ticket: '티켓/입장권',
  tour: '투어/체험',
  accommodation: '숙박',
  flight: '항공',
  rental: '렌터카',
  // 필요한 다른 타입 추가
};

const statusLabels = {
  ACTIVE: { text: '게시중', class: 'badge-success' },
  HIDDEN: { text: '숨김', class: 'badge-secondary' },
  REPORTED: { text: '신고됨', class: 'badge-danger' }
};

function ProductReviews() {

  // 상태 저장소 (화면에 보여줄 데이터를 저장하고, 그 값이 변할 때마다 화면을 자동으로 다시 그려줌)

  // 검색 및 필터링 
  const [searchWord, setSearchWord] = useState(''); // 실제 검색에 사용
  const [searchInput, setSearchInput] = useState('');   // 입력창 표시용
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // 기간 선택
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const periods = [
    { id: 'today', label: '오늘' },
    { id: 'week', label: '이번 주' },
    { id: 'month', label: '이번 달' },
    { id: '3months', label: '최근 3개월' }
  ];

  // 페이지 관리 (현재 내가 보고 있는 페이지 번호)
  const [currentPage, setCurrentPage] = useState(1);
 
  // 통계 및 요약 데이터
  const [stats, setStats] = useState({
    totalCount: 0,
    avgRating: 0,
    totalRecommendCount: 0,
    reportedCount: 0
  });

  // 평점별 개수 데이터
  const [ratingCounts, setRatingCounts] = useState({
    all: 0,
    rating1: 0,
    rating2: 0,
    rating3: 0,
    rating4: 0,
    rating5: 0
  });

  // 서버에서 받아 온 실제 상품 리뷰 목록 데이터
  const [reviewData, setReviewData] = useState({
    dataList: [],
    totalRecord: 0,
    totalPage: 0,
    currentPage: 1,
    pagingHTML: ''
  });

  // 팝업창(모달) 제어
  const [detailModal, setDetailModal] = useState({ isOpen: false, review: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, review: null });
  const [actionModal, setActionModal] = useState({ isOpen: false, review: null, action: '' });// 상태 변경(숨김/게시) 창
  
  //  API 호출 함수들  --------------------------------------------------------------------------------
  /* 
  API란 : 서버와 프론트의 중간에서 주문을 전달해주는 통로
  API호출 함수들 : 이제부터 서버에 데이터를 달라고 주문을 넣는 코드 작성하겠다는 뜻
  */

  // 통계 가져오기
  const loadStats = useCallback(async (customStartDate, customEndDate) => {
    try {
      const params = {
        startDate: customStartDate || startDate || null,
        endDate: customEndDate || endDate || null
      };
      const response = await api.get('/admin/reviews/statistics', { params });
      console.log('통계 데이터:', response.data);
      if (response.data) {setStats(response.data);}
    } catch (error) {
      console.error('통계 조회 실패:', error);
    }
  }, [startDate, endDate]);

  // 평점별 개수 가져오기
  const loadRatingCounts= useCallback(async(customStartDate, customEndDate)=>{
    try {
      const params = {
        startDate: customStartDate || startDate || null, 
        endDate: customEndDate || endDate || null
      };
      const response = await api.get('/admin/reviews/rating-counts', { params });
      if (response.data){setRatingCounts(response.data)}
    }catch(error){
      console.error('평점별 개수 조회 실패:', error);
    }
  },[startDate, endDate]);

  // 리뷰 목록 가져오기
  const loadReviews = useCallback(async (options = {}) => {
    try {
      const params = {
        searchKeyword: options.searchKeyword !== undefined ? options.searchKeyword : searchWord || null,
        ratingFilter: options.ratingFilter !== undefined ? 
          (options.ratingFilter === 'all' ? null : parseInt(options.ratingFilter)) :
          (ratingFilter === 'all' ? null : parseInt(ratingFilter)),
        statusFilter: options.statusFilter !== undefined ?
          (options.statusFilter === 'all' ? null : options.statusFilter) :
          (statusFilter === 'all' ? null : statusFilter),
        startDate: options.startDate !== undefined ? options.startDate : startDate || null,
        endDate: options.endDate !== undefined ? options.endDate : endDate || null,
        currentPage: options.currentPage !== undefined ? options.currentPage : currentPage
      };
      const response = await api.get('/admin/reviews', { params });
      console.log('리뷰 목록:', response.data);
      if (response.data) {
        setReviewData(response.data);
      }
    } catch (error) {
      console.error('리뷰 목록 조회 실패:', error);
    }
  },[searchWord, ratingFilter, statusFilter, startDate, endDate, currentPage]);

  // 리뷰 상세 조회
  const loadReviewDetail = async (prodRvNo) => {
    try {
      const response = await api.get(`/admin/reviews/${prodRvNo}`);
      console.log('리뷰 상세:', response.data);
      return response.data;
    } catch (error) {
      console.error('리뷰 상세 조회 실패:', error);
      return null;
    }
  }
  // 리뷰 상태 변경
  const updateReviewStatus = async (prodRvNo, reviewStatus) => {
    try {
       const response = await api.patch(`/admin/reviews/${prodRvNo}/status`, {
        reviewStatus: reviewStatus
      });
      console.log('상태 변경 결과:', response.data);
      return response.data;
    } catch (error) {
      console.error('리뷰 상태 변경 실패:', error);
      return null;
    }
  }

  // 리뷰 삭제
  const deleteReview = async (prodRvNo) => {
    try {
      const response = await api.delete(`/admin/reviews/${prodRvNo}`)
      console.log('삭제 결과:', response.data);
      return response.data;
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      return null;
    }
  }

  // --- useEffect : 자동 실행 구역 (리엑트가 알아서 때가 되면 실행하는 코드들 ex)알람시계 )---
useEffect(() => {
  const fetchData = async () => {
    const params = { startDate, endDate };
    /* Promise.all을 사용하여 두 개의 API 요청을 '동시에' 보낸다.
      통계(statistics)와 별점수(rating-counts)를 따로 기다리지 않고 한꺼번에 출발 */
    const [stats, ratings] = await Promise.all([
      api.get('/admin/reviews/statistics', { params }),
      api.get('/admin/reviews/rating-counts', { params })
    ]);
    /*서버에서 받아온 따끈따끈한 데이터(data)를 우리 화면의 상태(State)에 저장.
      이 코드가 실행되면 리액트가 화면을 알아서 새로 그려준다 */
    setStats(stats.data);
    setRatingCounts(ratings.data);
  };
  fetchData();
   //의존성 배열(Dependency Array): [startDate, endDate] 안에 있는 값이 바뀔 때마다 이 useEffect 전체가 다시 실행
}, [startDate, endDate]); 

useEffect(() => {
  const fetchReviews = async () => {
    const params = {
      searchKeyword: searchWord || null,
      ratingFilter: ratingFilter === 'all' ? null : parseInt(ratingFilter),
      statusFilter: statusFilter === 'all' ? null : statusFilter,
      startDate: startDate || null,
      endDate: endDate || null,
      currentPage: currentPage
    };
    const response = await api.get('/admin/reviews', { params });
    setReviewData(response.data);
  };
  fetchReviews();
}, [searchWord, ratingFilter, statusFilter, startDate, endDate, currentPage]);

  // --- 이벤트 핸들러 : 수동 실행 구역 (직접 무언가 했을때만 실행되는 코드들 ex)전등 스위치 )---

  // 기간 선택 버튼
   const handlePeriodClick = (periodId) => {
    setSelectedPeriod(periodId);
    const today = new Date();
    const end = new Date();
    let start = new Date();

    switch(periodId) {
      case 'today':
        start = new Date();
        break;
      case 'week':
        start.setDate(today.getDate() - 7);
        break;
      case 'month':
        start.setMonth(today.getMonth() - 1);
        break;
      case '3months':
        start.setMonth(today.getMonth() - 3);
        break;
      default:
        break;
    }

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    setStartDate(startStr);
    setEndDate(endStr);

    // ✅ 계산된 날짜를 직접 전달 (state 업데이트를 기다리지 않음)
    loadStats(startStr, endStr);
    loadRatingCounts(startStr, endStr);
   }

   // 검색
  const handleSearch = () => {
    setSearchWord(searchInput);  // 임시값 → 실제값
    loadReviews({ searchKeyword: searchInput,currentPage: 1 }); 
  };

  // 페이지 변경
  const handlePageClick = (page) => {
    setCurrentPage(page);
    loadReviews({ currentPage: page });
  };

  // 상세보기
  const handleViewDetail = async (review) => {
    const detailData = await loadReviewDetail(review.prodRvNo);
    if (detailData) {
      setDetailModal({ isOpen: true, review: detailData });
    }
  };

  // 삭제
  const handleDelete = (review) => {
    setDeleteModal({ isOpen: true, review });
  };

   const confirmDelete = async () => {
    const result = await deleteReview(deleteModal.review.prodRvNo);
    if (result && result.success) {
      alert('리뷰가 삭제되었습니다.');
      setDeleteModal({ isOpen: false, review: null });
      loadReviews(); // 목록 새로고침
      loadStats(); // 통계 새로고침
      loadRatingCounts(); // 평점 개수 새로고침
    } else {
      alert('리뷰 삭제에 실패했습니다.');
    }
  };

  // 상태 변경 (확인창을 보여주기)
  const handleAction = (review, action) => {
    setActionModal({ isOpen: true, review, action });
  };  

  const confirmAction = async () => {
    const { action, review } = actionModal;
    const newStatus = action === 'hide' ? 'HIDDEN' : 'ACTIVE';

    const result = await updateReviewStatus(review.prodRvNo, newStatus);
    if (result && result.success) {
      alert(result.message || '상태가 변경되었습니다');
      setActionModal({isOpen:false, review:null, action:''});
      loadReviews(); //목록 새로고침
      loadStats(); //통계 새로고침
    } else {
      alert('상태 변경에 실패했습니다');
    }
  };

  // 날짜 포맷
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR');
  }

  // 별점 렌더링
  const renderStars = (rating, size = 14) => {
    return (
      <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(star => (
          star <= rating ?
            <RiStarFill key={star} style={{ color: '#FBBF24', fontSize: size }} /> :
            <RiStarLine key={star} style={{ color: '#E5E7EB', fontSize: size }} />
        ))}
      </div>
    );
  };

  // 페이지 번호 생성 함수
  const renderPageNumbers = () => {
    const pages = [];
    const totalPages = reviewData.totalPage || 1;
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }
    
    return pages;
  };

  // 진짜 눈에 보이는 화면(JSX) ------------------------------------------------------------------------------
  
  return ( //결과물 반환 명령
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">상품 리뷰 관리</h1>
          <p className="page-subtitle">일반회원이 기업회원(상품)에게 남긴 리뷰를 관리합니다</p>
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
                  onClick={() => handlePeriodClick(period.id)}
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
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ padding: '8px 12px' }}
              />
              <span>~</span>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
            <RiStarFill />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalCount}</div>
            <div className="stat-label">전체 리뷰</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)', color: 'white' }}>
            <RiStarFill />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.avgRating}</div>
            <div className="stat-label">평균 평점</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)', color: 'white' }}>
            <RiThumbUpLine />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalRecommendCount}</div>
            <div className="stat-label">추천 리뷰</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)', color: 'white' }}>
            <RiFlagLine />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.reportedCount}</div>
            <div className="stat-label">신고된 리뷰</div>
            {stats.reportedCount > 0 && <div className="stat-change negative">확인 필요</div>}
          </div>
        </div>
      </div>

      {/* 평점 필터 탭 */}
      <div className="card mb-3">
        <div className="card-body" style={{ padding: '12px 20px' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ratingFilters.map(filter => {
              const count = filter.id === 'all' ? stats.totalCount : ratingCounts[`rating${filter.id}`] || 0;
              return (
                <button
                  key={filter.id}
                  onClick={() => {
                    setRatingFilter(filter.id); 
                    setCurrentPage(1);
                    loadReviews({ ratingFilter: filter.id, currentPage: 1 });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: 20,
                    background: ratingFilter === filter.id ? 'var(--primary-color)' : '#F3F4F6',
                    color: ratingFilter === filter.id ? 'white' : '#6B7280',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                    transition: 'all 0.2s'
                  }}
                >
                  {filter.id !== 'all' && <RiStarFill style={{ color: ratingFilter === filter.id ? 'white' : '#FBBF24' }} />}
                  {filter.label}
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: ratingFilter === filter.id ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
                    fontSize: 12
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="card">
        {/* 검색 및 필터 영역 */}
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* 검색창 */}
          <div style={{ 
            flex: 1,
            minWidth: 300,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            position: 'relative'
          }}>
            <RiSearchLine style={{ 
              position: 'absolute', 
              left: 12, 
              color: 'var(--text-muted)',
              fontSize: 18
            }} />
            <input
              type="text"
              className="form-input"
              placeholder="상품명, 리뷰내용, 회원명 검색..."
              value={searchInput} //임시값 표시
              onChange={(e) => setSearchInput(e.target.value)} //임시저장만
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={{ 
                paddingLeft: 40,
                flex: 1
              }}
            />
            <button 
              className="btn btn-primary" 
              onClick={handleSearch}
              style={{ whiteSpace: 'nowrap' }}
            >
              검색
            </button>
          </div>

          {/* 상태 필터 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RiFilterLine style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-input form-select"
              value={statusFilter}
              onChange={(e) => {
                const newStatus = e.target.value;
                setStatusFilter(newStatus); 
                setCurrentPage(1);
                loadReviews({ statusFilter: newStatus, currentPage: 1 });
              }}
              style={{ width: 'auto', minWidth: 120 }}
            >
              {statuses.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 80 }}>평점</th>
                <th>상품</th>
                <th>리뷰내용</th>
                <th style={{ width: 100 }}>작성자</th>
                <th style={{ width: 120 }}>기업</th>
                <th style={{ width: 80 }}>추천</th>
                <th style={{ width: 80 }}>상태</th>
                <th style={{ width: 100 }}>등록일</th>
                <th style={{ width: 100 }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {reviewData.dataList && reviewData.dataList.length > 0 ? (
                reviewData.dataList.map(review => (
                  <tr key={review.prodRvNo} style={{ background: review.reviewStatus === 'REPORTED' ? '#FEF2F2' : 'transparent' }}>
                    <td>{renderStars(review.rating || 0)}</td>
                    <td>
                      <div>
                        <div className="font-medium">{review.tripProdTitle || '-'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {productTypeLabels[review.prodCtgryType] || review.prodCtgryType || '-'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{
                        maxWidth: 250,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}>
                        {review.reviewImages && review.reviewImages.length > 0 && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 2,
                            padding: '2px 6px',
                            background: '#E0E7FF',
                            color: '#4F46E5',
                            borderRadius: 4,
                            fontSize: 11,
                            flexShrink: 0
                          }}>
                            <RiImageLine /> {review.reviewImages.length}
                          </span>
                        )}
                        {review.prodReview || '-'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <RiUserLine style={{ color: 'var(--text-muted)' }} />
                        <span>{review.memName || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <RiBuilding2Line style={{ color: 'var(--primary-color)' }} />
                        <span style={{ fontSize: 13 }}>{review.bzmnNm || '-'}</span>
                      </div>
                    </td>
                    <td>
                      {review.rcmdtnYn === 'Y' ? (
                        <RiThumbUpLine style={{ color: '#10B981', fontSize: 18 }} />
                      ) : (
                        <RiThumbDownLine style={{ color: '#EF4444', fontSize: 18 }} />
                      )}
                    </td>
                    <td>
                      <span className={`badge ${statusLabels[review.reviewStatus]?.class || 'badge-secondary'}`} style={{ whiteSpace: 'nowrap' }}>
                        {statusLabels[review.reviewStatus]?.text || review.reviewStatus}
                      </span>
                    </td>
                    <td className="text-secondary" style={{ fontSize: 13 }}>
                      {formatDate(review.prodRegdate)}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="table-action-btn"
                          onClick={() => handleViewDetail(review)}
                          title="상세보기"
                        >
                          <RiEyeLine />
                        </button>
                        {review.reviewStatus === 'ACTIVE' ? (
                          <button
                            className="table-action-btn"
                            onClick={() => handleAction(review, 'hide')}
                            title="숨김"
                          >
                            <RiAlertLine />
                          </button>
                        ) : review.reviewStatus === 'HIDDEN' ? (
                          <button
                            className="table-action-btn"
                            onClick={() => handleAction(review, 'show')}
                            title="게시"
                          >
                            <RiCheckLine />
                          </button>
                        ) : null}
                        <button
                          className="table-action-btn"
                          onClick={() => handleDelete(review)}
                          title="삭제"
                        >
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    리뷰 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {reviewData.totalPage > 0 && (
          <div className="pagination">
            <button 
              className="pagination-btn" 
              disabled={currentPage === 1}
              onClick={() => handlePageClick(currentPage - 1)}
            >
              &lt;
            </button>
            {renderPageNumbers()}
            <button 
              className="pagination-btn"
              disabled={currentPage === reviewData.totalPage}
              onClick={() => handlePageClick(currentPage + 1)}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* 상세보기 모달 */}
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, review: null })}
        title="리뷰 상세"
        size="large"
      >
        {detailModal.review && (() => {
          const review = detailModal.review;
          return (
            <div>
              {/* 상품 정보 */}
              <div style={{
                padding: 16,
                background: '#F8FAFC',
                borderRadius: 8,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <RiShoppingBagLine size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{review.tripProdTitle || review.prodName || '-'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {productTypeLabels[review.prodCtgryType] || review.prodCtgryType || '-'} | {review.bzmnNm || '-'}
                  </div>
                </div>
                <span className={`badge ${statusLabels[review.reviewStatus]?.class || 'badge-secondary'}`}>
                  {statusLabels[review.reviewStatus]?.text || review.reviewStatus}
                </span>
              </div>

              {/* 평점 및 추천 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                marginBottom: 20,
                padding: 16,
                background: review.rating >= 4 ? '#F0FDF4' : review.rating >= 3 ? '#FFFBEB' : '#FEF2F2',
                borderRadius: 8
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#FBBF24' }}>{review.rating || 0}</div>
                  {renderStars(review.rating || 0, 20)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8
                  }}>
                    {review.rcmdtnYn === 'Y' ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '6px 12px',
                        background: '#D1FAE5',
                        color: '#059669',
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 500
                      }}>
                        <RiThumbUpLine /> 추천해요
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '6px 12px',
                        background: '#FEE2E2',
                        color: '#DC2626',
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 500
                      }}>
                        <RiThumbDownLine /> 별로예요
                      </span>
                    )}
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      좋아요 {review.recommendCount || 0}개
                    </span>
                  </div>
                </div>
              </div>

              {/* 작성자 정보 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                    <RiUserLine style={{ marginRight: 4 }} />작성자
                  </div>
                  <div style={{ fontWeight: 500 }}>{review.memName || '-'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>회원번호: {review.memNo}</div>
                </div>
                <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                    <RiBuilding2Line style={{ marginRight: 4 }} />판매자
                  </div>
                  <div style={{ fontWeight: 500 }}>{review.bzmnNm || '-'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>기업번호: {review.compNo}</div>
                </div>
              </div>

              {/* 리뷰 내용 */}
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>리뷰 내용</span>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {formatDate(review.prodRegdate)}
                  </span>
                </div>
                <div style={{
                  padding: 16,
                  background: '#F8FAFC',
                  borderRadius: 8,
                  lineHeight: 1.6
                }}>
                  {review.prodReview || '-'}
                </div>
              </div>

              {/* 이미지 */}
              {review.images && review.images.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                    첨부 이미지 ({review.images.length})
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.prodRvImgUrl}
                        alt={`리뷰이미지 ${idx + 1}`}
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: 'cover',
                          borderRadius: 8
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 신고 정보 */}
              {review.reviewStatus === 'REPORTED' && (
                <div style={{
                  marginTop: 20,
                  padding: 16,
                  background: '#FEF2F2',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}>
                  <RiFlagLine style={{ color: '#DC2626', fontSize: 24 }} />
                  <div>
                    <div style={{ fontWeight: 500, color: '#DC2626' }}>신고된 리뷰</div>
                    <div style={{ fontSize: 13, color: '#7F1D1D' }}>사유: {review.reportReason || '확인 필요'}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleAction(review, 'show')}>
                      게시 유지
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleAction(review, 'hide')}>
                      숨김 처리
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, review: null })}
        onConfirm={confirmDelete}
        title="리뷰 삭제"
        message="이 리뷰를 삭제하시겠습니까? 삭제된 리뷰는 복구할 수 없습니다."
        confirmText="삭제"
        type="danger"
      />

      {/* 액션 확인 모달 */}
      <ConfirmModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, review: null, action: '' })}
        onConfirm={confirmAction}
        title={actionModal.action === 'hide' ? '리뷰 숨김' : '리뷰 게시'}
        message={actionModal.action === 'hide' ?
          '이 리뷰를 숨김 처리하시겠습니까? 사용자에게 표시되지 않습니다.' :
          '이 리뷰를 다시 게시하시겠습니까?'
        }
        confirmText={actionModal.action === 'hide' ? '숨김' : '게시'}
        type={actionModal.action === 'hide' ? 'warning' : 'primary'}
      />
    </div>
  );
}

export default ProductReviews;