import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import movingCouple from "./couple_with_two_children_moving-1800-1200.webp"
import './App.css';
import ParallaxImage, { ParallaxImageProps } from "./components/ParallaxImage"

function App() {


  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", minHeight: "500vh", justifyContent: "center" }}>

      <header className="App-header">

        <div style={{position:"relative"}}>
          <ParallaxImage
            viewportHeight={300}
            height={800}
            width={"100%"}
            src={movingCouple}
          />
          <p style={{position: "absolute", top:"45%", left: "45%", backgroundColor: "rgba(0,0,0,0.5)", color: "white"}}>
            {`Hi I'm a test!`}
          </p>
        </div>

      </header>
    </div>
  );
}

export default App;
