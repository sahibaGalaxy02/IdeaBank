import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import { Bell, Check } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    markAllAsRead();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      toast.error('Failed to fetch notifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
    } catch (error) {
      console.error('Failed to mark all as read');
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}`);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      toast.error('Failed to mark as read');
      console.error(error);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'idea_approved': return 'bg-green-100 border-green-300';
      case 'idea_rejected': return 'bg-red-100 border-red-300';
      case 'feedback_added': return 'bg-blue-100 border-blue-300';
      case 'team_request': return 'bg-purple-100 border-purple-300';
      case 'team_approved': return 'bg-green-100 border-green-300';
      case 'team_rejected': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1
            className="text-3xl font-bold text-gray-900 mb-8"
            style={{ fontFamily: 'Playfair Display, serif' }}
            data-testid="notifications-title"
          >
            Notifications
          </h1>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3" data-testid="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`border-2 rounded-lg p-5 transition-all ${
                    notification.read
                      ? 'bg-white border-gray-200'
                      : `${getTypeColor(notification.type)}`
                  }`}
                  data-testid="notification-item"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p
                        className={`text-gray-900 ${!notification.read && 'font-medium'}`}
                        data-testid="notification-message"
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1" data-testid="notification-date">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="ml-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
                        title="Mark as read"
                        data-testid="mark-read-button"
                      >
                        <Check size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Bell size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;