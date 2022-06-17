import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import ParallaxImage, { ParallaxImageProps } from "./components/ParallaxImage"

function App() {
  const containerRef = useRef<HTMLDivElement>(null);


  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", minHeight: "150vh", justifyContent: "center" }}>

      <header className="App-header">

        <ParallaxImage
        viewportHeight={500}
          containerRef={containerRef}
          containerStyle={{
            boxShadow: "inset 0px 0px 7px rgba(0,0,0,0.7)",
            borderRadius: 6,
            height: "800px"
          }}
          height={750}
          src={logo}
          className="App-logo"
          alt="logo"
        />

      </header>
    </div>
  );
}

export default App;
