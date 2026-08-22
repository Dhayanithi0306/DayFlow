import { AttendanceStatus } from '@prisma/client';

export interface AdminUpdateAttendanceInput {
  checkIn?: string;
  checkOut?: string;
  status?: AttendanceStatus;
  remarks?: string;
}

export const validateAdminAttendanceUpdate = (input: AdminUpdateAttendanceInput) => {
  if (input.checkIn && isNaN(Date.parse(input.checkIn))) {
    return { isValid: false, message: 'Invalid check-in timestamp format.' };
  }
  if (input.checkOut && isNaN(Date.parse(input.checkOut))) {
    return { isValid: false, message: 'Invalid check-out timestamp format.' };
  }
  if (input.checkIn && input.checkOut) {
    const inTime = new Date(input.checkIn).getTime();
    const outTime = new Date(input.checkOut).getTime();
    if (outTime <= inTime) {
      return { isValid: false, message: 'Check-out time must be after check-in time.' };
    }
  }

  return { isValid: true };
};
