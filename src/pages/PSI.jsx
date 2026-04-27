import { useState } from "react";
import CommonHeader from "../components/CommonHeader";

import PSIInput from "../components/psi/PSIInput";
import PSIMatrix from "../components/psi/PSIMatrix";
import PSIConfig from "../components/psi/PSIConfig";
import PSIResults from "../components/psi/PSIResults";

export default function PSI() {
  const [step, setStep] = useState(1);

  const [jobData, setJobData] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [types, setTypes] = useState({});

  return (
    <div className="bg-gray-100 min-h-screen">

      <CommonHeader
        title="PSI Method Workspace"
        subtitle="Preference Selection Index"
        onBack={() => {
          if (step > 1) setStep(step - 1);
          else window.location.href = "/";
        }}
      />

      {/* STEP TABS */}
      <div className="flex justify-center mt-4">
        <div className="bg-gray-300 rounded-full px-2 py-1 flex gap-2">

          {[
            "Job Data",
            "Decision Matrix",
            "Criteria Types",
            "Final Results"
          ].map((label, i) => {
            const s = i + 1;

            const disabled =
              (s === 2 && jobData.length === 0) ||
              (s === 3 && matrix.length === 0) ||
              (s === 4 && Object.keys(types).length === 0);

            return (
              <button
                key={i}
                onClick={() => !disabled && setStep(s)}
                className={`px-4 py-1 rounded-full text-sm
                ${step === s
                    ? "bg-blue-700 text-white"
                    : "bg-gray-400"}
                ${disabled && "opacity-50 cursor-not-allowed"}
                `}
              >
                {s}. {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6">

        {step === 1 && (
          <PSIInput onNext={(data) => {
            setJobData(data);
            setStep(2);
          }} />
        )}

        {step === 2 && (
          <PSIMatrix jobData={jobData} onNext={(m) => {
            setMatrix(m);
            setStep(3);
          }} />
        )}

        {step === 3 && (
          <PSIConfig matrix={matrix} onNext={(t) => {
            setTypes(t);
            setStep(4);
          }} />
        )}

        {step === 4 && (
          <PSIResults matrix={matrix} types={types} />
        )}

      </div>
    </div>
  );
}