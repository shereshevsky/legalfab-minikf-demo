import { Scale, Sparkles, ChevronDown } from 'lucide-react';

export type DemoType = 'billing' | 'engagement' | 'reputation';

interface HeaderProps {
  selectedDemo: DemoType;
  onDemoChange: (demo: DemoType) => void;
}

const DEMO_OPTIONS = [
  { value: 'billing' as DemoType, label: 'WIP & Billing Analysis' },
  { value: 'engagement' as DemoType, label: 'Client Engagement & Market Insights' },
  { value: 'reputation' as DemoType, label: 'Reputational Risk Analysis' },
];

export function Header({ selectedDemo, onDemoChange }: HeaderProps) {
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

        <div className="flex items-center gap-4">
          {/* Demo Selector */}
          <div className="relative">
            <select
              value={selectedDemo}
              onChange={(e) => onDemoChange(e.target.value as DemoType)}
              className="appearance-none glass rounded-lg px-4 py-2 pr-10 text-sm font-medium text-slate-200 bg-slate-800/50 border border-slate-600/50 hover:border-indigo-500/50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 cursor-pointer transition-colors"
            >
              {DEMO_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-slate-800">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-slate-200">MiniKF Demo</span>
          </div>
        </div>
      </div>
    </header>
  );
}
