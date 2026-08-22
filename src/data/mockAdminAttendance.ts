import { adminService } from './mockAdmin';
import type { AttendanceStatus, DailyAttendance } from './mockAttendance';

export interface AdminDailyAttendance extends DailyAttendance {
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
}

// Helper to generate a fake time based on status
const generateRandomTimes = (status: AttendanceStatus, isToday = false) => {
  if (status === 'Absent' || status === 'Leave' || status === 'Not Checked In') {
    return { checkIn: null, checkOut: null, workingHours: null };
  }
  
  if (status === 'Half-day') {
    return { checkIn: '09:00 AM', checkOut: '01:00 PM', workingHours: '4h 00m' };
  }

  // Present
  const inMinute = Math.floor(Math.random() * 15);
  const checkIn = `09:${inMinute.toString().padStart(2, '0')} AM`;
  
  if (isToday) {
    // If it's today and they are present, they might not have checked out yet
    const rand = Math.random();
    if (rand < 0.5) {
      return { checkIn, checkOut: null, workingHours: 'Working...' };
    }
  }

  const outMinute = Math.floor(Math.random() * 30);
  const checkOut = `06:${outMinute.toString().padStart(2, '0')} PM`;
  const workingHours = `8h ${(60 - inMinute + outMinute) % 60}m`;
  
  return { checkIn, checkOut, workingHours };
};

// Generate global attendance state for the last 14 days across all employees
const generateGlobalAttendance = () => {
  const employees = adminService.getEmployees();
  const records: AdminDailyAttendance[] = [];
  
  const today = new Date();
  
  for (let i = 0; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    if (d.getDay() === 0 || d.getDay() === 6) continue; // Skip weekends
    
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const isoDate = d.toISOString();
    const isToday = i === 0;

    employees.forEach(emp => {
      // Determine status loosely based on their summary data
      let status: AttendanceStatus = 'Present';
      const rand = Math.random();
      
      if (emp.attendance === 'Leave' && isToday) {
        status = 'Leave';
      } else if (emp.attendance === 'Absent' && isToday) {
        status = 'Absent';
      } else {
        if (rand < 0.05) status = 'Absent';
        else if (rand < 0.1) status = 'Leave';
        else if (rand < 0.15) status = 'Half-day';
        else status = 'Present';
      }

      const { checkIn, checkOut, workingHours } = generateRandomTimes(status, isToday);

      records.push({
        id: `att_${emp.id}_${i}`,
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department,
        designation: emp.designation,
        date: dateStr,
        day: dayStr,
        status,
        checkIn,
        checkOut,
        workingHours,
        isoDate
      });
    });
  }
  
  return records;
};

// Singleton to persist state during the session
export const globalAttendanceRecords = generateGlobalAttendance();

export const adminAttendanceService = {
  getAttendanceByDate: (date: Date) => {
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return globalAttendanceRecords.filter(r => r.date === dateStr);
  },
  
  getAttendanceByWeek: (startDate: Date) => {
    // Generate dates for Mon-Sun of the given week start date
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      weekDates.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    }
    return globalAttendanceRecords.filter(r => weekDates.includes(r.date));
  },
  
  getAttendanceByEmployee: (employeeId: string) => {
    return globalAttendanceRecords
      .filter(r => r.employeeId === employeeId)
      .sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
  },
  
  getAttendanceSummary: (date: Date) => {
    const records = adminAttendanceService.getAttendanceByDate(date);
    return {
      totalEmployees: adminService.getEmployees().length,
      present: records.filter(r => r.status === 'Present').length,
      absent: records.filter(r => r.status === 'Absent').length,
      halfDay: records.filter(r => r.status === 'Half-day').length,
      onLeave: records.filter(r => r.status === 'Leave').length,
    };
  }
};
