import * as XLSX from 'xlsx';
import { useEffect, useState } from 'react';
import { SETTLE_STATUS, getSettlementStatus } from './settlement';

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
  const status = s.STATUS || s.status || "all";

  // 3. 검색어 필터링 (String으로 감싸서 혹시 모를 숫자 데이터 에러 방지)
  const matchesSearch = 
    String(company).includes(searchTerm) || 
    String(businessNo).includes(searchTerm) || 
    String(id).includes(searchTerm);

  // 4. 상태 필터링
  const matchesStatus = statusFilter === 'all' || status === statusFilter;

  return matchesSearch && matchesStatus;
});

  // 통계 계산 섹션
const dataToCalculate = settlementsData || [];

// 모든 데이터에 현재 계산된 상태 키값을 미리 부여하면 계산이 편해!
const enrichedData = dataToCalculate.map(item => ({
  ...item,
  calculatedStatus: getSettlementStatus(item)
}));

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

// 정산 완료 관련
const completedData = dataToCalculate.filter(s => s.status === '정산완료');
const completedSettlement = completedData.reduce((acc, cur) => acc + (cur.settlePay || 0), 0);

// ✅ 정산 가능 관련 (추가!)
const readyData = enrichedData.filter(s => s.calculatedStatus === 'ready');
const readyCount = readyData.length;
const readySettlement = readyData.reduce((acc, cur) => acc + (Number(cur.SETTLEPAY || cur.settlePay) || 0), 0);

// 정산 대기 관련 (에러 해결 포인트!)
const pendingData = dataToCalculate.filter(s => s.status === '정산대기');
const pendingCount = pendingData.length; // ★ 여기서 정의!
const pendingSettlement = pendingData.reduce((acc, cur) => acc + (cur.settlePay || 0), 0);

  // 정산 처리
const handleProcess = (settlement) => {
      setProcessModal({ isOpen: true, settlement });
    };

const handleProcessConfirm = async () => {
      const s = processModal.settlement;
      if (!s) return;

      // 1. 보여준 데이터(대문자)에 맞춰서 정확하게 추출
      const saleNo = Number(s.SETTLENO);
      let compNo = s.COMP_NO || s.COMPNO || s.compNo;
      const settlePay = Number(s.SETTLEPAY);

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

// 기타 통계
const totalSales = dataToCalculate.reduce((acc, cur) => acc + (cur.totalSales || 0), 0);
const totalFee = dataToCalculate.reduce((acc, cur) => acc + (cur.commission || 0), 0);
  
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
  
  // 3. 워크북(Workbook) 생성 및 시트 추가
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "정산내역");

  // 4. 파일 다운로드 (파일명에 오늘 날짜 넣어주는 센스!)
  const fileName = `[Mohaeng] 정산내역_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

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

      {/* 통계 카드 */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 24 }}>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #4A90D9, #357ABD)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiMoneyDollarCircleLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>₩{totalSales.toLocaleString()}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>총 매출액</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiPercentLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>₩{totalFee.toLocaleString()}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>총 수수료</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiCheckboxCircleLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>₩{completedSettlement.toLocaleString()}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>정산 완료</div>
            </div>
          </div>
        </div>
        <div className="card stat-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #ef4444, #dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
              <RiTimeLine />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>₩{pendingSettlement.toLocaleString()}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>정산 대기</div>
            </div>
          </div>
        </div>
      </div>

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
            <select className="form-input form-select" value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} style={{ width: 'auto' }}>
              <option value="all">전체 기간</option>
              <option value="2024-12">2024년 12월</option>
              <option value="2024-11">2024년 11월</option>
              <option value="2024-10">2024년 10월</option>
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
                <RiFileDownloadLine /> 정산서 다운로드
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
                <th style={{ width: 70 }}>증감</th>
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
                    <td style={{ color: '#f59e0b' }}>-₩{Number(fee).toLocaleString()}</td>
                    <td className="font-medium" style={{ color: '#10b981' }}>₩{Number(settlement).toLocaleString()}</td>
                    <td>
                      {item.changeRate > 0 ? (
                        <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.85rem' }}>
                          <RiArrowUpLine /> +{item.changeRate}%
                        </span>
                      ) : item.changeRate < 0 ? (
                        <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.85rem' }}>
                          <RiArrowDownLine /> {item.changeRate}%
                        </span>
                      ) : (
                        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>0%</span>
                      )}
                    </td>
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
        const s = resData.enterprise || {};       // 기업 & 정산 요약
        const orders = resData.orderDetails || []; // 주문 상세 내역 (아까 헤맸던 거!)
        const products = resData.productSummary || []; // 상품별 요약

        // 1. 상태 및 스타일 설정
        const rawStatus = s.status || '';
        let statusKey = 'pending';
        if (rawStatus === 'S02') statusKey = 'completed'; 
        else if (rawStatus === 'S01') statusKey = 'processing';
              
          if (rawStatus === '정산완료') statusKey = 'completed';
          else if (rawStatus === '정산중') statusKey = 'processing';

          const config = SETTLE_STATUS[statusKey] || SETTLE_STATUS.PENDING;
          const isCompleted = statusKey === 'completed';
          const bgGradient = isCompleted 
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : statusKey === 'processing' 
              ? 'linear-gradient(135deg, #4A90D9 0%, #357ABD 100%)'
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';

              console.log(s)
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
              {/* 상태 뱃지 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, background: bgGradient, borderRadius: 12, color: 'white', marginBottom: 20 }}>
                {isCompleted ? <RiCheckboxCircleLine style={{ fontSize: 40 }} /> : <RiTimeLine style={{ fontSize: 40 }} />}
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 4 }}>{config.label}</h4>
                  <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>
                    {isCompleted
                      ? `정산 완료일: ${s.COMPLETEDAT || s.completedAt || '-'}`
                      : `정산 예정일: ${s.SCHEDULEDDATE || s.scheduledDate || '-'}`}
                  </p>
                </div>
              </div>

              {/* 기업 정보 */}
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiBuildingLine /> 기업 정보
                </h5>
                <div className="detail-list">
                  <div className="detail-item"><span className="detail-label">기업명</span><span className="detail-value font-medium">{company}</span></div>
                  <div className="detail-item"><span className="detail-label">사업자번호</span><span className="detail-value">{businessNo}</span></div>
                  <div className="detail-item"><span className="detail-label"><RiUserLine style={{ marginRight: 4 }} />대표자명</span><span className="detail-value">{representative}</span></div>
                  <div className="detail-item"><span className="detail-label"><RiPhoneLine style={{ marginRight: 4 }} />연락처</span><span className="detail-value">{phone}</span></div>
                  <div className="detail-item"><span className="detail-label"><RiMailLine style={{ marginRight: 4 }} />이메일</span><span className="detail-value">{email}</span></div>
                </div>
              </div>

              {/* 정산 정보 */}
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiCalendarLine /> 정산 정보
                </h5>
                <div className="detail-list">
                  <div className="detail-item"><span className="detail-label">정산번호</span><span className="detail-value font-medium">{id}</span></div>
                  <div className="detail-item"><span className="detail-label">정산기간</span><span className="detail-value">{period}</span></div>
                  <div className="detail-item"><span className="detail-label">주문건수</span><span className="detail-value">{orders.length}건</span></div>
                </div>
              </div>

              {/* 정산 금액 */}
              <div style={{ marginBottom: 20, padding: 20, background: '#f8fafc', borderRadius: 12 }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiMoneyDollarCircleLine /> 정산 금액
                </h5>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ color: '#64748b' }}>총 매출액</span>
                  <span className="font-medium">₩{Number(sales).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ color: '#64748b' }}>수수료({String(feeRate)}%)</span>
                  <span style={{ color: '#f59e0b' }}>-₩{Number(fee).toLocaleString()}</span>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 600 }}>
                  <span>정산금액</span>
                  <span style={{ color: '#10b981' }}>₩{Number(settlementAmount).toLocaleString()}</span>
                </div>
              </div>

              {/* 입금 계좌 */}
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiBankCardLine /> 입금 계좌
                </h5>
                <div className="detail-list">
                  <div className="detail-item"><span className="detail-label">은행</span><span className="detail-value">{bank}</span></div>
                  <div className="detail-item"><span className="detail-label">계좌번호</span><span className="detail-value font-medium">{accountNo}</span></div>
                  <div className="detail-item"><span className="detail-label">예금주</span><span className="detail-value">{accountHolder}</span></div>
                </div>
              </div>

              {/* 주문 상세 내역 */}
              <div>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiFileListLine /> 주문 상세 내역
                </h5>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table" style={{ fontSize: '0.8rem' }}>
                    <thead>
                      <tr>
                        <th>예약번호</th><th>예약일시</th><th>상품명</th><th>예약자</th><th>이용일</th><th>금액</th><th>수수료</th><th>정산액</th><th>상태</th>
                      </tr>
                    </thead>
                      <tbody>
                        {orders.map((order, idx) => {
                          const statusConfig = getSettlementStatus(order);
                          const amount = order.payAmount || 0;
                          const fee = Math.round(amount * 0.1); // 수수료 10% 계산
                          const netSettlement = amount - fee;   // 정산액 계산

                          return (
                            <tr key={idx}>
                              <td className="font-medium">{order.orderNo || '-'}</td>
                              <td>{order.orderDate || '-'}</td>
                              <td>{order.prodName || '-'}</td>
                              <td>{order.bookerName || '-'}</td>
                              <td>{order.useDate || '-'}</td>
                              <td>₩{amount.toLocaleString()}</td>
                              <td style={{ color: '#f59e0b' }}>-₩{fee.toLocaleString()}</td>
                              <td className="font-medium">₩{netSettlement.toLocaleString()}</td>
                              <td>
                                <span 
                                    className={`badge ${statusConfig.className}`} 
                                    style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}
                                  >
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
