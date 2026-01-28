import { RiTimeLine, RiCheckboxCircleLine } from 'react-icons/ri';

// 정산 관련 공통 상수 관리
export const SETTLE_STATUS = {
  PENDING: { 
    key: 'pending', 
    label: '정산대기', 
    className: 'badge-warning', 
    icon: RiTimeLine 
  },
  READY: { 
    key: 'ready', 
    label: '정산가능', 
    className: 'badge-info', 
    icon: RiTimeLine 
  },
  PROCESSING: { 
    key: 'processing', 
    label: '정산중', 
    className: 'badge-primary', 
    icon: RiTimeLine 
  },
  COMPLETED: { 
    key: 'completed', 
    label: '정산완료', 
    className: 'badge-success', 
    icon: RiCheckboxCircleLine 
  }
};

// 상태 판별 로직도 공통으로 빼버리자!
export const getSettlementStatus = (item) => {
  if (!item) return SETTLE_STATUS.PENDING;

  // 1. 대문자 STATUS와 소문자 status 둘 다 체크! (매우 중요)
  const currentStatus = item.STATUS || item.status || '';

  if (currentStatus === '정산완료' || currentStatus === 'completed') {
    return SETTLE_STATUS.COMPLETED;
  }

  // 2. 이용일 날짜 가져오기 (목록은 USE_DATE, 상세는 useDate일 수 있음)
  const rawDate = item.USE_DATE || item.useDate;
  const today = new Date();
  const useDate = new Date(rawDate);

  // 3. 정산대기 중 이용일이 지났다면 '정산가능'
  if ((currentStatus === '정산대기' || currentStatus === 'pending' || currentStatus === 'confirmed') && 
      rawDate && useDate <= today) {
    return SETTLE_STATUS.READY;
  }

  return SETTLE_STATUS.PENDING;
};