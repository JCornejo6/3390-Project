import { useEffect, useState } from "react";

const timeFormat = new Intl.DateTimeFormat([], { hour: "numeric", minute: "2-digit", second: "2-digit" });
const dateFormat = new Intl.DateTimeFormat([], { weekday: "long", month: "long", day: "numeric" });

function Clock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        let timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    let parts = timeFormat.formatToParts(now);
    let period = parts.find((part) => part.type === "dayPeriod")?.value;
    let digits = parts
        .filter((part) => part.type !== "dayPeriod")
        .map((part) => part.value)
        .join("")
        .trim();

    return (
        <div className="clock">
            <div className="clockTime">
                <span className="clockDigits">{digits}</span>
                {period && <span className="clockPeriod">{period}</span>}
            </div>
            <div className="clockDate">{dateFormat.format(now)}</div>
        </div>
    );
}

export default Clock;
