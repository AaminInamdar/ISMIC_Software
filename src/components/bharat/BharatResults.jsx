export default function BharatResults({ matrix, weights }) {

  if (!matrix || matrix.length === 0) {
    return <Message text="⚠ Please complete Step 2 first" />;
  }

  if (!weights || weights.length === 0) {
    return <Message text="⚠ Please complete Step 3 first" />;
  }

  const attributes = weights.map(w => w.attr);

  // ================= ✅ STEP 1: WEIGHTS =================
  const sortedWeights = [...weights].sort((a, b) => a.rank - b.rank);

  let cumulative = 0;
  let recips = [];

  sortedWeights.forEach(w => {
    cumulative += (1 / w.rank);
    recips.push(1 / cumulative);
  });

  const totalRecip = recips.reduce((a, b) => a + b, 0);

  const weightMap = {};
  const weightData = sortedWeights.map((w, i) => {
    const val = recips[i] / totalRecip;
    weightMap[w.attr] = val;

    
    return {
      ...w,
      weightValue: Number(val.toFixed(4))
    };
  });

  // ================= ✅ STEP 2: NORMALIZATION =================
  const normalizedMatrix = matrix.map(row => {
    let newRow = { rule: row.rule };

    attributes.forEach(attr => {
      const values = matrix.map(r => Number(r[attr]));
      const max = Math.max(...values);
      const min = Math.min(...values);

      const val = Number(row[attr]);
      const type = weights.find(w => w.attr === attr)?.type;

      let norm = 0;

      if (type === "beneficial") {
        norm = max === 0 ? 0 : val / max;
      } else {
        // 🔥 EXACT PYTHON LOGIC
        norm = val === 0 ? 1 : min / val;
      }

      newRow[attr] = Number(norm.toFixed(4));
    });

    return newRow;
  });

  // ================= ✅ STEP 3: FINAL SCORE =================
  const scores = normalizedMatrix
    .map(row => {
      let score = 0;

      attributes.forEach(attr => {
        score += row[attr] * weightMap[attr];
      });

      return {
        rule: row.rule,
        score: Number(score.toFixed(4))
      };
    })
    .sort((a, b) => b.score - a.score);

    const handlePrint = () => {
  window.print();
};
  // ================= UI =================
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-10">

      {/* WEIGHTS */}
      <div>
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          1. Weight Calculation (Reciprocal Rank Formula)
        </h2>

        <table className="w-full border text-center">
          <thead className="bg-teal-700 text-white">
            <tr>
              <th className="border">Rank</th>
              <th className="border">Attribute</th>
              <th className="border">Final Weight</th>
            </tr>
          </thead>

          <tbody>
            {weightData.map((w, i) => (
              <tr key={i}>
                <td className="border">{w.rank}</td>
                <td className="border">{w.attr}</td>
                <td className="border">{w.weightValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NORMALIZED MATRIX */}
      <div>
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          2. Normalized Decision Matrix
        </h2>

        <table className="w-full border text-center">
          <thead className="bg-teal-700 text-white">
            <tr>
              <th className="border">Rule</th>
              {attributes.map(attr => (
                <th key={attr} className="border">{attr}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {normalizedMatrix.map((row, i) => (
              <tr key={i}>
                <td className="border">{row.rule}</td>
                {attributes.map(attr => (
                  <td key={attr} className="border">{row[attr]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FINAL RANKING */}
      <div>
        <h2 className="text-xl font-bold text-green-600 mb-4">
          3. Final BHARAT Ranking
        </h2>

        <table className="w-full border text-center">
          <thead className="bg-teal-700 text-white">
            <tr>
              <th className="border">Rank</th>
              <th className="border">Rule</th>
              <th className="border">Final Score</th>
            </tr>
          </thead>

          <tbody>
            {scores.map((s, i) => (
              <tr key={i} className={i === 0 ? "bg-green-100 font-bold" : ""}>
                <td className="border">{i + 1}</td>
                <td className="border">{s.rule}</td>
                <td className="border">{s.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

function Message({ text }) {
  return (
    <div className="bg-yellow-100 text-yellow-700 p-4 rounded text-center">
      {text}
    </div>
  );
}