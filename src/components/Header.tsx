import { Scale, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="glass border-b border-indigo-500/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">LegalFab</h1>
            <p className="text-xs text-slate-400">Knowledge Fabric Intelligence</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-slate-200">MiniKF Demo</span>
        </div>
      </div>
    </header>
  );
}
