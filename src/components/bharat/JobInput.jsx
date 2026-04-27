import { useState } from "react";
import * as XLSX from "xlsx";

export default function JobInput({ onNext }) {

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

      if (!json.length) return;

      const headers = Object.keys(json[0]);

      console.log("HEADERS:", headers);

      // ✅ EXACT COLUMN MATCH (YOUR FILE)
      const nameCol = headers.find(h =>
        h.toLowerCase().includes("product")
      );

      const ptCol = headers.find(h =>
        h.toLowerCase().includes("time")
      );

      const ddCol = headers.find(h =>
        h.toLowerCase().includes("due")
      );

      console.log("Detected:", { nameCol, ptCol, ddCol });

      const formatted = json.map((row, i) => {

        const pt = parseFloat(row[ptCol]);
        const dd = parseFloat(row[ddCol]);

        return {
          name: nameCol ? `J${row[nameCol]}` : `J${i + 1}`,
          pt: isNaN(pt) ? 0 : pt,
dd: isNaN(dd) ? 0 : dd
        };
      });

      console.log("FINAL:", formatted);

      // 🔥 FORCE REACT UPDATE
      setRows([...formatted]);
    };

    reader.readAsArrayBuffer(file);
  };

  // ================= UI =================
  return (
    <div className="bg-white p-6 rounded-xl shadow" onPaste={handlePaste}>

      <h2 className="text-xl font-semibold mb-4">
        1. Input Job Data
      </h2>

      {/* BUTTONS */}
      <div className="flex gap-3 mb-4 items-center">

        <button
          onClick={() => document.getElementById("excelUpload").click()}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Import Excel
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
          className="bg-gray-600 text-white px-3 py-1 rounded"
        >
          + Add Row
        </button>

        <button
          onClick={clearAll}
          className="ml-auto bg-red-500 text-white px-3 py-1 rounded"
        >
          Clear All Data
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-auto">
        <table className="w-full border text-center">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="border p-2">JOB NAME</th>
              <th className="border p-2">PROCESSING TIME</th>
              <th className="border p-2">DUE DATE</th>
              <th className="border p-2">X</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>

                <td className="border">
                  <input
                    value={r.name ?? ""}
                    onChange={(e) =>
                      handleChange(i, "name", e.target.value)
                    }
                    className="w-full p-1"
                  />
                </td>

                <td className="border">
                  <input
                    value={r.pt ?? ""}
                    onChange={(e) =>
                      handleChange(i, "pt", e.target.value)
                    }
                    className="w-full p-1"
                  />
                </td>

                <td className="border">
                  <input
                    value={r.dd ?? ""}
                    onChange={(e) =>
                      handleChange(i, "dd", e.target.value)
                    }
                    className="w-full p-1"
                  />
                </td>

                <td
                  className="border text-red-500 cursor-pointer text-lg font-bold"
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

      {/* NEXT BUTTON */}
      <div className="text-center mt-6">
        <button
  onClick={() => {
    if (!rows || rows.length === 0) {
      alert("Please enter job data first!");
      return;
    }

    // 🔥 convert data properly
    const formatted = rows.map(r => ({
      name: r.name,
      pt: Number(r.pt),
      dd: Number(r.dd)
    }));

    console.log("STEP 1 DATA:", formatted);

    onNext(formatted); // 🔥 ONLY PASS DATA
  }}
  className="bg-blue-700 text-white px-6 py-2 rounded-lg"
>
  Next → Decision Matrix
</button>
      </div>

    </div>
  );
} 