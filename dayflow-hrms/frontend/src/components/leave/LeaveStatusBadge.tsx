import React from 'react';
import { LeaveStatus } from '../../types';
import { Badge } from '../common/Badge';

export interface LeaveStatusBadgeProps {
  status: LeaveStatus | string;
  size?: 'sm' | 'md';
}

export const LeaveStatusBadge: React.FC<LeaveStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const variantMap: Record<string, 'warning' | 'success' | 'danger' | 'neutral'> = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger',
  };

  const variant = variantMap[status] || 'neutral';

  return (
    <Badge variant={variant} size={size}>
      {status}
    </Badge>
  );
};
