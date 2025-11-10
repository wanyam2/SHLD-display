import React from "react";
import styles from "./ControlBox.module.css";

/**
 * eCO2와 TVOC 값을 표시하는 공기질 컴포넌트
 * @param {number} eco2 - eCO2 (ppm)
 */
const AirQualityDisplay = ({ eco2, tvoc }) => {

    const getStatus = (val) => {
        if (!val) return "";
        if (val < 700) return "좋음";
        if (val < 1000) return "보통";
        return "나쁨";
    };

    const status = getStatus(eco2);

    return (
        <div className={styles.controlBox}>
            <div className={styles.controlLabel}>공기질 (eCO₂)</div>
            <div className={styles.controlValue}>
                {eco2 ? eco2 : "..."}
                <span style={{fontSize: '20px', marginLeft: '4px'}}>ppm</span>
            </div>
            <div style={{fontSize: '16px', fontWeight: '600', textAlign: 'left', marginTop: '4px'}}>
                {status}
            </div>
        </div>
    );
};

export default AirQualityDisplay;
