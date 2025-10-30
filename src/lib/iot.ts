export type DeviceState = {
    remainingTime: number;
    currentState: 0|1|2;   // 0:IDLE, 1:IN_USE, 2:TIME_UP
    lightOn: boolean;
    brightness: number;    // 0~255
    pm25: number;
};

export const deviceId = import.meta.env.VITE_DEVICE_ID || "uno01";
export const TOPIC_STATE = `devices/${deviceId}/state`;
export const TOPIC_CMD   = `devices/${deviceId}/cmd`;
