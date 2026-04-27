import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function CommonHeader({ title, onBack }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">

      {/* 🔹 TOP NAV */}
      <div className="flex items-center gap-5 text-sm">

        {/* DASHBOARD */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-semibold text-gray-800 hover:text-blue-600 transition"
        >
          <span className="text-lg"><Home size={18} /></span>
          Dashboard
        </button>

        <span className="text-gray-300">|</span>

        {/* BACK */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-semibold text-gray-800 hover:text-blue-600 transition"
        >
          <span className="text-lg"><ArrowLeft size={18} /></span>
          Back
        </button>

      </div>

      {/* 🔹 TITLE */}
      <div className="mt-3">
        <h1 className="text-xl font-semibold text-gray-900">
          {title}
        </h1>
      </div>

    </div>
  );
}