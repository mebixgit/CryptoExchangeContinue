export const formatPrice = (price) => {
  if (!price) return 'N/A';
  
  if (price < 0.01) {
    return `$${price.toFixed(6)}`;
  } else if (price < 1) {
    return `$${price.toFixed(4)}`;
  } else if (price < 100) {
    return `$${price.toFixed(2)}`;
  } else {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
};

export const formatPercent = (value) => {
  if (value === null || value === undefined) return 'N/A';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const formatVolume = (volume) => {
  if (!volume) return 'N/A';
  
  if (volume >= 1e9) {
    return `$${(volume / 1e9).toFixed(2)}B`;
  } else if (volume >= 1e6) {
    return `$${(volume / 1e6).toFixed(2)}M`;
  } else if (volume >= 1e3) {
    return `$${(volume / 1e3).toFixed(2)}K`;
  } else {
    return `$${volume.toFixed(2)}`;
  }
};

export const getChangeColor = (change) => {
  if (!change) return 'text-gray-500';
  return change >= 0 ? 'text-green-500' : 'text-red-500';
};

export const getCryptoIcon = (symbol) => {
  const icons = {
    BTC: '₿',
    ETH: 'Ξ',
    SOL: '◎',
    XRP: '✕',
    ADA: '₳',
    DOGE: 'Ð',
    MATIC: 'M',
    DOT: '●',
  };
  return icons[symbol] || symbol;
};
