import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DomainVerificationStep = ({ onNext, formData, setFormData }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const verificationMethods = [
    { value: 'dns', label: 'DNS Record Verification', description: 'Add a TXT record to your DNS' },
    { value: 'blockchain', label: 'Blockchain Verification', description: 'Verify through ENS or blockchain registry' },
    { value: 'file', label: 'File Upload Verification', description: 'Upload a verification file to your domain' }
  ];

  const handleDomainChange = (e) => {
    const domain = e?.target?.value;
    setFormData(prev => ({ ...prev, domain }));
    setVerificationStatus(null);
    setErrors({});
  };

  const handleVerificationMethodChange = (method) => {
    setFormData(prev => ({ ...prev, verificationMethod: method }));
  };

  const handleVerifyDomain = async () => {
    if (!formData?.domain) {
      setErrors({ domain: 'Please enter a domain name' });
      return;
    }

    if (!formData?.verificationMethod) {
      setErrors({ verificationMethod: 'Please select a verification method' });
      return;
    }

    setIsVerifying(true);
    setErrors({});

    // Mock verification process
    setTimeout(() => {
      const isValid = formData?.domain?.includes('.com') || formData?.domain?.includes('.eth');
      setVerificationStatus(isValid ? 'verified' : 'failed');
      setIsVerifying(false);
      
      if (isValid) {
        setFormData(prev => ({ ...prev, isVerified: true }));
      }
    }, 2000);
  };

  const handleNext = () => {
    if (!formData?.isVerified) {
      setErrors({ verification: 'Please verify your domain ownership first' });
      return;
    }
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Verify Domain Ownership</h2>
        <p className="text-muted-foreground">
          Confirm that you own this domain before creating your listing
        </p>
      </div>
      <div className="space-y-6">
        {/* Domain Input */}
        <div>
          <Input
            label="Domain Name"
            type="text"
            placeholder="example.com or example.eth"
            value={formData?.domain || ''}
            onChange={handleDomainChange}
            error={errors?.domain}
            required
            description="Enter the full domain name you want to list for sale"
          />
        </div>

        {/* Verification Method */}
        <div>
          <Select
            label="Verification Method"
            placeholder="Choose verification method"
            options={verificationMethods}
            value={formData?.verificationMethod || ''}
            onChange={handleVerificationMethodChange}
            error={errors?.verificationMethod}
            required
            description="Select how you want to verify domain ownership"
          />
        </div>

        {/* Verification Instructions */}
        {formData?.verificationMethod && (
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium text-foreground mb-2">Verification Instructions</h3>
            {formData?.verificationMethod === 'dns' && (
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Add the following TXT record to your DNS settings:</p>
                <div className="bg-background p-3 rounded border font-mono text-xs">
                  <div>Name: _domainhub-verification</div>
                  <div>Value: dh-verify-{Math.random()?.toString(36)?.substr(2, 9)}</div>
                </div>
                <p>DNS changes may take up to 24 hours to propagate.</p>
              </div>
            )}
            {formData?.verificationMethod === 'blockchain' && (
              <div className="text-sm text-muted-foreground space-y-2">
                <p>For ENS domains, connect your wallet that owns the domain.</p>
                <p>For other blockchain domains, sign a verification message.</p>
              </div>
            )}
            {formData?.verificationMethod === 'file' && (
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Upload this file to your domain's root directory:</p>
                <div className="bg-background p-3 rounded border font-mono text-xs">
                  domainhub-verification.txt
                </div>
                <p>File should be accessible at: {formData?.domain}/domainhub-verification.txt</p>
              </div>
            )}
          </div>
        )}

        {/* Verification Button */}
        <div className="flex justify-center">
          <Button
            variant="default"
            onClick={handleVerifyDomain}
            loading={isVerifying}
            disabled={!formData?.domain || !formData?.verificationMethod}
            iconName="Shield"
            iconPosition="left"
          >
            {isVerifying ? 'Verifying Domain...' : 'Verify Domain'}
          </Button>
        </div>

        {/* Verification Status */}
        {verificationStatus && (
          <div className={`p-4 rounded-lg border ${
            verificationStatus === 'verified' 
              ? 'bg-success/10 border-success text-success' :'bg-error/10 border-error text-error'
          }`}>
            <div className="flex items-center">
              <Icon 
                name={verificationStatus === 'verified' ? 'CheckCircle' : 'XCircle'} 
                size={20} 
                className="mr-2" 
              />
              <div>
                <p className="font-medium">
                  {verificationStatus === 'verified' 
                    ? 'Domain Verified Successfully!' :'Verification Failed'
                  }
                </p>
                <p className="text-sm opacity-80">
                  {verificationStatus === 'verified' 
                    ? 'You can now proceed to create your domain listing.' :'Please check your verification setup and try again.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {errors?.verification && (
          <div className="text-error text-sm text-center">
            {errors?.verification}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-end pt-6 border-t border-border">
          <Button
            variant="default"
            onClick={handleNext}
            disabled={!formData?.isVerified}
            iconName="ArrowRight"
            iconPosition="right"
          >
            Continue to Landing Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DomainVerificationStep;