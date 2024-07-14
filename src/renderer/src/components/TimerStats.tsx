import { useMemo } from 'react';
import '../assets/timer-stats.css';
import { LogType } from "../types";

import { startOfToday, startOfWeek, endOfWeek, isSameDay, isWithinInterval, differenceInSeconds } from 'date-fns';

export type LogListProps = {
  logs: LogType[]
}

export default function TimerStats({ logs = [] }: LogListProps) {
  const today = startOfToday();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Assuming week starts on Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const calculateDuration = (log: LogType) => {
    if (log.duration) {
      return log.duration;
    }
    const start = new Date(log.startTime);
    const end = new Date(log.endTime);
    const diffInSeconds = differenceInSeconds(end, start);
    return diffInSeconds;
  }

  const totalDurationToday = useMemo(() => {
    return logs
      .filter(log => isSameDay(new Date(log.startTime), today))
      .reduce((acc, log) => acc + calculateDuration(log), 0);
  }, [logs, today]);

  const totalDurationThisWeek = useMemo(() => {
    return logs
      .filter(log => isWithinInterval(new Date(log.startTime), { start: weekStart, end: weekEnd }))
      .reduce((acc, log) => acc + calculateDuration(log), 0);
  }, [logs, weekStart, weekEnd]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="flex">
      <div className="stats">
        <span>Today: {formatDuration(totalDurationToday)}</span>
      </div>
      <div className="stats">
        <span>Total This Week: {formatDuration(totalDurationThisWeek)}</span>
      </div>
    </div>
  );
}