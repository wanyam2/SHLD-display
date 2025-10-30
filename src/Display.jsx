import React, { useState, useEffect } from "react";
import mqtt from "mqtt"; // pnpm add mqtt
import styles from "./Display.module.css";

import TimeDisplay from "./components/TimeDisplay.jsx";
import WeatherDisplay from "./components/WeatherDisplay";
import ClockDisplay from "./components/ClockDisplay";
import LightControl from "./components/LightControl";
import OccupancyDisplay from "./components/OccupancyDisplay";
import AirQualityDisplay from "./components/AirQualityDisplay";
import logo from "./assets/pause_logo.png";

/** ====== MQTT 설정 ======
 * Vite .env 예시
 * VITE_MQTT_URL=ws://192.168.0.10:8083/mqtt
 * VITE_DEVICE_ID=uno01
 * (익명 허용이 아니면 VITE_MQTT_USERNAME / VITE_MQTT_PASSWORD 도 설정)
 */
const MQTT_URL = import.meta.env.VITE_MQTT_URL || "ws://192.168.0.10:8083/mqtt";
const DEVICE_ID = import.meta.env.VITE_DEVICE_ID || "uno01";
const TOPIC_STATE = `devices/${DEVICE_ID}/state`;
const TOPIC_CMD = `devices/${DEVICE_ID}/cmd`;

// mm:ss 포맷
const formatTime = (totalSeconds) => {
    const minutes = Math.floor((totalSeconds || 0) / 60);
    const seconds = Math.max(0, (totalSeconds || 0) % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const Display = () => {
    // 보드 상태
    const [isConnected, setIsConnected] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [lightOn, setLightOn] = useState(true);
    const [lightPercent, setLightPercent] = useState(70);
    const [occupancyState, setOccupancyState] = useState(0); // 0:IDLE, 1:IN_USE, 2:TIME_UP
    const [pm25, setPm25] = useState(0);

    // MQTT 연결
    useEffect(() => {
        const client = mqtt.connect(MQTT_URL, {
            username: import.meta.env.VITE_MQTT_USERNAME || undefined,
            password: import.meta.env.VITE_MQTT_PASSWORD || undefined,
            keepalive: 30,
            reconnectPeriod: 2000,
        });

        client.on("connect", () => {
            setIsConnected(true);
            client.subscribe(TOPIC_STATE, { qos: 0 });
        });

        client.on("reconnect", () => setIsConnected(false));
        client.on("close", () => setIsConnected(false));
        client.on("error", () => setIsConnected(false));

        client.on("message", (topic, payload) => {
            if (topic !== TOPIC_STATE) return;
            try {
                const data = JSON.parse(payload.toString("utf-8"));
                if (Object.prototype.hasOwnProperty.call(data, "remainingTime")) setRemainingTime(Number(data.remainingTime) || 0);
                if (Object.prototype.hasOwnProperty.call(data, "lightOn")) setLightOn(Boolean(data.lightOn));
                if (Object.prototype.hasOwnProperty.call(data, "brightness")) {
                    const percent = Math.round((Number(data.brightness) || 0) / 2.55);
                    setLightPercent(Math.max(0, Math.min(100, percent)));
                }
                if (Object.prototype.hasOwnProperty.call(data, "currentState")) setOccupancyState(Number(data.currentState) || 0);
                if (Object.prototype.hasOwnProperty.call(data, "pm25")) setPm25(Number(data.pm25) || 0);
            } catch (e) {
                console.error("MQTT payload parse error:", e);
            }
        });

        return () => {
            client.end(true);
        };
    }, []);

    // 명령 발행
    const publishCmd = (obj) => {
        try {
            const client = mqtt.connect(MQTT_URL, {
                username: import.meta.env.VITE_MQTT_USERNAME || undefined,
                password: import.meta.env.VITE_MQTT_PASSWORD || undefined,
                keepalive: 10,
                reconnectPeriod: 0, // 단발 연결
            });
            client.on("connect", () => {
                client.publish(TOPIC_CMD, JSON.stringify(obj), { qos: 0 }, () => client.end(true));
            });
            client.on("error", () => client.end(true));
        } catch (e) {
            console.error("publish error", e);
        }
    };

    // 밝기 변경 (0~100 → 0~255)
    const handleBrightnessChange = (percent) => {
        setLightPercent(percent);
        const brightness255 = Math.round(Math.max(0, Math.min(100, percent)) * 2.55);
        publishCmd({ brightness: brightness255 });
    };

    // 전원 토글
    const handleLightStateChange = (isOn) => {
        setLightOn(isOn);
        publishCmd({ lightOn: !!isOn });
    };

    return (
        <div className={styles.root}>
            {/* 재실 현황판 */}
            <div style={{ gridColumn: 1, gridRow: 1, alignSelf: "start", marginLeft: "70px", zIndex: 10 }}>
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
