import { useState, useEffect } from "react";

export default function DecisionMatrix({ jobData = [], onNext }) {

  const [matrix, setMatrix] = useState([]);
useEffect(() => {
  if (!jobData || jobData.length === 0) return;

  const result = rules.map(rule => {
    const sorted = applyRule(rule, jobData);
        //const selectedJobs = jobData.slice(0, 6); 
//const sorted = applyRule(rule, selectedJobs); 
    const m = calculateMetrics(sorted);

    return {
      rule,
      "Total Flow Time (TFT)": m.TFT.toFixed(2),
      "Total Tardiness (TT)": m.TT.toFixed(2),
      "Avg. Job Completion": m.AvgCompletion.toFixed(2),
      "Avg. Jobs in System": m.AvgJobs.toFixed(2),
      "Percentage Utilization": m.Utilization.toFixed(2),
      "Max Tardiness": m.MaxTardiness.toFixed(2),
      "Avg. Tardiness": m.AvgTardiness.toFixed(2),
      "No of Jobs Delayed": m.Delayed
    };
  });

  console.log("AUTO MATRIX:", result);

  setMatrix(result);

}, [jobData]);

  const rules = ["FCFS", "SPT", "LPT", "EDD", "LCFS", "SLACK"];

  // ================= APPLY RULE =================
  const applyRule = (rule, jobs) => {
    let sorted = [...jobs];

    switch (rule) {
      case "SPT":
        return sorted.sort((a, b) => a.pt - b.pt);

      case "LPT":
        return sorted.sort((a, b) => b.pt - a.pt);

      case "EDD":
        return sorted.sort((a, b) => a.dd - b.dd);

      case "LCFS":
        return sorted.reverse();

      case "SLACK":
        return sorted.sort((a, b) =>
          (a.dd - a.pt) - (b.dd - b.pt)
        );

      default:
        return sorted;
    }
  };

  // ================= CALCULATE METRICS =================
  const calculateMetrics = (jobs) => {
    let time = 0;
    let flowTime = 0;
    let tardiness = 0;
    let maxTardiness = 0;
    let delayedJobs = 0;

    jobs.forEach(job => {
      time += Number(job.pt) || 0;

      flowTime += time;

      const t = Math.max(0, time - (Number(job.dd) || 0));

      tardiness += t;

      if (t > maxTardiness) maxTardiness = t;

      if (t > 0) delayedJobs++;
    });

    const n = jobs.length;
    //const n = 6;

    return {
      TFT: flowTime,
      TT: tardiness,
      AvgCompletion: flowTime / n,
      AvgJobs: flowTime / time,
      Utilization: (time / flowTime) * 100,
      MaxTardiness: maxTardiness,
      AvgTardiness: tardiness / n,
      Delayed: delayedJobs
    };
  };

  // ================= GENERATE MATRIX =================
  const generateMatrix = () => {

    if (!jobData || jobData.length === 0) {
      alert("No job data found!");
      return;
    }

    const result = rules.map(rule => {

      const sorted = applyRule(rule, jobData);

      const m = calculateMetrics(sorted);

      return {
        rule,
        "Total Flow Time (TFT)": m.TFT.toFixed(2),
        "Total Tardiness (TT)": m.TT.toFixed(2),
        "Avg. Job Completion": m.AvgCompletion.toFixed(2),
        "Avg. Jobs in System": m.AvgJobs.toFixed(2),
        "Percentage Utilization": m.Utilization.toFixed(2),
        "Max Tardiness": m.MaxTardiness.toFixed(2),
        "Avg. Tardiness": m.AvgTardiness.toFixed(2),
        "No of Jobs Delayed": m.Delayed
      };
    });

    console.log("Matrix Generated:", result);

    setMatrix(result);   // 🔥 IMPORTANT
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      

      {/* TABLE */}
      {matrix.length > 0 && (
        <div className="overflow-auto">
          <table className="w-full border text-center">

            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="border p-2">Rule</th>
                {Object.keys(matrix[0])
                  .filter(k => k !== "rule")
                  .map((col, i) => (
                    <th key={i} className="border p-2">{col}</th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  <td className="border p-2 font-semibold">{row.rule}</td>

                  {Object.keys(row)
                    .filter(k => k !== "rule")
                    .map((col, j) => (
                      <td key={j} className="border p-2">
                        {row[col]}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* NEXT BUTTON */}
      {matrix.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={() => onNext(matrix)}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Next → Criteria & Weights
          </button>
        </div>
      )}

    </div>
  );
}