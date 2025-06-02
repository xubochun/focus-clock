export function getRecords() {
  return JSON.parse(localStorage.getItem('records') || '[]');
}

export function saveRecord(record) {
  const records = getRecords();
  records.push(record);
  localStorage.setItem('records', JSON.stringify(records));
}

export function deleteRecord(index) {
  const records = getRecords();
  records.splice(index, 1);
  localStorage.setItem('records', JSON.stringify(records));
}
