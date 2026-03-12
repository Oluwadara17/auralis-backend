export function formatDate(dateValue) {
  if (!dateValue) {
    return 'Unknown date';
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed);
}

export function splitTags(tags) {
  if (!tags) {
    return [];
  }

  return String(tags)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}
