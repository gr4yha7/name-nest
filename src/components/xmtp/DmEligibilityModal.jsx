import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { toast } from "sonner";
import Icon from '../AppIcon';
import Button from '../ui/Button';
import { Loader2 } from 'lucide-react';
import NotOnXmtp from './NotOnXmtp';
import { useGlobal } from 'context/global';

function extractHexAddress(input) {
  const match = input.match(/0x[a-fA-F0-9]{40}/);
  return match ? match[0] : null;
}

const DmEligibilityModal = ({ domain, isOpen, onClose }) => {
  if (!isOpen || !domain) {
    return null;
  }
  const [loading, setLoading] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const { xmtpClient } = useGlobal();
  const navigate = useNavigate();
  const userAddress = extractHexAddress(domain?.offererAddress)

  const openDm = useCallback(async () => {
    if (!userAddress) return;
    const identifier = { identifier: userAddress, identifierKind: "Ethereum" };
    const inboxId = await xmtpClient?.findInboxIdByIdentifier(identifier);
    if (!inboxId) return toast.error("Unable to find user inbox ID.");
    const existing = await xmtpClient?.conversations.getDmByInboxId(inboxId);
    const convo = existing || (await xmtpClient?.conversations.newDm(inboxId));
    navigate(`?dm=${convo?.id}&sender=${userAddress}`);
  }, [userAddress, xmtpClient, navigate]);

  useEffect(() => {
    if (!userAddress || !xmtpClient || !isOpen) {
      setLoading(false);
      setAllowed(false);
      return;
    }
    (async () => {
      setLoading(true);
      setAllowed(false);
      try {
        const identifier = { identifier: userAddress, identifierKind: "Ethereum" };
        const can = await xmtpClient?.canMessage([identifier]);
        if (can?.get(userAddress.toLowerCase())) {
          setAllowed(true);
          await openDm();
        } else {
          setAllowed(false);
        }
      } catch (e) {
        console.error('XMTP eligibility error:', e);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [userAddress, xmtpClient, isOpen, openDm]);

  if (!isOpen || !userAddress) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Contact User</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-8">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Checking if recipient is registered on XMTP...</span>
            </div>
          )}
          {!loading && !allowed && <NotOnXmtp />}
          {!loading && allowed && (
            <div className="text-center py-8">
              <p className="text-green-600">User is registered on XMTP. Starting conversation...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DmEligibilityModal;


