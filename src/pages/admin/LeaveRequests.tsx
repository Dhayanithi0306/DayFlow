import React, { useState, useEffect } from 'react';
import { 
  Search, CheckCircle2, XCircle, Clock, 
  Calendar, Eye, X, MessageSquare, AlertCircle 
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { leaveService } from '../../data/mockLeave';
import type { LeaveRequest } from '../../data/mockLeave';
import { adminService } from '../../data/mockAdmin';
import { useAuth } from '../../context/AuthContext';

export const AdminLeaveRequests: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Data State
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [summary, setSummary] = useState(leaveService.getAdminSummary());
  const employees = adminService.getEmployees();
  const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))];

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  
  // Modals/Drawers State
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  
  // Action Modals
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  
  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setRequests(leaveService.getAllLeaveRequests());
    setSummary(leaveService.getAdminSummary());
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handlers
  const handleApprove = () => {
    if (selectedRequest) {
      leaveService.approveLeaveRequest(selectedRequest.id, currentUser?.role === 'hr' ? 'HR Officer' : 'Admin');
      refreshData();
      setIsApproveModalOpen(false);
      setIsViewDrawerOpen(false);
      showNotification('Leave request approved successfully.');
    }
  };

  const handleReject = () => {
    if (selectedRequest && rejectComment.trim()) {
      leaveService.rejectLeaveRequest(selectedRequest.id, rejectComment, currentUser?.role === 'hr' ? 'HR Officer' : 'Admin');
      refreshData();
      setIsRejectModalOpen(false);
      setIsViewDrawerOpen(false);
      setRejectComment('');
      showNotification('Leave request rejected.', 'error');
    }
  };

  const openApproveModal = (req: LeaveRequest) => {
    setSelectedRequest(req);
    setIsApproveModalOpen(true);
  };

  const openRejectModal = (req: LeaveRequest) => {
    setSelectedRequest(req);
    setRejectComment('');
    setIsRejectModalOpen(true);
  };

  const openViewDrawer = (req: LeaveRequest) => {
    setSelectedRequest(req);
    setIsViewDrawerOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  // Apply Filters
  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.employeeId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesType = typeFilter === 'All' || req.type === typeFilter;
    const matchesDept = deptFilter === 'All' || req.department === deptFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 fade-in duration-300 px-4 py-3 rounded-lg shadow-lg border flex items-center space-x-2 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Leave Requests</h1>
          <p className="text-slate-500 mt-1">Review and manage employee time-off requests.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Requests</p>
          <p className="text-2xl font-black text-slate-900">{summary.total}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Pending</p>
          <p className="text-2xl font-black text-amber-700">{summary.pending}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Approved</p>
          <p className="text-2xl font-black text-emerald-700">{summary.approved}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
          <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Rejected</p>
          <p className="text-2xl font-black text-red-700">{summary.rejected}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search employee or ID..." 
            className="pl-9 pr-8 py-2 w-full border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full lg:w-auto">
          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white flex-1 lg:w-36"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          
          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white flex-1 lg:w-40"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Paid Leave">Paid Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
          </select>

          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-white flex-1 lg:w-40"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Leave Type</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Days</th>
                <th className="px-6 py-4">Applied On</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{req.employeeName}</p>
                    <p className="text-xs text-slate-500">{req.employeeId} • {req.department}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-700">{req.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-700">{req.startDate}</p>
                    <p className="text-xs text-slate-400">to {req.endDate}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{req.days}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{req.appliedOn}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => openViewDrawer(req)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {req.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => openApproveModal(req)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openRejectModal(req)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <p className="font-medium mb-2">No leave requests found.</p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                      setTypeFilter('All');
                      setDeptFilter('All');
                    }}>Clear Filters</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden divide-y divide-slate-100">
          {filteredRequests.map(req => (
            <div key={req.id} className="p-4 bg-white hover:bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-slate-900">{req.employeeName}</p>
                  <p className="text-xs text-slate-500">{req.employeeId} • {req.department}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(req.status)}`}>
                  {req.status}
                </span>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Type</span>
                  <span className="font-medium text-slate-700">{req.type}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Days</span>
                  <span className="font-medium text-slate-700">{req.days}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-400 block">Dates</span>
                  <span className="font-medium text-slate-700">{req.startDate} - {req.endDate}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" className="flex-1 text-sm py-1.5" onClick={() => openViewDrawer(req)}>View</Button>
                {req.status === 'Pending' && (
                  <>
                    <Button 
                      variant="primary" 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent text-sm py-1.5"
                      onClick={() => openApproveModal(req)}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="primary" 
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white border-transparent text-sm py-1.5"
                      onClick={() => openRejectModal(req)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {filteredRequests.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-500">
              <p className="mb-4">No leave requests found.</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setTypeFilter('All');
                setDeptFilter('All');
              }}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>

      {/* Details Drawer */}
      {isViewDrawerOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h2 className="font-bold text-slate-900">Leave Request Details</h2>
              <button 
                onClick={() => setIsViewDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl shrink-0">
                  {selectedRequest.employeeName?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedRequest.employeeName}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {selectedRequest.employeeId}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                      {selectedRequest.department}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 block">Status</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border mt-1 ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-xs text-slate-500 block">Leave Type</span>
                    <span className="font-bold text-slate-900 block mt-1">{selectedRequest.type}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-slate-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Dates</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {selectedRequest.startDate} - {selectedRequest.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-slate-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Duration</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {selectedRequest.days} {selectedRequest.days === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Employee Remarks</h4>
                  <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                    "{selectedRequest.remarks}"
                  </p>
                  <p className="text-xs text-slate-400 mt-2">Applied on {selectedRequest.appliedOn}</p>
                </div>

                {selectedRequest.status !== 'Pending' && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Decision Details</h4>
                    <div className={`p-4 rounded-lg border ${selectedRequest.status === 'Approved' ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                      <div className="flex items-start">
                        <MessageSquare className={`w-5 h-5 mr-3 mt-0.5 ${selectedRequest.status === 'Approved' ? 'text-emerald-500' : 'text-red-500'}`} />
                        <div>
                          <p className={`text-sm font-medium ${selectedRequest.status === 'Approved' ? 'text-emerald-800' : 'text-red-800'}`}>
                            {selectedRequest.adminComment || (selectedRequest.status === 'Approved' ? 'Request approved without comments.' : 'No remarks provided.')}
                          </p>
                          <p className={`text-xs mt-2 ${selectedRequest.status === 'Approved' ? 'text-emerald-600/70' : 'text-red-600/70'}`}>
                            By {selectedRequest.decisionBy || 'Admin'} on {selectedRequest.decisionDate || selectedRequest.appliedOn}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedRequest.status === 'Pending' && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3 shrink-0">
                <Button 
                  variant="primary" 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                  onClick={() => {
                    setIsViewDrawerOpen(false);
                    openApproveModal(selectedRequest);
                  }}
                >
                  Approve
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white border-transparent"
                  onClick={() => {
                    setIsViewDrawerOpen(false);
                    openRejectModal(selectedRequest);
                  }}
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {isApproveModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Approve Leave Request?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              You are about to approve <strong>{selectedRequest.days} day(s)</strong> of {selectedRequest.type} for <strong>{selectedRequest.employeeName}</strong>.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setIsApproveModalOpen(false)}>Cancel</Button>
              <Button 
                variant="primary" 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                onClick={handleApprove}
              >
                Approve Leave
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal with Comment */}
      {isRejectModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3 mb-4 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Reject Leave Request</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Provide a reason for rejecting the leave request from <strong>{selectedRequest.employeeName}</strong>. This comment will be visible to the employee.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-1">HR/Admin Comment *</label>
              <textarea 
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none h-24"
                placeholder="Enter the reason for rejecting this leave request..."
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
              <Button 
                variant="primary" 
                className="bg-red-600 hover:bg-red-700 text-white border-transparent"
                onClick={handleReject}
                disabled={!rejectComment.trim()}
              >
                Reject Leave
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
