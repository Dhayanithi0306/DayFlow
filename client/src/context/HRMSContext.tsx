import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  EmployeeRecord,
  AttendanceRecord,
  LeaveRequest,
  LeaveStatus,
  Role,
  UserProfile,
  DetailedSalaryStructure,
} from '../types/hrms';
import { INITIAL_EMPLOYEES, INITIAL_ATTENDANCE, INITIAL_LEAVES } from '../data/mockData';
import { generateSystemLoginId } from './AuthContext';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface HRMSContextType {
  currentUser: EmployeeRecord | null;
  employees: EmployeeRecord[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  isCheckedIn: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  elapsedSeconds: number;
  toasts: ToastItem[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  // Actions
  switchUserRole: (role: Role) => void;
  loginUser: (identifier: string) => boolean;
  logout: () => void;
  toggleCheckIn: () => void;
  applyLeaveRequest: (data: { leaveType: LeaveRequest['leaveType']; startDate: string; endDate: string; days: number; reason: string; attachmentName?: string }) => void;
  updateLeaveStatus: (leaveId: string, status: LeaveStatus, adminComment?: string) => void;
  updateEmployee: (updated: EmployeeRecord) => void;
  addEmployee: (newEmpData: {
    name: string;
    email: string;
    phone: string;
    department: string;
    designation: string;
    role: Role;
    basicSalary: number;
  }) => EmployeeRecord;
  updateSalaryStructure: (
    employeeId: string,
    structure: DetailedSalaryStructure
  ) => void;
  updateUserProfile: (profileData: { phone?: string; address?: string; avatar?: string; emergencyContact?: UserProfile['emergencyContact'] }) => void;
  addToast: (message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
}

const HRMSContext = createContext<HRMSContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  EMPLOYEES: 'dayflow_employees_v3',
  ATTENDANCE: 'dayflow_attendance_v3',
  LEAVES: 'dayflow_leaves_v3',
  CURRENT_USER_ID: 'dayflow_current_user_id_v3',
  CHECKIN_STATE: 'dayflow_checkin_state_v3',
};

export const HRMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Employees state
  const [employees, setEmployees] = useState<EmployeeRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EMPLOYEES);
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  // 2. Attendance state
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  // 3. Leave Requests state
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.LEAVES);
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  // 4. Current User ID (Defaults to Sarah Jenkins - Employee)
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'emp-101';
  });

  // Active current user profile
  const currentUser = employees.find((e) => e.id === currentUserId) || employees[0] || null;

  // 5. Check-In Timer state
  const [checkInState, setCheckInState] = useState<{
    isCheckedIn: boolean;
    checkInTime: string | null;
    checkOutTime: string | null;
    startTimeStamp: number | null;
  }>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CHECKIN_STATE);
    if (saved) return JSON.parse(saved);
    return { isCheckedIn: false, checkInTime: null, checkOutTime: null, startTimeStamp: null };
  });

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // 6. Toasts state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.LEAVES, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CHECKIN_STATE, JSON.stringify(checkInState));
  }, [checkInState]);

  // Timer effect for active check-in
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (checkInState.isCheckedIn && checkInState.startTimeStamp) {
      const updateTimer = () => {
        const now = Date.now();
        const diffInSec = Math.floor((now - (checkInState.startTimeStamp || now)) / 1000);
        setElapsedSeconds(diffInSec);
      };
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [checkInState.isCheckedIn, checkInState.startTimeStamp]);

  // Toast Helpers
  const addToast = (message: string, type: ToastItem['type'] = 'info') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev: ToastItem[]) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev: ToastItem[]) => prev.filter((t: ToastItem) => t.id !== id));
  };

  // Switch User Role
  const switchUserRole = (role: Role) => {
    const target = employees.find((e: EmployeeRecord) => e.role === role);
    if (target) {
      setCurrentUserId(target.id);
      addToast(`Switched view to ${target.name} (${role.toUpperCase()})`, 'info');
    }
  };

  // Login User (supports Email or System Login ID e.g. DAYSJ20230001)
  const loginUser = (identifier: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const found = employees.find(
      (e: EmployeeRecord) =>
        e.email.toLowerCase() === cleanId || e.loginId.toLowerCase() === cleanId
    );
    if (found) {
      setCurrentUserId(found.id);
      addToast(`Welcome back, ${found.name}!`, 'success');
      return true;
    }
    addToast('Invalid login ID or email address.', 'error');
    return false;
  };

  // Logout
  const logout = () => {
    addToast('Logged out of session', 'info');
  };

  // Toggle Check-In / Check-Out
  const toggleCheckIn = () => {
    if (!currentUser) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const todayStr = now.toISOString().split('T')[0];

    if (!checkInState.isCheckedIn) {
      const newCheckInState = {
        isCheckedIn: true,
        checkInTime: formattedTime,
        checkOutTime: null,
        startTimeStamp: Date.now(),
      };
      setCheckInState(newCheckInState);

      setAttendanceRecords((prev: AttendanceRecord[]) => {
        const existingIdx = prev.findIndex((a: AttendanceRecord) => a.employeeId === currentUser.employeeId && a.date === todayStr);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            checkIn: formattedTime,
            status: 'Present',
          };
          return updated;
        } else {
          const newRecord: AttendanceRecord = {
            id: `att-${Date.now()}`,
            employeeId: currentUser.employeeId,
            loginId: currentUser.loginId,
            employeeName: currentUser.name,
            date: todayStr,
            checkIn: formattedTime,
            checkOut: null,
            hoursWorked: 0,
            extraHours: 0,
            status: 'Present',
            notes: 'Web Check-in',
          };
          return [newRecord, ...prev];
        }
      });

      addToast(`Checked in successfully at ${formattedTime}! Have a productive day.`, 'success');
    } else {
      const totalHours = Number((elapsedSeconds / 3600).toFixed(2));
      const extra = totalHours > 8 ? Number((totalHours - 8).toFixed(2)) : 0;

      setCheckInState({
        isCheckedIn: false,
        checkInTime: checkInState.checkInTime,
        checkOutTime: formattedTime,
        startTimeStamp: null,
      });

      setAttendanceRecords((prev: AttendanceRecord[]) => {
        return prev.map((a: AttendanceRecord) => {
          if (a.employeeId === currentUser.employeeId && a.date === todayStr) {
            return {
              ...a,
              checkOut: formattedTime,
              hoursWorked: totalHours > 0 ? totalHours : 8.0,
              extraHours: extra,
            };
          }
          return a;
        });
      });

      addToast(`Checked out at ${formattedTime}.`, 'success');
    }
  };

  // Apply Leave Request
  const applyLeaveRequest = (data: {
    leaveType: LeaveRequest['leaveType'];
    startDate: string;
    endDate: string;
    days: number;
    reason: string;
    attachmentName?: string;
  }) => {
    if (!currentUser) return;

    const newRequest: LeaveRequest = {
      id: `lve-${Date.now()}`,
      employeeId: currentUser.employeeId,
      loginId: currentUser.loginId,
      employeeName: currentUser.name,
      employeeAvatar: currentUser.avatar,
      department: currentUser.department,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      days: data.days,
      reason: data.reason,
      attachmentName: data.attachmentName,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };

    setLeaveRequests((prev: LeaveRequest[]) => [newRequest, ...prev]);
    addToast(`Leave request for ${data.days} day(s) submitted.`, 'success');
  };

  // Update Leave Status (Admin Action)
  const updateLeaveStatus = (leaveId: string, status: LeaveStatus, adminComment?: string) => {
    setLeaveRequests((prev: LeaveRequest[]) =>
      prev.map((l: LeaveRequest) => {
        if (l.id === leaveId) {
          return {
            ...l,
            status,
            adminComment: adminComment || l.adminComment,
            reviewedBy: currentUser?.name || 'HR Admin',
            reviewedOn: new Date().toISOString().split('T')[0],
          };
        }
        return l;
      })
    );

    addToast(`Leave request marked as ${status}.`, status === 'Approved' ? 'success' : 'warning');
  };

  // Edit Employee Record
  const updateEmployee = (updated: EmployeeRecord) => {
    setEmployees((prev: EmployeeRecord[]) => prev.map((e: EmployeeRecord) => (e.id === updated.id ? updated : e)));
    addToast(`Employee details updated for ${updated.name}.`, 'success');
  };

  // Add Employee Record (with System Login ID generation)
  const addEmployee = (newEmpData: {
    name: string;
    email: string;
    phone: string;
    department: string;
    designation: string;
    role: Role;
    basicSalary: number;
  }): EmployeeRecord => {
    const generatedLoginId = generateSystemLoginId(newEmpData.name);
    const empNum = 100 + employees.length + 1;

    const basic = newEmpData.basicSalary || 5000;
    const hra = Math.round(basic * 0.4);
    const stdAllow = 500;
    const bonus = 800;
    const lta = 400;
    const fixedAllow = 600;
    const pf = Math.round(basic * 0.12);
    const tax = 250;
    const net = basic + hra + stdAllow + bonus + lta + fixedAllow - pf - tax;

    const newEmp: EmployeeRecord = {
      id: `emp-${Date.now()}`,
      employeeId: `EMP-${empNum}`,
      loginId: generatedLoginId,
      name: newEmpData.name,
      email: newEmpData.email,
      phone: newEmpData.phone,
      department: newEmpData.department,
      designation: newEmpData.designation,
      role: newEmpData.role,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      joiningDate: new Date().toISOString().split('T')[0],
      address: 'San Francisco, CA',
      companyName: 'Acme Global Inc.',
      manager: 'Alex Morgan',
      location: 'San Francisco HQ',
      isFirstLogin: true,
      emergencyContact: { name: 'Emergency Contact', relation: 'Family', phone: '+1 (555) 999-0000' },
      privateInfo: {
        dob: '1995-01-01',
        gender: 'Unspecified',
        maritalStatus: 'Single',
        nationality: 'American',
        passportNo: 'P00000000',
      },
      salaryStructure: {
        basicSalary: basic,
        hra,
        standardAllowance: stdAllow,
        performanceBonus: bonus,
        lta,
        fixedAllowance: fixedAllow,
        pfDeduction: pf,
        taxDeduction: tax,
        netSalary: net,
      },
      bankDetails: { accountNo: '•••• •••• 9999', bankName: 'Chase Bank', ifsc: 'CHAS0001122' },
      leaveBalance: { paid: 15, sick: 10, unpaid: 0 },
      status: 'Active',
    };

    setEmployees((prev: EmployeeRecord[]) => [...prev, newEmp]);
    addToast(`Employee created! System Login ID: ${generatedLoginId}`, 'success');
    return newEmp;
  };

  // Update Detailed Salary Structure
  const updateSalaryStructure = (employeeId: string, structure: DetailedSalaryStructure) => {
    setEmployees((prev: EmployeeRecord[]) =>
      prev.map((e: EmployeeRecord) => {
        if (e.id === employeeId || e.employeeId === employeeId || e.loginId === employeeId) {
          return {
            ...e,
            salaryStructure: structure,
          };
        }
        return e;
      })
    );
    addToast('Salary structure updated successfully!', 'success');
  };

  // Update User Profile (Self Limited Edit: Phone, Address, Avatar, Emergency)
  const updateUserProfile = (profileData: {
    phone?: string;
    address?: string;
    avatar?: string;
    emergencyContact?: UserProfile['emergencyContact'];
  }) => {
    if (!currentUser) return;
    setEmployees((prev: EmployeeRecord[]) =>
      prev.map((e: EmployeeRecord) => {
        if (e.id === currentUser.id) {
          return {
            ...e,
            phone: profileData.phone ?? e.phone,
            address: profileData.address ?? e.address,
            avatar: profileData.avatar ?? e.avatar,
            emergencyContact: profileData.emergencyContact ?? e.emergencyContact,
          };
        }
        return e;
      })
    );
    addToast('Profile contact information updated.', 'success');
  };

  return (
    <HRMSContext.Provider
      value={{
        currentUser,
        employees,
        attendanceRecords,
        leaveRequests,
        isCheckedIn: checkInState.isCheckedIn,
        checkInTime: checkInState.checkInTime,
        checkOutTime: checkInState.checkOutTime,
        elapsedSeconds,
        toasts,
        setAttendanceRecords,
        switchUserRole,
        loginUser,
        logout,
        toggleCheckIn,
        applyLeaveRequest,
        updateLeaveStatus,
        updateEmployee,
        addEmployee,
        updateSalaryStructure,
        updateUserProfile,
        addToast,
        removeToast,
      }}
    >
      {children}
    </HRMSContext.Provider>
  );
};

export const useHRMS = () => {
  const context = useContext(HRMSContext);
  if (!context) {
    throw new Error('useHRMS must be used within an HRMSProvider');
  }
  return context;
};
