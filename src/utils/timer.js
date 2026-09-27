export const modeLabels = { focus: 'Focus', short: 'Short break', long: 'Long break' };
export const localDay = (time = Date.now()) => { const d = new Date(time); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
export const clamp = (value, min, max, fallback) => Number.isFinite(Number(value)) ? Math.min(max, Math.max(min, Math.round(Number(value)))) : fallback;
export const formatTime = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
export const remainingTime = (session, now = Date.now()) => session.running
  ? Math.min(session.remaining, Math.max(0, Math.ceil((session.deadline - now) / 1000)))
  : session.remaining;

export function settle(state, now = Date.now()) {
  const s = state.session;
  if (!s.running || s.deadline > now) return state;
  const focused = s.mode === 'focus';
  const count = s.cycleCount + Number(focused);
  const next = focused ? (count >= state.settings.interval ? 'long' : 'short') : 'focus';
  const day = localDay(s.deadline);
  const totals = { ...state.totals };
  if (focused) totals[day] = (totals[day] || 0) + 1;
  return { ...state, totals,
    session: { mode: next, remaining: state.settings[next] * 60, length: state.settings[next] * 60, running: false, deadline: null,
      completed: s.completed + Number(focused), cycleCount: s.mode === 'long' ? 0 : count,
      lastCompletedMode: s.mode },
    alertUntil: state.settings.sound ? s.deadline + 60000 : null,
  };
}

export function timerAction(state, action, now = Date.now()) {
  const s = state.session;
  switch (action.type) {
    case 'START': return { ...state, alertUntil: null, session: { ...s, running: true, deadline: now + s.remaining * 1000 } };
    case 'PAUSE': return { ...state, session: { ...s, remaining: remainingTime(s, now), running: false, deadline: null } };
    case 'RESET': return { ...state, alertUntil: null, session: { ...s, remaining: state.settings[s.mode] * 60, length: state.settings[s.mode] * 60, running: false, deadline: null, lastCompletedMode: null } };
    case 'MODE': return { ...state, alertUntil: null, session: { ...s, mode: action.mode, remaining: state.settings[action.mode] * 60, length: state.settings[action.mode] * 60, running: false, deadline: null } };
    case 'STOP_ALERT': return { ...state, alertUntil: null };
    case 'SETTINGS': {
      const settings = { ...state.settings, ...action.patch };
      return { ...state, settings, alertUntil: settings.sound ? state.alertUntil : null,
        session: !s.running && !action.defer ? { ...s, remaining: settings[s.mode] * 60, length: settings[s.mode] * 60 } : s };
    }
    case 'APPLY_LENGTH': return { ...state, session: { ...s, remaining: state.settings[s.mode] * 60, length: state.settings[s.mode] * 60, deadline: s.running ? now + state.settings[s.mode] * 60000 : null } };
    default: return state;
  }
}
