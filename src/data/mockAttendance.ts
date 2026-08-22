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

const generateMockHistory = (): DailyAttendance[] => {
  const history: DailyAttendance[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    // Skip weekends for mock data
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    
    let status: AttendanceStatus = 'Present';
    let checkIn: string | null = '09:00 AM';
    let checkOut: string | null = '06:00 PM';
    let workingHours: string | null = '9h 00m';
    
    // Randomize some statuses
    const rand = Math.random();
    if (rand < 0.1) {
      status = 'Absent';
      checkIn = null;
      checkOut = null;
      workingHours = null;
    } else if (rand < 0.2) {
      status = 'Leave';
      checkIn = null;
      checkOut = null;
      workingHours = null;
    } else if (rand < 0.3) {
      status = 'Half-day';
      checkIn = '09:00 AM';
      checkOut = '01:00 PM';
      workingHours = '4h 00m';
    } else {
      // Vary times slightly for Present
      const inMinute = Math.floor(Math.random() * 15);
      const outMinute = Math.floor(Math.random() * 30);
      checkIn = `09:${inMinute.toString().padStart(2, '0')} AM`;
      checkOut = `06:${outMinute.toString().padStart(2, '0')} PM`;
      workingHours = `8h ${(60 - inMinute + outMinute) % 60}m`;
    }

    history.push({
      id: `att_${i}`,
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      status,
      checkIn,
      checkOut,
      workingHours,
      isoDate: d.toISOString()
    });
  }
  
  return history.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
};

// Initial state
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

export let mockAttendanceHistory = generateMockHistory();

export const attendanceService = {
  getDailyAttendance: () => {
    return { ...mockTodayAttendance };
  },
  
  getWeeklyAttendance: () => {
    // Return last 5 entries from history + today if applicable
    const thisWeek = [mockTodayAttendance, ...mockAttendanceHistory].slice(0, 5);
    // Sort chronological for weekly view
    return thisWeek.sort((a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime());
  },
  
  getHistory: () => {
    return [...mockAttendanceHistory];
  },

  checkIn: () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    mockTodayAttendance = {
      ...mockTodayAttendance,
      status: 'Present',
      checkIn: timeString
    };
    return { ...mockTodayAttendance };
  },

  checkOut: (checkInTime: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Simple mock calculation for working hours
    // Assuming checkInTime is like "09:00 AM" and now is later the same day
    // For a real app, you'd parse dates properly. Here we just mock it nicely.
    
    let workingHours = 'Working...';
    try {
      // Rough mock calculation based on frontend time diff
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
          workingHours = '0h 1m'; // Just checked in
        }
      }
    } catch(e) {
      workingHours = '8h 00m'; // Fallback
    }

    mockTodayAttendance = {
      ...mockTodayAttendance,
      checkOut: timeString,
      workingHours
    };
    
    // In a real app we'd add to history, but for this mock we just update today's state
    return { ...mockTodayAttendance };
  }
};
