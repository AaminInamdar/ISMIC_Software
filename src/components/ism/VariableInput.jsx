import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function VariableInput({ onSubmit }) {
  const [bulkText, setBulkText] = useState("");
  const [variableCount, setVariableCount] = useState("");
  const [variables, setVariables] = useState([]);
  const [activeTab, setActiveTab] = useState("manual");
const navigate = useNavigate();
const { search } = useLocation();
const mode = new URLSearchParams(search).get("mode");

const handleGoBack = () => {
  navigate(-1); // goes to previous page
};
  const handleCountSubmit = () => {
    const count = parseInt(variableCount);
    if (count > 0 && count <= 50) {
      setVariables(Array(count).fill(""));
    } else {
      alert("Please enter a valid number between 1 and 50");
    }
  };

  const handleVariableChange = (index, value) => {
    const updated = [...variables];
    updated[index] = value;
    setVariables(updated);
  };

  const handleBulkInput = (text) => {
    const vars = text
      .split(/[\n,]+/)
      .map(v => v.trim())
      .filter(v => v !== "");
    setVariables(vars);
    setVariableCount(vars.length.toString());
  };

  const handleGenerate = () => {
    const validVars = variables.filter(v => v.trim() !== "");
    if (validVars.length === 0) {
      alert("Please enter at least one variable");
      return;
    }
    onSubmit(validVars);
  };

 const handleBackToDashboard = () => {
  navigate("/");
};


  const filledCount = variables.filter(v => v && v.trim()).length;
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200  shadow-sm">

  <div className="max-w-7xl mx-auto px-6 py-4 space-y-3">

    

    {/* 🔥 SECOND ROW */}
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-4">

               <div className="h-6 w-px bg-gray-300"></div>

        <h1 className="text-xl font-semibold text-gray-900">
          SSIM Grid Generator
        </h1>

      </div>

      <div className="text-sm text-gray-500">
        Step 1 of 2: Configure Variables
      </div>

    </div>

  </div>

</div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <div className="w-24 h-0.5 bg-blue-600"></div>
              <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
            </div>
            <div className="text-sm text-gray-600">
              <span className="text-blue-600 font-medium">Variable Configuration</span>
              <span className="mx-2">→</span>
              <span>Generate Grid</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Number of Variables Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <h2 className="text-lg font-semibold text-gray-900">Step 1: Set Number of Variables</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of variables
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={variableCount}
                      onChange={(e) => setVariableCount(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder="e.g., 5"
                    />
                  </div>
                  <button
                    onClick={handleCountSubmit}
                    disabled={!variableCount || variableCount < 1}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Set Variables
                  </button>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  You can add up to 50 variables per grid
                </p>
              </div>
            </div>

            {/* Variable Input Methods */}
            {variables.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveTab("manual")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "manual"
                          ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Manual Entry
                    </button>
                    <button
                      onClick={() => setActiveTab("bulk")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === "bulk"
                          ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Bulk Import
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {activeTab === "manual" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                        {variables.map((variable, index) => (
                          <div key={index} className="relative">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Variable {index + 1}
                            </label>
                            <input
                              type="text"
                              value={variable}
                              onChange={(e) => handleVariableChange(index, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`e.g., Variable ${index + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Paste your variables
                      </label>
                      <textarea
  rows={8}
  value={bulkText}
  onChange={(e) => setBulkText(e.target.value)}
  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
  placeholder="Paste variables here (one per line or comma separated):&#10;&#10;Age&#10;Gender&#10;Income"
/>
<button
  onClick={() => handleBulkInput(bulkText)}
  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
>
  Load Variables
</button>
                      <p className="text-xs text-gray-500">
                        Supports comma-separated values or one per line
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Preview & Actions */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-24">
              {/* Preview Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Preview</h3>
                    <span className="text-sm text-blue-600 font-medium">
                      {filledCount} / {variables.length} filled
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  {variables.length > 0 ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {variables.map((variable, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                          <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            {variable && variable.trim() ? (
                              <span className="text-gray-900 font-medium">{variable}</span>
                            ) : (
                              <span className="text-gray-400 italic">Not set</span>
                            )}
                          </div>
                          {variable && variable.trim() && (
                            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500">Set the number of variables to begin</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {variables.length > 0 && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-3">
                    <button
                      onClick={handleGenerate}
                      disabled={filledCount === 0}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate SSIM Grid
                    </button>
                    
                    <button
                      onClick={() => {
                        setVariables([]);
                        setVariableCount("");
                      }}
                      className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                    >
                      Reset All
                    </button>
                  </div>
                )}
              </div>

              {/* Help Card - Now properly positioned and stays below */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Quick Tips</p>
                    <ul className="text-blue-800 space-y-1 text-xs">
                      <li>• Use descriptive variable names</li>
                      <li>• Maximum 50 variables per grid</li>
                      <li>• Variables will be used to generate SSIM comparison grid</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
