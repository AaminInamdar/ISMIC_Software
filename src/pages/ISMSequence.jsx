import { useState } from "react";
import * as XLSX from "xlsx";
import ISMSequenceResult from "./ISMSequenceResult";
import { useNavigate } from "react-router-dom";

export default function ISMSequence() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([
    { name: "J1", pt: "", dd: "" }
  ]);

  const allRules = ["FCFS","LCFS","SPT","LPT","EDD","SLACK"];
  const [selectedRules, setSelectedRules] = useState([...allRules]);

  const allAttrs = [
    "TFT","TT","AVG_CT","AVG_SYS","UTIL","MAX_T","AVG_T","DELAY"
  ];
  const [selectedAttrs, setSelectedAttrs] = useState([...allAttrs]);

  const [result, setResult] = useState(null);

  // ================= FILE =================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const formatted = json.slice(1).map((row, i) => ({
        name: String(row[0] || `J${i+1}`),
        pt: Number(row[1] || 0),
        dd: Number(row[2] || 0)
      }));

      setJobs(formatted);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleChange = (i, field, value) => {
    const copy = [...jobs];
    copy[i][field] = value;
    setJobs(copy);
  };
  const handlePaste = (e) => {
  e.preventDefault();

  const text = e.clipboardData.getData("text");

  const rows = text.trim().split("\n");

  const parsed = rows.map(row =>
    row.split(/\t|,|\s+/)
  );

  const formatted = parsed.map((row, i) => ({
    name: row[0] || `J${i + 1}`,
    pt: row[1] || "",
    dd: row[2] || ""
  }));

  setJobs(formatted);
};

  const addRow = () => {
    setJobs([...jobs, { name: `J${jobs.length+1}`, pt: "", dd: "" }]);
  };

  const removeRow = (i) => {
    const copy = [...jobs];
    copy.splice(i, 1);
    setJobs(copy);
  };

  const clearData = () => {
    setJobs([{ name: "J1", pt: "", dd: "" }]);
  };

  const toggleRule = (rule) => {
    setSelectedRules(prev =>
      prev.includes(rule)
        ? prev.filter(r => r !== rule)
        : [...prev, rule]
    );
  };

  const toggleAttr = (attr) => {
    setSelectedAttrs(prev =>
      prev.includes(attr)
        ? prev.filter(a => a !== attr)
        : [...prev, attr]
    );
  };

  const handleGenerate = () => {
    setResult({
      jobs,
      rules: selectedRules,
      attributes: selectedAttrs
    });
  };

  if (result) {
    return <ISMSequenceResult data={result} onBack={() => setResult(null)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50/30">

      {/* ===== HEADER (Fixed) ===== */}
      <div className="bg-white/80 backdrop-blur-sm shadow-md px-8 py-5 flex justify-between items-center border-b border-indigo-100 flex-shrink-0">
        <div>
          <p className="text-xs font-semibold text-indigo-500 tracking-wider">
            DECISION SUPPORT SYSTEM
          </p>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent mt-1">
            ISM & MICMAC for Scheduling & Sequencing
          </h1>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-indigo-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <span className="text-lg">🏠</span>
          <span className="font-medium">Dashboard</span>
        </button>
      </div>

      {/* ===== SCROLLABLE CONTENT AREA ===== */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          
          {/* ===== INPUT CARD ===== */}
          <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 via-white to-blue-50 border-b border-indigo-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-lg">1</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Input Job Data
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Enter job details or import from Excel file</p>
                </div>
              </div>
            </div>

            <div className="p-6" onPaste={handlePaste}>
              {/* ACTIONS */}
              <div className="flex justify-between mb-6 flex-shrink-0">
                <div className="flex gap-3">
                  <label className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg">
                    <span className="text-lg">📥</span>
                    Import Excel
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={addRow}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <span className="text-lg">+</span>
                    Add Row
                  </button>
                </div>
                <button
                  onClick={clearData}
                  className="text-slate-500 hover:text-rose-600 text-sm font-medium transition-all duration-200 flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-rose-50"
                >
                  <span className="text-lg">🗑️</span>
                  Clear Data
                </button>
              </div>

              {/* SCROLLABLE TABLE */}
              <div className="border-2 border-indigo-100 rounded-xl overflow-hidden">
                <div className="max-h-80 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 sticky top-0 z-10">
                      <tr className="border-b-2 border-indigo-100">
                        <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Job Name</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Processing Time</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-50">
                      {jobs.map((j, i) => (
                        <tr key={i} className="hover:bg-indigo-50/30 transition-colors duration-150">
                          <td className="px-6 py-3">
                            <input
                              value={j.name}
                              onChange={(e)=>handleChange(i,"name",e.target.value)}
                              className="w-24 px-3 py-2 text-sm font-medium text-slate-700 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                            />
                           </td>
                          <td className="px-6 py-3">
                            <input
                              value={j.pt}
                              onChange={(e)=>handleChange(i,"pt",e.target.value)}
                              className="w-32 px-3 py-2 text-sm text-slate-700 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                              placeholder="0"
                              type="number"
                            />
                           </td>
                          <td className="px-6 py-3">
                            <input
                              value={j.dd}
                              onChange={(e)=>handleChange(i,"dd",e.target.value)}
                              className="w-32 px-3 py-2 text-sm text-slate-700 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                              placeholder="0"
                              type="number"
                            />
                           </td>
                          <td className="px-6 py-3">
                            <button
                              onClick={()=>removeRow(i)}
                              className="text-indigo-300 hover:text-rose-500 transition-colors text-2xl font-light hover:scale-110 transform duration-200"
                            >
                              ×
                            </button>
                           </td>
                         </tr>
                      ))}
                    </tbody>
                   </table>
                </div>
              </div>
              
              {/* Job Count */}
              <div className="mt-5 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Jobs: <span className="font-bold text-indigo-600">{jobs.length}</span>
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {jobs.map((_, idx) => (
                    <div key={idx} className="w-2 h-2 rounded-full bg-indigo-300"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ===== RULES + ATTR ===== */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Scheduling Rules */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="px-6 py-5 bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-b border-emerald-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Scheduling Rules
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Select rules for comparison analysis</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  {allRules.map(rule => (
                    <label key={rule} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedRules.includes(rule)}
                        onChange={()=>toggleRule(rule)}
                        className="w-4.5 h-4.5 text-emerald-600 border-2 border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-emerald-600 transition-colors">
                        {rule}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="mt-5 pt-3 border-t-2 border-emerald-100">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-slate-600">Selected Rules</p>
                    <span className="text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 rounded-full shadow-sm">
                      {selectedRules.length} / {allRules.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Attributes */}
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="px-6 py-5 bg-gradient-to-r from-purple-50 via-white to-pink-50 border-b border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Performance Attributes
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">Select metrics for evaluation</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  {allAttrs.map(attr => (
                    <label key={attr} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedAttrs.includes(attr)}
                        onChange={()=>toggleAttr(attr)}
                        className="w-4.5 h-4.5 text-purple-600 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-purple-600 transition-colors">
                        {attr}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="mt-5 pt-3 border-t-2 border-purple-100">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-slate-600">Selected Attributes</p>
                    <span className="text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full shadow-sm">
                      {selectedAttrs.length} / {allAttrs.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ===== BUTTON ===== */}
          <div className="text-center pt-6 pb-8">
            <button
              onClick={handleGenerate}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 text-white px-12 py-4 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto transform hover:scale-105"
            >
              <span className="text-2xl">🚀</span>
              Generate ISM Model
              <span className="text-xl">→</span>
            </button>
            <p className="text-sm font-medium text-slate-500 mt-4">
              Analysis will be performed based on selected rules and attributes
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}