export default function RMTable({ matrix, variables }) {

  if (!matrix || !Array.isArray(matrix)) return null;

  const size = matrix.length;

  // ✅ Driving Power (row sum)
  const drivingPower = matrix.map(row =>
    row.reduce((sum, val) => sum + Number(val), 0)
  );

  // ✅ Dependence Power (column sum)
  const dependencePower = Array(size).fill(0);

  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      dependencePower[j] += Number(matrix[i][j]);
    }
  }

  return (
    <div className="overflow-x-auto">

      <table className="w-full border text-center">

        {/* HEADER */}
        <thead>
          <tr className="bg-teal-700 text-white">
            <th className="border px-3 py-2">Variable</th>

            {variables.map((v, i) => (
              <th key={i} className="border px-3 py-2">{v}</th>
            ))}

            <th className="border px-3 py-2">Driving Power</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>

          {matrix.map((row, i) => (
            <tr key={i} className="bg-white">

              {/* Variable name */}
              <td className="border px-3 py-2 font-semibold">
                {variables[i]}
              </td>

              {/* Matrix values */}
              {row.map((val, j) => (
                <td
                  key={j}
                  className={`border px-3 py-2 ${
                    val === 1 ? "text-blue-600 font-semibold" : ""
                  }`}
                >
                  {val}
                </td>
              ))}

              {/* Driving Power */}
              <td className="border px-3 py-2 font-semibold text-blue-700">
                {drivingPower[i]}
              </td>

            </tr>
          ))}

          {/* DEPENDENCE POWER ROW */}
          
        </tbody>

      </table>

    </div>
  );
}