import { FC } from 'react'

const Home: FC = () => {
  return (
    <div className="w-[360px] bg-gradient-to-br from-slate-50 to-white p-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-40 h-40 bg-purple-100/30 rounded-full -top-20 -right-20 blur-xl animate-pulse" />
        <div className="absolute w-32 h-32 bg-blue-100/20 rounded-full -bottom-16 -left-16 blur-xl animate-pulse delay-700" />
      </div>

      {/* Glass Container */}
      <div className="relative backdrop-blur-sm bg-white/70 rounded-2xl p-5 shadow-lg border border-white/50">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 text-purple-800">
            <div className="p-2 bg-purple-100 rounded-lg shadow-inner">
              <img src="/icons/shield.svg" alt="Shield" className="w-6 h-6 animate-pulse" />
            </div>
            <span className="font-semibold text-xl tracking-tight">BioVault</span>
          </div>
          <button className="p-2 rounded-lg hover:bg-purple-50 transition-all duration-300 active:scale-95">
            <img src="/icons/settings.svg" alt="Settings" className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-white/80 border border-slate-200 p-3 rounded-xl mb-6 shadow-inner hover:border-purple-200 transition-colors">
          <img src="/icons/search.svg" alt="Search" className="w-5 h-5 opacity-50" />
          <input 
            type="text" 
            placeholder="Search passwords..." 
            className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-400" 
          />
        </div>

        {/* Biometric Auth */}
        <div className="mb-6">
          <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-700 to-purple-800 text-white py-4 rounded-xl hover:opacity-95 transition-all duration-300 shadow-lg active:scale-[0.99] group">
            <img src="/icons/fingerprint.svg" alt="Fingerprint" className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="font-medium tracking-wide">Authenticate with Biometrics</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: 'plus.svg', text: 'Add Password' },
            { icon: 'import.svg', text: 'Import from Google' }
          ].map((action, i) => (
            <button key={i} className="flex items-center justify-center gap-2 bg-white border border-slate-200 p-3 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all duration-300 shadow-sm active:scale-[0.98]">
              <img src={`/icons/${action.icon}`} alt={action.text} className="w-5 h-5 opacity-70" />
              <span className="text-sm font-medium text-slate-700">{action.text}</span>
            </button>
          ))}
        </div>

        {/* Password List */}
        <div>
          <div className="font-semibold text-slate-800 mb-3 px-1">Recent Passwords</div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-white/80 border border-slate-200 p-4 rounded-xl hover:border-purple-200 transition-all duration-300 group">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6 rounded-lg shadow-sm" />
              <div className="flex-1">
                <div className="font-medium text-slate-800">Google Account</div>
                <div className="text-xs text-slate-500">user@example.com</div>
              </div>
              <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-purple-50 transition-all duration-300">
                <img src="/icons/copy.svg" alt="Copy" className="w-[18px] h-[18px] opacity-70" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home