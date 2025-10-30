import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import mqtt, { MqttClient } from "mqtt";
import { DeviceState, TOPIC_STATE, TOPIC_CMD } from "../lib/iot";

const URL = import.meta.env.VITE_MQTT_URL as string;
const USERNAME = import.meta.env.VITE_MQTT_USERNAME || undefined;
const PASSWORD = import.meta.env.VITE_MQTT_PASSWORD || undefined;

const DEFAULT_STATE: DeviceState = {
    remainingTime: 0, currentState: 0, lightOn: true, brightness: 180, pm25: 0
};

export function useMqttDevice() {
    const clientRef = useRef<MqttClient | null>(null);
    const [connected, setConnected] = useState(false);
    const [state, setState] = useState<DeviceState>(DEFAULT_STATE);
    const [lastMessage, setLastMessage] = useState("");
    const [error, setError] = useState("");

    // 연결
    useEffect(() => {
        if (!URL) { setError("VITE_MQTT_URL이 비어있습니다."); return; }

        const client = mqtt.connect(URL, {
            username: USERNAME,
            password: PASSWORD,
            keepalive: 30,
            reconnectPeriod: 2000, // 자동 재연결
        });
        clientRef.current = client;

        client.on("connect", () => {
            setConnected(true);
            setError("");
            client.subscribe(TOPIC_STATE, { qos: 0 });
        });

        client.on("reconnect", () => setConnected(false));
        client.on("close", () => setConnected(false));
        client.on("error", (err) => setError(err?.message || "MQTT error"));

        client.on("message", (topic, payload) => {
            if (topic !== TOPIC_STATE) return;
            const text = payload.toString("utf-8");
            setLastMessage(text);
            try {
                const json = JSON.parse(text);
                setState(prev => ({
                    remainingTime: Number(json.remainingTime ?? prev.remainingTime),
                    currentState: Number(json.currentState ?? prev.currentState) as 0|1|2,
                    lightOn: Boolean(json.lightOn ?? prev.lightOn),
                    brightness: Number(json.brightness ?? prev.brightness),
                    pm25: Number(json.pm25 ?? prev.pm25),
                }));
            } catch { /* ignore */ }
        });

        return () => { client.end(true); };
    }, []);

    // 발행 헬퍼
    const publish = useCallback((obj: any) => {
        const c = clientRef.current;
        if (!c || !connected) throw new Error("MQTT 미연결");
        c.publish(TOPIC_CMD, JSON.stringify(obj), { qos: 0 });
    }, [connected]);

    const setLightOn = useCallback((on: boolean) => publish({ lightOn: on }), [publish]);
    const setBrightness = useCallback((val: number) => {
        const v = Math.max(0, Math.min(255, val|0));
        publish({ brightness: v });
    }, [publish]);

    const humanState = useMemo(() => {
        switch (state.currentState) {
            case 0: return "대기(IDLE)";
            case 1: return "사용 중(IN_USE)";
            case 2: return "시간만료(TIME_UP)";
            default: return `알수없음(${state.currentState})`;
        }
    }, [state.currentState]);

    const hhmmss = useMemo(() => {
        const s = Math.max(0, state.remainingTime|0);
        const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
        return [h,m,sec].map(n => String(n).padStart(2,"0")).join(":");
    }, [state.remainingTime]);

    return { connected, error, state, humanState, hhmmss, lastMessage, setLightOn, setBrightness };
}
