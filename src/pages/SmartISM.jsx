import { useNavigate } from "react-router-dom";

export default function SmartISM() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* 🔥 HEADER */}
      <div className="bg-white border-b shadow-sm px-6 py-4 flex items-center gap-4">
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-lg font-semibold text-gray-800">
          Smart ISM
        </h1>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div className="flex-1 flex items-center justify-center px-4">

        <div className="bg-white shadow-md rounded-xl p-10 w-full max-w-md text-center">

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Smart ISM Tool
          </h2>

          <p className="text-gray-500 mb-8">
            Choose how you want to provide your variables
          </p>

          {/* Buttons */}
          <div className="space-y-4">

            {/* Manual */}
            <button
              onClick={() => navigate("/smart-ism/input?mode=manual")}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              <span>✍️</span>
              Manual Input
            </button>

            {/* Upload */}
            <button
              onClick={() => navigate("/smart-ism/input?mode=upload")}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              <span>📂</span>
              Upload File
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}