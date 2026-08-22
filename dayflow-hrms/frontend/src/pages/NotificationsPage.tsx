import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../types';
import { notificationService, NotificationQueryParams } from '../services/notificationService';
import { useNotifications } from '../context/NotificationContext';
import { PageHeader } from '../components/common/PageHeader';
import { Button } from '../components/common/Button';
import { Pagination } from '../components/common/Pagination';
import { FilterDropdown } from '../components/common/FilterDropdown';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { formatDate } from '../utils/formatters';
import { Bell, CheckCheck, ExternalLink } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { markRead, markAllRead } = useNotifications();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadOnly, setUnreadOnly] = useState<string>('all');

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params: NotificationQueryParams = {
        page,
        limit: 15,
        unreadOnly: unreadOnly === 'unread' ? true : undefined,
      };
      const res = await notificationService.getUserNotifications(params);
      if (res.success && res.data) {
        setNotifications(res.data.items);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.total);
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, unreadOnly]);

  const handleMarkAll = async () => {
    await markAllRead();
    fetchNotifications();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications Center"
        subtitle="Review workday alerts, leave approval updates, and payroll statements."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAll}
            icon={<CheckCheck size={16} />}
          >
            Mark All as Read
          </Button>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <FilterDropdown
          label="Filter Status"
          value={unreadOnly}
          onChange={(val) => {
            setUnreadOnly(val);
            setPage(1);
          }}
          options={[
            { label: 'All Notifications', value: 'all' },
            { label: 'Unread Only', value: 'unread' },
          ]}
        />
      </div>

      {/* Notification List */}
      {loading ? (
        <LoadingState message="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No Notifications Found"
          description="You're all caught up! Workday updates and alerts will appear here."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.isRead) markRead(n.id);
                if (n.linkUrl) navigate(n.linkUrl);
              }}
              className={`p-4 transition-colors flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50 ${
                !n.isRead ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-2.5 rounded-xl shrink-0 ${!n.isRead ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                  <Bell size={18} />
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${!n.isRead ? 'text-indigo-950' : 'text-slate-900'}`}>
                    {n.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[11px] text-slate-400 font-mono mt-1.5 block">{formatDate(n.createdAt)}</span>
                </div>
              </div>

              {n.linkUrl && (
                <div className="text-xs text-indigo-600 font-semibold flex items-center gap-1 shrink-0 pt-1">
                  <span>View</span>
                  <ExternalLink size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && notifications.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={15}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
