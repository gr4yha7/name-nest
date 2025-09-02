import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BulkActions = ({ selectedTransactions, onBulkAction, onClearSelection }) => {
  const [bulkAction, setBulkAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const bulkActionOptions = [
    { value: '', label: 'Select action...' },
    { value: 'export', label: 'Export Selected' },
    { value: 'mark_reviewed', label: 'Mark as Reviewed' },
    { value: 'send_reminder', label: 'Send Reminder' },
    { value: 'archive', label: 'Archive Transactions' },
    { value: 'generate_report', label: 'Generate Report' }
  ];

  const handleBulkAction = async () => {
    if (!bulkAction || selectedTransactions?.length === 0) return;

    setIsProcessing(true);
    try {
      await onBulkAction(bulkAction, selectedTransactions);
      setBulkAction('');
      onClearSelection();
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedTransactions?.length === 0) {
    return null;
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedTransactions?.length} transaction{selectedTransactions?.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              options={bulkActionOptions}
              value={bulkAction}
              onChange={setBulkAction}
              className="min-w-48"
            />
            
            <Button
              variant="default"
              size="sm"
              onClick={handleBulkAction}
              disabled={!bulkAction || isProcessing}
              loading={isProcessing}
            >
              <Icon name="Play" size={14} />
              <span className="ml-2">Execute</span>
            </Button>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
        >
          <Icon name="X" size={14} />
          <span className="ml-2">Clear Selection</span>
        </Button>
      </div>
      {/* Quick Actions */}
      <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-primary/20">
        <span className="text-xs text-muted-foreground">Quick actions:</span>
        <Button
          variant="outline"
          size="xs"
          onClick={() => {
            setBulkAction('export');
            handleBulkAction();
          }}
          disabled={isProcessing}
        >
          <Icon name="Download" size={12} />
          <span className="ml-1">Export</span>
        </Button>
        <Button
          variant="outline"
          size="xs"
          onClick={() => {
            setBulkAction('send_reminder');
            handleBulkAction();
          }}
          disabled={isProcessing}
        >
          <Icon name="Mail" size={12} />
          <span className="ml-1">Remind</span>
        </Button>
        <Button
          variant="outline"
          size="xs"
          onClick={() => {
            setBulkAction('archive');
            handleBulkAction();
          }}
          disabled={isProcessing}
        >
          <Icon name="Archive" size={12} />
          <span className="ml-1">Archive</span>
        </Button>
      </div>
    </div>
  );
};

export default BulkActions;