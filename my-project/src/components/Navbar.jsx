const Navbar = () => {
  return (
    <div
      className="flex justify-between
    "
    >
      <button>
        <img src="/src/assets/airbnb-logo.svg" alt="airbnb logo" />
      </button>

      <section className="flex items-center space-x-6">
        <p className="font-bold">Ready to AirBnb it?</p>
        <button className="rounded-full border border-black w-10 h-10 flex items-center justify-center">
          <img src="/src/assets/hamburger-menu.svg" className="w-4" />
        </button>
      </section>
    </div>
  );
};

export default Navbar;
