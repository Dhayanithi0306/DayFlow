import { globalAttendanceRecords } from './mockAdminAttendance';

export type AttendanceStatus = 'Present' | 'Absent' | 'Half-day' | 'Leave' | 'Not Checked In';

export interface DailyAttendance {
  id: string;
  date: string;
  day: string;
  status: AttendanceStatus;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: string | null;
  isoDate: string; // for easier sorting/filtering
}

// EMP001 is the mock employee profile
const MY_EMP_ID = 'EMP001';

// Initial state for today
export let mockTodayAttendance: DailyAttendance = {
  id: 'att_today',
  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  day: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
  status: 'Not Checked In',
  checkIn: null,
  checkOut: null,
  workingHours: null,
  isoDate: new Date().toISOString()
};

export const attendanceService = {
  getDailyAttendance: () => {
    // If today is already in global records for EMP001, return it. Otherwise return the default today state.
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const globalToday = globalAttendanceRecords.find(r => r.employeeId === MY_EMP_ID && r.date === todayStr);
    if (globalToday) {
      mockTodayAttendance = {
        id: globalToday.id,
        date: globalToday.date,
        day: globalToday.day,
        status: globalToday.status,
        checkIn: globalToday.checkIn,
        checkOut: globalToday.checkOut,
        workingHours: globalToday.workingHours,
        isoDate: globalToday.isoDate
      };
    }
    return { ...mockTodayAttendance };
  },
  
  getWeeklyAttendance: () => {
    const history = globalAttendanceRecords
      .filter(r => r.employeeId === MY_EMP_ID)
      .sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
    
    // Check if today is in history, if not, add it for the employee view
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    let week = [...history];
    if (!week.find(r => r.date === todayStr)) {
       week = [{
         ...mockTodayAttendance,
         employeeId: MY_EMP_ID,
         employeeName: 'Sarah Jenkins',
         department: 'Engineering',
         designation: 'Senior Frontend Engineer'
       }, ...week];
    }
    return week.slice(0, 5).sort((a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime());
  },
  
  getHistory: () => {
    return globalAttendanceRecords
      .filter(r => r.employeeId === MY_EMP_ID)
      .sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
  },

  checkIn: () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    mockTodayAttendance = {
      ...mockTodayAttendance,
      status: 'Present',
      checkIn: timeString
    };

    // Update global record
    const globalIndex = globalAttendanceRecords.findIndex(r => r.employeeId === MY_EMP_ID && r.date === todayStr);
    if (globalIndex !== -1) {
      globalAttendanceRecords[globalIndex] = { ...globalAttendanceRecords[globalIndex], ...mockTodayAttendance };
    } else {
      globalAttendanceRecords.unshift({
        ...mockTodayAttendance,
        employeeId: MY_EMP_ID,
        employeeName: 'Sarah Jenkins',
        department: 'Engineering',
        designation: 'Senior Frontend Engineer'
      });
    }

    return { ...mockTodayAttendance };
  },

  checkOut: (checkInTime: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    let workingHours = 'Working...';
    try {
      const start = new Date();
      const match = checkInTime.match(/(\d+):(\d+)\s+(AM|PM)/);
      if (match) {
        let hours = parseInt(match[1]);
        const mins = parseInt(match[2]);
        const ampm = match[3];
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        start.setHours(hours, mins, 0, 0);
        
        const diffMs = now.getTime() - start.getTime();
        if (diffMs > 0) {
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          workingHours = `${diffHrs}h ${diffMins}m`;
        } else {
          workingHours = '0h 1m'; 
        }
      }
    } catch(e) {
      workingHours = '8h 00m'; 
    }

    mockTodayAttendance = {
      ...mockTodayAttendance,
      checkOut: timeString,
      workingHours
    };
    
    const globalIndex = globalAttendanceRecords.findIndex(r => r.employeeId === MY_EMP_ID && r.date === todayStr);
    if (globalIndex !== -1) {
      globalAttendanceRecords[globalIndex] = { ...globalAttendanceRecords[globalIndex], ...mockTodayAttendance };
    }
    
    return { ...mockTodayAttendance };
  }
};
