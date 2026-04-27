export default function MicmacGraph({ frm, variables }) {
  if (!Array.isArray(frm)) return null;

  const n = frm.length;

  // ✅ Driving Power
  const driving = frm.map(row =>
    row.filter(v => v === 1 || v === "1*").length
  );

  // ✅ Dependence Power
  const dependence = frm.map((_, j) =>
    frm.filter(row => row[j] === 1 || row[j] === "1*").length
  );

  // 🔥 GRAPH SETTINGS
  const size = 600;
  const margin = 120;
  const width = size + margin;
  const height = size + margin;

  const max = Math.max(...driving, ...dependence) + 1;
  const scale = size / max;
  const mid = size / 2;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold text-green-700 mb-4 text-center">
        MICMAC Analysis
      </h2>

      <svg width={width} height={height} className="border bg-white">

        {/* 🔥 GRAPH AREA */}
        <g transform={`translate(${margin / 2}, ${margin / 2})`}>

          {/* 🔥 QUADRANTS */}
          <rect x="0" y={mid} width={mid} height={mid} fill="#e5e7eb" />
          <rect x={mid} y={mid} width={mid} height={mid} fill="#d1fae5" />
          <rect x={mid} y="0" width={mid} height={mid} fill="#fecaca" />
          <rect x="0" y="0" width={mid} height={mid} fill="#fef9c3" />

          {/* 🔥 CENTER LINES */}
          <line x1={mid} y1="0" x2={mid} y2={size} stroke="black" />
          <line x1="0" y1={mid} x2={size} y2={mid} stroke="black" />

          {/* 🔥 AXES */}
          <line x1="0" y1={size} x2={size} y2={size} stroke="black" />
          <line x1="0" y1="0" x2="0" y2={size} stroke="black" />

          {/* 🔥 TICKS + NUMBERS */}
          {Array.from({ length: max + 1 }).map((_, i) => {
            const x = i * scale;
            const y = size - i * scale;

            return (
              <g key={i}>
                {/* X axis ticks */}
                <line x1={x} y1={size} x2={x} y2={size + 5} stroke="black" />
                <text x={x} y={size + 18} fontSize="12" textAnchor="middle">
                  {i}
                </text>

                {/* Y axis ticks */}
                <line x1={-5} y1={y} x2="0" y2={y} stroke="black" />
                <text x={-10} y={y + 4} fontSize="12" textAnchor="end">
                  {i}
                </text>
              </g>
            );
          })}

          {/* 🔥 QUADRANT LABELS */}
          <text x="10" y={size - 10} fontSize="12">I Autonomous</text>
          <text x={size - 120} y={size - 10} fontSize="12">II Dependent</text>
          <text x={size - 100} y="15" fontSize="12">III Linkage</text>
          <text x="10" y="15" fontSize="12">IV Independent</text>

          {/* 🔥 POINTS */}
          {variables.map((v, i) => {
            const x = dependence[i] * scale;
            const y = size - driving[i] * scale;

            return (
              <g key={i}>
                <circle cx={x} cy={y} r="9" fill="#0f766e" />
                <text x={x + 8} y={y - 6} fontSize="12">
                  {v}
                </text>
              </g>
            );
          })}

        </g>

        {/* 🔥 OUTSIDE LABELS */}
        <text
          x={width / 2}
          y={height - 10}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
        >
          Dependence Power
        </text>

        <text
          x="15"
          y={height / 2}
          textAnchor="middle"
          fontSize="14"
          fontWeight="bold"
          transform={`rotate(-90 15 ${height / 2})`}
        >
          Driving Power
        </text>

      </svg>
    </div>
  );
}