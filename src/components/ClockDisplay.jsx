import React from "react";
import styles from "./ClockDisplay.module.css";

const ClockDisplay = () => (
    <div className={styles.container}>
        <span className={styles.time}>00:00</span>
    </div>
);

export default ClockDisplay;
