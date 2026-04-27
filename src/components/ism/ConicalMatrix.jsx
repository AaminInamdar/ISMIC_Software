export default function ConicalMatrices({ frm, variables }) {
  if (!Array.isArray(frm) || frm.length === 0) return null;

  const n = frm.length;

  // ================= LEVEL LOGIC =================
  function calculateLevels(frm) {
    let remaining = [...Array(n).keys()];
    let level = 1;
    let levels = Array(n).fill(0);

    while (remaining.length > 0) {
      let found = [];

      for (let i of remaining) {
        const reach = remaining.filter(
          (j) => frm[i][j] === 1 || frm[i][j] === "1*"
        );

        const ante = remaining.filter(
          (j) => frm[j][i] === 1 || frm[j][i] === "1*"
        );

        const intersection = reach.filter((x) =>
          ante.includes(x)
        );

        const isSame =
          reach.length === intersection.length &&
          reach.every((x) => intersection.includes(x));

        if (isSame) {
          found.push(i);
        }
      }

      found.forEach((f) => {
        levels[f] = level;
      });

      remaining = remaining.filter((x) => !found.includes(x));

      level++;
    }

    return levels;
  }

  const levels = calculateLevels(frm);

  // ================= SORT =================
  const sortedIndices = [...Array(n).keys()].sort(
    (a, b) => levels[a] - levels[b]
  );

  // ================= CM =================
  const cm = sortedIndices.map((i) =>
    sortedIndices.map((j) => frm[i][j])
  );

  // ================= RCM =================
  const rcm = sortedIndices.map((i, idx_i) =>
  sortedIndices.map((j, idx_j) => {

    if (idx_i === idx_j) return 0;

    const lvl_i = levels[i];
    const lvl_j = levels[j];

        // ✅ ONLY direct relation
    return frm[i][j] === 1 ? 1 : 0;
  })
);

  return (
    <div className="space-y-10">

      {/* ================= CM ================= */}
      <div>
        <h2 className="text-lg font-bold mb-2">Conical Matrix (CM)</h2>

        <div className="overflow-x-auto">
          <table className="w-full border text-center">

            <thead>
              <tr className="bg-teal-700 text-white">
                <th className="border px-4 py-2">Variable</th>

                {sortedIndices.map((i) => (
                  <th key={i} className="border px-4 py-2">
                    {variables[i]}
                  </th>
                ))}

                <th className="border px-4 py-2">Level</th>
              </tr>
            </thead>

            <tbody>
              {cm.map((row, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">
                    {variables[sortedIndices[i]]}
                  </td>

                  {row.map((cell, j) => (
                    <td key={j} className="border px-4 py-2">
                      {cell}
                    </td>
                  ))}

                  <td className="border px-4 py-2 font-semibold">
                    {levels[sortedIndices[i]]}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* ================= RCM ================= */}
      <div>
        <h2 className="text-lg font-bold mb-2">
          Reduced Conical Matrix (RCM)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border text-center">

            <thead>
              <tr className="bg-teal-700 text-white">
                <th className="border px-4 py-2">Variable</th>

                {sortedIndices.map((i) => (
                  <th key={i} className="border px-4 py-2">
                    {variables[i]}
                  </th>
                ))}

                <th className="border px-4 py-2">Level</th>
              </tr>
            </thead>

            <tbody>
              {rcm.map((row, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">
                    {variables[sortedIndices[i]]}
                  </td>

                  {row.map((cell, j) => (
                    <td key={j} className="border px-4 py-2">
                      {cell}
                    </td>
                  ))}

                  <td className="border px-4 py-2 font-semibold">
                    {levels[sortedIndices[i]]}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}