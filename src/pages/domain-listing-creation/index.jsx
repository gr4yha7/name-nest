import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProgressIndicator from './components/ProgressIndicator';
import DomainVerificationStep from './components/DomainVerificationStep';
import LandingPageBuilder from './components/LandingPageBuilder';
import SEOOptimizationStep from './components/SEOOptimizationStep';
import PricingConfigurationStep from './components/PricingConfigurationStep';
import ReviewPublishStep from './components/ReviewPublishStep';

const DomainListingCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    domain: '',
    verificationMethod: '',
    isVerified: false,
    landingPageTemplate: '',
    landingPageComponents: [],
    seoData: {
      title: '',
      metaDescription: '',
      keywords: '',
      canonicalUrl: '',
      structuredData: []
    },
    pricing: {
      type: '',
      price: '',
      currency: 'usd',
      paymentMethods: [],
      allowNegotiation: false,
      requireEscrow: false,
      autoAcceptOffers: false
    }
  });

  const steps = [
    {
      id: 1,
      title: 'Domain Verification',
      description: 'Verify ownership'
    },
    {
      id: 2,
      title: 'Landing Page',
      description: 'Build your page'
    },
    {
      id: 3,
      title: 'SEO Setup',
      description: 'Optimize for search'
    },
    {
      id: 4,
      title: 'Pricing',
      description: 'Set your price'
    },
    {
      id: 5,
      title: 'Review',
      description: 'Publish listing'
    }
  ];

  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('domainListingDraft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(parsedDraft);
        // Determine which step to start from based on completed data
        if (parsedDraft?.pricing?.price) {
          setCurrentStep(5);
        } else if (parsedDraft?.seoData?.title) {
          setCurrentStep(4);
        } else if (parsedDraft?.landingPageComponents?.length) {
          setCurrentStep(3);
        } else if (parsedDraft?.isVerified) {
          setCurrentStep(2);
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Auto-save draft to localStorage when formData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData?.domain) {
        localStorage.setItem('domainListingDraft', JSON.stringify(formData));
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const handleNext = () => {
    if (currentStep < steps?.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DomainVerificationStep
            onNext={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <LandingPageBuilder
            onNext={handleNext}
            onPrev={handlePrev}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <SEOOptimizationStep
            onNext={handleNext}
            onPrev={handlePrev}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 4:
        return (
          <PricingConfigurationStep
            onNext={handleNext}
            onPrev={handlePrev}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 5:
        return (
          <ReviewPublishStep
            onPrev={handlePrev}
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Sell Domain', path: '/domain-listing-creation', isLast: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-12">
        {/* Breadcrumb */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
            <Breadcrumb customItems={breadcrumbItems} />
          </div>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={steps?.length}
          steps={steps}
        />

        {/* Step Content */}
        <div className="py-8">
          {renderCurrentStep()}
        </div>
      </main>
      {/* Sticky Save Draft Button for Mobile */}
      {currentStep > 1 && currentStep < 5 && (
        <div className="fixed bottom-4 right-4 lg:hidden z-50">
          <button
            onClick={() => {
              localStorage.setItem('domainListingDraft', JSON.stringify(formData));
              // Show toast notification
              const toast = document.createElement('div');
              toast.className = 'fixed top-4 right-4 bg-success text-success-foreground px-4 py-2 rounded-lg shadow-elevated z-1000';
              toast.textContent = 'Draft saved!';
              document.body?.appendChild(toast);
              setTimeout(() => document.body?.removeChild(toast), 2000);
            }}
            className="bg-primary text-primary-foreground p-3 rounded-full shadow-elevated hover:bg-primary/90 transition-standard"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17,21 17,13 7,13 7,21"/>
              <polyline points="7,3 7,8 15,8"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default DomainListingCreation;