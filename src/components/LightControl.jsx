import React, { useState } from "react";
import styles from "./ControlBox.module.css";

const LightControl = () => {
    const [brightness, setBrightness] = useState(70);

    return (
        <div className={styles.controlBox}>
            <div className={styles.controlLabel}>조명</div>
            <div className={styles.controlValue}>{brightness}%</div>
            <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className={styles.slider}
            />
        </div>
    );
};

export default LightControl;
