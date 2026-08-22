import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PayrollTable } from '../components/payroll/PayrollTable';
import { PayrollFilters } from '../components/payroll/PayrollFilters';
import { getPayrollRecords } from '../services/payrollService';
import type { Payroll } from '../types/payroll';

export const PayrollPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdminOrHr = user?.role === 'admin' || user?.role === 'hr';

  const [payrollData, setPayrollData] = useState<Payroll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [month, setMonth] = useState('October');
  const [year, setYear] = useState(2023);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPayroll = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const employeeIdFilter = !isAdminOrHr ? user?.employeeId : undefined;
        const records = await getPayrollRecords(month || undefined, year || undefined, employeeIdFilter);
        
        let filteredRecords = records;
        if (isAdminOrHr && searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
          filteredRecords = records.filter(r => 
            r.employeeName.toLowerCase().includes(lowerQuery) || 
            r.employeeId.toLowerCase().includes(lowerQuery)
          );
        }
        
        setPayrollData(filteredRecords);
      } catch (err) {
        setError('Unable to load payroll data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPayroll();
    }
  }, [user, isAdminOrHr, month, year, searchQuery]);

  const handleViewSlip = (payroll: Payroll) => {
    navigate(`/payroll/${payroll.id}/slip`);
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center space-x-2">
            <span>DAYFLOW</span>
            <span className="text-gray-300">/</span>
            <span>{isAdminOrHr ? 'FINANCE & DATA' : 'MY PORTAL'}</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600">{isAdminOrHr ? 'PAYROLL MANAGEMENT' : 'MY PAYROLL'}</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            {isAdminOrHr ? 'Payroll Management' : 'My Payroll'}
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            {isAdminOrHr 
              ? 'Search, filter, view payroll records, and generate salary slips.' 
              : 'View your salary history and download your salary slips.'}
          </p>
        </div>
        {isAdminOrHr && (
          <button className="bg-violet-600 hover:bg-violet-700 transition-colors text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm shadow-violet-200 flex items-center">
            <span className="mr-2 text-lg leading-none font-light">+</span> Run Payroll
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isAdminOrHr && (
          <PayrollFilters
            month={month}
            year={year}
            searchQuery={searchQuery}
            onMonthChange={setMonth}
            onYearChange={setYear}
            onSearchChange={setSearchQuery}
          />
        )}

        {error ? (
          <div className="p-6">
            <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-100 font-medium text-sm">
              {error}
            </div>
          </div>
        ) : (
          <PayrollTable 
            payrollRecords={payrollData} 
            isLoading={isLoading} 
            onViewSlip={handleViewSlip} 
          />
        )}
      </div>
    </div>
  );
};
