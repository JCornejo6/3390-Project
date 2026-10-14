import { useState, useEffect } from "react";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="clock_container">
      <div className="digi_clock">
        <span>{time.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

export default Clock;