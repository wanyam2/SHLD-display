import React from "react";
import styles from "./WeatherDisplay.module.css";
import useWeather from "../hooks/useWeather";

const WeatherDisplay = () => {
    const weather = useWeather();

    if (!weather) return null;

    return (
        <div className={styles.weatherWrapper}>
            <div className={styles.weatherDesc}>
                <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                    alt="날씨 아이콘"
                    className={styles.weatherIcon}
                />
                <span>현재기온</span>
            </div>
            <span className={styles.weatherTemp}>{weather.temp}°C</span>
        </div>
    );
};
export default WeatherDisplay;
