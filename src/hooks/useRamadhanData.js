import { useCallback, useEffect, useState } from 'react';
import {
  getData,
  getTodayLog,
  getRamadhanDay,
  getStreak,
  getTotalCompleted,
  getCalendarData,
  getOverallConsistency,
  saveTodayLog,
  updateLogByDate,
  addCustomTracker as addCustomTrackerStorage,
  editCustomTracker as editCustomTrackerStorage,
  deleteCustomTracker as deleteCustomTrackerStorage,
  getCustomTrackerTotalCompleted,
} from '../utils/storage';

export function useRamadhanData() {
  const [data, setData] = useState(getData());
  const [todayLog, setTodayLog] = useState(getTodayLog());
  const [ramadhanDay, setRamadhanDay] = useState(getRamadhanDay());
  const [streak, setStreak] = useState(getStreak());
  const [calendar, setCalendar] = useState(getCalendarData());
  const [consistency, setConsistency] = useState(getOverallConsistency());

  const refresh = useCallback(() => {
    const newData = getData();
    setData(newData);
    setTodayLog(getTodayLog());
    setRamadhanDay(getRamadhanDay());
    setStreak(getStreak());
    setCalendar(getCalendarData());
    setConsistency(getOverallConsistency());
  }, []);

  useEffect(() => {
    // ensure we always sync to latest storage on mount
    refresh();

    // sync across tabs/windows and after manual localStorage edits
    const onStorage = (e) => {
      if (e.key && e.key !== 'ramadhan_tracker_data') return;
      refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refresh]);

  const updateTodayLog = (updates) => {
    const newLog = { ...todayLog, ...updates };
    setTodayLog(newLog);
    saveTodayLog(newLog);
    refresh();
  };

  const updateLogForDate = (dateKey, updates) => {
    const updated = updateLogByDate(dateKey, updates);
    // keep todayLog in sync if editing today from Calendar
    // (avoid relying on date-fns in hook; refresh will sync anyway)
    refresh();
    return updated;
  };

  const getIbadahProgress = (key) => {
    const completed = getTotalCompleted(key);
    const target = data.targets[key] || 30;
    return { completed, target, percentage: Math.round((completed / target) * 100) };
  };

  // --- Custom Tracker Handlers ---
  const addCustomTracker = (title, target) => {
    addCustomTrackerStorage(title, target);
    refresh();
  };

  const editCustomTracker = (id, newTitle, newTarget) => {
    editCustomTrackerStorage(id, newTitle, newTarget);
    refresh();
  };

  const deleteCustomTracker = (id) => {
    deleteCustomTrackerStorage(id);
    refresh();
  };

  const getCustomProgress = (id) => {
    const tracker = data.customTrackers.find(t => t.id === id);
    if (!tracker) return { completed: 0, target: 30, percentage: 0 };
    const completed = getCustomTrackerTotalCompleted(id);
    const target = tracker.target || 30;
    return { completed, target, percentage: Math.round((completed / target) * 100) };
  };

  return {
    data,
    customTrackers: data.customTrackers || [],
    todayLog,
    ramadhanDay,
    streak,
    calendar,
    consistency,
    refresh,
    updateTodayLog,
    updateLogForDate,
    getIbadahProgress,
    addCustomTracker,
    editCustomTracker,
    deleteCustomTracker,
    getCustomProgress
  };
}

