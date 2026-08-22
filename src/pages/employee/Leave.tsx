import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, Clock, Plus, 
  Filter, FileText, X, CalendarIcon, MessageSquare
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { leaveService } from '../../data/mockLeave';
import type { LeaveRequest, LeaveStatus, LeaveType } from '../../data/mockLeave';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';

export const EmployeeLeavePage: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [summary, setSummary] = useState(leaveService.getLeaveSummary());
  const [balances, setBalances] = useState(leaveService.getLeaveBalances());
  
  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<'All' | LeaveStatus>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | LeaveType>('All');

  // Form State
  const [formData, setFormData] = useState({
    type: 'Paid Leave' as LeaveType,
    startDate: '',
    endDate: '',
    remarks: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRequests(leaveService.getLeaveRequests());
    setSummary(leaveService.getLeaveSummary());
    setBalances(leaveService.getLeaveBalances());
  };

  // Calculate days when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = startOfDay(parseISO(formData.startDate));
      const end = startOfDay(parseISO(formData.endDate));
      const days = differenceInDays(end, start) + 1;
      setCalculatedDays(days > 0 ? days : 0);
    } else {
      setCalculatedDays(0);
    }
  }, [formData.startDate, formData.endDate]);

  const getStatusStyle = (status: LeaveStatus) => {
    switch(status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: LeaveStatus) => {
    switch(status) {
      case 'Approved': return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
      case 'Rejected': return <XCircle className="w-4 h-4 mr-1.5" />;
      case 'Pending': return <Clock className="w-4 h-4 mr-1.5" />;
      default: return null;
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    
    if (!formData.type) errors.type = 'Leave type is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.endDate) errors.endDate = 'End date is required';
    if (calculatedDays <= 0) errors.endDate = 'End date must be after or equal to start date';
    if (formData.remarks.length > 200) errors.remarks = 'Remarks must be under 200 characters';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Submit
    leaveService.createLeaveRequest({
      type: formData.type,
      startDate: new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      endDate: new Date(formData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      days: calculatedDays,
      remarks: formData.remarks
    });

    loadData();
    setIsApplyModalOpen(false);
    
    // Reset form
    setFormData({ type: 'Paid Leave', startDate: '', endDate: '', remarks: '' });
    setFormErrors({});
    
    // Show success
    setSuccessMessage('Leave request submitted successfully.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const filteredRequests = requests.filter(req => {
    const statusMatch = statusFilter === 'All' || req.status === statusFilter;
    const typeMatch = typeFilter === 'All' || req.type === typeFilter;
    return statusMatch && typeMatch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">
      
      {/* Success Notification */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center shadow-sm">
          <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-600" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">My Leave</h1>
          <p className="text-slate-500 mt-1">Manage your time-off requests and leave history.</p>
        </div>
        <Button onClick={() => setIsApplyModalOpen(true)} className="shadow-sm whitespace-nowrap">
          <Plus className="w-5 h-5 mr-2" />
          Apply for Leave
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <span className="text-3xl font-black text-indigo-600">{summary.available}</span>
          <span className="text-sm font-bold text-slate-500 mt-1">Available Leave</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <span className="text-3xl font-black text-amber-600">{summary.pending}</span>
          <span className="text-sm font-bold text-slate-500 mt-1">Pending Requests</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <span className="text-3xl font-black text-emerald-600">{summary.approved}</span>
          <span className="text-sm font-bold text-slate-500 mt-1">Approved Requests</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <span className="text-3xl font-black text-red-600">{summary.rejected}</span>
          <span className="text-sm font-bold text-slate-500 mt-1">Rejected Requests</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* History Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="font-bold text-slate-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" /> Leave History
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select 
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="relative">
                  <CalendarIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select 
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                  >
                    <option value="All">All Types</option>
                    <option value="Paid Leave">Paid Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Leave Type</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Days</th>
                    <th className="px-6 py-4">Applied On</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequests.map((req) => (
                    <tr 
                      key={req.id} 
                      onClick={() => setSelectedRequest(req)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{req.type}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{req.startDate} <span className="mx-1 text-slate-400">→</span> {req.endDate}</td>
                      <td className="px-6 py-4 font-medium text-slate-700 text-sm">{req.days}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{req.appliedOn}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusStyle(req.status)}`}>
                          {getStatusIcon(req.status)}
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRequests.length === 0 && (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">No leave requests yet</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-6">You haven't submitted any leave requests that match your filters.</p>
                  <Button onClick={() => setIsApplyModalOpen(true)}>Apply for Leave</Button>
                </div>
              )}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <div 
                  key={req.id} 
                  onClick={() => setSelectedRequest(req)}
                  className="p-4 space-y-3 active:bg-slate-50 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-900">{req.type}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Applied: {req.appliedOn}</div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700 flex justify-between items-center">
                    <div>
                      {req.startDate} <span className="mx-1 text-slate-400">→</span> {req.endDate}
                    </div>
                    <div className="font-bold text-indigo-600">{req.days} day{req.days > 1 ? 's' : ''}</div>
                  </div>
                </div>
              ))}
              {filteredRequests.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <p>No leave requests found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Leave Balance</h2>
            </div>
            <div className="p-6 space-y-6">
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-900">Paid Leave</span>
                  <span className="text-slate-500"><strong className="text-slate-900">{balances.paidLeave.remaining}</strong> left</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(balances.paidLeave.used / balances.paidLeave.total) * 100}%` }}></div>
                </div>
                <p className="text-xs text-slate-400 text-right">Used {balances.paidLeave.used} of {balances.paidLeave.total}</p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-900">Sick Leave</span>
                  <span className="text-slate-500"><strong className="text-slate-900">{balances.sickLeave.remaining}</strong> left</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(balances.sickLeave.used / balances.sickLeave.total) * 100}%` }}></div>
                </div>
                <p className="text-xs text-slate-400 text-right">Used {balances.sickLeave.used} of {balances.sickLeave.total}</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-900">Unpaid Leave</span>
                  <span className="text-slate-500 font-medium">Used: {balances.unpaidLeave.used}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col my-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-bold text-slate-900 text-lg flex items-center">
                <Plus className="w-5 h-5 mr-2 text-indigo-600" /> Apply for Leave
              </h2>
              <button 
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleApplySubmit} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Leave Type <span className="text-red-500">*</span></label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as LeaveType})}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-shadow"
                  >
                    <option value="Paid Leave">Paid Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                  {formErrors.type && <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Input 
                      label="Start Date *" 
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    />
                    {formErrors.startDate && <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>}
                  </div>
                  <div>
                    <Input 
                      label="End Date *" 
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                    {formErrors.endDate && <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>}
                  </div>
                </div>

                {calculatedDays > 0 && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-center">
                    <span className="text-sm font-medium text-indigo-900">Total Duration: </span>
                    <span className="text-lg font-bold text-indigo-700">{calculatedDays} day{calculatedDays > 1 ? 's' : ''}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Remarks</label>
                  <textarea 
                    value={formData.remarks}
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-shadow resize-none"
                    placeholder="Reason for leave (optional)"
                  />
                  {formErrors.remarks && <p className="mt-1 text-sm text-red-600">{formErrors.remarks}</p>}
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsApplyModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col my-auto">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <h2 className="font-bold text-slate-900 text-lg mb-1">Leave Request Details</h2>
                <p className="text-xs text-slate-500">Applied on {selectedRequest.appliedOn}</p>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mr-3">
                    <CalendarIcon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{selectedRequest.type}</p>
                    <p className="text-sm font-medium text-indigo-600">{selectedRequest.days} day{selectedRequest.days > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold border ${getStatusStyle(selectedRequest.status)}`}>
                  {getStatusIcon(selectedRequest.status)}
                  {selectedRequest.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Start Date</span>
                  <span className="font-semibold text-slate-900">{selectedRequest.startDate}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">End Date</span>
                  <span className="font-semibold text-slate-900">{selectedRequest.endDate}</span>
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Remarks</span>
                <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[3rem]">
                  {selectedRequest.remarks || <span className="italic text-slate-400">No remarks provided.</span>}
                </p>
              </div>

              {selectedRequest.status !== 'Pending' && selectedRequest.adminComment && (
                <div className={`p-4 rounded-lg border ${selectedRequest.status === 'Approved' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                  <span className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center ${selectedRequest.status === 'Approved' ? 'text-emerald-700' : 'text-red-700'}`}>
                    <MessageSquare className="w-3 h-3 mr-1.5" /> HR / Admin Comment
                  </span>
                  <p className={`text-sm ${selectedRequest.status === 'Approved' ? 'text-emerald-900' : 'text-red-900'}`}>
                    {selectedRequest.adminComment}
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
