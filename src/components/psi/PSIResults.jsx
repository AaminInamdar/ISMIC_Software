import { useMemo } from "react";
export default function PSIResults({ matrix, types }) {

  const attributes = Object.keys(matrix[0] || {}).filter(k => k !== "rule");
const handlePrint = () => {
  window.print();
};
  // ================= NORMALIZATION =================
  const normalized = useMemo(() => {

    return matrix.map(row => {
      let obj = { rule: row.rule };

      attributes.forEach(attr => {
        const values = matrix.map(r => Number(r[attr]) || 0);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const val = Number(row[attr]) || 0;

        if (types[attr] === "beneficial") {
          obj[attr] = max === 0 ? 0 : val / max;
        } else {
          obj[attr] = val === 0 ? 1 : min / val;
        }
      });

      return obj;
    });

  }, [matrix, types]);

  // ================= MEAN =================
  const mean = {};
  attributes.forEach(attr => {
    mean[attr] =
      normalized.reduce((sum, r) => sum + r[attr], 0) /
      normalized.length;
  });

  // ================= PV =================
  const pv = {};
  attributes.forEach(attr => {
    pv[attr] = normalized.reduce(
      (sum, r) => sum + Math.pow(r[attr] - mean[attr], 2),
      0
    );
  });

  // ================= PHI =================
  const phi = {};
  attributes.forEach(attr => {
    phi[attr] = 1 - pv[attr];
  });

  // ================= WEIGHTS =================
  const sumPhi = Object.values(phi).reduce((a, b) => a + b, 0);

  const weights = {};
  attributes.forEach(attr => {
    weights[attr] = phi[attr] / sumPhi;
  });

  // ================= FINAL SCORES =================
  const ranking = normalized.map(row => {
    let score = 0;

    attributes.forEach(attr => {
      score += row[attr] * weights[attr];
    });

    return {
      rule: row.rule,
      score
    };
  }).sort((a, b) => b.score - a.score);

  // ================= UI =================
  return (
    <div id="print-area" className="bg-white p-6 rounded-xl shadow">
<style>
      {`
        @media print {
          button {
            display: none;
          }

          body {
            background: white;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            background: #334155 !important;
            color: white !important;
          }

          tr:nth-child(even) {
            background: #f8fafc !important;
          }
        }
      `}
    </style>
      {/* ================= NORMALIZED MATRIX ================= */}
      <h2 className="text-lg font-bold mb-3">
        1. Normalized Decision Matrix
      </h2>

      <div className="overflow-auto">
        <table className="w-full border text-center">
          <thead className="bg-teal-700 text-white">
            <tr>
              <th className="border p-2">Rule</th>
              {attributes.map(attr => (
                <th key={attr} className="border p-2">{attr}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {normalized.map((row, i) => (
              <tr key={i}>
                <td className="border p-2 font-semibold">{row.rule}</td>
                {attributes.map(attr => (
                  <td key={attr} className="border p-2">
                    {row[attr].toFixed(4)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= WEIGHTS ================= */}
      <h2 className="text-lg font-bold mt-6 mb-3">
        2. PSI Attribute Weights Computation
      </h2>

      <table className="w-full border text-center">
        <thead className="bg-teal-700 text-white">
          <tr>
            <th className="border p-2">Metric</th>
            {attributes.map(attr => (
              <th key={attr} className="border p-2">{attr}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="border p-2">Mean (Rj)</td>
            {attributes.map(attr => (
              <td key={attr} className="border p-2">
                {mean[attr].toFixed(4)}
              </td>
            ))}
          </tr>

          <tr>
            <td className="border p-2">Pref. Variation (PVj)</td>
            {attributes.map(attr => (
              <td key={attr} className="border p-2">
                {pv[attr].toFixed(4)}
              </td>
            ))}
          </tr>

          <tr>
            <td className="border p-2">Deviance (Φj)</td>
            {attributes.map(attr => (
              <td key={attr} className="border p-2">
                {phi[attr].toFixed(4)}
              </td>
            ))}
          </tr>

          <tr>
            <td className="border p-2 font-semibold">
              Overall Preference / Weight
            </td>
            {attributes.map(attr => (
              <td key={attr} className="border p-2 font-semibold">
                {weights[attr].toFixed(4)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* ================= FINAL RANKING ================= */}
      <h2 className="text-xl font-bold mt-6 text-green-600">
        🏆 3. Final PSI Ranking
      </h2>

      <table className="w-full border text-center mt-3">
        <thead className="bg-teal-800 text-white">
          <tr>
            <th className="border p-2">Rank</th>
            <th className="border p-2">Rule</th>
            <th className="border p-2">PSI Score</th>
          </tr>
        </thead>

        <tbody>
          {ranking.map((r, i) => (
            <tr
              key={i}
              className={i === 0 ? "bg-green-100 font-bold" : ""}
            >
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">{r.rule}</td>
              <td className="border p-2">
                {r.score.toFixed(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
<div className="text-center mt-6 print:hidden">
  <button
    onClick={handlePrint}
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
  >
    🖨 Print Report
  </button>
</div>
    </div>
  );
}