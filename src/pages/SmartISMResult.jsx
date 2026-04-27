import { useLocation, useNavigate } from "react-router-dom";

// ✅ COMPONENTS
import SSIMView from "../components/ism/SSIMView";
import RMTable from "../components/ism/RMTable";
import FRMTable from "../components/ism/FRMTable";
import LevelPartition from "../components/ism/LevelPartition";
import ConicalMatrices from "../components/ism/ConicalMatrix";
import Digraph from "../components/ism/Digraph";
import MicmacGraph from "../components/ism/MICMACGraph";

export default function SmartISMResult() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { grid, result = {} } = state || {};

  if (!grid) {
    return <div className="p-6 text-red-500">No data found</div>;
  }

  const variables = grid?.slice(1)?.map((row) => row[0]) || [];
const frm = result?.frm;

let rcm = [];
let sortedIndices = [];

if (frm) {
  const n = frm.length;

  function calculateLevels(matrix) {
    let remaining = [...Array(n).keys()];
    let levels = Array(n).fill(0);
    let level = 1;

    while (remaining.length > 0) {
      let found = [];

      for (let i of remaining) {
        const reach = remaining.filter(j => matrix[i][j] === 1);
        const ante = remaining.filter(j => matrix[j][i] === 1);

        const intersection = reach.filter(x => ante.includes(x));

        if (
          reach.length === intersection.length &&
          reach.every(x => intersection.includes(x))
        ) {
          found.push(i);
        }
      }

      if (found.length === 0) found = [...remaining];

      found.forEach(f => levels[f] = level);
      remaining = remaining.filter(x => !found.includes(x));
      level++;
    }

    return levels;
  }

  const levels = calculateLevels(frm);

  sortedIndices = [...Array(n).keys()].sort(
    (a, b) => levels[a] - levels[b]
  );

  rcm = sortedIndices.map((i, idx_i) =>
    sortedIndices.map((j, idx_j) => {

      if (idx_i === idx_j) return 0;

      const lvl_i = levels[i];
      const lvl_j = levels[j];

      if (lvl_i <= lvl_j) return 0;
      if (lvl_i - lvl_j !== 1) return 0;

      return frm[i][j] === 1 ? 1 : 0;
    })
  );
}
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 print:bg-white">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        
        <div className="flex gap-3">
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2"
          >
            
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>
          
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>

        <h1 className="text-2xl font-bold text-green-700">
          Smart ISM Complete Report
        </h1>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-200"
        >
          Print Full Report
        </button>
      </div>

      {/* ================= SSIM ================= */}
      <Section title="Structural Self-Interaction Matrix (SSIM)">
        <SSIMView grid={grid} />
      </Section>

      {/* ================= RM ================= */}
      {result?.rm && (
        <Section title="Initial Reachability Matrix (RM)">
          <RMTable matrix={result.rm} variables={variables} />
        </Section>
      )}

      {/* ================= FRM ================= */}
      {result?.frm && (
        <Section title="Final Reachability Matrix (FRM)">
          <FRMTable
            matrix={result.frm}
            drivingPower={result.frmDriving}
            dependencePower={result.frmDependence}
            variables={variables}
          />
        </Section>
      )}

      {/* ================= LEVEL ================= */}
      {result?.frm && (
        <Section title="Level Partitioning Iterations (LP)">
          <LevelPartition
            frm={result.frm}
            variables={variables}
          />
        </Section>
      )}

      {/* ================= CM + RCM ================= */}
      {result?.frm && (
        <Section title="Conical & Reduced Conical Matrix">
          <ConicalMatrices
            frm={result.frm}
            variables={variables}
          />
        </Section>
      )}

      {/* ================= DIGRAPH ================= */}
      {result?.frm && (
        <Section title="Digraph">
         <Digraph
  rcm={rcm}
  variables={sortedIndices.map(i => variables[i])}
/>
        </Section>
      )}

      {result?.frm && (
        <Section title="MICMAC Analysis">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <MicmacGraph frm={result.frm} variables={variables} />
            </div>
          </div>
        </Section>
      )}

    </div>
  );
}

/* ================= SECTION ================= */

function Section({ title, children }) {
  return (
    <div className="mb-8 bg-white p-6 rounded-xl shadow">
      <h2 className="text-green-700 font-semibold mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}