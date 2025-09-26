import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { getChainNameAndCountArray } from 'utils/cn';

const NetworkDistributionMap = ({ data, selectedNetwork, onNetworkSelect, domains }) => {
  const networkColors = {
    "Sepolia Testnet": '#627EEA',
    "Base Sepolia Testnet": '#00FFA3',
    "Doma Testnet": '#8247E5'
  };

  const chartData = domains ? getChainNameAndCountArray(domains) : [];

  console.log("chart", chartData)

  
  const networks = [
    {
      id: 'doma',
      name: 'Doma Testnet',
      icon: 'Sun',
      count: domains?.filter((i) => i?.tokens[0]?.chain?.name === "Doma Testnet")?.length || 0,
      gasPrice: '25 Gwei',
      status: 'congested'
    },
    {
      id: 'sepolia',
      name: 'Sepolia Testnet',
      icon: 'Zap',
      count: domains?.filter((i) => i?.tokens[0]?.chain?.name === "Sepolia Testnet")?.length || 0 || 0,
      gasPrice: '25 Gwei',
      status: 'healthy'
    },
    {
      id: 'baseSepolia',
      name: 'Base Sepolia Testnet',
      icon: 'Triangle',
      count: domains?.filter((i) => i?.tokens[0]?.chain?.name === "Base Sepolia Testnet")?.length || 0,
      gasPrice: '30 Gwei',
      status: 'healthy'
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-popover-foreground capitalize">
            {data?.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {data?.value} domains ({data?.ethValue} ETH)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Network Distribution
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNetworkSelect?.('all')}
        >
          <Icon name="RefreshCw" size={14} className="mr-2" />
          All Networks
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Network List */}
        <div className="space-y-3">
          {networks?.map((network) => (
            <div
              key={network?.id}
              className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedNetwork === network?.id
                  ? 'bg-primary/10 border-primary' :'bg-muted/50 border-border hover:bg-muted'
              }`}
              onClick={() => onNetworkSelect?.(network?.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: networkColors?.[network?.name] }}
                  />
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {network?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {network?.count} domains
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    Gas: {network?.gasPrice}
                  </p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      network?.status === 'healthy' ?'bg-green-100 text-green-800' :'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {network?.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkDistributionMap;