import { useState } from "react";
import Counter from "./components/Counter";
import "./App.css";

function App() {
  const [countVal, setCountVal] = useState(0);

  const increase = () => {
    setCountVal(countVal + 1);
  };

  const deccrease = () => {
    if (countVal > 0) {
      setCountVal(countVal - 1);
    }
  };

  return (
    <>
      <div className="container">
        <div className="increase-counter" onClick={increase}>
          <button>Increase</button>
        </div>
        <div className="decrease-counter" onClick={deccrease}>
          <button>Decrease</button>
        </div>
      </div>
      <div className="value">
        <h1> COUNT : {countVal}</h1>
      </div>
    </>
  );
}

export default App;
