import { useEffect, useState } from "react";

/*const timeFormat = new Intl.DateTimeFormat([], { hour: "numeric", minute: "2-digit", second: "2-digit" });*/

// how the date is displayed
const dateFormat = new Intl.DateTimeFormat([], { weekday: "long", month: "long", day: "numeric" });

function Clock({clockColor,shadowColor,timeFormat,showSeconds}) {
   
    // Stores current date and time
    const [now, setNow] = useState(() => new Date());
    
    const clockStyle = {
        color: clockColor,
        textShadow: `0px 4px 10px ${shadowColor}`
    };

      // Updates time every second
    useEffect(() => {
        let timer = setInterval(() => setNow(new Date()), 1000);
       
        // Stops timer
        return () => clearInterval(timer);
    }, []);

    //  how clock time is displayed 
    let timeOptions= {
        hour: "numeric",
        minute: "2-digit",
        hour12: timeFormat === "12"
};

  // Adds seconds if Show Seconds is turned on
    if (showSeconds){
        timeOptions.second = "2-digit";
    }


    // Creates the time formatter using the selected settings
    const formatter = new Intl.DateTimeFormat([],timeOptions);


    // Separates  time digits from AM/PM
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
                
                {/* Shows AM/PM when using 12-hour time */}
                {period && (<span className="clockPeriod" style={ clockStyle }>{period}</span>)}
            </div> 
         
           
            <div className="clockDate"
           style={clockStyle}>{dateFormat.format(now)}</div>
        </div>
    );
    
    
}

export default Clock;
