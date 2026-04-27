export default function Digraph({ rcm, variables }) {
  if (!Array.isArray(rcm)) return null;

  const n = rcm.length;

  // ================= LEVEL LOGIC =================
  function calculateLevels(matrix) {
    let remaining = [...Array(n).keys()];
    let level = 1;
    let levels = Array(n).fill(0);

    while (remaining.length > 0) {
      let found = [];

      for (let i of remaining) {
        const reach = remaining.filter(
          j => matrix[i][j] === 1 
        );

        const ante = remaining.filter(
          j => matrix[j][i] === 1 
        );

        const intersection = reach.filter(x => ante.includes(x));

        if (
          reach.length === intersection.length &&
          reach.every(x => intersection.includes(x))
        ) {
          found.push(i);
        }
      }

      found.forEach(f => (levels[f] = level));
      remaining = remaining.filter(x => !found.includes(x));
      level++;
    }

    return levels;
  }

  const levels = calculateLevels(rcm);

  // ================= GROUP =================
  const grouped = {};
  levels.forEach((lvl, i) => {
    if (!grouped[lvl]) grouped[lvl] = [];
    grouped[lvl].push(i);
  });

  const levelKeys = Object.keys(grouped).sort((a, b) => a - b);

  // ================= POSITION =================
  const nodePositions = {};
  const width = 800;
  const height = 500;
  const levelGap = height / (levelKeys.length + 1);

  levelKeys.forEach((lvl, idx) => {
    const nodes = grouped[lvl];
    const gap = width / (nodes.length + 1);

    nodes.forEach((node, i) => {
      nodePositions[node] = {
        x: gap * (i + 1),
        y: levelGap * (idx + 1),
      };
    });
  });

  // ================= LINKS (FIXED) =================
  const links = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (rcm[i][j] === 1 ) {
        const lvl_i = levels[i];
        const lvl_j = levels[j];

        // ✅ FIX: allow all upward links
        if (lvl_i - lvl_j ==1) {
          links.push({ from: i, to: j });
        }
      }
    }
  }

  return (
    <div className="flex justify-center">
      
      <svg width={width} height={height} className="border bg-white">
{/* 🔥 LEVEL SEPARATOR LINES */}
{levelKeys.map((lvl, idx) => {
  const y = levelGap * (idx + 1);

  return (
    <g key={lvl}>
      <line
        x1="0"
        y1={y}
        x2={width}
        y2={y}
        stroke="#9ca3af"
        strokeDasharray="5,5"
      />

    </g>
  );
})}
        {/* 🔥 ARROWS */}
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="10"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L10,3 L0,6 Z" fill="black" />
          </marker>
        </defs>

        {links.map((link, idx) => {
          const from = nodePositions[link.from];
          const to = nodePositions[link.to];

          return (
            <line
              key={idx}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="black"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
            />
          );
        })}

        {/* 🔥 LEVEL LABELS */}
        {levelKeys.map((lvl, idx) => (
          <text
            key={lvl}
            x="10"
            y={levelGap * (idx + 1)}
            fontSize="14"
            fontWeight="bold"
          >
            Level {lvl}
          </text>
        ))}

        {/* 🔥 NODES */}
        {Object.entries(nodePositions).map(([node, pos]) => (
          <g key={node}>
            <rect
              x={pos.x - 20}
              y={pos.y - 20}
              width="40"
              height="40"
              fill="white"
              stroke="#2563eb"
              strokeWidth="2"
              rx="6"
            />
            <text
              x={pos.x}
              y={pos.y + 5}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
            >
              {variables[node]}
            </text>
          </g>
        ))}

      </svg>
    </div>
  );
}