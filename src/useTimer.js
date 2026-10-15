import { useCallback, useEffect, useRef, useState } from "react";

export function useTimer({ onFinish } = {}) {
    const [status, setStatus] = useState("idle"); // idle,running,paused,done
    const [duration, setDuration] = useState(0); // length in milliseconds
    const [remaining, setRemaining] = useState(0); // time left
    const [endsAt, setEndsAt] = useState(null); // end time 

    const onFinishRef = useRef(onFinish);
    useEffect(() => {
        onFinishRef.current = onFinish;
    });

    useEffect(() => {
        if (status !== "running" || endsAt == null)
            return;

        let frame = 0;
        let finished = false;

        function update() {
            if (finished)
                return;
            let left = endsAt - Date.now();
            if (left <= 0) {
                finished = true;
                setRemaining(0);
                setStatus("done");
                onFinishRef.current?.();
            } else {
                setRemaining(left);
            }
        }

        // update every frame so ring moves smoothly
        function loop() {
            update();
            if (!finished)
                frame = requestAnimationFrame(loop);
        }
        frame = requestAnimationFrame(loop);

        return () => {
            finished = true;
            cancelAnimationFrame(frame);
        };
    }, [status, endsAt]);

    const start = useCallback((milliseconds) => {
        if (milliseconds <= 0)
            return;
        setDuration(milliseconds);
        setRemaining(milliseconds);
        setEndsAt(Date.now() + milliseconds);
        setStatus("running");
    }, []);

    const pause = useCallback(() => {
        if (status !== "running")
            return;
        setRemaining(Math.max(0, endsAt - Date.now()));
        setStatus("paused");
    }, [status, endsAt]);

    const resume = useCallback(() => {
        if (status !== "paused")
            return;
        setEndsAt(Date.now() + remaining);
        setStatus("running");
    }, [status, remaining]);

    const reset = useCallback(() => {
        setStatus("idle");
        setRemaining(0);
        setEndsAt(null);
    }, []);

    return { status, duration, remaining, endsAt, start, pause, resume, reset };
}
