import movingCouple from "./couple_with_two_children_moving-1800-1200.webp"
import './App.css';
import ParallaxImage, { ParallaxImageProps } from "./components/ParallaxImage"

function App() {


  return (
    <div
      className="App"
      style={{ display: "flex", flexDirection: "column", minHeight: "175vh", justifyContent: "flex-start" }}>
      <p>Top of page</p>
      <ParallaxImage
        viewportHeight={600}
        height={1000}
        width={"100%"}
        src={movingCouple}
      />
      <p style={{ position: "absolute", top: "45%", left: "45%", backgroundColor: "rgba(0,0,0,0.5)", color: "white" }}>
        {`Hi I'm a test!`}
      </p>
      <p>bottom of page</p>
    </div>
  );
}

export default App;
