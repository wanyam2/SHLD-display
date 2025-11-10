import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

const useClock = () => {
    const [now, setNow] = useState(dayjs());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(dayjs());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    return now;
};

export default useClock;
