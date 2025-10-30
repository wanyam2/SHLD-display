import React from "react";
import styles from "./ControlBox.module.css";

// 부모(Display.jsx)로부터 현재 상태와 상태 변경 함수를 props로 받음
const LightControl = ({ brightness, isOn, onBrightnessChange, onStateChange }) => {

    const handleSliderChange = (e) => {
        const percent = Number(e.target.value);
        onBrightnessChange(percent); // 부모에게 변경 요청
    };

    const handleOn = () => {
        if (!isOn) {
            onStateChange(true); // 부모에게 켜달라고 요청
        }
    };

    const handleOff = () => {
        if (isOn) {
            onStateChange(false); // 부모에게 꺼달라고 요청
        }
    };

    return (
        <div className={styles.controlBox}>
            <div className={styles.controlLabel}>조명</div>
            <div className={styles.controlValue}>{isOn ? `${brightness}%` : "Off"}</div>

            <input
                type="range"
                min="0"
                max="100"
                value={brightness} // 부모가 준 값
                onChange={handleSliderChange} // 부모에게 알림
                className={styles.slider}
                disabled={!isOn}
            />

            {/* ControlBox.module.css의 .on, .off 스타일을 활용한 버튼 */}
            <div className={styles.controlButtons}>
                <button
                    onClick={handleOn}
                    className={isOn ? styles.on : ""}
                >
                    ON
                </button>
                <button
                    onClick={handleOff}
                    className={!isOn ? styles.off : ""}
                >
                    OFF
                </button>
            </div>
        </div>
    );
};

export default LightControl;