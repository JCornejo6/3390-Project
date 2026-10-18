import alarmAudio from "./assets/harhar.mp3";

const audio = new Audio(alarmAudio);

audio.loop = true;

export function playAlarmSound(){
    audio.currentTime = 0;

    audio.play().catch((error)=> {
        console.log("Could not play the alarm sound: ", error);

    }); 
}
export function stopAlarmSound() {
    audio.pause();
    audio.currentTime = 0;
}