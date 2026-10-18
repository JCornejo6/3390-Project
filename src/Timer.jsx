import { useEffect, useState } from "react";
import ProgressRing from "./ProgressRing.jsx";
import WheelPicker from "./WheelPicker.jsx";
import { useTimer } from "./useTimer.js";
import "./Timer.css";
import { playAlarmSound, stopAlarmSound } from "./alarmSound.js";

const DEFAULT_SETTINGS = { hours: 0, minutes: 5, seconds: 0 };

function pad(number) {
    return String(number).padStart(2, "0");
}

// format time
function formatRemaining(milliseconds) {
    let totalSeconds = Math.ceil(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;
    if (hours > 0)
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    return `${pad(minutes)}:${pad(seconds)}`;
}

// format time
function formatDuration(milliseconds) {
    let totalSeconds = Math.round(milliseconds / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    let pieces = [];
    if (hours > 0)
        pieces.push(`${hours} hr`);
    if (minutes > 0)
        pieces.push(`${minutes} min`);
    if (seconds > 0)
        pieces.push(`${seconds} sec`);
    return pieces.length > 0 ? pieces.join(" ") : "0 sec";
}

function BellIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-1.7 1.7A1 1 0 0 0 4 19.4h16a1 1 0 0 0 .7-1.7L19 16Z" />
        </svg>
    );
}


function Timer({ visible = true, onFinish, onRemainingChange }) {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const { hours, minutes, seconds } = settings;

    const timer = useTimer({ onFinish });
    const { status, duration, remaining, endsAt } = timer;

    let pickedMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    let display = formatRemaining(remaining);
    let isCounting = status === "running" || status === "paused";

    function update(patch) {
        setSettings((previousSettings) => ({ ...previousSettings, ...patch }));
    }

    function startTimer(milliseconds = pickedMilliseconds) {
        timer.start(milliseconds);
    }

    function cancel() {
        timer.reset();
    }

    function repeat() {
        stopAlarmSound();
        startTimer(duration);
    }

    /*stop alarm */
    function stopTimer(){
       stopAlarmSound();
       cancel();
    }

    useEffect(() => {
        onRemainingChange?.(isCounting ? display : null);
    }, [display, isCounting, onRemainingChange]);

    useEffect(() => {
    if (status === "done") {
        playAlarmSound();
    }
    }, [status]);

    let endTime = "";
    if (endsAt)
        endTime = new Date(endsAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

    let rightButton;
    if (status === "running") {
        rightButton = { text: "Pause", color: "roundButtonOrange", onClick: timer.pause };
    } else if (status === "paused") {
        rightButton = { text: "Resume", color: "roundButtonGreen", onClick: timer.resume };
    } else {
        rightButton = {
            text: "Start",
            color: "roundButtonGreen",
            onClick: () => startTimer(),
            disabled: status === "done" || pickedMilliseconds === 0,
        };
    }

    return (
        <div className={status === "paused" ? "timer isPaused" : "timer"}>
            <div className="timerRow">
                <button className="roundButton" disabled={status === "idle"} onClick={stopTimer}>
                    Cancel
                </button>

                <div className="timerStage">
                    {status === "idle" ? (
                        // wheels can't scroll while hidden
                        visible && (
                            <div className="picker">
                                <div className="pickerHighlight" aria-hidden="true" />
                                <WheelPicker
                                    label="Hours"
                                    unit="hours"
                                    count={24}
                                    value={hours}
                                    onChange={(newHours) => update({ hours: newHours })}
                                />
                                <WheelPicker
                                    label="Minutes"
                                    unit="min"
                                    count={60}
                                    value={minutes}
                                    onChange={(newMinutes) => update({ minutes: newMinutes })}
                                />
                                <WheelPicker
                                    label="Seconds"
                                    unit="sec"
                                    count={60}
                                    value={seconds}
                                    onChange={(newSeconds) => update({ seconds: newSeconds })}
                                />
                            </div>
                        )
                    ) : (
                        <div className="face">
                            <ProgressRing progress={duration ? remaining / duration : 0} />
                            <div className="faceCenter">
                                <div className="faceDuration">{formatDuration(duration)}</div>
                                <div
                                    className={display.length > 5 ? "faceTime isLong" : "faceTime"}
                                    role="timer"
                                    aria-live="off"
                                >
                                    {display}
                                </div>
                                <div className="faceEnds">
                                    {status === "paused" ? (
                                        "Paused"
                                    ) : (
                                        <>
                                            <BellIcon /> {endTime}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    className={`roundButton ${rightButton.color}`}
                    disabled={rightButton.disabled}
                    onClick={rightButton.onClick}
                >
                    {rightButton.text}
                </button>
            </div>


            {status === "done" && (
                <div className="alertBackdrop">
                    <div
                        className="alert"
                        role="alertdialog"
                        aria-labelledby="timer-alert-title"
                        aria-describedby="timer-alert-body"
                    >
                        <div className="alertIcon">
                            <BellIcon />
                        </div>
                        <h2 id="timer-alert-title">Timer</h2>
                        <p id="timer-alert-body">Time's up · {formatDuration(duration)}</p>
                        <div className="alertActions">
                            <button className="alertButton" onClick={repeat}>
                                Repeat
                            </button>
                            <button className="alertButton alertButtonPrimary" onClick={stopTimer} autoFocus>
                                Stop
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Timer;
