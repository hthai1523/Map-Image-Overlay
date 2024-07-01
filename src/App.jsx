import React, { useState } from "react";
import "./App.css";
import Map from "./components/Map";
import mainImage from "./assets/anhmap.jpg";
import SearchBox from "./components/SearchBox";

function App() {
  const [opacity, setOpacity] = useState(1);

  const handleChangeOpacity = (value) => {
    setOpacity(value);
  };

  return (
    <div className="relative w-screen h-screen">
      <input
        type="range"
        className="absolute top-3 right-3 z-[999999] "
        min={0}
        max={1}
        step={0.01}
        onChange={(e) => handleChangeOpacity(e.target.value)}
      />
      <Map opacity={opacity} image={mainImage} />
      <SearchBox />
    </div>
  );
}

export default App;
