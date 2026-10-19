import { useEffect, useLayoutEffect, useRef } from "react";

const ITEM_HEIGHT = 44;

// scroll wheel: scroll, click, or arrow keys
function WheelPicker({ count, value, onChange, unit, label,items }) {
    
    let itemCount = items ? items.length : count;
    
    const scrollerRef = useRef(null);
    const settleRef = useRef(0);
    const mountedRef = useRef(false);
    const targetRef = useRef(0); // where the wheel is headed

    // on mount, jump to the value; after that, animate to any new value
    // compares against the target, not scrollTop, so fast key presses aren't lost mid-animation
    useLayoutEffect(() => {
        let scroller = scrollerRef.current;
        let target = value * ITEM_HEIGHT;
        if (!mountedRef.current) {
            mountedRef.current = true;
            scroller.scrollTop = target;
        } else if (target !== targetRef.current) {
            scroller.scrollTo({ top: target, behavior: "smooth" });
        }
        targetRef.current = target;
    }, [value]);

    useEffect(() => () => clearTimeout(settleRef.current), []);

    function handleScroll() {
        clearTimeout(settleRef.current);
        settleRef.current = setTimeout(() => {
            let scroller = scrollerRef.current;
            if (!scroller)
                return;
            let index = Math.min(itemCount - 1, Math.max(0, Math.round(scroller.scrollTop / ITEM_HEIGHT)));
            targetRef.current = index * ITEM_HEIGHT;
            if (index !== value)
                onChange(index);
        }, 120);
    }

    function handleKeyDown(event) {
        let moves = { ArrowUp: -1, ArrowDown: 1, PageUp: -5, PageDown: 5 };
        if (event.key in moves) {
            event.preventDefault();
            onChange(Math.min(itemCount - 1, Math.max(0, value + moves[event.key])));
        } else if (event.key === "Home") {
            event.preventDefault();
            onChange(0);
        } else if (event.key === "End") {
            event.preventDefault();
            onChange(itemCount - 1);
        }
    }

    // numbers on the wheel
    let numbers = items || [...Array(count).keys()];

    return (
        <div className="wheel">
            <div
                ref={scrollerRef}
                className="wheelScroller"
                role="spinbutton"
                tabIndex={0}
                aria-label={label}
                aria-valuemin={0}
                aria-valuemax={itemCount - 1}
                aria-valuenow={value}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
            >
                {numbers.map((item, index) => (
                    <div
                        key={item}
                        className={`wheelItem${index === value ? " isSelected" : ""}`}
                        onClick={() => onChange(index)}
                    >
                        {item}
                    </div>
                ))}
            </div>
            <span className="wheelUnit" aria-hidden="true">
                {unit}
            </span>
        </div>
    );
}

export default WheelPicker;
