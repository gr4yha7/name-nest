import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from "react-router";
import { toast } from "sonner";
import Icon from '../AppIcon';
import Button from '../ui/Button';
import { useGlobal } from 'context/global';
import { getExistingXMTPClient } from 'utils/xmtpUtils';
import { useAccount } from 'wagmi';

function extractHexAddress(input) {
  const match = input.match(/0x[a-fA-F0-9]{40}/);
  return match ? match[0] : null;
}

const DmEligibilityModal = ({ domain, isOpen, onClose, setIsOwnerEligible }) => {
  console.log("open", isOpen, "domain", domain);
  if (!isOpen || !domain) {
    return null;
  }
  const [userAddress, setUserAddress] = useState(extractHexAddress(domain?.tokens?.length > 0 ? domain?.tokens[0].ownerAddress : domain?.offererAddress));
  const { setXmtpClient } = useGlobal();
  const { address } = useAccount();
  const navigate = useNavigate();
  // const userAddress = extractHexAddress(domain?.offererAddress)
  console.log("userAddr", userAddress)

  const openDm = useCallback(async () => {
    if (!userAddress) return;

    try {
      const client = await getExistingXMTPClient(address);
      console.log("client1", client)
      setXmtpClient(client);
      if (!client) {
        return toast.error("Unable to initialize XMTP client.");
      }

      // Force sync conversations to avoid stale state
      await client.conversations.sync();

      const identifier = { identifier: userAddress, identifierKind: "Ethereum" };
      const inboxId = await client.findInboxIdByIdentifier(identifier);

      if (!inboxId) {
        return toast.error("Unable to find user inbox ID.");
      }

      // Try to fetch existing DM
      let convo = await client.conversations.getDmByInboxId(inboxId);

      // If not found, resync and retry
      if (!convo) {
        await client.conversations.sync();
        convo = await client.conversations.getDmByInboxId(inboxId);
      }

      // If still not found, create a new one
      if (!convo) {
        convo = await client.conversations.newDm(inboxId);
      }

      if (!convo) {
        return toast.error("Failed to open or create conversation.");
      }

      navigate(`/messages?dm=${convo.id}&recipient=${userAddress}`);
    } catch (err) {
      console.error("Error opening DM:", err);
      if (err.message.includes("InboxValidationFailed")) {
        toast.error("Failed to validate inbox. Please try again.");
      } else {
        toast.error("Something went wrong while opening messages.");
      }
    }
  }, [userAddress]);
  


  useEffect(() => {
    const runCheck = async () => {
      
      await openDm();
    };
    
    runCheck();
  }, [userAddress, isOpen]);

  

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
            <div className="text-center py-8">
              <p className="text-green-600">User is registered on XMTP. Starting conversation...</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DmEligibilityModal;


