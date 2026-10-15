import { useState } from "react";
import Clock from "./Clock.jsx";
import TabBar from "./TabBar.jsx";
import Timer from "./Timer.jsx";
import "./App.css";

function App() {
    const [tab, setTab] = useState("clock");
    const [timerBadge, setTimerBadge] = useState(null);

    let tabs = [
        { value: "clock", label: "Clock" },
        { value: "timer", label: "Timer", badge: tab !== "timer" ? timerBadge : null },
    ];

    return (
        <div className="app">
            <header className="toolbar">
                <TabBar tabs={tabs} selected={tab} onSelect={setTab} />
            </header>

            <main className="content"> {}
                <section className="panel" hidden={tab !== "clock"}>
                    <Clock />
                </section>
                <section className="panel" hidden={tab !== "timer"}>
                    <Timer
                        visible={tab === "timer"}
                        onFinish={() => setTab("timer")}
                        onRemainingChange={setTimerBadge}
                    />
                </section>
            </main>
        </div>
    );
}

export default App;
