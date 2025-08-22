import React, { useState, useMemo, useEffect } from 'react';

const Calculator = () => {
  const UNIT_FACTORS_TO_M = {
    m: 1,
    cm: 0.01,
    mm: 0.001,
    in: 0.0254,
    ft: 0.3048,
  };

  const PRESETS = {
    imperial: { label: "Imperial 9×4.5×3 in", l: 9, w: 4.5, h: 3, unit: "in" },
    modular: { label: "Modular 190×90×90 mm", l: 190, w: 90, h: 90, unit: "mm" },
  };

  const [walls, setWalls] = useState([
    { id: 1, length: 62, lengthUnit: "ft", height: 12, heightUnit: "ft", thicknessFt: 0.75 }
  ]);
  const [brickPreset, setBrickPreset] = useState("imperial");
  const [brickUnit, setBrickUnit] = useState("in");
  const [brickL, setBrickL] = useState(9);
  const [brickW, setBrickW] = useState(4.5);
  const [brickH, setBrickH] = useState(3);
  const [includeMortar, setIncludeMortar] = useState(true);
  const [jointIn, setJointIn] = useState(0.375);
  const [jointUnit, setJointUnit] = useState("in");
  const [method, setMethod] = useState("volume");
  const [wastePct, setWastePct] = useState(5);
  const [pricePerBrick, setPricePerBrick] = useState("");
  const [laborPerThousand, setLaborPerThousand] = useState("");
  const [mortarPerThousandCFT, setMortarPerThousandCFT] = useState(13.5);
  const [useThumbMortarRule, setUseThumbMortarRule] = useState(true);

  // Utility functions
  const toMeters = (value, unit) => {
    return (Number(value) || 0) * (UNIT_FACTORS_TO_M[unit] ?? 1);
  };

  const formatNumber = (n) => {
    return n === null || n === undefined ? "—" : Number(n).toLocaleString();
  };

  const formatCurrency = (n) => {
    return n === null || n === undefined ? "—" : "$" + Number(n).toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  // Wall management
  const addWall = () => {
    const newWall = {
      id: Date.now(),
      length: 10,
      lengthUnit: "ft",
      height: 8,
      heightUnit: "ft",
      thicknessFt: 0.75
    };
    setWalls([...walls, newWall]);
  };

  const removeWall = (id) => {
    if (walls.length > 1) {
      setWalls(walls.filter(w => w.id !== id));
    }
  };

  const updateWall = (id, patch) => {
    setWalls(walls.map(w => w.id === id ? { ...w, ...patch } : w));
  };

  const applyPreset = (key) => {
    if (PRESETS[key]) {
      const p = PRESETS[key];
      setBrickPreset(key);
      setBrickUnit(p.unit);
      setBrickL(p.l);
      setBrickW(p.w);
      setBrickH(p.h);
    }
  };

  const resetToExample = () => {
    setWalls([{ id: Date.now(), length: 62, lengthUnit: "ft", height: 12, heightUnit: "ft", thicknessFt: 0.75 }]);
  };

  const resetAll = () => {
    setWalls([{ id: Date.now(), length: 62, lengthUnit: "ft", height: 12, heightUnit: "ft", thicknessFt: 0.75 }]);
    setBrickPreset("imperial");
    setBrickUnit("in");
    setBrickL(9);
    setBrickW(4.5);
    setBrickH(3);
    setIncludeMortar(true);
    setJointIn(0.375);
    setJointUnit("in");
    setMethod("volume");
    setWastePct(5);
    setPricePerBrick("");
    setLaborPerThousand("");
    setMortarPerThousandCFT(13.5);
    setUseThumbMortarRule(true);
  };

  // CSV Export
  const exportCSV = () => {
    const results = calculateResults();
    const headers = [
      "Method",
      "Bricks (incl waste)",
      "Wall area m2",
      "Wall volume m3",
      "Brick module L (m)",
      "Brick module W (m)",
      "Brick module H (m)",
      "Mortar cft (thumb rule)",
    ];
    const row = [
      "Area",
      results.totals.areaCount,
      results.totalsDetailed.totalArea_m2.toFixed(3),
      results.totalsDetailed.totalVolume_m3.toFixed(3),
      results.totalsDetailed.moduleDims.moduleL_m.toFixed(4),
      results.totalsDetailed.moduleDims.moduleW_m.toFixed(4),
      results.totalsDetailed.moduleDims.moduleH_m.toFixed(4),
      results.mortar.mortarCFT !== null ? results.mortar.mortarCFT.toFixed(3) : "",
    ];
    const csv = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brick_estimate.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculation
  const calculateResults = () => {
    const brickL_m = toMeters(brickL, brickUnit);
    const brickW_m = toMeters(brickW, brickUnit);
    const brickH_m = toMeters(brickH, brickUnit);
    const joint_m = toMeters(jointIn, jointUnit);

    const moduleL_m = brickL_m + (includeMortar ? joint_m : 0);
    const moduleH_m = brickH_m + (includeMortar ? joint_m : 0);
    const moduleW_m = brickW_m + (includeMortar ? joint_m : 0);

    const solidBrickVol_m3 = brickL_m * brickW_m * brickH_m;
    const moduleBrickVol_m3 = moduleL_m * moduleW_m * moduleH_m;

    let totalBricksAreaMethod = 0;
    let totalBricksVolumeMethod = 0;
    let totalBricksThumbMethod = 0;
    let totalArea_m2 = 0;
    let totalVolume_m3 = 0;

    for (const w of walls) {
      const Lm = toMeters(w.length, w.lengthUnit);
      const Hm = toMeters(w.height, w.heightUnit);
      const thickness_m = w.thicknessFt * UNIT_FACTORS_TO_M["ft"];
      const area_m2 = Lm * Hm;
      const volume_m3 = area_m2 * thickness_m;

      totalArea_m2 += area_m2;
      totalVolume_m3 += volume_m3;

      const brickFace_m2 = moduleL_m * moduleH_m;
      const bricks_area = brickFace_m2 > 0 ? (area_m2 / brickFace_m2) : 0;
      totalBricksAreaMethod += bricks_area * (thickness_m / moduleW_m);

      const bricks_volume = moduleBrickVol_m3 > 0 ? (volume_m3 / moduleBrickVol_m3) : 0;
      totalBricksVolumeMethod += bricks_volume;

      const wallVol_cft = volume_m3 / 0.0283168466;
      const bricks_thumb = wallVol_cft > 0 ? (wallVol_cft / mortarPerThousandCFT) * 1000 : 0;
      totalBricksThumbMethod += bricks_thumb;
    }

    const addWaste = (n) => Math.ceil(n * (1 + (Number(wastePct || 0) / 100)));
    const areaCount = addWaste(totalBricksAreaMethod);
    const volumeCount = addWaste(totalBricksVolumeMethod);
    const thumbCount = addWaste(totalBricksThumbMethod);

    const bricksUsed = method === "area" ? areaCount : method === "thumb" ? thumbCount : volumeCount;
    const costBricks = pricePerBrick ? bricksUsed * Number(pricePerBrick) : null;
    const laborCost = laborPerThousand ? (bricksUsed / 1000) * Number(laborPerThousand) : null;
    const totalCost = (costBricks ?? 0) + (laborCost ?? 0);

    const mortarCFT = useThumbMortarRule ? (bricksUsed / 1000) * Number(mortarPerThousandCFT) : null;
    const mortarM3 = mortarCFT !== null ? mortarCFT * 0.0283168466 : null;

    return {
      totals: { areaCount, volumeCount, thumbCount, bricksUsed },
      totalsDetailed: { 
        totalArea_m2, 
        totalVolume_m3, 
        solidBrickVol_m3, 
        moduleBrickVol_m3, 
        moduleDims: { moduleL_m, moduleW_m, moduleH_m } 
      },
      costs: { costBricks, laborCost, totalCost },
      mortar: { mortarCFT, mortarM3 }
    };
  };

  const results = useMemo(calculateResults, [
    walls,
    brickL,
    brickW,
    brickH,
    brickUnit,
    includeMortar,
    jointIn,
    jointUnit,
    method,
    wastePct,
    pricePerBrick,
    laborPerThousand,
    mortarPerThousandCFT,
    useThumbMortarRule,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-6 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🧱 Universal Brick Calculator
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto">
            Professional construction calculator for accurate brick estimation, cost analysis, and project planning
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-600">3 Methods</div>
            <div className="text-gray-600">Volume, Area & Thumb Rule</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">Cost Analysis</div>
            <div className="text-gray-600">Materials & Labor</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-yellow-600">CSV Export</div>
            <div className="text-gray-600">Professional Reports</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Controls */}
        <div className="space-y-6">
          {/* Walls Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
                Wall Dimensions
              </h2>
              <span className="text-sm text-gray-500">Multiple walls supported</span>
            </div>
            
            <div>
              {walls.map((w, i) => (
                <div key={w.id} className="border border-gray-200 rounded-xl p-4 mb-3 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-medium text-gray-700">Wall #{i + 1}</div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateWall(w.id, { length: 0, height: 0 })}
                        className="text-xs px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-200"
                      >
                        Reset
                      </button>
                      {walls.length > 1 && (
                        <button 
                          onClick={() => removeWall(w.id)}
                          className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Length</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={w.length}
                          onChange={(e) => updateWall(w.id, { length: e.target.value })}
                          className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <select
                          value={w.lengthUnit}
                          onChange={(e) => updateWall(w.id, { lengthUnit: e.target.value })}
                          className="border border-gray-300 rounded-lg p-2 w-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="ft">ft</option>
                          <option value="m">m</option>
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Height</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={w.height}
                          onChange={(e) => updateWall(w.id, { height: e.target.value })}
                          className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <select
                          value={w.heightUnit}
                          onChange={(e) => updateWall(w.id, { heightUnit: e.target.value })}
                          className="border border-gray-300 rounded-lg p-2 w-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="ft">ft</option>
                          <option value="m">m</option>
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Thickness (ft)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={w.thicknessFt}
                        onChange={(e) => updateWall(w.id, { thicknessFt: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="text-xs text-gray-500 mt-1">Examples: 0.375 (4.5 in), 0.75 (9 in), 1.125 (13.5 in)</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button 
                onClick={addWall}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors flex items-center"
              >
                <span className="text-lg mr-2">+</span> Add Wall
              </button>
              <button 
                onClick={resetToExample}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset Example
              </button>
            </div>
          </div>

          {/* Brick Settings */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
                Brick Specifications
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preset</label>
                <select 
                  value={brickPreset}
                  onChange={(e) => applyPreset(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="imperial">Imperial 9×4.5×3 in</option>
                  <option value="modular">Modular 190×90×90 mm</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
                <select 
                  value={brickUnit}
                  onChange={(e) => setBrickUnit(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="in">inches</option>
                  <option value="mm">millimeters</option>
                  <option value="cm">centimeters</option>
                  <option value="m">meters</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                <input 
                  type="number"
                  value={brickL}
                  onChange={(e) => setBrickL(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                <input 
                  type="number"
                  value={brickW}
                  onChange={(e) => setBrickW(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <input 
                  type="number"
                  value={brickH}
                  onChange={(e) => setBrickH(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox"
                    checked={includeMortar}
                    onChange={() => setIncludeMortar(!includeMortar)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Include mortar joints</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joint thickness</label>
                <div className="flex gap-2">
                  <input 
                    type="number"
                    value={jointIn}
                    onChange={(e) => setJointIn(Number(e.target.value))}
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select 
                    value={jointUnit}
                    onChange={(e) => setJointUnit(e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-20"
                  >
                    <option value="in">in</option>
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Options & Costs */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
                Options & Costs
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calculation Method</label>
                <select 
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="volume">Volume (Recommended)</option>
                  <option value="area">Area Method</option>
                  <option value="thumb">Thumb Rule</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Waste Percentage</label>
                <input 
                  type="number"
                  value={wastePct}
                  onChange={(e) => setWastePct(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Brick ($)</label>
                <input 
                  type="number"
                  value={pricePerBrick}
                  onChange={(e) => setPricePerBrick(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Labor per 1000 ($)</label>
                <input 
                  type="number"
                  value={laborPerThousand}
                  onChange={(e) => setLaborPerThousand(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="flex items-center space-x-2 mb-2">
                <input 
                  type="checkbox"
                  checked={useThumbMortarRule}
                  onChange={() => setUseThumbMortarRule(!useThumbMortarRule)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Use mortar thumb rule</span>
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="number"
                  value={mortarPerThousandCFT}
                  onChange={(e) => setMortarPerThousandCFT(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32"
                />
                <span className="text-sm text-gray-500">cft per 1000 bricks</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={exportCSV}
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors flex-1"
              >
                📊 Export CSV
              </button>
              <button 
                onClick={resetAll}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                🔄 Reset All
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Results */}
        <div className="space-y-6">
          {/* Results Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">📈 Calculation Results</h2>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-gray-600">Total wall area:</div>
                <div className="font-semibold text-right">{results.totalsDetailed.totalArea_m2.toFixed(3)} m²</div>
                <div className="text-gray-600">Total wall volume:</div>
                <div className="font-semibold text-right">{results.totalsDetailed.totalVolume_m3.toFixed(3)} m³</div>
                <div className="text-gray-600">Brick module volume:</div>
                <div className="font-semibold text-right">
                  {results.totalsDetailed.moduleBrickVol_m3 ? results.totalsDetailed.moduleBrickVol_m3.toExponential(4) : "—"} m³
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3">Method Comparison</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area method:</span>
                    <span className="font-semibold">{formatNumber(results.totals.areaCount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Volume method:</span>
                    <span className="font-semibold">{formatNumber(results.totals.volumeCount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thumb rule:</span>
                    <span className="font-semibold">{formatNumber(results.totals.thumbCount)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-green-800">Selected Method</h3>
                  <span className="text-sm bg-green-200 text-green-800 px-2 py-1 rounded-full capitalize">
                    {method}
                  </span>
                </div>
                <div className="text-center py-3">
                  <div className="text-3xl font-bold text-green-700">{formatNumber(results.totals.bricksUsed)}</div>
                  <div className="text-sm text-green-600">Bricks to order (incl. waste)</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-3">Cost Analysis</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brick cost:</span>
                    <span className="font-semibold">{formatCurrency(results.costs.costBricks)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Labor cost:</span>
                    <span className="font-semibold">{formatCurrency(results.costs.laborCost)}</span>
                  </div>
                  <div className="flex justify-between border-t border-yellow-200 pt-2 mt-2">
                    <span className="text-lg font-semibold text-yellow-800">Total cost:</span>
                    <span className="text-lg font-bold text-yellow-800">{formatCurrency(results.costs.totalCost)}</span>
                  </div>
                </div>
              </div>

              {results.mortar.mortarCFT !== null && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-2">Mortar Estimation</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Required mortar:</span>
                    <span className="font-semibold">{results.mortar.mortarCFT.toFixed(2)} cft</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">≈ {results.mortar.mortarM3.toFixed(3)} m³</div>
                </div>
              )}
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Professional Tips</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                <span><strong>Volume method</strong> is most accurate for ordering (considers wall thickness)</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                <span><strong>Area method</strong> works best for single-wythe walls (approximation)</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                <span><strong>Thumb rule</strong> (13.5 cft = 1000 bricks) is for quick field estimates</span>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                <span>Typical waste percentage: <strong>5-15%</strong> for cutting and breakage</span>
              </div>
            </div>
          </div>

          {/* Visual Preview */}
          <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">👁️ Visual Preview</h3>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-gray-500 text-sm mb-2">Wall & Brick Visualization</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100 rounded p-3">
                  <div className="text-xs text-blue-800 mb-1">Wall Section</div>
                  <div className="h-20 bg-gradient-to-r from-blue-200 to-blue-300 rounded border border-blue-400"></div>
                </div>
                <div className="bg-orange-100 rounded p-3">
                  <div className="text-xs text-orange-800 mb-1">Brick Module</div>
                  <div className="h-20 bg-gradient-to-r from-orange-200 to-orange-300 rounded border border-orange-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;  