import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8272/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
    // 로컬 스토리지에서 토큰 가져오기
  const token = localStorage.getItem("access_token");  

  // 토큰이 있다면 헤더에 Authorization 자동으로 추가
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response , 
    (error) => {
    if (error.response?.status === 401 || error.response.status === 403) {
        console.error("인증 에러 발생! 로그인 페이지로 이동합니다.");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
    }
    return Promise.reject(error);
});

export default api;