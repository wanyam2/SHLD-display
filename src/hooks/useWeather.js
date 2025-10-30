import { useEffect, useState } from "react";

export default function useWeather() {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(
                    "https://api.openweathermap.org/data/2.5/weather?q=Daejeon&units=metric&lang=kr&appid=e5a087bda87fdc9633fec66e11bfa928"
                );
                const d = await res.json();
                setWeather({
                    temp: Math.round(d.main.temp),
                    description: d.weather[0].description,
                    icon: d.weather[0].icon,
                });
            } catch (e) {
                console.error("날씨 불러오기 실패", e);
            }
        })();
    }, []);

    return weather;
}
