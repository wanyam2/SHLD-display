import React, { useState, useEffect, useRef } from "react";
import styles from "./Display.module.css";

// 모든 자식 컴포넌트 임포트
import TimeDisplay from "./components/TimeDisplay.jsx";
import WeatherDisplay from "./components/WeatherDisplay";
import ClockDisplay from "./components/ClockDisplay";
import LightControl from "./components/LightControl";
import OccupancyDisplay from "./components/OccupancyDisplay";
import AirQualityDisplay from "./components/AirQualityDisplay"; // <-- 1. 공기질 컴포넌트 임포트
import logo from "./assets/pause_logo.png";

// ... (ESP32_WS_ADDRESS 설정 ...)
const ESP32_WS_ADDRESS = "ws://192.168.0.50/ws";

// ... (formatTime 함수 ...)
const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}`;
};

// --- Display 컴포넌트 시작 ---
const Display = () => {
    // 1. ESP32에서 수신할 모든 상태를 useState로 관리
    const [isConnected, setIsConnected] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [lightOn, setLightOn] = useState(true);
    const [lightPercent, setLightPercent] = useState(70);
    const [occupancyState, setOccupancyState] = useState(0);
    const [pm25, setPm25] = useState(0); // <-- 2. 공기질(PM2.5) state 추가

    // ... (ws = useRef(null) ...)
    const ws = useRef(null);

    // 2. 컴포넌트 마운트 시 웹소켓 연결 (useEffect)
    useEffect(() => {
        // ... (ws.current = new WebSocket ... )
        ws.current = new WebSocket(ESP32_WS_ADDRESS);

        // ... (onopen, onclose ...)
        ws.current.onopen = () => {
            console.log("ESP32와 연결되었습니다.");
            setIsConnected(true);
        };

        ws.current.onclose = () => {
            console.log("ESP32와 연결이 끊겼습니다.");
            setIsConnected(false);
        };

        // 3. ESP32로부터 메시지(데이터) 수신 시
        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("데이터 수신:", data);

                if (data.hasOwnProperty("remainingTime")) {
                    setRemainingTime(data.remainingTime);
                }
                if (data.hasOwnProperty("lightOn")) {
                    setLightOn(data.lightOn);
                }
                if (data.hasOwnProperty("brightness")) {
                    setLightPercent(Math.round(data.brightness / 2.55));
                }
                if (data.hasOwnProperty("currentState")) {
                    setOccupancyState(data.currentState);
                }

                // --- 3. PM2.5 데이터 수신 ---
                if (data.hasOwnProperty("pm25")) {
                    setPm25(data.pm25);
                }
                // -----------------------------

            } catch (error) {
                console.error("수신 데이터 파싱 오류:", error);
            }
        };

        // ... (useEffect cleanup ...)
        return () => {
            ws.current.close();
        };
    }, []); // 빈 배열: 처음에 한 번만 실행


    // 4. ESP32로 명령을 보내는 핸들러 함수
    // ... (handleBrightnessChange, handleLightStateChange ...)
    const handleBrightnessChange = (percent) => {
        setLightPercent(percent);
        if (ws.current?.readyState === WebSocket.OPEN) {
            const brightness255 = Math.round(percent * 2.55);
            ws.current.send(JSON.stringify({ brightness: brightness255 }));
        }
    };
    const handleLightStateChange = (isOn) => {
        setLightOn(isOn);
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ lightOn: isOn }));
        }
    };


    // 5. 렌더링
    return (
        <div className={styles.root}>
            {/* 뒤집힌 재실 현황판 */}
            <div style={{ gridColumn: 1, gridRow: 1, alignSelf: 'start', marginLeft: '70px', zIndex: 10 }}>
                <OccupancyDisplay isOccupied={occupancyState !== 0} />
            </div>

            {/* 사이드 패널 */}
            <div className={styles.sidePanel}>
                <TimeDisplay />
                <WeatherDisplay />
            </div>

            {/* 중앙 시계 */}
            <div className={styles.centerClock}>
                <ClockDisplay remainingTimeStr={formatTime(remainingTime)} />
                <span className={styles.subtitle}>
                     {isConnected ? "편안한 시간 보내세요" : "연결 중..."}
                </span>
            </div>

            {/* 컨트롤 패널 */}
            <div className={styles.control}>
                <AirQualityDisplay pm25Value={pm25} />
                <LightControl
                    brightness={lightPercent}
                    isOn={lightOn}
                    onBrightnessChange={handleBrightnessChange}
                    onStateChange={handleLightStateChange}
                />
            </div>

            {/* 로고 */}
            <img src={logo} alt="로고" className={styles.logo} />
        </div>
    );
};

export default Display;