// Utility functions for common operations

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[\d\s\-\+\(\)]+$/;
  return regex.test(phone) && phone.length >= 10;
};

export const categoryEmojis = {
  wedding: '💒',
  festival: '🎪',
  party: '🎉',
  conference: '🎯',
  concert: '🎵',
  sports: '⚽',
  catering: '🍽️',
  photography: '📸',
  venue: '🏢',
  decoration: '🎨',
  entertainment: '🎭',
  florist: '🌸',
  events: '📅',
  business: '💼',
  entertainment: '🎬',
  lifestyle: '✨',
};

export const getEmoji = (category) => {
  return categoryEmojis[category?.toLowerCase()] || '✨';
};
