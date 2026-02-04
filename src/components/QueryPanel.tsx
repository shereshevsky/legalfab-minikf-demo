import { Search } from 'lucide-react';

interface QueryPanelProps {
  query: string;
}

export function QueryPanel({ query }: QueryPanelProps) {
  return (
    <div className="flex-1 glass rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <Search className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-slate-400 mb-1">User Query</p>
          <p className="text-sm text-slate-200 leading-relaxed">{query}</p>
        </div>
      </div>
    </div>
  );
}
