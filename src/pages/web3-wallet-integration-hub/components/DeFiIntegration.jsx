import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DeFiIntegration = ({ balances }) => {
  const [activeTab, setActiveTab] = useState('swap');
  const [swapForm, setSwapForm] = useState({
    fromToken: 'ETH',
    toToken: 'USDC',
    amount: '',
    slippage: '0.5'
  });

  const availableTokens = [
    { value: 'ETH', label: 'Ethereum (ETH)', balance: '12.45' },
    { value: 'USDC', label: 'USD Coin (USDC)', balance: '2,850.00' },
    { value: 'MATIC', label: 'Polygon (MATIC)', balance: '450.30' },
    { value: 'SOL', label: 'Solana (SOL)', balance: '25.80' }
  ];

  const slippageOptions = [
    { value: '0.1', label: '0.1%' },
    { value: '0.5', label: '0.5%' },
    { value: '1.0', label: '1.0%' },
    { value: 'custom', label: 'Custom' }
  ];

  const dexOptions = [
    {
      name: 'Uniswap V3',
      logo: 'Zap',
      rate: '1 ETH = 2,850 USDC',
      fee: '0.05% fee',
      impact: '< 0.01%',
      gas: '~$12',
      color: 'bg-pink-500'
    },
    {
      name: '1inch',
      logo: 'TrendingUp',
      rate: '1 ETH = 2,855 USDC',
      fee: '0.03% fee',
      impact: '< 0.01%',
      gas: '~$15',
      color: 'bg-blue-500'
    },
    {
      name: 'SushiSwap',
      logo: 'Repeat',
      rate: '1 ETH = 2,848 USDC',
      fee: '0.30% fee',
      impact: '< 0.01%',
      gas: '~$10',
      color: 'bg-purple-500'
    }
  ];

  const tabs = [
    { id: 'swap', label: 'Token Swap', icon: 'Repeat' },
    { id: 'bridge', label: 'Cross-Chain', icon: 'Bridge' },
    { id: 'yield', label: 'Yield Farming', icon: 'Sprout' }
  ];

  const handleSwap = () => {
    console.log('Executing swap:', swapForm);
  };

  const renderSwapTab = () => (
    <div className="space-y-6">
      {/* Swap Form */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4">
          Instant Token Swap
        </h4>
        
        {/* From Token */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">From</label>
          <div className="flex items-center space-x-3">
            <Select
              value={swapForm?.fromToken}
              onValueChange={(value) => setSwapForm(prev => ({ ...prev, fromToken: value }))}
              options={availableTokens}
              className="flex-1"
            />
            <input
              type="number"
              placeholder="0.0"
              value={swapForm?.amount}
              onChange={(e) => setSwapForm(prev => ({ ...prev, amount: e?.target?.value }))}
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-input text-foreground"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Balance: {availableTokens?.find(t => t?.value === swapForm?.fromToken)?.balance} {swapForm?.fromToken}
          </p>
        </div>

        {/* Swap Direction */}
        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSwapForm(prev => ({
              ...prev,
              fromToken: prev?.toToken,
              toToken: prev?.fromToken
            }))}
          >
            <Icon name="ArrowUpDown" size={16} />
          </Button>
        </div>

        {/* To Token */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">To</label>
          <div className="flex items-center space-x-3">
            <Select
              value={swapForm?.toToken}
              onValueChange={(value) => setSwapForm(prev => ({ ...prev, toToken: value }))}
              options={availableTokens}
              className="flex-1"
            />
            <div className="flex-1 px-4 py-2 border border-border rounded-lg bg-muted text-muted-foreground">
              {swapForm?.amount ? (parseFloat(swapForm?.amount) * 2850)?.toFixed(2) : '0.0'}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Balance: {availableTokens?.find(t => t?.value === swapForm?.toToken)?.balance} {swapForm?.toToken}
          </p>
        </div>

        {/* Slippage Settings */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">Slippage Tolerance</label>
          <Select
            value={swapForm?.slippage}
            onValueChange={(value) => setSwapForm(prev => ({ ...prev, slippage: value }))}
            options={slippageOptions}
            className="w-32"
          />
        </div>

        <Button
          onClick={handleSwap}
          disabled={!swapForm?.amount}
          className="w-full"
          size="lg"
        >
          <Icon name="Repeat" size={16} className="mr-2" />
          Swap Tokens
        </Button>
      </div>

      {/* DEX Comparison */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4">
          Best Exchange Rates
        </h4>
        
        <div className="space-y-3">
          {dexOptions?.map((dex, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg transition-colors cursor-pointer hover:bg-muted/50 ${
                index === 0 ? 'border-green-200 bg-green-50' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${dex?.color} rounded-lg flex items-center justify-center`}>
                    <Icon name={dex?.logo} size={16} color="white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{dex?.name}</p>
                    <p className="text-sm text-muted-foreground">{dex?.rate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-foreground">{dex?.fee}</p>
                  <p className="text-xs text-muted-foreground">Gas: {dex?.gas}</p>
                </div>
                {index === 0 && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Best Rate
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBridgeTab = () => (
    <div className="bg-background border border-border rounded-lg p-6">
      <h4 className="text-md font-semibold text-foreground mb-4">
        Cross-Chain Bridge
      </h4>
      <div className="text-center py-8">
        <Icon name="Bridge" size={48} className="text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Bridge tokens between networks</p>
        <Button className="mt-4">
          <Icon name="Plus" size={16} className="mr-2" />
          Setup Bridge
        </Button>
      </div>
    </div>
  );

  const renderYieldTab = () => (
    <div className="bg-background border border-border rounded-lg p-6">
      <h4 className="text-md font-semibold text-foreground mb-4">
        Yield Farming Opportunities
      </h4>
      <div className="text-center py-8">
        <Icon name="Sprout" size={48} className="text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Earn yield on your domain purchases</p>
        <Button className="mt-4">
          <Icon name="Plus" size={16} className="mr-2" />
          Explore Yields
        </Button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'swap':
        return renderSwapTab();
      case 'bridge':
        return renderBridgeTab();
      case 'yield':
        return renderYieldTab();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* DeFi Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              DeFi Integration
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Swap tokens, bridge assets, and earn yield during domain purchases
            </p>
          </div>
          <Button variant="outline">
            <Icon name="TrendingUp" size={16} className="mr-2" />
            Portfolio Analytics
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Available for Trading</p>
            <p className="text-xl font-bold text-foreground">$75,250</p>
            <p className="text-xs text-green-600">Across 3 networks</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Swap Savings</p>
            <p className="text-xl font-bold text-green-600">$1,240</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Gas Optimization</p>
            <p className="text-xl font-bold text-blue-600">-35%</p>
            <p className="text-xs text-muted-foreground">vs manual swaps</p>
          </div>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <div className="flex space-x-1">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      {renderTabContent()}
      {/* Slippage Protection */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={16} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              Slippage Protection Active
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Automatic MEV protection and sandwich attack prevention for all swaps during domain transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeFiIntegration;