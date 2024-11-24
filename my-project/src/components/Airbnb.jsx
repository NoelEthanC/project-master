/* eslint-disable no-unused-vars */
import LeftSide from "./LeftSide";
import RightImage from "./RightImage";

const Airbnb = (className) => {
  return (
    // card wrapper with before element
    <div className="card-wrapper  mx-auto max-w-5xl  h-full w-full">
      {/* content card */}
      <div className="w-[calc(100%-2px)] h-[calc(100%-2px)] bg-white p-5 rounded-3xl absolute top-[1px] left-[1px] ">
        <div className="w-full h-full flex  ">
          <LeftSide />
          <RightImage />
        </div>
      </div>
    </div>
  );
};

export default Airbnb;
