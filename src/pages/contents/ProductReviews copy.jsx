import { useState } from 'react';
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

// 더미 데이터
const reviewsData = [
  {
    id: 1,
    productName: '제주 스노클링 체험',
    productType: 'tour',
    rating: 5,
    content: '정말 최고의 경험이었습니다! 강사분이 친절하게 알려주셔서 수영을 못하는 저도 무사히 체험할 수 있었어요. 물고기도 많이 봤고 사진도 많이 찍어주셔서 좋은 추억이 됐습니다. 다음에 제주 가면 또 이용할게요!',
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200', 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=200'],
    memberId: 'travel_lover',
    memberName: '김여행',
    businessId: 'jeju_diving',
    businessName: '제주다이빙센터',
    recommend: true,
    status: 'active',
    likes: 24,
    createdAt: '2024-12-18 10:30:00'
  },
  {
    id: 2,
    productName: '부산 해운대 호텔',
    productType: 'accommodation',
    rating: 4,
    content: '위치가 해운대 바로 앞이라 정말 좋았어요. 방도 깨끗하고 조식도 맛있었습니다. 다만 체크인할 때 조금 기다렸어요. 그래도 전반적으로 만족스러운 숙박이었습니다.',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200'],
    memberId: 'happy_traveler',
    memberName: '이모행',
    businessId: 'haeundae_hotel',
    businessName: '해운대그랜드호텔',
    recommend: true,
    status: 'active',
    likes: 15,
    createdAt: '2024-12-17 16:45:00'
  },
  {
    id: 3,
    productName: '경주 역사 투어',
    productType: 'tour',
    rating: 5,
    content: '가이드분의 설명이 정말 재미있고 유익했어요! 경주의 역사를 잘 몰랐는데 이번 투어를 통해 많이 배웠습니다. 점심 식사도 맛있었고, 일정도 적당했어요. 강력 추천합니다!',
    images: [],
    memberId: 'history_fan',
    memberName: '박역사',
    businessId: 'gyeongju_tour',
    businessName: '경주문화투어',
    recommend: true,
    status: 'active',
    likes: 32,
    createdAt: '2024-12-16 14:20:00'
  },
  {
    id: 4,
    productName: '강릉 서핑 체험',
    productType: 'tour',
    rating: 2,
    content: '기대에 비해 실망스러웠습니다. 장비 상태가 좋지 않았고, 강사분이 너무 바빠서 제대로 된 레슨을 받지 못했어요. 가격 대비 만족도가 낮았습니다.',
    images: [],
    memberId: 'surf_fan',
    memberName: '최서퍼',
    businessId: 'gangneung_surf',
    businessName: '강릉서핑스쿨',
    recommend: false,
    status: 'active',
    likes: 3,
    createdAt: '2024-12-15 11:30:00'
  },
  {
    id: 5,
    productName: '여수 요트 투어',
    productType: 'tour',
    rating: 5,
    content: '날씨도 좋고 요트도 깨끗하고 최고였어요! 선장님이 친절하시고 사진도 많이 찍어주셨어요. 여수 바다 정말 아름답더라구요. 석양 보면서 샴페인 마신 게 잊을 수 없는 추억이에요.',
    images: ['https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=200', 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=200', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'],
    memberId: 'sea_lover',
    memberName: '정바다',
    businessId: 'yeosu_yacht',
    businessName: '여수요트클럽',
    recommend: true,
    status: 'active',
    likes: 45,
    createdAt: '2024-12-14 17:00:00'
  },
  {
    id: 6,
    productName: '제주 신라 호텔',
    productType: 'accommodation',
    rating: 1,
    content: '욕설 및 비방 내용으로 삭제 처리됨',
    images: [],
    memberId: 'angry_guest',
    memberName: '문제손님',
    businessId: 'shilla_jeju',
    businessName: '제주신라호텔',
    recommend: false,
    status: 'hidden',
    likes: 0,
    createdAt: '2024-12-13 09:00:00',
    reportReason: '욕설 및 비방'
  },
  {
    id: 7,
    productName: '속초 번지점프',
    productType: 'tour',
    rating: 4,
    content: '스릴 만점! 무섭긴 했지만 정말 짜릿했어요. 안전 교육도 철저하고 직원분들도 친절했습니다. 사진 패키지 구매했는데 퀄리티가 좋네요.',
    images: ['https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=200'],
    memberId: 'thrill_seeker',
    memberName: '한스릴',
    businessId: 'sokcho_bungee',
    businessName: '속초번지점프',
    recommend: true,
    status: 'reported',
    likes: 18,
    createdAt: '2024-12-12 15:30:00',
    reportReason: '허위 리뷰 의심'
  }
];

const productTypeLabels = {
  tour: '투어/체험',
  accommodation: '숙박',
  flight: '항공'
};

const statusLabels = {
  active: { text: '게시중', class: 'badge-success' },
  hidden: { text: '숨김', class: 'badge-secondary' },
  reported: { text: '신고됨', class: 'badge-danger' }
};

function ProductReviews() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [dateRange, setDateRange] = useState({ start: '2024-12-12', end: '2024-12-18' });

  const [detailModal, setDetailModal] = useState({ isOpen: false, review: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, review: null });
  const [actionModal, setActionModal] = useState({ isOpen: false, review: null, action: '' });

  const periods = [
    { id: 'today', label: '오늘' },
    { id: 'week', label: '이번 주' },
    { id: 'month', label: '이번 달' },
    { id: '3months', label: '최근 3개월' }
  ];

  const filteredData = reviewsData.filter(item => {
    const matchesSearch = item.productName.includes(searchTerm) ||
                          item.content.includes(searchTerm) ||
                          item.memberName.includes(searchTerm) ||
                          item.businessName.includes(searchTerm);
    const matchesRating = ratingFilter === 'all' || item.rating === parseInt(ratingFilter);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesRating && matchesStatus;
  });

  const totalCount = reviewsData.length;
  const avgRating = (reviewsData.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1);
  const recommendCount = reviewsData.filter(r => r.recommend).length;
  const reportedCount = reviewsData.filter(r => r.status === 'reported').length;

  const handleViewDetail = (review) => {
    setDetailModal({ isOpen: true, review });
  };

  const handleDelete = (review) => {
    setDeleteModal({ isOpen: true, review });
  };

  const confirmDelete = () => {
    alert(`리뷰가 삭제되었습니다. (ID: ${deleteModal.review.id})`);
    setDeleteModal({ isOpen: false, review: null });
  };

  const handleAction = (review, action) => {
    setActionModal({ isOpen: true, review, action });
  };

  const confirmAction = () => {
    const { action, review } = actionModal;
    if (action === 'hide') {
      alert(`리뷰가 숨김 처리되었습니다. (ID: ${review.id})`);
    } else if (action === 'show') {
      alert(`리뷰가 게시 처리되었습니다. (ID: ${review.id})`);
    }
    setActionModal({ isOpen: false, review: null, action: '' });
  };

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

  return (
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
            <RiStarFill />
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalCount}</div>
            <div className="stat-label">전체 리뷰</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)', color: 'white' }}>
            <RiStarFill />
          </div>
          <div className="stat-content">
            <div className="stat-value">{avgRating}</div>
            <div className="stat-label">평균 평점</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)', color: 'white' }}>
            <RiThumbUpLine />
          </div>
          <div className="stat-content">
            <div className="stat-value">{recommendCount}</div>
            <div className="stat-label">추천 리뷰</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)', color: 'white' }}>
            <RiFlagLine />
          </div>
          <div className="stat-content">
            <div className="stat-value">{reportedCount}</div>
            <div className="stat-label">신고된 리뷰</div>
            {reportedCount > 0 && <div className="stat-change negative">확인 필요</div>}
          </div>
        </div>
      </div>

      {/* 평점 필터 탭 */}
      <div className="card mb-3">
        <div className="card-body" style={{ padding: '12px 20px' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ratingFilters.map(filter => {
              const count = filter.id === 'all' ? totalCount : reviewsData.filter(r => r.rating === parseInt(filter.id)).length;
              return (
                <button
                  key={filter.id}
                  onClick={() => setRatingFilter(filter.id)}
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
        <div className="filter-bar">
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="상품명, 리뷰내용, 회원명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <RiFilterLine />
            <select
              className="form-input form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
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
              {filteredData.map(review => (
                <tr key={review.id} style={{ background: review.status === 'reported' ? '#FEF2F2' : 'transparent' }}>
                  <td>{renderStars(review.rating)}</td>
                  <td>
                    <div>
                      <div className="font-medium">{review.productName}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {productTypeLabels[review.productType]}
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
                      {review.images.length > 0 && (
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
                          <RiImageLine /> {review.images.length}
                        </span>
                      )}
                      {review.content}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <RiUserLine style={{ color: 'var(--text-muted)' }} />
                      <span>{review.memberName}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <RiBuilding2Line style={{ color: 'var(--primary-color)' }} />
                      <span style={{ fontSize: 13 }}>{review.businessName}</span>
                    </div>
                  </td>
                  <td>
                    {review.recommend ? (
                      <RiThumbUpLine style={{ color: '#10B981', fontSize: 18 }} />
                    ) : (
                      <RiThumbDownLine style={{ color: '#EF4444', fontSize: 18 }} />
                    )}
                  </td>
                  <td>
                    <span className={`badge ${statusLabels[review.status].class}`} style={{ whiteSpace: 'nowrap' }}>
                      {statusLabels[review.status].text}
                    </span>
                  </td>
                  <td className="text-secondary" style={{ fontSize: 13 }}>
                    {review.createdAt.split(' ')[0]}
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
                      {review.status === 'active' ? (
                        <button
                          className="table-action-btn"
                          onClick={() => handleAction(review, 'hide')}
                          title="숨김"
                        >
                          <RiAlertLine />
                        </button>
                      ) : review.status === 'hidden' ? (
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="pagination-btn" disabled>&lt;</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <button className="pagination-btn">&gt;</button>
        </div>
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
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{review.productName}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {productTypeLabels[review.productType]} | {review.businessName}
                  </div>
                </div>
                <span className={`badge ${statusLabels[review.status].class}`}>
                  {statusLabels[review.status].text}
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
                  <div style={{ fontSize: 36, fontWeight: 700, color: '#FBBF24' }}>{review.rating}</div>
                  {renderStars(review.rating, 20)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8
                  }}>
                    {review.recommend ? (
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
                      좋아요 {review.likes}개
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
                  <div style={{ fontWeight: 500 }}>{review.memberName}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>@{review.memberId}</div>
                </div>
                <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                    <RiBuilding2Line style={{ marginRight: 4 }} />판매자
                  </div>
                  <div style={{ fontWeight: 500 }}>{review.businessName}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>@{review.businessId}</div>
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
                    {review.createdAt}
                  </span>
                </div>
                <div style={{
                  padding: 16,
                  background: '#F8FAFC',
                  borderRadius: 8,
                  lineHeight: 1.6
                }}>
                  {review.content}
                </div>
              </div>

              {/* 이미지 */}
              {review.images.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                    첨부 이미지 ({review.images.length})
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
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
              {review.status === 'reported' && (
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
                    <div style={{ fontSize: 13, color: '#7F1D1D' }}>사유: {review.reportReason}</div>
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
