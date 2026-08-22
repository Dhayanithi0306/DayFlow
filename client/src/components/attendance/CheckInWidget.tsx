import React from 'react';
import { useHRMS } from '../../context/HRMSContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Clock } from 'lucide-react';

export const CheckInWidget: React.FC = () => {
  const { isCheckedIn, checkInTime, elapsedSeconds, toggleCheckIn } = useHRMS();

  const formatSeconds = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <Card className="border-indigo-100 bg-gradient-to-b from-white to-indigo-50/30">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-600" /> Daily Attendance Shift
        </h3>
        <Badge status={isCheckedIn ? 'Present' : 'Not Checked In'} />
      </div>

      <div className="text-center py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Session Duration</p>
        <div className="mt-2 text-3xl font-black font-mono tracking-tight text-slate-900">
          {isCheckedIn ? formatSeconds(elapsedSeconds) : '00:00:00'}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {isCheckedIn ? `Checked in at ${checkInTime}` : 'You are currently logged off shift'}
        </p>

        <div className="mt-6">
          <button
            onClick={toggleCheckIn}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2 ${
              isCheckedIn
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-100'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
            }`}
          >
            <Clock className="h-4 w-4" />
            {isCheckedIn ? 'Clock Out Now' : 'Clock In Now'}
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-around text-xs text-slate-600">
          <div>
            <span className="block font-bold text-slate-900">Standard Shift</span>
            <span>09:00 AM - 05:00 PM</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="block font-bold text-slate-900">Workplace</span>
            <span>San Francisco HQ</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
