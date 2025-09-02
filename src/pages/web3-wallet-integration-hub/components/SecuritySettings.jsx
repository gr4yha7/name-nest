import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const SecuritySettings = ({ wallets }) => {
  const [settings, setSettings] = useState({
    twoFactorEnabled: true,
    biometricAuth: false,
    transactionNotifications: true,
    highValueAlerts: true,
    suspiciousActivityAlerts: true,
    autoLockTimeout: '15',
    requireApprovalAmount: '1000',
    whitelistMode: false
  });

  const [backupStatus, setBackupStatus] = useState({
    seedPhrase: true,
    keystore: false,
    cloudBackup: false
  });

  const timeoutOptions = [
    { value: '5', label: '5 minutes' },
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleBackupAction = (type) => {
    switch (type) {
      case 'seedPhrase': console.log('Show seed phrase backup modal');
        break;
      case 'keystore': console.log('Download keystore file');
        break;
      case 'cloudBackup': console.log('Setup cloud backup');
        break;
    }
  };

  const securityScore = () => {
    let score = 0;
    if (settings?.twoFactorEnabled) score += 20;
    if (settings?.biometricAuth) score += 15;
    if (settings?.transactionNotifications) score += 10;
    if (settings?.highValueAlerts) score += 10;
    if (backupStatus?.seedPhrase) score += 25;
    if (backupStatus?.keystore) score += 10;
    if (backupStatus?.cloudBackup) score += 10;
    return score;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Security Score */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Security Score</h3>
            <p className="text-sm text-muted-foreground">
              Your wallet security rating based on enabled features
            </p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${getScoreColor(securityScore())}`}>
              {securityScore()}%
            </p>
            <p className="text-sm text-muted-foreground">Security Rating</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3 mb-4">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              securityScore() >= 80 ? 'bg-green-500' :
              securityScore() >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${securityScore()}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Basic Security</span>
          <span className="text-muted-foreground">Maximum Security</span>
        </div>
      </div>
      {/* Authentication Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4">
          Authentication & Access
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={16} className="text-green-600" />
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Add extra security to your account
                </p>
              </div>
            </div>
            <Checkbox
              checked={settings?.twoFactorEnabled}
              onCheckedChange={(checked) => handleSettingChange('twoFactorEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Fingerprint" size={16} className="text-blue-600" />
              <div>
                <p className="font-medium text-foreground">Biometric Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Use fingerprint or face ID for quick access
                </p>
              </div>
            </div>
            <Checkbox
              checked={settings?.biometricAuth}
              onCheckedChange={(checked) => handleSettingChange('biometricAuth', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Lock" size={16} className="text-yellow-600" />
              <div>
                <p className="font-medium text-foreground">Auto-Lock Timeout</p>
                <p className="text-sm text-muted-foreground">
                  Automatically lock wallet after inactivity
                </p>
              </div>
            </div>
            <select
              value={settings?.autoLockTimeout}
              onChange={(e) => handleSettingChange('autoLockTimeout', e?.target?.value)}
              className="px-3 py-1 border border-border rounded bg-input text-foreground"
            >
              {timeoutOptions?.map(option => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* Notification Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4">
          Security Notifications
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Bell" size={16} className="text-blue-600" />
              <div>
                <p className="font-medium text-foreground">Transaction Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Get notified for all wallet transactions
                </p>
              </div>
            </div>
            <Checkbox
              checked={settings?.transactionNotifications}
              onCheckedChange={(checked) => handleSettingChange('transactionNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="AlertTriangle" size={16} className="text-yellow-600" />
              <div>
                <p className="font-medium text-foreground">High Value Transaction Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Extra confirmation for large transactions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={settings?.requireApprovalAmount}
                onChange={(e) => handleSettingChange('requireApprovalAmount', e?.target?.value)}
                className="w-20 px-2 py-1 border border-border rounded text-sm bg-input text-foreground"
              />
              <span className="text-sm text-muted-foreground">USD</span>
              <Checkbox
                checked={settings?.highValueAlerts}
                onCheckedChange={(checked) => handleSettingChange('highValueAlerts', checked)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={16} className="text-red-600" />
              <div>
                <p className="font-medium text-foreground">Suspicious Activity Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Monitor for unusual wallet behavior
                </p>
              </div>
            </div>
            <Checkbox
              checked={settings?.suspiciousActivityAlerts}
              onCheckedChange={(checked) => handleSettingChange('suspiciousActivityAlerts', checked)}
            />
          </div>
        </div>
      </div>
      {/* Backup & Recovery */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4">
          Backup & Recovery
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name={backupStatus?.seedPhrase ? "CheckCircle" : "AlertCircle"} 
                size={16} 
                className={backupStatus?.seedPhrase ? "text-green-600" : "text-red-600"} 
              />
              <div>
                <p className="font-medium text-foreground">Seed Phrase Backup</p>
                <p className="text-sm text-muted-foreground">
                  {backupStatus?.seedPhrase ? 'Backed up securely' : 'Not backed up - High risk!'}
                </p>
              </div>
            </div>
            <Button
              variant={backupStatus?.seedPhrase ? "outline" : "default"}
              size="sm"
              onClick={() => handleBackupAction('seedPhrase')}
            >
              {backupStatus?.seedPhrase ? 'View' : 'Backup Now'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name={backupStatus?.keystore ? "CheckCircle" : "Circle"} 
                size={16} 
                className={backupStatus?.keystore ? "text-green-600" : "text-muted-foreground"} 
              />
              <div>
                <p className="font-medium text-foreground">Keystore File</p>
                <p className="text-sm text-muted-foreground">
                  Export encrypted wallet file
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBackupAction('keystore')}
            >
              <Icon name="Download" size={14} className="mr-2" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon 
                name={backupStatus?.cloudBackup ? "CheckCircle" : "Circle"} 
                size={16} 
                className={backupStatus?.cloudBackup ? "text-green-600" : "text-muted-foreground"} 
              />
              <div>
                <p className="font-medium text-foreground">Cloud Backup</p>
                <p className="text-sm text-muted-foreground">
                  Encrypted backup to secure cloud storage
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBackupAction('cloudBackup')}
            >
              Setup
            </Button>
          </div>
        </div>
      </div>
      {/* Connected Wallets Security */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4">
          Connected Wallets
        </h4>
        
        <div className="space-y-3">
          {wallets?.map((wallet, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Wallet" size={16} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">{wallet?.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {wallet?.address?.slice(0, 6)}...{wallet?.address?.slice(-4)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Secure
                </span>
                <Button variant="ghost" size="sm">
                  <Icon name="MoreVertical" size={14} />
                </Button>
              </div>
            </div>
          )) || (
            <p className="text-muted-foreground text-center py-4">
              No wallets connected
            </p>
          )}
        </div>
      </div>
      {/* Security Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800 mb-2">
              Security Best Practices
            </p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• Never share your seed phrase with anyone</li>
              <li>• Use hardware wallets for large amounts</li>
              <li>• Regularly review connected applications</li>
              <li>• Keep your wallet software updated</li>
              <li>• Enable all available security features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;