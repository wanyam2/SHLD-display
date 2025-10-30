import React from "react";
import styles from "./TimeDisplay.module.css";
import useClock from "../hooks/useClock";

const TimeDisplay = () => {
    const now = useClock();

    return (
        <div className={styles.wrapper}>
            <span className={styles.dateText}>{now.format("M월 D일 ddd")}</span>
            <span className={styles.timeText}>{now.format("HH:mm")}</span>
        </div>
    );
};
export default TimeDisplay;
