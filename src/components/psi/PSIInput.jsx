import { useState } from "react";
import * as XLSX from "xlsx";

export default function PSIInput({ onNext }) {

  // ================= STATE =================
  const [rows, setRows] = useState([
    { name: "", pt: "", dd: "" }
  ]);

  const [rules, setRules] = useState({
    FCFS: true,
    LCFS: true,
    SPT: true,
    LPT: true,
    EDD: true,
    SLACK: true
  });

  // ================= BASIC FUNCTIONS =================
  const addRow = () => {
    setRows([...rows, { name: "", pt: "", dd: "" }]);
  };

  const handleChange = (i, key, val) => {
    const updated = [...rows];
    updated[i][key] = val;
    setRows(updated);
  };

  const handlePaste = (e) => {
  e.preventDefault();

  const text = e.clipboardData.getData("text");

  const rowsData = text.trim().split("\n");

  const parsed = rowsData.map(row =>
    row.split(/\t|,|\s+/)
  );

  const formatted = parsed.map((row, i) => ({
    name: row[0] || `J${i + 1}`,
    pt: row[1] || "",
    dd: row[2] || ""
  }));

  setRows(formatted);
};

  const deleteRow = (i) => {
    const updated = rows.filter((_, idx) => idx !== i);
    setRows(updated.length ? updated : [{ name: "", pt: "", dd: "" }]);
  };

  const clearAll = () => {
    setRows([{ name: "", pt: "", dd: "" }]);
  };

  const toggleRule = (rule) => {
    setRules(prev => ({
      ...prev,
      [rule]: !prev[rule]
    }));
  };

  // ================= 🔥 EXCEL UPLOAD FINAL =================
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { raw: false });

      if (!json.length) {
        alert("Excel file is empty!");
        return;
      }

      const headers = Object.keys(json[0]);

      console.log("HEADERS:", headers);

      // 🔥 SMART COLUMN DETECTION
      const nameCol = headers.find(h =>
        h.toLowerCase().includes("product") ||
        h.toLowerCase().includes("job")
      );

      const ptCol = headers.find(h =>
        h.toLowerCase().includes("time")
      );

      const ddCol = headers.find(h =>
        h.toLowerCase().includes("due")
      );

      console.log("Detected:", { nameCol, ptCol, ddCol });

      if (!ptCol || !ddCol) {
        alert("Excel format incorrect! Check column names.");
        return;
      }

      const formatted = json.map((row, i) => {
        const pt = parseFloat(row[ptCol]);
        const dd = parseFloat(row[ddCol]);

        return {
          name: nameCol ? `J${row[nameCol]}` : `J${i + 1}`,
          pt: isNaN(pt) ? 0 : pt,
          dd: isNaN(dd) ? 0 : dd
        };
      });

      console.log("FINAL DATA:", formatted);

      setRows(formatted);
    };

    reader.readAsArrayBuffer(file);
  };

  // ================= NEXT =================
  const handleNext = () => {
    const valid = rows.filter(
      r => r.name && r.pt !== "" && r.dd !== ""
    );

    if (valid.length === 0) {
      alert("Please enter job data first!");
      return;
    }

    const formatted = valid.map(r => ({
      name: r.name,
      pt: Number(r.pt),
      dd: Number(r.dd)
    }));

    console.log("STEP 1 DATA:", formatted);

    onNext(formatted); // ✅ IMPORTANT
  };

  // ================= UI =================
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md" onPaste={handlePaste}>

      <h2 className="text-2xl font-bold mb-6">
        1. Input Job Data
      </h2>

      {/* ACTION BAR */}
      <div className="flex gap-3 mb-5 items-center flex-wrap">

        <button
          onClick={() => document.getElementById("excelUpload").click()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          📥 Import Excel
        </button>

        <input
          id="excelUpload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFile}
          className="hidden"
        />

        <button
          onClick={addRow}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          + Add Row
        </button>

        <button
          onClick={clearAll}
          className="ml-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Clear All
        </button>

      </div>

      {/* TABLE */}
      <div className="overflow-auto border rounded-lg">
        <table className="w-full text-center">

          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="p-3">JOB NAME</th>
              <th className="p-3">PROCESSING TIME</th>
              <th className="p-3">DUE DATE</th>
              <th className="p-3">X</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">

                <td>
                  <input
                    value={r.name ?? ""}
                    onChange={(e) => handleChange(i, "name", e.target.value)}
                    className="w-full p-2 border"
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={r.pt ?? ""}
                    onChange={(e) => handleChange(i, "pt", e.target.value)}
                    className="w-full p-2 border"
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={r.dd ?? ""}
                    onChange={(e) => handleChange(i, "dd", e.target.value)}
                    className="w-full p-2 border"
                  />
                </td>

                <td
                  className="text-red-500 cursor-pointer font-bold"
                  onClick={() => deleteRow(i)}
                >
                  ×
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RULES */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">
          2. Select Scheduling Rules
        </h2>

        <div className="bg-gray-200 p-4 rounded-lg flex flex-wrap gap-6">
          {Object.keys(rules).map(rule => (
            <label key={rule} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rules[rule]}
                onChange={() => toggleRule(rule)}
              />
              {rule}
            </label>
          ))}
        </div>
      </div>

      {/* NEXT */}
      <div className="text-center mt-6">
        <button
          onClick={handleNext}
          className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg hover:bg-green-700"
        >
          ⚡ Auto Calculate Matrix →
        </button>
      </div>

    </div>
  );
}