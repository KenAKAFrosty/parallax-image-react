import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import movingCouple from "./couple_with_two_children_moving-1800-1200.webp"
import './App.css';
import ParallaxImage, { ParallaxImageProps } from "./components/ParallaxImage"

function App() {


  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", minHeight: "500vh", justifyContent: "flex-start" }}>

      <header className="App-header">

        <ParallaxImage
          width={"100%"}
          src={movingCouple}
        />

      </header>
    </div>
  );
}

export default App;
