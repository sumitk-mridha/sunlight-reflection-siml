import { useState, useRef, useEffect, useCallback } from 'react';

import './App.scss';

const EARTH_ROTATION_UNITS = 8760;

function App() {
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const HOURS = ["12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"];
  const orbitRef = useRef(null);
  const earthRotationRef = useRef(null);
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(0);
  const [earthCoords, setEarthCoords] = useState({top:0, left:0});
  const [horzPos, setHorzPos] = useState(0);
  const [vertPos, setVertPos] = useState(0);
  const [horzRad, setHorzRad] = useState(0);
  const [vertRad, setVertRad] = useState(0);

  const getDays = useCallback((mnth=undefined) => {
    let temp = Number(month)
    if(mnth !== undefined) temp = mnth;
    if([3,5,8,10].includes(temp))
      return 30;
    if(temp===1)
      return 28;
    else
      return 31;

  }, [month]);

  const setEarthCoordsFunc = useCallback((width, height, theta) => {
    theta = (2*Math.PI*theta)/EARTH_ROTATION_UNITS;
    setEarthCoords({
      top: height/2 + height*0.45*Math.sin(theta),
      left: width/2 + width*0.45*Math.cos(theta)
    });
  }, []);

  const updateOrbitSize = useCallback(() => {
    if (orbitRef.current) {
      const width = orbitRef.current.clientWidth;
      const height = orbitRef.current.clientHeight;
      setHorzPos(width/2);
      setVertPos(height/2);
      setHorzRad(width*0.45);
      setVertRad(height*0.45);
    }
  }, []);

  useEffect(() => {
    updateOrbitSize();
    setMonth(0);
    //setEarthCoordsFunc(orbitRef.current.clientWidth, orbitRef.current.clientHeight, 0);
    window.addEventListener('resize', updateOrbitSize);
    return () => {
      window.removeEventListener('resize', updateOrbitSize);
      clearInterval(earthRotationRef.current);
      earthRotationRef.current = null;
    };
  }, [updateOrbitSize, setEarthCoordsFunc]);

  useEffect(() => {
    setDay(1);
    setHour(0);
  }, [month]);

  useEffect(() => {
    let totalDays = 0;
    for(let i=0; i<month; i++) totalDays += getDays(i);
    totalDays += Number(day);
    setEarthCoordsFunc(orbitRef.current.clientWidth, orbitRef.current.clientHeight, (totalDays-1)*24+Number(hour));
    console.log(month,day,hour)
  },[month, day, hour, getDays, setEarthCoordsFunc]);
  
  return (
    <div className="App">
      <div className='screen'>
        <img src={"sun-svgrepo-com.svg"} alt="sun" className='sun-image' />
        <svg width="100%" height="100%" ref={orbitRef}>
          <ellipse cx={horzPos} cy={vertPos} rx={horzRad} ry={vertRad} style={{fill:"none",stroke:"black",strokeWidth:0.5}} />
        </svg>
        <img src={"planet-earth-global-svgrepo-com.svg"} alt="earth" className='earth-image' style={earthCoords} />
        <div style={{top:1, left:1, display: 'flex', gap: "3px"}}>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {MONTHS.map((mnth, i) => (
              <option key={i} value={i}>{mnth}</option>
            ))}
          </select>
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            {(new Array(getDays())).fill(null).map((v,i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
        </div>
        <select value={hour} onChange={e => setHour(e.target.value)} style={{top:1, right: 1}}>
          {HOURS.map((str, i) => (
            <option key={i} value={i}>{str}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default App;
