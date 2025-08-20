import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold tracking-wide">
          <img src="/Logo.png" alt="HomeCalc Logo" className="h-1  w-auto object-contain" />
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 font-medium">
          <a href="#home" className="hover:text-yellow-300 transition">Home</a>
          <a href="#calculators" className="hover:text-yellow-300 transition">Calculators</a>
          <a href="#about" className="hover:text-yellow-300 transition">About</a>
          <a href="#contact" className="hover:text-yellow-300 transition">Contact</a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col space-y-1 focus:outline-none"
        >
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-gray-700 px-6 py-4 space-y-3">
          <a href="#home" className="block hover:text-yellow-300 transition">Home</a>
          <a href="#calculators" className="block hover:text-yellow-300 transition">Calculators</a>
          <a href="#about" className="block hover:text-yellow-300 transition">About</a>
          <a href="#contact" className="block hover:text-yellow-300 transition">Contact</a>
        </div>
      )}
    </header>
  );
}
