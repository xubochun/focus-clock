export function formatTime(date) {
  return date.toTimeString().slice(0, 8);
}

export function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min} 分 ${sec} 秒`;
}

export function paginate(records, page, perPage) {
  const start = (page - 1) * perPage;
  return records.slice(start, start + perPage);
}
