import React, { useEffect, useRef, useState } from 'react';

const AccommodationMap = ({ lat, lng }) => {
  const mapContainer = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. 이미 스크립트가 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      setIsLoaded(true);
      return;
    }

    // 2. JSX 안에서 스크립트를 동적으로 생성해서 document에 박아버리기!
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=0a4b8e6c128016aa0df7300b3ab799f1&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // 카카오맵 라이브러리가 로드되면 실행
      window.kakao.maps.load(() => {
        setIsLoaded(true);
      });
    };
  }, []);

  // 스크립트 로드 완료 후 지도 그리기
  useEffect(() => {
    if (isLoaded && lat && lng) {
      const { kakao } = window;
      const container = mapContainer.current;
      const options = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 3
      };

      const map = new kakao.maps.Map(container, options);
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng)
      });
      marker.setMap(map);
    }
  }, [isLoaded, lat, lng]);

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        width: '100%', 
        height: '400px', 
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

export default AccommodationMap;