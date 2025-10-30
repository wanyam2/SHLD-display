import React from "react";
import styles from "./ControlBox.module.css"; // 기존 ControlBox 스타일 재사용

/**
 * PM2.5 값에 따라 상태와 색상을 반환하는 함수
 * (한국 환경부 기준 2018~)
 */
const getAirQualityStatus = (pm25) => {
    if (pm25 <= 15) {
        return { status: "좋음", color: "#007bff" }; // 파랑
    } else if (pm25 <= 35) {
        return { status: "보통", color: "#28a745" }; // 초록
    } else if (pm25 <= 75) {
        return { status: "나쁨", color: "#fd7e14" }; // 주황
    } else {
        return { status: "매우 나쁨", color: "#dc3545" }; // 빨강
    }
};

/**
 * 공기질(PM2.5)을 표시하는 컴포넌트
 * @param {number} pm25Value - 부모(Display.jsx)가 전달하는 PM2.5 값
 */
const AirQualityDisplay = ({ pm25Value }) => {

    // 0: "좋음", 20: "보통" 등으로 변환
    const { status, color } = getAirQualityStatus(pm25Value);

    return (
        <div className={styles.controlBox}>
            <div className={styles.controlLabel}>공기질 (PM2.5)</div>

            {/* 상태 값에 따라 글자 색상이 변하도록 inline style을 적용
              ControlBox.module.css의 .controlValue 스타일을 기반으로 함
            */}
            <div
                className={styles.controlValue}
                style={{ color: color, fontSize: 'clamp(20px, 4vw, 32px)' }} // 폰트 크기 약간 조절
            >
                {status}
            </div>

            {/* PM2.5 수치 표시 */}
            <div style={{ textAlign: 'right', fontSize: '14px', color: '#555' }}>
                {pm25Value} µg/m³
            </div>
        </div>
    );
};

export default AirQualityDisplay;