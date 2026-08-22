import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400">
      <Link to="/" className="hover:text-slate-600 transition-colors flex items-center gap-1">
        <Home size={13} />
        <span>Home</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={12} className="text-slate-300 shrink-0" />
          {item.href && idx < items.length - 1 ? (
            <Link to={item.href} className="hover:text-slate-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-slate-700">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
