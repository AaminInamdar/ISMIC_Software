import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import VariableInput from "../components/ism/VariableInput";
import SSIMGrid from "../components/ism/SSIMGrid";
import {
  calculateRMFromSSIM,
  calculateFRM,
  calculateLevelPartition,  
  generateConicalAndReduced
} from "../utils/ismLogic";

export default function SmartISMInput() {
  const navigate = useNavigate();

  const [grid, setGrid] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode");

  const variables =
    grid.length > 1 ? grid.slice(1).map((row) => row[0]) : [];

  // ===============================
  // HANDLE VARIABLES
  // ===============================
  const handleVariableSubmit = (vars) => {
    const size = vars.length;

    const newGrid = Array(size + 1)
      .fill(null)
      .map(() => Array(size + 1).fill(""));

    for (let i = 0; i < size; i++) {
      newGrid[0][i + 1] = vars[i];
      newGrid[i + 1][0] = vars[i];
    }

    setGrid(newGrid);
  };

  const updateCell = (row, col, value) => {
       const updated = grid.map((r) => [...r]);
    updated[row][col] = value;
    setGrid(updated);
  };
 const handlePaste = (e) => {
  e.preventDefault();

  const text = e.clipboardData.getData("text");

  const rows = text.trim().split("\n");

  const parsed = rows.map(row =>
    row.split(/\t|,|\s+/)
  );

  // 🔥 Update inside existing grid (skip headers)
  setGrid((prev) => {
    const newGrid = [...prev];

    parsed.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (newGrid[i + 1] && newGrid[i + 1][j + 1] !== undefined) {
          newGrid[i + 1][j + 1] = cell;
        }
      });
    });

    return newGrid;
  });
}; 
  const generateAll = () => {
  try {
    setLoading(true);
    setError("");

    // 1️⃣ RM
    const { rm, driving_power, dependence_power } =
      calculateRMFromSSIM(grid);

    // 2️⃣ FRM
    const {
      frm,
      driving_power: frmDriving,
      dependence_power: frmDependence
    } = calculateFRM(rm);

    // 3️⃣ LEVEL
    const elements = calculateLevelPartition(frm, variables);

    // 4️⃣ CONICAL
    const conicalResult = generateConicalAndReduced(frm, elements);

    // ✅ FINAL RESULT
    const finalResult = {
      rm,
      rmDriving: driving_power,
      rmDependence: dependence_power,

      frm,
      frmDriving,
      frmDependence,

      levelTable: elements,

      conical: conicalResult.conical,
      reducedConical: conicalResult.reduced,
    };

    // 🚀 NAVIGATE
    navigate("/smart-ism/result", {
      state: {
        grid,
        result: finalResult,
      },
    });

  } catch (err) {
    console.error(err);
    setError("Error generating ISM");
  } finally {
    setLoading(false);
  }
};
  // ===============================
  // UI
  // ===============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">Dashboard</span>
              </button>
              <div className="h-6 w-px bg-slate-200"></div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Back</span>
              </button>
            </div>
            <div className="text-sm text-slate-500">
              Smart ISM Analysis
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {grid.length === 0 ? "Configure Analysis" : "Define Relationships"}
          </h1>
          <p className="text-slate-500">
            {grid.length === 0 
              ? "Start by adding variables or uploading a CSV file"
              : "Establish relationships between variables using the SSIM matrix"}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-600 font-medium">Processing ISM Analysis...</p>
              <p className="text-sm text-slate-400">This may take a few moments</p>
            </div>
          </div>
        )}

        {/* Manual Input Mode */}
        {grid.length === 0 && mode === "manual" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <VariableInput onSubmit={handleVariableSubmit} />
          </div>
        )}

        {/* Upload Mode */}
        {grid.length === 0 && mode === "upload" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                Upload Variables File
              </h2>
              <p className="text-slate-500">
                Upload a CSV file containing your variables and SSIM relationships
              </p>
            </div>

            <label className="block">
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  const reader = new FileReader();

                  reader.onload = (event) => {
                    const text = event.target.result;

                    const rows = text
                      .split("\n")
                      .map(r => r.trim())
                      .filter(r => r !== "");

                    const data = rows.map(r =>
                      r.split(",").map(c => c.trim())
                    );

                    let variables = data[0].slice(1);
                    variables = variables.filter(v => v && v !== "Variables");

                    const size = variables.length;

                    const newGrid = Array(size + 1)
                      .fill(null)
                      .map(() => Array(size + 1).fill(""));

                    for (let i = 0; i < size; i++) {
                      newGrid[0][i + 1] = variables[i];
                      newGrid[i + 1][0] = variables[i];
                    }

                    let rowIndex = 1;

                    for (let i = 1; i < data.length; i++) {
                      const row = data[i];

                      if (!row[0] || row[0] === "-" || row[0] === "Variables") continue;

                      for (let j = 1; j <= size; j++) {
                        newGrid[rowIndex][j] = row[j] || "";
                      }

                      rowIndex++;
                      if (rowIndex > size) break;
                    }

                    setGrid(newGrid);
                  };

                  reader.readAsText(file);
                }}
              />
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-5xl">📂</div>
                  <div>
                    <p className="font-medium text-slate-700 mb-1">
                      Click to browse or drag and drop
                    </p>
                    <p className="text-sm text-slate-400">
                      CSV files only
                    </p>
                  </div>
                </div>
              </div>
            </label>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500 text-center">
                File should include variable names and SSIM relationships (V, A, X, O)
              </p>
            </div>
          </div>
        )}

        {/* SSIM Matrix Section */}
        {grid.length > 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      SSIM Matrix
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Define relationships using V, A, X, or O notation
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span className="inline-block w-3 h-3 bg-green-100 border border-green-300 rounded"></span>
                      <span>V</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span className="inline-block w-3 h-3 bg-orange-100 border border-orange-300 rounded"></span>
                      <span>A</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span className="inline-block w-3 h-3 bg-purple-100 border border-purple-300 rounded"></span>
                      <span>X</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span className="inline-block w-3 h-3 bg-gray-100 border border-gray-300 rounded"></span>
                      <span>O</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6" onPaste={handlePaste}>
                <SSIMGrid grid={grid} onChange={updateCell} />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setGrid([])}
                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors duration-200 font-medium"
              >
                Reset Matrix
              </button>
              <button
                onClick={generateAll}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
              >
                Generate Full ISM →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}