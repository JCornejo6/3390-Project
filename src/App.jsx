import { useEffect, useState } from "react";
import Clock from "./Clock.jsx";
import TabBar from "./TabBar.jsx";
import Timer from "./Timer.jsx";
import "./App.css";
import Settings from "./Settings.jsx";
import Alarm from "./Alarm.jsx"

import background1 from "./assets/csub.png";
import background2 from "./assets/falling.jpg";
import background3 from "./assets/lake.jpg";
import background4 from "./assets/minimalist.jpg";
import background5 from "./assets/northernLights.jpg";
import background6 from "./assets/R.jpg";
import background7 from "./assets/space.webp";
import background8 from "./assets/ye.webp";
import background9 from "./assets/gas.jpg";
import background10 from "./assets/twiy.jpg";
import background11 from "./assets/spiderman.jpg";
import background12 from "./assets/spdier.jpg";


// Stores all backgrounds in array for Settings 
const backgrounds = [
    background1,
    background2,
    background3,
    background4,
    background5,
    background6,
    background7,
    background8,
    background9,
    background10,
    background11,
    background12
];

function App() {
      // Keeps track of which tab/page is currently selected
    const [tab, setTab] = useState("clock");

    // Stores the remaining timer time for the timer tab badge
    const [timerBadge, setTimerBadge] = useState(null);

    const [clockColor,setClockColor] = useState(()=>{
        return localStorage.getItem("clockColor") ||"#ffffff"; });

    const [timeFormat, setTimeFormat] = useState(() => {
    return localStorage.getItem("timeFormat") || "12";
});

// Show seconds by default if nothing saved
    const [showSeconds, setShowSeconds] = useState(() => {
    const saved = localStorage.getItem("showSeconds");

    if (saved === null) {
        return true;
    }

    return saved === "true";
});

/*console.log("APP showSeconds =", showSeconds);
console.log("APP setter =", typeof setShowSeconds);*/


    // Loads the saved background or uses background1 by default,
    //  other settings load saved as well
const [background, setBackground] = useState(() => {
    const savedIndex = localStorage.getItem("backgroundIndex");

    if (savedIndex === null) {
        return background1;
    }

    return backgrounds[Number(savedIndex)] || background1;
});

const [backgroundBlur, setBackgroundBlur] = useState(() => {
    const saved = localStorage.getItem("backgroundBlur");

    return saved !== null ? Number(saved) : 5;
});

const [shadowColor, setShadowColor] = useState(() => {
    return localStorage.getItem("shadowColor") || "#000000";
});

//save settings in local storage
useEffect(() => {
    localStorage.setItem("clockColor", clockColor);
}, [clockColor]);

useEffect(() => {
    localStorage.setItem("shadowColor", shadowColor);
}, [shadowColor]);

useEffect(() => {
    localStorage.setItem("timeFormat", timeFormat);
}, [timeFormat]);

useEffect(() => {
    localStorage.setItem("showSeconds", showSeconds);
}, [showSeconds]);

useEffect(() => {
    localStorage.setItem("backgroundBlur", backgroundBlur);
}, [backgroundBlur]);

useEffect(() => {
    const index = backgrounds.indexOf(background);

    localStorage.setItem("backgroundIndex", index);
}, [background]);

//navigation tabs
    let tabs = [
        { value: "clock", label: "Clock" },
         {value: "alarm", label: "Alarm"},
        { value: "timer", label: "Timer", badge: tab !== "timer" ? timerBadge : null },
        {value: "settings",label:"Settings"},
    ];
/*console.log("APP BACKGROUNDS:", backgrounds);
console.log("APP BACKGROUND COUNT:", backgrounds.length);*/
    return (
        
        <div className="app"
        /*style = {{"--backgroundImage": `url(${background})`}}*/>
            
            <div className ="backgroundLayer"
            style={{
                backgroundImage:`url("${background}")`,
                filter: `blur(${backgroundBlur}px)`
            }}
            ></div>
            <header className="toolbar">
                <TabBar tabs={tabs} selected={tab} onSelect={setTab} />
            </header>

            <main className="content"> {}
                <section className="panel" hidden={tab !== "clock"}>
                    <Clock 
                    clockColor={clockColor}
                    timeFormat={timeFormat} 
                    showSeconds={showSeconds}

                    shadowColor={shadowColor}
                    />
                </section>

                <section
                className="panel"
                hidden={tab !== "alarm"}
                >
                    <Alarm />
                </section>


                <section className="panel" hidden={tab !== "timer"}>
                    <Timer
                        visible={tab === "timer"}
                        onFinish={() => setTab("timer")}
                        onRemainingChange={setTimerBadge}
                    />
                </section>

                <section className="panel"
                hidden = {tab !== "settings"}
                >
                    <Settings
                    clockColor={clockColor}
                    setClockColor={setClockColor}
                    
                    timeFormat={timeFormat}
                    setTimeFormat={setTimeFormat}

                    showSeconds={showSeconds}
                    setShowSeconds={setShowSeconds}

                    backgrounds={backgrounds}
                    background={background}
                    setBackground={setBackground}

                    backgroundBlur={backgroundBlur}
                    setBackgroundBlur={setBackgroundBlur}

                    shadowColor={shadowColor}
                    setShadowColor={setShadowColor}

                    
                    />
                </section>
            </main>
        </div>
    );
}

export default App;
