// countdown ring
function ProgressRing({ progress, size = 300, stroke = 8 }) {
    let center = size / 2;
    let radius = (size - stroke) / 2;
    let circumference = 2 * Math.PI * radius;
    let clamped = Math.min(1, Math.max(0, progress));

    return (
        <svg className="ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
            <circle className="ringTrack" cx={center} cy={center} r={radius} strokeWidth={stroke} />
            <circle
                className="ringProgress"
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={stroke}
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - clamped)}
                transform={`rotate(-90 ${center} ${center})`}
                style={{ opacity: clamped > 0 ? 1 : 0 }}
            />
        </svg>
    );
}

export default ProgressRing;
