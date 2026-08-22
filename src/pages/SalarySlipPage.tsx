import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SalarySlip } from '../components/payroll/SalarySlip';
import { getPayrollById } from '../services/payrollService';
import type { Payroll } from '../types/payroll';
import { ArrowLeft } from 'lucide-react';

export const SalarySlipPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [payroll, setPayroll] = useState<Payroll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlip = async () => {
      setIsLoading(true);
      try {
        if (!id) throw new Error("Invalid ID");
        const data = await getPayrollById(id);
        
        if (!data) {
          setError("Salary slip not found.");
          return;
        }

        // Authorization Check
        if (user?.role === 'employee' && data.employeeId !== user.employeeId) {
          setError("You do not have permission to view this salary slip.");
          return;
        }

        setPayroll(data);
      } catch (err) {
        setError("Unable to load salary slip.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlip();
  }, [id, user]);

  return (
    <div>
      <div className="mb-6 print:hidden">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Payroll
        </button>
      </div>

      {isLoading && (
        <div className="flex h-64 items-center justify-center text-gray-500">
          Loading salary slip...
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-100 max-w-3xl mx-auto">
          {error}
        </div>
      )}

      {payroll && !isLoading && !error && (
        <SalarySlip payroll={payroll} />
      )}
    </div>
  );
};
