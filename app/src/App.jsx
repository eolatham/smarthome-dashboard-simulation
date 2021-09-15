import "./App.css";

const EVENT_SOURCE = new EventSource("http://localhost:5000/events");
EVENT_SOURCE.addEventListener(
  "event",
  function (event) {
    var data = JSON.parse(event.data);
    console.log("Received event with data:", data);
  },
  false
);
EVENT_SOURCE.addEventListener(
  "error",
  function (event) {
    console.log("Error: " + event);
    alert("Failed to connect to event stream. Is Redis running?");
  },
  false
);

// TODO: load events into App state and display them
function App() {
  return (
    <div className="App">
      <header className="App-header">Smart Home Dashboard Simulator</header>
    </div>
  );
}

export default App;
