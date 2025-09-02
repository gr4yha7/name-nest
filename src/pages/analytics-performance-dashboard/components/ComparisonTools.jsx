import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ComparisonTools = () => {
  const [selectedDomain, setSelectedDomain] = useState('techstartup.com');
  const [comparisonType, setComparisonType] = useState('market');

  const domainOptions = [
    { value: 'techstartup.com', label: 'techstartup.com' },
    { value: 'cryptoexchange.io', label: 'cryptoexchange.io' },
    { value: 'aiplatform.net', label: 'aiplatform.net' },
    { value: 'healthtech.org', label: 'healthtech.org' }
  ];

  const comparisonOptions = [
    { value: 'market', label: 'Market Average' },
    { value: 'category', label: 'Category Average' },
    { value: 'portfolio', label: 'Portfolio Average' },
    { value: 'competitors', label: 'Top Competitors' }
  ];

  const comparisonData = {
    market: {
      title: "vs Market Average",
      subtitle: "Technology domains marketplace",
      metrics: [
        { label: "Views per Month", your: 2847, benchmark: 2156, change: "+32%" },
        { label: "Conversion Rate", your: 12.5, benchmark: 15.8, change: "-21%" },
        { label: "Avg Offer Value", your: 15000, benchmark: 12800, change: "+17%" },
        { label: "Time to First Offer", your: 8, benchmark: 12, change: "-33%" },
        { label: "Inquiry Response Rate", your: 89, benchmark: 76, change: "+17%" }
      ]
    },
    category: {
      title: "vs Technology Category",
      subtitle: "Similar technology domains",
      metrics: [
        { label: "Views per Month", your: 2847, benchmark: 2934, change: "-3%" },
        { label: "Conversion Rate", your: 12.5, benchmark: 14.2, change: "-12%" },
        { label: "Avg Offer Value", your: 15000, benchmark: 16200, change: "-7%" },
        { label: "Time to First Offer", your: 8, benchmark: 9, change: "-11%" },
        { label: "Inquiry Response Rate", your: 89, benchmark: 82, change: "+9%" }
      ]
    },
    portfolio: {
      title: "vs Your Portfolio",
      subtitle: "Your other domain listings",
      metrics: [
        { label: "Views per Month", your: 2847, benchmark: 1456, change: "+95%" },
        { label: "Conversion Rate", your: 12.5, benchmark: 10.8, change: "+16%" },
        { label: "Avg Offer Value", your: 15000, benchmark: 11200, change: "+34%" },
        { label: "Time to First Offer", your: 8, benchmark: 14, change: "-43%" },
        { label: "Inquiry Response Rate", your: 89, benchmark: 78, change: "+14%" }
      ]
    },
    competitors: {
      title: "vs Top Competitors",
      subtitle: "Best performing similar domains",
      metrics: [
        { label: "Views per Month", your: 2847, benchmark: 4123, change: "-31%" },
        { label: "Conversion Rate", your: 12.5, benchmark: 18.9, change: "-34%" },
        { label: "Avg Offer Value", your: 15000, benchmark: 19500, change: "-23%" },
        { label: "Time to First Offer", your: 8, benchmark: 6, change: "+33%" },
        { label: "Inquiry Response Rate", your: 89, benchmark: 94, change: "-5%" }
      ]
    }
  };

  const currentComparison = comparisonData?.[comparisonType];

  const getChangeColor = (change) => {
    const isPositive = change?.startsWith('+');
    return isPositive ? 'text-success' : 'text-error';
  };

  const getChangeIcon = (change) => {
    const isPositive = change?.startsWith('+');
    return isPositive ? 'ArrowUp' : 'ArrowDown';
  };

  const formatValue = (value, label) => {
    if (label?.includes('Rate') || label?.includes('Response')) {
      return `${value}%`;
    }
    if (label?.includes('Value')) {
      return `$${value?.toLocaleString()}`;
    }
    if (label?.includes('Time')) {
      return `${value} days`;
    }
    return value?.toLocaleString();
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Performance Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Select Domain"
            options={domainOptions}
            value={selectedDomain}
            onChange={setSelectedDomain}
          />
          <Select
            label="Compare Against"
            options={comparisonOptions}
            value={comparisonType}
            onChange={setComparisonType}
          />
        </div>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-lg font-medium text-foreground">{selectedDomain}</h4>
          <p className="text-sm text-muted-foreground">{currentComparison?.title}</p>
          <p className="text-xs text-muted-foreground">{currentComparison?.subtitle}</p>
        </div>

        <div className="space-y-4">
          {currentComparison?.metrics?.map((metric, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-foreground">{metric?.label}</h5>
                <div className={`flex items-center space-x-1 ${getChangeColor(metric?.change)}`}>
                  <Icon name={getChangeIcon(metric?.change)} size={14} />
                  <span className="text-sm font-medium">{metric?.change}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Your Performance</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatValue(metric?.your, metric?.label)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Benchmark</p>
                  <p className="text-lg font-semibold text-muted-foreground">
                    {formatValue(metric?.benchmark, metric?.label)}
                  </p>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Performance vs Benchmark</span>
                  <span>{Math.abs(parseFloat(metric?.change))}% {metric?.change?.startsWith('+') ? 'above' : 'below'}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${metric?.change?.startsWith('+') ? 'bg-success' : 'bg-error'}`}
                    style={{ 
                      width: `${Math.min(100, Math.abs(parseFloat(metric?.change)) * 2)}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Need detailed analysis?</p>
              <p className="text-xs text-muted-foreground">Get comprehensive comparison report</p>
            </div>
            <Button variant="outline" iconName="Download" iconPosition="left">
              Export Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTools;