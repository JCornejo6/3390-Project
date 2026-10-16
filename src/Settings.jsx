

function Settings({ clockColor, setClockColor,timeFormat,
    setTimeFormat, showSeconds,setShowSeconds,backgrounds,
    background,setBackground,backgroundBlur,setBackgroundBlur,
    shadowColor, setShadowColor}) {
   console.log("shadowColor =", shadowColor);
console.log("setShadowColor type =", typeof setShadowColor);
       
        return(
        <div className = "settings">
            <h1>Settings</h1>
            <div className="settingRow">

                <label>Clock Color</label>

                <input
                type="color"
                value={clockColor}
                onChange={(event)=>setClockColor(event.target.value)
                }
                />
                </div>

        <div className = "settingRow">
            <label>Text Shadow Color</label>

                <input
                type="color"
                value={shadowColor}
                onChange={(event)=>
                 setShadowColor(event.target.value)
                }
                />
                 </div>

                <div className="settingRow">
                    <label>Time Format</label>
                    <select
                    value={timeFormat}
                    onChange={(event)=>
                        setTimeFormat(event.target.value)
                }
                >
                    <option value = "12">12 Hour</option>
                    <option value = "24">24 Hour</option>
                    </select>
            </div>
                <div className="settingRow">
                    <label>Show Seconds</label>
                    <input
                    type="checkbox"
                    checked={showSeconds}
                   onChange={(event)=> setShowSeconds(event.target.checked)
                    
                    }
                    />
                        
                </div>

                <h2>Background</h2>
                <div className="backgroundGrid">
                    {backgrounds.map((image)=>(
                        <button 
                        key={image}
                        className={
                            background===image
                            ?"backgroundOption selected"
                            : "backgroundOption"
                        }
                        onClick={()=> setBackground(image)}
                        > 
                        <img 
                        src= {image} 
                        alt = "Background option"
                        />
                        </button>
                        
                    ))}
                </div>
                
                <div className="settingRow">
                    <label>Background Blur</label>

                    <input
                    type="range"
                    min="0"
                    max="40"
                    value={backgroundBlur}
                    onChange={(event)=>
                        setBackgroundBlur(Number(event.target.value))
                    }
                    />
                    <span>{backgroundBlur}px</span>
                </div>
            

        </div>



    );
}
export default Settings;