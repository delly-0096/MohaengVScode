import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./Products.css";
import api from "../../api/api";
import TourMap from "./TourMap";
import { Bounce, toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

// 카테고리 목록
const categories = [
  { value: "tour", label: "투어" },
  { value: "activity", label: "액티비티" },
  { value: "ticket", label: "입장권/티켓" },
  { value: "class", label: "클래스/체험" },
  { value: "transfer", label: "교통/이동" },
];

// 지역 코드 맵
const AREA_CODE_MAP = {
  1: "서울",
  2: "인천",
  3: "대전",
  4: "대구",
  5: "광주",
  6: "부산",
  7: "울산",
  8: "세종",
  31: "경기",
  32: "강원",
  33: "충북",
  34: "충남",
  35: "경북",
  36: "경남",
  37: "전북",
  38: "전남",
  39: "제주",
};

// 기본 예약 시간
const DEFAULT_TIMES = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

function Tours() {
  // 상태 관리
  const [toursData, setToursData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [selectedTour, setSelectedTour] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // 통계 상태
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
  });

  // 목록 조회
  const fetchTourList = (page = 1) => {
    api
      .get("/admin/products/tours", {
        params: {
          currentPage: page,
          searchWord: searchTerm,
          searchType: filterCategory,
          searchStatus: filterStatus,
          searchRegion: filterRegion,
        },
      })
      .then((res) => {
        console.log("API 응답 데이터:", res.data);
        setToursData(res.data.dataList || []);
        setTotalCount(res.data.totalRecord || 0);
        setCurrentPage(page);
      })
      .catch((err) => console.error("목록 로딩 실패:", err));
  };

  // 통계 조회
  const fetchTourStats = () => {
    api
      .get("/admin/products/tours/stats")
      .then((res) => {
        setStats({
          total: res.data.TOTALCOUNT || 0,
          active: res.data.ACTIVECOUNT || 0,
          inactive: res.data.INACTIVECOUNT || 0,
          pending: res.data.PENDINGCOUNT || 0,
        });
      })
      .catch((err) => console.error("통계 로딩 실패:", err));
  };

  useEffect(() => {
    fetchTourList(1);
    fetchTourStats();
  }, []);

  useEffect(() => {
    fetchTourList(1);
  }, [searchTerm, filterStatus, filterCategory, filterRegion]);

  // 표시 상태 계산
  const getDisplayStatus = (tour) => {
    if (tour.displayStatus) return tour.displayStatus;
    if (tour.aprvYn === "Y" && tour.approveStatus === "판매중") return "판매중";
    if (tour.aprvYn === "Y") return "판매중지";
    return "승인대기";
  };

  // 금액 포맷
  const formatPrice = (price) => {
    if (!price) return "0원";
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  };

  // 숫자 포맷
  const formatNum = (num) => new Intl.NumberFormat("ko-KR").format(num);

  // 카테고리 라벨
  const getCategoryLabel = (value) => {
    const found = categories.find((c) => c.value === value);
    return found ? found.label : value || "기타";
  };

  // 지역 라벨
  const getRegionLabel = (code) => {
    return AREA_CODE_MAP[code] || code || "미지정";
  };

  // 소요시간 라벨
  const getDurationLabel = (value) => {
    if (!value) return "-";
    if (value <= 1) return "1시간 이내";
    if (value <= 3) return "1~3시간";
    if (value <= 6) return "3~6시간";
    return "하루 이상";
  };

  // 날짜 포맷
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    if (dateStr.includes("T")) {
      return dateStr.split("T")[0];
    }
    return dateStr.split(" ")[0];
  };

  // 상세 모달 열기
  const openDetailModal = async (tour) => {
    try {
      const res = await api.get(`/admin/products/tours/${tour.tripProdNo}`);
      if (res.data) {
        setSelectedTour(res.data);
        setIsDetailModalOpen(true);
      }
    } catch (e) {
      console.error("상세 조회 에러:", e);
      alert("상세 조회 실패");
    }
  };

  // 상품 승인
  const handleApprove = async (tripProdNo) => {
    // if (
    //   !window.confirm(
    //     "이 상품을 승인하시겠습니까?\n승인 시 즉시 '판매중' 상태로 전환됩니다.",
    //   )
    // )
    //   return;

    let flag = false;
    await Swal.fire({
      title: "이 상품을 승인하시겠습니까?",
      text: "승인 시 즉시 '판매중' 상태로 전환됩니다.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "승인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        flag = true;
      }
    });

    if (flag == false) {
      return;
    }

    try {
      console.log("진입");
      const response = await api.patch(
        `/admin/products/tours/approve/${tripProdNo}`,
      );
      if (response.status === 200) {
        // alert("✅ 승인 완료!");
        toast.success(`승인 완료!`, {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          style: {
            whiteSpace: "pre-line",
            lineHeight: "1.4",
            fontSize: "14px",
          },
          transition: Bounce,
        });
        setIsDetailModalOpen(false);
        fetchTourList(currentPage);
        fetchTourStats();
      }
    } catch (error) {
      console.error("승인 오류:", error);
      alert("승인 처리 중 오류가 발생했습니다.");
    }
  };

  // 판매 상태 토글 (상세 모달용)
  const handleToggleSale = async (item) => {
    const isCurrentlySelling = item?.delYn === "N" || !item?.delYn;
    const newDelYn = isCurrentlySelling ? "Y" : "N";
    const actionText = isCurrentlySelling ? "판매 중지" : "판매 재개";

    if (!window.confirm(`이 상품을 ${actionText} 하시겠습니까?`)) return;

    try {
      const response = await api.patch("/admin/products/tours/toggle-sale", {
        tripProdNo: item.tripProdNo,
        delYn: newDelYn,
      });

      if (response.status === 200) {
        alert(`✅ ${actionText} 완료!`);
        setIsDetailModalOpen(false);
        fetchTourList(currentPage);
        fetchTourStats();
      }
    } catch (error) {
      console.error("상태 변경 오류:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  // 목록에서 상태 토글
  const toggleStatus = async (tour) => {
    const displayStatus = getDisplayStatus(tour);
    const nextDelYn = displayStatus === "판매중" ? "Y" : "N";

    try {
      const res = await api.patch("/admin/products/tours/toggle-sale", {
        tripProdNo: tour.tripProdNo,
        delYn: nextDelYn,
      });

      if (res.data > 0) {
        fetchTourList(currentPage);
        fetchTourStats();
      }
    } catch (error) {
      console.error("토글 실패:", error);
    }
  };

  // 엑셀 다운로드
  const downloadExcel = async () => {
    try {
      const res = await api.get("/admin/products/tours/excel", {
        params: {
          searchWord: searchTerm,
          searchType: filterCategory,
          searchStatus: filterStatus,
          searchRegion: filterRegion,
        },
      });

      const excelData = res.data.map((tour, index) => ({
        번호: index + 1,
        상품명: tour.tripProdTitle,
        카테고리: getCategoryLabel(tour.prodCtgryType),
        지역: getRegionLabel(tour.ctyNm),
        판매상태: tour.displayStatus || getDisplayStatus(tour),
        판매가: tour.price ? `${tour.price.toLocaleString()}원` : "-",
        재고: tour.curStock || 0,
        등록일: formatDate(tour.regDt),
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "투어상품리스트");

      const fileName = `모행_투어상품관리_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      console.log(`📊 엑셀 다운로드 완료! (총 ${excelData.length}건)`);
    } catch (error) {
      console.error("엑셀 다운로드 실패:", error);
      alert("엑셀 다운로드 중 오류가 발생했습니다.");
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalCount / pageSize);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchTourList(page);
    }
  };

  return (
        <div className="products-page">
      <div className="page-header">
        <h1>투어/체험/티켓 관리</h1>
        <button className="btn-acc-excel" onClick={downloadExcel}>
          <i className="bi bi-file-earmark-excel-fill me-2"></i>
          엑셀 다운로드
        </button>
      </div>
      <ToastContainer />


      {/* 통계 카드 - 숙박과 동일한 스타일 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="bi bi-ticket-perforated-fill"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{formatNum(stats.total)}</span>
            <span className="stat-label">전체 상품</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="bi bi-play-circle-fill"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{formatNum(stats.active)}</span>
            <span className="stat-label">판매중</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <i className="bi bi-stop-circle-fill"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{formatNum(stats.inactive)}</span>
            <span className="stat-label">판매중지</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <i className="bi bi-clock-fill"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{formatNum(stats.pending)}</span>
            <span className="stat-label">승인대기</span>
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="상품명, 설명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="판매중">판매중</option>
              <option value="판매중지">판매중지</option>
              <option value="승인대기">승인대기</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">전체 카테고리</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
            >
              <option value="all">전체 지역</option>
              {Object.entries(AREA_CODE_MAP).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 상품 목록 테이블 */}
      <div className="data-table-container" style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>상품명</th>
              <th>카테고리</th>
              <th>지역</th>
              <th>판매가</th>
              <th>재고</th>
              <th>상태</th>
              <th style={{ width: "140px" }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {toursData.map((tour) => {
              const displayStatus = getDisplayStatus(tour);
              const isPending = displayStatus === "승인대기";

              return (
                <tr
                  key={tour.tripProdNo}
                  style={
                    isPending
                      ? {
                          backgroundColor: "#f0f7ff",
                          borderLeft: "4px solid #2563eb",
                          transition: "all 0.3s ease",
                        }
                      : {}
                  }
                >
                  <td>
                    <div
                      className="product-name"
                      onClick={() => openDetailModal(tour)}
                    >
                      {tour.tripProdTitle}
                      {isPending && (
                        <span
                          style={{
                            marginLeft: "8px",
                            fontSize: "0.65rem",
                            background: "#2563eb",
                            color: "#fff",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            verticalAlign: "middle",
                          }}
                        >
                          NEW
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      {getDurationLabel(tour.leadTime)}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {getCategoryLabel(tour.prodCtgryType)}
                    </span>
                  </td>
                  <td>{getRegionLabel(tour.ctyNm)}</td>
                  <td style={{ fontWeight: 500, color: "#2563eb" }}>
                    {formatPrice(tour.price)}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    <span
                      style={{
                        color: tour.curStock <= 3 ? "#ef4444" : "#1e293b",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <i
                        className={`bi ${tour.curStock <= 3 ? "bi-exclamation-triangle-fill" : "bi-box-seam"}`}
                      ></i>
                      {tour.curStock || 0}개
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        displayStatus === "판매중"
                          ? "active"
                          : isPending
                            ? "pending"
                            : "inactive"
                      }`}
                    >
                      {displayStatus}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        title="상세보기"
                        onClick={() => openDetailModal(tour)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                      {isPending ? (
                        <button
                          className="btn-icon status-active"
                          title="즉시 승인"
                          onClick={() => handleApprove(tour.tripProdNo)}
                          style={{ color: "#10b981" }}
                        >
                          <i className="bi bi-check-circle-fill"></i>
                        </button>
                      ) : (
                        <button
                          className={`btn-icon ${displayStatus === "판매중" ? "status-active" : "status-inactive"}`}
                          title={
                            displayStatus === "판매중"
                              ? "판매 중지"
                              : "판매 시작"
                          }
                          onClick={() => toggleStatus(tour)}
                        >
                          <i
                            className={`bi ${displayStatus === "판매중" ? "bi-pause-circle-fill" : "bi-play-circle-fill"}`}
                          ></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {toursData.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-ticket-perforated"></i>
            <p>조건에 맞는 상품 정보가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div
          className="pagination-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            style={{
              padding: "8px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              background: currentPage === 1 ? "#f3f4f6" : "#fff",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              color: currentPage === 1 ? "#9ca3af" : "#374151",
            }}
          >
            <i className="bi bi-chevron-double-left"></i>
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "8px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              background: currentPage === 1 ? "#f3f4f6" : "#fff",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              color: currentPage === 1 ? "#9ca3af" : "#374151",
            }}
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                padding: "8px 14px",
                border: "1px solid",
                borderColor: currentPage === page ? "#3b82f6" : "#e5e7eb",
                borderRadius: "6px",
                background: currentPage === page ? "#3b82f6" : "#fff",
                color: currentPage === page ? "#fff" : "#374151",
                cursor: "pointer",
                fontWeight: currentPage === page ? 600 : 400,
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              background: currentPage === totalPages ? "#f3f4f6" : "#fff",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              color: currentPage === totalPages ? "#9ca3af" : "#374151",
            }}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 12px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              background: currentPage === totalPages ? "#f3f4f6" : "#fff",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              color: currentPage === totalPages ? "#9ca3af" : "#374151",
            }}
          >
            <i className="bi bi-chevron-double-right"></i>
          </button>

          <span
            style={{
              marginLeft: "16px",
              color: "#6b7280",
              fontSize: "0.875rem",
            }}
          >
            총 {totalCount}개 중 {(currentPage - 1) * pageSize + 1}-
            {Math.min(currentPage * pageSize, totalCount)}
          </span>
        </div>
      )}

      {/* 상세 모달 - 숙박과 동일한 스타일 */}
      {isDetailModalOpen && selectedTour && (
        <div
          className="modal-overlay"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            className="modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>상품 상세 정보</h2>
              <button
                className="modal-close"
                onClick={() => setIsDetailModalOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                {/* 기본 정보 섹션 - 숙박 스타일 적용 */}
                <div
                  className="detail-section"
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "24px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "20px",
                      borderBottom: "2px solid #f1f5f9",
                      paddingBottom: "12px",
                    }}
                  >
                    <i
                      className="bi bi-ticket-perforated-fill"
                      style={{ color: "#4f46e5" }}
                    ></i>
                    <span>상품 기본 정보</span>
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {/* 상품명 + 상태 배지 */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.85rem",
                            color: "#94a3b8",
                            fontWeight: 600,
                          }}
                        >
                          상품명
                        </span>
                        {/* 판매 상태 배지 */}
                        <span
                          style={{
                            padding: "6px 14px",
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                            fontWeight: 800,
                            background:
                              getDisplayStatus(selectedTour) === "판매중"
                                ? "#dcfce7"
                                : getDisplayStatus(selectedTour) === "승인대기"
                                  ? "#fef3c7"
                                  : "#f1f5f9",
                            color:
                              getDisplayStatus(selectedTour) === "판매중"
                                ? "#166534"
                                : getDisplayStatus(selectedTour) === "승인대기"
                                  ? "#92400e"
                                  : "#64748b",
                            border:
                              getDisplayStatus(selectedTour) === "판매중"
                                ? "1px solid #bbf7d0"
                                : getDisplayStatus(selectedTour) === "승인대기"
                                  ? "1px solid #fde68a"
                                  : "1px solid #e2e8f0",
                          }}
                        >
                          <i
                            className={`bi ${getDisplayStatus(selectedTour) === "판매중" ? "bi-play-circle-fill" : getDisplayStatus(selectedTour) === "승인대기" ? "bi-clock-fill" : "bi-pause-circle"} me-1`}
                          ></i>
                          {getDisplayStatus(selectedTour)}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: 800,
                          color: "#1e293b",
                        }}
                      >
                        {selectedTour.tripProdTitle}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                        marginTop: "4px",
                      }}
                    >
                      {/* 카테고리 */}
                      <div>
                        <span
                          style={{
                            fontSize: "0.85rem",
                            color: "#94a3b8",
                            fontWeight: 600,
                            display: "block",
                            marginBottom: "6px",
                          }}
                        >
                          카테고리
                        </span>
                        <span
                          style={{
                            background: "#EEF2FF",
                            color: "#4F46E5",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                          }}
                        >
                          {getCategoryLabel(selectedTour.prodCtgryType)}
                        </span>
                      </div>

                      {/* 소요시간 */}
                      <div>
                        <span
                          style={{
                            fontSize: "0.85rem",
                            color: "#94a3b8",
                            fontWeight: 600,
                            display: "block",
                            marginBottom: "6px",
                          }}
                        >
                          소요시간
                        </span>
                        <span
                          style={{
                            background: "#FFF7ED",
                            color: "#EA580C",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                          }}
                        >
                          <i className="bi bi-clock me-1"></i>
                          {getDurationLabel(selectedTour.leadTime)}
                        </span>
                      </div>
                    </div>

                    {/* 지역 정보 */}
                    <div
                      style={{
                        borderTop: "1px solid #f1f5f9",
                        paddingTop: "16px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "#94a3b8",
                          fontWeight: 600,
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        지역
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            background: "#F1F5F9",
                            color: "#475569",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            border: "1px solid #e2e8f0",
                          }}
                        >
                          {getRegionLabel(selectedTour.ctyNm)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 가격/재고 정보 섹션 */}
                <div
                  className="detail-section"
                  style={{
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "24px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "20px",
                      borderBottom: "2px solid #f1f5f9",
                      paddingBottom: "12px",
                    }}
                  >
                    <i
                      className="bi bi-currency-dollar"
                      style={{ color: "#4f46e5" }}
                    ></i>
                    <span>가격 및 재고 정보</span>
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    {/* 가격 정보 */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", gap: "24px" }}>
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#94a3b8",
                              marginBottom: "4px",
                            }}
                          >
                            정가
                          </div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "#64748b",
                              fontSize: "1rem",
                              textDecoration:
                                selectedTour.discount > 0
                                  ? "line-through"
                                  : "none",
                            }}
                          >
                            {formatPrice(selectedTour.netprc)}
                          </div>
                        </div>
                        <div
                          style={{
                            width: "1px",
                            height: "30px",
                            background: "#e2e8f0",
                            alignSelf: "center",
                          }}
                        ></div>
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#94a3b8",
                              marginBottom: "4px",
                            }}
                          >
                            판매가
                          </div>
                          <div
                            style={{
                              fontWeight: 800,
                              color: "#2563eb",
                              fontSize: "1.1rem",
                            }}
                          >
                            {formatPrice(selectedTour.price)}
                          </div>
                        </div>
                        {selectedTour.discount > 0 && (
                          <>
                            <div
                              style={{
                                width: "1px",
                                height: "30px",
                                background: "#e2e8f0",
                                alignSelf: "center",
                              }}
                            ></div>
                            <div style={{ textAlign: "center" }}>
                              <div
                                style={{
                                  fontSize: "0.75rem",
                                  color: "#94a3b8",
                                  marginBottom: "4px",
                                }}
                              >
                                할인율
                              </div>
                              <div
                                style={{
                                  fontWeight: 800,
                                  color: "#dc2626",
                                  fontSize: "1.1rem",
                                }}
                              >
                                {selectedTour.discount}%
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* 재고 및 판매기간 */}
                    <div
                      style={{
                        marginTop: "10px",
                        padding: "12px",
                        background: "#f8fafc",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                      }}
                    >
                      <div>
                        <span style={{ color: "#64748b" }}>재고</span>
                        <span
                          style={{
                            color: "#1e293b",
                            fontWeight: 600,
                            marginLeft: "8px",
                          }}
                        >
                          {selectedTour.curStock || 0}개
                        </span>
                      </div>
                      <div>
                        <span style={{ color: "#64748b" }}>판매 기간</span>
                        <span
                          style={{
                            color: "#1e293b",
                            fontWeight: 600,
                            marginLeft: "8px",
                          }}
                        >
                          {formatDate(selectedTour.saleStartDt)} ~{" "}
                          {formatDate(selectedTour.saleEndDt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 판매자 정보 섹션 */}
                <div
                  className="detail-section full-width"
                  style={{ marginTop: "24px" }}
                >
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <i
                      className="bi bi-building"
                      style={{ color: "#4f46e5" }}
                    ></i>
                    <span>판매자 정보</span>
                  </h3>

                  <div
                    style={{
                      padding: "20px",
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          background: "#e2e8f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          flexShrink: 0,
                          border: "2px solid #f1f5f9",
                        }}
                      >
                        {selectedTour.sellerProfileImage ? (
                          <img
                            src={`http://localhost:8272/upload${selectedTour.sellerProfileImage}`}
                            alt="판매자 프로필"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <i
                            className="bi bi-building"
                            style={{ fontSize: "28px", color: "#94a3b8" }}
                          ></i>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "1.1rem",
                            marginBottom: "4px",
                            color: "#1e293b",
                          }}
                        >
                          {selectedTour.sellerName || "판매자 정보 없음"}
                        </div>
                        <div
                          style={{
                            fontSize: "0.9rem",
                            color: "#64748b",
                            lineHeight: 1.6,
                          }}
                        >
                          {selectedTour.sellerIntro ||
                            "업체 소개가 등록되지 않았습니다."}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 위치 및 지도 섹션 */}
                {selectedTour.addr1 && (
                  <div
                    className="detail-section full-width"
                    style={{ marginTop: "24px" }}
                  >
                    <h3
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "16px",
                      }}
                    >
                      <i
                        className="bi bi-geo-alt-fill"
                        style={{ color: "#ef4444" }}
                      ></i>
                      <span>위치 및 지도 확인</span>
                    </h3>

                    <div
                      style={{
                        padding: "20px",
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      {/* 주소 안내창 */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "20px",
                          padding: "14px 20px",
                          background: "#fef2f2",
                          borderRadius: "12px",
                          border: "1px solid #fee2e2",
                        }}
                      >
                        <i
                          className="bi bi-pin-map-fill"
                          style={{ color: "#ef4444", fontSize: "1.2rem" }}
                        ></i>
                        <span
                          style={{
                            fontSize: "1rem",
                            color: "#1e293b",
                            fontWeight: 600,
                          }}
                        >
                          {selectedTour.addr1} {selectedTour.addr2 || ""}
                        </span>
                      </div>

                      {/* 지도 */}
                      <div
                        style={{
                          borderRadius: "12px",
                          overflow: "hidden",
                          border: "1px solid #f1f5f9",
                          height: "300px",
                          width: "100%",
                          position: "relative",
                          background: "#f8fafc",
                        }}
                      >
                        <TourMap address={selectedTour.addr1} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 상품 이미지 갤러리 */}
                <div
                  className="detail-section full-width"
                  style={{ marginTop: "32px" }}
                >
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <i
                      className="bi bi-images"
                      style={{ color: "#2563eb" }}
                    ></i>
                    <span>상품 갤러리</span>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "#94a3b8",
                        fontWeight: 400,
                      }}
                    >
                      (총 {selectedTour.imageList?.length || 0}장)
                    </span>
                  </h3>

                  {selectedTour.imageList &&
                  selectedTour.imageList.length > 0 ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: "16px",
                        marginTop: "12px",
                      }}
                    >
                      {selectedTour.imageList.map((image, idx) => (
                        <div
                          key={image.fileNo || idx}
                          style={{
                            position: "relative",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            border:
                              idx === 0
                                ? "3px solid #2563eb"
                                : "1px solid #e2e8f0",
                            aspectRatio: "3/2",
                          }}
                        >
                          <img
                            src={`http://localhost:8272/upload${image.filePath}`}
                            alt={`상품 이미지 ${idx + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                            }}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.transform = "scale(1.1)")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          />
                          {idx === 0 && (
                            <span
                              style={{
                                position: "absolute",
                                top: "8px",
                                left: "8px",
                                background: "#2563eb",
                                color: "white",
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                padding: "3px 8px",
                                borderRadius: "6px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                              }}
                            >
                              대표 이미지
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "40px",
                        border: "2px dashed #e2e8f0",
                        borderRadius: "16px",
                        textAlign: "center",
                        color: "#94a3b8",
                        background: "#f8fafc",
                      }}
                    >
                      <i
                        className="bi bi-image-fill"
                        style={{
                          fontSize: "2rem",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      ></i>
                      등록된 상품 이미지가 없습니다.
                    </div>
                  )}
                </div>

                {/* 상품 설명 */}
                <div
                  className="detail-section full-width"
                  style={{ marginTop: "32px" }}
                >
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <i
                      className="bi bi-card-text"
                      style={{ color: "#4f46e5" }}
                    ></i>
                    <span>상품 상세 설명</span>
                  </h3>

                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "24px",
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      minHeight: "100px",
                    }}
                  >
                    {selectedTour.tripProdContent ? (
                      <p
                        style={{
                          margin: 0,
                          color: "#334155",
                          lineHeight: 1.8,
                          fontSize: "1rem",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-all",
                        }}
                      >
                        {selectedTour.tripProdContent}
                      </p>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          color: "#94a3b8",
                          padding: "20px 0",
                        }}
                      >
                        <i className="bi bi-chat-dots me-2"></i>
                        등록된 상품 설명이 없습니다.
                      </div>
                    )}
                  </div>
                </div>

                {/* 이용 안내 */}
                <div
                  className="detail-section full-width"
                  style={{ marginTop: "32px" }}
                >
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "20px",
                    }}
                  >
                    <i
                      className="bi bi-info-circle"
                      style={{ color: "#2563eb" }}
                    ></i>
                    <span>이용 안내</span>
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        padding: "16px",
                        background: "#fff",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                          marginBottom: "6px",
                        }}
                      >
                        운영 시간
                      </div>
                      <div style={{ fontWeight: 600, color: "#1e293b" }}>
                        {selectedTour.prodRuntime || "-"}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "16px",
                        background: "#fff",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                          marginBottom: "6px",
                        }}
                      >
                        소요 시간
                      </div>
                      <div style={{ fontWeight: 600, color: "#1e293b" }}>
                        {selectedTour.prodDuration || "-"}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "16px",
                        background: "#fff",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                          marginBottom: "6px",
                        }}
                      >
                        연령 제한
                      </div>
                      <div style={{ fontWeight: 600, color: "#1e293b" }}>
                        {selectedTour.prodLimAge || "-"}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "16px",
                        background: "#fff",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                          marginBottom: "6px",
                        }}
                      >
                        인원
                      </div>
                      <div style={{ fontWeight: 600, color: "#1e293b" }}>
                        최소 {selectedTour.prodMinPeople || 1}명 ~ 최대{" "}
                        {selectedTour.prodMaxPeople || 99}명
                      </div>
                    </div>
                  </div>
                </div>

                {/* 예약 가능 시간 */}
                <div
                  className="detail-section full-width"
                  style={{ marginTop: "24px" }}
                >
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <i
                      className="bi bi-calendar-check"
                      style={{ color: "#059669" }}
                    ></i>
                    <span>예약 가능 시간</span>
                  </h3>

                  <div
                    style={{
                      background: "#f0fdf4",
                      padding: "20px",
                      borderRadius: "16px",
                      border: "1px solid #dcfce7",
                    }}
                  >
                    {selectedTour.prodTimeList &&
                    selectedTour.prodTimeList.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        {selectedTour.prodTimeList.map((time, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "8px 14px",
                              background: "#fff",
                              border: "1px solid #bbf7d0",
                              borderRadius: "10px",
                              fontSize: "0.9rem",
                              fontWeight: 600,
                              color: "#166534",
                            }}
                          >
                            <i
                              className="bi bi-clock"
                              style={{ color: "#059669" }}
                            ></i>
                            {time.rsvtAvailableTime}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            color: "#64748b",
                            fontSize: "0.875rem",
                            marginBottom: "12px",
                          }}
                        >
                          <i className="bi bi-info-circle me-1"></i>
                          등록된 시간 없음 (기본값 적용)
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                          }}
                        >
                          {DEFAULT_TIMES.map((time, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: "8px 14px",
                                background: "#fff",
                                border: "1px dashed #cbd5e1",
                                borderRadius: "10px",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                color: "#64748b",
                              }}
                            >
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 포함/불포함 사항 */}
                <div className="detail-section" style={{ marginTop: "24px" }}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <i
                      className="bi bi-check-circle"
                      style={{ color: "#059669" }}
                    ></i>
                    <span>포함 사항</span>
                  </h3>

                  <div
                    style={{
                      background: "#f0fdf4",
                      padding: "20px",
                      borderRadius: "16px",
                      border: "1px solid #dcfce7",
                    }}
                  >
                    {selectedTour.prodInclude ? (
                      <pre
                        style={{
                          margin: 0,
                          fontFamily: "inherit",
                          whiteSpace: "pre-wrap",
                          color: "#166534",
                          fontSize: "0.9rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {selectedTour.prodInclude}
                      </pre>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          color: "#86efac",
                          padding: "10px 0",
                        }}
                      >
                        <i className="bi bi-info-circle me-2"></i>등록된 정보가
                        없습니다.
                      </div>
                    )}
                  </div>
                </div>

                <div className="detail-section" style={{ marginTop: "24px" }}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <i
                      className="bi bi-x-circle"
                      style={{ color: "#ef4444" }}
                    ></i>
                    <span>불포함 사항</span>
                  </h3>

                  <div
                    style={{
                      background: "#fef2f2",
                      padding: "20px",
                      borderRadius: "16px",
                      border: "1px solid #fee2e2",
                    }}
                  >
                    {selectedTour.prodExclude ? (
                      <pre
                        style={{
                          margin: 0,
                          fontFamily: "inherit",
                          whiteSpace: "pre-wrap",
                          color: "#991b1b",
                          fontSize: "0.9rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {selectedTour.prodExclude}
                      </pre>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          color: "#fca5a5",
                          padding: "10px 0",
                        }}
                      >
                        <i className="bi bi-info-circle me-2"></i>등록된 정보가
                        없습니다.
                      </div>
                    )}
                  </div>
                </div>

                {/* 유의 사항 */}
                {selectedTour.prodNotice && (
                  <div
                    className="detail-section full-width"
                    style={{ marginTop: "24px" }}
                  >
                    <h3
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "16px",
                      }}
                    >
                      <i
                        className="bi bi-exclamation-triangle"
                        style={{ color: "#d97706" }}
                      ></i>
                      <span>유의 사항</span>
                    </h3>

                    <div
                      style={{
                        background: "#fef3c7",
                        padding: "20px",
                        borderRadius: "16px",
                        border: "1px solid #fde68a",
                      }}
                    >
                      <pre
                        style={{
                          margin: 0,
                          fontFamily: "inherit",
                          whiteSpace: "pre-wrap",
                          color: "#92400e",
                          fontSize: "0.9rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {selectedTour.prodNotice}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 모달 푸터 - 숙박과 동일한 스타일 */}
            <div
              className="modal-footer"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "28px 36px",
                background: "#f1f5f9",
                borderTop: "1px solid #e2e8f0",
                borderBottomLeftRadius: "24px",
                borderBottomRightRadius: "24px",
                marginTop: "24px",
              }}
            >
              {/* 왼쪽: 관리자 승인 및 판매 상태 제어 */}
              <div
                style={{ display: "flex", gap: "14px", alignItems: "center" }}
              >
                {/* 승인 상태 배지 */}
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    background:
                      selectedTour?.aprvYn === "Y" ? "#dcfce7" : "#fef3c7",
                    color: selectedTour?.aprvYn === "Y" ? "#166534" : "#92400e",
                    border: `1px solid ${selectedTour?.aprvYn === "Y" ? "#bbf7d0" : "#fde68a"}`,
                  }}
                >
                  {selectedTour?.aprvYn === "Y"
                    ? "✅ 승인 완료된 상품"
                    : "🕒 승인 대기중"}
                </span>

                {/* 승인 버튼 */}
                {selectedTour?.aprvYn !== "Y" && (
                  <button
                    className="btn"
                    onClick={() => handleApprove(selectedTour?.tripProdNo)}
                    style={{
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "12px",
                      fontWeight: 800,
                      cursor: "pointer",
                      boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "#059669")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "#10b981")
                    }
                  >
                    <i
                      className="bi bi-check-all"
                      style={{ marginRight: "6px" }}
                    ></i>{" "}
                    상품 승인하기
                  </button>
                )}

                {/* 판매 제어 버튼 - 승인된 상품만 표시 */}
                {selectedTour?.aprvYn === "Y" && (
                  <button
                    className="btn"
                    onClick={() => handleToggleSale(selectedTour)}
                    style={{
                      border: "2px solid",
                      borderColor:
                        getDisplayStatus(selectedTour) === "판매중"
                          ? "#ef4444"
                          : "#3b82f6",
                      color:
                        getDisplayStatus(selectedTour) === "판매중"
                          ? "#ef4444"
                          : "#3b82f6",
                      background: "transparent",
                      padding: "10px 20px",
                      borderRadius: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        getDisplayStatus(selectedTour) === "판매중"
                          ? "#fef2f2"
                          : "#eff6ff";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {getDisplayStatus(selectedTour) === "판매중" ? (
                      <>
                        <i className="bi bi-stop-circle me-1"></i> 판매 중지
                      </>
                    ) : (
                      <>
                        <i className="bi bi-play-circle me-1"></i> 판매 재개
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* 오른쪽: 닫기 */}
              <div style={{ display: "flex", gap: "14px" }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsDetailModalOpen(false)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    fontWeight: 600,
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tours;
