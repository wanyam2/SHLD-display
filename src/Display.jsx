import React from "react";
import styles from "./Display.module.css";
import TimeDisplay from "./components/TimeDisplay.jsx";
import WeatherDisplay from "./components/WeatherDisplay";
import ClockDisplay from "./components/ClockDisplay";
import AirconControl from "./components/AirconControl";
import LightControl from "./components/LightControl";
import logo from "./assets/pause_logo.png"

const Display = () => (
    <div className={styles.root}>
        <div className={styles.sidePanel}>
            <TimeDisplay />
            <WeatherDisplay />
        </div>

        <div className={styles.centerClock}>
            <ClockDisplay />
            <span className={styles.subtitle}>편안한 시간 보내세요</span>
        </div>

        <div className={styles.control}>
            <AirconControl />
            <LightControl />
        </div>

        <img src={logo} alt="로고" className={styles.logo} />
    </div>
);

export default Display;
