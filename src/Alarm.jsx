import { useEffect, useState } from "react";
import WheelPicker from "./WheelPicker.jsx";
import "./Timer.css";
import{ playAlarmSound,stopAlarmSound} from "./alarmSound.js";

function BellIcon() {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3.5a1.5 1.5 0 0 0-3 0v.66A7 7 0 0 0 5 11v5l-1.7 1.7A1 1 0 0 0 4 19.4h16a1 1 0 0 0 .7-1.7L19 16Z" />
        </svg>
    );
}

function Alarm() {

    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [period,setPeriod] = useState(0);
    const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const [alarmSet, setAlarmSet] = useState(false);
    const [scheduledAlarm, setScheduledAlarm] = useState(null);
    const [ringing,setRinging]=useState(false);

    function setAlarm() {
        setScheduledAlarm({
            hour: hours[hour],
            minute: minute,
            period: period
        });
        setRinging(false);
        setAlarmSet(true);
    }


     function cancelAlarm(){
            setAlarmSet(false);
            setScheduledAlarm(null);
        }

     function snoozeAlarm() {
        stopAlarmSound();
        
    const snoozeTime = new Date(Date.now() + 5 * 60 * 1000);

    let newHour = snoozeTime.getHours();
    const newMinute = snoozeTime.getMinutes();

    // 0 = AM, 1 = PM
    const newPeriod = newHour >= 12 ? 1 : 0;

    // Convert 24-hour time to 12-hour time
    newHour = newHour % 12;

    // 0 should display as 12
    if (newHour === 0) {
        newHour = 12;
    }

    setScheduledAlarm({
        hour: newHour,
        minute: newMinute,
        period: newPeriod
    });

    setRinging(false);
    setAlarmSet(true);
}

        useEffect(()=> {
            if (!alarmSet || !scheduledAlarm){
                return;
            }
            const checkAlarm = setInterval(()=>{
                const now = new Date();
                
                let alarmHour = scheduledAlarm.hour;

                if(scheduledAlarm.period === 1 && alarmHour !==12){
                    alarmHour +=12;
                }
                
                if (scheduledAlarm.period === 0 && alarmHour ===12){
                    alarmHour=0;
                }

                if( 
                    now.getHours() === alarmHour &&
                    now.getMinutes() === scheduledAlarm.minute
                ){
                    playAlarmSound();

                    setRinging(true);
                    setAlarmSet(false);
                }
            }, 1000);

            return () => clearInterval(checkAlarm);

        },[alarmSet,scheduledAlarm]);

   return (
    <div className="timer">

    

        <div className="timerRow">

            {alarmSet &&(
                <p>Alarm set for {scheduledAlarm.hour}:
                {String(scheduledAlarm.minute).padStart(2,"0")}
                {scheduledAlarm.period ===0 ? "AM" : "PM"}
                </p>
            )}

            <button className="roundButton "
            disabled= {!alarmSet}
            onClick={cancelAlarm}
            >
                Cancel
            </button>

            <div className="timerStage">

                <div className="picker">

                    <div
                        className="pickerHighlight"
                        aria-hidden="true"
                    />

                    <WheelPicker
                        label="Hour"
                        unit="hour"
                        items={hours}
                        value={hour}
                        onChange={setHour}
                    />

                    <WheelPicker
                        label="Minute"
                        unit="min"
                        count={60}
                        value={minute}
                        onChange={setMinute}
                     />


                    <WheelPicker
                        label="AM or PM"
                        unit=""
                        items={["AM", "PM"]}
                        value={period}
                        onChange={setPeriod}
                    />

                </div>

            </div>

            <button className="roundButton roundButtonGreen"
            onClick={setAlarm}>
                Set
            </button>

        </div>

    {ringing && scheduledAlarm && (
    <div className="alertBackdrop">

        <div
            className="alert"
            role="alertdialog"
            aria-labelledby="alarm-alert-title"
            aria-describedby="alarm-alert-body"
        >

            <div className="alertIcon">
                <BellIcon />
            </div>

            <h2 id="alarm-alert-title">
                Alarm
            </h2>

            <p id="alarm-alert-body">
                {scheduledAlarm.hour}:
                {String(scheduledAlarm.minute).padStart(2, "0")}
                {scheduledAlarm.period === 0 ? " AM" : " PM"}
            </p>

            <div className="alertActions">

                <button
                    className="alertButton"
                    onClick={snoozeAlarm}
                >
                    Snooze
                </button>

                <button
                    className="alertButton alertButtonPrimary"
                    onClick={() => {
                        stopAlarmSound();
                        
                        setRinging(false);
                        setScheduledAlarm(null);
                    }}
                >
                    Stop
                </button>

            </div>

        </div>

    </div>
)}
       

    </div>
);
}

export default Alarm;