import { useEffect, useState } from "react";

export default function PSIConfig({ matrix, onNext }) {

  const attributes = Object.keys(matrix[0] || {}).filter(k => k !== "rule");

  const [types, setTypes] = useState({});

  useEffect(() => {
    let obj = {};
    attributes.forEach(attr => {
      obj[attr] =
        attr === "Percentage Utilization"
          ? "beneficial"
          : "non-beneficial";
    });
    setTypes(obj);
  }, [matrix]);

  const toggle = (attr) => {
    setTypes(prev => ({
      ...prev,
      [attr]:
        prev[attr] === "beneficial"
          ? "non-beneficial"
          : "beneficial"
    }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">

  <h2 className="text-xl font-semibold mb-4">
    3. Criteria Types
  </h2>

  <div className="space-y-3">
    {attributes.map(attr => (
      <div
        key={attr}
        className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
      >
        <span className="font-medium">{attr}</span>

        <button
          onClick={() => toggle(attr)}
          className={`px-4 py-1 rounded-full text-white text-sm
            ${types[attr] === "beneficial"
              ? "bg-green-500"
              : "bg-orange-500"}
          `}
        >
          {types[attr]}
        </button>
      </div>
    ))}
  </div>

  <div className="text-center mt-6">
    <button
  onClick={() => onNext(types)}
  className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700"
>
  🚀 Execute PSI Ranking
</button>
  </div>

</div>
  );
}