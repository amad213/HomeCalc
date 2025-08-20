export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 pt-[100px] border-b-4 border-black border-solid text-white py-20  flex flex-col justify-center items-center">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg">
          Build Smarter. Estimate Faster.
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-gray-100">
          Free online construction calculators for bricks, tiles, paint, concrete, and more. 
          Save time, avoid mistakes, and plan your projects with confidence.
        </p>

        {/* CTA Button */}
        <div className="mt-8">
          <a 
            href="#calculators"
            className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition duration-300"
          >
            🚀 Get Started
          </a>
        </div>

        {/* Calculator Grid */}
        <div id="calculators" className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Brick Calculator */}
          <a 
            href="/brick-calculator"
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition transform duration-300"
          >
            <h3 className="text-2xl font-bold text-gray-900">🧱 Brick</h3>
            <p className="mt-2 text-gray-700 text-sm">Estimate bricks for walls & structures.</p>
          </a>

          {/* Paint Calculator */}
          <a 
            href="/paint-calculator"
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition transform duration-300"
          >
            <h3 className="text-2xl font-bold text-gray-900">🎨 Paint</h3>
            <p className="mt-2 text-gray-700 text-sm">Find out how much paint you’ll need.</p>
          </a>

          {/* Tile Calculator */}
          <a 
            href="/tile-calculator"
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition transform duration-300"
          >
            <h3 className="text-2xl font-bold text-gray-900">🏠 Tiles</h3>
            <p className="mt-2 text-gray-700 text-sm">Calculate tiles for any space easily.</p>
          </a>

          {/* Concrete Calculator */}
          <a 
            href="/concrete-calculator"
            className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition transform duration-300"
          >
            <h3 className="text-2xl font-bold text-gray-900">🧪 Concrete</h3>
            <p className="mt-2 text-gray-700 text-sm">Estimate volume & mix for concrete work.</p>
          </a>
        </div>
      </div>
    </section>
  );
}
