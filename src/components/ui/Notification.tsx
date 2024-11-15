import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export function Notification({ type, message, onClose }: NotificationProps) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-400" />
  };

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <div className={`fixed top-4 right-4 w-96 border rounded-lg shadow-lg ${styles[type]} p-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="ml-4 flex flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex rounded-md hover:text-gray-500 focus:outline-none"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}