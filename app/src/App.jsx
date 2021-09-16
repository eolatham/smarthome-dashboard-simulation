import AppClock from "./AppClock";
import EventStream from "./EventStream";

// TODO: add button to restart the simulation
function App() {
  return (
    <div>
      <h1>Smart Home Dashboard Simulator</h1>
      <h4>(refresh page to restart simulation)</h4>
      <AppClock interval={10000} />
      <EventStream />
    </div>
  );
}

export default App;
