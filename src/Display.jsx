import React from 'react';
import styles from './display.module.css'; // 원본 CSS 모듈

// 원본 컴포넌트들 임포트
import OccupancyDisplay from './components/OccupancyDisplay.jsx';
import TimeDisplay from './components/TimeDisplay.jsx';
import WeatherDisplay from './components/WeatherDisplay.jsx';
import ClockDisplay from './components/ClockDisplay.jsx';
import LightControl from './components/LightControl.jsx';
import AirQualityDisplay from "./components/AirQualityDisplay.jsx";

// 로고 임포트 (src/assets/pause_logo.png 경로에 파일 필요)
import logo from './assets/pause_logo.png';

// [신규] 초를 mm:ss로 변환하는 헬퍼 함수
const formatTime = (totalSeconds) => {
    const minutes = Math.floor((totalSeconds || 0) / 60);
    const seconds = Math.max(0, (totalSeconds || 0) % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};


function Display({
                     sensorData,
                     isConnected,
                     lightOn,
                     lightPercent,
                     onLightStateChange,
                     onBrightnessChange,
                     remainingTime, // [수정됨] App.jsx로부터 남은 시간을 받음
                 }) {

    // Arduino의 'motion' 데이터를 OccupancyDisplay의 'isOccupied' prop으로 변환
    const isOccupied = sensorData?.motion === 'detected';

    // sensorData에서 eco2와 tvoc 값을 추출합니다. (값이 없으면 기본값 {} 사용)
    const { eco2, tvoc } = sensorData || {};

    const statusMessage = isConnected ? "편안한 시간 보내세요" : "연결 중...";

    return (
        <div className={styles.root}>
            {/* 로고 이미지가 src/assets/pause_logo.png에 있는지 확인하세요 */}
            <img src={logo} alt="로고" className={styles.logo} />

            <div style={{ gridColumn: 1, gridRow: 1, alignSelf: 'start', marginLeft: '70px', zIndex: 10 }}>
                <OccupancyDisplay isOccupied={isOccupied} />
            </div>

            <div className={styles.sidePanel}>
                <TimeDisplay />
                <WeatherDisplay />
            </div>

            <div className={styles.centerClock}>
                {/* [수정됨] 하드코딩된 "00:00" 대신 변환된 시간을 전달 */}
                <ClockDisplay remainingTimeStr={formatTime(remainingTime)} />
                <span className={styles.subtitle}>
                  {statusMessage}
                </span>
            </div>

            <div className={styles.control}>
                {/* AirQualityDisplay에 eco2와 tvoc 전달 */}
                <AirQualityDisplay eco2={eco2} tvoc={tvoc} />

                {/* LightControl에 상태와 핸들러 전달 */}
                <LightControl
                    brightness={lightPercent}
                    isOn={lightOn}
                    onBrightnessChange={onBrightnessChange}
                    onStateChange={onLightStateChange}
                />
            </div>
        </div>
    );
}

export default Display;

