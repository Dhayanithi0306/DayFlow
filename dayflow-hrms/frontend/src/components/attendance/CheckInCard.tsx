import React, { useEffect, useState } from 'react';
import { Attendance } from '../../types';
import { formatTime, formatMinutes } from '../../utils/formatters';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';
import { Clock, CheckCircle2, LogIn, LogOut } from 'lucide-react';

export interface CheckInCardProps {
  todayAttendance: Attendance | null;
  onCheckIn: () => Promise<void>;
  onCheckOut: () => Promise<void>;
  loading: boolean;
}

export const CheckInCard: React.FC<CheckInCardProps> = ({
  todayAttendance,
  onCheckIn,
  onCheckOut,
  loading,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const isCheckedIn = Boolean(todayAttendance?.checkIn && !todayAttendance?.checkOut);
  const isCompleted = Boolean(todayAttendance?.checkIn && todayAttendance?.checkOut);

  // Live session timer calculation from server checkIn timestamp
  useEffect(() => {
    let interval: any = null;

    if (isCheckedIn && todayAttendance?.checkIn) {
      const checkInMs = new Date(todayAttendance.checkIn).getTime();

      const updateTimer = () => {
        const nowMs = new Date().getTime();
        const diffSecs = Math.max(0, Math.floor((nowMs - checkInMs) / 1000));
        setElapsedSeconds(diffSecs);
      };

      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setElapsedSeconds(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCheckedIn, todayAttendance?.checkIn]);

  const formatElapsed = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-white border border-slate-200">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Shift & Live Status */}
        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Shift: Standard (09:00 AM – 05:00 PM)
            </span>
            {todayAttendance && <AttendanceStatusBadge status={todayAttendance.status} />}
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {!todayAttendance
                ? 'Ready to Start Workday'
                : isCheckedIn
                ? 'Currently Checked In'
                : 'Workday Completed'}
            </h3>
            <p className="text-xs text-slate-500">
              {!todayAttendance
                ? 'Click the clock-in button below to record your arrival.'
                : isCheckedIn
                ? 'Active session timer running based on server check-in timestamp.'
                : 'Your attendance record for today has been saved to PostgreSQL.'}
            </p>
          </div>

          {/* Timestamps & Hours Summary */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs font-mono">
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Check In</span>
              <span className="font-bold text-slate-800">{formatTime(todayAttendance?.checkIn)}</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Check Out</span>
              <span className="font-bold text-slate-800">{formatTime(todayAttendance?.checkOut)}</span>
            </div>
            {isCompleted && (
              <>
                <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <span className="text-indigo-400 block text-[10px] uppercase font-semibold">Working Hours</span>
                  <span className="font-bold text-indigo-700">{formatMinutes(todayAttendance?.workingMinutes)}</span>
                </div>
                {Boolean(todayAttendance?.extraMinutes && todayAttendance.extraMinutes > 0) && (
                  <div className="p-2 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <span className="text-emerald-500 block text-[10px] uppercase font-semibold">Overtime</span>
                    <span className="font-bold text-emerald-700">{formatMinutes(todayAttendance?.extraMinutes)}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right: Live Session Clock / Primary Action */}
        <div className="flex flex-col items-center justify-center p-5 bg-slate-50 border border-slate-200 rounded-2xl shrink-0 text-center min-w-[240px] space-y-3">
          {isCheckedIn ? (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider block">
                Active Session Duration
              </span>
              <div className="text-3xl font-black font-mono text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
                <Clock size={22} className="text-indigo-600 animate-pulse" />
                {formatElapsed(elapsedSeconds)}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Daily Check-in Control
              </span>
              <div className="text-lg font-bold text-slate-700">
                {isCompleted ? 'Shift Concluded' : 'Not Checked In'}
              </div>
            </div>
          )}

          {/* Action Button */}
          {!todayAttendance ? (
            <Button
              variant="primary"
              size="lg"
              loading={loading}
              onClick={onCheckIn}
              icon={<LogIn size={18} />}
              className="w-full shadow-md"
            >
              Clock In Now
            </Button>
          ) : isCheckedIn ? (
            <Button
              variant="danger"
              size="lg"
              loading={loading}
              onClick={onCheckOut}
              icon={<LogOut size={18} />}
              className="w-full shadow-md"
            >
              Clock Out
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 py-1">
              <CheckCircle2 size={16} /> Attendance Completed
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
