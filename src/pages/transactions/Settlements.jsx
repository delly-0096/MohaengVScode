import * as XLSX from 'xlsx';
import React, { useEffect, useState } from 'react';
import { SETTLE_STATUS, getSettlementStatus } from './settlement';
import SettlementDash from './SettlementDash';

import api from '../../api/api';
import {
  RiSearchLine,
  RiFilterLine,
  RiEyeLine,
  RiCheckLine,
  RiFileDownloadLine,
  RiBuildingLine,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiBankCardLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiPercentLine,
  RiUserLine,
  RiPhoneLine,
  RiMailLine,
  RiFileListLine,
  RiArrowUpLine,
  RiArrowDownLine
} from 'react-icons/ri';
import { Modal, ConfirmModal } from '../../components/common/Modal';

// 정산 데이터 (사용자 페이지와 동일한 구조)
const initialSettlementsData = [
  {
    id: 'SET-202412-001',
    company: '제주다이빙센터',
    businessNo: '123-45-67890',
    representative: '김대표',
    phone: '064-123-4567',
    email: 'diving@jejudiving.com',
    bank: '신한은행',
    accountNo: '110-123-456789',
    accountHolder: '제주다이빙센터',
    period: '2024년 12월',
    periodStart: '2024-12-01',
    periodEnd: '2024-12-31',
    sales: 3250000,
    fee: 325000,
    feeRate: 10,
    settlement: 2925000,
    prevMonthSales: 2850000,
    changeRate: 14.0,
    status: 'pending',
    scheduledDate: '2025-01-05',
    orders: [
      { id: 'MH2412015', date: '2024.12.15 14:32', product: '제주 스쿠버다이빙 체험', customer: '김OO', useDate: '2024.12.28', amount: 136000, fee: 13600, settlement: 122400, status: 'confirmed' },
      { id: 'MH2412014', date: '2024.12.14 11:20', product: '제주 스쿠버다이빙 체험', customer: '이OO', useDate: '2024.12.25', amount: 204000, fee: 20400, settlement: 183600, status: 'confirmed' },
      { id: 'MH2412013', date: '2024.12.13 16:45', product: '제주 스쿠버다이빙 체험', customer: '박OO', useDate: '2024.12.20', amount: 136000, fee: 13600, settlement: 122400, status: 'confirmed' },
      { id: 'MH2412010', date: '2024.12.10 10:22', product: '제주 스쿠버다이빙 체험', customer: '최OO', useDate: '2024.12.18', amount: 68000, fee: 6800, settlement: 61200, status: 'confirmed' }
    ]
  },
];

/**
 * function 시작
 * */
function Settlements() {
  const [settlementsData, setSettlementsData] = useState(initialSettlementsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]); // 정산 건들의 id를 담는 배열
  const [isApproving, setIsApproving] = useState(false); // 로딩 상태 선언

  // 모달 상태
  const [detailModal, setDetailModal] = useState({ isOpen: false, settlement: null, loading: false });
  const [processModal, setProcessModal] = useState({ isOpen: false, settlement: null });

// Settlements.jsx 내부 로직 수정
const filteredData = (settlementsData || []).filter(s => {
  // 1. 데이터가 아예 없는 경우를 대비한 방어막
  if (!s) return false;

  // 2. 오라클 대문자 컬럼명과 리액트 변수명을 안전하게 매핑
  // s.COMPANY가 없으면 s.company를 찾고, 그것도 없으면 빈 문자열("")을 줘서 에러를 막음!
  const company = s.COMPNAME || s.company || ""; 
  const businessNo = s.BRNO || s.businessNo || "";
  const id = s.SETTLENO || s.id || "";
  const status = s.STATUS || s.status || "";

  // 기간 데이터 (2026-01 형식)
  const period = s.SETTLEMONTH || s.settleMonth || "";

  // 3. 검색어 필터링 (String으로 감싸서 혹시 모를 숫자 데이터 에러 방지)
  const matchesSearch = 
    String(company).includes(searchTerm) || 
    String(businessNo).includes(searchTerm) || 
    String(id).includes(searchTerm);

  // 4. 상태 필터링
  const statusConfig = getSettlementStatus(s);
  const matchesStatus = statusFilter === 'all' || statusConfig.key === statusFilter;

  // 5. 기간 필터링 추가!
  const matchesPeriod = periodFilter === 'all' || period === periodFilter;

  // 6. 모든 관문을 통과해야 최종 리스트에 합격!
  return matchesSearch && matchesStatus && matchesPeriod;
});

// 모든 데이터에 현재 계산된 상태 키값을 미리 부여하면 계산이 편해!
const enrichedData = (settlementsData || []).map(item => ({
  ...item,
  calculatedStatus: getSettlementStatus(item)
}));

/**
 * 기간 옵션 계산 (최근 6개월)
 */
const periodOptions = React.useMemo(() => {
    const options = [];
    const now = new Date(); // 현재 2026년 1월
    
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      options.push(`${year}-${month}`);
    }
    return options;
  }, []); // 컴포넌트가 처음 뜰 때 딱 한 번만 계산!

/**
 * 정산 관련 핸들러들
 * @param {*} e 
 */
// 정산 전체 선택/해제 핸들러
const handleSelectAll = (e) => {
  if (e.target.checked) {
    // '정산대기(가능 포함)' 상태인 건들만 필터링해서 ID 추출
    const availableIds = filteredData
      .filter(item => getSettlementStatus(item) !== 'completed')
      .map(item => item.SETTLENO || item.id);
    setSelectedIds(availableIds);
  } else {
    setSelectedIds([]);
  }
};

// 정산 개별 선택/해제 핸들러
const handleSelectOne = (id) => {
  setSelectedIds(prev => 
    prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
  );
};

// 정산 프로세스
const handleBatchApprove = async () => {
  if (selectedIds.length === 0) return alert('정산할 항목을 선택해주세요!');
  
  if (window.confirm(`선택한 ${selectedIds.length}건을 모두 정산 확정하시겠습니까?`)) {
    try {
      setIsApproving(true);
      // 선택된 ID들과 필요한 최소 정보(금액 등)를 맵핑해서 보냄
      const targets = settlementsData
        .filter(s => selectedIds.includes(s.SETTLENO || s.id))
        .map(s => ({
          saleNo: s.SETTLENO || s.id,
          compNo: s.COMPNO || s.COMP_NO || 13, // 실제 데이터에 맞게!
          settlePay: s.SETTLEPAY || s.settlePay
        }));

      await api.post('/admin/transactions/settlements/batch-approve', { targets });
      
      setSettlementsData(prev => prev.map(item => {
        const itemId = item.SETTLENO || item.id;
        // 선택된 ID 배열에 포함된 놈이라면? 상태를 '정산완료'로 변신!
        if (selectedIds.includes(itemId)) {
          return { ...item, STATUS: '정산완료', status: 'completed' };
        }
        return item;
      }));

      alert('일괄 정산이 완료되었습니다! 💰');
      setSelectedIds([]); // 선택 초기화
      // 목록 새로고침 로직 호출...
    } catch (err) {
      alert('일괄 처리 중 오류가 발생했습니다.');
    } finally {
      setIsApproving(false);
    }
  }
};

// ✅ 정산 가능 관련 (추가!)
const readyItems = enrichedData.filter(s => s.calculatedStatus.key === 'ready');
const readyCount = readyItems.length;
const readySettlement = readyItems.reduce((acc, cur) => 
  acc + (Number(cur.SETTLEPAY || cur.settlePay) || 0), 0
);

// 정산 대기 관련 (에러 해결 포인트!)
const pendingItems = enrichedData.filter(s => s.calculatedStatus.key === 'pending');
const pendingCount = pendingItems.length; // 대기 건수
const pendingSettlement = Math.round(
  pendingItems.reduce((acc, cur) => 
    acc + (Number(cur.SETTLEPAY || cur.settlePay) || 0), 0
  )
);

// 정산 완료 관련
const completedItems = enrichedData.filter(s => s.calculatedStatus.key === 'completed');
const completedCount = completedItems.length;
const completedSettlement = completedItems.reduce((acc, cur) => 
  acc + (Number(cur.SETTLEPAY || cur.settlePay) || 0), 0
);

  // 정산 처리
const handleProcess = (settlement) => {
      setProcessModal({ isOpen: true, settlement });
    };

const handleProcessConfirm = async () => {
      const s = processModal.settlement;
      if (!s) return;

      // 1. 보여준 데이터(대문자)에 맞춰서 정확하게 추출
      const saleNo = Math.round(Number(s.SETTLENO || s.saleNo));
      const settlePay = Math.round(Number(s.SETTLEPAY || s.settlePay));
      let compNo = s.COMP_NO || s.COMPNO || s.compNo;

      console.log("🚀 최종 전송 데이터:", { saleNo, compNo, settlePay });

      try {
        // 2. 백엔드로 전송 (키값은 백엔드 컨트롤러가 받는 이름과 일치시켜야 함)
        await api.post(`/admin/transactions/settlements/${saleNo}/approve`, {
          compNo: compNo,
          settlePay: settlePay
        });

        // 3. UI 업데이트
        setSettlementsData(prev => prev.map(item => 
          Number(item.SETTLENO) === saleNo 
            ? { ...item, STATUS: '정산완료', status: '정산완료' } 
            : item
        ));

        setDetailModal(prev => ({
          ...prev,
          settlement: prev.settlement && Number(prev.settlement.saleNo || prev.settlement.SALENO) === saleNo
            ? { ...prev.settlement, status: '정산완료', STATUS: '정산완료' }
            : prev.settlement
      }));

        setProcessModal({ isOpen: false, settlement: null });
        setDetailModal({ isOpen: false, settlement: null });
        alert('정산이 성공적으로 완료되었습니다! ✅');

      } catch (err) {
        console.error("에러 디테일:", err.response?.data);
        alert('서버 통신 오류가 발생했습니다.');
      }
};
  
// JWT API 연동
  useEffect(() => {
    api.get('/admin/transactions/settlements')
      .then(res => {
        console.log("API 응답 데이터:", res.data); 
        setSettlementsData(res.data || []); 
      })
      .catch(err => console.error("데이터 로드 실패:", err));
  }, []);
  
  // 상세보기
  const handleViewDetail = async (settlement) => {
  setDetailModal({ isOpen: true, settlement: null, loading: true });

  try {
    const saleNo = settlement.saleNo || settlement.SETTLENO || settlement.id;
    const res = await api.get(`/admin/transactions/settlements/${saleNo}`);
    
    //  ServiceImpl에서 만든 finalResult 그대로 받기
    setDetailModal({
      isOpen: true,
      settlement: res.data, // 여기 중요
      loading: false
    });
  } catch (e) {
    console.error(e);
    setDetailModal({ isOpen: false, settlement: null, loading: false });
  }
};

// 엑셀 다운로드
const handleExcelDownload = () => {
  if (filteredData.length === 0) return alert('다운로드할 데이터가 없습니다.');

  // 1. 엑셀에 들어갈 데이터 가공 (한글 헤더로 예쁘게!)
  const excelData = filteredData.map(item => {
    // 우리가 아까 만든 getSettlementStatus 활용!
    const statusConfig = getSettlementStatus(item);
    
    return {
      '정산번호': item.SETTLENO || item.id,
      '기업명': item.COMPNAME || item.company,
      '사업자번호': item.BRNO || item.businessNo,
      '정산월': item.SETTLEMONTH || item.period,
      '총매출액': Number(item.TOTALSALES || item.sales || 0),
      '수수료': Number(item.COMMISSION || item.fee || 0),
      '최종정산금액': Number(item.SETTLEPAY || item.settlement || 0),
      '상태': statusConfig.label,
    };
  });

  // 2. 워크시트(Worksheet) 생성
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // 엑셀에서 E, F, G열이 숫자 형식으로 인식되도록 설정
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for (let R = range.s.r + 1; R <= range.e.r; ++R) {
    ['E', 'F', 'G'].forEach(col => {
      const cell = worksheet[col + (R + 1)];
      if (cell && cell.t === 'n') { // 타입이 숫자(number)일 때
        cell.z = '#,##0'; // 엑셀 표준 회계 서식 적용!
      }
    });
  }
  
  // 3. 워크북(Workbook) 생성 및 시트 추가
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "정산내역");

  // 4. 파일 다운로드 (파일명에 오늘 날짜 넣어주는 센스!)
  const fileName = `[Mohaeng] 정산내역_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

/**
 * 복사 핸들러 
 */
const handleCopy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('계좌번호가 클립보드에 복사되었습니다! 📋');
  } catch (err) {
    console.error('복사 실패:', err);
  }
};

/**
 * 통계 카드용 계산
 */
const dataToCalculate = settlementsData || [];

// 1. 총 매출액 (모든 데이터의 합산 + 소수점 반올림)
const totalSales = Math.round(
  dataToCalculate.reduce((acc, cur) => acc + (Number(cur.TOTALSALES || cur.totalSales || 0)), 0)
);

// 2. 총 수수료 (모든 데이터의 합산 + 소수점 반올림)
const totalFee = Math.round(
  dataToCalculate.reduce((acc, cur) => acc + (Number(cur.COMMISSION || cur.commission || cur.fee || 0)), 0)
);

// 3. 정산 완료 (이미 계산된 로직 활용)
const finalCompletedSettlement = Math.round(completedSettlement || 0);

// 4. 정산 대기 (이미 계산된 로직 활용)
const finalPendingSettlement = Math.round(pendingSettlement || 0);

/**
 * return 시작
 */
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">기업정산 관리</h1>
          <p className="page-subtitle">
            기업별 매출 및 정산 내역을 관리합니다
          </p>
        </div>
      </div>

      {/* 통계 카드 그리드 */}
        <div className="stats-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: 20, 
          marginBottom: 32 
        }}>
          {/* 1. 총 매출액 */}
          <div className="card stat-card" style={{ padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: '14px', background: 'linear-gradient(135deg, #4f46e5, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                <RiMoneyDollarCircleLine />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>총 매출액</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>
                  ₩{totalSales.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* 2. 총 수수료 */}
          <div className="card stat-card" style={{ padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: '14px', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)' }}>
                <RiPercentLine />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>총 수수료</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706' }}>
                  ₩{totalFee.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* 3. 정산 완료 */}
          <div className="card stat-card" style={{ padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: '14px', background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                <RiCheckboxCircleLine />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>정산 완료</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>
                  ₩{finalCompletedSettlement.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* 4. 정산 대기 */}
          <div className="card stat-card" style={{ padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: '14px', background: 'linear-gradient(135deg, #ef4444, #f87171)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
                <RiTimeLine />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>정산 대기</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>
                  ₩{finalPendingSettlement.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <SettlementDash data={settlementsData} />

      {/* 정산 대기 알림 배너 */}
      {pendingCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#fef3c7', borderRadius: 8, marginBottom: 16 }}>
          <RiTimeLine style={{ color: '#f59e0b' }} />
          <span style={{ color: '#92400e' }}>정산 대기 중인 건이 <strong>{pendingCount}건</strong> 있습니다. (정산 예정 금액: ₩{pendingSettlement.toLocaleString()})</span>
        </div>
      )}

      <div className="card">
        <div className="filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="search-bar">
            <RiSearchLine className="search-bar-icon" />
            <input type="text" className="form-input" placeholder="정산번호, 기업명, 사업자번호 검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="filter-group" style={{ display: 'flex', gap: 8 }}>
            <RiFilterLine />
            <select className="form-input form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 'auto' }}>
              <option value="all">전체 상태</option>
              <option value="pending">정산대기</option>
              <option value="ready">정산가능</option>
              <option value="processing">정산중</option>
              <option value="completed">정산완료</option>
            </select>
            <select className="form-input form-select" value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}>
              <option value="all">전체 기간</option>
              {/* 이제 여기서 periodOptions를 안전하게 사용할 수 있어! */}
              {periodOptions.map(period => (
                <option key={period} value={period}>
                  {period.split('-')[0]}년 {period.split('-')[1]}월
                </option>
              ))}
            </select>
          </div>
          </div>
            <div className="page-header-actions" style={{ display: 'flex', gap: 10 }}>
              {selectedIds.length > 0 && (
                <button 
                    className="btn btn-primary" 
                    onClick={handleBatchApprove}
                    // 로딩 중에는 버튼 클릭 방지
                    disabled={isApproving} 
                    style={{ 
                      marginRight: '10px', 
                      backgroundColor: '#4F46E5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      // 로딩 중일 때는 살짝 투명하게 해서 "나 일하고 있어"라고 보여주기
                      opacity: isApproving ? 0.7 : 1,
                      cursor: isApproving ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isApproving ? (
                      <>
                        {/* 부트스트랩 스피너 (회전하는 원형 아이콘) */}
                        <span 
                          className="spinner-border spinner-border-sm" 
                          role="status" 
                          aria-hidden="true"
                          style={{ width: '1rem', height: '1rem' }}
                        ></span>
                        <span>처리 중...</span>
                      </>
                    ) : (
                      <>
                        <RiCheckLine /> 
                        <span>{selectedIds.length}건 일괄 정산하기</span>
                      </>
                    )}
                  </button>
              )}
              <button 
                className="btn btn-secondary" 
                onClick={handleExcelDownload} // 함수 연결!
                style={{ whiteSpace: 'nowrap' }}
              >
                <RiFileDownloadLine /> 정산내역 다운로드
              </button>
            </div>
        </div>


        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={selectedIds.length > 0 && selectedIds.length === filteredData.filter(i => getSettlementStatus(i) !== 'completed').length}
                    />
                  </th>
                <th style={{ width: 130 }}>정산번호</th>
                <th>기업정보</th>
                <th style={{ width: 100 }}>정산기간</th>
                <th style={{ width: 100 }}>매출액</th>
                <th style={{ width: 90 }}>수수료</th>
                <th style={{ width: 100 }}>정산금액</th>
                <th style={{ width: 75 }}>상태</th>
                <th style={{ width: 90 }}>관리</th>
              </tr>
            </thead>
           <tbody>
              {filteredData.map(item => {
                // 1. 서버 데이터 매핑 (대문자/소문자 대응)
                const id = item.SETTLENO || item.settleNo || item.id || '-';
                const company = item.COMPNAME || item.compName || item.company || '알 수 없음';
                const businessNo = item.BRNO || item.brNo || item.businessNo || '';
                const settleMonth = item.SETTLEMONTH || item.settleMonth || item.period || '-';
                
                // 2. 금액 데이터 (숫자가 아닐 경우를 대비해 0 처리)
                const sales = item.TOTALSALES || item.totalSales || item.sales || 0;
                const fee = item.COMMISSION || item.commission || item.fee || 0;
                const settlement = item.SETTLEPAY || item.settlePay || item.settlement || 0;
                
                // 3. 상태값 매핑 (서버의 '정산대기' 등을 'pending'으로 변환)
                const rawStatus = item.STATUS || item.status || '';
                let statusKey = 'pending'; // 기본값
                if (rawStatus === '정산완료') statusKey = 'completed';
                else if (rawStatus === '정산중') statusKey = 'processing';
                else statusKey = 'pending';

                const statusConfig = getSettlementStatus(item);
                const isCompleted = statusConfig.key === 'completed';

                return (
                  <tr key={id}>
                    <td>
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(id)}
                          onChange={() => handleSelectOne(id)}
                          disabled={isCompleted} // 이미 완료된 건 체크 불가!
                        />
                      </td>
                    <td>
                      <div>
                        <div className="font-medium" style={{ cursor: 'pointer' }} onClick={() => handleViewDetail(item)}>{id}</div>
                        <div className="text-secondary" style={{ fontSize: '0.7rem' }}>{item.ORDERCOUNT || item.orders?.length || 0}건</div>
                      </div>
                    </td>
                    <td>
                      <div className="member-info">
                        <div className="avatar" style={{ background: '#E0E7FF', color: '#4F46E5' }}><RiBuildingLine /></div>
                        <div>
                          <div className="font-medium">{company}</div>
                          <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{businessNo}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{settleMonth}</td>
                    <td>₩{Number(sales).toLocaleString()}</td>
                    <td style={{ color: '#f59e0b' }}>-₩{Math.round(Number(fee)).toLocaleString()}</td>
                    <td className="font-medium" style={{ color: '#10b981' }}>₩{Math.round(Number(settlement)).toLocaleString()}</td>
                  
                    <td>
                      <span className={`badge ${statusConfig.className}`} style={{ whiteSpace: 'nowrap' }}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="table-action-btn" title="상세보기" onClick={() => handleViewDetail(item)}><RiEyeLine /></button>
                        {statusKey === 'pending' && (
                          <button className="table-action-btn" style={{ color: 'var(--success-color)' }} title="정산 처리" onClick={() => handleProcess(item)}><RiCheckLine /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="pagination-btn" disabled>&lt;</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">&gt;</button>
        </div>
      </div>

    {/* 상세보기 모달 */}
    
      <Modal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, settlement: null })}
        title="정산 상세정보"
        className="modal-900"
        size="large"
      >
        {detailModal.settlement && (() => {
        const resData = detailModal.settlement;
        const s = resData.enterprise || {};
        const orders = resData.orderDetails || []; // 주문 상세 내역 
        const products = resData.productSummary || []; // 상품별 요약내역

        console.log("상세 모달 데이터:", resData, s, orders, products);

      //1. 이제 쿼리에서 "status"를 보내주니까 바로 잡힘!
        const dbStatus = s.status || s.STATUS || '정산대기'; 

        // 2. 판정 (문자열 비교로 깔끔하게)
        const isCompleted = dbStatus === '정산완료';
        const isProcessing = dbStatus === '정산중';

        // 3. 배경색 결정
        const bgGradient = isCompleted 
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
          : isProcessing 
            ? 'linear-gradient(135deg, #4A90D9 0%, #357ABD 100%)' 
            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';

          // 필드명 매핑 (Oracle 대문자 대응)
          const company = s.COMPNAME || s.compName || '-';
          const businessNo = s.BRNO || s.brNo || '-';
          const representative = s.CEONAME || s.ceoName || '-';
          const phone = s.COMPTEL || s.tel || '-';
          const email = s.EMAIL || s.email || '-';
          const id = s.SETTLENO || s.saleNo || '-';
          const period = s.SETTLEMONTH || s.settleMonth || '-';

          // 금액 데이터
          const sales = s.TOTALSALES || s.totalSales || s.sales || 0;
          const fee = s.COMMISSION || s.commission || s.fee || 0;
          const settlementAmount = s.settlePay || 0;
          const feeRate = s.feeRate || 10;   // 수수료율 (기본값 10%)
          const changeRate = s.changeRate || 0; // 전월 대비 증

          // 계좌 정보
          const bank = s.bankName || '-';
          const accountNo = s.ACC_NO || s.accountNo || '-';
          const accountHolder = s.ACC_HOLDER || s.accountHolder || '-';

          return (
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
               {/* --- 1. 상태 뱃지 배너 --- */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '28px 36px', 
                  background: bgGradient, 
                  borderRadius: '24px', 
                  color: 'white', 
                  marginBottom: 28,
                  boxShadow: '0 12px 20px -5px rgba(0, 0, 0, 0.15)',
                  position: 'relative',
                  overflow: 'hidden' 
                }}>
                  {/* 배경 장식 원형 */}
                  <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.12)', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', left: '-20px', bottom: '-40px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: 28, position: 'relative', zIndex: 1 }}>
                    {/* 아이콘 글래스 모피즘 박스 */}
                    <div style={{ 
                      width: 72, height: 72, borderRadius: '20px', 
                      background: 'rgba(255, 255, 255, 0.25)', 
                      backdropFilter: 'blur(12px)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ fontSize: '2.5rem', display: 'flex' }}>
                        {isCompleted ? <RiCheckboxCircleLine /> : <RiTimeLine />}
                      </div>
                    </div>

                    {/* 텍스트 정보: 제목과 설명을 위아래로 분리 */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <h4 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
                          {dbStatus}
                        </h4>
                        <span style={{ 
                          fontSize: '0.75rem', padding: '4px 10px', 
                          background: 'rgba(0,0,0,0.15)', borderRadius: '8px', 
                          fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px'
                        }}>
                          {isCompleted ? 'Confirmed' : 'Action Required'}
                        </span>
                      </div>
                      <p style={{ fontSize: '1rem', opacity: 0.95, margin: 0, fontWeight: 500 }}>
                        {isCompleted
                          ? `✅ 해당 정산 건은 승인이 완료되어 지급 절차가 마무리되었습니다.`
                          : `📢 현재 담당자가 해당 건의 정산 내역 및 증빙 자료를 검토 중입니다.`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- 금액 대시보드 섹션 시작 --- */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: 16, 
                    marginBottom: 28 
                  }}>
                    {/* 1. 총 매출액 카드 */}
                    <div style={{ 
                      padding: '20px', 
                      background: '#ffffff', 
                      borderRadius: '16px', 
                      border: '1px solid #e2e8f0',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 8, fontWeight: 500 }}>총 매출액</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
                        ₩{Math.round(Number(sales)).toLocaleString()}
                      </div>
                    </div>

                    {/* 2. 공제 수수료 카드 (빨간색 포인트) */}
                    <div style={{ 
                      padding: '20px', 
                      background: '#fff1f2', // 연한 분홍/빨강 배경
                      borderRadius: '16px', 
                      border: '1px solid #fecdd3',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '0.85rem', color: '#e11d48', marginBottom: 8, fontWeight: 600 }}>공제 수수료 ({feeRate}%)</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e11d48' }}>
                        - ₩{Math.round(Number(fee)).toLocaleString()}
                      </div>
                    </div>

                    {/* 3. 최종 입금 예정액 카드 (초록색 하이라이트) */}
                    <div style={{ 
                      padding: '20px', 
                      background: '#f0fdf4', // 연한 초록 배경
                      borderRadius: '16px', 
                      border: '1px solid #bbf7d0',
                      textAlign: 'center',
                      boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)'
                    }}>
                      <div style={{ fontSize: '0.85rem', color: '#166534', marginBottom: 8, fontWeight: 600 }}>최종 입금 예정액</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981' }}>
                        ₩{Math.round(Number(settlementAmount)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {/* --- 금액 대시보드 섹션 끝 --- */}

             {/* 기업 정보 & 정산 정보 통합 섹션 */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1.2fr 1fr', // 기업 정보를 조금 더 넓게
                  gap: 20, 
                  marginBottom: 24 
                }}>
                  
                  {/* 1. 기업 프로필 카드 */}
                  <div style={{ 
                    padding: 24, 
                    background: '#ffffff', 
                    borderRadius: 16, 
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16
                  }}>
                    <h5 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <RiBuildingLine style={{ color: '#4F46E5' }} /> 기업 프로필
                    </h5>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ width: 56, height: 56, borderRadius: 12, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', fontSize: '1.5rem' }}>
                        {company.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b' }}>{company}</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>사업자번호: {businessNo}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>대표자</span>
                        <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>{representative}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>연락처</span>
                        <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>{phone}</span>
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>이메일</span>
                        <span style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>{email}</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. 정산 요약 정보 카드 */}
                  <div style={{ 
                    padding: 24, 
                    background: '#ffffff', 
                    borderRadius: 16, 
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16
                  }}>
                    <h5 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <RiCalendarLine style={{ color: '#4F46E5' }} /> 정산 식별 정보
                    </h5>

                    <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>정산번호</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#4F46E5', background: '#ffffff', padding: '2px 8px', borderRadius: 6, border: '1px solid #E2E8F0' }}>{id}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>정산대상 기간</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>{period}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>총 주문수</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>{orders.length}건</span>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 'auto', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', fontStyle: 'italic' }}>
                      * 해당 데이터는 시스템에 의해 자동 집계되었습니다.
                    </div>
                  </div>
                </div>

             {/* 정산 금액 섹션 - 세련된 영수증 스타일 */}
                <div style={{ 
                  marginBottom: 24, 
                  padding: '24px', 
                  background: 'linear-gradient(to bottom right, #ffffff, #f8fafc)', 
                  borderRadius: '16px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                  <h5 style={{ 
                    fontSize: '1rem', 
                    fontWeight: 700, 
                    color: '#1e293b', 
                    marginBottom: 20, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8 
                  }}>
                    <RiMoneyDollarCircleLine style={{ color: '#4F46E5', fontSize: '1.2rem' }} /> 결제 및 정산 요약
                  </h5>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* 총 매출액 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>총 매출액</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>
                        ₩{Number(sales).toLocaleString()}
                      </span>
                    </div>

                    {/* 수수료 (마이너스 요소 강조) */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      paddingBottom: '16px',
                      borderBottom: '2px dashed #e2e8f0' // 영수증 절취선 느낌!
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#64748b', fontSize: '0.9rem' }}>플랫폼 수수료</span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          padding: '2px 8px', 
                          background: '#fef3c7', 
                          color: '#d97706', 
                          borderRadius: '12px',
                          fontWeight: 600
                        }}>
                          {String(feeRate)}%
                        </span>
                      </div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ef4444' }}>
                        - ₩{Number(fee).toLocaleString()}
                      </span>
                    </div>

                    {/* 최종 정산 금액 (하이라이트) */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '16px',
                      background: '#f0fdf4', // 연한 초록색 배경으로 '정산 가능' 의미 부여
                      borderRadius: '12px',
                      marginTop: '4px'
                    }}>
                      <span style={{ fontWeight: 700, color: '#166534', fontSize: '1rem' }}>최종 정산금액</span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: 800, 
                          color: '#10b981',
                          textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>
                          ₩{Number(settlementAmount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              {/* 입금 계좌 섹션 - 카드 스타일로 리뉴얼 */}
                <div style={{ 
                  marginBottom: 24, 
                  padding: 24, 
                  background: '#f8fafc', // 아주 연한 회색/푸른색 배경
                  borderRadius: 16, 
                  border: '1px solid #e2e8f0' 
                }}>
                  <h5 style={{ 
                    fontSize: '1rem', 
                    fontWeight: 700, 
                    color: '#334155', 
                    marginBottom: 16, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8 
                  }}>
                    <RiBankCardLine style={{ color: '#4F46E5' }} /> 입금 계좌 정보
                  </h5>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: 20,
                    alignItems: 'center'
                  }}>
                    {/* 은행 & 예금주 묶음 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: 4 }}>은행명</span>
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>{bank}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: 4 }}>예금주</span>
                        <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>{accountHolder}</span>
                      </div>
                    </div>

                    {/* 계좌번호 - 가장 중요하므로 강조! */}
                      <div style={{ 
                        padding: '16px 20px', 
                        background: '#ffffff', 
                        borderRadius: 12, 
                        border: '1px dashed #cbd5e1', 
                        position: 'relative',
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'space-between', // 번호와 버튼을 양쪽으로!
                        alignItems: 'center'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 600, display: 'block', marginBottom: 6 }}>계좌번호</span>
                          <span style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: 700, 
                            color: '#1e293b', 
                            letterSpacing: '0.5px',
                            fontFamily: 'monospace'
                          }}>
                            {accountNo}
                          </span>
                        </div>

                        {/* 복사 버튼 */}
                        <button 
                          onClick={() => handleCopy(accountNo)}
                          title="계좌번호 복사"
                          style={{
                            background: '#f1f5f9',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#4F46E5'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#64748b'; }}
                        >
                          <RiFileListLine style={{ fontSize: '1.2rem' }} /> {/* 복사 아이콘 대용으로 파일 리스트 아이콘 사용 */}
                          <span style={{ fontSize: '0.7rem', marginLeft: '4px', fontWeight: 600 }}>복사</span>
                        </button>
                      </div>
                    </div>
                  </div>

              {/* 1. 상품별 매출 요약 섹션 추가 */}
                <div style={{ marginBottom: 32, padding: 20, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RiFileListLine style={{ color: '#4F46E5' }} /> 상품별 매출 요약
                  </h5>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="table" style={{ fontSize: '0.85rem', minWidth: '500px' }}>
                      <thead style={{ background: '#f8fafc' }}>
                        <tr>
                          <th>상품명</th>
                          <th style={{ textAlign: 'center', width: '80px' }}>판매수량</th>
                          <th style={{ textAlign: 'right', width: '120px' }}>매출금액</th>
                          <th style={{ width: '150px' }}>매출 비중</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length > 0 ? products.map((prod, idx) => (
                          <tr key={`prod-${prod.prodName || idx}-${idx}`}>
                            <td className="font-medium">{prod.prodName || '-'}</td>
                            <td style={{ textAlign: 'center' }}>{prod.quantity || 0}개</td>
                            <td style={{ textAlign: 'right', fontWeight: 600 }}>
                              ₩{Number(prod.amount || 0).toLocaleString()}
                            </td>
                            <td>
                              {/* 비중을 시각적으로 보여주는 미니 바(Bar) */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ flex: 1, height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                                  <div style={{ 
                                    width: `${prod.share || 0}%`, 
                                    height: '100%', 
                                    background: 'linear-gradient(90deg, #4F46E5, #818CF8)',
                                    borderRadius: 4 
                                  }} />
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', minWidth: '35px' }}>{prod.share}%</span>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>데이터가 없습니다.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              {/* 주문 상세 내역 */}
              <div style={{ 
                padding: 24, 
                background: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: 16,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' // 살짝 그림자 추가
              }}>
                <h5 style={{ 
                  fontSize: '1rem', 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  marginBottom: 20, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 10 
                }}>
                  <RiFileListLine style={{ color: '#4F46E5', fontSize: '1.2rem' }} /> 주문 상세 내역
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>
                    (총 {orders.length}건)
                  </span>
                </h5>

                <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                  <table className="table" style={{ fontSize: '0.85rem', borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th style={{ padding: '12px 16px', color: '#475569' }}>예약번호</th>
                        <th style={{ padding: '12px 16px', color: '#475569' }}>상품정보</th>
                        <th style={{ padding: '12px 16px', color: '#475569' }}>이용일/예약자</th>
                        <th style={{ padding: '12px 16px', color: '#475569', textAlign: 'right' }}>금액</th>
                        <th style={{ padding: '12px 16px', color: '#475569', textAlign: 'right' }}>수수료(10%)</th>
                        <th style={{ padding: '12px 16px', color: '#475569', textAlign: 'right' }}>정산예정액</th>
                        <th style={{ padding: '12px 16px', color: '#475569', textAlign: 'center' }}>상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, idx) => {
                        const statusConfig = getSettlementStatus(order);
                        const amount = order.payAmount || 0;
                        const fee = Math.round(amount * 0.1);
                        const netSettlement = amount - fee;

                        return (
                          <tr key={`order-${order.orderNo || idx}-${idx}`} style={{ transition: 'background 0.2s' }} className="hover-row">
                            <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                              <span style={{ fontWeight: 600, color: '#4F46E5' }}>{order.orderNo || '-'}</span>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>{order.orderDate || '-'}</div>
                            </td>
                            <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                              <div style={{ fontWeight: 500, color: '#334155' }}>{order.prodName || '-'}</div>
                            </td>
                            <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <span style={{ color: '#475569' }}>{order.useDate || '-'}</span>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}><RiUserLine style={{ verticalAlign: 'middle' }} /> {order.bookerName || '-'}</span>
                              </div>
                            </td>
                            <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', textAlign: 'right' }}>
                              ₩{amount.toLocaleString()}
                            </td>
                            <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', color: '#f59e0b' }}>
                              -₩{fee.toLocaleString()}
                            </td>
                            <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>
                              ₩{netSettlement.toLocaleString()}
                            </td>
                            <td style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
                              <span className={`badge ${statusConfig.className}`} style={{ 
                                fontSize: '0.75rem', 
                                padding: '4px 10px', 
                                borderRadius: '20px',
                                fontWeight: 600
                              }}>
                                {statusConfig.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* 정산 확정 확인 모달 */}
        <ConfirmModal
          isOpen={processModal.isOpen}
          onClose={() => setProcessModal({ isOpen: false, settlement: null })}
          onConfirm={handleProcessConfirm}
          title="정산 확정"
          message={
            processModal.settlement ? (
            `🏢 업체명: ${processModal.settlement.COMPNAME || '알 수 없음'}\n` +
            `🔢 사업자번호: ${processModal.settlement.BRNO || '-'}\n` +
            `📅 정산기간: ${processModal.settlement.SETTLEMONTH || '-'}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `💰 총 매출액: ₩${Number(processModal.settlement.TOTALSALES || 0).toLocaleString()}\n` +
            `💸 수수료: -₩${Number(processModal.settlement.COMMISSION || 0).toLocaleString()}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `✅ 최종 정산금액: ₩${Number(processModal.settlement.SETTLEPAY || 0).toLocaleString()}\n\n` +
            `위 내용으로 정산을 확정하시겠습니까?`
          ) : ""
          }
          confirmText="확정 처리"
          type="primary"
        />
    </div>
  );
}

export default Settlements;
