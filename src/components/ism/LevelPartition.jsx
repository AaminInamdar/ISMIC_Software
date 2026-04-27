export default function LevelPartition({ frm, variables }) {

  // ✅ safety
  if (
    !Array.isArray(frm) ||
    frm.length === 0 ||
    !Array.isArray(frm[0])
  ) {
    return <div>No Level Partition data</div>;
  }

  const n = frm.length;

  let remaining = [...Array(n).keys()];
  let level = 1;
  let result = [];

  while (remaining.length > 0) {
    let currentLevel = [];

    remaining.forEach((i) => {
      const reach = remaining.filter(
        (j) => frm[i]?.[j] === 1 || frm[i]?.[j] === "1*"
      );

      const ante = remaining.filter(
        (j) => frm[j]?.[i] === 1 || frm[j]?.[i] === "1*"
      );

      const intersection = reach.filter((x) =>
        ante.includes(x)
      );

      if (
        reach.length === intersection.length &&
        reach.every((v) => intersection.includes(v))
      ) {
        currentLevel.push(i);
      }
    });

    currentLevel.forEach((i) => {
      const reachAll = frm[i]
        .map((v, j) =>
          v === 1 || v === "1*" ? variables[j] : null
        )
        .filter(Boolean);

      const anteAll = frm
        .map((row, j) =>
          row[i] === 1 || row[i] === "1*" ? variables[j] : null
        )
        .filter(Boolean);

      const interAll = reachAll.filter((x) =>
        anteAll.includes(x)
      );

      result.push({
        element: variables[i],
        reachability: reachAll.join(", "),
        antecedent: anteAll.join(", "),
        intersection: interAll.join(", "),
        level,
      });
    });

    remaining = remaining.filter(
      (i) => !currentLevel.includes(i)
    );

    level++;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 text-center">

        <thead>
          <tr className="bg-teal-700 text-white">
            <th className="border px-4 py-2">Elements</th>
            <th className="border px-4 py-2">Reachability Set</th>
            <th className="border px-4 py-2">Antecedent Set</th>
            <th className="border px-4 py-2">Intersection</th>
            <th className="border px-4 py-2">Level</th>
          </tr>
        </thead>

        <tbody>
          {result.map((item, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}>
              <td className="border px-4 py-2">{item.element}</td>
              <td className="border px-4 py-2">{item.reachability}</td>
              <td className="border px-4 py-2">{item.antecedent}</td>
              <td className="border px-4 py-2">{item.intersection}</td>
              <td className="border px-4 py-2 font-semibold">{item.level}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}