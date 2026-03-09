export const STATUS_COLORS = {
  'open':        '#3b82f6',
  'in-progress': '#f59e0b',
  'resolved':    '#22c55e',
};

export const PRIORITY_COLORS = {
  'low':    '#6b7280',
  'medium': '#f59e0b',
  'high':   '#ef4444',
};

export const CATEGORY_ICONS = {
  maintenance: '🔧',
  food:        '🍽️',
  wifi:        '📶',
  cleanliness: '🧹',
  security:    '🔒',
  other:       '📋',
};

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
