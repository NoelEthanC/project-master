/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Airbnb from "./components/Airbnb";
import AnimatedBorder from "./components/AnimatedBorder";
import clsx from "clsx";

function App() {
  const [g1, setG1] = useState(0);
  const [g2, setG2] = useState(0);

  useEffect(() => {}, [g1, g2]);

  const calculate = () => {
    const gradeSum = g1 + g2;
    const x = gradeSum / 140;
    const percentage = x * 100;
    console.log(percentage);
    return percentage;
  };
  return (
    <div className="bg-gray-300 p-10  h-screen">
      {/* <Airbnb /> */}
      <div className="">
        {/* <form
          
          onSubmit={calculate}
          className="flex flex-col max-w-xl space-y-6  "
        > */}
        <div className="">
          <label>Grade 1</label>
          <input
            value={g1}
            onChange={(e) => setG1(e.target.value)}
            type="text"
            name="p1-grade"
            id=""
            className="p-4"
          />
        </div>

        <div className="">
          <label>Grade 2</label>
          <input
            value={g2}
            type="text"
            name="p2-grade"
            id=""
            onChange={(e) => setG2(e.target.value)}
            className="p-4"
            onBlur={calculate}
          />
        </div>

        <button
          type="submit"
          onClick={calculate}
          className="bg-indigo-900 p-3 text-white"
        >
          Calculate
        </button>
        {/* </form> */}

        <p className="text-xl">The Final Grade is: {calculate()}</p>
      </div>
    </div>
  );
}

export default App;
