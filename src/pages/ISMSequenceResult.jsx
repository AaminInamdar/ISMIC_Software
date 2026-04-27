import React, { useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import Header from "../components/CommonHeader";
function Digraph({ rcm, sortedRules, elementLevels, sortedIndices }) {

  const maxLevel = Math.max(...elementLevels);

  const width = 800;
  const height = 400;

  let positions = {};

  // LEVEL POSITIONING
  for (let lvl = 1; lvl <= maxLevel; lvl++) {

    const nodes = sortedIndices.filter(i => elementLevels[i] === lvl);

    nodes.forEach((node, idx) => {

      const x = (idx + 1) * (width / (nodes.length + 1));
      const y = (lvl / (maxLevel + 1)) * height;

      positions[node] = { x, y };
    });
  }

  return (
    <div className="flex justify-center">
      
      <svg width={width} height={height} className="border bg-white">

        {/* LEVEL LINES */}
        {Array.from({ length: maxLevel }).map((_, i) => {
          const y = ((i + 1) / (maxLevel + 1)) * height;
          return (
            <line
              key={i}
              x1="0"
              y1={y}
              x2={width}
              y2={y}
              stroke="#cbd5e1"
              strokeDasharray="5,5"
            />
          );
        })}

        {/* ARROWS */}
        {rcm.map((row, i) =>
          row.map((val, j) => {
            if (val === 1) {
              const from = positions[sortedIndices[i]];
              const to = positions[sortedIndices[j]];

              return (
                <line
                  key={`${i}-${j}`}
                  x1={from?.x}
                  y1={from?.y}
                  x2={to?.x}
                  y2={to?.y}
                  stroke="#475569"
                  strokeWidth="1.5"
                  markerEnd="url(#arrow)"
                />
              );
            }
            return null;
          })
        )}

        {/* ARROW HEAD */}
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto">
            <path d="M0,0 L10,3 L0,6 Z" fill="black" />
          </marker>
        </defs>

        {/* NODES */}
        {sortedIndices.map((node, i) => {
          const pos = positions[node];
          return (
            <g key={i}>
              <rect
                x={pos?.x - 20}
                y={pos?.y - 20}
                width="40"
                height="40"
                fill="#e0f2fe"
                stroke="#0284c7"
                rx="6"
              />
              <text
                x={pos?.x}
                y={pos?.y + 5}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
              >
                {sortedRules[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function ISMSequenceResult({ data, onBack }) {
  
  const { jobs, rules, attributes } = data;

  // ================= FULL LOGIC =================
  function calculateAllResults(jobs, rules, attrs) {

    const getSequence = (rule) => {
      const copy = [...jobs];

      switch(rule){
        case "FCFS": return copy;
        case "LCFS": return [...copy].reverse();
        case "SPT": return [...copy].sort((a,b)=>a.pt-b.pt);
        case "LPT": return [...copy].sort((a,b)=>b.pt-a.pt);
        case "EDD": return [...copy].sort((a,b)=>a.dd-b.dd);
        case "SLACK":
          return [...copy].sort((a,b)=>(a.dd-a.pt)-(b.dd-b.pt));
        default: return copy;
      }
    };

// ===== PERFORMANCE (FINAL CORRECT — MATCHES YOUR OUTPUT) =====
const performance = rules.map(rule => {

  const seq = getSequence(rule);

  let time = 0;
  let ct = [];
  let tardiness = [];

  seq.forEach(j=>{
    time += j.pt;
    ct.push(time);
    tardiness.push(Math.max(0, time - j.dd));
  });

  const n = ct.length;

  const TFT = ct.reduce((a,b)=>a+b,0);
  const TT = tardiness.reduce((a,b)=>a+b,0);

  const AVG_CT = TFT / n;

  const makespan = ct[ct.length - 1];

  // ✅ CORRECT (matches your screenshot)
  const AVG_SYS = TFT / makespan;

  // 🔥 MAIN FIX (THIS WILL MATCH YOUR UTIL VALUES)
  const totalPT = seq.reduce((a,b)=>a+b.pt,0);
  const UTIL = (totalPT / TFT) * 100;

  const MAX_T = Math.max(...tardiness);
  const AVG_T = TT / n;
  const DELAY = tardiness.filter(t=>t>0).length;

  return {
    rule, TFT, TT, AVG_CT,
    AVG_SYS, UTIL, MAX_T, AVG_T, DELAY
  };
});

  // ===== COMPARISON (FINAL CORRECT) =====
 // ===== FINAL COMPARISON (EXACT PYTHON MATCH) =====

const n = rules.length;

let comparison = Array.from({ length: n }, () => Array(n).fill("-"));
let ssim = Array.from({ length: n }, () => Array(n).fill("-"));
let rm = Array.from({ length: n }, () => Array(n).fill(0));

const usedAttrs = ["TFT","AVG_CT","AVG_SYS","UTIL"];

for(let i=0;i<n;i++){
  for(let j=0;j<n;j++){

    if(i === j){
      rm[i][j] = 1;
      continue;
    }

    if(i < j){

      let wi = 0;
      let wj = 0;

      usedAttrs.forEach(attr => {

        const a = performance[i][attr];
        const b = performance[j][attr];

        // 🔥 EXACT PYTHON LOGIC
        if(a > b) wi++;
        else if(b > a) wj++;

      });

      comparison[i][j] = `${wi}-${wj}`;

      if(wi > wj){
        ssim[i][j] = "V";
        rm[i][j] = 1;
        rm[j][i] = 0;
      }
      else if(wj > wi){
        ssim[i][j] = "A";
        rm[i][j] = 0;
        rm[j][i] = 1;
      }
      else{
        ssim[i][j] = "X";
        rm[i][j] = 1;
        rm[j][i] = 1;
      }
    }
  }
}

// ===== FRM =====
    let frm = JSON.parse(JSON.stringify(rm));

    for(let k=0;k<n;k++){
      for(let i=0;i<n;i++){
        for(let j=0;j<n;j++){
          if(frm[i][k] && frm[k][j]){
            frm[i][j] = 1;
          }
        }
      }
    }

    // ===== DRIVING =====
    const driving = frm.map(row => row.reduce((a,b)=>a+b,0));

// ===== LEVEL PARTITION (FIXED) =====

let remaining = [...Array(n).keys()];
let elementLevels = Array(n).fill(0);
let level = 1;
let levelData = [];

while (remaining.length > 0) {

  let found = [];

  remaining.forEach(i => {

    let reach = [];
    let ante = [];

    remaining.forEach(j => {
      if(frm[i][j] === 1) reach.push(j);
      if(frm[j][i] === 1) ante.push(j);
    });

    let intersection = reach.filter(x => ante.includes(x));

    if (
      reach.length === intersection.length &&
      reach.every(x => intersection.includes(x))
    ) {
      found.push(i);
    }

  });

  if(found.length === 0){
    throw new Error("Cycle detected in rules logic");
  }

  found.forEach(f => {

    let reachAll = [];
    let anteAll = [];

    for(let j=0;j<n;j++){
      if(frm[f][j] === 1) reachAll.push(rules[j]);
      if(frm[j][f] === 1) anteAll.push(rules[j]);
    }

    let interAll = reachAll.filter(x => anteAll.includes(x));

    levelData.push({
      rule: rules[f],
      reach: reachAll.join(", "),
      ante: anteAll.join(", "),
      inter: interAll.join(", "),
      level: level
    });

    elementLevels[f] = level; // ✅ FIXED
  });

  remaining = remaining.filter(i => !found.includes(i));

  level++;
}
// ===== CONICAL MATRIX (CM) =====
// sort by level
let sortedIndices = [...Array(n).keys()].sort(
  (a, b) => elementLevels[a] - elementLevels[b]
);

// sorted rule names
let sortedRules = sortedIndices.map(i => rules[i]);

// build CM
let cm = Array.from({ length: n }, () => Array(n).fill(0));

for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    cm[i][j] = frm[sortedIndices[i]][sortedIndices[j]];
  }

} 
// ===== REDUCED CM =====

let rcm = cm.map(row => [...row]);

for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {

    if (i === j) {
      rcm[i][j] = 0;
    } else {

      const li = elementLevels[sortedIndices[i]];
      const lj = elementLevels[sortedIndices[j]];

      // remove backward + skip levels
      if (li < lj) {
        rcm[i][j] = 0;
      }
      else if (li - lj > 1) {
        rcm[i][j] = 0;
      }
    }
  }
}

// ===== MICMAC =====

let dependence = frm.map((_, colIndex) =>
  frm.reduce((sum, row) => sum + row[colIndex], 0)
);

let micmac = rules.map((rule, i) => ({
  rule,
  driving: driving[i],
  dependence: dependence[i]
}));

// ===== DIGRAPH =====

let digraph = [];

for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {

    if (rcm[i][j] === 1) {
      digraph.push({
        from: sortedRules[i],
        to: sortedRules[j]
      });
    }
  }
}

return {
  performance,
  comparison,
  ssim,
  rm,
  frm,
  driving,
  levelData,
  elementLevels,
  cm,
  rcm,
  sortedRules,
  micmac,
  digraph,
  sortedIndices
};

  }

  // ================= RUN LOGIC =================
 const {
  performance,
  comparison,
  ssim,
  rm,
  frm,
  driving,
    levelData,
  elementLevels,
  cm,
  rcm,
  sortedRules,
  micmac,
  digraph,
  sortedIndices
} = useMemo(() => {
  return calculateAllResults(jobs, rules, attributes);
}, [jobs, rules, attributes]);

  // ================= UI =================
  return (
    <div className="p-6 bg-gray-200 min-h-screen space-y-8">

     <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center rounded-lg">

  {/* LEFT: TITLE */}
  <h1 className="text-xl font-bold text-gray-700">
    Scheduling ISM Complete Report
  </h1>

  {/* RIGHT: ACTION BUTTONS */}
  <div className="flex gap-3">

    {/* DASHBOARD */}
    <button
      onClick={onBack}
      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
    >
      🏠 Dashboard
    </button>

    {/* PRINT */}
    <button
      onClick={() => window.print()}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
    >
      🖨 Print
    </button>

  </div>
</div>

      <button onClick={onBack} className="bg-gray-500 text-white px-4 py-2 rounded">
        ← Back to Input
      </button>

      {/* ================= PERFORMANCE ================= */}
      <Section title="1. Performance Attributes Matrix">
        <Table headers={["Rule","TFT","TT","AVG_CT","AVG_SYS","UTIL","MAX_T","AVG_T","DELAY"]}>
          {performance.map((p,i)=>(
            <tr key={i}>
              <td>{p.rule}</td>
              <td>{p.TFT.toFixed(1)}</td>
              <td>{p.TT}</td>
              <td>{p.AVG_CT.toFixed(2)}</td>
              <td>{p.AVG_SYS.toFixed(4)}</td>
              <td>{p.UTIL.toFixed(4)}</td>
              <td>{p.MAX_T}</td>
              <td>{p.AVG_T.toFixed(2)}</td>
              <td>{p.DELAY}</td>
            </tr>
          ))}
        </Table>
      </Section>

      {/* ================= COMPARISON ================= */}
      <Section title="2. Rule Comparison & Points Table">
        <Table headers={["Rule",...rules]}>
          {rules.map((r,i)=>(
            <tr key={i}>
              <td>{r}</td>
              {rules.map((_,j)=>(
                <td key={j}>{i<j ? comparison[i][j] : "-"}</td>
              ))}
            </tr>
          ))}
        </Table>
      </Section>

      {/* ================= SSIM ================= */}
      <Section title="3. Auto-Generated SSIM">
        <Table headers={["Rule",...rules]}>
          {rules.map((r,i)=>(
            <tr key={i}>
              <td>{r}</td>
              {rules.map((_,j)=>(
                <td key={j}>{i<j ? ssim[i][j] : "-"}</td>
              ))}
            </tr>
          ))}
        </Table>
      </Section>

      {/* ================= RM ================= */}
      <Section title="4. Initial Reachability Matrix (RM)">
        <Table headers={["Rule",...rules,"Driving Power"]}>
          {rules.map((r,i)=>(
            <tr key={i}>
              <td>{r}</td>
              {rules.map((_,j)=>(
                <td key={j}>{rm[i][j]}</td>
              ))}
              <td>{rm[i].reduce((a,b)=>a+b,0)}</td>
            </tr>
          ))}
        </Table>
      </Section>

      {/* ================= FRM ================= */}
      <Section title="5. Final Reachability Matrix (FRM)">
        <Table headers={["Rule",...rules,"Driving Power"]}>
          {rules.map((r,i)=>(
            <tr key={i}>
              <td>{r}</td>
              {rules.map((_,j)=>(
                <td key={j}>{frm[i][j]}</td>
              ))}
              <td>{driving[i]}</td>
            </tr>
          ))}
        </Table>
      </Section>

{/* ================= LEVEL ================= */}
<Section title="6. Level Partitioning Iterations">
  <Table headers={["Rule","Reachability","Antecedent","Intersection","Level"]}>
    {levelData && levelData.length > 0 ? (
      levelData.map((row, i) => (
        <tr key={i}>
          <td>{row.rule}</td>
          <td>{row.reach}</td>
          <td>{row.ante}</td>
          <td>{row.inter}</td>
          <td>{row.level}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="5">No Level Data</td>
      </tr>
    )}
  </Table>
</Section>

<Section title="7. Conical Matrix (CM)">
  <Table headers={["Rule", ...sortedRules, "Level"]}>
    {cm.map((row, i) => (
      <tr key={i}>
        <td>{sortedRules[i]}</td>

        {row.map((val, j) => (
          <td key={j}>{val}</td>
        ))}

        {/* ✅ ADD LEVEL COLUMN */}
        <td>{elementLevels[sortedIndices[i]]}</td>
      </tr>
    ))}
  </Table>
</Section>

<Section title="8. Reduced Conical Matrix (RCM)">
  <Table headers={["Rule", ...sortedRules, "Level"]}>
    {rcm.map((row, i) => (
      <tr key={i}>
        <td>{sortedRules[i]}</td>

        {row.map((val, j) => (
          <td key={j}>{val}</td>
        ))}

        {/* ✅ ADD LEVEL COLUMN */}
        <td>{elementLevels[sortedIndices[i]]}</td>
      </tr>
    ))}
  </Table>
</Section>

<Section title="9. Visual Models">
  <div style={{ display: "flex", gap: "40px", justifyContent: "space-between" }}>

    {/* ===== MICMAC ===== */}
    <div style={{ width: "50%" }}>
      <h3 style={{ textAlign: "center", color: "#166534" }}>
        Rule Scheduling MICMAC
      </h3>

      <svg width={500} height={400} style={{ background: "#fff" }}>

        {/* QUADRANTS */}
        <rect x="0" y="200" width="250" height="200" fill="#e5e7eb" />
        <rect x="250" y="200" width="250" height="200" fill="#d1fae5" />
        <rect x="250" y="0" width="250" height="200" fill="#fecaca" />
        <rect x="0" y="0" width="250" height="200" fill="#fef9c3" />

        {/* CENTER LINES */}
        <line x1="250" y1="0" x2="250" y2="400" stroke="black" />
        <line x1="0" y1="200" x2="500" y2="200" stroke="black" />

        {/* LABELS */}
        <text x="20" y="380">I Autonomous</text>
        <text x="320" y="380">II Dependent</text>
        <text x="320" y="20">III Linkage</text>
        <text x="20" y="20">IV Independent</text>

        {/* POINTS */}
        {micmac.map((p, i) => {
          const x = p.dependence * 60;
          const y = 400 - p.driving * 60;

          return (
            <g key={i}>
              <circle cx={x} cy={y} r="8" fill="#0f766e" />
              <text x={x + 8} y={y - 5} fontSize="12">
                {p.rule}
              </text>
            </g>
          );
        })}

        {/* AXIS LABELS */}
        <text x="200" y="395">Dependence Power</text>
        <text x="10" y="200" transform="rotate(-90 10 200)">
          Driving Power
        </text>

      </svg>
    </div>
    </div>
</Section>

<Section title="10. Digraph (Visual)">
  <div style={{ display: "flex", justifyContent: "center", overflowX: "auto" }}>

    {(() => {

      const levelMap = {};

      sortedIndices.forEach((node) => {
        const lvl = elementLevels[node];
        if (!levelMap[lvl]) levelMap[lvl] = [];
        levelMap[lvl].push(node);
      });

      const levels = Object.keys(levelMap).sort((a, b) => a - b);

      const heightGap = 100;
      const dynamicHeight = (levels.length + 1) * heightGap;
      const width = 600;

      let positions = {};

      levels.forEach((lvl, idx) => {
        const nodes = levelMap[lvl];

        const gap = width / (nodes.length + 1);
        const y = (idx + 1) * heightGap;

        nodes.forEach((node, i) => {
          positions[node] = {
            x: gap * (i + 1),
            y: y
          };
        });
      });

      return (
        <svg width="100%" height={dynamicHeight} style={{ background: "#fff" }}>

          {/* LEVEL LINES */}
          {levels.map((lvl, idx) => {
            const y = (idx + 1) * heightGap;

            return (
              <g key={lvl}>
                <line
                  x1="0"
                  y1={y}
                  x2={width}
                  y2={y}
                  stroke="#94a3b8"
                  strokeDasharray="5,5"
                />
                <text x="10" y={y - 5} fontSize="12">
                  Level {lvl}
                </text>
              </g>
            );
          })}

          {/* ARROW MARKER */}
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto">
              <path d="M0,0 L10,3 L0,6 Z" fill="#334155" />
            </marker>
          </defs>

          {/* EDGES */}
          {digraph.map((d, i) => {
            const fromIndex = rules.indexOf(d.from);
            const toIndex = rules.indexOf(d.to);

            const from = positions[fromIndex];
            const to = positions[toIndex];

            if (!from || !to) return null;

            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#334155"
                strokeWidth="1.5"
                markerEnd="url(#arrow)"
              />
            );
          })}

          {/* NODES */}
          {sortedIndices.map((node, i) => {
            const pos = positions[node];

            return (
              <g key={i}>
                <rect
                  x={pos.x - 30}
                  y={pos.y - 20}
                  width="60"
                  height="35"
                  rx="8"
                  fill="#e0f2fe"
                  stroke="#0284c7"
                />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {rules[node]}
                </text>
              </g>
            );
          })}

        </svg>
      );
    })()}

  </div>
</Section>    </div>
  );
}


// ===== UI HELPERS =====
function Section({ title, children }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4 text-teal-700">{title}</h2>
      {children}
    </div>
  );
}

function Table({ headers, children }) {
  return (
    <table className="w-full border text-center">
      <thead className="bg-teal-700 text-white">
        <tr>
          {headers.map((h,i)=>(
            <th key={i} className="border px-2 py-1">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

