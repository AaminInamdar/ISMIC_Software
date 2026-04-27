import { useState, useEffect } from "react";

export default function CriteriaWeights({ matrix, onNext }) {

  // 🚨 SAFETY CHECK
  if (!matrix || matrix.length === 0) {
    return <Message text="⚠ Please complete Step 2 first" />;
  }

  const attributes = Object.keys(matrix[0]).filter(
    key => key !== "rule"
  );

  const [weights, setWeights] = useState([]);

  useEffect(() => {
    const initial = attributes.map((attr, i) => ({
      attr,
      type:
        attr === "Percentage Utilization"
          ? "beneficial"
          : "non-beneficial",
      rank: i + 1
    }));

    setWeights(initial);
  }, [matrix]);

  const toggleType = (i) => {
    const updated = [...weights];
    updated[i].type =
      updated[i].type === "beneficial"
        ? "non-beneficial"
        : "beneficial";
    setWeights(updated);
  };

  const updateRank = (i, val) => {
    const updated = [...weights];
    updated[i].rank = val;
    setWeights(updated);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-semibold mb-4">
        3. Criteria & Weights
      </h2>

      <table className="w-full border text-center">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="border p-3 text-left">Attribute Name</th>
            <th className="border p-3">Type</th>
            <th className="border p-3">Rank</th>
          </tr>
        </thead>

        <tbody>
          {weights.map((w, i) => (
            <tr key={i}>
              <td className="border p-3 text-left">{w.attr}</td>

              <td className="border p-3">
                <button
                  onClick={() => toggleType(i)}
                  className={`px-4 py-1 rounded-full text-white text-sm
                  ${
                    w.type === "beneficial"
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                >
                  {w.type === "beneficial"
                    ? "Beneficial"
                    : "Non-Beneficial"}
                </button>
              </td>

              <td className="border p-3">
                <input
                  type="number"
                  value={w.rank}
                  onChange={(e) => updateRank(i, e.target.value)}
                  className="w-20 text-center border rounded px-2 py-1"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center mt-6">
        <button
          onClick={() => onNext(weights)}
          className="bg-blue-700 text-white px-6 py-2 rounded"
        >
          🚀 Execute Final BHARAT Ranking
        </button>
      </div>
    </div>
  );
}

function Message({ text }) {
  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg text-center">
      {text}
    </div>
  );
}