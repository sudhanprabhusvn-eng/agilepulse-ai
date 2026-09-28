import React, { ReactNode } from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryAction?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  secondaryAction,
}) => {
  return (
    <div className="bg-white p-12 rounded-3xl border border-zinc-200/80 shadow-xs text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-2xs">
        <Icon className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
        <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">{description}</p>
      </div>

      {(actionLabel && onAction) || secondaryAction ? (
        <div className="flex items-center gap-3 pt-2">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {actionLabel}
            </button>
          )}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
};
