import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppNotification, NotificationCategory } from '../types';
import {
  X,
  Bell,
  CheckCheck,
  ShieldAlert,
  GraduationCap,
  FileCheck,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Clock,
  Trash2,
  Check
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    navigateTo,
    currentUser,
    role
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | NotificationCategory>('all');

  if (!isNotificationsDrawerOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    return n.category === activeFilter;
  });

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'editorial_clearance':
        return <FileCheck className="w-4 h-4 text-amber-500" />;
      case 'lms_course':
        return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      case 'reader_letter':
        return <MessageSquare className="w-4 h-4 text-sky-500" />;
      case 'system_security':
        return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const getPriorityBadge = (priority?: 'urgent' | 'high' | 'normal') => {
    if (priority === 'urgent') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          Urgent Action
        </span>
      );
    }
    if (priority === 'high') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          Executive
        </span>
      );
    }
    return null;
  };

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.link) {
      setIsNotificationsDrawerOpen(false);
      navigateTo(notif.link.view, notif.link.detailId);
    }
  };

  const formatRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-slate-800 animate-slideLeft"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Masthead */}
        <div className="p-5 border-b border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-950/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Bureau Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-600 text-white font-mono">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time editorial, masterclass, & security dispatches
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsNotificationsDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-stone-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions & Mark all read */}
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-slate-800 text-xs">
            <span className="text-slate-500 font-mono text-[11px]">
              Active Role: <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser?.name || role}</span>
            </span>
            {unreadNotificationsCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 hover:underline"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 font-bold'
                  : 'bg-stone-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-stone-300'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('editorial_clearance')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeFilter === 'editorial_clearance'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-stone-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-stone-300'
              }`}
            >
              <FileCheck className="w-3 h-3" /> Clearances
            </button>
            <button
              onClick={() => setActiveFilter('lms_course')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeFilter === 'lms_course'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-stone-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-stone-300'
              }`}
            >
              <GraduationCap className="w-3 h-3" /> Academy
            </button>
            <button
              onClick={() => setActiveFilter('system_security')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeFilter === 'system_security'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-stone-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-stone-300'
              }`}
            >
              <ShieldAlert className="w-3 h-3" /> Security
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Bell className="w-6 h-6 opacity-40" />
              </div>
              <h4 className="font-serif font-bold text-slate-700 dark:text-slate-300 text-sm">All caught up</h4>
              <p className="text-xs text-slate-400 mt-1">
                No notifications in this category. You will be alerted when new submissions or policy masterclasses arrive.
              </p>
            </div>
          ) : (
            filteredNotifications.map(item => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                  item.read
                    ? 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800/80 opacity-75 hover:opacity-100'
                    : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 shadow-sm'
                }`}
              >
                {!item.read && (
                  <div className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-500/20" />
                )}

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      {getPriorityBadge(item.priority)}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(item.timestamp)}
                      </span>
                      {item.link && (
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold group-hover:underline">
                          <span>View Details</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Sovereign Footer */}
        <div className="p-4 bg-stone-50 dark:bg-slate-950 border-t border-stone-200 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Official Broadcast Channel of <span className="font-semibold text-slate-800 dark:text-slate-200">The Patriot Editorial Bureau</span>
          </p>
          <p className="text-[10px] text-amber-700 dark:text-amber-400 font-mono mt-0.5">
            Owner & Supreme Authority: Wahab Ali Khiva
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
