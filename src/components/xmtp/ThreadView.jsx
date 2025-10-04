import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "utils/cn";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { Loader, TimerIcon } from "lucide-react";
import { toast } from "sonner";
import { useGlobal } from "context/global";
import { useMessagingContext } from "./MessagingContext";
import MessageComposer from "./MessageComposer";
import WelcomePane from "./WelcomePane";
import Button from "components/ui/Button";
import Icon from "components/AppIcon";
import { formatDistance, parseISO } from "date-fns";

/**
 * ThreadView
 * Right-hand side: messages of selected conversation + composer.
 */
const ThreadView = ({ isMobile = false, onBack }) => {
  const [searchParams] = useSearchParams();
  const { xmtpClient, selectedDomainMessage } = useGlobal();
  const { isThreadOpen, setIsThreadOpen, syncing, setSyncing } = useMessagingContext();
  const { address } = useAccount();

  const [dm, setDm] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);

  const navigate = useNavigate();

  const isVisible = useMemo(() => {
    return Boolean(searchParams.get("dm") && searchParams.get("recipient") && xmtpClient);
  }, [searchParams, xmtpClient]);

  const amISender = useCallback(
    (peerInboxId) => xmtpClient?.inboxId === peerInboxId,
    [xmtpClient?.inboxId]
  );

  const grouped = useMemo(() => {
    return messages.reduce((acc, m) => {
      const day = new Date(Number(m.sentAtNs) / 1_000_000).toISOString().split("T")[0];
      if (!acc[day]) acc[day] = [];
      acc[day].push({
        id: m.id,
        content: m.content,
        sender: amISender(m.senderInboxId) ? address || "Unknown" : searchParams.get("recipient") || "Unknown",
        timestamp: new Date(Number(m.sentAtNs) / 1_000_000),
      });
      return acc;
    }, {});
  }, [messages, amISender, address, searchParams]);

  // Sync button state
  useEffect(() => {
    if (dm && syncing) {
      dm.sync().catch(() => toast.error("Failed to sync messages")).finally(() => setSyncing(false));
    }
  }, [dm, syncing, setSyncing]);

  // Stream messages
  useEffect(() => {
    if (!dm) return;
    let stream;
    (async () => {
      stream = await dm.stream({
        onValue: (m) => {
          if (m && typeof m.content === "string") setMessages((p) => [...p, m]);
        },
        onError: (e) => console.error("message stream error", e),
      });
    })();
    return () => {
      if (stream && typeof stream.return === "function") stream.return();
    };
  }, [dm]);

  // Load chosen thread
  useEffect(() => {
    if (searchParams.get("dm") && searchParams.get("recipient") && xmtpClient) {
      setSyncing(false);
      setIsThreadOpen(true);
      (async () => {
        const conversation = await xmtpClient.conversations.getConversationById(searchParams.get("dm") || "");
        setDm(conversation);
        const list = await conversation?.messages();
        const onlyText = list?.filter((m) => typeof m.content === "string");
        setMessages(onlyText || []);
      })();
    } else {
      setDm(null);
      setMessages([]);
      setIsThreadOpen(false);
    }
  }, [searchParams, xmtpClient, setIsThreadOpen, setSyncing]);

  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(
    (text) => {
      if (!dm || text.trim() === "") return;
      setSending(true);
      dm.send(text.trim()).catch(() => toast.error("Failed to send message"))
        .finally(() => setSending(false));
    },
    [dm]
  );

  const quickResponses = [
    "Thanks for your interest!",
    "Let me think about it",
    "Can you provide more details?",
    "That sounds reasonable",
    "I\'ll get back to you soon"
  ];

  const handleQuickResponse = (response) => {
    send(response);
  };

  return (
    <div className={cn("flex-1", isMobile ? 'w-full' : 'relative flex-1 border-r rounded-xl bg-white dark:bg-background transition-all w-full min-w-full md:min-w-[calc(100%_-_420px)] max-h-[calc(100%_-_var(--spacing)*2)]', isThreadOpen ? "block" : "hidden md:block")}
    >
      {syncing && (
        <div className="absolute top-0 left-0 w-full h-full bg-background/50 z-10 pointer-events-none transition-opacity backdrop-blur-xs">
          <div className="flex items-center justify-center h-full gap-2">
            <Loader size={16} className="animate-spin" />
            <div className="text-sm">Syncing Messages...</div>
          </div>
        </div>
      )}
      {isVisible ? (
        <>
          <div className="bg-card border-b border-border p-4">

        {/* Domain Context */}
        <div className="mt-3 p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Globe" size={16} className="text-primary" />
              <span className="font-medium text-foreground">{selectedDomainMessage?.name}</span>
            </div>

            <div className="flex items-center space-x-4">
              {selectedDomainMessage?.tokens[0]?.listings?.length > 0 &&
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">Listed: {formatDistance(parseISO(selectedDomainMessage?.tokens[0]?.listings[0]?.createdAt), new Date(), { addSuffix: true })}</span>
                  <div className="flex items-center space-x-2">
                    <TimerIcon name="Shield" size={16} className="text-success" />
                    <span className="text-sm text-foreground">Listing Expires {formatDistance(parseISO(selectedDomainMessage?.tokens[0]?.listings[0]?.expiresAt), new Date(), { addSuffix: true })}</span>
                  </div>
                </div>
              }
              <Button
              onClick={() => navigate("/domain-detail-negotiation")}
              variant="outline" size="sm">
                View Listing
              </Button>
            </div>
          </div>
        </div>
      </div>

        <div className="flex flex-col mt-4">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Object.entries(grouped).map(([date, msgs]) => (
              <div key={date} className="space-y-2">
                <div className="text-center text-sm text-muted-foreground">
                  {new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </div>
                {msgs.map((msg) => (
                  <div key={msg.id} className="flex flex-col space-y-1">
                    <div className={`flex ${msg.sender === address ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-lg px-3 py-2 ${msg.sender === address ? "bg-[#1E40AF] text-white" : "bg-gray-200 text-gray-900"}`}>
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        <span className="text-xs opacity-70">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="px-4 py-2 border-t border-border bg-muted/50">
            <div className="flex space-x-2 overflow-x-auto">
              {quickResponses?.map((response, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickResponse(response)}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  {response}
                </Button>
              ))}
            </div>
          </div>

          <div className="">
            <MessageComposer onSend={send} busy={sending} />
          </div>
        </div>
        </>
      ) : (
        <WelcomePane />)
      }
    </div>
  );
};

export default ThreadView;


