import AppClock from "./components/AppClock";
import SmartHome from "./components/SmartHome";
import Lightbulb from "./components/Lightbulb";

// TODO: add button to restart the simulation
function App() {
  return (
    <div>
      <h1>Smart Home Dashboard Simulator</h1>
      <h4>(refresh page to restart simulation)</h4>
      <AppClock />
      <SmartHome />
      <Lightbulb />
    </div>
  );
}

export default App;
