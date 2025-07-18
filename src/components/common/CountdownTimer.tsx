import React, { useState, useEffect } from 'react';
import { getTimeRemaining } from '../../utils/dateUtils';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, className = '' }) => {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(targetDate));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [targetDate]);

  const isExpired = timeRemaining === 'Expired';

  return (
    <span className={`${className} ${isExpired ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
      {timeRemaining}
    </span>
  );
};

export default CountdownTimer;