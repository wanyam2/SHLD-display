import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Display from './Display.jsx';

function App() {
    const [sensorData, setSensorData] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // React UI의 조명 상태
    const [lightOn, setLightOn] = useState(true);
    const [lightPercent, setLightPercent] = useState(70);

    const ws = useRef(null);

    useEffect(() => {
        // ws.current = new WebSocket('ws://localhost:8080'); // 이전 코드
        // React 18 Strict Mode의 이중 호출 문제를 방지하기 위해
        // ws.current가 없을 때만 WebSocket을 생성합니다.
        if (!ws.current) {
            ws.current = new WebSocket('ws://localhost:8080');

            ws.current.onopen = () => {
                console.log('Connected to WebSocket server');
                setIsConnected(true);
            };

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setSensorData(data);
                } catch (error) {
                    console.error('Failed to parse JSON:', event.data);
                }
            };

            ws.current.onclose = () => {
                console.log('Disconnected from WebSocket server');
                setIsConnected(false);
                ws.current = null; // 연결이 닫히면 참조 제거
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
                setIsConnected(false);
                ws.current = null; // 에러 시 참조 제거
            };
        }

        // useEffect의 cleanup 함수
        return () => {
            // 컴포넌트가 언마운트될 때 WebSocket 연결을 닫습니다.
            // (Strict Mode에서 두 번째 마운트 전에 실행됨)
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                // ws.current.close(); // StrictMode에서 너무 빨리 닫히는 문제 방지
            }
        };
    }, []); // 의존성 배열을 비워 최초 1회(또는 Strict Mode에서 2회)만 실행

    const sendWsCommand = (cmd) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            console.log('[React] Sending command to server:', cmd);
            ws.current.send(JSON.stringify(cmd));
        } else {
            console.error('WebSocket is not connected.');
        }
    };

    const handleLightStateChange = (isOn) => {
        console.log('[React] handleLightStateChange called:', isOn);
        setLightOn(isOn);
        sendWsCommand({ command: 'light', value: isOn ? 'L1' : 'L0' });
    };

    const handleBrightnessChange = (percent) => {
        console.log('[React] handleBrightnessChange called:', percent);
        setLightPercent(percent);
        const brightness255 = Math.round(Math.max(0, Math.min(100, percent)) * 2.55);
        sendWsCommand({ command: 'brightness', value: `B${brightness255}` });
    };

    // [수정됨] sensorData에서 남은 시간 추출
    const remainingTime = sensorData?.remainingTime || 0;

    return (
        <div className="App">
            <Display
                sensorData={sensorData}
                isConnected={isConnected}
                lightOn={lightOn}
                lightPercent={lightPercent}
                onLightStateChange={handleLightStateChange}
                onBrightnessChange={handleBrightnessChange}
                remainingTime={remainingTime} // [수정됨] 남은 시간을 prop으로 전달
            />
        </div>
    );
}

export default App;

