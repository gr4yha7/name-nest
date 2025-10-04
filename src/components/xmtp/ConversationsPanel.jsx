import { useEffect, useMemo, useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { cn } from "utils/cn";
import ConversationRow from "./ConversationRow";
import { useGlobal } from "context/global";
import { useMessagingContext } from "./MessagingContext";
import Icon from "components/AppIcon";
import Select from "components/ui/Select";
import Input from "components/ui/Input";

/**
 * ConversationsPanel
 * Left-hand list of active conversations. Streams new ones in real time.
 */
const ConversationsPanel = ({ isMobile = false }) => {
  const { xmtpClient } = useGlobal();
  console.log("client2", xmtpClient)

  const { isThreadOpen } = useMessagingContext();

  const [threads, setThreads] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');


  // Initial load of conversations
  useEffect(() => {
    if (!xmtpClient) {
      setThreads([]);
      return;
    }
    let cancelled = false;
    setLoadingThreads(true);
    (async () => {
      try {
        const list = await xmtpClient.conversations.list();
        const activeOnly = (list || []).filter((c) => c.isActive);
        if (!cancelled) setThreads(activeOnly);
      } catch (err) {
        console.error("Failed to load conversations", err);
        if (!cancelled) setThreads([]);
      } finally {
        if (!cancelled) setLoadingThreads(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [xmtpClient]);

  // Stream new conversations
  useEffect(() => {
    if (!xmtpClient) return;
    let stream;
    (async () => {
      stream = await xmtpClient.conversations.stream({
        onValue: (dm) => setThreads((prev) => prev.find((t) => t.id === dm.id) ? prev : [...prev, dm]),
        onError: (err) => console.error("conversation stream error", err),
      });
    })();
    return () => {
      if (stream && typeof stream.return === "function") stream.return();
    };
  }, [xmtpClient]);

  const hasThreads = useMemo(() => threads.length > 0, [threads.length]);

  const filterOptions = [
    { value: 'all', label: 'All Conversations' },
    { value: 'active', label: 'Active Deals' },
    { value: 'unread', label: 'Unread Messages' },
    { value: 'archived', label: 'Archived' },
  ];

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
        {loadingThreads ? (
          <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">Loading...</div>
        ) : !hasThreads ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-4">
            <Icon name="MessageSquare" size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No conversations found</h3>
          </div>
        ) : (
          threads.map((dm) => <ConversationRow key={dm.id} dm={dm} />)
        )}
      </div>
      <div className="p-4 border-t border-border bg-muted/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{threads.length} conversations</span>
        </div>
      </div>
    </div>
  );
};

export default ConversationsPanel;


