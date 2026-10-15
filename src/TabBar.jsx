// tab bar at the top
function TabBar({ tabs, selected, onSelect }) {
    let selectedIndex = Math.max(0, tabs.findIndex((tab) => tab.value === selected));

    return (
        <div
            className="tabBar"
            role="tablist"
            style={{ "--tabCount": tabs.length, "--selectedIndex": selectedIndex }}
        >
            <span className="tabBarHighlight" aria-hidden="true" />
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    role="tab"
                    aria-selected={tab.value === selected}
                    className={`tabBarTab${tab.value === selected ? " isSelected" : ""}`}
                    onClick={() => onSelect(tab.value)}
                >
                    {tab.label}
                    {tab.badge && <span className="tabBarBadge">{tab.badge}</span>}
                </button>
            ))}
        </div>
    );
}

export default TabBar;
