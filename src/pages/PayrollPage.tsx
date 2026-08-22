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
        // If employee, only fetch their own records. If Admin/HR, fetch all based on filters.
        const employeeIdFilter = !isAdminOrHr ? user?.employeeId : undefined;
        const records = await getPayrollRecords(month || undefined, year || undefined, employeeIdFilter);
        
        // Apply client-side search filter for admin/hr
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {isAdminOrHr ? 'Payroll Management' : 'My Payroll'}
        </h1>
        <p className="text-gray-500 mt-1">
          {isAdminOrHr 
            ? 'Manage and view payroll for all employees across the organization.' 
            : 'View your salary history and download your salary slips.'}
        </p>
      </div>

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
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-100">
          {error}
        </div>
      ) : (
        <PayrollTable 
          payrollRecords={payrollData} 
          isLoading={isLoading} 
          onViewSlip={handleViewSlip} 
        />
      )}
    </div>
  );
};
