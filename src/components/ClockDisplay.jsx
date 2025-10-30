import React from "react";
import styles from "./ClockDisplay.module.css";

// 부모(Display.jsx)로부터 "00:00" 형식의 문자열을 props로 받음
const ClockDisplay = ({ remainingTimeStr }) => (
    <div className={styles.container}>
        <span className={styles.time}>
            {remainingTimeStr}
        </span>
    </div>
);

export default ClockDisplay;