import React, { useState } from 'react';
import { Search, Sparkles, Filter, ArrowRight, FileText, Folder, User, CheckCircle2 } from 'lucide-react';
import { mockGlobalSearchResults } from '../../data/knowledgeData';
import { GlobalSearchResult } from '../../types';
import { useApp } from '../../context/AppContext';

export const GlobalSearchView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [results, setResults] = useState<GlobalSearchResult[]>(mockGlobalSearchResults);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) {
      setResults(mockGlobalSearchResults);
      return;
    }
    const filtered = mockGlobalSearchResults.filter(
      (r) =>
        r.title.toLowerCase().includes(val.toLowerCase()) ||
        r.snippet.toLowerCase().includes(val.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Search className="w-4 h-4" />
            Universal Search Engine
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Global Enterprise Search</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Instant hybrid vector & keyword search across projects, tasks, RAG documents, reports, and knowledge base.
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search tasks, sprint velocity, RAG articles, or compliance docs..."
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 rounded-xl border border-zinc-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {['All', 'Sprint', 'Document', 'Report', 'Task'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                filterType === type
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results List */}
      <div className="space-y-3">
        {results
          .filter((r) => filterType === 'All' || r.type === filterType)
          .map((res) => (
            <div
              key={res.id}
              onClick={() => setActiveTab(res.urlTab as any)}
              className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex items-start justify-between gap-4 group"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[10px] rounded-full uppercase">
                    {res.type}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Match: {Math.round(res.relevanceScore * 100)}%
                  </span>
                </div>
                <h3 className="font-bold text-zinc-900 text-base group-hover:text-indigo-600 transition-colors">
                  {res.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">{res.snippet}</p>
              </div>

              <div className="p-2 bg-zinc-50 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all text-zinc-400 shrink-0">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
