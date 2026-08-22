import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HRMSProvider, useHRMS } from './context/HRMSContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastNotification } from './components/common/ToastNotification';

// Auth Components
import { Login } from './components/auth/Login';
import { SignUp } from './components/auth/SignUp';
import { FirstLoginChangePassword } from './components/auth/FirstLoginChangePassword';
import { EmailVerification } from './components/auth/EmailVerification';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';

// Employee Module Views (Developer 1)
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { EmployeeLeave } from './components/employee/EmployeeLeave';
import { PayrollModule as EmployeePayroll } from './components/employee/PayrollModule';
import { ProfileModule as EmployeeProfile } from './components/employee/ProfileModule';

// Admin Module Views (Developer 2)
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminEmployeeModule as EmployeeManagement } from './components/admin/AdminEmployeeModule';
import { AdminLeaveModule as AdminLeavePortal } from './components/admin/AdminLeaveModule';
import { AdminPayrollModule as AdminPayroll } from './components/admin/AdminPayrollModule';

// Attendance Module Views (Developer 3)
import { EmployeeAttendanceView } from './components/attendance/EmployeeAttendanceView';
import { AdminAttendanceView } from './components/attendance/AdminAttendanceView';

const AuthenticatedApp: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { currentUser } = useHRMS();
  const [activeTab, setActiveTab] = useState<string>(
    currentUser?.role === 'admin' ? 'admin-dashboard' : 'dashboard'
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync active tab when user role updates
  React.useEffect(() => {
    if (currentUser?.role === 'admin' && !activeTab.startsWith('admin-')) {
      setActiveTab('admin-dashboard');
    } else if (currentUser?.role === 'employee' && activeTab.startsWith('admin-')) {
      setActiveTab('dashboard');
    }
  }, [currentUser?.role]);

  const renderActiveView = () => {
    if (currentUser?.role === 'admin') {
      switch (activeTab) {
        case 'admin-dashboard':
          return <AdminDashboard onNavigateTab={setActiveTab} />;
        case 'admin-employees':
          return <EmployeeManagement />;
        case 'admin-attendance':
          return <AdminAttendanceView />;
        case 'admin-leaves':
          return <AdminLeavePortal />;
        case 'admin-payroll':
          return <AdminPayroll />;
        default:
          return <AdminDashboard onNavigateTab={setActiveTab} />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
          return <EmployeeDashboard onNavigateTab={setActiveTab} />;
        case 'attendance':
          return <EmployeeAttendanceView />;
        case 'leave':
          return <EmployeeLeave />;
        case 'payroll':
          return <EmployeePayroll />;
        case 'profile':
          return <EmployeeProfile />;
        default:
          return <EmployeeDashboard onNavigateTab={setActiveTab} />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        onNavigateToProfile={() => setActiveTab(currentUser?.role === 'admin' ? 'admin-employees' : 'profile')}
        onLogout={onLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      <ToastNotification />
    </div>
  );
};

const MainContent: React.FC = () => {
  const { authView } = useAuth();
  const { logout } = useHRMS();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const handleSuccessAuth = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    switch (authView) {
      case 'signup':
        return <SignUp />;
      case 'verify-email':
        return <EmailVerification onSuccessVerification={handleSuccessAuth} />;
      case 'first-login':
        return <FirstLoginChangePassword onComplete={handleSuccessAuth} />;
      case 'forgot-password':
        return <ForgotPassword />;
      case 'reset-password':
        return <ResetPassword />;
      case 'login':
      default:
        return <Login onSuccessLogin={handleSuccessAuth} />;
    }
  }

  return <AuthenticatedApp onLogout={handleLogout} />;
};

export function App() {
  return (
    <HRMSProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </HRMSProvider>
  );
}

export default App;
