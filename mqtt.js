// mqtt.js 설치 필요: npm install mqtt
import { connect } from "mqtt";

// EMQX WebSocket 기본 경로는 /mqtt
const DEVICE_ID = "your_device_id_here"; // ← ESP32에서 사용 중인 deviceId와 맞춰주세요

const client = connect("ws://<서버IP>:8083/mqtt", {
    keepalive: 60,
    reconnectPeriod: 2000,
    // username: "webuser",
    // password: "webpass",
});

client.on("connect", () => {
    console.log("✅ MQTT connected");
    client.subscribe(`devices/${DEVICE_ID}/state`);
});

client.on("message", (topic, payload) => {
    try {
        const msg = JSON.parse(payload.toString());
        console.log("📩 Message:", topic, msg);
    } catch (err) {
        console.error("JSON parse error:", err);
    }
});

export function sendCmd(partial) {
    const topic = `devices/${DEVICE_ID}/cmd`;
    const message = JSON.stringify(partial);
    client.publish(topic, message);
    console.log("📤 Sent:", topic, message);
}
