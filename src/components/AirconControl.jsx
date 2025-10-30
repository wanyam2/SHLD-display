import React, { useState } from "react";
import styles from "./ControlBox.module.css";

const AirconControl = () => {
    const [isOn, setIsOn] = useState(false);
    const [temp, setTemp] = useState(24);

    const togglePower = () => setIsOn(prev => !prev);
    const increase = () => setTemp(prev => Math.min(prev + 1, 30));
    const decrease = () => setTemp(prev => Math.max(prev - 1, 16));

    return (
        <div className={styles.controlBox}>
            <div className={styles.controlLabel}>에어컨</div>
            <div className={styles.controlValue}>{temp}℃</div>
            <div className={styles.controlButtons}>
                <button onClick={decrease}>−</button>
                <button onClick={increase}>＋</button>
                <button onClick={togglePower} className={isOn ? styles.on : styles.off}>
                    {isOn ? "ON" : "OFF"}
                </button>
            </div>
        </div>
    );
};

export default AirconControl;
