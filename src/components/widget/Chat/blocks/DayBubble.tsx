import React, { useEffect, useState } from 'react';

interface DayBubbleProps {
  timestamp: string;
}

const DayBubble: React.FC<DayBubbleProps> = ({ timestamp }) => {
  const [containerClass, setContainerClass] = useState<string>("");

  useEffect(() => {
    setTimeout(() => setContainerClass("opacity-100"), 1000);
  }, []);

  const stripTime = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const strippedDate = stripTime(date);
    const strippedNow = stripTime(now);

    const diffTime = Math.abs(strippedNow.getTime() - strippedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays <= 4) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
      return formattedDate.replace(',', '');
    }
  };

  return (
    <span className={`mb-4 self-center rounded-lg bg-green-200 px-3 py-2 text-center text-xs font-medium text-black opacity-0 transition-opacity duration-500 dark:bg-blue-600 ${containerClass}`}>
      {formatDate(timestamp)}
    </span>
  );
};

export default DayBubble;