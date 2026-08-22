import React from 'react';
import { AttendanceStatus } from '../../types';
import { Badge } from '../common/Badge';

export interface AttendanceStatusBadgeProps {
  status: AttendanceStatus | string;
  size?: 'sm' | 'md';
}

export const AttendanceStatusBadge: React.FC<AttendanceStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const variantMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
    PRESENT: 'success',
    HALF_DAY: 'warning',
    ABSENT: 'danger',
    LEAVE: 'info',
  };

  const variant = variantMap[status] || 'neutral';

  return (
    <Badge variant={variant} size={size}>
      {status}
    </Badge>
  );
};
