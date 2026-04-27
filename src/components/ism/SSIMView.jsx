export default function SSIMView({ grid }) {

  if (!grid) return null;

  const variables = grid.slice(1).map(row => row[0]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 text-center">

        {/* HEADER */}
        <thead>
          <tr className="bg-teal-700 text-white">
            <th className="border px-3 py-2">Variable</th>
            {variables.map((v, i) => (
              <th key={i} className="border px-3 py-2">
                {v}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {grid.slice(1).map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>
              <td className="border px-3 py-2 font-semibold">
                {row[0]}
              </td>

              {row.slice(1).map((cell, j) => (
                <td key={j} className="border px-3 py-2">
                  {cell || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}