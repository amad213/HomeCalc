import React, { useState } from "react";

// -------------------- UNIT CONVERSIONS --------------------
const unitFactors = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
};

const toMeters = (value, unit) => {
  if (!value) return 0;
  if (unit === "ft-in") {
    const [ft, inch] = value.split("'").map((v) => parseFloat(v) || 0);
    return ft * 0.3048 + inch * 0.0254;
  }
  if (unit === "m-cm") {
    const [m, cm] = value.split("+").map((v) => parseFloat(v) || 0);
    return m + cm * 0.01;
  }
  return (parseFloat(value) || 0) * unitFactors[unit];
};

const fromMeters = (meters, unit) => {
  if (!meters) return "";
  if (unit === "ft-in") {
    const ft = Math.floor(meters / 0.3048);
    const inch = ((meters % 0.3048) / 0.0254).toFixed(2);
    return `${ft}' ${inch}"`;
  }
  if (unit === "m-cm") {
    const m = Math.floor(meters);
    const cm = ((meters % 1) / 0.01).toFixed(1);
    return `${m}m + ${cm}cm`;
  }
  return (meters / unitFactors[unit]).toFixed(3);
};

// -------------------- INPUT WITH UNITS --------------------
function InputWithUnit({ label, value, setValue, unit, setUnit }) {
  const handleUnitChange = (newUnit) => {
    const meters = toMeters(value, unit);
    setValue(fromMeters(meters, newUnit));
    setUnit(newUnit);
  };

  return (
    <div className="mb-4 w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
          className="flex-1 px-3 py-2 text-gray-800 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />

        {/* Dropdown */}
        <select
          value={unit}
          onChange={(e) => handleUnitChange(e.target.value)}
          className="px-3 py-2 border  rounded-lg shadow-sm w-28 text-sm"
        >
          <option value="mm">mm</option>
          <option value="cm">cm</option>
          <option value="m">m</option>
          <option value="in">in</option>
          <option value="ft">ft</option>
          <option value="yd">yd</option>
          <option value="ft-in">ft/in</option>
          <option value="m-cm">m+cm</option>
        </select>
      </div>
    </div>
  );
}


// -------------------- MAIN CALCULATOR --------------------
export default function BrickCalculatorUniversal() {
  // Wall
  const [length, setLength] = useState("20");
  const [lengthUnit, setLengthUnit] = useState("ft");
  const [height, setHeight] = useState("10");
  const [heightUnit, setHeightUnit] = useState("ft");
  const [thickness, setThickness] = useState(1);

  // Bricks
  const [brickLength, setBrickLength] = useState("7");
  const [brickHeight, setBrickHeight] = useState("2.5");
  const [brickWidth, setBrickWidth] = useState("3.5");
  const [brickUnit, setBrickUnit] = useState("in");
  const [mortarGap, setMortarGap] = useState("0.5");

  // Costs
  const [brickPrice, setBrickPrice] = useState(20);
  const [mortarCost, setMortarCost] = useState(0);
  const [waste, setWaste] = useState(5);
  const [laborCost, setLaborCost] = useState(0);

  // -------------------- CALCULATIONS --------------------
  const wallLengthM = toMeters(length, lengthUnit);
  const wallHeightM = toMeters(height, heightUnit);
  const wallArea = wallLengthM * wallHeightM;

  const brickLengthM = toMeters(brickLength, brickUnit);
  const brickHeightM = toMeters(brickHeight, brickUnit);
  const brickArea = brickLengthM * brickHeightM;

  const baseBricks =
    wallArea && brickArea ? Math.ceil((wallArea / brickArea) * thickness) : 0;
  const totalBricks = Math.ceil(baseBricks * (1 + parseFloat(waste) / 100));
  const totalMaterialCost =
    totalBricks * parseFloat(brickPrice || 0) + parseFloat(mortarCost || 0);
  const totalCostWithLabor = totalMaterialCost + parseFloat(laborCost || 0);

  const sectionClass =
    "mb-6 p-4 sm:p-5 bg-white rounded-2xl shadow-md border border-gray-200";

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 flex justify-center items-start py-4 px-3">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-indigo-800 drop-shadow-sm">
          🧱 Universal Brick Calculator
        </h1>

        {/* Wall Section */}
        <div className={sectionClass}>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Wall Dimensions
          </h2>
          <InputWithUnit
            label="Wall Length"
            value={length}
            setValue={setLength}
            unit={lengthUnit}
            setUnit={setLengthUnit}
          />
          <InputWithUnit
            label="Wall Height"
            value={height}
            setValue={setHeight}
            unit={heightUnit}
            setUnit={setHeightUnit}
          />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Thickness (bricks)
            </label>
            <input
              type="number"
              value={thickness}
              onChange={(e) => setThickness(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>
        </div>

        {/* Brick Section */}
        <div className={sectionClass}>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Brick Details
          </h2>
          <InputWithUnit
            label="Brick Length"
            value={brickLength}
            setValue={setBrickLength}
            unit={brickUnit}
            setUnit={setBrickUnit}
          />
          <InputWithUnit
            label="Brick Height"
            value={brickHeight}
            setValue={setBrickHeight}
            unit={brickUnit}
            setUnit={setBrickUnit}
          />
          <InputWithUnit
            label="Brick Width"
            value={brickWidth}
            setValue={setBrickWidth}
            unit={brickUnit}
            setUnit={setBrickUnit}
          />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mortar Gap (inch)
            </label>
            <input
              type="number"
              value={mortarGap}
              onChange={(e) => setMortarGap(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 text-sm"
            />
          </div>
        </div>

        {/* Costs Section */}
        <div className={sectionClass}>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Costs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brick Price / unit (PKR)
              </label>
              <input
                type="number"
                value={brickPrice}
                onChange={(e) => setBrickPrice(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mortar Cost (PKR)
              </label>
              <input
                type="number"
                value={mortarCost}
                onChange={(e) => setMortarCost(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Waste Factor (%)
              </label>
              <input
                type="number"
                value={waste}
                onChange={(e) => setWaste(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Labor Cost (PKR)
              </label>
              <input
                type="number"
                value={laborCost}
                onChange={(e) => setLaborCost(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-400 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 p-4 bg-green-100 rounded-2xl shadow-inner border border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">
            📊 Results
          </h2>
          <p className="text-sm sm:text-base text-gray-700">
            Total Bricks Needed: <strong>{totalBricks}</strong>
          </p>
          <p className="text-sm sm:text-base text-gray-700">
            Total Material Cost: <strong>PKR {totalMaterialCost}</strong>
          </p>
          <p className="text-sm sm:text-base text-gray-700">
            Total Cost with Labor: <strong>PKR {totalCostWithLabor}</strong>
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg text-sm"
        >
          Print / Export
        </button>
      </div>
    </div>
  );
}
