export default function SSIMGrid({ grid, onChange }) {
  const getStatusStyle = (value) => {
    switch(value) {
      case 'V': return 'text-emerald-700 bg-emerald-50';
      case 'A': return 'text-blue-700 bg-blue-50';
      case 'X': return 'text-gray-500 bg-gray-50';
      case 'O': return 'text-amber-700 bg-amber-50';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header with subtle gradient */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">SSIM Matrix</h3>
              <p className="text-xs text-gray-500 mt-0.5">Variable relationship grid</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
            <span className="text-xs text-gray-500">Interactive</span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <tbody>
            {grid.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                {row.map((cell, j) => {
                  const isHeader = i === 0 || j === 0;
                  const isCorner = i === 0 && j === 0;
                  const statusStyle = !isHeader && cell ? getStatusStyle(cell) : '';
                  
                  return (
                    <td 
                      key={j} 
                      className={`
                        px-4 py-3 border-r border-gray-100 last:border-r-0
                        ${isHeader ? 'bg-gray-50/80' : ''}
                        ${!isHeader && !isCorner ? 'hover:bg-gray-50' : ''}
                      `}
                    >
                      {isCorner ? (
                        <div className="flex items-center justify-center w-20">
                          <span className="text-xs font-mono text-gray-400">↘︎</span>
                        </div>
                      ) : isHeader ? (
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => onChange(i, j, e.target.value)}
                          placeholder="Variable"
                          className="w-28 px-2 py-1.5 text-sm text-gray-700 border border-gray-200 rounded-md focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none transition-all bg-white hover:border-gray-300"
                        />
                      ) : (
                        <div className="relative">
                          <select
                            value={cell}
                            onChange={(e) => onChange(i, j, e.target.value)}
                            className={`
                              w-28 px-3 py-1.5 text-sm rounded-md appearance-none cursor-pointer transition-all
                              border focus:outline-none focus:ring-2 focus:ring-gray-200
                              ${cell 
                                ? `${statusStyle} border-transparent` 
                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                              }
                            `}
                          >
                            <option value="" className="text-gray-400">Select</option>
                            <option value="V" className="text-emerald-700">✓</option>
                            <option value="A" className="text-blue-700">● </option>
                            <option value="X" className="text-gray-500">✗</option>
                            <option value="O" className="text-amber-700">○</option>
                          </select>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend with subtle styling */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="text-xs font-medium text-gray-500">Status</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-gray-600"> (V)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600"> (A)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <span className="text-xs text-gray-600"> (X)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-xs text-gray-600"> (O)</span>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-gray-400">
            {grid.length} × {grid[0]?.length || 0} grid
          </div>
        </div>
      </div>
    </div>
  );
}