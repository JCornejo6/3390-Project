import { useEffect, useState } from "react";

/*const timeFormat = new Intl.DateTimeFormat([], { hour: "numeric", minute: "2-digit", second: "2-digit" });*/
const dateFormat = new Intl.DateTimeFormat([], { weekday: "long", month: "long", day: "numeric" });

function Clock({clockColor,shadowColor,timeFormat,showSeconds}) {
    
    const [now, setNow] = useState(() => new Date());
    
    const clockStyle = {
        color: clockColor,
        textShadow: `0px 4px 10px ${shadowColor}`
    };

    useEffect(() => {
        let timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    let timeOptions= {
        hour: "numeric",
        minute: "2-digit",
        hour12: timeFormat === "12"
};
    if (showSeconds){
        timeOptions.second = "2-digit";
    }
    const formatter = new Intl.DateTimeFormat([],timeOptions);

    let parts = formatter.formatToParts(now);
    let period = parts.find((part) => part.type === "dayPeriod")?.value;
    let digits = parts
        .filter((part) => part.type !== "dayPeriod")
        .map((part) => part.value)
        .join("")
        .trim();

    return (
        <div className="clock" >
            <div className="clockTime">

                <span className="clockDigits" style={  clockStyle }>{digits}</span>
                
                {period && (<span className="clockPeriod" style={ clockStyle }>{period}</span>)}
            </div> 
         
            <div className="clockDate"
           style={clockStyle}>{dateFormat.format(now)}</div>
        </div>
    );
    
    
}

export default Clock;
