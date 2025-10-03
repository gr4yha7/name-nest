import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../AppIcon';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGlobal } from 'context/global';

const RtmcConversations = ({ isMobile = false }) => {
  const { xmtpClient } = useGlobal();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [dms, setDms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!xmtpClient) return setDms([]);
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const list = await xmtpClient.conversations.list();
        const activeOnly = (list || []).filter((c) => c.isActive);
        if (!cancelled) setDms(activeOnly);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [xmtpClient]);

  useEffect(() => {
    if (!xmtpClient) return;
    let stream;
    (async () => {
      stream = await xmtpClient.conversations.stream({
        onValue: (dm) => setDms((prev) => prev.find((p) => p.id === dm.id) ? prev : [...prev, dm]),
        onError: (e) => console.error('conv stream', e),
      });
    })();
    return () => {
      if (stream && typeof stream.return === 'function') stream.return();
    };
  }, [xmtpClient]);

  const filterOptions = [
    { value: 'all', label: 'All Conversations' },
    { value: 'active', label: 'Active Deals' },
    { value: 'unread', label: 'Unread Messages' },
    { value: 'archived', label: 'Archived' },
  ];

  const filtered = useMemo(() => {
    // For now, no archived/unread metadata; honor 'all'/'active'
    const base = filter === 'active' ? dms.filter((dm) => dm.isActive) : dms;
    if (!query) return base;
    return base.filter((dm) => dm.id.toLowerCase().includes(query.toLowerCase()));
  }, [dms, filter, query]);

  const activeId = searchParams.get('dm');

  const onSelect = async (dm) => {
    try {
      const inboxId = await dm.peerInboxId();
      const states = await xmtpClient?.preferences.inboxStateFromInboxIds([inboxId]);
      const peer = states?.[0]?.identifiers?.[0]?.identifier || 'unknown';
      navigate(`?dm=${dm.id}&sender=${peer}`);
    } catch {
      navigate(`?dm=${dm.id}`);
    }
  };

  const formatTimestamp = (ns) => {
    if (!ns) return '';
    const d = new Date(Number(ns) / 1_000_000);
    const now = new Date();
    const diff = Math.floor((now - d) / (1000 * 60));
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className={`bg-card border-r border-border ${isMobile ? 'w-full' : 'w-80'} flex flex-col h-full`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Messages</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-muted rounded-md transition-standard">
              <Icon name="Settings" size={16} className="text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-md transition-standard">
              <Icon name="MoreVertical" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="relative mb-3">
          <Input type="search" placeholder="Search conversations..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>

        <Select options={filterOptions} value={filter} onChange={setFilter} placeholder="Filter conversations" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <Icon name="MessageSquare" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No conversations found</h3>
            <p className="text-sm text-muted-foreground">{query ? 'Try adjusting your search terms' : 'Start a conversation to see it here'}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((dm) => (
              <div key={dm.id} onClick={() => onSelect(dm)} className={`p-4 cursor-pointer transition-standard hover:bg-muted ${activeId === dm.id ? 'bg-muted border-r-2 border-primary' : ''}`}>
                <div className="flex items-start space-x-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">🗨️</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground truncate">Direct Message</h4>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{/* timestamp later */}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-primary truncate">XMTP</span>
                      <span className="text-xs font-medium text-foreground">active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate flex-1">Last active {formatTimestamp(dm?.updatedAtNs)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border bg-muted/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filtered.length} conversations</span>
          <span>0 unread</span>
        </div>
      </div>
    </div>
  );
};

export default RtmcConversations;


