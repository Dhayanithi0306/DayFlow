import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search records...',
  className = '',
}) => {
  const [term, setTerm] = useState(value);

  useEffect(() => {
    setTerm(value);
  }, [value]);

  const handleClear = () => {
    setTerm('');
    onChange('');
  };

  return (
    <div className={`relative rounded-xl shadow-sm ${className}`}>
      <Search size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-9 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
      />
      {term && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
