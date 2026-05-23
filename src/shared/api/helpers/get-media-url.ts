const API_ORIGIN = process.env.BASE_URL ?? 'http://2.26.103.62:8080';

export const getMediaUrl = (path?: string | null) => {
  if (!path) return '';

  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  if (!path.startsWith('/uploads/')) return path;

  return `${API_ORIGIN.replace(/\/$/, '')}${path}`;
};
