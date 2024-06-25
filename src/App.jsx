import React, { useState } from "react";
import "./App.css";
import Map from "./components/Map";
import mainImage from "./assets/mainImage.jpg"; 

function App() {
  const [opacity, setOpacity] = useState(1);

  const handleChangeOpacity = (value) => {
    setOpacity(value);
  };

  return (
    <div className="container">
      <input
        type="range"
        className="input"
        min={0}
        max={1}
        step={0.01}
        onChange={(e) => handleChangeOpacity(e.target.value)}
      />
      <Map opacity={opacity} image={mainImage} />
    </div>
  );
}

export default App;
