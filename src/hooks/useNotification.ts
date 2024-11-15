import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (type: 'success' | 'error', message: string) => void;
  removeNotification: (id: string) => void;
}

export const useNotification = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (type, message) => {
    const id = crypto.randomUUID();
    set((state) => ({
      notifications: [...state.notifications, { id, type, message }]
    }));
    // Auto-remove after 5 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }));
    }, 5000);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }))
}));