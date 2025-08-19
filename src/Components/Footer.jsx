export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white">🏗️ BuildCalc</h2>
          <p className="mt-2 text-sm">
            Free online construction calculators for bricks, tiles, paint, concrete, and more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#calculators" className="hover:text-yellow-300 transition">Calculators</a></li>
            <li><a href="#about" className="hover:text-yellow-300 transition">About Us</a></li>
            <li><a href="#contact" className="hover:text-yellow-300 transition">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <p className="text-sm">📧 HomeCalc@gmail.com</p>
          <p className="text-sm">📞 +92 3471972928</p>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-6 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} BuildCalc. All Rights Reserved.
      </div>
    </footer>
  );
}
