import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="bg-card border-b border-border px-4 lg:px-6 py-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps?.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            const isLast = index === steps?.length - 1;

            return (
              <React.Fragment key={step?.id}>
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-standard ${
                    isCompleted 
                      ? 'bg-success border-success text-success-foreground' 
                      : isActive 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : 'bg-background border-border text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <span className="text-sm font-medium">{stepNumber}</span>
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-foreground' : isCompleted ? 'text-success' : 'text-muted-foreground'
                    }`}>
                      {step?.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{step?.description}</p>
                  </div>
                </div>
                {!isLast && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        {/* Mobile step indicator */}
        <div className="sm:hidden mt-3 text-center">
          <p className="text-sm font-medium text-foreground">
            {steps?.[currentStep - 1]?.title}
          </p>
          <p className="text-xs text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;