export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 mt-auto relative overflow-hidden">
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-4 relative z-10">
        
        {/* MAIN FOOTER CONTENT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* BRAND SECTION with logo */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">ISM</span>
              </div>
              <h3 className="text-base font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-300% animate-gradient">
                ISMIC Software
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              ISM & MICMAC decision support system for structured modeling and analysis.
            </p>
          </div>

          {/* INSTITUTION SECTION with icon */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Institution
              </h4>
            </div>
            <ul className="space-y-1 text-sm text-gray-400">
              <li className="hover:text-blue-400 transition-colors cursor-default">Fr. Conceicao Rodrigues Institute of Technology</li>
              <li className="hover:text-blue-400 transition-colors cursor-default">Mechanical Engineering</li>
              <li className="hover:text-blue-400 transition-colors cursor-default">Mumbai, India</li>
            </ul>
          </div>

          {/* TEAM SECTION with icon */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Team
              </h4>
            </div>
            <ul className="space-y-1 text-sm text-gray-400">
              <li className="group flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="group-hover:text-blue-400 transition-colors">Aamin Inamdar</span>
              </li>
              <li className="group flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="group-hover:text-purple-400 transition-colors">Anjali Kamble</span>
              </li>
              <li className="group flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="group-hover:text-blue-400 transition-colors">Bumit Patil</span>
              </li>
              <li className="group flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="group-hover:text-purple-400 transition-colors">Vishal Longre</span>
              </li>
            </ul>
          </div>

          {/* QUICK LINKS SECTION with hover effects */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m1.858-3.828a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102" />
              </svg>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Quick Links
              </h4>
            </div>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="#" className="group flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:translate-x-1">
                  <span className="transform transition-transform group-hover:translate-x-0.5">→</span>
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-all duration-300 hover:translate-x-1">
                  <span className="transform transition-transform group-hover:translate-x-0.5">→</span>
                  About ISM
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-all duration-300 hover:translate-x-1">
                  <span className="transform transition-transform group-hover:translate-x-0.5">→</span>
                  Support
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* DIVIDER with gradient */}
        <div className="mt-4 pt-3">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          
          {/* BOTTOM BAR with social links */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500 mt-3">
            
            <span className="flex items-center gap-1">
              <span className="animate-pulse">●</span>
              © {new Date().getFullYear()} ISMIC Software
            </span>

            <div className="flex gap-4 items-center">
              <a href="#" className="hover:text-blue-400 transition-all hover:scale-105 inline-block">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-purple-400 transition-all hover:scale-105 inline-block">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.913-11.61c0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <span className="text-gray-700">|</span>
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
              <span>•</span>
              <span className="relative">
                <span className="absolute inset-0 blur-sm bg-gradient-to-r from-blue-500 to-purple-500 opacity-50"></span>
                <span className="relative bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">
                  Academic Project
                </span>
              </span>
            </div>

          </div>
        </div>

      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </footer>
  );
}