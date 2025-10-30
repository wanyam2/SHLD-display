import React from 'react';
import styles from './OccupancyDisplay.module.css'; // 아래 CSS 파일 임포트

/**
 * 재실 여부를 표시하는 (뒤집힌) 컴포넌트
 * @param {boolean} isOccupied - 부모(Display.jsx)가 전달하는 재실 상태
 */
const OccupancyDisplay = ({ isOccupied }) => {

    const displayText = isOccupied ? "재실 중" : "빈 방";

    return (
        // 이 wrapper가 CSS를 통해 180도 회전됩니다.
        <div className={styles.wrapper}>
            <span className={styles.text}>
                {displayText}
            </span>
        </div>
    );
};

export default OccupancyDisplay;