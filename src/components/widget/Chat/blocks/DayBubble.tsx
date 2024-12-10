import React, { useState, useEffect } from 'react';
import cx from 'classnames';

interface DayBubbleProps {
  timestamp: string;
}

const DayBubble: React.FC<DayBubbleProps> = ({ timestamp }) => {
    const [containerClass, setContainerClass] = useState<string>("")

    useEffect(() => {
      setTimeout(() => setContainerClass("opacity-100"), 1000)
    }, [])

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
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
    <span className={cx("transition-opacity duration-500 opacity-0 mb-4 self-center rounded-lg bg-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-900 dark:bg-blue-600", containerClass)}>
        {formatDate(timestamp)}
    </span>
  );
};

export default DayBubble;