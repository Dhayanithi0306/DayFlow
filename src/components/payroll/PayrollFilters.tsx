import React from 'react';
import { Search, Filter } from 'lucide-react';

interface PayrollFiltersProps {
  month: string;
  year: number;
  searchQuery: string;
  onMonthChange: (month: string) => void;
  onYearChange: (year: number) => void;
  onSearchChange: (query: string) => void;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEARS = [2022, 2023, 2024];

export const PayrollFilters: React.FC<PayrollFiltersProps> = ({
  month, year, searchQuery, onMonthChange, onYearChange, onSearchChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-b border-gray-100 gap-4">
      <div className="relative w-full sm:w-96">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border-none bg-gray-50 rounded-full text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow"
          placeholder="Search by Employee ID, name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <Filter className="h-4 w-4 text-gray-400 hidden sm:block mr-1" />
        <select
          value={month}
          onChange={(e) => onMonthChange(e.target.value)}
          className="block w-full sm:w-auto pl-4 pr-8 py-2 border border-gray-200 bg-white rounded-full text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
        >
          <option value="">All Months</option>
          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="block w-full sm:w-auto pl-4 pr-8 py-2 border border-gray-200 bg-white rounded-full text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
        >
          <option value="">All Years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
    </div>
  );
};
