export default function FRMTable({
  matrix,
  drivingPower,
  dependencePower,
  variables
}) {

  if (!matrix || !variables) return null;

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

            <th className="border px-3 py-2">Driving Power</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-gray-100" : "bg-white"}>

              {/* Variable name */}
              <td className="border px-3 py-2 font-semibold">
                {variables[i]}
              </td>

              {/* Matrix values */}
              {row.map((val, j) => (
                <td key={j} className="border px-3 py-2">
                  {val}
                </td>
              ))}

              {/* Driving power */}
              <td className="border px-3 py-2 text-blue-600 font-semibold">
                {drivingPower?.[i] ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}