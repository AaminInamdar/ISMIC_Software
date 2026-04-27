import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const navigate = useNavigate();

  const methods = [
    {
      title: "Smart ISM",
      desc: "Structural modeling & MICMAC analysis",
      path: "/smart-ism",
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "BHARAT Method",
      desc: "Ranking using weighted evaluation",
      path: "/bharat",
      color: "from-green-500 to-green-700",
    },
    {
      title: "PSI Method",
      desc: "Preference selection index ranking",
      path: "/psi",
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "ISM Sequencing",
      desc: "Sequence-based modeling",
      path: "/ism-seq",
      color: "from-orange-500 to-orange-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">

      <h1 className="text-5xl font-bold mb-3 tracking-wide">
        ISMIC Software
      </h1>

      <p className="text-gray-400 mb-12">
        Integrated Decision Support System
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">

        {methods.map((method, index) => (
          <div
            key={index}
            onClick={() => navigate(method.path)}
            className={`bg-gradient-to-r ${method.color} p-8 rounded-2xl shadow-xl cursor-pointer transform hover:scale-105 transition duration-300`}
          >
            <h2 className="text-2xl font-semibold mb-2">
              {method.title}
            </h2>
            <p className="text-white/80 text-sm">
              {method.desc}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}