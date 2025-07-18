import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

export const formatDate = (date: string | Date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date) => {
  return format(new Date(date), 'MMM dd, yyyy • HH:mm');
};

export const getTimeRemaining = (targetDate: string | Date) => {
  const now = new Date();
  const target = new Date(targetDate);
  
  const days = differenceInDays(target, now);
  const hours = differenceInHours(target, now) % 24;
  const minutes = differenceInMinutes(target, now) % 60;

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} left`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} left`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
  } else {
    return 'Expired';
  }
};

export const getExamStatus = (examDate: string, applicationEndDate: string) => {
  const now = new Date();
  const exam = new Date(examDate);
  const appEnd = new Date(applicationEndDate);

  if (now > exam) {
    return 'Completed';
  } else if (now > appEnd) {
    return 'Closed';
  } else {
    return 'Open';
  }
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'closed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'completed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};