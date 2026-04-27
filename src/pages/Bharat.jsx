import { useState } from "react";
import CommonHeader from "../components/CommonHeader";

import JobInput from "../components/bharat/JobInput";
import DecisionMatrix from "../components/bharat/DecisionMatrix";
import CriteriaWeights from "../components/bharat/CriteriaWeights";
import BharatResults from "../components/bharat/BharatResults";

export default function Bharat() {
  const [step, setStep] = useState(1);

  const [jobData, setJobData] = useState([]);
  const [matrix, setMatrix] = useState(null);
  const [weights, setWeights] = useState([]);

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ✅ HEADER */}
      <CommonHeader
        title="BHARAT Method"  
        onBack={() => {
  if (step > 1) {
    setStep(step - 1);   // go to previous step
  } else {
    window.location.href = "/";  // go to dashboard
  }
}}
      />

      {/* STEP TABS */}
      <div className="flex justify-center mt-4">
        <div className="bg-gray-300 rounded-full px-2 py-1 flex gap-2">

          {[
            "Job Data & Rules",
            "Decision Matrix",
            "Criteria & Weights",
            "Final Results"
          ].map((label, i) => {
            const stepNumber = i + 1;

            const isDisabled =
              (stepNumber === 2 && jobData.length === 0) ||
              (stepNumber === 3 && (!matrix || matrix.length === 0)) ||
              (stepNumber === 4 && (!weights || weights.length === 0));

            return (
              <button
                key={i}
                onClick={() => {
                  if (!isDisabled) setStep(stepNumber);
                }}
                className={`px-4 py-1 rounded-full text-sm transition
                  ${
                    step === stepNumber
                      ? "bg-blue-700 text-white"
                      : "bg-gray-400 text-black"
                  }
                  ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-600 hover:text-white"
                  }
                `}
              >
                {stepNumber}. {label}
              </button>
            );
          })}

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-6">

        {/* STEP 1 */}
        {step === 1 && (
          <JobInput
            onNext={(data) => {
              setJobData(data);
              setStep(2);
            }}
          />
        )}

        {/* STEP 2 ✅ FIXED (NO CONDITION) */}
        {step === 2 && (
          <DecisionMatrix
            jobData={jobData}
            onNext={(m) => {
              if (!m || m.length === 0) return;
              setMatrix(m);
              setStep(3);
            }}
          />
        )}

        {/* STEP 3 */}
        {step === 3 && (
          matrix && matrix.length > 0 ? (
            <CriteriaWeights
              matrix={matrix}
              onNext={(w) => {
                setWeights(w);
                setStep(4);
              }}
            />
          ) : (
            <Message text="⚠ Please complete Step 2 first" />
          )
        )}

        {/* STEP 4 */}
        {step === 4 && (
          weights && weights.length > 0 ? (
            <BharatResults matrix={matrix} weights={weights} />
          ) : (
            <Message text="⚠ Please complete Step 3 first" />
          )
        )}

      </div>
    </div>
  );
}

/* ✅ MESSAGE COMPONENT */
function Message({ text }) {
  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg text-center text-lg font-medium">
      {text}
    </div>
  );
}