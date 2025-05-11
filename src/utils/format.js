// 日期格式化
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hour = d.getHours().toString().padStart(2, '0');
  const minute = d.getMinutes().toString().padStart(2, '0');
  const second = d.getSeconds().toString().padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second);
};

// 文件大小格式化
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  
  return `${bytes.toFixed(2)} ${units[i]}`;
};

// 时长格式化（秒转为分:秒）
export const formatDuration = (seconds) => {
  if (!seconds) return '00:00';
  
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

// 手机号格式化（隐藏中间4位）
export const formatPhone = (phone) => {
  if (!phone || phone.length < 7) return phone;
  
  return `${phone.substring(0, 3)}****${phone.substring(phone.length - 4)}`;
};

// 千分位格式化
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '';
  
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}; 