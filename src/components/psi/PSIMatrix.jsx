import { useEffect, useState } from "react";

export default function PSIMatrix({ jobData, onNext }) {

  const [matrix, setMatrix] = useState([]);
  const [rules, setRules] = useState(["FCFS", "SPT", "LPT", "EDD", "LCFS", "SLACK"]);

  const [showRuleInput, setShowRuleInput] = useState(false);
  const [showAttrInput, setShowAttrInput] = useState(false);

  const [newRule, setNewRule] = useState("");
  const [newAttr, setNewAttr] = useState("");

  // ================= APPLY RULE =================
  const applyRule = (rule, jobs) => {
    let sorted = [...jobs];

    switch (rule) {
      case "SPT": return sorted.sort((a, b) => a.pt - b.pt);
      case "LPT": return sorted.sort((a, b) => b.pt - a.pt);
      case "EDD": return sorted.sort((a, b) => a.dd - b.dd);
      case "LCFS": return sorted.reverse();
      case "SLACK": return sorted.sort((a, b) =>
        (a.dd - a.pt) - (b.dd - b.pt)
      );
      default: return sorted;
    }
  };

  // ================= METRICS =================
  const calculateMetrics = (jobs) => {
    let time = 0, flow = 0, tard = 0, maxT = 0, delayed = 0;

    jobs.forEach(job => {
      time += Number(job.pt);
      flow += time;

      const t = Math.max(0, time - Number(job.dd));
      tard += t;

      if (t > maxT) maxT = t;
      if (t > 0) delayed++;
    });

    const n = jobs.length;

    return {
      TFT: flow,
      TT: tard,
      AvgCompletion: flow / n,
      AvgJobs: flow / time,
      Utilization: (time / flow) * 100,
      MaxTardiness: maxT,
      AvgTardiness: tard / n,
      Delayed: delayed
    };
  };

  // ================= GENERATE MATRIX =================
  useEffect(() => {
    if (!jobData || jobData.length === 0) return;

    const result = rules.map(rule => {
      const sorted = applyRule(rule, jobData);
      const m = calculateMetrics(sorted);

      return {
        rule,
        "Total Flow Time (TFT)": m.TFT,
        "Total Tardiness (TT)": m.TT,
        "Avg. Job Completion": m.AvgCompletion,
        "Avg. Jobs in System": m.AvgJobs,
        "Percentage Utilization": m.Utilization,
        "Max Tardiness": m.MaxTardiness,
        "Avg. Tardiness": m.AvgTardiness,
        "No of Jobs Delayed": m.Delayed
      };
    });

    setMatrix(result);

  }, [jobData, rules]);

  // ================= COLUMNS =================
  const columns = matrix.length > 0
    ? Object.keys(matrix[0]).filter(k => k !== "rule")
    : [];

  // ================= ADD RULE =================
  const addRule = () => {
    if (!newRule.trim()) return;

    setRules([...rules, newRule.trim()]);
    setNewRule("");
    setShowRuleInput(false);
  };

  // ================= ADD ATTRIBUTE =================
  const addAttribute = () => {
    if (!newAttr.trim()) return;

    const updated = matrix.map(row => ({
      ...row,
      [newAttr.trim()]: 0
    }));

    setMatrix(updated);
    setNewAttr("");
    setShowAttrInput(false);
  };

  // ================= DELETE =================
  const deleteRule = (ruleName) => {
    setRules(rules.filter(r => r !== ruleName));
  };

  const deleteAttribute = (attr) => {
    const updated = matrix.map(row => {
      const newRow = { ...row };
      delete newRow[attr];
      return newRow;
    });
    setMatrix(updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-4">
        2. Decision Matrix
      </h2>

      {/* ACTION BAR */}
      <div className="flex gap-4 mb-5 flex-wrap">

        {/* ADD RULE */}
        <div>
          {!showRuleInput ? (
            <button
              onClick={() => setShowRuleInput(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Add Rule
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Rule name"
                className="border px-3 py-2 rounded"
              />
              <button onClick={addRule} className="bg-blue-700 text-white px-3 py-2 rounded">✓</button>
              <button onClick={() => setShowRuleInput(false)} className="bg-gray-400 text-white px-3 py-2 rounded">✕</button>
            </div>
          )}
        </div>

        {/* ADD ATTRIBUTE */}
        <div>
          {!showAttrInput ? (
            <button
              onClick={() => setShowAttrInput(true)}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              + Add Attribute
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                value={newAttr}
                onChange={(e) => setNewAttr(e.target.value)}
                placeholder="Attribute name"
                className="border px-3 py-2 rounded"
              />
              <button onClick={addAttribute} className="bg-green-700 text-white px-3 py-2 rounded">✓</button>
              <button onClick={() => setShowAttrInput(false)} className="bg-gray-400 text-white px-3 py-2 rounded">✕</button>
            </div>
          )}
        </div>

      </div>

      {/* TABLE */}
      {matrix.length > 0 && (
        <div className="overflow-auto border-2 border-gray-400 rounded-lg">

          <table className="w-full border-collapse text-center">

            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="border border-gray-400 p-2">Rule</th>

                {columns.map((col, i) => (
                  <th key={i} className="border border-gray-400 p-2 relative group">
                    {col}
                    <span
  onClick={() => deleteAttribute(col)}
  className="
    absolute top-1 right-1
    text-white bg-red-600
    rounded-full w-6 h-6 flex items-center justify-center
    text-sm font-bold cursor-pointer
    opacity-0 group-hover:opacity-100
    hover:bg-red-700 hover:scale-110
    transition-all duration-200
    shadow-md
  "
>
  ×
</span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {matrix.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">

                  <td className="border border-gray-400 p-2 font-semibold relative group">
                    {row.rule}
                    <span
  onClick={() => deleteRule(row.rule)}
  className="
    absolute top-1 right-1
    text-white bg-red-600
    rounded-full w-6 h-6 flex items-center justify-center
    text-sm font-bold cursor-pointer
    opacity-0 group-hover:opacity-100
    hover:bg-red-700 hover:scale-110
    transition-all duration-200
    shadow-md
  "
>
  ×
</span>
                  </td>

                  {columns.map((col, j) => (
                    <td key={j} className="border border-gray-400 p-2">
                      {Number(row[col]).toFixed(4)}
                    </td>
                  ))}

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

      {/* NEXT */}
      <div className="text-center mt-6">
        <button
          onClick={() => onNext(matrix)}
          className="bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Next → Criteria Types
        </button>
      </div>

    </div>
  );
}