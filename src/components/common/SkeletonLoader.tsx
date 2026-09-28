import React from 'react';

interface SkeletonProps {
  type?: 'card' | 'table' | 'text' | 'kpi';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({ type = 'card', count = 3 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => {
        if (type === 'kpi') {
          return (
            <div key={idx} className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-xs space-y-3">
              <div className="h-4 w-24 bg-zinc-200 rounded-md" />
              <div className="h-8 w-32 bg-zinc-300 rounded-lg" />
              <div className="h-3 w-40 bg-zinc-100 rounded-md" />
            </div>
          );
        }

        if (type === 'table') {
          return (
            <div key={idx} className="p-4 bg-white rounded-xl border border-zinc-100 flex items-center justify-between gap-4">
              <div className="h-4 w-1/4 bg-zinc-200 rounded-md" />
              <div className="h-4 w-1/6 bg-zinc-150 rounded-md" />
              <div className="h-4 w-1/5 bg-zinc-200 rounded-md" />
              <div className="h-6 w-16 bg-zinc-250 rounded-full" />
            </div>
          );
        }

        return (
          <div key={idx} className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-xs space-y-3">
            <div className="flex justify-between">
              <div className="h-5 w-1/3 bg-zinc-200 rounded-md" />
              <div className="h-5 w-16 bg-zinc-150 rounded-full" />
            </div>
            <div className="h-3 w-full bg-zinc-100 rounded-md" />
            <div className="h-3 w-2/3 bg-zinc-100 rounded-md" />
          </div>
        );
      })}
    </div>
  );
};
