import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

// ChartJS 등록
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

const SettlementDash = ({ data = [] }) => {
  
  // --- [데이터 가공 로직] ---
  
  // 1. 월별 정산 추이 (Line)
  const monthlyData = data.reduce((acc, cur) => {
    const month = cur.SETTLEMONTH || '미분류';
    acc[month] = (acc[month] || 0) + Number(cur.TOTALSALES || 0);
    return acc;
  }, {});
  const monthLabels = Object.keys(monthlyData).sort();

  // 2. 상태별 분포 (Doughnut)
  const statusCounts = data.reduce((acc, cur) => {
    const status = cur.STATUS || '미분류';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // 3. 업체별 매출 TOP 5 (Bar)
  const compData = data.reduce((acc, cur) => {
    const name = cur.COMPNAME || '알 수 없음';
    acc[name] = (acc[name] || 0) + Number(cur.TOTALSALES || 0);
    return acc;
  }, {});
  const topComps = Object.entries(compData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // --- [차트 설정들] ---

  const lineChartData = {
    labels: monthLabels,
    datasets: [{
      label: '월별 총 매출액',
      data: monthLabels.map(m => monthlyData[m]),
      borderColor: '#4A90D9',
      backgroundColor: 'rgba(74, 144, 217, 0.1)',
      fill: true,
      tension: 0.4,
    }]
  };

  const doughnutData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#94a3b8'], // 완료, 대기, 진행 등
      borderWidth: 0,
    }]
  };

  const barData = {
    labels: topComps.map(c => c[0]),
    datasets: [{
      label: '매출액 (₩)',
      data: topComps.map(c => c[1]),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 8,
    }]
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', marginBottom: '40px' }}>
      
      {/* 1. 월별 추이 (큰 비중) */}
      <div style={{ gridColumn: 'span 8', background: '#fff', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h4 style={{ margin: '0 0 20px 0', fontWeight: 800, color: '#1e293b' }}>📈 월별 정산 추이</h4>
        <div style={{ height: '300px' }}><Line data={lineChartData} options={{ maintainAspectRatio: false }} /></div>
      </div>

      {/* 2. 상태 분포 */}
      <div style={{ gridColumn: 'span 4', background: '#fff', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h4 style={{ margin: '0 0 20px 0', fontWeight: 800, color: '#1e293b' }}>📊 정산 상태 비중</h4>
        <div style={{ height: '300px' }}><Doughnut data={doughnutData} options={{ maintainAspectRatio: false, cutout: '70%' }} /></div>
      </div>

      {/* 3. TOP 5 업체 (가로로 길게) */}
      <div style={{ gridColumn: 'span 12', background: '#fff', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <h4 style={{ margin: '0 0 20px 0', fontWeight: 800, color: '#1e293b' }}>🏆 매출 상위 5개 업체</h4>
        <div style={{ height: '250px' }}><Bar data={barData} options={{ indexAxis: 'y', maintainAspectRatio: false }} /></div>
      </div>

    </div>
  );
};

export default SettlementDash;