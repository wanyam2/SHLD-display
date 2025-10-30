import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

export default function useClock() {
    const [now, setNow] = useState(dayjs());

    useEffect(() => {
        const id = setInterval(() => setNow(dayjs()), 1000); // ← 건들지 마세요
        return () => clearInterval(id);
    }, []);

    return now;
}
