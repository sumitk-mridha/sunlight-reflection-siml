import { useState, useRef, useEffect, useCallback } from 'react';

import './App.scss';

const EARTH_ROTATION_UNITS = 8766;

function App() {
  const orbitRef = useRef(null);
  const earthRotationRef = useRef(null);
  const [earthCoords, setEarthCoords] = useState({top:0, left:0});
  const [horzPos, setHorzPos] = useState(0);
  const [vertPos, setVertPos] = useState(0);
  const [horzRad, setHorzRad] = useState(0);
  const [vertRad, setVertRad] = useState(0);

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
    let theta = 0;
    earthRotationRef.current = setInterval(() => {
      setEarthCoordsFunc(orbitRef.current.clientWidth, orbitRef.current.clientHeight, theta);
      theta = theta===EARTH_ROTATION_UNITS-1?0:theta+1;
    }, 10);
    window.addEventListener('resize', updateOrbitSize);
    return () => {
      window.removeEventListener('resize', updateOrbitSize);
      clearInterval(earthRotationRef.current);
      earthRotationRef.current = null;
    };
  }, [updateOrbitSize, setEarthCoordsFunc]);
  return (
    <div className="App">
      <div className='screen'>
        <img src={"sun-svgrepo-com.svg"} alt="sun" className='sun-image' />
        <svg width="100%" height="100%" ref={orbitRef}>
          <ellipse cx={horzPos} cy={vertPos} rx={horzRad} ry={vertRad} style={{fill:"none",stroke:"black",strokeWidth:0.5}} />
        </svg>
        <img src={"planet-earth-global-svgrepo-com.svg"} alt="earth" className='earth-image' style={earthCoords} />
      </div>
    </div>
  );
}

export default App;
