import React, { useEffect, useRef, useState } from 'react';

const TourMap = ({ address }) => {
  const mapContainer = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. 이미 스크립트가 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      setIsLoaded(true);
      return;
    }

    // 2. 스크립트 동적 로드 (services 라이브러리 포함)
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=0a4b8e6c128016aa0df7300b3ab799f1&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsLoaded(true);
      });
    };

    script.onerror = () => {
      setError('지도 스크립트 로드 실패');
    };
  }, []);

  // 스크립트 로드 완료 후 주소로 지도 그리기
  useEffect(() => {
    if (isLoaded && address && mapContainer.current) {
      const { kakao } = window;
      
      // 기본 지도 생성
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
      };
      const map = new kakao.maps.Map(mapContainer.current, options);

      // 주소로 좌표 검색
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          
          // 마커 생성
          const marker = new kakao.maps.Marker({
            map: map,
            position: coords
          });
          
          // 지도 중심 이동
          map.setCenter(coords);
        } else {
          console.log('주소 검색 실패:', status, address);
          setError('주소를 찾을 수 없습니다');
        }
      });
    }
  }, [isLoaded, address]);

  if (error) {
    return (
      <div style={{ 
        width: '100%', 
        height: '250px', 
        borderRadius: '12px', 
        background: '#fee2e2',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#dc2626'
      }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        width: '100%', 
        height: '250px', 
        borderRadius: '12px', 
        background: '#f8fafc' 
      }} 
    >
      {!isLoaded && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <p>지도를 불러오는 중입니다... 🕒</p>
        </div>
      )}
    </div>
  );
};

export default TourMap;