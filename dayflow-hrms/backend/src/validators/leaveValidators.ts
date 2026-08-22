import { LeaveType } from '@prisma/client';

export interface CreateLeaveRequestInput {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  remarks?: string;
  attachmentUrl?: string;
}

export interface ReviewLeaveRequestInput {
  comment?: string;
}

export const validateCreateLeaveRequest = (input: CreateLeaveRequestInput) => {
  if (!input.leaveType) {
    return { isValid: false, message: 'Leave type is required.' };
  }
  if (!input.startDate || isNaN(Date.parse(input.startDate))) {
    return { isValid: false, message: 'Valid start date is required.' };
  }
  if (!input.endDate || isNaN(Date.parse(input.endDate))) {
    return { isValid: false, message: 'Valid end date is required.' };
  }

  const start = new Date(input.startDate);
  const end = new Date(input.endDate);

  // Strip hours for date comparison
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (end.getTime() < start.getTime()) {
    return { isValid: false, message: 'End date cannot be before start date.' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (start.getTime() < today.getTime()) {
    return { isValid: false, message: 'Start date cannot be in the past.' };
  }

  return { isValid: true };
};
