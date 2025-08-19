export default function Header() {
  return (
    <header className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide">🏗️ HomeCalc</h1>

        {/* Nav Links */}
        <nav className="hidden md:flex space-x-8 font-medium">
          <a href="#home" className="hover:text-yellow-300 transition">Home</a>
          <a href="#calculators" className="hover:text-yellow-300 transition">Calculators</a>
          <a href="#about" className="hover:text-yellow-300 transition">About</a>
          <a href="#contact" className="hover:text-yellow-300 transition">Contact</a>
        </nav>

        {/* Mobile Menu (future: add hamburger here if needed) */}
      </div>
    </header>
  );
}
