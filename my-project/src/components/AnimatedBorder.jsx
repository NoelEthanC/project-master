/* eslint-disable react/prop-types */
const AnimatedBorder = ({ children }) => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-200 py-10 max-w-5xl mx-auto">
      <div className="card-wrapper h-[200px]  w-[200px] ">
        <div className=" card-content flex items-center justify-center text-xs text-white text-center ">
          Subscribe Today
        </div>
        {children}
      </div>
      {/* <Airbnb /> */}
    </div>
  );
};

export default AnimatedBorder;
