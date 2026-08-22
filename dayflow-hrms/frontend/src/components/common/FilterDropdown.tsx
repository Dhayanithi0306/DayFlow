import React from 'react';
import { Filter } from 'lucide-react';
import { Select, SelectOption } from './Select';

export interface FilterDropdownProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label = 'Filter',
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Filter size={16} className="text-slate-400 shrink-0" />
      <Select
        options={options}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs py-1.5 min-w-[130px]"
      />
    </div>
  );
};
