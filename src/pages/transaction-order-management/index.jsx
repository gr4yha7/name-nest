import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import TransactionTable from './components/TransactionTable';
import TransactionFilters from './components/TransactionFilters';
import TransactionSummary from './components/TransactionSummary';
import BulkActions from './components/BulkActions';
import DisputeResolution from './components/DisputeResolution';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const TransactionOrderManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [activeDispute, setActiveDispute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    currency: 'all',
    dateRange: 'all',
    startDate: '',
    endDate: '',
    domain: '',
    minAmount: '',
    maxAmount: ''
  });

  // Mock transaction data
  const mockTransactions = [
    {
      id: 'TXN-2024-001',
      domain: 'techstartup.com',
      type: 'sale',
      participant: 'john.doe@email.com',
      amount: '15000',
      currency: 'USD',
      status: 'completed',
      date: '2024-08-20T10:30:00Z',
      createdAt: '2024-08-15T09:00:00Z',
      updatedAt: '2024-08-20T10:30:00Z',
      txHash: '0x1234567890abcdef1234567890abcdef12345678',
      confirmations: 24,
      escrowService: 'Escrow.com',
      escrowFee: 2.5
    },
    {
      id: 'TXN-2024-002',
      domain: 'cryptoexchange.io',
      type: 'purchase',
      participant: 'alice.smith@email.com',
      amount: '8.5',
      currency: 'ETH',
      status: 'in_escrow',
      date: '2024-08-22T14:15:00Z',
      createdAt: '2024-08-20T11:00:00Z',
      updatedAt: '2024-08-22T14:15:00Z',
      txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
      confirmations: 12,
      escrowService: 'Escrow.com',
      escrowFee: 2.5
    },
    {
      id: 'TXN-2024-003',
      domain: 'aiplatform.net',
      type: 'sale',
      participant: 'bob.wilson@email.com',
      amount: '25000',
      currency: 'USD',
      status: 'pending',
      date: '2024-08-23T16:45:00Z',
      createdAt: '2024-08-23T16:45:00Z',
      updatedAt: '2024-08-23T16:45:00Z',
      txHash: '0x567890abcdef1234567890abcdef1234567890ab',
      confirmations: 3,
      escrowService: 'Escrow.com',
      escrowFee: 2.5
    },
    {
      id: 'TXN-2024-004',
      domain: 'blockchainapp.org',
      type: 'purchase',
      participant: 'carol.jones@email.com',
      amount: '12.3',
      currency: 'ETH',
      status: 'disputed',
      date: '2024-08-18T08:20:00Z',
      createdAt: '2024-08-15T14:30:00Z',
      updatedAt: '2024-08-18T08:20:00Z',
      txHash: '0xcdef1234567890abcdef1234567890abcdef1234',
      confirmations: 18,
      escrowService: 'Escrow.com',
      escrowFee: 2.5
    },
    {
      id: 'TXN-2024-005',
      domain: 'nftmarketplace.xyz',
      type: 'sale',
      participant: 'david.brown@email.com',
      amount: '45000',
      currency: 'USD',
      status: 'awaiting_signature',
      date: '2024-08-24T12:00:00Z',
      createdAt: '2024-08-24T12:00:00Z',
      updatedAt: '2024-08-24T12:00:00Z',
      txHash: '0xef1234567890abcdef1234567890abcdef123456',
      confirmations: 1,
      escrowService: 'Escrow.com',
      escrowFee: 2.5
    }
  ];

  const mockSummary = {
    totalVolume: 105800,
    activeTransactions: 3,
    completedThisMonth: 12,
    pendingActions: 2
  };

  const mockRecentActivity = [
    {
      type: 'payment_received',
      title: 'Payment received',
      description: 'Payment of $15,000 received for techstartup.com',
      timestamp: '2024-08-24T10:30:00Z',
      domain: 'techstartup.com',
      amount: '$15,000'
    },
    {
      type: 'signature_pending',
      title: 'Signature required',
      description: 'Transfer documents awaiting your signature',
      timestamp: '2024-08-24T09:15:00Z',
      domain: 'nftmarketplace.xyz'
    },
    {
      type: 'dispute_opened',
      title: 'Dispute opened',
      description: 'Buyer has opened a dispute regarding domain transfer',
      timestamp: '2024-08-23T16:45:00Z',
      domain: 'blockchainapp.org'
    },
    {
      type: 'escrow_funded',
      title: 'Escrow funded',
      description: 'Escrow account has been funded with 8.5 ETH',
      timestamp: '2024-08-22T14:15:00Z',
      domain: 'cryptoexchange.io',
      amount: '8.5 ETH'
    },
    {
      type: 'message_received',
      title: 'New message',
      description: 'You have received a new message from the buyer',
      timestamp: '2024-08-22T11:30:00Z',
      domain: 'aiplatform.net'
    }
  ];

  const mockDispute = {
    id: 'DSP-2024-001',
    domain: 'blockchainapp.org',
    status: 'open',
    amount: '12.3 ETH',
    buyer: 'carol.jones@email.com',
    seller: 'you@email.com',
    createdAt: '2024-08-18T08:20:00Z',
    updatedAt: '2024-08-24T14:30:00Z',
    mediator: 'Platform Support',
    reason: `The domain transfer has not been completed despite payment being made 5 days ago. The seller has not responded to my messages and the domain is still pointing to the old nameservers. I need immediate assistance to resolve this issue.`,
    messages: [
      {
        sender: 'carol.jones@email.com',
        content: `I made the payment of 12.3 ETH on August 15th but the domain transfer hasn't been completed. The domain is still pointing to the old nameservers and I haven't received any transfer confirmation.`,
        timestamp: '2024-08-18T08:20:00Z',
        attachments: []
      },
      {
        sender: 'Mediator',
        content: `Thank you for opening this dispute. We have notified the seller and are investigating the issue. Please provide any additional documentation you may have regarding this transaction.`,
        timestamp: '2024-08-18T10:15:00Z',
        attachments: []
      },
      {
        sender: 'You',
        content: `I apologize for the delay. There was a technical issue with our domain management system. I'm working to resolve this immediately and will have the transfer completed within 24 hours.`,timestamp: '2024-08-19T14:30:00Z',
        attachments: []
      },
      {
        sender: 'Mediator',
        content: `We appreciate the update. Please ensure the transfer is completed as promised. We will monitor the progress and follow up if needed.`,
        timestamp: '2024-08-20T09:00:00Z',
        attachments: []
      }
    ]
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...transactions];

    if (filters?.type !== 'all') {
      filtered = filtered?.filter(t => t?.type === filters?.type);
    }

    if (filters?.status !== 'all') {
      filtered = filtered?.filter(t => t?.status === filters?.status);
    }

    if (filters?.currency !== 'all') {
      filtered = filtered?.filter(t => t?.currency === filters?.currency);
    }

    if (filters?.domain) {
      filtered = filtered?.filter(t => 
        t?.domain?.toLowerCase()?.includes(filters?.domain?.toLowerCase())
      );
    }

    if (filters?.minAmount) {
      filtered = filtered?.filter(t => parseFloat(t?.amount) >= parseFloat(filters?.minAmount));
    }

    if (filters?.maxAmount) {
      filtered = filtered?.filter(t => parseFloat(t?.amount) <= parseFloat(filters?.maxAmount));
    }

    // Date range filtering
    if (filters?.dateRange !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (filters?.dateRange) {
        case 'today':
          startDate?.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case 'month':
          startDate?.setMonth(now?.getMonth() - 1);
          break;
        case 'quarter':
          startDate?.setMonth(now?.getMonth() - 3);
          break;
        case 'year':
          startDate?.setFullYear(now?.getFullYear() - 1);
          break;
        case 'custom':
          if (filters?.startDate && filters?.endDate) {
            const customStart = new Date(filters.startDate);
            const customEnd = new Date(filters.endDate);
            filtered = filtered?.filter(t => {
              const transactionDate = new Date(t.date);
              return transactionDate >= customStart && transactionDate <= customEnd;
            });
          }
          break;
      }

      if (filters?.dateRange !== 'custom') {
        filtered = filtered?.filter(t => new Date(t.date) >= startDate);
      }
    }

    setFilteredTransactions(filtered);
  }, [transactions, filters]);

  const handleRowExpand = (transactionId) => {
    setExpandedRows(prev => 
      prev?.includes(transactionId)
        ? prev?.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      currency: 'all',
      dateRange: 'all',
      startDate: '',
      endDate: '',
      domain: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  const handleExport = () => {
    // Mock export functionality
    const csvContent = filteredTransactions?.map(t => 
      `${t?.id},${t?.domain},${t?.type},${t?.participant},${t?.amount},${t?.currency},${t?.status},${t?.date}`
    )?.join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  const handleBulkAction = async (action, transactionIds) => {
    // Mock bulk action processing
    console.log(`Executing ${action} on transactions:`, transactionIds);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (action === 'export') {
      const selectedData = filteredTransactions?.filter(t => 
        transactionIds?.includes(t?.id)
      );
      const csvContent = selectedData?.map(t => 
        `${t?.id},${t?.domain},${t?.type},${t?.participant},${t?.amount},${t?.currency},${t?.status},${t?.date}`
      )?.join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL?.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `selected-transactions-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
      a?.click();
      window.URL?.revokeObjectURL(url);
    }
  };

  const handleClearSelection = () => {
    setSelectedTransactions([]);
  };

  const handleDisputeResponse = async (responseData) => {
    // Mock dispute response submission
    console.log('Submitting dispute response:', responseData);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add the response to the dispute messages
    const newMessage = {
      sender: 'You',
      content: responseData?.response,
      timestamp: new Date()?.toISOString(),
      attachments: responseData?.attachments || []
    };
    
    setActiveDispute(prev => ({
      ...prev,
      messages: [...prev?.messages, newMessage],
      updatedAt: new Date()?.toISOString()
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <Icon name="Loader2" size={20} className="animate-spin" />
            <span className="text-muted-foreground">Loading transactions...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb />
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transaction Management</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage all your domain transactions and negotiations
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Icon name="RefreshCw" size={16} />
              <span className="ml-2">Refresh</span>
            </Button>
            <Button>
              <Icon name="Plus" size={16} />
              <span className="ml-2">New Transaction</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <TransactionFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onExport={handleExport}
            />

            <BulkActions
              selectedTransactions={selectedTransactions}
              onBulkAction={handleBulkAction}
              onClearSelection={handleClearSelection}
            />

            <TransactionTable
              transactions={filteredTransactions}
              onRowExpand={handleRowExpand}
              expandedRows={expandedRows}
              onStatusUpdate={(id, status) => {
                setTransactions(prev => 
                  prev?.map(t => t?.id === id ? { ...t, status } : t)
                );
              }}
            />

            {filteredTransactions?.length === 0 && (
              <div className="text-center py-12">
                <Icon name="FileX" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or create a new transaction
                </p>
                <Button>
                  <Icon name="Plus" size={16} />
                  <span className="ml-2">Create Transaction</span>
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TransactionSummary
              summary={mockSummary}
              recentActivity={mockRecentActivity}
            />
          </div>
        </div>

        {/* Quick Access Dispute Button */}
        <div className="fixed bottom-6 right-6">
          <Button
            variant="destructive"
            size="lg"
            onClick={() => setActiveDispute(mockDispute)}
            className="shadow-elevated"
          >
            <Icon name="AlertTriangle" size={16} />
            <span className="ml-2">View Dispute</span>
          </Button>
        </div>

        {/* Dispute Resolution Modal */}
        {activeDispute && (
          <DisputeResolution
            dispute={activeDispute}
            onClose={() => setActiveDispute(null)}
            onSubmitResponse={handleDisputeResponse}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionOrderManagement;