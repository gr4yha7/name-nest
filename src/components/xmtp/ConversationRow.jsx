import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { shortenAddress } from "utils/cn";
import { useNavigate } from "react-router";
import { useGlobal } from "context/global";

/**
 * ConversationRow
 * One row in conversations list, shows peer and last message snippet.
 */
const ConversationRow = ({ dm }) => {
  const navigate = useNavigate();
  const { xmtpClient } = useGlobal();
  const [peerAddress, setPeerAddress] = useState("Unknown");
  const [snippet, setSnippet] = useState("---");
  const [loading, setLoading] = useState(false);

  const applySnippet = useCallback(
    (message) => {
      if (!message || typeof message.content !== "string") return;
      const type = message.content.split("::")[0];
      const fromMe = message.senderInboxId === xmtpClient?.inboxId;
      if (fromMe) {
        if (type === "send_offer") setSnippet("💌 Sent an offer");
        else if (type === "accept_offer") setSnippet("🎉 Accepted an offer");
        else if (type === "offer_domain") setSnippet("🌐 Sent a domain listing");
        else if (type === "offer_domain_accept") setSnippet("🎉 Accepted your domain listing");
        else setSnippet(String(message.content));
      } else {
        if (type === "send_offer") setSnippet("💌 Received an offer");
        else if (type === "accept_offer") setSnippet("🎉 Accepted your offer");
        else if (type === "offer_domain") setSnippet("🌐 Received a domain listing");
        else if (type === "offer_domain_accept") setSnippet("🎉 Accepted your domain listing");
        else setSnippet(String(message.content));
      }
    },
    [xmtpClient?.inboxId]
  );

  // Stream messages to keep snippet fresh
  useEffect(() => {
    if (!dm) return;
    let stream;
    (async () => {
      stream = await dm.stream({
        onValue: (m) => applySnippet(m),
        onError: (e) => console.error("dm stream error", e),
      });
    })();
    return () => {
      if (stream && typeof stream.return === "function") stream.return();
    };
  }, [dm, applySnippet]);

  // Initial snippet + peer address
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const history = await dm.messages();
        const last = [...history].reverse().find((m) => typeof m.content === "string");
        if (!cancelled && last) applySnippet(last);

        const inboxId = await dm.peerInboxId();
        const states = await xmtpClient?.preferences.inboxStateFromInboxIds([inboxId]);
        if (!cancelled) {
          setPeerAddress(states?.[0]?.identifiers?.[0]?.identifier || "Unknown");
        }
      } catch {
        if (!cancelled) setPeerAddress("Unknown");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dm, xmtpClient?.preferences, applySnippet]);

  const goThread = useCallback(() => {
    navigate(`?dm=${dm.id}&sender=${peerAddress}`);
  }, [dm.id, navigate, peerAddress]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-accent border-b cursor-pointer transition-all" onClick={goThread}>
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center min-w-[40px]">
        <span className="text-sm font-medium text-gray-600">{peerAddress ? peerAddress.slice(2, 4).toUpperCase() : "??"}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{shortenAddress(peerAddress)}</div>
        <div className="text-sm text-muted-foreground line-clamp-1">{snippet}</div>
      </div>
    </div>
  );
};

export default ConversationRow;


