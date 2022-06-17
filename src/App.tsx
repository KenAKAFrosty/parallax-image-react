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
          containerRef={containerRef}
          containerStyle={{
            boxShadow: "inset 0px 0px 7px rgba(0,0,0,0.7)",
            borderRadius: 6,
            overflow: "auto"
          }}
          src={logo}
          height={500}
          className="App-logo"
          alt="logo"
          style={{}}
        />

      </header>
    </div>
  );
}

export default App;
