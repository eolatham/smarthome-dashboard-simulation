import AppClock from "./AppClock";
import SmartHome from "./SmartHome";

// TODO: add button to restart the simulation
function App() {
  return (
    <div>
      <h1>Smart Home Dashboard Simulator</h1>
      <h4>(refresh page to restart simulation)</h4>
      <AppClock interval={10000} />
      <SmartHome />
    </div>
  );
}

export default App;
