export const MOCK_DASHBOARD_DATA = {
  employeeDetails: {
    employeeId: 'EMP001',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
  },
  todayAttendance: {
    date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
    status: 'Present',
    checkIn: '09:02 AM',
    checkOut: '--:-- PM',
    workingHours: '4h 32m',
    isCheckedIn: true
  },
  leaveOverview: {
    available: 12,
    pending: 1,
    approved: 8,
    rejected: 1
  },
  recentActivity: [
    {
      id: '1',
      type: 'leave_approved',
      title: 'Leave request approved',
      description: 'Your leave request for Aug 25 was approved by HR.',
      time: '2 hours ago',
      icon: 'Calendar',
    },
    {
      id: '2',
      type: 'attendance',
      title: 'Attendance recorded',
      description: 'Checked in successfully from office IP.',
      time: 'Today, 09:02 AM',
      icon: 'Clock',
    },
    {
      id: '3',
      type: 'payroll',
      title: 'Payroll updated',
      description: 'Your salary slip for July is now available.',
      time: 'Aug 1, 10:00 AM',
      icon: 'Wallet',
    }
  ],
  alerts: [
    {
      id: 'a1',
      type: 'success',
      message: 'Your leave request for Aug 25 has been approved.'
    },
    {
      id: 'a2',
      type: 'info',
      message: 'Your salary slip for July is available.'
    }
  ],
  upcomingLeave: [
    {
      id: 'l1',
      type: 'Annual Leave',
      startDate: 'Aug 25, 2026',
      endDate: 'Aug 26, 2026',
      days: 2,
      status: 'Approved'
    }
  ]
};
