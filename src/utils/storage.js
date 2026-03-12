import { format, differenceInDays, parseISO, isAfter, isBefore, addDays } from 'date-fns';

const STORAGE_KEY = 'ramadhan_tracker_data';

const defaultData = {
  setupComplete: false,
  ramadhanStartDate: null,
  targets: {
    puasa: 30,
    sholat: 30,
    tarawih: 30,
    tadarus: 30,
    sedekah: 15,
    dzikir: 30,
  },
  customTrackers: [], // Array of { id, title, target, createdAt }
  dailyLogs: {},
};

function cloneDefaultData() {
  return JSON.parse(JSON.stringify(defaultData));
}

function normalizeLog(log) {
  const base = {
    puasa: false,
    sholat: false,
    tarawih: false,
    tadarus: false,
    sedekah: false,
    dzikir: false,
    extraTodos: [],
    customLogs: {}, // { customTrackerId: boolean }
  };
  if (!log || typeof log !== 'object') return base;
  return {
    ...base,
    ...log,
    extraTodos: Array.isArray(log.extraTodos) ? log.extraTodos : [],
    customLogs:
      log.customLogs && typeof log.customLogs === 'object'
        ? log.customLogs
        : {},
  };
}

function normalizeData(raw) {
  const base = cloneDefaultData();
  if (!raw || typeof raw !== 'object') return base;

  const targets = { ...base.targets, ...(raw.targets || {}) };
  const customTrackers = Array.isArray(raw.customTrackers)
    ? raw.customTrackers
    : [];
  const dailyLogs = {};
  if (raw.dailyLogs && typeof raw.dailyLogs === 'object') {
    Object.entries(raw.dailyLogs).forEach(([dateKey, log]) => {
      dailyLogs[dateKey] = normalizeLog(log);
    });
  }

  return {
    ...base,
    ...raw,
    targets,
    customTrackers,
    dailyLogs,
    setupComplete: Boolean(raw.setupComplete),
    ramadhanStartDate: raw.ramadhanStartDate || null,
  };
}

export function getData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return cloneDefaultData();
    const parsed = JSON.parse(stored);
    return normalizeData(parsed);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return cloneDefaultData();
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeData(data)));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// --- Custom Trackers Management ---
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export function addCustomTracker(title, target = 30) {
  const data = getData();
  const newTracker = {
    id: generateId(),
    title: title.trim(),
    target: Number(target),
    createdAt: new Date().toISOString(),
  };
  data.customTrackers.push(newTracker);
  saveData(data);
  return newTracker;
}

export function editCustomTracker(id, newTitle, newTarget) {
  const data = getData();
  const tracker = data.customTrackers.find((t) => t.id === id);
  if (tracker) {
    if (newTitle) tracker.title = newTitle.trim();
    if (newTarget) tracker.target = Number(newTarget);
    saveData(data);
  }
}

export function deleteCustomTracker(id) {
  const data = getData();
  const originalLength = data.customTrackers.length;
  data.customTrackers = data.customTrackers.filter((t) => t.id !== id);
  
  if (data.customTrackers.length !== originalLength) {
    // Clean up customLogs in dailyLogs
    Object.values(data.dailyLogs).forEach((log) => {
      if (log.customLogs && log.customLogs[id] !== undefined) {
        delete log.customLogs[id];
      }
    });
    saveData(data);
  }
}
// ------------------------------------

export function getTodayLog() {
  const data = getData();
  const today = format(new Date(), 'yyyy-MM-dd');
  return normalizeLog(data.dailyLogs[today]);
}

export function saveTodayLog(log) {
  const data = getData();
  const today = format(new Date(), 'yyyy-MM-dd');
  data.dailyLogs[today] = normalizeLog(log);
  saveData(data);
}

export function getLogByDate(dateKey) {
  const data = getData();
  return normalizeLog(data.dailyLogs[dateKey]);
}

export function saveLogByDate(dateKey, log) {
  const data = getData();
  data.dailyLogs[dateKey] = normalizeLog(log);
  saveData(data);
}

export function updateLogByDate(dateKey, updates) {
  const current = getLogByDate(dateKey);
  const next = normalizeLog({ ...current, ...(updates || {}) });
  saveLogByDate(dateKey, next);
  return next;
}

export function getRamadhanDay() {
  const data = getData();
  if (!data.ramadhanStartDate) return 0;
  
  const startDate = parseISO(data.ramadhanStartDate);
  const today = new Date();
  const day = differenceInDays(today, startDate) + 1;
  
  if (day < 1 || day > 30) return 0;
  return day;
}

export function getStreak() {
  const data = getData();
  if (!data.ramadhanStartDate) return 0;
  
  const startDate = parseISO(data.ramadhanStartDate);
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 30; i++) {
    const checkDate = addDays(startDate, i);
    if (isAfter(checkDate, today)) break;
    
    const dateKey = format(checkDate, 'yyyy-MM-dd');
    const log = data.dailyLogs[dateKey];
    
    if (!log) break;
    
    const completed = [
      log.puasa,
      log.sholat,
      log.tarawih,
      log.tadarus,
      log.sedekah,
      log.dzikir,
    ].filter(Boolean).length;
    
    if (completed >= 4) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export function getTotalCompleted(ibadahKey) {
  const data = getData();
  let count = 0;
  
  Object.values(data.dailyLogs).forEach((log) => {
    if (log[ibadahKey]) count++;
  });
  
  return count;
}

export function getCustomTrackerTotalCompleted(trackerId) {
  const data = getData();
  let count = 0;
  
  Object.values(data.dailyLogs).forEach((log) => {
    if (log.customLogs && log.customLogs[trackerId]) count++;
  });
  
  return count;
}

export function getCalendarData() {
  const data = getData();
  if (!data.ramadhanStartDate) return [];
  
  const startDate = parseISO(data.ramadhanStartDate);
  const calendar = [];
  
  for (let i = 0; i < 30; i++) {
    const date = addDays(startDate, i);
    const dateKey = format(date, 'yyyy-MM-dd');
    const log = data.dailyLogs[dateKey] || {
      puasa: false,
      sholat: false,
      tarawih: false,
      tadarus: false,
      sedekah: false,
      dzikir: false,
      extraTodos: [],
      customLogs: {},
    };
    
    const completed = [
      log.puasa,
      log.sholat,
      log.tarawih,
      log.tadarus,
      log.sedekah,
      log.dzikir,
    ].filter(Boolean).length;
    
    calendar.push({
      date: dateKey,
      day: i + 1,
      completed,
      log,
    });
  }
  
  return calendar;
}

export function getOverallConsistency() {
  const data = getData();
  if (!data.ramadhanStartDate) return 0;
  
  const startDate = parseISO(data.ramadhanStartDate);
  const today = new Date();
  let totalDays = 0;
  let consistentDays = 0;
  
  for (let i = 0; i < 30; i++) {
    const checkDate = addDays(startDate, i);
    if (isAfter(checkDate, today)) break;
    
    totalDays++;
    const dateKey = format(checkDate, 'yyyy-MM-dd');
    const log = data.dailyLogs[dateKey];
    
    if (!log) continue;
    
    const completed = [
      log.puasa,
      log.sholat,
      log.tarawih,
      log.tadarus,
      log.sedekah,
      log.dzikir,
    ].filter(Boolean).length;
    
    if (completed >= 4) {
      consistentDays++;
    }
  }
  
  return totalDays > 0 ? Math.round((consistentDays / totalDays) * 100) : 0;
}

