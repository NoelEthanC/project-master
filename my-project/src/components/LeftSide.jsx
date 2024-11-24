import Navbar from "./Navbar";

const LeftSide = () => {
  return (
    <div className="basis-3/6 pl-10 pr-4 pt-2 ">
      <Navbar />
      <section className="mt-24">
        <h1 className="text-[#FF5A5F] text-6xl my-6  font-semibold">
          Airbnb it.
        </h1>
        <h2 className="text-2xl font-semibold my-3">
          You could earn
          <span className="text-4xl font-bold block my-2">$1,260</span>
        </h2>
        <h3 className="text-gray-700">
          <span className="font-bold underline text-black">7 nights</span> at an
          estimated $180 a night
        </h3>
      </section>

      <section className=""></section>
    </div>
  );
};

export default LeftSide;
