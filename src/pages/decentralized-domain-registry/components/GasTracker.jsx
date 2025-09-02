import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const GasTracker = ({ gasPrice, network }) => {
  const [gasTrend, setGasTrend] = useState('stable'); // 'up', 'down', 'stable'
  const [previousGas, setPreviousGas] = useState(gasPrice);

  useEffect(() => {
    if (gasPrice !== previousGas) {
      if (gasPrice > previousGas) {
        setGasTrend('up');
      } else if (gasPrice < previousGas) {
        setGasTrend('down');
      } else {
        setGasTrend('stable');
      }
      setPreviousGas(gasPrice);
    }
  }, [gasPrice, previousGas]);

  const getGasColor = () => {
    if (gasPrice < 20) return 'text-success';
    if (gasPrice < 50) return 'text-warning';
    return 'text-error';
  };

  const getTrendIcon = () => {
    switch (gasTrend) {
      case 'up':
        return 'TrendingUp';
      case 'down':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  const getTrendColor = () => {
    switch (gasTrend) {
      case 'up':
        return 'text-error';
      case 'down':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getGasLevel = () => {
    if (gasPrice < 20) return 'Low';
    if (gasPrice < 50) return 'Medium';
    if (gasPrice < 100) return 'High';
    return 'Very High';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center space-x-2">
        <Icon name="Fuel" size={16} className="text-muted-foreground" />
        <div>
          <div className="flex items-center space-x-1">
            <span className={`text-sm font-semibold ${getGasColor()}`}>
              {gasPrice?.toFixed(1)} gwei
            </span>
            <Icon 
              name={getTrendIcon()} 
              size={12} 
              className={getTrendColor()} 
            />
          </div>
          <div className="text-xs text-muted-foreground capitalize">
            {getGasLevel()} • {network}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasTracker;