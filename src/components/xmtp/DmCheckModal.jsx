const DmCheckModal = ({ domain, isOpen }) => {
  if (!isOpen) {
    return null;
  }
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold">XMTP Check</h2>
        </div>
        <div className="p-6">
            <div className="text-center py-8">
              <p className="text-green-600">Checking domain owner XMPTP compatibility</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DmCheckModal;


