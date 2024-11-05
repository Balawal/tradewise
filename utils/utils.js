import { subDays, subWeeks, subMonths } from 'date-fns';
import { Alert, Linking } from 'react-native';

export const getReminderDate = (type, date) => {
  const targetDate = new Date(date);
  switch (type) {
    case '1D':
      return subDays(targetDate, 1);
    case '1W':
      return subWeeks(targetDate, 1);
    case '1M':
      return subMonths(targetDate, 1);
    default:
      return targetDate;
  }
};

export const formatNum = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
};
  
export const formatDecimal = (num, decimalPlaces = 2) => {
    const number = typeof num === 'string' ? parseFloat(num) : num;
    return typeof number === 'number' && !isNaN(number)
        ? number.toFixed(decimalPlaces)
        : 'N/A';
};

export const formatCalculatorNumber = (num) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const extractUsername = (url) => {
  const parts = url.split('/');
  return parts[parts.length - 1];
};

export const parseTweetStats = (stats) => {
  const cleanedStats = stats.trim().replace(/\s+/g, ' ');

  const statsArray = cleanedStats.split(' ').map(item => {
    const number = parseInt(item.replace(/,/g, ''), 10);
    return isNaN(number) ? 'N/A' : number;
  });

  return {
    comments: statsArray[1] || '0',
    retweets: statsArray[2] || '0',
    quotes: statsArray[3] || '0',
    likes: statsArray[4] || '0',
  };
};

export const openEmail = async (subject) => {
  const url = `mailto:bchaudry818@gmail.com?subject=${subject}`;
  
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      throw new Error("Cannot open mail app");
    }
  } catch (error) {
    Alert.alert(
      "Unable to open mail app",
      "Please ensure you have the mail app installed."
    );
  }
};

