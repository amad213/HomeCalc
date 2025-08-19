import React, { useState } from "react";

export default function BrickCalculatorUniversal() {
  const [length, setLength] = useState("");
  const [height, setHeight] = useState("");
  const [thickness, setThickness] = useState(1);
  const [brickLength, setBrickLength] = useState(7);
  const [brickHeight, setBrickHeight] = useState(2.5);
  const [brickWidth, setBrickWidth] = useState(3.5);
  const [mortarGap, setMortarGap] = useState(0.5);
  const [brickPrice, setBrickPrice] = useState(20);
  const [mortarCost, setMortarCost] = useState(0);
  const [waste, setWaste] = useState(5);
  const [laborCost, setLaborCost] = useState(0);

  // Calculations
  const wallArea = parseFloat(length || 0) * parseFloat(height || 0);
  const brickArea = (parseFloat(brickLength) / 12) * (parseFloat(brickHeight) / 12);
  const baseBricks = wallArea && brickArea ? Math.ceil((wallArea / brickArea) * thickness) : 0;
  const totalBricks = Math.ceil(baseBricks * (1 + parseFloat(waste) / 100));
  const totalMaterialCost = totalBricks * parseFloat(brickPrice || 0) + parseFloat(mortarCost || 0);
  const totalCostWithLabor = totalMaterialCost + parseFloat(laborCost || 0);

  const sectionClass = "mb-6 p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl";

  return (
    <div className=" w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 flex justify-center items-start  py-10 px-4">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-center mb-10 text-white drop-shadow-lg">
          Universal Brick Calculator
        </h1>

        {/* Wall Section */}
        <div className={sectionClass}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Wall Dimensions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Length (ft)</label>
              <input
                type="number"
                value={length}
                onChange={e => setLength(e.target.value)}
                placeholder="e.g., 20"
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Height (ft)</label>
              <input
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value)}
                placeholder="e.g., 10"
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Thickness (bricks)</label>
              <input
                type="number"
                value={thickness}
                onChange={e => setThickness(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Brick Section */}
        <div className={sectionClass}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Brick Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Length (inch)</label>
              <input
                type="number"
                value={brickLength}
                onChange={e => setBrickLength(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Height (inch)</label>
              <input
                type="number"
                value={brickHeight}
                onChange={e => setBrickHeight(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Width (inch)</label>
              <input
                type="number"
                value={brickWidth}
                onChange={e => setBrickWidth(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Mortar Gap (inch)</label>
              <input
                type="number"
                value={mortarGap}
                onChange={e => setMortarGap(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>
        </div>

        {/* Costs Section */}
        <div className={sectionClass}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Costs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Brick Price/unit (PKR)</label>
              <input
                type="number"
                value={brickPrice}
                onChange={e => setBrickPrice(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Mortar Cost/unit (PKR)</label>
              <input
                type="number"
                value={mortarCost}
                onChange={e => setMortarCost(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Waste Factor (%)</label>
              <input
                type="number"
                value={waste}
                onChange={e => setWaste(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Labor Cost (PKR)</label>
              <input
                type="number"
                value={laborCost}
                onChange={e => setLaborCost(e.target.value)}
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="mb-6 p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-inner">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Results</h2>
          <p className="text-lg">Total Bricks Needed: <strong>{totalBricks}</strong></p>
          <p className="text-lg">Total Material Cost: <strong>PKR {totalMaterialCost}</strong></p>
          <p className="text-lg">Total Cost with Labor: <strong>PKR {totalCostWithLabor}</strong></p>
        </div>

        <button
          onClick={() => window.print()}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Print / Export
        </button>
      </div>
    </div>
  );
}
