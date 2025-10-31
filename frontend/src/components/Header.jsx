import logo from "../../public/log.jpeg";

function Header() {
  return (
    <header className="flex items-center gap-3 p-4 bg-white shadow">
      <img
        src={logo}
        alt="CoachDesk Logo"
        className="w-12 h-12 rounded-full border border-gray-300"
      />
      <h1 className="text-2xl font-bold text-blue-700">CoachDesk</h1>
    </header>
  );
}

export default Header;
