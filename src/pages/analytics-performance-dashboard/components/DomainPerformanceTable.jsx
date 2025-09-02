import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DomainPerformanceTable = () => {
  const [sortField, setSortField] = useState('views');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const domainData = [
    {
      id: 1,
      domain: "techstartup.com",
      category: "Technology",
      views: 2847,
      inquiries: 23,
      offers: 8,
      conversionRate: 12.5,
      avgOfferValue: "$15,000",
      lastActivity: "2 hours ago",
      status: "active",
      trend: "up"
    },
    {
      id: 2,
      domain: "cryptoexchange.io",
      category: "Cryptocurrency",
      views: 1923,
      inquiries: 31,
      offers: 12,
      conversionRate: 18.7,
      avgOfferValue: "$25,000",
      lastActivity: "5 hours ago",
      status: "active",
      trend: "up"
    },
    {
      id: 3,
      domain: "aiplatform.net",
      category: "Artificial Intelligence",
      views: 1654,
      inquiries: 19,
      offers: 6,
      conversionRate: 9.3,
      avgOfferValue: "$12,500",
      lastActivity: "1 day ago",
      status: "active",
      trend: "down"
    },
    {
      id: 4,
      domain: "healthtech.org",
      category: "Healthcare",
      views: 1432,
      inquiries: 15,
      offers: 4,
      conversionRate: 7.8,
      avgOfferValue: "$8,000",
      lastActivity: "3 days ago",
      status: "paused",
      trend: "stable"
    },
    {
      id: 5,
      domain: "financeapp.co",
      category: "Finance",
      views: 1287,
      inquiries: 27,
      offers: 9,
      conversionRate: 15.2,
      avgOfferValue: "$18,000",
      lastActivity: "6 hours ago",
      status: "active",
      trend: "up"
    },
    {
      id: 6,
      domain: "ecommercehub.store",
      category: "E-commerce",
      views: 1156,
      inquiries: 21,
      offers: 7,
      conversionRate: 11.4,
      avgOfferValue: "$9,500",
      lastActivity: "12 hours ago",
      status: "active",
      trend: "stable"
    },
    {
      id: 7,
      domain: "socialmedia.app",
      category: "Social Media",
      views: 987,
      inquiries: 13,
      offers: 3,
      conversionRate: 5.9,
      avgOfferValue: "$6,000",
      lastActivity: "2 days ago",
      status: "active",
      trend: "down"
    },
    {
      id: 8,
      domain: "gamingportal.gg",
      category: "Gaming",
      views: 876,
      inquiries: 18,
      offers: 5,
      conversionRate: 8.7,
      avgOfferValue: "$11,000",
      lastActivity: "8 hours ago",
      status: "active",
      trend: "up"
    }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredData = domainData?.filter(domain =>
    domain?.domain?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    domain?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const sortedData = [...filteredData]?.sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];
    
    if (typeof aValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue?.localeCompare(bValue)
        : bValue?.localeCompare(aValue);
    }
    
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const paginatedData = sortedData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'paused': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return { icon: 'TrendingUp', color: 'text-success' };
      case 'down': return { icon: 'TrendingDown', color: 'text-error' };
      default: return { icon: 'Minus', color: 'text-muted-foreground' };
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <h3 className="text-lg font-semibold text-foreground">Domain Performance</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search domains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-64"
              />
            </div>
            <Button variant="outline" iconName="Download" iconPosition="left">
              Export
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('domain')}
                  className="flex items-center space-x-1 hover:text-primary transition-standard"
                >
                  <span>Domain</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Category</th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('views')}
                  className="flex items-center space-x-1 hover:text-primary transition-standard"
                >
                  <span>Views</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('inquiries')}
                  className="flex items-center space-x-1 hover:text-primary transition-standard"
                >
                  <span>Inquiries</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('offers')}
                  className="flex items-center space-x-1 hover:text-primary transition-standard"
                >
                  <span>Offers</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('conversionRate')}
                  className="flex items-center space-x-1 hover:text-primary transition-standard"
                >
                  <span>Conversion</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Avg Offer</th>
              <th className="text-left p-4 font-medium text-foreground">Status</th>
              <th className="text-left p-4 font-medium text-foreground">Trend</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((domain) => {
              const trendInfo = getTrendIcon(domain?.trend);
              return (
                <tr key={domain?.id} className="border-b border-border hover:bg-muted/30 transition-standard">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">{domain?.domain}</div>
                      <div className="text-sm text-muted-foreground">{domain?.lastActivity}</div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{domain?.category}</td>
                  <td className="p-4 font-medium text-foreground">{domain?.views?.toLocaleString()}</td>
                  <td className="p-4 font-medium text-foreground">{domain?.inquiries}</td>
                  <td className="p-4 font-medium text-foreground">{domain?.offers}</td>
                  <td className="p-4">
                    <span className="font-medium text-foreground">{domain?.conversionRate}%</span>
                  </td>
                  <td className="p-4 font-medium text-foreground">{domain?.avgOfferValue}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(domain?.status)}`}>
                      {domain?.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <Icon name={trendInfo?.icon} size={16} className={trendInfo?.color} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData?.length)} of {sortedData?.length} domains
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
            >
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainPerformanceTable;